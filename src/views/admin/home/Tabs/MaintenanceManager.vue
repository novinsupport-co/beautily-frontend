<template>
  <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 font-vazir">
    <h3 class="text-lg font-bold text-gray-800 mb-6 border-b pb-4">
      تنظیمات وضعیت سایت (Maintenance)
    </h3>

    <div class="space-y-6 max-w-2xl">
      <!-- سوئیچ فعال‌سازی -->
      <div
        class="flex items-center justify-between bg-gray-50 p-4 rounded-xl border border-gray-100"
      >
        <div>
          <h4 class="font-semibold text-gray-700">حالت در حال بروزرسانی</h4>
          <p class="text-sm text-gray-500 mt-1">
            با فعال‌سازی، کاربران عادی به صفحه «در حال بروزرسانی» هدایت شده و دسترسی به سایت بسته
            می‌شود.
          </p>
        </div>
        <label class="relative inline-flex items-center cursor-pointer">
          <input v-model="form.maintenance_mode" class="sr-only peer" type="checkbox" />
          <div
            class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"
          ></div>
        </label>
      </div>

      <!-- پیام نمایشی -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">پیام نمایشی برای کاربران</label>
        <textarea
          v-model="form.maintenance_message"
          class="w-full rounded-xl border-gray-200 bg-gray-50 p-4 text-sm focus:border-blue-500 focus:ring-blue-500 outline-none border transition-all"
          placeholder="مثال: سایت در حال بروزرسانی می‌باشد. لطفا شکیبا باشید..."
          rows="4"
        ></textarea>
      </div>

      <!-- نمایش خطا در صورت وجود -->
      <div v-if="siteSettingsStore.error" class="p-3 bg-red-50 text-red-600 rounded-lg text-sm">
        {{ siteSettingsStore.error }}
      </div>

      <!-- دکمه ذخیره -->
      <div class="pt-4">
        <button
          :disabled="siteSettingsStore.isLoading"
          class="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center gap-2"
          @click="saveSettings"
        >
          <span
            v-if="siteSettingsStore.isLoading"
            class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"
          ></span>
          ذخیره تنظیمات
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import { useSiteSettingsStore } from '@/stores/siteSettings'

const siteSettingsStore = useSiteSettingsStore()

const form = ref({
  maintenance_mode: false,
  maintenance_message: 'سایت در حال بروزرسانی می‌باشد. لطفا شکیبا باشید.',
})

// مقداردهی فرم از اطلاعات استور
const syncFormWithStore = () => {
  const settings = siteSettingsStore.settings
  const mode = settings.maintenance_mode

  // بررسی جامع برای مقادیر مختلفی که ممکن است از دیتابیس/API برگردد
  form.value.maintenance_mode = mode === '1' || mode === 1 || mode === 'true' || mode === true

  if (settings.maintenance_message) {
    form.value.maintenance_message = settings.maintenance_message
  }
}

// گوش دادن به تغییرات استور برای زمانی که داده‌ها بعد از رندر شدن کامپوننت می‌رسند یا تب عوض می‌شود
watch(
  () => siteSettingsStore.settings,
  () => {
    syncFormWithStore()
  },
  { deep: true },
)

const saveSettings = async () => {
  const isSuccess = await siteSettingsStore.updateSettings({
    // بهتر است برای بک‌اند لاراول مقدار به صورت 0 و 1 ارسال شود
    maintenance_mode: form.value.maintenance_mode ? '1' : '0',
    maintenance_message: form.value.maintenance_message,
  })

  // نمایش پیام موفقیت تنها در صورتی که API جواب موفق داده باشد
  if (isSuccess && !siteSettingsStore.error) {
    alert('تنظیمات وضعیت سایت با موفقیت بروزرسانی شد.')
  }
}

onMounted(async () => {
  // دریافت اجباری تنظیمات جهت اطمینان از به‌روز بودن داده‌ها
  await siteSettingsStore.fetchSettings(true)
  syncFormWithStore()
})
</script>
