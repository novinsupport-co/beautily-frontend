// src/composables/useSettingsLogoSite.ts
import { ref } from 'vue'
import { getPublicSettingApi } from '@/api/settingApi'

// متغیر سراسری برای نگهداری آدرس لوگو
export const globalLogoUrl = ref<string | null>(null)

// تابع دریافت و ذخیره لوگو
export const loadDynamicLogo = async () => {
  try {
    const response = await getPublicSettingApi('site_logo') // کلید مربوط به لوگو را اینجا قرار دهید

    const logoUrl = response?.data?.url
    if (logoUrl) {
      globalLogoUrl.value = logoUrl
    }
  } catch (error) {
    console.error('Error loading logo:', error)
  }
}
