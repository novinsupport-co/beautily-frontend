<template>
  <div class="flex flex-col md:flex-row w-full font-vazir" dir="rtl">
    <!-- ================= ستون سمت راست: فرم لاگین ================= -->
    <div class="w-full md:w-1/2 p-4 sm:p-6 md:p-8 flex flex-col justify-center relative z-10">
      <!-- هدر لاگین -->
      <Logo class="h-10 sm:h-30 w-auto mb-1 sm:mb-8 drop-shadow-sm" />
      <div class="mb-6 text-right">
        <h2 class="text-2xl font-iransans-black text-brand-dark tracking-tight mb-1.5">
          ورود به سیستم
        </h2>
        <p class="text-xs font-iransans-medium text-brand-medium">
          برای دسترسی به حساب کاربری، اطلاعات خود را وارد کنید.
        </p>
      </div>

      <!-- تب‌های عرضی -->
      <div class="flex mb-6 border-b border-brand-neutral/80">
        <button
          :class="[
            'pb-3 px-2 w-1/2 text-sm font-vazir transition-all duration-300',
            activeTab === 'email'
              ? 'text-brand-primary border-b-2 border-brand-primary'
              : 'text-brand-medium border-b-2 border-transparent hover:text-brand-dark',
          ]"
          type="button"
          @click="switchTab('email')"
        >
          با ایمیل / رمز
        </button>
        <button
          :class="[
            'pb-3 px-2 w-1/2 text-sm font-iransans-bold transition-all duration-300',
            activeTab === 'mobile'
              ? 'text-brand-primary border-b-2 border-brand-primary'
              : 'text-brand-medium border-b-2 border-transparent hover:text-brand-dark',
          ]"
          type="button"
          @click="switchTab('mobile')"
        >
          با موبایل / پیامک
        </button>
      </div>

      <form class="space-y-4" @submit.prevent="onSubmit">
        <!-- ================= تب ایمیل ================= -->
        <div v-show="activeTab === 'email'" class="space-y-4 animate-fade-in-up">
          <div>
            <label class="block mb-1.5 text-xs font-iransans-bold tracking-wide text-brand-dark">
              ایمیل
            </label>
            <input
              v-model="email"
              class="w-full px-4 py-3 text-sm bg-brand-neutral border border-transparent rounded-xl text-brand-dark focus:bg-brand-white focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 transition-all outline-none"
              dir="ltr"
              placeholder="hello@beautily.ir"
              type="email"
            />
            <span
              v-if="errors.email"
              class="block mt-1.5 text-xs font-iransans-medium text-brand-primary"
            >
              {{ errors.email }}
            </span>
          </div>

          <div>
            <div class="flex items-center justify-between mb-1.5">
              <label class="block text-xs font-iransans-bold tracking-wide text-brand-dark">
                رمز عبور
              </label>
              <router-link
                class="text-xs font-iransans-bold text-brand-primary hover:text-brand-secondary transition-colors"
                to="/auth/forgot-password"
              >
                فراموشی رمز؟
              </router-link>
            </div>
            <div class="relative group">
              <input
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                class="w-full pl-4 pr-12 py-3 text-sm bg-brand-neutral border border-transparent rounded-xl text-brand-dark focus:bg-brand-white focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 transition-all outline-none"
                dir="ltr"
                placeholder="••••••••"
              />
              <button
                class="absolute inset-y-0 right-0 flex items-center justify-center w-12 text-brand-medium hover:text-brand-dark transition-colors"
                type="button"
                @click="showPassword = !showPassword"
              >
                <EyeIcon v-if="!showPassword" class="w-5 h-5" />
                <EyeSlashIcon v-else class="w-5 h-5" />
              </button>
            </div>
            <span
              v-if="errors.password"
              class="block mt-1.5 text-xs font-iransans-medium text-brand-primary"
            >
              {{ errors.password }}
            </span>
          </div>
        </div>

        <!-- ================= تب موبایل ================= -->
        <div v-show="activeTab === 'mobile'" class="space-y-4 animate-fade-in-up">
          <div>
            <label class="block mb-1.5 text-xs font-iransans-bold tracking-wide text-brand-dark">
              شماره موبایل
            </label>
            <input
              v-model="mobile"
              :disabled="otpSent && countdown > 0"
              class="w-full px-4 py-3 text-sm bg-brand-neutral border border-transparent rounded-xl text-brand-dark focus:bg-brand-white focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 transition-all outline-none disabled:opacity-60"
              dir="ltr"
              placeholder="0912 345 6789"
              type="tel"
            />
            <span
              v-if="errors.mobile"
              class="block mt-1.5 text-xs font-iransans-medium text-brand-primary"
            >
              {{ errors.mobile }}
            </span>
          </div>

          <div v-if="otpSent" class="animate-fade-in-up">
            <label class="block mb-1.5 text-xs font-iransans-bold tracking-wide text-brand-dark">
              کد یکبار مصرف
            </label>
            <input
              v-model="otpCode"
              class="w-full px-4 py-3 text-center text-lg tracking-[0.5em] font-iransans-bold bg-brand-neutral border border-transparent rounded-xl text-brand-dark focus:bg-brand-white focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 transition-all outline-none"
              dir="ltr"
              maxlength="6"
              placeholder="------"
              type="text"
            />
            <span
              v-if="errors.otpCode"
              class="block mt-1.5 text-xs font-iransans-medium text-brand-primary"
            >
              {{ errors.otpCode }}
            </span>

            <!-- تایمر و دکمه ارسال مجدد -->
            <div class="mt-3 flex items-center justify-center text-sm">
              <span v-if="countdown > 0" class="font-iransans-medium text-brand-medium">
                ارسال مجدد کد در
                <span class="font-iransans-bold text-brand-dark" dir="ltr">{{
                  formattedTime
                }}</span>
              </span>
              <button
                v-else
                class="font-iransans-bold text-brand-primary hover:text-brand-secondary transition-colors"
                type="button"
                @click="sendOtp"
              >
                ارسال مجدد کد تایید
              </button>
            </div>
          </div>

          <!-- دکمه ارسال کد (فقط بار اول نشان داده می‌شود) -->
          <button
            v-if="!otpSent"
            :disabled="isSendingOtp || !mobile"
            class="w-full py-3 text-sm font-iransans-bold text-brand-dark bg-brand-accent/50 rounded-xl hover:bg-brand-accent transition-colors disabled:opacity-50"
            type="button"
            @click="sendOtp"
          >
            <span v-if="isSendingOtp">در حال ارسال...</span>
            <span v-else>ارسال کد تایید</span>
          </button>
        </div>

        <!-- ================= کپچا (مخفی شدن هوشمند) ================= -->
        <!-- کپچا در تب ایمیل همیشه نشان داده می‌شود -->
        <!-- کپچا در تب موبایل اگر OTP ارسال نشده باشد، یا اگر ارسال شده اما تایمر صفر شده باشد نشان داده می‌شود -->
        <div
          v-show="
            activeTab === 'email' || (activeTab === 'mobile' && (!otpSent || countdown === 0))
          "
          class="flex flex-col py-1"
        >
          <div
            v-show="captchaMode === 'turnstile'"
            id="turnstile-container"
            class="min-h-[65px] flex justify-center"
          ></div>

          <div v-if="captchaMode === 'local'" class="w-full">
            <div class="flex items-center justify-between mb-1.5">
              <span class="text-xs font-iransans-bold text-brand-medium">کد امنیتی</span>
              <button
                class="text-xs font-iransans-bold text-brand-primary hover:text-brand-secondary transition-colors"
                type="button"
                @click="loadLocalCaptcha"
              >
                تغییر تصویر
              </button>
            </div>
            <div class="flex gap-4">
              <div
                class="w-1/2 h-12 bg-brand-white border border-brand-neutral rounded-xl overflow-hidden flex items-center justify-center"
                v-html="localCaptchaImage"
              ></div>
              <input
                v-model="captchaCode"
                class="w-1/2 px-4 py-3 text-center text-sm bg-brand-neutral border border-transparent rounded-xl text-brand-dark focus:bg-brand-white focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 transition-all outline-none"
                dir="ltr"
                placeholder="کد تصویر"
                type="text"
              />
            </div>
          </div>
        </div>

        <!-- ================= دکمه ارسال نهایی ================= -->
        <button
          :disabled="authStore.loading || (activeTab === 'mobile' && !otpSent)"
          class="relative w-full py-3 mt-2 overflow-hidden font-iransans-bold text-brand-white transition-all duration-300 rounded-xl bg-brand-primary hover:bg-opacity-90 active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100 shadow-[0_8px_20px_-8px_rgba(242,124,154,0.6)]"
          type="submit"
        >
          <span v-if="authStore.loading" class="flex items-center justify-center gap-2">
            <svg
              class="w-5 h-5 animate-spin"
              fill="none"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                class="opacity-75"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                fill="currentColor"
              ></path>
            </svg>
            کمی صبر کنید...
          </span>
          <span v-else>ورود به حساب</span>
        </button>
      </form>

      <div class="mt-6 text-sm font-iransans-medium text-center text-brand-medium">
        حساب کاربری ندارید؟
        <router-link
          class="font-iransans-bold text-brand-dark hover:text-brand-primary transition-colors"
          to="/auth/register"
        >
          ثبت نام کنید
        </router-link>
      </div>
    </div>

    <!-- ================= ستون سمت چپ ================= -->
    <div
      class="hidden md:flex w-1/2 bg-brand-accent relative flex-col items-center justify-center overflow-hidden rounded-[2.5rem]"
    >
      <div
        class="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-brand-primary to-transparent"
      ></div>
      <div class="relative z-10 text-center p-10 flex flex-col items-center w-full">
        <!-- بخش نمایش تصویر لاگین -->
        <div
          v-if="loginBgUrl"
          class="mb-8 w-full max-w-xs aspect-video sm:aspect-square relative flex justify-center"
        >
          <img
            :src="loginBgUrl"
            alt="خوش آمدید"
            class="object-contain w-full h-full drop-shadow-xl animate-fade-in-up"
          />
        </div>

        <h3 class="text-2xl font-iransans-black text-brand-dark mb-3">
          به دنیای بیوتیلی خوش آمدید!
        </h3>
        <p class="text-brand-dark/80 text-sm font-iransans-medium leading-relaxed max-w-sm">
          کشف زیبایی واقعی از اینجا آغاز می‌شود. وارد حساب کاربری خود شوید تا به مجموعه‌ای بی‌نظیر
          از بهترین محصولات آرایشی و مراقبتی دسترسی پیدا کنید و خریدی مطمئن و متفاوت را تجربه کنید.
        </p>
      </div>

      <div
        class="absolute top-[-10%] right-[-10%] w-64 h-64 bg-brand-secondary/30 rounded-full blur-[60px]"
      ></div>
      <div
        class="absolute bottom-[-10%] left-[-10%] w-64 h-64 bg-brand-primary/20 rounded-full blur-[60px]"
      ></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useField, useForm } from 'vee-validate'
