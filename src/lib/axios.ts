import axios from 'axios'

const baseURL = import.meta.env.VITE_API_BASE_URL || 'https://api.beautily.ir/api'

const axiosInstance = axios.create({
  baseURL,
  withCredentials: true,
  withXSRFToken: true,
  timeout: 30000,
  headers: {
    Accept: 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
})

/**
 * Interceptor هوشمند برای:
 * ۱. اضافه کردن توکن احراز هویت
 * ۲. اضافه کردن خودکار v1 به روت‌های مربوطه
 */
axiosInstance.interceptors.request.use((config) => {
  // --- بخش اول: تزریق توکن احراز هویت ---
  const token = localStorage.getItem('auth_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  // --- بخش دوم: مدیریت نسخه API (v1) ---
  const url = config.url || ''

  // کلمه 'frontend' اضافه شد تا مسیر لاگر دچار مشکل نشود
  const bypassUrls = [
    'login',
    'register',
    'logout',
    'sanctum',
    'v1',
    'auth',
    'admin',
    'frontend', // <--- اضافه شده برای لاگر
  ]

  const needsV1 = !bypassUrls.some((path) => url.includes(path))

  if (needsV1) {
    // اصلاح آدرس: حذف اسلش اضافه و تزریق v1
    const cleanUrl = url.startsWith('/') ? url : `/${url}`
    config.url = `/v1${cleanUrl}`
  }

  return config
})

// تابع getCsrf از اینجا حذف شد، زیرا شما از فایل اختصاصی getCsrfCookie.ts استفاده می‌کنید

export default axiosInstance
