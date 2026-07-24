<template>
  <div class="space-y-6 font-vazir">
    <div>
      <h1 class="text-2xl font-bold text-[#333333] dark:text-white mb-2">تاریخچه سفارشات</h1>
      <p class="text-sm text-[#777777] dark:text-gray-400">
        سفارش‌های ثبت شده، لغو شده و مرجوعی خود را اینجا پیگیری کنید.
      </p>
    </div>

    <!-- تب‌های وضعیت سفارش -->
    <div class="border-b border-[#E9DDD2] dark:border-slate-700">
      <nav aria-label="Tabs" class="flex gap-6 overflow-x-auto pb-[-1px] scrollbar-hide">
        <button
          v-for="tab in tabs"
          :key="tab.value"
          :class="[
            activeTab === tab.value
              ? 'border-[#F57A9B] text-[#F57A9B] dark:border-[#DFA9C7] dark:text-[#DFA9C7]'
              : 'border-transparent text-[#777777] hover:text-[#333333] hover:border-[#E9DDD2] dark:text-gray-400 dark:hover:text-gray-300',
            'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors relative',
          ]"
          @click="activeTab = tab.value"
        >
          {{ tab.name }}
          <span
            v-if="getOrderCount(tab.value) > 0"
            :class="[
              activeTab === tab.value
                ? 'bg-[#F57A9B]/10 text-[#F57A9B] dark:bg-[#DFA9C7]/20 dark:text-[#DFA9C7]'
                : 'bg-[#F5F5F7] text-[#777777] dark:bg-slate-700 dark:text-gray-300',
              'ml-2 py-0.5 px-2.5 rounded-full text-xs',
            ]"
          >
            {{ getOrderCount(tab.value) }}
          </span>
        </button>
      </nav>
    </div>

    <!-- حالت لودینگ -->
    <div v-if="isLoading" class="py-12 flex justify-center">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F57A9B]"></div>
    </div>

    <!-- لیست سفارشات -->
    <div v-else class="space-y-4">
      <template v-if="filteredOrders.length > 0">
        <div
          v-for="order in filteredOrders"
          :key="order.id"
          class="bg-[#FDFBF9] dark:bg-slate-800 rounded-2xl border border-[#E9DDD2] dark:border-slate-700 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
        >
          <div
            class="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E9DDD2]/50 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50"
          >
            <div class="flex flex-wrap items-center gap-x-6 gap-y-3">
              <div class="flex items-center gap-2">
                <!-- استفاده از order.status با اولویت بالا -->
                <span
                  :class="getStatusColor(order.status || order.order_status).text"
                  class="font-bold text-sm"
                >
                  {{ getStatusText(order.status || order.order_status) }}
                </span>
              </div>
              <div class="flex items-center gap-2 text-sm text-[#777777] dark:text-gray-400">
                <span class="font-medium text-[#333333] dark:text-gray-200">{{
                  formatDate(order.created_at)
                }}</span>
                <span class="text-[#E9DDD2] dark:text-slate-600">|</span>
                <span
                  >کد پیگیری:
                  <span class="font-medium text-[#333333] dark:text-gray-200">{{
                    order.tracking_code || order.id
                  }}</span></span
                >
                <span class="text-[#E9DDD2] dark:text-slate-600 hidden sm:inline">|</span>
                <span class="hidden sm:inline"
                  >مبلغ:
                  <span class="font-bold text-[#333333] dark:text-gray-200"
                    >{{ Number(order.total_price).toLocaleString('fa-IR') }} تومان</span
                  ></span
                >
              </div>
            </div>

            <!-- دکمه‌های عملیات (بر اساس payment_status Enum) -->
            <div class="flex gap-2">
              <button
                v-if="order.payment_status === 'pending'"
                class="flex items-center justify-center gap-1 text-sm font-medium text-white bg-[#F57A9B] hover:bg-[#DFA9C7] px-4 py-2 rounded-xl transition-colors shadow-sm shadow-[#F57A9B]/30"
                @click="$router.push(`/user/orders/${order.id}/payment`)"
              >
                تکمیل پرداخت
              </button>

              <span
                v-else-if="order.payment_status === 'pending_verification'"
                class="flex items-center justify-center gap-1 text-sm font-medium text-[#BC846C] bg-[#EEDAC5]/30 dark:bg-amber-900/30 px-4 py-2 rounded-xl border border-[#EEDAC5] dark:border-amber-800"
              >
                در حال بررسی فیش
              </span>

              <span
                v-else-if="order.payment_status === 'failed'"
                class="flex items-center justify-center gap-1 text-sm font-medium text-red-600 bg-red-50 dark:bg-red-900/30 px-4 py-2 rounded-xl border border-red-200 dark:border-red-800"
              >
                پرداخت ناموفق
              </span>

              <span
                v-else-if="order.payment_status === 'paid'"
                class="flex items-center justify-center gap-1 text-sm font-medium text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 px-4 py-2 rounded-xl border border-emerald-200 dark:border-emerald-800"
              >
                پرداخت تایید شده
              </span>

              <span
                v-else-if="['canceled', 'cancelled', 'expired'].includes(order.payment_status)"
                class="flex items-center justify-center gap-1 text-sm font-medium text-[#777777] bg-[#F5F5F7] dark:text-gray-400 dark:bg-gray-800 px-4 py-2 rounded-xl border border-[#E9DDD2] dark:border-gray-700"
              >
                لغو شده
              </span>

              <!-- دکمه جزئیات -->
              <button
                class="flex items-center justify-center gap-1 text-sm font-medium text-[#BC846C] dark:text-[#EEDAC5] hover:text-[#333333] bg-[#EEDAC5]/40 hover:bg-[#EEDAC5]/70 dark:bg-[#EEDAC5]/10 dark:hover:bg-[#EEDAC5]/20 px-4 py-2 rounded-xl transition-colors"
                @click="$router.push(`/user/orders/${order.id}`)"
              >
                جزئیات
              </button>
            </div>
          </div>
        </div>
      </template>

      <div
        v-else
        class="py-16 flex flex-col items-center justify-center text-center bg-[#FDFBF9] dark:bg-slate-800 rounded-2xl border border-dashed border-[#E9DDD2] dark:border-slate-700"
      >
        <p class="text-[#777777] dark:text-gray-400 max-w-md mx-auto">
          سفارشی در این وضعیت یافت نشد.
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import { getOrdersApi } from '@/api/ordersApi'