import * as yup from 'yup'
import { EyeIcon, EyeSlashIcon } from '@heroicons/vue/24/outline'
import { AxiosError } from 'axios'
import { useAuthStore } from '@/stores/auth'
import { getLocalCaptchaApi, sendOtpApi } from '@/api/authApi'
import { useNotificationStore } from '@/stores/notification'
import Logo from '@/components/Logo/BeautyLogo.vue'
// تابع دریافت تصویر (مسیر API را بر اساس ساختار پروژه خود اصلاح کنید)
import { getPublicSettingApi } from '@/api/settingApi' // فرض بر وجود این تابع

// اضافه کردن متغیر برای ذخیره آدرس تصویر
const loginBgUrl = ref<string | null>(null)

const fetchLoginBackground = async () => {
  try {
    // فرض بر این است که API شما کلید را می‌گیرد و اطلاعات را برمی‌گرداند
    const response = await getPublicSettingApi('login_bg')
    if (response.data?.image_url) {
      loginBgUrl.value = response.data.image_url
    }
  } catch (error) {
    console.error('Failed to load login background', error)
  }
}

// در onMounted این تابع را فراخوانی کنید
onMounted(() => {
  fetchLoginBackground()
  // ... سایر کدهای onMounted شما (لود کپچا و غیره)
})

