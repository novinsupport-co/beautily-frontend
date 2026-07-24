<template>
  <div class="space-y-6 font-vazir relative">
    <!-- هدر صفحه و دکمه افزودن -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-[#333333] dark:text-white mb-2">آدرس‌های من</h1>
        <p class="text-sm text-[#777777] dark:text-gray-400">
          آدرس‌های گیرنده سفارش را مدیریت کنید.
        </p>
      </div>
      <button
        class="flex items-center gap-2 px-5 py-2.5 bg-[#F57A9B] hover:bg-[#DFA9C7] text-white rounded-xl font-medium transition-colors shadow-lg shadow-[#F57A9B]/20 whitespace-nowrap"
        @click="openAddressModal()"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            d="M12 4v16m8-8H4"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
          ></path>
        </svg>
        ثبت آدرس جدید
      </button>
    </div>

    <!-- حالت لودینگ (اختیاری اما پیشنهادی) -->
    <div v-if="isLoading" class="flex justify-center py-10">
      <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-[#F57A9B]"></div>
    </div>

    <!-- لیست آدرس‌ها -->
    <div v-else-if="addresses.length > 0" class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div
        v-for="address in addresses"
        :key="address.id"
        :class="
          address.is_default
            ? 'border-[#F57A9B] shadow-md dark:border-[#F57A9B]'
            : 'border-[#E9DDD2] dark:border-slate-700 hover:border-[#DFA9C7] shadow-sm'
        "
        class="bg-white dark:bg-slate-800 rounded-2xl border transition-all duration-200 p-5 relative overflow-hidden"
      >
        <!-- لیبل پیش‌فرض -->
        <div
          v-if="address.is_default"
          class="absolute top-0 right-0 bg-[#F57A9B] text-white text-xs font-bold px-3 py-1 rounded-bl-xl"
        >
          آدرس پیش‌فرض
        </div>

        <div class="space-y-4 mt-2">
          <!-- متن کامل آدرس -->
          <p
            class="text-[#333333] dark:text-gray-200 font-medium leading-relaxed flex items-start gap-2"
          >
            <svg
              class="w-5 h-5 text-[#EEDAC5] mt-0.5 shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
              ></path>
              <path
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
              ></path>
            </svg>
            {{ address.province }}، {{ address.city }}، {{ address.full_address }}
          </p>

          <!-- اطلاعات تکمیلی -->
          <div
            class="flex flex-wrap gap-x-6 gap-y-2 text-sm text-[#777777] dark:text-gray-400 border-t border-[#E9DDD2] dark:border-slate-700 pt-3"
          >
            <div class="flex items-center gap-1">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                ></path>
              </svg>
              {{ address.receiver_name }}
            </div>
            <div class="flex items-center gap-1">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                ></path>
              </svg>
              {{ address.phone }}
            </div>
            <div v-if="address.postal_code" class="flex items-center gap-1">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                ></path>
              </svg>
              کد پستی: {{ address.postal_code }}
            </div>
          </div>

          <!-- اکشن‌ها -->
          <div class="flex items-center justify-end gap-3 pt-2">
            <button
              v-if="!address.is_default"
              class="text-sm text-[#BC846C] hover:text-[#F57A9B] dark:text-gray-400 dark:hover:text-[#F57A9B] font-medium ml-auto"
              @click="setDefault(address.id)"
            >
              تنظیم به عنوان پیش‌فرض
            </button>
            <button
              class="p-2 text-[#777777] hover:bg-[#EEDAC5]/30 hover:text-[#F57A9B] dark:text-gray-400 dark:hover:bg-slate-700 dark:hover:text-[#F57A9B] rounded-lg transition-colors"
              title="ویرایش"
              @click="openAddressModal(address)"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                ></path>
              </svg>
            </button>
            <button
              class="p-2 text-[#777777] hover:bg-red-50 hover:text-red-600 dark:text-gray-400 dark:hover:bg-red-900/30 dark:hover:text-red-500 rounded-lg transition-colors"
              title="حذف"
              @click="deleteAddress(address.id)"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                ></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- حالت خالی -->
    <div
      v-else
      class="py-16 flex flex-col items-center justify-center text-center bg-[#FDFBF9] dark:bg-slate-800 rounded-2xl border border-dashed border-[#E9DDD2] dark:border-slate-700"
    >
      <div class="w-20 h-20 mb-4 text-[#EEDAC5] dark:text-slate-600">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
          ></path>
        </svg>
      </div>
      <h3 class="text-lg font-bold text-[#333333] dark:text-white mb-2">آدرسی ثبت نشده است!</h3>
      <p class="text-[#777777] dark:text-gray-400">
        شما هنوز هیچ آدرسی برای دریافت سفارشات ثبت نکرده‌اید.
      </p>
    </div>

    <!-- مودال افزودن / ویرایش آدرس -->
    <div v-if="isModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        class="absolute inset-0 bg-gray-900/50 backdrop-blur-sm transition-opacity"
        @click="closeModal"
      ></div>
      <div
        class="relative w-full max-w-2xl bg-[#FDFBF9] dark:bg-slate-800 rounded-2xl shadow-xl border border-[#E9DDD2] dark:border-slate-700 overflow-hidden flex flex-col max-h-[90vh]"
      >
        <div
          class="flex items-center justify-between px-6 py-4 border-b border-[#E9DDD2] dark:border-slate-700 bg-white/50 dark:bg-slate-800/50"
        >
          <h3 class="text-lg font-bold text-[#333333] dark:text-white">
            {{ form.id ? 'ویرایش آدرس' : 'ثبت آدرس جدید' }}
          </h3>
          <button
            class="text-[#777777] hover:text-[#333333] dark:hover:text-gray-200"
            @click="closeModal"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                d="M6 18L18 6M6 6l12 12"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
              ></path>
            </svg>
          </button>
        </div>

        <div class="p-6 overflow-y-auto custom-scrollbar">
          <form class="grid grid-cols-1 md:grid-cols-2 gap-5" @submit.prevent="saveAddress">
            <div class="space-y-2">
              <label class="text-sm text-[#333333] dark:text-gray-300">نام تحویل گیرنده</label>
              <input
                v-model="form.receiver_name"
                class="w-full px-4 py-2 rounded-xl border border-[#E9DDD2] dark:border-slate-600 bg-white dark:bg-slate-900 text-[#333333] dark:text-gray-100 focus:ring-2 focus:ring-[#F57A9B] outline-none"
                required
                type="text"
              />
            </div>
            <div class="space-y-2">
              <label class="text-sm text-[#333333] dark:text-gray-300">شماره تماس (موبایل)</label>
              <input
                v-model="form.phone"
                class="w-full px-4 py-2 rounded-xl border border-[#E9DDD2] dark:border-slate-600 bg-white dark:bg-slate-900 text-[#333333] dark:text-gray-100 focus:ring-2 focus:ring-[#F57A9B] outline-none"
                dir="ltr"
                required
                type="tel"
              />
            </div>
            <div class="space-y-2">
              <label class="text-sm text-[#333333] dark:text-gray-300">استان</label>
              <input
                v-model="form.province"
                class="w-full px-4 py-2 rounded-xl border border-[#E9DDD2] dark:border-slate-600 bg-white dark:bg-slate-900 text-[#333333] dark:text-gray-100 focus:ring-2 focus:ring-[#F57A9B] outline-none"
                required
                type="text"
              />
            </div>
            <div class="space-y-2">
              <label class="text-sm text-[#333333] dark:text-gray-300">شهر</label>
              <input
                v-model="form.city"
                class="w-full px-4 py-2 rounded-xl border border-[#E9DDD2] dark:border-slate-600 bg-white dark:bg-slate-900 text-[#333333] dark:text-gray-100 focus:ring-2 focus:ring-[#F57A9B] outline-none"
                required
                type="text"
              />
            </div>
            <div class="space-y-2 md:col-span-2">
              <label class="text-sm text-[#333333] dark:text-gray-300">نشانی پستی دقیق</label>
              <textarea
                v-model="form.full_address"
                class="w-full px-4 py-2 rounded-xl border border-[#E9DDD2] dark:border-slate-600 bg-white dark:bg-slate-900 text-[#333333] dark:text-gray-100 focus:ring-2 focus:ring-[#F57A9B] outline-none resize-none"
                placeholder="خیابان، کوچه، پلاک، واحد..."
                required
                rows="3"
              ></textarea>
            </div>
            <div class="space-y-2">
              <label class="text-sm text-[#333333] dark:text-gray-300">کد پستی (۱۰ رقمی)</label>
              <input
                v-model="form.postal_code"
                class="w-full px-4 py-2 rounded-xl border border-[#E9DDD2] dark:border-slate-600 bg-white dark:bg-slate-900 text-[#333333] dark:text-gray-100 focus:ring-2 focus:ring-[#F57A9B] outline-none"
                dir="ltr"
                type="text"
              />
            </div>
          </form>
        </div>

        <div
          class="p-6 border-t border-[#E9DDD2] dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 flex items-center justify-end gap-3 mt-auto"
        >
          <button
            :disabled="isSaving"
            class="px-5 py-2.5 text-[#777777] dark:text-gray-300 hover:bg-[#EEDAC5]/30 dark:hover:bg-slate-700 rounded-xl font-medium transition-colors"
            @click="closeModal"
          >
            انصراف
          </button>
          <button
            :disabled="isSaving"
            class="px-6 py-2.5 bg-[#F57A9B] hover:bg-[#DFA9C7] text-white rounded-xl font-medium transition-colors shadow-lg shadow-[#F57A9B]/20 flex items-center gap-2"
            @click="saveAddress"
          >
            <svg
              v-if="isSaving"
              class="animate-spin h-4 w-4 text-white"
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
            {{ isSaving ? 'در حال ثبت...' : 'ثبت و ذخیره' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue'
import addressApi from '@/api/addressApi' // مسیر را با فایل خودتان جایگزین کنید

const addresses = ref<any[]>([])
const isLoading = ref(true)
const isSaving = ref(false)
const isModalOpen = ref(false)

const form = reactive({
  id: null as number | null,
  receiver_name: '',
  phone: '',
  province: '',
  city: '',
  full_address: '',
  postal_code: '',
})

// گرفتن آدرس‌ها از سرور
const fetchAddresses = async () => {
  isLoading.value = true
  try {
    const response = await addressApi.getAddresses()
    addresses.value = response.data
  } catch (error) {
    console.error('خطا در دریافت آدرس‌ها:', error)
    // اینجا می‌توانید یک توست (Toast) خطا نمایش دهید
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchAddresses()
})

const openAddressModal = (address: any = null) => {
  if (address) {
    Object.assign(form, address)
  } else {
    Object.assign(form, {
      id: null,
      receiver_name: '',
      phone: '',
      province: '',
      city: '',
      full_address: '',
      postal_code: '',
    })
  }
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
}

const saveAddress = async () => {
  if (!form.receiver_name || !form.phone || !form.province || !form.city || !form.full_address) {
    alert('لطفا فیلدهای ضروری را پر کنید.')
    return
  }

  isSaving.value = true
  try {
    if (form.id) {
      // ویرایش
      await addressApi.updateAddress(form.id, form)
    } else {
      // افزودن
      await addressApi.createAddress(form)
    }
    await fetchAddresses() // به‌روزرسانی لیست
    closeModal()
  } catch (error) {
    console.error('خطا در ثبت آدرس:', error)
  } finally {
    isSaving.value = false
  }
}

const deleteAddress = async (id: number) => {
  if (confirm('آیا از حذف این آدرس اطمینان دارید؟')) {
    try {
      await addressApi.deleteAddress(id)
      addresses.value = addresses.value.filter((a) => a.id !== id)
    } catch (error) {
      console.error('خطا در حذف آدرس:', error)
    }
  }
}

const setDefault = async (id: number) => {
  try {
    // تغییر ظاهر در لحظه (برای حس کاربری بهتر)
    addresses.value.forEach((a) => (a.is_default = a.id === id))
    await addressApi.setDefaultAddress(id)
    await fetchAddresses() // همگام‌سازی مجدد با سرور
  } catch (error) {
    console.error('خطا در تغییر آدرس پیش‌فرض:', error)
    fetchAddresses() // در صورت خطا برگرداندن به حالت قبل
  }
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #cbd5e1;
  border-radius: 20px;
}
.dark .custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #475569;
}
</style>