const isLoading = ref(true)
const orders = ref<any[]>([])
const activeTab = ref('current')

const tabs = [
  { name: 'جاری', value: 'current' },
  { name: 'تحویل شده', value: 'delivered' },
  { name: 'لغو شده', value: 'cancelled' },
  { name: 'مرجوعی', value: 'returned' },
]

const mapStatusToTab = (status: string) => {
  if (!status) return 'current'
  if (['pending', 'pending_payment', 'pending_review', 'processing', 'shipped'].includes(status))
    return 'current'
  if (status === 'delivered') return 'delivered'
  if (['cancelled', 'canceled', 'failed'].includes(status)) return 'cancelled'
  if (status === 'returned') return 'returned'

  return 'current'
}

const filteredOrders = computed(() => {
  return orders.value.filter(
    (order) => mapStatusToTab(order.status || order.order_status) === activeTab.value,
  )
})

const getOrderCount = (tabValue: string) => {
  return orders.value.filter(
    (order) => mapStatusToTab(order.status || order.order_status) === tabValue,
  ).length
}

const getStatusText = (status: string) => {
  const map: Record<string, string> = {
    pending: 'ثبت اولیه / در انتظار',
    pending_payment: 'در انتظار پرداخت',
    pending_review: 'در انتظار بررسی',
    processing: 'در حال پردازش',
    shipped: 'ارسال شده',
    delivered: 'تحویل شده',
    cancelled: 'لغو شده',
    canceled: 'لغو شده',
    returned: 'مرجوع شده',
    failed: 'ناموفق / مشکل‌دار',
  }
  return map[status] || 'نامشخص'
}

const getStatusColor = (status: string) => {
  const colors: Record<string, { text: string }> = {
    pending: { text: 'text-[#BC846C] dark:text-orange-400' },
    pending_payment: { text: 'text-[#BC846C] dark:text-orange-400' },
    pending_review: { text: 'text-[#F57A9B] dark:text-[#DFA9C7]' },
    processing: { text: 'text-indigo-600 dark:text-indigo-400' },
    shipped: { text: 'text-teal-600 dark:text-teal-400' },
    delivered: { text: 'text-emerald-600 dark:text-emerald-400' },
    cancelled: { text: 'text-[#777777] dark:text-gray-400' },
    canceled: { text: 'text-[#777777] dark:text-gray-400' },
    returned: { text: 'text-yellow-600 dark:text-yellow-400' },
    failed: { text: 'text-red-500 dark:text-red-400' },
  }
  return colors[status] || { text: 'text-[#777777]' }
}

const formatDate = (date: string) => new Date(date).toLocaleDateString('fa-IR')

onMounted(async () => {
  try {
    const res = await getOrdersApi()
    orders.value = res.data?.data || res.data
  } catch (err) {
    console.error('خطا در دریافت سفارشات:', err)
  } finally {
    isLoading.value = false
  }
})
</script>
