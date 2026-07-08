<template>
  <div class="admin-settings min-h-screen font-vazir bg-[#F8FAFC] p-4 md:p-8">
    <!-- هدر صفحه -->
    <div class="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h2 class="text-2xl font-bold text-[#1E293B] flex items-center gap-2">
          <svg
            class="h-7 w-7 text-[#2563EB]"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          تنظیمات فروشگاه و مالی
        </h2>
        <p class="text-[#475569] text-sm mt-1">
          مدیریت اطلاعات بانکی، روش‌های پرداخت و هزینه‌های ارسال
        </p>
      </div>

      <!-- دکمه ذخیره در هدر -->
      <button
        :disabled="saving || loading"
        class="hidden md:flex items-center justify-center gap-2 bg-[#2563EB] hover:bg-blue-700 text-white font-medium py-2.5 px-6 rounded-lg shadow-sm transition-all duration-200 disabled:opacity-70"
        @click="saveSettings"
      >
        <svg
          v-if="saving"
          class="animate-spin h-5 w-5 text-white"
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
        <svg
          v-else
          class="h-5 w-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M5 13l4 4L19 7"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
          />
        </svg>
        <span>{{ saving ? 'در حال ذخیره...' : 'ذخیره تغییرات' }}</span>
      </button>
    </div>

    <div v-if="loading" class="animate-pulse space-y-6">
      <div
        v-for="i in 4"
        :key="i"
        class="bg-white rounded-xl h-48 w-full border border-gray-100 shadow-sm"
      ></div>
    </div>

    <form v-else class="space-y-6" @submit.prevent="saveSettings">
      <!-- بخش ۱: مدیریت روش‌های پرداخت (جدید) -->
      <section
        class="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:border-[#2563EB]/30 transition-colors duration-300"
      >
        <div class="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
          <div class="bg-purple-50 p-2 rounded-lg text-purple-600">
            <svg
              class="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
              />
            </svg>
          </div>
          <div>
            <h3 class="text-lg font-bold text-[#1E293B]">روش‌های پرداخت فعال</h3>
            <p class="text-xs text-[#475569] mt-0.5">
              انتخاب کنید مشتریان مجاز به استفاده از کدام روش‌های پرداخت هستند
            </p>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <!-- تاگل پرداخت آنلاین -->
          <div
            class="flex items-center justify-between p-4 rounded-lg border border-gray-100 bg-gray-50"
          >
            <div>
              <p class="text-sm font-bold text-[#1E293B]">پرداخت آنلاین (درگاه)</p>
              <p class="text-xs text-gray-500 mt-1">اتصال به زرین‌پال و ...</p>
            </div>
            <button
              :class="settings.is_online_payment_active ? 'bg-[#2563EB]' : 'bg-gray-300'"
              class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none"
              type="button"
              @click="toggleSetting('is_online_payment_active')"
            >
              <span
                :class="settings.is_online_payment_active ? '-translate-x-5' : 'translate-x-0'"
                class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
              ></span>
            </button>
          </div>

          <!-- تاگل کارت به کارت -->
          <div
            class="flex items-center justify-between p-4 rounded-lg border border-gray-100 bg-gray-50"
          >
            <div>
              <p class="text-sm font-bold text-[#1E293B]">کارت به کارت (آفلاین)</p>
              <p class="text-xs text-gray-500 mt-1">آپلود فیش واریزی توسط مشتری</p>
            </div>
            <button
              :class="settings.is_card_payment_active ? 'bg-[#2563EB]' : 'bg-gray-300'"
              class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none"
              type="button"
              @click="toggleSetting('is_card_payment_active')"
            >
              <span
                :class="settings.is_card_payment_active ? '-translate-x-5' : 'translate-x-0'"
                class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
              ></span>
            </button>
          </div>
        </div>
      </section>

      <!-- بخش ۲: اطلاعات بانکی -->
      <section
        class="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:border-[#2563EB]/30 transition-colors duration-300"
      >
        <!-- کدهای این بخش مانند قبل است -->
        <div class="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
          <div class="bg-[#ECFDF5] p-2 rounded-lg text-[#04786A]">
            <svg
              class="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
              />
            </svg>
          </div>
          <div>
            <h3 class="text-lg font-bold text-[#1E293B]">اطلاعات حساب بانکی</h3>
            <p class="text-xs text-[#475569] mt-0.5">
              جهت نمایش به کاربر در روش پرداخت کارت به کارت
            </p>
          </div>
        </div>

        <!-- فیلدهای شماره کارت و ... (مثل کد قبلی) -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="relative">
            <label class="block text-sm font-semibold text-[#475569] mb-2">شماره کارت</label>
            <input
              v-model="settings.bank_card_number"
              class="w-full bg-[#F8FAFC] border border-gray-200 text-[#1E293B] rounded-lg px-4 py-2.5 focus:bg-white focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 transition-all outline-none tracking-widest font-mono text-left"
              dir="ltr"
              placeholder="1234-5678-9012-3456"
              type="text"
            />
          </div>
          <div>
            <label class="block text-sm font-semibold text-[#475569] mb-2">نام صاحب حساب</label>
            <input
              v-model="settings.bank_account_owner"
              class="w-full bg-[#F8FAFC] border border-gray-200 text-[#1E293B] rounded-lg px-4 py-2.5 focus:bg-white focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 transition-all outline-none"
              placeholder="مثال: علی رضایی"
              type="text"
            />
          </div>
          <div>
            <label class="block text-sm font-semibold text-[#475569] mb-2">نام بانک</label>
            <input
              v-model="settings.bank_name"
              class="w-full bg-[#F8FAFC] border border-gray-200 text-[#1E293B] rounded-lg px-4 py-2.5 focus:bg-white focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 transition-all outline-none"
              placeholder="مثال: بانک ملت"
              type="text"
            />
          </div>
        </div>
      </section>

      <!-- بخش ۳: هزینه‌ها و ارسال -->
      <section
        class="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:border-[#2563EB]/30 transition-colors duration-300"
      >
        <!-- بخش هدر هزینه‌ها مانند قبل -->
        <div class="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
          <div class="bg-blue-50 p-2 rounded-lg text-[#2563EB]">
            <svg
              class="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
              />
            </svg>
          </div>
          <div>
            <h3 class="text-lg font-bold text-[#1E293B]">هزینه‌ها و لجستیک</h3>
            <p class="text-xs text-[#475569] mt-0.5">
              پیکربندی مبالغ پایه‌ای برای سبد خرید و ارسال
            </p>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label class="block text-sm font-semibold text-[#475569] mb-2"
              >هزینه ارسال پیش‌فرض
              <span class="text-xs text-gray-400 font-normal">(تومان)</span></label
            >
            <input
              v-model="settings.default_shipping_cost"
              class="w-full bg-[#F8FAFC] border border-gray-200 text-[#1E293B] rounded-lg px-4 py-2.5 focus:bg-white focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 transition-all outline-none"
              type="number"
            />
            <p
              v-if="settings.default_shipping_cost"
              class="text-xs text-[#04786A] mt-1.5 font-medium"
            >
              معادل: {{ formatPrice(settings.default_shipping_cost) }}
            </p>
          </div>
          <div>
            <label class="block text-sm font-semibold text-[#475569] mb-2"
              >آستانه ارسال رایگان
              <span class="text-xs text-gray-400 font-normal">(تومان)</span></label
            >
            <input
              v-model="settings.free_shipping_threshold"
              class="w-full bg-[#F8FAFC] border border-gray-200 text-[#1E293B] rounded-lg px-4 py-2.5 focus:bg-white focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 transition-all outline-none"
              type="number"
            />
            <p
              v-if="settings.free_shipping_threshold"
              class="text-xs text-[#04786A] mt-1.5 font-medium"
            >
              معادل: {{ formatPrice(settings.free_shipping_threshold) }}
            </p>
          </div>
          <div>
            <label class="block text-sm font-semibold text-[#475569] mb-2"
              >هزینه بسته‌بندی <span class="text-xs text-gray-400 font-normal">(تومان)</span></label
            >
            <input
              v-model="settings.packaging_cost"
              class="w-full bg-[#F8FAFC] border border-gray-200 text-[#1E293B] rounded-lg px-4 py-2.5 focus:bg-white focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 transition-all outline-none"
              type="number"
            />
            <p v-if="settings.packaging_cost" class="text-xs text-[#04786A] mt-1.5 font-medium">
              معادل: {{ formatPrice(settings.packaging_cost) }}
            </p>
          </div>
        </div>
      </section>

      <!-- بخش ۴: درگاه و API -->
      <section
        class="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:border-[#2563EB]/30 transition-colors duration-300"
      >
        <!-- کدهای این بخش مانند قبل است -->
        <div class="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
          <div class="bg-gray-100 p-2 rounded-lg text-[#475569]">
            <svg
              class="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
              />
            </svg>
          </div>
          <div>
            <h3 class="text-lg font-bold text-[#1E293B]">تنظیمات سیستمی و API</h3>
            <p class="text-xs text-[#475569] mt-0.5">
              کلیدهای ارتباطی سیستم با سرویس‌های خارجی و مالیات
            </p>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-semibold text-[#475569] mb-2"
              >درصد مالیات ارزش افزوده
              <span class="text-xs text-gray-400 font-normal">(%)</span></label
            >
            <input
              v-model="settings.tax_rate"
              class="w-full bg-[#F8FAFC] border border-gray-200 text-[#1E293B] rounded-lg px-4 py-2.5 focus:bg-white focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 transition-all outline-none"
              step="0.01"
              type="number"
            />
          </div>
          <div>
            <label class="block text-sm font-semibold text-[#475569] mb-2"
              >مرچنت آیدی زرین‌پال</label
            >
            <input
              v-model="settings.zarinpal_merchant_id"
              class="w-full bg-[#F8FAFC] border border-gray-200 text-[#1E293B] rounded-lg px-4 py-2.5 focus:bg-white focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 transition-all outline-none font-mono text-sm text-left"
              dir="ltr"
              type="text"
            />
          </div>
          <div class="md:col-span-2">
            <label class="block text-sm font-semibold text-[#475569] mb-2">توکن API پست</label>
            <input
              v-model="settings.post_api_token"
              class="w-full bg-[#F8FAFC] border border-gray-200 text-[#1E293B] rounded-lg px-4 py-2.5 focus:bg-white focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 transition-all outline-none font-mono text-sm text-left"
              dir="ltr"
              type="text"
            />
          </div>
        </div>
      </section>

      <!-- دکمه ذخیره -->
      <div class="flex justify-end pt-4 pb-8 md:pb-0">
        <button
          :disabled="saving || loading"
          class="w-full md:w-auto flex items-center justify-center gap-2 bg-[#2563EB] hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-xl shadow-md transition-all duration-200 disabled:opacity-70"
          type="submit"
        >
          <svg
            v-if="saving"
            class="animate-spin h-5 w-5 text-white"
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
          <span>{{ saving ? 'در حال ثبت اطلاعات...' : 'ذخیره تنظیمات سیستم' }}</span>
        </button>
      </div>
    </form>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import axios from '@/lib/axios'
import { useNotificationStore } from '@/stores/notification'

const loading = ref(true)
const saving = ref(false)
const notify = useNotificationStore()
const settings = ref({
  // روش‌های پرداخت
  is_online_payment_active: true, // پیش‌فرض فعال
  is_card_payment_active: true, // پیش‌فرض فعال

  // اطلاعات بانکی
  bank_card_number: '',
  bank_account_owner: '',
  bank_name: '',

  // هزینه‌ها
  default_shipping_cost: '',
  free_shipping_threshold: '',
  packaging_cost: '',

  // درگاه و API
  tax_rate: '',
  zarinpal_merchant_id: '',
  post_api_token: '',
})

// تابع فرمت قیمت
const formatPrice = (value: number | string) => {
  if (!value) return '۰ تومان'
  return new Intl.NumberFormat('fa-IR').format(Number(value)) + ' تومان'
}

// تابع تغییر وضعیت تاگل
const toggleSetting = (key: keyof typeof settings.value) => {
  if (typeof settings.value[key] === 'boolean') {
    settings.value[key] = !settings.value[key]
  }
}

// دریافت اطلاعات
const fetchSettings = async () => {
  try {
    loading.value = true
    const response = await axios.get('/admin/shop-settings')
    if (response.data.data) {
      // تبدیل مقادیر دریافتی به Boolean در صورتی که از بک‌اند به صورت رشته "true" یا "1" ارسال شده باشند
      const fetchedSettings = response.data.data
      if (fetchedSettings.is_online_payment_active !== undefined) {
        fetchedSettings.is_online_payment_active =
          fetchedSettings.is_online_payment_active === '1' ||
          fetchedSettings.is_online_payment_active === true ||
          fetchedSettings.is_online_payment_active === 'true'
      }
      if (fetchedSettings.is_card_payment_active !== undefined) {
        fetchedSettings.is_card_payment_active =
          fetchedSettings.is_card_payment_active === '1' ||
          fetchedSettings.is_card_payment_active === true ||
          fetchedSettings.is_card_payment_active === 'true'
      }

      settings.value = { ...settings.value, ...fetchedSettings }
    }
  } catch (error) {
    console.error('Error fetching settings:', error)
    notify.error('خطا در دریافت اطلاعات تنظیمات.')
  } finally {
    loading.value = false
  }
}

// ذخیره اطلاعات
const saveSettings = async () => {
  try {
    saving.value = true
    const response = await axios.post('/admin/shop-settings', {
      settings: settings.value,
    })
    notify.success('تنظیمات با موفقیت ذخیره شد.')
  } catch (error) {
    console.error('Error saving settings:', error)
    notify.error('خطا در ذخیره‌سازی اطلاعات.')
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  fetchSettings()
})
</script>

<style scoped>
/* حذف فلش‌های پیش‌فرض input number */
input[type='number']::-webkit-inner-spin-button,
input[type='number']::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input[type='number'] {
  -moz-appearance: textfield;
}
</style>
