<template>
  <div class="max-w-6xl mx-auto p-4 sm:p-6 space-y-6">
    <!-- هدر و دکمه بازگشت -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div class="flex items-center gap-3">
        <button
          class="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors"
          @click="$router.push('/user/orders')"
        >
          <svg
            class="h-5 w-5"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              clip-rule="evenodd"
              d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
              fill-rule="evenodd"
            />
          </svg>
        </button>
        <h1 class="text-2xl font-bold text-gray-800 dark:text-white">جزئیات سفارش</h1>
      </div>
    </div>

    <!-- حالت لودینگ -->
    <div v-if="isLoading" class="animate-pulse space-y-4">
      <div class="h-32 bg-gray-200 dark:bg-gray-800 rounded-2xl w-full"></div>
      <div class="h-64 bg-gray-200 dark:bg-gray-800 rounded-2xl w-full"></div>
    </div>

    <!-- ارور در دریافت اطلاعات -->
    <div
      v-else-if="error"
      class="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-6 rounded-2xl text-center border border-red-100 dark:border-red-800"
    >
      <p class="font-medium text-lg">{{ error }}</p>
      <button
        class="mt-4 px-6 py-2 bg-red-100 dark:bg-red-900/50 rounded-xl hover:bg-red-200 transition-colors"
        @click="fetchOrderDetails"
      >
        تلاش مجدد
      </button>
    </div>

    <!-- محتوای اصلی سفارش -->
    <div v-else-if="order" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- ستون سمت راست: اطلاعات و لیست محصولات -->
      <div class="lg:col-span-2 space-y-6">
        <!-- کارت مشخصات کلی سفارش -->
        <div
          class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700"
        >
          <div
            class="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 dark:border-gray-700 pb-4 mb-4"
          >
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">کد سفارش</p>
              <p class="font-bold text-lg text-gray-800 dark:text-white">#{{ order.id }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">تاریخ ثبت</p>
              <p class="font-medium text-gray-800 dark:text-white dir-ltr text-right">
                {{ formatDate(order.created_at) }}
              </p>
            </div>
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">وضعیت</p>
              <span
                :class="getStatusBadge(order.payment_status).class"
                class="px-3 py-1 rounded-full text-sm font-medium inline-block"
              >
                {{ getStatusBadge(order.payment_status).label }}
              </span>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- جایگزین بخش آدرس ارسال در Template -->
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400 mb-2">آدرس ارسال</p>

              <!-- تگ p به div تغییر یافت -->
              <div v-if="order.shipping_address || order.shipping_address_snapshot">
                <span v-if="getAddress(order).province">{{ getAddress(order).province }}، </span>
                <span v-if="getAddress(order).city">{{ getAddress(order).city }}، </span>
                <span>{{ getAddress(order).address || getAddress(order).full_address }}</span>
                <div class="mt-1 text-gray-500">کد پستی: {{ getAddress(order).postal_code }}</div>
              </div>

              <p v-else>آدرس ثبت نشده است</p>

              <!-- تگ p به div تغییر یافت -->
              <div class="text-sm text-gray-500 mt-2">
                <div>گیرنده: {{ order.receiver_name || order.user?.name || '-' }}</div>
                <div>تماس: {{ order.receiver_phone || order.user?.mobile || '-' }}</div>
              </div>
            </div>

            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400 mb-2">روش پرداخت</p>
              <p class="text-sm text-gray-800 dark:text-gray-200 font-medium">
                {{ getPaymentMethodLabel(order.payment_method) }}
              </p>
            </div>
          </div>
        </div>

        <!-- کارت لیست محصولات -->
        <div
          class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700"
        >
          <h2 class="text-lg font-bold text-gray-800 dark:text-white mb-4">
            اقلام سفارش ({{ order.items?.length || 0 }} کالا)
          </h2>

          <div class="space-y-4">
            <div
              v-for="item in order.items"
              :key="item.id"
              class="flex items-center gap-4 p-4 rounded-xl border border-gray-100 dark:border-gray-700/50 bg-gray-50/50 dark:bg-gray-900/20"
            >
              <!-- تصویر محصول -->
              <!-- تصویر محصول -->
              <div
                class="w-16 h-16 shrink-0 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden flex items-center justify-center"
              >
                <!-- نمایش تصویر با اولویت thumbnail و سپس gallery بر اساس ساختار ProductResource -->
                <img
                  v-if="
                    item.product?.images?.thumbnail?.urls?.medium ||
                    item.product?.images?.thumbnail?.url
                  "
                  :alt="item.product?.title || item.name"
                  :src="
                    item.product.images.thumbnail.urls?.medium || item.product.images.thumbnail.url
                  "
                  class="w-16 h-16 shrink-0 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
                />
                <img
                  v-else-if="item.product?.images?.gallery?.[0]?.urls?.medium"
                  :alt="item.product?.title || item.name"
                  :src="item.product.images.gallery[0].urls.medium"
                  class="w-16 h-16 shrink-0 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
                />
                <svg
                  v-else
                  class="w-8 h-8 text-gray-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                  ></path>
                </svg>
              </div>

              <div class="flex-1 min-w-0">
                <h3 class="text-sm font-bold text-gray-800 dark:text-gray-100 truncate">
                  {{ item.name || item.product?.title || 'محصول نامشخص' }}
                </h3>
                <div class="flex items-center gap-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
                  <span>تعداد: {{ item.quantity }}</span>
                  <span>فی: {{ formatPrice(item.price) }} تومان</span>
                </div>
              </div>

              <div class="text-left shrink-0">
                <p class="font-bold text-gray-800 dark:text-white">
                  {{ formatPrice(item.price * item.quantity) }}
                </p>
                <p class="text-xs text-gray-400 mt-1">تومان</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ستون سمت چپ: فاکتور و پرداخت -->
      <div class="space-y-6">
        <!-- فاکتور -->
        <div
          class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 sticky top-6"
        >
          <h2 class="text-lg font-bold text-gray-800 dark:text-white mb-4">جزئیات پرداخت</h2>

          <div class="space-y-3 text-sm">
            <div class="flex justify-between text-gray-600 dark:text-gray-400">
              <span>مبلغ کالاها</span>
              <span>{{ formatPrice(order.total_items_price) }} تومان</span>
            </div>
            <div class="flex justify-between text-gray-600 dark:text-gray-400">
              <span>هزینه ارسال</span>
              <span>{{ formatPrice(order.shipping_cost || 0) }} تومان</span>
            </div>
            <div class="flex justify-between text-gray-600 dark:text-gray-400">
              <span>مالیات</span>
              <span>{{ formatPrice(order.tax_amount || 0) }} تومان</span>
            </div>
            <div v-if="order.total_discount > 0" class="flex justify-between text-red-500">
              <span>تخفیف</span>
              <span>- {{ formatPrice(order.total_discount) }} تومان</span>
            </div>

            <div
              class="border-t border-gray-100 dark:border-gray-700 my-4 pt-4 flex justify-between items-center"
            >
              <span class="font-bold text-gray-800 dark:text-white text-base">مبلغ نهایی</span>
              <span class="font-bold text-xl text-blue-600 dark:text-blue-400">
                {{ formatPrice(order.payable_amount || order.total_price) }}
                <span class="text-sm font-normal text-gray-500">تومان</span>
              </span>
            </div>
          </div>

          <!-- دکمه پرداخت (نمایش برای کارت به کارت و وضعیت 1) -->
          <!-- دکمه پرداخت (فقط برای حالت pending) -->
          <button
            v-if="order.payment_status === 'pending' || order.status === 'pending'"
            class="w-full mt-6 py-3 px-4 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm shadow-orange-500/30"
            @click="$router.push(`/user/orders/${order.id}/payment`)"
          >
            تکمیل پرداخت / آپلود فیش
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from '@/lib/axios'

