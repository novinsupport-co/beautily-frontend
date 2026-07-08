<template>
  <div class="space-y-6 font-vazir">
    <!-- هدر صفحه -->
    <div>
      <h1 class="text-2xl font-bold text-gray-800 dark:text-white mb-2">تاریخچه تراکنش‌ها</h1>
      <p class="text-sm text-gray-500 dark:text-gray-400">
        لیست پرداخت‌ها و شارژهای حساب کاربری شما.
      </p>
    </div>

    <!-- خلاصه مالی -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div
        class="bg-gradient-to-l from-blue-600 to-blue-400 rounded-2xl p-5 text-white shadow-lg shadow-blue-500/20 flex items-center justify-between"
      >
        <div>
          <p class="text-blue-100 text-sm font-medium mb-1">مجموع پرداختی‌های موفق</p>
          <div class="text-2xl font-bold font-mono">
            {{ totalSuccessAmount.toLocaleString('fa-IR') }}
            <span class="text-sm font-normal font-vazir">تومان</span>
          </div>
        </div>
      </div>
    </div>

    <!-- لیست تراکنش‌ها -->
    <div
      class="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 overflow-hidden shadow-sm"
    >
      <div v-if="isLoading" class="py-12 flex justify-center">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>

      <div v-else-if="transactions.length > 0" class="overflow-x-auto">
        <table class="w-full text-right text-sm text-gray-500 dark:text-gray-400">
          <thead
            class="text-xs text-gray-700 dark:text-gray-300 uppercase bg-gray-50 dark:bg-slate-700/50"
          >
            <tr>
              <th class="px-6 py-4 font-bold">عنوان / نوع تراکنش</th>
              <th class="px-6 py-4 font-bold">مبلغ (تومان)</th>
              <th class="px-6 py-4 font-bold">تاریخ و زمان</th>
              <th class="px-6 py-4 font-bold">شماره پیگیری</th>
              <th class="px-6 py-4 font-bold">وضعیت</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="trx in transactions"
              :key="trx.id"
              class="border-b dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700/30"
            >
              <td class="px-6 py-4">
                <span class="font-bold text-gray-800 dark:text-gray-200">{{
                  trx.description || 'پرداخت سفارش'
                }}</span>
              </td>
              <td class="px-6 py-4 font-mono text-base text-gray-900 dark:text-white">
                {{ Number(trx.amount).toLocaleString('fa-IR') }}
              </td>
              <td class="px-6 py-4">
                <div class="flex flex-col">
                  <span>{{ new Date(trx.created_at).toLocaleDateString('fa-IR') }}</span>
                  <span class="text-xs text-gray-400">{{
                    new Date(trx.created_at).toLocaleTimeString('fa-IR')
                  }}</span>
                </div>
              </td>
              <td class="px-6 py-4 font-mono text-xs">
                <div class="text-gray-800 dark:text-gray-300">{{ trx.tracking_code || '---' }}</div>
              </td>
              <td class="px-6 py-4">
                <span
                  v-if="trx.status === 'success'"
                  class="text-green-600 bg-green-50 px-2.5 py-1 rounded-lg"
                  >موفق</span
                >
                <span
                  v-else-if="trx.status === 'pending'"
                  class="text-orange-600 bg-orange-50 px-2.5 py-1 rounded-lg"
                  >در انتظار</span
                >
                <span v-else class="text-red-600 bg-red-50 px-2.5 py-1 rounded-lg">ناموفق</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-else class="py-12 flex flex-col items-center justify-center text-center">
        <p class="text-gray-500 dark:text-gray-400">تا کنون هیچ تراکنشی ثبت نشده است.</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import { getTransactionsApi } from '@/api/paymentApi'

const isLoading = ref(true)
const transactions = ref<any[]>([])

// محاسبه جمع کل پرداختی‌های موفق از دیتا
const totalSuccessAmount = computed(() => {
  return transactions.value
    .filter((t) => t.status === 'success')
    .reduce((sum, t) => sum + Number(t.amount), 0)
})

onMounted(async () => {
  try {
    const res = await getTransactionsApi()
    transactions.value = res.data?.data || res.data || []
  } catch (error) {
    console.error('خطا در دریافت تراکنش‌ها', error)
  } finally {
    isLoading.value = false
  }
})
</script>
