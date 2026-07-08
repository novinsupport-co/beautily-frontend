<template>
  <!-- Header -->
  <div class="flex items-center justify-between mb-6">
    <h1 class="text-2xl font-bold">📊 داشبورد لاگ‌ها</h1>
    <button class="btn-outline" @click="resetFilters">ریست فیلتر</button>
  </div>

  <!-- Filters -->
  <div class="bg-white p-4 rounded shadow flex gap-3 flex-wrap mb-6">
    <select v-model="filters.level" class="input">
      <option value="">همه سطوح</option>
      <option v-for="l in levels" :key="l" :value="l">{{ l }}</option>
    </select>

    <select v-model="filters.type" class="input">
      <option value="">همه نوع‌ها</option>
      <option v-for="t in types" :key="t" :value="t">{{ t }}</option>
    </select>

    <input
      v-model="filters.search"
      class="input flex-1"
      placeholder="جستجو در پیام، payload، آی‌پی..."
    />

    <button class="btn" @click="fetchLogs">جستجو</button>
  </div>

  <!-- Chart -->
  <div class="bg-white p-4 rounded shadow mb-6">
    <p class="text-sm text-gray-500 mb-3">وضعیت کلی سلامت سیستم</p>

    <!-- Stats -->
    <div class="flex gap-3 mb-4 flex-wrap">
      <span class="badge blue">ℹ️ Info: {{ countBy('info') }}</span>
      <span class="badge yellow">⚠️ Warning: {{ countBy('warning') }}</span>
      <span class="badge red">❌ Error: {{ countBy('error') }}</span>
      <span class="badge dark">🚨 Critical: {{ countBy('critical') }}</span>
    </div>

    <div class="h-64 relative">
      <canvas ref="chartRef"></canvas>
    </div>
  </div>

  <!-- Table -->
  <div class="bg-white rounded shadow overflow-x-auto mb-6">
    <table class="min-w-full text-sm">
      <thead class="bg-gray-50">
        <tr>
          <th class="th">سطح</th>
          <th class="th">نوع</th>
          <th class="th">پیام</th>
          <th class="th">زمان</th>
          <th class="th text-center">جزئیات</th>
        </tr>
      </thead>

      <tbody v-if="logs.data && logs.data.length">
        <tr v-for="log in logs.data" :key="log.id" class="border-t hover:bg-gray-50">
          <td class="td">
            <span :class="levelBadge(log.level)">
              {{ log.level }}
            </span>
          </td>
          <td class="td">{{ log.type }}</td>
          <td class="td">{{ truncate(log.message) }}</td>
          <td class="td text-xs text-gray-500">{{ log.created_at }}</td>
          <td class="td text-center">
            <button class="link" @click="selected = log">مشاهده</button>
          </td>
        </tr>
      </tbody>

      <tbody v-else>
        <tr>
          <td class="p-6 text-center text-gray-400" colspan="5">لاگی یافت نشد</td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- Pagination -->
  <div class="flex justify-between items-center mb-6">
    <span class="text-sm text-gray-500">
      صفحه {{ logs.current_page }} از {{ logs.last_page }}
    </span>
    <div class="space-x-2">
      <button :disabled="!logs.prev_page_url" class="btn-sm" @click="changePage(-1)">قبلی</button>
      <button :disabled="!logs.next_page_url" class="btn-sm" @click="changePage(1)">بعدی</button>
    </div>
  </div>

  <!-- Modal -->
  <div v-if="selected" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div class="bg-white p-5 rounded w-2/3 max-h-[80vh] overflow-auto">
      <h3 class="font-bold mb-3">جزئیات لاگ</h3>
      <pre class="text-xs bg-gray-100 p-3 rounded">{{ JSON.stringify(selected, null, 2) }}</pre>
      <div class="text-right mt-3">
        <button class="btn" @click="selected = null">بستن</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import axiosInstance from '@/lib/axios'
import Chart from 'chart.js/auto'
import { useNotificationStore } from '@/stores/notification'