const route = useRoute()
const router = useRouter()

const order = ref<any>(null)
const isLoading = ref(true)
const error = ref('')

// دریافت جزئیات سفارش
const fetchOrderDetails = async () => {
  isLoading.value = true
  error.value = ''
  try {
    const orderId = route.params.id
    const response = await axios.get(`/orders/${orderId}`)
    // استخراج دیتا با توجه به ساختار خروجی لاراول
    order.value = response.data.data || response.data
  } catch (err: any) {
    error.value = err.response?.data?.message || 'خطا در دریافت اطلاعات سفارش.'
  } finally {
    isLoading.value = false
  }
}

// فرمت‌کننده قیمت
const formatPrice = (price: number | string | undefined) => {
  if (!price) return '0'
  return Number(price).toLocaleString('fa-IR')
}

// فرمت‌کننده تاریخ
const formatDate = (dateString: string) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('fa-IR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// استخراج آدرس امن از اسنپ‌شات یا relation
// اصلاح تابع در بخش Script
const getAddress = (order: any) => {
  return order.shipping_address || order.shipping_address_snapshot || {}
}

// تعیین نام متنی روش پرداخت
const getPaymentMethodLabel = (method: string) => {
  const methods: Record<string, string> = {
    online: 'پرداخت آنلاین',
    transfer: 'کارت به کارت',
    cash: 'پرداخت در محل',
    wallet: 'کیف پول',
  }
  return methods[method] || method || 'نامشخص'
}

// تبدیل اعداد وضعیت به رنگ و متن (سازگار با اعداد ثابت مدل لاراول)
// تبدیل مقادیر ENUM به رنگ و متن
const getStatusBadge = (status: string) => {
  const badges: Record<string, { label: string; class: string }> = {
    pending: {
      label: 'در انتظار پرداخت',
      class: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
    },
    pending_verification: {
      label: 'در انتظار تایید فیش',
      class: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    },
    paid: {
      label: 'پرداخت شده',
      class: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    },
    failed: {
      label: 'پرداخت ناموفق',
      class: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    },
    canceled: {
      label: 'لغو شده',
      class: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    },
    expired: {
      label: 'منقضی شده (لغو سیستمی)',
      class: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
    },
  }
  return badges[status] || { label: 'نامشخص', class: 'bg-gray-100 text-gray-700' }
}

onMounted(() => {
  fetchOrderDetails()
})
</script>

<style scoped>
.dir-ltr {
  direction: ltr;
  unicode-bidi: embed;
}
</style>
