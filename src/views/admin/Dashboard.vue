<template>
  <div class="p-6 md:p-10 space-y-10 animate-in fade-in duration-700 font-iransans">
    <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div
        v-for="i in 4"
        :key="i"
        class="bg-white dark:bg-slate-900 p-6 rounded-[2rem] h-32 animate-pulse border border-slate-50 dark:border-slate-800"
      ></div>
    </div>

    <template v-else>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div
          v-for="(stat, index) in statCards"
          :key="index"
          class="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-50 dark:border-slate-800 shadow-sm hover:translate-y-[-5px] transition-all duration-300"
        >
          <div class="flex items-center gap-4">
            <span
              :class="stat.bg"
              class="text-3xl p-4 rounded-[1.5rem] flex items-center justify-center shadow-inner"
            >
              {{ stat.icon }}
            </span>
            <div>
              <p class="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                {{ stat.title }}
              </p>
              <h3 class="text-xl font-iransans-bold mt-1 text-slate-800 dark:text-white">
                {{ stat.value }}
              </h3>
            </div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div
          class="lg:col-span-2 bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-50 dark:border-slate-800 shadow-sm relative overflow-hidden"
        >
          <div class="flex justify-between items-center mb-10">
            <h3
              class="text-lg font-iransans-bold flex items-center gap-2 text-slate-800 dark:text-white"
            >
              <span class="w-2 h-6 bg-indigo-600 rounded-full"></span> روند فروش هفته اخیر
            </h3>
            <span
              class="text-[10px] bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 px-3 py-1 rounded-full font-bold"
              >بروزرسانی آنی</span
            >
          </div>

          <div class="h-80 relative">
            <div
              v-if="!chartData.length"
              class="absolute inset-0 flex items-center justify-center text-slate-400 text-sm italic"
            >
              داده‌ای برای ۷ روز اخیر ثبت نشده است.
            </div>
            <div
              class="flex items-end justify-between h-full px-4 border-b border-slate-100 dark:border-slate-800 pb-2"
            >
              <div
                v-for="day in chartData"
                :key="day.date"
                class="group relative flex flex-col items-center flex-1 mx-1"
              >
                <div
                  class="absolute -top-10 left-1/2 -translate-x-1/2 text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-all bg-slate-800 text-white px-3 py-1.5 rounded-xl z-20 shadow-xl whitespace-nowrap"
                >
                  {{ formatPrice(day.total) }} تومان
                </div>
                <div
                  :style="{ height: (day.total / maxSales) * 100 + '%' }"
                  class="w-full max-w-[40px] bg-indigo-500 rounded-t-xl group-hover:bg-indigo-400 transition-all shadow-[0_-4px_15px_rgba(79,70,229,0.2)] dark:shadow-none min-h-[4px]"
                ></div>
                <span class="text-[10px] text-slate-400 mt-3 font-medium">{{
                  formatDate(day.date)
                }}</span>
              </div>
            </div>
          </div>
        </div>

        <div
          class="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-50 dark:border-slate-800 shadow-sm"
        >
          <h3 class="text-lg font-iransans-bold mb-8 flex items-center gap-2 text-rose-600">
            <span class="w-2 h-6 bg-rose-600 rounded-full"></span> هشدار موجودی انبار
          </h3>
          <div class="space-y-4 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
            <div v-if="!lowStock.length" class="text-center py-10 text-slate-400 text-sm">
              موجودی تمام محصولات کافی است ✅
            </div>
            <div
              v-for="item in lowStock"
              :key="item.id"
              class="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 hover:border-rose-300 transition-colors"
            >
              <div class="flex-1 ml-4">
                <p class="text-[11px] font-bold text-slate-700 dark:text-slate-200 leading-tight">
                  {{ item.product?.title || 'محصول حذف شده' }}
                </p>
                <p class="text-[10px] text-slate-400 mt-1 font-medium">{{ item.label }}</p>
              </div>
              <span
                :class="
                  item.stock === 0 ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                "
                class="px-3 py-1 rounded-lg text-[10px] font-bold whitespace-nowrap"
              >
                {{ item.stock === 0 ? 'ناموجود' : item.stock + ' عدد' }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import axios from '@/lib/axios'

const stats = ref(null)
const chartData = ref([])
const lowStock = ref([])
const loading = ref(true)

const fetchData = async () => {
  try {
    loading.value = true
    const res = await axios.get('/admin/dashboard/stats')
    stats.value = res.data.stats
    chartData.value = res.data.chart
    lowStock.value = res.data.low_stock
  } catch (error) {
    console.error('خطا در دریافت اطلاعات داشبورد:', error)
  } finally {
    loading.value = false
  }
}

const statCards = computed(() => [
  {
    title: 'فروش امروز',
    value: formatPrice(stats.value?.today_sales || 0) + ' ت',
    icon: '💰',
    bg: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600',
  },
  {
    title: 'سفارشات معلق',
    value: (stats.value?.pending_orders ?? 0) + ' عدد',
    icon: '⏳',
    bg: 'bg-amber-50 dark:bg-amber-900/20 text-amber-600',
  },
  {
    title: 'اتمام موجودی',
    value: (stats.value?.low_stock_count ?? 0) + ' کالا',
    icon: '🚨',
    bg: 'bg-rose-50 dark:bg-rose-900/20 text-rose-600',
  },
  {
    title: 'درآمد ماه جاری',
    value: formatPrice(stats.value?.monthly_revenue || 0) + ' ت',
    icon: '📈',
    bg: 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600',
  },
])

// محاسبه بالاترین عدد فروش برای مقیاس‌بندی صحیح نمودار میله‌ای
const maxSales = computed(() => {
  const totals = chartData.value.map((d) => Number(d.total))
  return totals.length > 0 ? Math.max(...totals, 1) : 1
})

const formatPrice = (v) => {
  if (v === undefined || v === null || isNaN(v)) return '۰'
  return Number(v).toLocaleString('fa-IR')
}

const formatDate = (d) => {
  if (!d) return ''
  return new Date(d).toLocaleDateString('fa-IR', { weekday: 'short' })
}

onMounted(fetchData)
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  @apply bg-transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  @apply bg-slate-200 dark:bg-slate-700 rounded-full;
}
</style>