const notify = useNotificationStore()

interface LogItem {
  id: number
  level: 'info' | 'warning' | 'error' | 'critical'
  type: string
  message: string | null
  created_at: string
  payload?: any
}

interface LogsResponse {
  data: LogItem[]
  current_page: number
  last_page: number
  next_page_url: string | null
  prev_page_url: string | null
}

const levels = ['info', 'warning', 'error', 'critical']
const types = ['email', 'sms', 'auth', 'frontend', 'system']

const filters = reactive({
  level: '',
  type: '',
  search: '',
  page: 1,
})

const logs = ref<LogsResponse>({
  data: [],
  current_page: 1,
  last_page: 1,
  next_page_url: null,
  prev_page_url: null,
})

const selected = ref<LogItem | null>(null)

/* ---------- Chart ---------- */
const chartRef = ref<HTMLCanvasElement | null>(null)
let chart: Chart | null = null

const countBy = (level: string) => {
  return (logs.value.data ?? []).filter((l) => l.level === level).length
}

const buildChart = () => {
  if (!chartRef.value) return

  // destroy قبلی
  if (chart) {
    chart.destroy()
    chart = null
  }

  const dataCounts = [countBy('info'), countBy('warning'), countBy('error'), countBy('critical')]

  chart = new Chart(chartRef.value, {
    type: 'doughnut',
    data: {
      labels: ['Info', 'Warning', 'Error', 'Critical'],
      datasets: [
        {
          data: dataCounts,
          backgroundColor: [
            '#3b82f6', // info
            '#facc15', // warning
            '#ef4444', // error
            '#7f1d1d', // critical
          ],
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { position: 'bottom' } },
    },
  })
}

/* ---------- API ---------- */
const fetchLogs = async () => {
  try {
    const { data } = await axiosInstance.get<LogsResponse>('/admin/logs', {
      params: {
        level: filters.level || undefined,
        type: filters.type || undefined,
        search: filters.search || undefined,
        page: filters.page,
      },
    })

    logs.value = data
  } catch (err) {
    notify.error('خطا در دریافت لاگ‌ها')
  }
}

const changePage = (delta: number) => {
  filters.page = Math.max(1, filters.page + delta)
  fetchLogs()
}

const resetFilters = () => {
  filters.level = ''
  filters.type = ''
  filters.search = ''
  filters.page = 1
  fetchLogs()
}

const truncate = (t: string | null) => (t && t.length > 80 ? t.slice(0, 80) + '...' : t)

const levelBadge = (l: string) =>
  (
    ({
      info: 'badge blue',
      warning: 'badge yellow',
      error: 'badge red',
      critical: 'badge dark',
    }) as Record<string, string>
  )[l] ?? 'badge'

onMounted(async () => {
  await fetchLogs()
  buildChart()
})

// rebuild chart هر بار logs.data تغییر کرد
watch(
  () => logs.value.data,
  () => {
    buildChart()
  },
  { deep: true },
)

onBeforeUnmount(() => {
  if (chart) {
    chart.destroy()
    chart = null
  }
})
</script>

<style scoped>
.input {
  @apply border px-3 py-2 rounded text-sm;
}
.btn {
  @apply bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600;
}
.btn-outline {
  @apply border px-3 py-2 rounded text-sm hover:bg-gray-100;
}
.btn-sm {
  @apply border px-3 py-1 rounded text-sm;
}
.link {
  @apply text-pink-600 hover:underline;
}
.th {
  @apply p-2 text-right text-xs font-medium text-gray-600;
}
.td {
  @apply p-2 text-right;
}
.badge {
  @apply px-2 py-1 rounded text-xs font-medium;
}
.blue {
  @apply bg-blue-100 text-blue-700;
}
.yellow {
  @apply bg-yellow-100 text-yellow-700;
}
.red {
  @apply bg-red-100 text-red-700;
}
.dark {
  @apply bg-red-900 text-white;
}
</style>
