<template>
  <div class="space-y-6 font-vazir">
    <!-- هدر صفحه -->
    <div>
      <h1 class="text-2xl font-bold text-[#333333] dark:text-white mb-2">اطلاعات حساب کاربری</h1>
      <p class="text-sm text-[#777777] dark:text-gray-400">
        اطلاعات شخصی و راه‌های ارتباطی خود را ویرایش کنید.
      </p>
    </div>

    <!-- وضعیت لودینگ اولیه -->
    <div v-if="isLoadingData" class="flex justify-center py-10">
      <svg class="animate-spin h-8 w-8 text-[#F57A9B]" fill="none" viewBox="0 0 24 24">
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
    </div>

    <div v-else class="space-y-6">
      <!-- هشدار عدم تکمیل اطلاعات -->
      <div
        v-if="!isProfileComplete"
        class="bg-[#EEDAC5]/30 dark:bg-amber-900/30 border-r-4 border-[#BC846C] p-4 rounded-xl flex items-start gap-3"
      >
        <svg
          class="w-6 h-6 text-[#BC846C] flex-shrink-0 mt-0.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
          />
        </svg>
        <div>
          <h3 class="text-[#BC846C] dark:text-amber-200 font-bold text-sm">
            حساب کاربری شما تکمیل نشده است!
          </h3>
          <p class="text-[#777777] dark:text-amber-300 text-sm mt-1">
            برای استفاده از تمامی امکانات پنل، لطفا ایمیل و کد ملی خود را تایید و تکمیل کنید.
          </p>
        </div>
      </div>

      <div class="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <!-- ستون فرم اطلاعات (بزرگتر) -->
        <div class="xl:col-span-2 space-y-6">
          <div
            class="bg-[#FDFBF9] dark:bg-slate-800 rounded-2xl border border-[#E9DDD2] dark:border-slate-700 shadow-sm p-6"
          >
            <div
              class="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-6 border-b border-[#E9DDD2] dark:border-slate-700 gap-6"
            >
              <h2 class="text-lg font-bold text-[#333333] dark:text-white flex items-center gap-2">
                <svg
                  class="w-5 h-5 text-[#F57A9B]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                  ></path>
                </svg>
                اطلاعات شخصی
              </h2>

              <!-- بخش آپلود آواتار -->
              <div class="flex items-center gap-4">
                <div
                  class="relative w-16 h-16 rounded-full border-2 border-[#E9DDD2] dark:border-slate-600 overflow-hidden bg-[#F5F5F7] dark:bg-slate-700"
                >
                  <img
                    v-if="avatarUrl"
                    :src="avatarUrl"
                    alt="Avatar"
                    class="w-full h-full object-cover"
                  />
                  <svg
                    v-else
                    class="w-full h-full text-[#E9DDD2] p-2"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                  <!-- لودینگ آپلود عکس -->
                  <div
                    v-if="isUploadingAvatar"
                    class="absolute inset-0 bg-black/50 flex items-center justify-center"
                  >
                    <svg class="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
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
                  </div>
                </div>

                <div class="flex flex-col gap-2">
                  <input
                    ref="fileInput"
                    accept="image/*"
                    class="hidden"
                    type="file"
                    @change="handleAvatarUpload"
                  />
                  <div class="flex gap-2">
                    <button
                      class="text-sm px-3 py-1.5 bg-[#EEDAC5]/40 hover:bg-[#EEDAC5]/70 text-[#BC846C] dark:bg-[#EEDAC5]/10 dark:text-[#EEDAC5] rounded-lg transition-colors"
                      type="button"
                      @click="fileInput?.click()"
                    >
                      تغییر تصویر
                    </button>
                    <button
                      v-if="avatarUrl"
                      class="text-sm px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-500/10 dark:text-red-400 rounded-lg transition-colors"
                      type="button"
                      @click="removeAvatar"
                    >
                      حذف
                    </button>
                  </div>
                  <span class="text-xs text-[#777777]">حداکثر ۲ مگابایت (JPG, PNG)</span>
                </div>
              </div>
            </div>

            <form class="grid grid-cols-1 md:grid-cols-2 gap-6" @submit.prevent="saveProfile">
              <!-- نام و نام خانوادگی -->
              <div class="space-y-2 md:col-span-2">
                <label class="text-sm font-medium text-[#777777] dark:text-gray-300"
                  >نام و نام خانوادگی</label
                >
                <input
                  v-model="form.name"
                  class="w-full px-4 py-2.5 rounded-xl border border-[#E9DDD2] dark:border-slate-600 bg-white dark:bg-slate-900 text-[#333333] dark:text-gray-100 focus:ring-2 focus:ring-[#F57A9B] focus:border-[#F57A9B] outline-none transition-all"
                  placeholder="نام و نام خانوادگی خود را وارد کنید"
                  required
                  type="text"
                />
              </div>

              <!-- موبایل -->
              <div class="space-y-2">
                <div class="flex justify-between items-center">
                  <label class="text-sm font-medium text-[#777777] dark:text-gray-300"
                    >شماره موبایل</label
                  >
                  <span
                    v-if="isPhoneVerified"
                    class="text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-md font-medium"
                    >تایید شده</span
                  >
                </div>
                <div class="flex gap-2">
                  <input
                    v-model="form.phone"
                    :disabled="isPhoneVerified"
                    class="w-full px-4 py-2.5 rounded-xl border border-[#E9DDD2] dark:border-slate-600 bg-white dark:bg-slate-900 text-[#333333] dark:text-gray-100 focus:ring-2 focus:ring-[#F57A9B] focus:border-[#F57A9B] outline-none transition-all text-left disabled:bg-[#F5F5F7] disabled:dark:bg-slate-800 disabled:text-[#777777] disabled:cursor-not-allowed"
                    dir="ltr"
                    maxlength="11"
                    placeholder="09120000000"
                    type="tel"
                  />
                  <button
                    v-if="!isPhoneVerified"
                    :disabled="!form.phone || form.phone.length !== 11"
                    class="px-4 py-2.5 bg-[#EEDAC5]/40 text-[#BC846C] hover:bg-[#EEDAC5]/70 dark:bg-[#EEDAC5]/10 dark:text-[#EEDAC5] dark:hover:bg-[#EEDAC5]/20 rounded-xl transition-colors whitespace-nowrap disabled:opacity-50 font-medium"
                    type="button"
                    @click="requestVerification('phone')"
                  >
                    تایید شماره
                  </button>
                </div>
              </div>

              <!-- ایمیل -->
              <div class="space-y-2">
                <div class="flex justify-between items-center">
                  <label class="text-sm font-medium text-[#777777] dark:text-gray-300"
                    >آدرس ایمیل</label
                  >
                  <span
                    v-if="isEmailVerified"
                    class="text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-md font-medium"
                    >تایید شده</span
                  >
                </div>
                <div class="flex gap-2">
                  <input
                    v-model="form.email"
                    :disabled="isEmailVerified"
                    class="w-full px-4 py-2.5 rounded-xl border border-[#E9DDD2] dark:border-slate-600 bg-white dark:bg-slate-900 text-[#333333] dark:text-gray-100 focus:ring-2 focus:ring-[#F57A9B] focus:border-[#F57A9B] outline-none transition-all text-left disabled:bg-[#F5F5F7] disabled:dark:bg-slate-800 disabled:text-[#777777] disabled:cursor-not-allowed"
                    dir="ltr"
                    placeholder="example@domain.com"
                    type="email"
                  />
                  <button
                    v-if="!isEmailVerified"
                    :disabled="!form.email"
                    class="px-4 py-2.5 bg-[#EEDAC5]/40 text-[#BC846C] hover:bg-[#EEDAC5]/70 dark:bg-[#EEDAC5]/10 dark:text-[#EEDAC5] dark:hover:bg-[#EEDAC5]/20 rounded-xl transition-colors whitespace-nowrap disabled:opacity-50 font-medium"
                    type="button"
                    @click="requestVerification('email')"
                  >
                    تایید ایمیل
                  </button>
                </div>
              </div>

              <!-- کدملی -->
              <div class="space-y-2 md:col-span-2">
                <label class="text-sm font-medium text-[#777777] dark:text-gray-300">کد ملی</label>
                <input
                  v-model="form.nationalCode"
                  :class="{ 'border-red-500 focus:ring-red-500': nationalCodeError }"
                  class="w-full px-4 py-2.5 rounded-xl border border-[#E9DDD2] dark:border-slate-600 bg-white dark:bg-slate-900 text-[#333333] dark:text-gray-100 focus:ring-2 focus:ring-[#F57A9B] focus:border-[#F57A9B] outline-none transition-all text-left"
                  dir="ltr"
                  maxlength="10"
                  placeholder="0000000000"
                  type="text"
                />
                <p v-if="nationalCodeError" class="text-xs text-red-500 mt-1">
                  {{ nationalCodeError }}
                </p>
              </div>

              <div class="md:col-span-2 pt-2">
                <button
                  :disabled="isSaving"
                  class="w-full sm:w-auto px-8 py-3 bg-[#F57A9B] hover:bg-[#DFA9C7] text-white rounded-xl font-medium transition-colors shadow-lg shadow-[#F57A9B]/20 flex items-center justify-center gap-2 disabled:opacity-70"
                  type="submit"
                >
                  <svg
                    v-if="isSaving"
                    class="animate-spin h-5 w-5 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
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
                  {{ isSaving ? 'در حال ذخیره...' : 'ثبت اطلاعات' }}
                </button>
              </div>
            </form>
          </div>
        </div>

        <!-- ستون ساید (تغییر رمز عبور) -->
        <div class="space-y-6">
          <div
            class="bg-[#FDFBF9] dark:bg-slate-800 rounded-2xl border border-[#E9DDD2] dark:border-slate-700 shadow-sm p-6"
          >
            <h2
              class="text-lg font-bold text-[#333333] dark:text-white mb-6 flex items-center gap-2"
            >
              <svg
                class="w-5 h-5 text-[#BC846C]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                ></path>
              </svg>
              تغییر رمز عبور
            </h2>
            <form class="space-y-4" @submit.prevent="changePassword">
              <div class="space-y-2">
                <label class="text-sm font-medium text-[#777777] dark:text-gray-300"
                  >رمز عبور فعلی</label
                >
                <input
                  v-model="passForm.current_password"
                  class="w-full px-4 py-2.5 rounded-xl border border-[#E9DDD2] dark:border-slate-600 bg-white dark:bg-slate-900 text-[#333333] dark:text-gray-100 focus:ring-2 focus:ring-[#F57A9B] focus:border-[#F57A9B] outline-none transition-all"
                  dir="ltr"
                  required
                  type="password"
                />
              </div>
              <div class="space-y-2">
                <label class="text-sm font-medium text-[#777777] dark:text-gray-300"
                  >رمز عبور جدید</label
                >
                <input
                  v-model="passForm.password"
                  class="w-full px-4 py-2.5 rounded-xl border border-[#E9DDD2] dark:border-slate-600 bg-white dark:bg-slate-900 text-[#333333] dark:text-gray-100 focus:ring-2 focus:ring-[#F57A9B] focus:border-[#F57A9B] outline-none transition-all"
                  dir="ltr"
                  required
                  type="password"
                />
              </div>
              <div class="space-y-2">
                <label class="text-sm font-medium text-[#777777] dark:text-gray-300"
                  >تکرار رمز عبور جدید</label
                >
                <input
                  v-model="passForm.password_confirmation"
                  class="w-full px-4 py-2.5 rounded-xl border border-[#E9DDD2] dark:border-slate-600 bg-white dark:bg-slate-900 text-[#333333] dark:text-gray-100 focus:ring-2 focus:ring-[#F57A9B] focus:border-[#F57A9B] outline-none transition-all"
                  dir="ltr"
                  required
                  type="password"
                />
              </div>
              <button
                :disabled="isUpdatingPassword"
                class="w-full mt-2 py-3 bg-[#EEDAC5] hover:bg-[#E9DDD2] text-[#BC846C] rounded-xl font-medium transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
                type="submit"
              >
                <svg
                  v-if="isUpdatingPassword"
                  class="animate-spin h-5 w-5 text-[#BC846C]"
                  fill="none"
                  viewBox="0 0 24 24"
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
                {{ isUpdatingPassword ? 'در حال بروزرسانی...' : 'بروزرسانی رمز عبور' }}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- مودال تایید OTP -->
    <div
      v-if="showOtpModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm"
    >
      <div
        class="bg-[#FDFBF9] dark:bg-slate-800 rounded-2xl p-6 w-full max-w-sm shadow-xl border border-[#E9DDD2] dark:border-slate-700"
      >
        <h3 class="text-lg font-bold text-[#333333] dark:text-white mb-2">
          تایید {{ otpType === 'phone' ? 'شماره موبایل' : 'آدرس ایمیل' }}
        </h3>
        <p class="text-sm text-[#777777] dark:text-gray-400 mb-6">
          لطفا کد ۶ رقمی ارسال شده را وارد نمایید.
        </p>

        <form @submit.prevent="verifyOtp">
          <input
            v-model="otpCode"
            class="w-full px-4 py-3 text-center tracking-[0.5em] text-xl rounded-xl border border-[#E9DDD2] dark:border-slate-600 bg-white dark:bg-slate-900 text-[#333333] dark:text-white focus:ring-2 focus:ring-[#F57A9B] focus:border-[#F57A9B] outline-none mb-4"
            dir="ltr"
            maxlength="6"
            placeholder="------"
            required
            type="text"
          />

          <!-- بخش تایمر و ارسال مجدد -->
          <div class="flex items-center justify-between mb-6 text-sm">
            <span class="text-[#777777] dark:text-gray-400">کد را دریافت نکردید؟</span>
            <button
              v-if="timer === 0"
              class="text-[#F57A9B] dark:text-[#DFA9C7] hover:text-[#DFA9C7] font-bold transition-colors"
              type="button"
              @click="resendCode"
            >
              ارسال مجدد کد
            </button>
            <span
              v-else
              class="text-[#333333] dark:text-gray-300 font-medium tracking-widest"
              dir="ltr"
            >
              {{ formattedTimer }}
            </span>
          </div>

          <div class="flex gap-3">
            <button
              class="flex-1 py-2.5 px-4 bg-[#F5F5F7] hover:bg-[#E9DDD2] dark:bg-slate-700 dark:hover:bg-slate-600 text-[#777777] dark:text-gray-200 rounded-xl transition-colors font-medium"
              type="button"
              @click="closeOtpModal"
            >
              انصراف
            </button>
            <button
              :disabled="isVerifyingOtp || otpCode.length !== 6"
              class="flex-1 py-2.5 px-4 bg-[#F57A9B] hover:bg-[#DFA9C7] text-white rounded-xl transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-50"
              type="submit"
            >
              <svg
                v-if="isVerifyingOtp"
                class="animate-spin h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
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
              تایید کد
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, onUnmounted, reactive, ref } from 'vue'
import {
  changePasswordApi,
  deleteAvatarApi,
  getUserApi,
  requestEmailVerifyApi,
  requestMobileVerifyApi,
  updateUserProfileApi,
  uploadAvatarApi,
  verifyEmailOtpApi,
  verifyMobileOtpApi,
} from '@/api/userApi'
import { useNotificationStore } from '@/stores/notification'
import { useConfirmStore } from '@/stores/confirm' // --- مقداردهی استورها ---

