<template>
  <div class="flex flex-col md:flex-row w-full font-vazir" dir="rtl">
    <!-- ================= ستون سمت راست: فرم بازیابی ================= -->
    <div
      class="w-full md:w-1/2 p-4 sm:p-6 md:p-8 flex flex-col justify-center relative z-10 bg-white"
    >
      <!-- هدر -->
      <Logo class="h-10 sm:h-30 w-auto mb-1 sm:mb-8 drop-shadow-sm" />
      <div class="mb-6 text-right">
        <h2 class="text-2xl font-iransans-bold text-brand-dark tracking-tight mb-1.5">
          بازیابی رمز عبور
        </h2>
        <p class="text-xs font-vazir-medium text-brand-medium">
          {{ stepDescription }}
        </p>
      </div>

      <!-- ================= مرحله 1: دریافت موبایل یا ایمیل ================= -->
      <form
        v-if="currentStep === 1"
        class="space-y-4 animate-fade-in-up"
        @submit.prevent="requestReset"
      >
        <div>
          <label
            class="block mb-1.5 text-xs font-iransans-bold tracking-wide text-brand-dark"
            for="identifier"
          >
            ایمیل یا شماره موبایل
          </label>
          <input
            id="identifier"
            v-model="form.identifier"
            :class="{
              'border-red-400 focus:border-red-500 focus:ring-red-500/10': errors.identifier,
            }"
            class="w-full px-4 py-3 text-sm bg-brand-neutral border border-transparent rounded-xl text-brand-dark focus:bg-brand-white focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 transition-all outline-none"
            dir="ltr"
            placeholder="0912... یا email@example.com"
            required
            type="text"
            @input="validateIdentifier"
          />
          <span
            v-if="errors.identifier"
            class="text-[10px] text-red-500 mt-1 block font-iransans-medium"
          >
            {{ errors.identifier }}
          </span>
        </div>

        <button
          :disabled="isLoading || !!errors.identifier || !form.identifier"
          class="relative w-full py-3 mt-4 overflow-hidden font-iransans-bold text-brand-white transition-all duration-300 rounded-xl bg-brand-primary hover:bg-opacity-90 active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100 shadow-[0_8px_20px_-8px_rgba(242,124,154,0.6)]"
          type="submit"
        >
          <span v-if="isLoading" class="flex items-center justify-center gap-2"
            >در حال ارسال...</span
          >
          <span v-else>ارسال کد / لینک تایید</span>
        </button>

        <div class="mt-6 text-sm font-iransans-medium text-center text-brand-medium">
          <router-link
            class="font-iransans-bold text-brand-dark hover:text-brand-primary transition-colors"
            to="/auth/login"
          >
            بازگشت به صفحه ورود
          </router-link>
        </div>
      </form>

      <!-- ================= مرحله 2: دریافت OTP (تایید موبایل) ================= -->
      <form
        v-if="currentStep === 2"
        class="space-y-4 animate-fade-in-up"
        @submit.prevent="verifyOtp"
      >
        <!-- پیام راهنمای ثابت برای بررسی پیامک -->
        <div class="mb-5 bg-green-50 border border-green-100 rounded-xl p-3 flex items-start gap-3">
          <DevicePhoneMobileIcon class="w-6 h-6 text-green-500 shrink-0" />
          <p
            class="text-[11px] text-green-700 font-iransans-medium leading-relaxed text-right mt-0.5"
          >
            کد تایید به شماره
            <span class="font-iransans-bold" dir="ltr">{{ form.identifier }}</span> پیامک شد. لطفاً
            صندوق پیام‌های خود را بررسی کنید.
          </p>
        </div>

        <div>
          <label
            class="block mb-1.5 text-xs font-iransans-bold tracking-wide text-brand-dark"
            for="otp"
          >
            کد تایید ۶ رقمی
          </label>
          <input
            id="otp"
            v-model="form.otp"
            class="w-full px-4 py-3 text-center text-lg tracking-[0.5em] font-iransans-bold bg-brand-neutral border border-transparent rounded-xl text-brand-dark focus:bg-brand-white focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 transition-all outline-none"
            dir="ltr"
            maxlength="6"
            placeholder="------"
            required
            type="text"
            @input="validateOtp"
          />
          <span
            v-if="errors.otp"
            class="text-[10px] text-red-500 mt-1 block font-iransans-medium text-center"
          >
            {{ errors.otp }}
          </span>
        </div>

        <button
          :disabled="isLoading || form.otp.length !== 6"
          class="relative w-full py-3 mt-4 overflow-hidden font-iransans-bold text-brand-white transition-all duration-300 rounded-xl bg-brand-primary hover:bg-opacity-90 active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100 shadow-[0_8px_20px_-8px_rgba(242,124,154,0.6)]"
          type="submit"
        >
          <span v-if="isLoading">در حال بررسی...</span>
          <span v-else>تایید کد</span>
        </button>

        <div
          class="mt-4 flex flex-col items-center justify-center text-sm font-iransans-medium text-brand-medium"
        >
          <span v-if="timer > 0"
            >مانده تا دریافت مجدد:
            <span class="font-iransans-bold text-brand-primary" dir="ltr">{{
              formattedTimer
            }}</span></span
          >
          <button
            v-else
            :disabled="isLoading"
            class="text-brand-primary hover:text-brand-dark font-iransans-bold transition-colors"
            type="button"
            @click="resendOtp"
          >
            ارسال مجدد کد
          </button>
        </div>

        <div class="text-center mt-2">
          <button
            class="text-xs text-brand-medium hover:text-brand-dark transition-colors"
            type="button"
            @click="currentStep = 1"
          >
            تغییر شماره موبایل
          </button>
        </div>
      </form>

      <!-- ================= مرحله 3: تنظیم رمز عبور جدید ================= -->
      <form
        v-if="currentStep === 3"
        class="space-y-4 animate-fade-in-up"
        @submit.prevent="resetPassword"
      >
        <!-- کدهای مرحله ۳ بدون تغییر ... -->
        <div>
          <label
            class="block mb-1.5 text-xs font-iransans-bold tracking-wide text-brand-dark"
            for="password"
            >رمز عبور جدید</label
          >
          <div class="relative group">
            <input
              id="password"
              v-model="form.password"
              :class="{
                'border-red-400 focus:border-red-500 focus:ring-red-500/10': errors.password,
              }"
              :type="showPassword ? 'text' : 'password'"
              class="w-full pl-4 pr-12 py-3 text-sm bg-brand-neutral border border-transparent rounded-xl text-brand-dark focus:bg-brand-white focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 transition-all outline-none"
              dir="ltr"
              placeholder="••••••••"
              required
              @input="validatePassword"
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
            class="text-[10px] text-red-500 mt-1 block font-iransans-medium"
            >{{ errors.password }}</span
          >
        </div>

        <div>
          <label
            class="block mb-1.5 text-xs font-iransans-bold tracking-wide text-brand-dark"
            for="password_confirmation"
            >تکرار رمز عبور جدید</label
          >
          <div class="relative group">
            <input
              id="password_confirmation"
              v-model="form.password_confirmation"
              :class="{
                'border-red-400 focus:border-red-500 focus:ring-red-500/10':
                  errors.password_confirmation,
              }"
              :type="showPasswordConfirm ? 'text' : 'password'"
              class="w-full pl-4 pr-12 py-3 text-sm bg-brand-neutral border border-transparent rounded-xl text-brand-dark focus:bg-brand-white focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 transition-all outline-none"
              dir="ltr"
              placeholder="••••••••"
              required
              @input="validatePassword"
            />
            <button
              class="absolute inset-y-0 right-0 flex items-center justify-center w-12 text-brand-medium hover:text-brand-dark transition-colors"
              type="button"
              @click="showPasswordConfirm = !showPasswordConfirm"
            >
              <EyeIcon v-if="!showPasswordConfirm" class="w-5 h-5" />
              <EyeSlashIcon v-else class="w-5 h-5" />
            </button>
          </div>
          <span
            v-if="errors.password_confirmation"
            class="text-[10px] text-red-500 mt-1 block font-iransans-medium"
            >{{ errors.password_confirmation }}</span
          >
        </div>

        <button
          :disabled="
            isLoading || !!errors.password || !!errors.password_confirmation || !form.password
          "
          class="relative w-full py-3 mt-4 overflow-hidden font-iransans-bold text-brand-white transition-all duration-300 rounded-xl bg-brand-primary hover:bg-opacity-90 active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100 shadow-[0_8px_20px_-8px_rgba(242,124,154,0.6)]"
          type="submit"
        >
          <span v-if="isLoading">در حال ذخیره...</span>
          <span v-else>تغییر رمز عبور</span>
        </button>
      </form>

      <!-- ================= مرحله 4: تایید ارسال ایمیل (فقط نمایش پیام) ================= -->
      <div v-if="currentStep === 4" class="text-center animate-fade-in-up py-4">
        <div class="flex justify-center mb-6">
          <div
            class="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center border border-green-100 shadow-sm"
          >
            <EnvelopeIcon class="w-10 h-10" />
          </div>
        </div>

        <h3 class="text-xl font-iransans-black text-brand-dark mb-4">ایمیل ارسال شد</h3>

        <p class="text-sm font-iransans-medium text-brand-dark/80 leading-relaxed mb-6">
          لینک بازیابی رمز عبور به ایمیل شما <br />
          <span class="font-iransans-bold text-brand-primary inline-block mt-1" dir="ltr">{{
            form.identifier
          }}</span>
          <br />
          ارسال گردید.
        </p>

        <div
          class="bg-amber-50 border border-amber-100 rounded-xl p-4 text-xs text-amber-800 font-iransans-medium text-right leading-relaxed mb-6 shadow-sm"
        >
          <strong class="font-iransans-bold text-amber-900">توجه:</strong>
          لطفاً صندوق ورودی (Inbox) ایمیل خود را بررسی کنید. در صورتی که ایمیلی دریافت نکرده‌اید،
          لطفاً <strong>پوشه هرزنامه (Spam)</strong> را نیز چک کنید.
        </div>

        <button
          class="relative w-full py-3 overflow-hidden font-iransans-bold text-brand-white transition-all duration-300 rounded-xl bg-brand-primary hover:bg-opacity-90 active:scale-[0.98] shadow-[0_8px_20px_-8px_rgba(242,124,154,0.6)]"
          type="button"
          @click="router.push('/auth/login')"
        >
          بازگشت به صفحه ورود
        </button>
      </div>
    </div>

    <!-- ================= ستون سمت چپ ================= -->
    <div
      class="hidden md:flex w-1/2 bg-brand-accent relative flex-col items-center justify-center overflow-hidden rounded-[2.5rem]"
    >
      <!-- محتوای ستون چپ بدون تغییر ... -->
      <div
        class="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-brand-primary to-transparent"
      ></div>
      <div
        class="relative z-10 text-center p-6 flex flex-col items-center w-full h-full justify-center"
      >
        <h3 class="text-2xl font-iransans-black text-brand-dark mb-3">بازگشت به دنیای زیبایی</h3>
        <p class="text-brand-dark/80 text-sm font-iransans-medium leading-relaxed max-w-sm">
          شما مراقب زیبایی خود باشید ، ما مراقب امنیت حساب شما هستیم. با چند قدم ساده، دوباره همراه
          ما باشید.
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

