<template>
  <div class="flex flex-col md:flex-row w-full font-vazir" dir="rtl">
    <!-- ================= ستون سمت راست: فرم ثبت‌نام ================= -->
    <div class="w-full md:w-1/2 p-4 sm:p-6 md:p-8 flex flex-col justify-center relative z-10">
      <!-- هدر -->
      <Logo class="h-10 sm:h-30 w-auto mb-1 sm:mb-8 drop-shadow-sm" />
      <div class="mb-6 text-right">
        <h2 class="text-2xl font-iransans-black text-brand-dark tracking-tight mb-1.5">
          ایجاد حساب کاربری
        </h2>
        <p class="text-xs font-iransans-medium text-brand-medium">
          برای استفاده از خدمات پلتفرم، اطلاعات خود را وارد کنید.
        </p>
      </div>

      <!-- تب‌های ورود و ثبت‌نام -->
      <div class="flex mb-6 border-b border-brand-neutral/80">
        <router-link
          class="pb-3 px-2 w-1/2 text-center text-sm font-iransans-bold text-brand-medium border-b-2 border-transparent hover:text-brand-dark transition-all duration-300"
          to="/auth/login"
        >
          ورود
        </router-link>
        <div
          class="pb-3 px-2 w-1/2 text-center text-sm font-iransans-bold text-brand-primary border-b-2 border-brand-primary transition-all duration-300"
        >
          ثبت‌نام
        </div>
      </div>

      <!-- تب‌های انتخاب روش ثبت‌نام -->
      <div class="flex gap-2 mb-6">
        <button
          :class="[
            'flex-1 py-2 rounded-xl text-sm font-iransans-bold transition-all duration-300',
            activeTab === 'mobile'
              ? 'bg-brand-primary text-brand-white shadow-md'
              : 'bg-brand-neutral text-brand-medium hover:bg-brand-neutral/80 hover:text-brand-dark',
          ]"
          type="button"
          @click="switchTab('mobile')"
        >
          موبایل
        </button>
        <button
          :class="[
            'flex-1 py-2 rounded-xl text-sm font-iransans-bold transition-all duration-300',
            activeTab === 'email'
              ? 'bg-brand-primary text-brand-white shadow-md'
              : 'bg-brand-neutral text-brand-medium hover:bg-brand-neutral/80 hover:text-brand-dark',
          ]"
          type="button"
          @click="switchTab('email')"
        >
          ایمیل
        </button>
      </div>

      <form class="space-y-4" @submit.prevent="onSubmit">
        <!-- ================= فیلد نام (در صورت عدم ارسال کد) ================= -->
        <div v-show="!otpSent" class="animate-fade-in-up">
          <label class="block mb-1.5 text-xs font-iransans-bold tracking-wide text-brand-dark">
            نام و نام خانوادگی
          </label>
          <input
            v-model="name"
            class="w-full px-4 py-3 text-sm bg-brand-neutral border border-transparent rounded-xl text-brand-dark focus:bg-brand-white focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 transition-all outline-none"
            placeholder="نام شما"
            type="text"
          />
          <span
            v-if="errors.name"
            class="block mt-1.5 text-xs font-iransans-medium text-brand-primary"
          >
            {{ errors.name }}
          </span>
        </div>

        <!-- ================= تب موبایل ================= -->
        <div v-show="activeTab === 'mobile'" class="space-y-4 animate-fade-in-up">
          <div v-show="!otpSent">
            <label class="block mb-1.5 text-xs font-iransans-bold tracking-wide text-brand-dark">
              شماره موبایل
            </label>
            <input
              v-model="mobile"
              class="w-full px-4 py-3 text-sm bg-brand-neutral border border-transparent rounded-xl text-brand-dark focus:bg-brand-white focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 transition-all outline-none"
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
        </div>

        <!-- ================= تب ایمیل ================= -->
        <div v-show="activeTab === 'email'" class="space-y-4 animate-fade-in-up">
          <div v-show="!otpSent">
            <label class="block mb-1.5 text-xs font-iransans-bold tracking-wide text-brand-dark"
              >ایمیل</label
            >
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

          <div v-show="!otpSent" class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block mb-1.5 text-xs font-iransans-bold tracking-wide text-brand-dark"
                >رمز عبور</label
              >
              <div class="relative group">
                <input
                  v-model="password"
                  :type="showPassword ? 'text' : 'password'"
                  class="w-full pl-4 pr-12 py-3 text-sm bg-brand-neutral border border-transparent rounded-xl text-brand-dark outline-none"
                  dir="ltr"
                  placeholder="••••••••"
                />
                <button
                  class="absolute inset-y-0 right-0 flex items-center justify-center w-12 text-brand-medium"
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
                >{{ errors.password }}</span
              >
            </div>

            <div>
              <label class="block mb-1.5 text-xs font-iransans-bold tracking-wide text-brand-dark"
                >تکرار رمز عبور</label
              >
              <div class="relative group">
                <input
                  v-model="password_confirmation"
                  :type="showPasswordConfirm ? 'text' : 'password'"
                  class="w-full pl-4 pr-12 py-3 text-sm bg-brand-neutral border border-transparent rounded-xl text-brand-dark outline-none"
                  dir="ltr"
                  placeholder="••••••••"
                />
                <button
                  class="absolute inset-y-0 right-0 flex items-center justify-center w-12 text-brand-medium"
                  type="button"
                  @click="showPasswordConfirm = !showPasswordConfirm"
                >
                  <EyeIcon v-if="!showPasswordConfirm" class="w-5 h-5" />
                  <EyeSlashIcon v-else class="w-5 h-5" />
                </button>
              </div>
              <span
                v-if="errors.password_confirmation"
                class="block mt-1.5 text-xs font-iransans-medium text-brand-primary"
                >{{ errors.password_confirmation }}</span
              >
            </div>
          </div>
        </div>

        <!-- ================= بخش مشترک ورود کد (موبایل و ایمیل) ================= -->
        <div v-if="otpSent" class="animate-fade-in-up space-y-4">
          <div
            class="p-3 bg-brand-neutral rounded-xl text-center text-sm font-iransans-medium text-brand-dark mb-4"
          >
            کد تایید به
            <span class="font-iransans-bold" dir="ltr">{{
              activeTab === 'mobile' ? mobile : email
            }}</span>
            ارسال شد.
          </div>

          <div>
            <label class="block mb-1.5 text-xs font-iransans-bold tracking-wide text-brand-dark"
              >کد تایید دریافت شده</label
            >
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
              >{{ errors.otpCode }}</span
            >
          </div>

          <div class="mt-3 flex items-center justify-center text-sm">
            <span v-if="countdown > 0" class="font-iransans-medium text-brand-medium">
              ارسال مجدد کد در
              <span class="font-iransans-bold text-brand-dark" dir="ltr">{{ formattedTime }}</span>
            </span>
            <button
              v-else
              class="font-iransans-bold text-brand-primary hover:text-brand-secondary transition-colors"
              type="button"
              @click="submitFirstStep"
            >
              ارسال مجدد کد تایید
            </button>
          </div>
        </div>

        <!-- ================= کپچا (فقط در مرحله اول یا پس از پایان تایمر) ================= -->
        <div v-show="!otpSent || countdown === 0" class="flex flex-col py-1">
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
                class="w-1/2 px-4 py-3 text-center text-sm bg-brand-neutral border border-transparent rounded-xl text-brand-dark outline-none"
                dir="ltr"
                placeholder="کد تصویر"
                type="text"
              />
            </div>
          </div>
        </div>

        <!-- ================= دکمه ارسال ================= -->
        <button
          :disabled="loading"
          class="relative w-full py-3 mt-2 overflow-hidden font-iransans-bold text-brand-white transition-all duration-300 rounded-xl bg-brand-primary hover:bg-opacity-90 active:scale-[0.98] disabled:opacity-50 shadow-[0_8px_20px_-8px_rgba(242,124,154,0.6)]"
          type="submit"
        >
          <span v-if="loading" class="flex items-center justify-center gap-2">
            <!-- Icon Spinner -->
            <svg class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
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
            در حال پردازش...
          </span>
          <span v-else>{{ !otpSent ? 'دریافت کد تایید' : 'تایید نهایی و ورود' }}</span>
        </button>
      </form>
    </div>

    <!-- بخش گرافیکی حفظ شده است... -->
    <div
      class="hidden md:flex w-1/2 bg-brand-accent relative flex-col items-center justify-center overflow-hidden rounded-[2.5rem]"
    >
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
          سفر زیبایی شما از اینجا آغاز می‌شود.
        </h3>
        <p class="text-brand-dark/80 text-sm font-iransans-medium leading-relaxed max-w-sm">
          با عضویت در بیوتیلی، دنیایی از برترین برندهای آرایشی و بهداشتی را کشف کنید. برای ساختن
          تجربه‌ای لوکس و شخصی‌سازی‌شده، هم‌اکنون ثبت‌نام کنید.
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useField, useForm } from 'vee-validate'
import * as yup from 'yup'
import { EyeIcon, EyeSlashIcon } from '@heroicons/vue/24/outline'
import { AxiosError } from 'axios'
import { useAuthStore } from '@/stores/auth'
import { getLocalCaptchaApi, registerApi, sendOtpApi } from '@/api/authApi'
import { useNotificationStore } from '@/stores/notification'
import Logo from '@/components/Logo/BeautyLogo.vue'
import { getPublicSettingApi } from '@/api/settingApi'