// --- مقداردهی استورها ---
const notify = useNotificationStore()
const confirmStore = useConfirmStore()

const isLoadingData = ref(true)

// --- متغیرهای آپلود آواتار ---
const fileInput = ref<HTMLInputElement | null>(null)
const avatarUrl = ref<string | null>(null)
const isUploadingAvatar = ref(false)

// --- وضعیت تایید ایمیل و موبایل ---
const isPhoneVerified = ref(false)
const isEmailVerified = ref(false)

// --- متغیرهای مودال OTP و تایمر ---
const showOtpModal = ref(false)
const otpType = ref<'phone' | 'email'>('phone')
const otpCode = ref('')
const isVerifyingOtp = ref(false)

const timer = ref(120) // ۲ دقیقه
let timerInterval: any = null

// فرمت کردن زمان (تبدیل ثانیه به MM:SS)
const formattedTimer = computed(() => {
  const minutes = Math.floor(timer.value / 60)
    .toString()
    .padStart(2, '0')
  const seconds = (timer.value % 60).toString().padStart(2, '0')
  return `${minutes}:${seconds}`
})

// --- وضعیت فرم اطلاعات شخصی ---
const isSaving = ref(false)
const nationalCodeError = ref('')
const form = reactive({
  name: '',
  phone: '',
  email: '',
  nationalCode: '',
})