<script setup>
import { computed, onMounted, onUnmounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Logo from '@/components/Logo/BeautyLogo.vue'

import {
  DevicePhoneMobileIcon,
  EnvelopeIcon,
  EyeIcon,
  EyeSlashIcon,
} from '@heroicons/vue/24/outline'
import axios from '@/lib/axios'
import { useNotificationStore } from '@/stores/notification'

const route = useRoute()
const router = useRouter()
const notify = useNotificationStore()

const currentStep = ref(1)
const isLoading = ref(false)
const showPassword = ref(false)
const showPasswordConfirm = ref(false)

const form = reactive({
  identifier: '',
  otp: '',
  password: '',
  password_confirmation: '',
  challenge_id: null,
  reset_token: '',
})

const errors = reactive({
  identifier: '',
  otp: '',
  password: '',
  password_confirmation: '',
})

// === منطق تایمر ===
const timer = ref(0)
let timerInterval = null

const startTimer = () => {
  timer.value = 120
  clearInterval(timerInterval)
  timerInterval = setInterval(() => {
    if (timer.value > 0) {
      timer.value--
    } else {
      clearInterval(timerInterval)
    }
  }, 1000)
}

const formattedTimer = computed(() => {
  const m = Math.floor(timer.value / 60)
  const s = timer.value % 60
  return `${m}:${s.toString().padStart(2, '0')}`
})

onUnmounted(() => {
  clearInterval(timerInterval)
})
// ==================

const stepDescription = computed(() => {
  if (currentStep.value === 1) return 'لطفاً ایمیل یا شماره موبایل خود را وارد کنید.'
  if (currentStep.value === 2) return `کد ارسال شده به ${form.identifier} را وارد کنید.`
  if (currentStep.value === 3) return 'رمز عبور جدید خود را با دقت وارد کنید.'
  if (currentStep.value === 4) return 'اقدامات بعدی را از طریق ایمیل دنبال کنید.'
  return ''
})

const validateIdentifier = () => {
  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.identifier)
  const isMobile = /^09\d{9}$/.test(form.identifier)

  if (!form.identifier) {
    errors.identifier = 'پر کردن این فیلد الزامی است.'
  } else if (!isEmail && !isMobile) {
    errors.identifier = 'لطفاً یک ایمیل معتبر یا شماره موبایل (شروع با 09) وارد کنید.'
  } else {
    errors.identifier = ''
  }
}

