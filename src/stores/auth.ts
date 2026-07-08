import { defineStore } from 'pinia'
import { ref } from 'vue'
import axiosInstance from '@/lib/axios'
import router from '@/router'
import { AdminLoginPayload, registerApi, RegisterPayload, VerifyOtpPayload } from '@/api/authApi'

let interceptorAttached = false
let autoRefreshTimer: number | null = null

export const useAuthStore = defineStore('auth', () => {
  /* =====================
     State
  ===================== */
  const user = ref<Record<string, any> | null>(null)
  const token = ref<string | null>(localStorage.getItem('auth_token'))
  const loading = ref(false)
  const error = ref<string | null>(null)
  const lastFetch = ref(0)

  /* =====================
     Getters
  ===================== */
  const isAuthenticated = () => !!user.value
  const isAdmin = () => user.value?.role === 'admin' // بر اساس فیلد دیتابیس

  /* =====================
     تنظیم هدر توکن
  ===================== */
  function setAuthToken(newToken: string | null) {
    if (newToken) {
      token.value = newToken
      localStorage.setItem('auth_token', newToken)
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${newToken}`
    } else {
      token.value = null
      localStorage.removeItem('auth_token')
      delete axiosInstance.defaults.headers.common['Authorization']
    }
  }

  /* =====================
     Auth - ورود با رمز عبور
  ===================== */
  async function adminLogin(payload: AdminLoginPayload) {
    loading.value = true
    error.value = null

    try {
      // استفاده از مسیر جدید یکپارچه
      const response = await axiosInstance.post('/v1/auth/login', payload)

      // ذخیره توکن دریافتی از بک‌اند
      if (response.data.token) {
        setAuthToken(response.data.token)
      }

      await fetchUser(true)
      localStorage.setItem('loggedIn', 'true')
      redirectAfterAuth()
    } catch (e: any) {
      error.value = e.response?.data?.message || 'خطا در ورود'
      throw e
    } finally {
      loading.value = false
    }
  }

  /* =====================
     Auth - تایید کد OTP
  ===================== */
  async function verifyOtpLogin(payload: VerifyOtpPayload) {
    loading.value = true
    error.value = null

    try {
      // استفاده از مسیر جدید یکپارچه
      const response = await axiosInstance.post('/v1/auth/otp/verify', payload)

      // ذخیره توکن دریافتی از کنترلر Otp
      if (response.data.token) {
        setAuthToken(response.data.token)
      }

      user.value = response.data.user // در صورت بازگشت مستقیم کاربر از بک‌اند
      await fetchUser(true)

      localStorage.setItem('loggedIn', 'true')
      redirectAfterAuth()
    } catch (e: any) {
      error.value = e.response?.data?.message || 'کد نامعتبر است'
      throw e
    } finally {
      loading.value = false
    }
  }

  /* =====================
     User
  ===================== */
  async function fetchUser(force = false) {
    const now = Date.now()
    if (!force && now - lastFetch.value < 1000) return user.value
    lastFetch.value = now

    // اگر توکن داریم ولی در axios ست نشده، ست کنیم
    if (token.value && !axiosInstance.defaults.headers.common['Authorization']) {
      setAuthToken(token.value)
    }

    try {
      // فراخوانی روت یوزر از گروه v1
      const { data } = await axiosInstance.get('/v1/user')
      user.value = data
      return data
    } catch {
      user.value = null
      setAuthToken(null)
      return null
    }
  }

  async function restoreSession() {
    if (!localStorage.getItem('loggedIn') && !localStorage.getItem('auth_token')) {
      user.value = null
      return
    }
    await fetchUser(true)
  }

  /* =====================
     Redirect
  ===================== */
  function redirectAfterAuth() {
    if (!user.value) return
    // هدایت دقیق بر اساس نقش تعیین شده در بک‌اند
    router.push(user.value.role === 'admin' ? '/admin/dashboard' : '/user/dashboard')
  }

  /* =====================
     Logout
  ===================== */
  async function logout() {
    try {
      // استفاده از مسیر جدید یکپارچه خروج
      await axiosInstance.post('/v1/auth/logout')
    } catch {}

    user.value = null
    setAuthToken(null)
    localStorage.removeItem('loggedIn')
    localStorage.setItem('logout-event', Date.now().toString())
    localStorage.removeItem('logout-event')

    router.push('/auth/login')
  }

  /* =====================
     Sync & Security
  ===================== */
  function initAuthSync() {
    window.addEventListener('storage', (e) => {
      if (e.key === 'logout-event') {
        user.value = null
        setAuthToken(null)
        router.push('/auth/login')
      }
    })
  }

  function watchSessionExpiration() {
    if (interceptorAttached) return
    interceptorAttached = true

    axiosInstance.interceptors.response.use(
      (r) => r,
      (e) => {
        if (e.response?.status === 401) {
          user.value = null
          setAuthToken(null)
          localStorage.removeItem('loggedIn')
          router.push('/auth/login')
        }
        return Promise.reject(e)
      },
    )
  }
  async function verifyEmailLogin(payload: { email: string; code: string }) {
    loading.value = true
    error.value = null

    try {
      const response = await axiosInstance.post('/v1/auth/register/verify', payload)

      if (response.data.token) {
        setAuthToken(response.data.token)
      }

      user.value = response.data.user
      await fetchUser(true)

      localStorage.setItem('loggedIn', 'true')
      redirectAfterAuth()
    } catch (e: any) {
      error.value = e.response?.data?.message || 'کد نامعتبر است'
      throw e
    } finally {
      loading.value = false
    }
  }
  async function register(payload: RegisterPayload) {
    loading.value = true
    error.value = null

    try {
      const response = await registerApi(payload)
      // ثبت‌نام ایمیلی نیاز به تایید دارد، توکن لاگین اینجا ست نمی‌شود (مگر اینکه تایید شده باشد)
      return response.data
    } catch (e: any) {
      error.value = e.response?.data?.message || 'خطا در ثبت‌نام'
      throw e
    } finally {
      loading.value = false
    }
  }
  function autoRefreshSession() {
    if (autoRefreshTimer) return
    autoRefreshTimer = window.setInterval(() => {
      if (localStorage.getItem('loggedIn')) fetchUser()
    }, 180_000)
  }

  return {
    user,
    token,
    loading,
    error,
    register,
    isAuthenticated,
    isAdmin,
    adminLogin,
    verifyEmailLogin,
    verifyOtpLogin,
    restoreSession,
    logout,
    initAuthSync,
    watchSessionExpiration,
    autoRefreshSession,
  }
})