// --- بررسی وضعیت تکمیل پروفایل (برای نمایش هشدار) ---
const isProfileComplete = computed(() => {
  return isEmailVerified.value && form.nationalCode
})

// --- وضعیت فرم تغییر رمز عبور ---
const isUpdatingPassword = ref(false)
const passForm = reactive({
  current_password: '',
  password: '',
  password_confirmation: '',
})

// --- توابع تایمر ---
const startTimer = () => {
  stopTimer()
  timer.value = 120
  timerInterval = setInterval(() => {
    if (timer.value > 0) {
      timer.value--
    } else {
      stopTimer()
    }
  }, 1000)
}

const stopTimer = () => {
  if (timerInterval) {
    clearInterval(timerInterval)
    timerInterval = null
  }
}

// در صورت از بین رفتن کامپوننت تایمر باید متوقف شود
onUnmounted(() => {
  stopTimer()
})

// --- بستن مودال ---
const closeOtpModal = () => {
  showOtpModal.value = false
  otpCode.value = ''
  stopTimer()
}

// --- دریافت اطلاعات اولیه از سرور ---
const fetchUserData = async () => {
  try {
    isLoadingData.value = true
    const { data } = await getUserApi()

    const userData = data.data || data

    form.name = userData.name || ''
    form.phone = userData.mobile || userData.phone || ''
    form.email = userData.email || ''
    form.nationalCode = userData.national_code || ''
    avatarUrl.value = userData.avatar_url || null

    isPhoneVerified.value = !!userData.mobile_verified_at
    isEmailVerified.value = !!userData.email_verified_at
  } catch (error: any) {
    console.error('خطا در دریافت اطلاعات کاربر:', error)
    const errorMessage = error.response?.data?.message || 'مشکلی در ارتباط با سرور رخ داده است.'
    notify.error(`خطا در دریافت اطلاعات کاربر: ${errorMessage}`)
  } finally {
    isLoadingData.value = false
  }
}

