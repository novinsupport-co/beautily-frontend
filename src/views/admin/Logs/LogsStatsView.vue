<template>
  <div>
    <h1 class="text-2xl font-bold mb-4">📊 گزارش آماری لاگ‌ها</h1>

    <!-- Filters -->
    <div class="flex gap-3 mb-6 flex-wrap bg-white p-4 rounded shadow">
      <input v-model="filters.from" class="input" type="date" />
      <input v-model="filters.to" class="input" type="date" />

      <select v-model="filters.interval" class="input">
        <option value="hour">ساعتی</option>
        <option value="day">روزانه</option>
        <option value="week">هفتگی</option>
        <option value="month">ماهانه</option>
      </select>

      <label class="flex items-center gap-2">
        <input v-model="filters.compare" type="checkbox" />
        مقایسه با دوره قبل
      </label>

      <button class="btn" @click="fetchStats">نمایش</button>
    </div>

    <!-- Chart -->
    <div class="bg-white p-4 rounded shadow">
      <canvas ref="chartRef"></canvas>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import axios from '@/lib/axios'
import Chart from 'chart.js/auto'

const chartRef = ref<HTMLCanvasElement | null>(null)
let chart: Chart | null = null

const filters = reactive({
  from: '',
  to: '',
  interval: 'day',
  compare: true,
})

const stats = reactive({
  series: { current: {}, previous: {} },
})

const levels = ['info', 'success', 'warning', 'error', 'critical']
const colors: Record<string, string> = {
  info: '#3b82f6',
  success: '#10b981',
  warning: '#facc15',
  error: '#ef4444',
  critical: '#7f1d1d',
}

const fetchStats = async () => {
  try {
    const params = {
      ...filters,
      compare: filters.compare ? 1 : 0,
    }
    const { data } = await axios.get('/admin/logs/stats', { params })
    stats.series = data.series
    buildChart()
  } catch {
    console.error('خطا در دریافت آمار')
  }
}

const buildChart = () => {
  if (!chartRef.value) return
  chart?.destroy()

  // تمام زمان‌ها از current + previous برای label
  const allTimes = Array.from(
    new Set([...Object.keys(stats.series.current), ...Object.keys(stats.series.previous)]),
  ).sort()

  const datasets = levels.map((level) => ({
    label: level,
    data: allTimes.map((time) => stats.series.current[time]?.[level] || 0),
    borderColor: colors[level],
    tension: 0.4,
    fill: false,
  }))

  chart = new Chart(chartRef.value, {
    type: 'line',
    data: { labels: allTimes, datasets },
    options: {
      responsive: true,
      plugins: { legend: { position: 'bottom' } },
      interaction: { mode: 'index', intersect: false },
      scales: { y: { beginAtZero: true } },
    },
  })
}

onMounted(fetchStats)
onBeforeUnmount(() => chart?.destroy())
</script>

<style scoped>
.input {
  @apply border px-3 py-2 rounded text-sm;
}
.btn {
  @apply bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600;
}
</style>