const validateOtp = () => {
  form.otp = form.otp.replace(/\D/g, '')
  if (form.otp.length > 0 && form.otp.length < 6) {
    errors.otp = 'کد باید ۶ رقم باشد.'
  } else {
    errors.otp = ''
  }
}

const validatePassword = () => {
  if (form.password && form.password.length < 8) {
    errors.password = 'رمز عبور باید حداقل ۸ کاراکتر باشد.'
  } else {
    errors.password = ''
  }

  if (form.password_confirmation && form.password !== form.password_confirmation) {
    errors.password_confirmation = 'تکرار رمز عبور مطابقت ندارد.'
  } else {
    errors.password_confirmation = ''
  }
}

onMounted(() => {
  if (route.query.token && route.query.id) {
    form.reset_token = route.query.token
    form.challenge_id = route.query.id
    currentStep.value = 3
  }
})

// === تغییرات جدید در این متد است ===
const requestReset = async () => {
  validateIdentifier()
  if (errors.identifier) return

  isLoading.value = true
  try {
    const response = await axios.post('/v1/auth/password/request', {
      identifier: form.identifier,
    })

    notify.success(response.data.message || 'درخواست با موفقیت ارسال شد.')

    // بررسی اینکه ورودی ایمیل بوده یا موبایل
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.identifier)

    if (!isEmail) {
      // اگر موبایل است -> برو به فرم دریافت کد
      currentStep.value = 2
      startTimer()
    } else {
      // اگر ایمیل است -> برو به فرم جدید نمایش وضعیت چک کردن ایمیل
      currentStep.value = 4
    }
  } catch (error) {
    notify.error(error.response?.data?.message || 'خطایی رخ داد. مجدداً تلاش کنید.')
  } finally {
    isLoading.value = false
  }
}

