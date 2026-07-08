<template>
  <div
    class="p-6 md:p-10 space-y-8 animate-in fade-in duration-700 font-iransans text-right"
    dir="rtl"
  >
    <div class="flex flex-col md:flex-row justify-between items-end gap-6">
      <div>
        <h1
          class="text-3xl font-iransans-bold text-slate-800 dark:text-white flex items-center gap-3"
        >
          <span class="bg-rose-500 text-white p-2 rounded-2xl shadow-lg shadow-rose-200">📊</span>
          مانیتورینگ و لاگ سیستم
        </h1>
        <p class="text-slate-500 mt-2 font-medium">
          تحلیل لحظه‌ای پیامک‌ها، ایمیل‌ها و وقایع سیستم
        </p>
      </div>

      <div
        class="flex gap-2 bg-white dark:bg-slate-900 p-2 rounded-2xl shadow-sm border border-slate-100"
      >
        <button
          v-for="t in filterOptions"
          :key="t.value"
          :class="
            activeType === t.value
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'
          "
          class="px-5 py-2 rounded-xl text-xs font-bold transition-all"
          @click="handleFilterChange(t.value)"
        >
          {{ t.label }}
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div
        class="lg:col-span-2 bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 shadow-sm border border-slate-50 min-h-[200px] flex flex-col justify-center items-center"
      >
        <p class="text-slate-400 font-bold italic">نمودار تحلیل رویدادها (در حال آماده‌سازی)</p>
      </div>

      <div class="space-y-4">
        <div
          class="bg-indigo-50 dark:bg-indigo-950/30 p-6 rounded-[2rem] border border-indigo-100 relative overflow-hidden"
        >
          <p class="text-indigo-600 dark:text-indigo-400 text-xs font-bold">
            کل رویدادهای این صفحه
          </p>
          <h3 class="text-3xl font-iransans-bold text-indigo-900 dark:text-indigo-200 mt-2">
            {{ toPersianDigits(logs.length) }}
          </h3>
        </div>
        <div
          class="bg-rose-50 dark:bg-rose-950/30 p-6 rounded-[2rem] border border-rose-100 relative overflow-hidden"
        >
          <p class="text-rose-600 dark:text-rose-400 text-xs font-bold">خطاهای شناسایی شده</p>
          <h3 class="text-3xl font-iransans-bold text-rose-900 dark:text-rose-200 mt-2">
            {{ toPersianDigits(errorCount) }}
          </h3>
        </div>
      </div>
    </div>

    <div
      class="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-sm border border-slate-50 dark:border-slate-800 overflow-hidden relative min-h-[400px]"
    >
      <div
        v-if="loading"
        class="absolute inset-0 bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm z-20 flex items-center justify-center font-bold text-indigo-600"
      >
        در حال بارگذاری...
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-right border-collapse text-sm">
          <thead>
            <tr
              class="bg-slate-50/50 dark:bg-slate-800/50 text-slate-500 text-xs font-bold uppercase"
            >
              <th class="p-6">سطح / نوع</th>
              <th class="p-6 text-right">پیام رویداد</th>
              <th class="p-6 text-center">Correlation ID</th>
              <th class="p-6 text-center">زمان ثبت</th>
              <th class="p-6 text-center">جزئیات</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-50 dark:divide-slate-800">
            <tr
              v-for="log in logs"
              :key="log.id"
              class="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-all"
            >
              <td class="p-6">
                <div class="flex items-center gap-2">
                  <span :class="levelClass(log.level)" class="w-2 h-2 rounded-full"></span>
                  <span
                    class="text-[10px] font-bold uppercase bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md text-slate-600 dark:text-slate-400"
                    >{{ log.type }}</span
                  >
                </div>
              </td>
              <td class="p-6 font-medium text-slate-700 dark:text-slate-300 max-w-xs truncate">
                {{ log.message }}
              </td>
              <td class="p-6 text-center font-mono text-[10px] text-slate-400">
                {{ log.request_id || '---' }}
              </td>
              <td class="p-6 text-center text-[11px] text-slate-500">
                {{ formatJalali(log.created_at) }}
              </td>
              <td class="p-6 text-center">
                <button
                  class="bg-slate-100 dark:bg-slate-800 p-2 rounded-xl text-slate-600 hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
                  @click="selectedLog = log"
                >
                  <CodeBracketIcon class="w-5 h-5" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div
      v-if="selectedLog"
      class="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md"
    >
      <div
        class="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-[2.5rem] p-8 shadow-2xl relative border border-slate-200 dark:border-slate-700"
      >
        <button
          class="absolute top-8 left-8 text-slate-400 hover:text-rose-500"
          @click="selectedLog = null"
        >
          <XMarkIcon class="w-8 h-8" />
        </button>

        <h3 class="text-xl font-iransans-bold mb-6 flex items-center gap-3 dark:text-white">
          <span :class="levelClass(selectedLog.level)" class="w-3 h-3 rounded-full"></span>
          جزئیات دیتای رویداد
        </h3>

        <div class="bg-slate-950 rounded-3xl p-6 border border-slate-800 overflow-hidden">
          <pre
            class="text-emerald-400 text-xs font-mono overflow-auto max-h-[400px] custom-scrollbar"
            dir="ltr"
            >{{ JSON.stringify(selectedLog.payload, null, 2) }}</pre
          >
        </div>

        <div class="mt-6 grid grid-cols-2 gap-4 text-[11px] font-bold text-slate-500">
          <div class="bg-slate-50 dark:bg-slate-800 p-3 rounded-xl uppercase">
            Level: {{ selectedLog.level }}
          </div>
          <div class="bg-slate-50 dark:bg-slate-800 p-3 rounded-xl">
            Event ID: #{{ selectedLog.id }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import axios from '@/lib/axios'
import { CodeBracketIcon, XMarkIcon } from '@heroicons/vue/24/outline'

const logs = ref([])
const loading = ref(false)
const activeType = ref('all')
const selectedLog = ref(null)

const filterOptions = [
  { label: 'همه', value: 'all' },
  { label: 'SMS', value: 'sms' },
  { label: 'Email', value: 'email' },
  { label: 'Error', value: 'error' },
]

const handleFilterChange = (type) => {
  activeType.value = type
  fetchAll()
}

const fetchAll = async () => {
  loading.value = true
  try {
    const params = { per_page: 50 }
    if (activeType.value !== 'all') {
      if (activeType.value === 'error') params.level = 'error'
      else params.type = activeType.value
    }
    const { data } = await axios.get('/admin/logs', { params })
    logs.value = data.data
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

const errorCount = computed(() => logs.value.filter((l) => l.level === 'error').length)

const levelClass = (lvl) => {
  if (lvl === 'error' || lvl === 'critical') return 'bg-rose-500'
  if (lvl === 'warning') return 'bg-amber-500'
  return 'bg-emerald-500'
}

const toPersianDigits = (n) => n.toString().replace(/\d/g, (x) => '۰۱۲۳۴۵۶۷۸۹'[x])
const formatJalali = (str) =>
  new Intl.DateTimeFormat('fa-IR', { dateStyle: 'medium', timeStyle: 'short' }).format(
    new Date(str),
  )

onMounted(fetchAll)
</script>