onMounted(() => {
  fetchUserData()
})

const isValidIranianNationalCode = (code: string): boolean => {
  if (!/^\d{10}$/.test(code)) return false

  const check = parseInt(code[9])
  let sum = 0
  for (let i = 0; i < 9; i++) {
    sum += parseInt(code[i]) * (10 - i)
  }
  const rem = sum % 11
  return (rem < 2 && check === rem) || (rem >= 2 && check === 11 - rem)
}

// --- مدیریت درخواست کد OTP ---
const requestVerification = async (type: 'phone' | 'email') => {
  try {
    otpType.value = type
    otpCode.value = '' // خالی کردن فیلد

    if (type === 'phone') {
      await requestMobileVerifyApi({ mobile: form.phone })
    } else {
      await requestEmailVerifyApi({ email: form.email })
    }

    showOtpModal.value = true
    startTimer() // شروع یا ریست کردن تایمر
    notify.success('کد تایید با موفقیت ارسال شد.')
  } catch (error: any) {
    notify.error(error.response?.data?.message || 'خطا در ارسال کد تایید')
  }
}

// --- درخواست ارسال مجدد کد ---
const resendCode = () => {
  if (timer.value === 0) {
    requestVerification(otpType.value)
  }
}

// --- تایید نهایی کد OTP ---
const verifyOtp = async () => {
  try {
    isVerifyingOtp.value = true
    if (otpType.value === 'phone') {
      await verifyMobileOtpApi({ mobile: form.phone, code: otpCode.value })
      isPhoneVerified.value = true
    } else {
      await verifyEmailOtpApi({ email: form.email, code: otpCode.value })
      isEmailVerified.value = true
    }

    closeOtpModal() // بستن مودال و پاک‌سازی تایمر/فیلد
    notify.success('حساب شما با موفقیت تایید شد.')
  } catch (error: any) {
    notify.error(error.response?.data?.message || 'کد وارد شده اشتباه است.')
  } finally {
    isVerifyingOtp.value = false
  }
}

const handleAvatarUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement
  if (!target.files?.length) return

  const file = target.files[0]
  const formData = new FormData()
  formData.append('avatar', file)

  try {
    isUploadingAvatar.value = true
    const { data } = await uploadAvatarApi(formData)

    // استخراج ایمن داده‌ها با در نظر گرفتن لایه اضافی data که لاراول ممکن است بفرستد
    const responseData = data.data || data

    // بروزرسانی URL آواتار
    avatarUrl.value = responseData?.user?.avatar_url || responseData?.avatar_url || null

    // برای اطمینان ۱۰۰٪ از سینک بودن اطلاعات، کل دیتای یوزر را مجدد فچ می‌کنیم
    if (!avatarUrl.value) {
      await fetchUserData()
    }

    notify.success('تصویر پروفایل با موفقیت بروزرسانی شد.')
  } catch (error: any) {
    notify.error(error.response?.data?.message || 'حجم عکس نباید بیشتر از 2 مگابایت باشد.')
  } finally {
    isUploadingAvatar.value = false
    if (fileInput.value) fileInput.value.value = ''
  }
}

const removeAvatar = async () => {
  const isConfirmed = await confirmStore.ask({
    title: 'حذف تصویر پروفایل',
    message: 'آیا از حذف تصویر پروفایل خود اطمینان دارید؟ این عملیات غیرقابل بازگشت است.',
    type: 'danger',
    confirmText: 'بله، حذف کن',
    cancelText: 'انصراف',
  })

  if (!isConfirmed) return

  try {
    isUploadingAvatar.value = true
    await deleteAvatarApi()
    avatarUrl.value = null
    notify.success('تصویر پروفایل با موفقیت حذف شد.')
  } catch (error: any) {
    notify.error(error.response?.data?.message || 'خطا در حذف تصویر.')
  } finally {
    isUploadingAvatar.value = false
  }
}

