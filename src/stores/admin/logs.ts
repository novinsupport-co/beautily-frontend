//src/stores/admin/logs.ts
import { defineStore } from 'pinia'
import { fetchLogStats } from '@/services/logs'

export const useAdminLogsStore = defineStore('admin-logs', {
  state: () => ({
    stats: null as any,
    loading: false as boolean,
    error: null as any,
  }),
  actions: {
    async loadStats(params: any) {
      this.loading = true
      try {
        this.stats = await fetchLogStats(params)
      } catch (e) {
        this.error = e
      } finally {
        this.loading = false
      }
    },
  },
})
