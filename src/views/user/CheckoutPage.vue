<template>
  <div class="container mx-auto px-4 py-8 font-vazir bg-[#F5F5F7] min-h-screen" dir="rtl">
    <h1 class="text-2xl font-bold mb-8 text-[#333333] flex items-center gap-2">
      <svg
        class="h-6 w-6 text-[#DFA9C7]"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
        />
      </svg>
      تکمیل اطلاعات ارسال و پرداخت
    </h1>

    <div class="flex flex-col lg:flex-row gap-8">
      <!-- ستون سمت راست: اطلاعات و اقلام -->
      <div class="w-full lg:w-2/3 space-y-6">
        <!-- بخش ۱: انتخاب آدرس -->
        <div class="bg-[#FFFFFF] rounded-2xl shadow-sm border border-[#EEDAC5] p-6">
          <h2 class="text-lg font-bold mb-4 border-b pb-3 text-[#333333]">۱. انتخاب آدرس تحویل</h2>
          <!-- لیست آدرس‌های کاربر -->
          <div v-if="userAddresses.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div
              v-for="addr in userAddresses"
              :key="addr.id"
              :class="
                selectedAddressId === addr.id
                  ? 'border-[#FC9FAF] bg-[#F3F5F8] ring-2 ring-[#DFA9C7]'
                  : 'border-[#EEDAC5] hover:border-[#DFA9C7]'
              "
              class="border rounded-xl p-4 cursor-pointer transition-all relative"
              @click="selectAddress(addr)"
            >
              <div
                v-if="selectedAddressId === addr.id"
                class="absolute top-3 left-3 text-[#FC9FAF]"
              >
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    clip-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    fill-rule="evenodd"
                  ></path>
                </svg>
              </div>
              <h3 class="font-bold text-[#333333] text-sm mb-1">
                {{ addr.receiver_name || addr.name || 'آدرس ذخیره شده' }}
              </h3>
              <p class="text-xs text-[#777777] mb-2 leading-relaxed line-clamp-2">
                {{ addr.province }}، {{ addr.city }}، {{ addr.address }}
              </p>
              <span class="text-xs text-[#777777] block" dir="ltr">{{
                addr.receiver_phone || addr.phone
              }}</span>
            </div>
          </div>
          <div v-else class="text-sm text-[#777777] bg-[#EEDAC5] p-3 rounded-lg mb-4 opacity-80">
            شما آدرس ذخیره شده‌ای ندارید. لطفاً اطلاعات گیرنده را در فرم زیر وارد کنید.
          </div>

          <!-- فرم آدرس -->
          <form
            class="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#F5F5F7] p-4 rounded-xl border border-[#EEDAC5]"
          >
            <div>
              <label class="block text-xs font-bold text-[#777777] mb-1">نام گیرنده</label>
              <input
                v-model="form.receiver_name"
                class="w-full px-3 py-2 text-sm rounded-lg border border-[#EEDAC5] focus:ring-2 focus:ring-[#DFA9C7] outline-none"
                type="text"
              />
            </div>
            <div>
              <label class="block text-xs font-bold text-[#777777] mb-1">موبایل</label>
              <input
                v-model="form.receiver_phone"
                class="w-full px-3 py-2 text-sm rounded-lg border border-[#EEDAC5] focus:ring-2 focus:ring-[#DFA9C7] outline-none"
                dir="ltr"
                type="tel"
              />
            </div>
            <div>
              <label class="block text-xs font-bold text-[#777777] mb-1">استان</label>
              <input
                v-model="form.province"
                class="w-full px-3 py-2 text-sm rounded-lg border border-[#EEDAC5] focus:ring-2 focus:ring-[#DFA9C7] outline-none"
                type="text"
              />
            </div>
            <div>
              <label class="block text-xs font-bold text-[#777777] mb-1">شهر</label>
              <input
                v-model="form.city"
                class="w-full px-3 py-2 text-sm rounded-lg border border-[#EEDAC5] focus:ring-2 focus:ring-[#DFA9C7] outline-none"
                type="text"
              />
            </div>
            <div class="md:col-span-2">
              <label class="block text-xs font-bold text-[#777777] mb-1">آدرس دقیق</label>
              <textarea
                v-model="form.address"
                class="w-full px-3 py-2 text-sm rounded-lg border border-[#EEDAC5] focus:ring-2 focus:ring-[#DFA9C7] outline-none resize-none"
                rows="2"
              ></textarea>
            </div>
            <div>
              <label class="block text-xs font-bold text-[#777777] mb-1">کد پستی</label>
              <input
                v-model="form.postal_code"
                class="w-full px-3 py-2 text-sm rounded-lg border border-[#EEDAC5] focus:ring-2 focus:ring-[#DFA9C7] outline-none"
                type="text"
              />
            </div>
          </form>
        </div>

        <!-- بخش ۲: اقلام سفارش -->
        <div class="bg-[#FFFFFF] rounded-2xl shadow-sm border border-[#EEDAC5] p-6">
          <h2 class="text-lg font-bold mb-4 border-b pb-3 text-[#333333]">۲. اقلام سفارش شما</h2>
          <div class="space-y-4">
            <div
              v-for="item in cartStore.items"
              :key="item.id"
              class="flex gap-4 border border-[#F3F5F8] p-3 rounded-xl hover:shadow-md transition bg-[#F5F5F7]"
            >
              <div
                class="w-20 h-20 bg-[#FFFFFF] border border-[#EEDAC5] rounded-lg overflow-hidden flex-shrink-0"
              >
                <img
                  v-if="item.image"
                  :alt="item.product_name"
                  :src="item.image"
                  class="w-full h-full object-cover"
                />
                <div
                  v-else
                  class="w-full h-full flex items-center justify-center text-[#777777] text-xs"
                >
                  بدون عکس
                </div>
              </div>
              <div class="flex flex-col justify-between flex-grow">
                <div class="text-sm font-bold text-[#333333]">
                  {{ item.product_name || 'محصول نامشخص' }}
                </div>
                <div v-if="item.variant_name" class="text-xs text-[#777777]">
                  مدل/رنگ: {{ item.variant_name }}
                </div>
                <div class="flex justify-between items-end mt-2">
                  <span class="text-xs font-bold text-[#777777]">تعداد: {{ item.quantity }}</span>
                  <span class="text-sm font-bold text-[#FC9FAF]"
                    >{{
                      formatPrice(item.total_price || item.unit_price * item.quantity)
                    }}
                    تومان</span
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- خلاصه سفارش (ستون سمت چپ) -->
      <div class="w-full lg:w-1/3">
        <div class="bg-[#FFFFFF] rounded-2xl shadow-sm border border-[#EEDAC5] p-6 sticky top-24">
          <h2 class="text-lg font-bold mb-6 border-b pb-3 text-[#333333]">پیش‌فاکتور نهایی</h2>

          <!-- اطلاعات مبالغ -->
          <div class="space-y-4 text-sm text-[#777777] mb-6">
            <div class="flex justify-between items-center">
              <span>مبلغ کالاها</span>
              <span class="font-bold text-[#333333]"
                >{{ formatPrice(cartStore.summary?.subtotal) }} تومان</span
              >
            </div>

            <div v-if="cartStore.summary?.tax_amount > 0" class="flex justify-between items-center">
              <span>مالیات</span>
              <span class="font-bold text-[#333333]"
                >{{ formatPrice(cartStore.summary?.tax_amount) }} تومان</span
              >
            </div>

            <div class="flex justify-between items-center">
              <span>هزینه ارسال</span>
              <span class="font-bold text-[#333333]">
                {{
                  cartStore.summary?.shipping_cost === 0
                    ? 'رایگان'
                    : formatPrice(cartStore.summary?.shipping_cost) + ' تومان'
                }}
              </span>
            </div>
          </div>

          <!-- بخش انتخاب روش پرداخت در داخل پیش‌فاکتور -->
          <div class="border-t border-dashed border-[#EEDAC5] pt-4 mb-6">
            <h3 class="text-sm font-bold text-[#333333] mb-3">روش پرداخت:</h3>

            <div
              v-if="shopSettings.is_online_payment_active || shopSettings.is_card_payment_active"
              class="space-y-2"
            >
              <label
                v-if="shopSettings.is_online_payment_active"
                :class="
                  paymentMethod === 'zarinpal'
                    ? 'border-[#FC9FAF] bg-[#F3F5F8] text-[#DFA9C7]'
                    : 'border-[#EEDAC5] hover:border-[#DFA9C7] text-[#777777]'
                "
                class="flex items-center p-3 border rounded-xl cursor-pointer transition-all"
              >
                <input v-model="paymentMethod" class="peer sr-only" type="radio" value="zarinpal" />
                <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                  />
                </svg>
                <span class="text-sm font-bold text-[#333333]">درگاه پرداخت اینترنتی</span>
                <span
                  v-if="paymentMethod === 'zarinpal'"
                  class="mr-auto w-3 h-3 rounded-full bg-[#FC9FAF]"
                ></span>
              </label>

              <label
                v-if="shopSettings.is_card_payment_active"
                :class="
                  paymentMethod === 'transfer'
                    ? 'border-[#FC9FAF] bg-[#F3F5F8] text-[#DFA9C7]'
                    : 'border-[#EEDAC5] hover:border-[#DFA9C7] text-[#777777]'
                "
                class="flex items-center p-3 border rounded-xl cursor-pointer transition-all"
              >
                <input v-model="paymentMethod" class="peer sr-only" type="radio" value="transfer" />
                <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                  />
                </svg>
                <span class="text-sm font-bold text-[#333333]">کارت به کارت</span>
                <span
                  v-if="paymentMethod === 'transfer'"
                  class="mr-auto w-3 h-3 rounded-full bg-[#FC9FAF]"
                ></span>
              </label>
            </div>

            <div v-else class="text-xs bg-red-50 text-red-600 p-2 rounded-lg text-center">
              هیچ روش پرداختی فعال نیست.
            </div>
          </div>

          <!-- مبلغ کل و دکمه پرداخت -->
          <div class="border-t border-dashed border-[#EEDAC5] pt-4 mb-6">
            <div class="flex justify-between items-center text-lg font-black">
              <span class="text-[#333333]">قابل پرداخت:</span>
              <span class="text-[#FC9FAF]"
                >{{ formatPrice(cartStore.summary?.total_payable) }} تومان</span
              >
            </div>
          </div>

          <div
            v-if="errorMessage"
            class="bg-red-50 text-red-600 p-3 rounded-xl text-xs font-bold mb-4"
          >
            {{ errorMessage }}
          </div>

          <button
            :class="
              isLoading || cartStore.items.length === 0 || !paymentMethod
                ? 'bg-[#777777] cursor-not-allowed opacity-50'
                : 'bg-[#FC9FAF] hover:bg-[#DFA9C7] shadow-lg shadow-[#EEDAC5]'
            "
            :disabled="isLoading || cartStore.items.length === 0 || !paymentMethod"
            class="w-full py-4 rounded-xl font-bold text-[#FFFFFF] transition-all flex justify-center items-center gap-2"
            @click="submitCheckout"
          >
            <span v-if="isLoading">در حال پردازش...</span>
            <span v-else>پرداخت و ثبت نهایی سفارش</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref, watch } from 'vue' // اضافه شدن watch
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { useAuthStore } from '@/stores/auth'
import { useNotificationStore } from '@/stores/notification'
import axiosInstance from '@/lib/axios'
import addressApi from '@/api/addressApi'

