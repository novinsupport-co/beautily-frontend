<template>
  <div class="space-y-4">
    <div
      class="flex items-center gap-3 bg-white p-4 rounded-xl border border-slate-100 shadow-sm text-slate-600 font-iransans-medium text-[11px] leading-relaxed"
    >
      <div
        class="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center flex-shrink-0 text-emerald-500"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path
            d="M3 8h13l3 4v6h-4m4-6H6m4 6H3v-6h13"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>
      <span>ارسال سریع و رایگان برای خریدهای بالای {{ formattedThreshold }} تومان</span>
    </div>

    <div
      class="flex items-center gap-3 bg-white p-4 rounded-xl border border-slate-100 shadow-sm text-slate-600 font-iransans-medium text-[11px] leading-relaxed"
    >
      <div
        class="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0 text-blue-500"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path d="M12 6l-8 6 8 6 8-6-8-6z" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </div>
      <span>ضمانت اصالت و سلامت کالا</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted } from 'vue'
import { useSiteSettingsStore } from '@/stores/siteSettings' // مسیر دقیق استور خود را جایگزین کنید

const siteSettingsStore = useSiteSettingsStore()

// دریافت تنظیمات در صورت نیاز (اگر قبلا در سطح App لود نشده باشد)
onMounted(() => {
  siteSettingsStore.fetchSettings()
})

const formattedThreshold = computed(() => {
  // گرفتن مقدار سقف ارسال رایگان از استور (نام کلید را با بک‌اند مطابقت دهید)
  const rawValue = siteSettingsStore.getSettingByKey('free_shipping_threshold')
  const amount = Number(rawValue || 0)

  if (amount === 0) return '۰'

  if (amount >= 1000000) {
    return (amount / 1000000).toLocaleString('fa-IR') + ' میلیون'
  } else if (amount >= 1000) {
    return (amount / 1000).toLocaleString('fa-IR') + ' هزار'
  }

  return amount.toLocaleString('fa-IR')
})
</script>