declare global {
  interface Window {
    turnstile: any
  }
}

interface LoginFormValues {
  activeTab: 'email' | 'mobile'
  email?: string
  password?: string
  mobile?: string
  otpCode?: string
  captchaCode?: string
}

const authStore = useAuthStore()
const notify = useNotificationStore()

const activeTab = ref<'email' | 'mobile'>('email')
const showPassword = ref(false)
const otpSent = ref(false)
const isSendingOtp = ref(false)

// متغیرهای مربوط به تایمر
const countdown = ref(0)
let timerInterval: ReturnType<typeof setInterval> | null = null

// محاسبه‌گر نمایش زمان (مثلاً 01:45)
const formattedTime = computed(() => {
  const minutes = Math.floor(countdown.value / 60)
    .toString()
    .padStart(2, '0')
  const seconds = (countdown.value % 60).toString().padStart(2, '0')
  return `${minutes}:${seconds}`
})

const captchaMode = ref<'turnstile' | 'local'>('turnstile')
const turnstileToken = ref('')
const localCaptchaImage = ref('')
const localCaptchaKey = ref('')
const turnstileSiteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY || '1x00000000000000000000AA'

const schema = yup.object({
  email: yup.string().when('activeTab', {
    is: 'email',
    then: (schema) => schema.required('ایمیل الزامی است').email('فرمت ایمیل نامعتبر است'),
    otherwise: (schema) => schema.nullable(),
  }),
  password: yup.string().when('activeTab', {
    is: 'email',
    then: (schema) => schema.required('رمز عبور الزامی است'),
    otherwise: (schema) => schema.nullable(),
  }),
  mobile: yup.string().when('activeTab', {
    is: 'mobile',
    then: (schema) =>
      schema.required('موبایل الزامی است').matches(/^09\d{9}$/, 'شماره موبایل نامعتبر است'),
    otherwise: (schema) => schema.nullable(),
  }),
  otpCode: yup.string().when('activeTab', {
    is: 'mobile',
    then: (schema) => schema.required('کد تایید الزامی است').length(6, 'کد باید ۶ رقم باشد'),
    otherwise: (schema) => schema.nullable(),
  }),
})

