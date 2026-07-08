<template>
  <router-view />
  <Notifications />
  <ConfirmDialog />
</template>

<script lang="ts" setup>
import { onMounted } from 'vue'
import Notifications from '@/components/NotifAndConfim/Notifications.vue'
import ConfirmDialog from '@/components/NotifAndConfim/ConfirmDialog.vue'
import { getPublicSettingApi } from '@/api/settingApi'
import { loadDynamicLogo } from '@/composables/useSettingsLogoSite'

// تابع دریافت و اعمال فاوآیکون داینامیک
const loadDynamicFavicon = async () => {
  try {
    const response = await getPublicSettingApi('site_favicon')

    // بر اساس دیتای بک‌اند شما، احتمالاً فیلد حاوی آدرس `image_url` است.
    // از هر دو فیلد برای اطمینان پشتیبانی می‌کنیم.
    const faviconUrl = response?.data?.image_url || response?.data?.url

    if (faviconUrl) {
      // ۱. پیدا کردن و حذف کردن تمام تگ‌های فاوآیکون قبلی (برای جلوگیری از تداخل)
      const existingIcons = document.querySelectorAll("link[rel*='icon']")
      existingIcons.forEach((icon) => document.head.removeChild(icon))

      // ۲. ساخت تگ فاوآیکون جدید
      const link = document.createElement('link')
      link.rel = 'icon'

      // تشخیص فرمت فایل بر اساس پسوند برای type (اختیاری اما استانداردتر)
      const extension = faviconUrl.split('.').pop()?.toLowerCase()
      link.type = extension === 'png' ? 'image/png' : 'image/x-icon'

      // ۳. اضافه کردن یک پارامتر زمان به انتهای آدرس برای دور زدن کش مرورگر (Cache-Buster)
      link.href = `${faviconUrl}?v=${new Date().getTime()}`

      // ۴. اضافه کردن تگ جدید به هدر
      document.head.appendChild(link)
    }
  } catch (error) {
    console.error('Error loading favicon:', error)
  }
}

onMounted(() => {
  loadDynamicFavicon()
  loadDynamicLogo()
})
</script>
