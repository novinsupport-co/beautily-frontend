<template>
  <div class="flex items-center gap-0 group transition-all duration-300">
    <div class="relative">
      <img
        :src="currentLogo"
        alt="لوگوی بیوتیلی"
        class="h-8 md:h-12 w-auto object-contain drop-shadow-sm"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import defaultLogo from '@/assets/icon/Beautily-Full-logo.png'

// ایمپورت متغیر سراسری لوگو
import { globalLogoUrl } from '@/composables/useSettingsLogoSite'

// محاسبه لوگوی نهایی: اگر لوگو از سرور دریافت شده بود آن را نمایش بده، در غیر این صورت لوگوی لوکال
const currentLogo = computed(() => {
  return globalLogoUrl.value ? globalLogoUrl.value : defaultLogo
})
</script>
