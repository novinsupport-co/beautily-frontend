<template>
  <div id="app-root">
    <router-view />
    <Notifications />
    <ConfirmDialog />
  </div>
</template>

<script lang="ts" setup>
import Notifications from '@/components/NotifAndConfim/Notifications.vue'
import ConfirmDialog from '@/components/NotifAndConfim/ConfirmDialog.vue'
import { onMounted } from 'vue'
import { useSiteSettingsStore } from '@/stores/siteSettings'
import { getPublicSettingApi } from '@/api/settingApi'

const settingsStore = useSiteSettingsStore()

const applyDynamicFavicon = (faviconUrl?: string) => {
  if (!faviconUrl) return

  const existingIcons = document.querySelectorAll("link[rel*='icon']")
  existingIcons.forEach((icon) => document.head.removeChild(icon))

  const link = document.createElement('link')
  link.rel = 'icon'

  const extension = faviconUrl.split('.').pop()?.toLowerCase()
  link.type = extension === 'png' ? 'image/png' : 'image/x-icon'

  link.href = `${faviconUrl}?v=${new Date().getTime()}`
  document.head.appendChild(link)
}

const fetchAndApplyFavicon = async () => {
  try {
    const response = await getPublicSettingApi('site_favicon')
    if (response.data?.image_url) {
      applyDynamicFavicon(response.data.image_url)
    }
  } catch (error) {
    console.error('Failed to load site favicon', error)
  }
}

onMounted(async () => {
  if (Object.keys(settingsStore.settings).length === 0) {
    await settingsStore.fetchSettings()
  }

  await fetchAndApplyFavicon()
})
</script>