const loginBgUrl = ref<string | null>(null)

const fetchLoginBackground = async () => {
  try {
    // فرض بر این است که API شما کلید را می‌گیرد و اطلاعات را برمی‌گرداند
    const response = await getPublicSettingApi('register_bg')
    if (response.data?.image_url) {
      loginBgUrl.value = response.data.image_url
    }
  } catch (error) {
    console.error('Failed to load login background', error)
  }
}

declare global {
  interface Window {
    turnstile: any
  }
}

// تعریف دقیق ساختار فرم برای جلوگیری از خطاهای TypeScript
interface RegisterForm {
  name: string
  mobile: string
  email: string
  password: string
  password_confirmation: string
  otpCode: string
  captchaCode: string
  activeTab: 'mobile' | 'email'
  otpSent: boolean
}

const authStore = useAuthStore()
const notify = useNotificationStore()

const loading = ref(false)
const showPassword = ref(false)
const showPasswordConfirm = ref(false)
const activeTab = ref<'mobile' | 'email'>('mobile')
const otpSent = ref(false)

const countdown = ref(0)
let timerInterval: ReturnType<typeof setInterval> | null = null
let turnstileTimer: ReturnType<typeof setTimeout> | null = null

const formattedTime = computed(() => {
  const m = Math.floor(countdown.value / 60)
    .toString()
    .padStart(2, '0')
  const s = (countdown.value % 60).toString().padStart(2, '0')
  return `${m}:${s}`
})

