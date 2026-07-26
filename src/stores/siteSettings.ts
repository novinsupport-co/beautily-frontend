import { defineStore } from 'pinia'
import axiosInstance from '@/lib/axios'

interface SiteSettingsState {
  settings: Record<string, any>
  isLoading: boolean
  error: string | null
}

export const useSiteSettingsStore = defineStore('siteSettings', {
  state: (): SiteSettingsState => ({
    settings: {},
    isLoading: false,
    error: null,
  }),

  getters: {
    getSettingByKey: (state) => {
      return (key: string) => state.settings[key] || null
    },
  },

  actions: {
    async fetchSettings(forceRefresh = false) {
      if (Object.keys(this.settings).length > 0 && !forceRefresh) return

      this.isLoading = true
      this.error = null

      try {
        // مسیر عمومی برای دریافت تنظیمات صحیح است
        const response = await axiosInstance.get('/v1/settings/general')

        if (response.data.status === 'success' || response.status === 200) {
          this.settings = response.data.data || {}
        }
      } catch (err: any) {
        this.error = err.response?.data?.message || 'خطا در دریافت تنظیمات سایت'
        console.error(err)
      } finally {
        this.isLoading = false
      }
    },

    async updateSettings(payload: Record<string, any>) {
      this.isLoading = true
      this.error = null

      try {
        // طبق api.php، مسیر بروزرسانی تنظیمات از نوع PUT و در گروه admin است
        const response = await axiosInstance.put('/admin/settings', {
          settings: payload,
        })

        if (response.data?.status === 'success' || response.status === 200) {
          this.settings = { ...this.settings, ...payload }
          return true
        }
        return false
      } catch (err: any) {
        this.error = err.response?.data?.message || 'خطا در ذخیره تنظیمات'
        console.error('Update settings error:', err)
        return false
      } finally {
        this.isLoading = false
      }
    },

    async updateSettingMedia(formData: FormData) {
      this.isLoading = true
      this.error = null

      try {
        // مسیر آپلود فایل در گروه admin است
        const response = await axiosInstance.post('/admin/settings/media', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })

        if (response.data && response.data.settings) {
          this.settings = { ...this.settings, ...response.data.settings }
        } else if (response.data && response.data.data) {
          this.settings = { ...this.settings, ...response.data.data }
        }

        return true
      } catch (err: any) {
        this.error = err.response?.data?.message || 'خطا در آپلود فایل تنظیمات'
        console.error('Update setting media error:', err)
        return false
      } finally {
        this.isLoading = false
      }
    },

    async deleteSetting(settingKey: string) {
      this.isLoading = true
      this.error = null

      try {
        // مسیر حذف در گروه admin است
        const response = await axiosInstance.delete(`/admin/settings/${settingKey}`)

        if (response.status === 200 || response.data?.status === 'success') {
          if (this.settings && settingKey in this.settings) {
            delete this.settings[settingKey]
          }
          return true
        }
        return false
      } catch (err: any) {
        this.error = err.response?.data?.message || 'خطا در حذف تنظیمات'
        console.error('Delete setting error:', err)
        return false
      } finally {
        this.isLoading = false
      }
    },
  },
})