const router = useRouter()
const cartStore = useCartStore()
const authStore = useAuthStore()
const notificationStore = useNotificationStore()

const isLoading = ref(false)
const errorMessage = ref('')
const userAddresses = ref<any[]>([])
const selectedAddressId = ref<number | null>(null)

const shopSettings = ref({
  is_online_payment_active: false,
  is_card_payment_active: false,
})

const paymentMethod = ref('')

const form = reactive({
  receiver_name: '',
  receiver_phone: '',
  province: '',
  city: '',
  address: '',
  postal_code: '',
  payment_method: '',
})

const formatPrice = (price: number | string | undefined) => {
  if (price === undefined || price === null) return '۰'
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

// گوش دادن مداوم به اطلاعات کاربر برای اعتبارسنجی دقیق و بدون تاخیر
watch(
  () => authStore.user,
  (user) => {
    if (!user) return // اگر اطلاعات کاربر هنوز از بک‌اند در حال دریافت است، صبر کن

    // بررسی کد ملی (هم مقدار خالی و هم کلمه 'null')
    if (!user.national_code || user.national_code === 'null') {
      notificationStore.warning('برای ثبت سفارش، ابتدا باید کد ملی خود را در پروفایل تکمیل کنید.')
      router.push('/user/profile')
      return
    }

    // بررسی ثبت بودن موبایل
    if (!user.mobile || user.mobile === 'null') {
      notificationStore.warning('برای ثبت سفارش، ابتدا باید شماره موبایل خود را ثبت کنید.')
      router.push('/user/profile')
      return
    }

    // بررسی تایید بودن موبایل
    if (!user.mobile_verified_at || user.mobile_verified_at === 'null') {
      notificationStore.warning('برای ثبت سفارش، شماره موبایل شما باید تایید شده باشد.')
      router.push('/user/profile')
      return
    }
  },
  { immediate: true }, // بررسی در همان لحظه ورود به صفحه
)

onMounted(async () => {
  // دریافت آدرس‌های کاربر
  try {
    const response = await addressApi.getAddresses()
    userAddresses.value = response.data.data || response.data || []
    if (userAddresses.value.length > 0) {
      selectAddress(userAddresses.value[0])
    }
  } catch (error) {
    console.error('خطا در دریافت آدرس‌ها', error)
  }

  // دریافت تنظیمات درگاه پرداخت
  try {
    const settingsRes = await axiosInstance.get('/shop-settings')
    const settings = settingsRes.data?.data || settingsRes.data

    if (settings) {
      shopSettings.value.is_online_payment_active =
        String(settings.is_online_payment_active) === '1' ||
        String(settings.is_online_payment_active).toLowerCase() === 'true'
      shopSettings.value.is_card_payment_active =
        String(settings.is_card_payment_active) === '1' ||
        String(settings.is_card_payment_active).toLowerCase() === 'true'

      if (shopSettings.value.is_online_payment_active) {
        paymentMethod.value = 'zarinpal'
      } else if (shopSettings.value.is_card_payment_active) {
        paymentMethod.value = 'transfer'
      }
    }
  } catch (error) {
    console.error('خطا در دریافت تنظیمات فروشگاه', error)
    shopSettings.value.is_online_payment_active = true
    shopSettings.value.is_card_payment_active = true
    paymentMethod.value = 'zarinpal'
  }
})

const selectAddress = (addr: any) => {
  selectedAddressId.value = addr.id
  form.receiver_name = addr.receiver_name || addr.name || ''
  form.receiver_phone = addr.receiver_phone || addr.phone || ''
  form.province = addr.province || ''
  form.city = addr.city || ''
  form.address = addr.full_address || addr.address || ''
  form.postal_code = addr.postal_code || ''
}

const submitCheckout = async () => {
  if (!form.province || !form.city || !form.address) {
    errorMessage.value = 'لطفاً آدرس تحویل را به صورت کامل مشخص کنید.'
    return
  }

  if (!paymentMethod.value) {
    errorMessage.value = 'لطفاً یک روش پرداخت انتخاب کنید.'
    return
  }

  isLoading.value = true
  errorMessage.value = ''
  form.payment_method = paymentMethod.value

  try {
    const response = await axiosInstance.post('/checkout/process', form)

    cartStore.items = []
    cartStore.summary = {
      subtotal: 0,
      tax_amount: 0,
      packaging_cost: 0,
      shipping_cost: 0,
      total_payable: 0,
    }

    if (response.data.payment_url) {
      window.location.href = response.data.payment_url
    } else {
      notificationStore.success('سفارش شما با موفقیت ثبت شد!')
      router.push('/user/orders')
    }
  } catch (error: any) {
    errorMessage.value = error.response?.data?.message || 'خطایی در ثبت سفارش رخ داد.'
  } finally {
    isLoading.value = false
  }
}
</script>