const captchaMode = ref<'turnstile' | 'local'>('turnstile')
const turnstileToken = ref('')
const localCaptchaImage = ref('')
const localCaptchaKey = ref('')
const turnstileSiteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY || '1x00000000000000000000AA'

// اسکیما اعتبارسنجی
const schema = yup.object({
  name: yup.string().when('otpSent', {
    is: false,
    then: (schema) => schema.required('نام الزامی است').min(3).max(50),
    otherwise: (schema) => schema.nullable(),
  }),
  mobile: yup.string().when(['activeTab', 'otpSent'], {
    is: (tab: string, sent: boolean) => tab === 'mobile' && !sent,
    then: (schema) =>
      schema.required('موبایل الزامی است').matches(/^09\d{9}$/, 'موبایل نامعتبر است'),
    otherwise: (schema) => schema.nullable(),
  }),
  email: yup.string().when(['activeTab', 'otpSent'], {
    is: (tab: string, sent: boolean) => tab === 'email' && !sent,
    then: (schema) => schema.required('ایمیل الزامی است').email('فرمت ایمیل نامعتبر است'),
    otherwise: (schema) => schema.nullable(),
  }),
  password: yup.string().when(['activeTab', 'otpSent'], {
    is: (tab: string, sent: boolean) => tab === 'email' && !sent,
    then: (schema) => schema.required('رمز عبور الزامی است').min(8),
    otherwise: (schema) => schema.nullable(),
  }),
  password_confirmation: yup.string().when(['activeTab', 'otpSent'], {
    is: (tab: string, sent: boolean) => tab === 'email' && !sent,
    then: (schema) =>
      schema.required('تکرار رمز الزامی است').oneOf([yup.ref('password')], 'رمزها یکسان نیستند'),
    otherwise: (schema) => schema.nullable(),
  }),
  otpCode: yup.string().when('otpSent', {
    is: true,
    then: (schema) => schema.required('کد تایید الزامی است').length(6, 'کد باید ۶ رقم باشد'),
    otherwise: (schema) => schema.nullable(),
  }),
})

// مقداردهی اولیه تمام فیلدها برای حل مشکل Property does not exist
const { handleSubmit, errors, setFieldValue, setErrors, resetForm } = useForm<RegisterForm>({
  validationSchema: schema,
  initialValues: {
    name: '',
    mobile: '',
    email: '',
    password: '',
    password_confirmation: '',
    otpCode: '',
    captchaCode: '',
    activeTab: 'mobile',
    otpSent: false,
  },
})

const { value: name } = useField<string>('name')
const { value: mobile } = useField<string>('mobile')
const { value: email } = useField<string>('email')
const { value: password } = useField<string>('password')
const { value: password_confirmation } = useField<string>('password_confirmation')
const { value: otpCode } = useField<string>('otpCode')
const { value: captchaCode } = useField<string>('captchaCode')
const { value: otpSentField } = useField<boolean>('otpSent')

watch(otpSent, (val) => {
  otpSentField.value = val
})

const switchTab = (tab: 'mobile' | 'email') => {
  activeTab.value = tab
  otpSent.value = false
  clearInterval(timerInterval!)
  countdown.value = 0
  setFieldValue('activeTab', tab)
  setErrors({}) // پاک کردن خطاهای قبلی موقع تغییر تب
  refreshCaptcha()
}

