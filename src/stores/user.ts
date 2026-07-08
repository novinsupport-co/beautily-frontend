import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getUserDashboardApi } from '@/api/userApi'
import { getOrdersApi } from '@/api/ordersApi'
import { FrontendLogger } from '@/lib/logger'

export const useUserStore = defineStore('user', () => {
  const dashboard = ref<any | null>(null)
  const orders = ref<any[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchDashboard() {
    loading.value = true
    error.value = null
    FrontendLogger.info('user', 'Fetch dashboard')

    try {
      const { data } = await getUserDashboardApi()
      dashboard.value = data
      FrontendLogger.info('user', 'Dashboard fetched')
    } catch (e: any) {
      error.value = e.response?.data?.message || 'خطا در دریافت داشبورد'
      FrontendLogger.error('user', 'Dashboard fetch failed', { message: error.value })
      throw e
    } finally {
      loading.value = false
    }
  }

  async function fetchOrders() {
    loading.value = true
    error.value = null
    FrontendLogger.info('order', 'Fetch orders')

    try {
      const { data } = await getOrdersApi()
      orders.value = data.data ?? data
      FrontendLogger.info('order', 'Orders fetched', { count: orders.value.length })
    } catch (e: any) {
      error.value = e.response?.data?.message || 'خطا در دریافت سفارش‌ها'
      FrontendLogger.error('order', 'Fetch orders failed', { message: error.value })
      throw e
    } finally {
      loading.value = false
    }
  }

  return { dashboard, orders, loading, error, fetchDashboard, fetchOrders }
})
