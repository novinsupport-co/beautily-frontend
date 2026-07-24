import { defineStore } from 'pinia'
import axiosInstance from '@/lib/axios'

// تغییر null به آبجکت در تایپ
interface SiteSettingsState {
  settings: Record<string, any>
  isLoading: boolean
  error: string | null
}

export const useSiteSettingsStore = defineStore('siteSettings', {
  state: (): SiteSettingsState => ({
    settings: {}, // به جای null از آبجکت خالی استفاده می‌کنیم
    isLoading: false,
    error: null,
  }),

  getters: {
    getSettingByKey: (state) => {
      // چون همیشه آبجکت است، نیازی به چک کردن null نیست
      return (key: string) => state.settings[key] || null
    },
  },

  actions: {
    async fetchSettings(forceRefresh = false) {
      if (Object.keys(this.settings).length > 0 && !forceRefresh) return

      this.isLoading = true
      this.error = null

      try {
        const response = await axiosInstance.get('/v1/settings/general')

        if (response.data.status === 'success') {
          // مطمئن می‌شویم که حتماً آبجکت پاس داده می‌شود
          this.settings = response.data.data || {}
        }
      } catch (err: any) {
        this.error = err.response?.data?.message || 'خطا در دریافت تنظیمات سایت'
        console.error(err)
      } finally {
        this.isLoading = false
      }
    },

    // ... سایر اکشن‌ها بدون تغییر باقی می‌مانند
    async updateSettings(payload: Record<string, any>) {
      /* ... */
    },
    async updateSettingMedia(formData: FormData) {
      /* ... */
    },
    async deleteSetting(settingKey: string) {
      /* ... */
    },
  },
})