// ================= منطق کپچا =================
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

const renderTurnstile = () => {
  if (window.turnstile) {
    window.turnstile.render('#turnstile-container', {
      sitekey: turnstileSiteKey,
      callback: (token: string) => {
        turnstileToken.value = token
      },
      'error-callback': () => {
        notify.error('خطا در بارگذاری کپچا')
        loadLocalCaptcha() // سوییچ خودکار به لوکال در صورت قطعی
      },
    })
  }
}

const refreshCaptcha = () => {
  captchaCode.value = ''
  if (captchaMode.value === 'local') {
    loadLocalCaptcha()
  } else if (captchaMode.value === 'turnstile' && window.turnstile) {
    window.turnstile.reset()
    turnstileToken.value = ''
  }
}

const validateCaptcha = () => {
  if (countdown.value > 0 && otpSent.value) return true // در زمان تایمر کپچا نیاز نیست
  if (captchaMode.value === 'turnstile' && !turnstileToken.value) {
    notify.error('لطفا کادر امنیتی را تایید کنید')
    return false
  }
  if (captchaMode.value === 'local' && !captchaCode.value) {
    notify.error('لطفا کد امنیتی تصویر را وارد کنید')
    return false
  }
  return true
}

const getCaptchaPayload = () =>
  captchaMode.value === 'turnstile'
    ? { 'cf-turnstile-response': turnstileToken.value } // <--- اصلاح نام کلید
    : {
        captcha_code: captchaCode.value,
        captcha_key: localCaptchaKey.value, // <--- ارسال کلید همراه با کد
      }

// ================= منطق تایمر و فرم =================
const startTimer = () => {
  countdown.value = 120
  if (timerInterval) clearInterval(timerInterval)

  timerInterval = setInterval(() => {
    if (countdown.value > 0) {
      countdown.value--
    } else {
      clearInterval(timerInterval!)
      otpCode.value = ''
      refreshCaptcha()
    }
  }, 1000)
}

const submitFirstStep = async (values: any) => {
  if (!validateCaptcha()) return
  loading.value = true

  try {
    if (activeTab.value === 'mobile') {
      await sendOtpApi({ identifier: mobile.value, ...getCaptchaPayload() })
    } else {
      // استفاده یکپارچه از API ثبت‌نام (جلوگیری از خطای 404)
      await registerApi({
        name: name.value,
        email: email.value,
        password: password.value,
        password_confirmation: password_confirmation.value,
        ...getCaptchaPayload(),
      })
    }

    otpSent.value = true
    startTimer()
    notify.success('کد تایید ارسال شد.')
  } catch (e: any) {
    handleError(e)
  } finally {
    loading.value = false
  }
}

const submitSecondStep = async () => {
  loading.value = true
  try {
    if (activeTab.value === 'mobile') {
      await authStore.verifyOtpLogin({
        name: name.value,
        identifier: mobile.value,
        code: otpCode.value,
      })
    } else {
      // استفاده یکپارچه از متد جدید استور (جلوگیری از خطای setAuth)
      await authStore.verifyEmailLogin({
        email: email.value,
        code: otpCode.value,
      })
    }
    notify.success('ثبت‌نام با موفقیت تایید شد.')
  } catch (e: any) {
    handleError(e)
  } finally {
    loading.value = false
  }
}

const onSubmit = handleSubmit(async (values) => {
  if (!otpSent.value) {
    await submitFirstStep(values)
  } else {
    await submitSecondStep()
  }
})

const handleError = (e: any) => {
  if (e instanceof AxiosError && e.response?.status === 422) {
    if (e.response.data.errors) setErrors(e.response.data.errors)
    notify.error(e.response.data.message || 'اطلاعات معتبر نیست')
  } else {
    notify.error(e.response?.data?.message || 'خطا در ارتباط با سرور')
  }
  if (!otpSent.value || countdown.value === 0) refreshCaptcha()
}

// ================= هوک‌ها =================
onMounted(() => {
  fetchLoginBackground()

  turnstileTimer = setTimeout(() => {
    if (captchaMode.value === 'turnstile') {
      if (window.turnstile) {
        window.turnstile.render('#turnstile-container', {
          sitekey: turnstileSiteKey,
          callback: (token: string) => {
            turnstileToken.value = token
          },
          'error-callback': () => {
            notify.error('خطا در بارگذاری کپچا')
            loadLocalCaptcha() // سوییچ خودکار به لوکال در صورت قطعی
          },
        })
      } else {
        loadLocalCaptcha()
      }
    } else {
      loadLocalCaptcha()
    }
  }, 500)
})

onBeforeUnmount(() => {
  if (timerInterval) clearInterval(timerInterval)
  if (turnstileTimer) clearTimeout(turnstileTimer)
})
</script>