const resendOtp = () => {
  form.otp = ''
  requestReset()
}

const verifyOtp = async () => {
  if (form.otp.length !== 6) return

  isLoading.value = true
  try {
    const response = await axios.post('/v1/auth/password/verify-otp', {
      identifier: form.identifier,
      code: form.otp,
    })

    form.reset_token = response.data.reset_token
    form.challenge_id = response.data.challenge_id
    notify.success('کد با موفقیت تایید شد.')
    clearInterval(timerInterval)
    currentStep.value = 3
  } catch (error) {
    notify.error(error.response?.data?.message || 'کد وارد شده اشتباه است.')
  } finally {
    isLoading.value = false
  }
}

const resetPassword = async () => {
  validatePassword()
  if (errors.password || errors.password_confirmation) return

  isLoading.value = true
  try {
    const response = await axios.post('/v1/auth/password/reset', {
      challenge_id: form.challenge_id,
      token: form.reset_token,
      password: form.password,
      password_confirmation: form.password_confirmation,
    })

    notify.success(response.data.message || 'رمز عبور با موفقیت تغییر یافت.')

    form.identifier = ''
    form.otp = ''
    form.password = ''
    form.password_confirmation = ''

    setTimeout(() => {
      router.push('/auth/login')
    }, 2000)
  } catch (error) {
    notify.error(
      error.response?.data?.message || 'خطایی رخ داد. لینک/کد شما ممکن است منقضی شده باشد.',
    )
  } finally {
    isLoading.value = false
  }
}
</script>