const { handleSubmit, errors, setFieldValue, resetForm, setErrors } = useForm<LoginFormValues>({
  validationSchema: schema,
  initialValues: {
    activeTab: 'email',
    email: '',
    password: '',
    mobile: '',
    otpCode: '',
    captchaCode: '',
  },
})

const { value: email } = useField<string>('email')
const { value: password } = useField<string>('password')
const { value: mobile } = useField<string>('mobile')
const { value: otpCode } = useField<string>('otpCode')
const { value: captchaCode } = useField<string>('captchaCode')

const switchTab = (tab: 'email' | 'mobile') => {
  activeTab.value = tab
  setFieldValue('activeTab', tab)
  // نکته مهم: در اینجا نباید resetForm اجرا شود تا در صورت جابجایی تب‌ها، تایمر و اطلاعات از بین نرود.
}

const validateCaptcha = () => {
  if (captchaMode.value === 'turnstile' && !turnstileToken.value) {
    notify.error('لطفا کپچا را تایید کنید')
    return false
  }
  if (captchaMode.value === 'local' && !captchaCode.value) {
    notify.error('لطفا کد امنیتی تصویر را وارد کنید')
    return false
  }
  return true
}

const getCaptchaPayload = () => {
  return captchaMode.value === 'turnstile'
    ? { 'cf-turnstile-response': turnstileToken.value } // <--- اصلاح نام کلید
    : {
        captcha_code: captchaCode.value,
        captcha_key: localCaptchaKey.value, // <--- ارسال کلید همراه با کد
      }
}