const saveProfile = async () => {
  nationalCodeError.value = ''

  if (form.nationalCode && !isValidIranianNationalCode(form.nationalCode)) {
    nationalCodeError.value = 'کد ملی وارد شده معتبر نمی‌باشد.'
    return
  }

  try {
    isSaving.value = true

    await updateUserProfileApi({
      name: form.name,
      national_code: form.nationalCode,
    })

    notify.success('اطلاعات با موفقیت ذخیره شد!')
  } catch (error: any) {
    const errorMsg = error.response?.data?.message || 'خطا در ذخیره اطلاعات. لطفا دوباره تلاش کنید.'
    notify.error(errorMsg)
  } finally {
    isSaving.value = false
  }
}

const changePassword = async () => {
  if (passForm.password !== passForm.password_confirmation) {
    notify.error('رمز عبور جدید و تکرار آن یکسان نیستند.')
    return
  }

  try {
    isUpdatingPassword.value = true
    await changePasswordApi({
      current_password: passForm.current_password,
      password: passForm.password,
      password_confirmation: passForm.password_confirmation,
    })

    notify.success('رمز عبور با موفقیت تغییر یافت!')
    passForm.current_password = ''
    passForm.password = ''
    passForm.password_confirmation = ''
  } catch (error: any) {
    notify.error(error.response?.data?.message || 'رمز عبور فعلی اشتباه است یا خطایی رخ داده است.')
  } finally {
    isUpdatingPassword.value = false
  }
}
</script>