const refreshCaptcha = () => {
  if (captchaMode.value === 'local') loadLocalCaptcha()
  if (captchaMode.value === 'turnstile' && window.turnstile) {
    window.turnstile.reset()
    turnstileToken.value = ''
  }
}

// تابع شروع تایمر
const startTimer = () => {
  countdown.value = 120 // زمان به ثانیه (۲ دقیقه)
  if (timerInterval) clearInterval(timerInterval)

  timerInterval = setInterval(() => {
    if (countdown.value > 0) {
      countdown.value--
    } else {
      if (timerInterval) clearInterval(timerInterval)
      // وقتی تایمر صفر شد برای دریافت مجدد کد کپچا را رفرش میکنیم
      refreshCaptcha()
    }
  }, 1000)
}

const sendOtp = async () => {
  if (!mobile.value || !/^09\d{9}$/.test(mobile.value)) {
    notify.error('لطفا شماره موبایل معتبر وارد کنید')
    return
  }

  // اگر تایمر در حال اجراست اجازه ارسال مجدد نمی‌دهد
  if (countdown.value > 0) {
    return
  }

  if (!validateCaptcha()) return

  isSendingOtp.value = true
  try {
    const payload = {
      identifier: mobile.value,
      ...getCaptchaPayload(),
    }

    await sendOtpApi(payload)
    otpSent.value = true
    startTimer() // استارت تایمر بعد از ارسال موفق
    notify.success('کد تایید با موفقیت ارسال شد')
  } catch (error: any) {
    notify.error(error.response?.data?.message || 'خطا در ارسال کد تایید')
    refreshCaptcha()
  } finally {
    isSendingOtp.value = false
  }
}

const onSubmit = handleSubmit(async (values) => {
  try {
    if (activeTab.value === 'email') {
      if (!validateCaptcha()) return

      const payload = {
        email: values.email as string,
        password: values.password as string,
        ...getCaptchaPayload(),
      }
      await authStore.adminLogin(payload)
    } else {
      const payload = {
        identifier: values.mobile as string,
        code: values.otpCode as string,
      }
      await authStore.verifyOtpLogin(payload)
    }

    notify.success('با موفقیت وارد سیستم شدید')
  } catch (e: any) {
    if (e instanceof AxiosError && e.response?.status === 422) {
      const serverErrors = e.response.data.errors
      if (serverErrors) {
        setErrors(serverErrors)
      }
      notify.error(e.response.data.message || 'اطلاعات وارد شده صحیح نیست')
    } else {
      notify.error(e.response?.data?.message || 'خطا در ارتباط با سرور یا اطلاعات نامعتبر است')
    }

    if (activeTab.value === 'email') refreshCaptcha()
  }
})

const loadLocalCaptcha = async () => {
  captchaMode.value = 'local'
  try {
    const response = await getLocalCaptchaApi()
    // اصلاح شد: هر دو از یک سطح خوانده می‌شوند
    localCaptchaImage.value = response.data.img
    localCaptchaKey.value = response.data.key
  } catch (error) {
    console.error('Local captcha failed to load', error)
  }
}

let turnstileTimer: any = null

onMounted(() => {
  const script = document.createElement('script')
  script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
  script.async = true
  script.defer = true
  script.onerror = () => loadLocalCaptcha()

  script.onload = () => {
    if (window.turnstile) {
      window.turnstile.render('#turnstile-container', {
        sitekey: turnstileSiteKey,
        callback: (token: string) => {
          turnstileToken.value = token
          clearTimeout(turnstileTimer)
        },
        'error-callback': () => loadLocalCaptcha(),
      })
    }
  }
  document.head.appendChild(script)

  turnstileTimer = setTimeout(() => {
    if (captchaMode.value === 'turnstile' && !turnstileToken.value) {
      loadLocalCaptcha()
    }
  }, 8000)
})

onBeforeUnmount(() => {
  // پاکسازی تایمرها هنگام خروج از صفحه برای جلوگیری از نشت حافظه (Memory Leak)
  if (timerInterval) clearInterval(timerInterval)
  if (turnstileTimer) clearTimeout(turnstileTimer)
})
</script>
