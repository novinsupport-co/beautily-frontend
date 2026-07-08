<template>
  <div class="p-6 font-vazir">
    <!-- هدر صفحه -->
    <div class="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-800">مدیریت تصاویر ساختاری</h1>
        <p class="text-sm text-gray-500 mt-1">
          تنظیمات مربوط به لوگوها، پس‌زمینه‌ها و تصاویر ثابت سیستم
        </p>
      </div>
      <div>
        <button
          :disabled="isFetching"
          class="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition shadow-sm disabled:opacity-50"
          @click="fetchSettings"
        >
          <svg
            v-if="isFetching"
            class="animate-spin h-5 w-5 text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            ></circle>
            <path
              class="opacity-75"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              fill="currentColor"
            ></path>
          </svg>
          <svg
            v-else
            class="h-5 w-5"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <span>تازه‌سازی</span>
        </button>
      </div>
    </div>

    <!-- لیست آکاردئونی -->
    <div class="space-y-3">
      <!-- حالت Loading (Skeleton List) -->
      <template v-if="isFetching && !settings.length">
        <div
          v-for="i in 5"
          :key="i"
          class="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex items-center justify-between animate-pulse"
        >
          <div class="flex items-center gap-4 w-1/2">
            <div class="w-10 h-10 bg-gray-200 rounded-lg"></div>
            <div class="space-y-2 flex-1">
              <div class="h-4 bg-gray-200 rounded w-1/2"></div>
              <div class="h-3 bg-gray-100 rounded w-1/4"></div>
            </div>
          </div>
          <div class="w-8 h-8 bg-gray-100 rounded-full"></div>
        </div>
      </template>

      <!-- ردیف‌های اصلی -->
      <template v-else>
        <div
          v-for="setting in sortedSettings"
          :key="setting.key"
          :class="
            expandedKey === setting.key
              ? 'border-blue-200 ring-1 ring-blue-50'
              : 'border-gray-100 hover:border-gray-200'
          "
          class="bg-white rounded-xl shadow-sm border overflow-hidden transition-all duration-300"
        >
          <!-- هدر ردیف (بخش کلیک‌شونده برای باز و بسته شدن) -->
          <div
            class="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50/50 transition-colors"
            @click="toggleExpand(setting.key)"
          >
            <div class="flex items-center gap-4">
              <!-- نمایشگر وضعیت (تصویر کوچک یا آیکون هشدار) -->
              <div
                class="flex items-center justify-center w-10 h-10 rounded-lg border border-gray-200 bg-gray-50 overflow-hidden flex-shrink-0"
              >
                <img
                  v-if="setting.image_url"
                  :src="setting.image_url"
                  alt="Thumbnail"
                  class="w-full h-full object-cover"
                />
                <svg
                  v-else
                  class="w-5 h-5 text-orange-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                  />
                </svg>
              </div>

              <div>
                <h3 class="text-base font-bold text-gray-800">{{ setting.label }}</h3>
                <div class="flex items-center gap-2 mt-1">
                  <span class="text-xs text-gray-400 font-mono bg-gray-100 px-1.5 py-0.5 rounded">{{
                    setting.key
                  }}</span>
                  <span v-if="!setting.image_url" class="text-[11px] text-orange-500 font-medium"
                    >نیاز به آپلود</span
                  >
                </div>
              </div>
            </div>

            <!-- آیکون فلش بازشو -->
            <div class="text-gray-400 p-2">
              <svg
                :class="{ 'rotate-180 text-blue-500': expandedKey === setting.key }"
                class="w-5 h-5 transition-transform duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M19 9l-7 7-7-7"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                />
              </svg>
            </div>
          </div>

          <!-- بدنه کشویی (Accordion Body) -->
          <div
            v-show="expandedKey === setting.key"
            class="border-t border-gray-100 bg-gray-50/30 p-4 md:p-6"
          >
            <div class="flex flex-col md:flex-row gap-6 md:gap-8">
              <!-- بخش نمایش تصویر اصلی -->
              <div
                class="relative w-full md:w-64 h-48 rounded-xl border border-gray-200 bg-gray-50 flex items-center justify-center overflow-hidden flex-shrink-0"
              >
                <!-- Overlay در حال آپلود -->
                <div
                  v-if="uploadingKey === setting.key"
                  class="absolute inset-0 bg-white/80 z-20 flex flex-col items-center justify-center backdrop-blur-sm"
                >
                  <svg
                    class="animate-spin h-8 w-8 text-blue-600 mb-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle
                      class="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      stroke-width="4"
                    ></circle>
                    <path
                      class="opacity-75"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      fill="currentColor"
                    ></path>
                  </svg>
                </div>

                <img
                  v-if="setting.image_url"
                  :src="setting.image_url"
                  alt="Preview"
                  class="object-contain w-full h-full"
                />
                <div
                  v-else
                  class="w-full h-full flex flex-col items-center justify-center text-gray-400"
                >
                  <span class="text-sm">بدون تصویر</span>
                </div>
              </div>

              <!-- اطلاعات و راهنما -->
              <div class="flex-1 flex flex-col justify-between">
                <div class="space-y-4">
                  <!-- مسیر استفاده / راهنما -->
                  <div>
                    <h4 class="text-sm font-bold text-gray-700 mb-1 flex items-center gap-1.5">
                      <svg
                        class="w-4 h-4 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                        />
                      </svg>
                      راهنمای استفاده:
                    </h4>
                    <p class="text-sm text-gray-600 leading-relaxed">
                      این تصویر در بخش‌های مرتبط با <strong>{{ setting.label }}</strong> در سایت یا
                      اپلیکیشن نمایش داده می‌شود. پیشنهاد می‌شود از فایل‌های با کیفیت و بهینه‌شده
                      استفاده کنید.
                    </p>
                  </div>

                  <!-- مشخصات فایل -->
                  <div
                    class="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white p-4 rounded-lg border border-gray-100"
                  >
                    <div>
                      <span class="block text-xs text-gray-500 mb-1">فرمت‌های مجاز</span>
                      <span class="text-sm text-gray-800 font-medium"
                        >JPG, PNG, WEBP, SVG,JPEG,ICO</span
                      >
                    </div>
                    <div>
                      <span class="block text-xs text-gray-500 mb-1">مسیر فعلی ذخیره‌سازی</span>
                      <a
                        v-if="setting.image_url"
                        :href="setting.image_url"
                        class="text-sm text-blue-600 hover:underline flex items-center gap-1 dir-ltr truncate"
                        target="_blank"
                        title="مشاهده تصویر اصلی"
                      >
                        {{ getPathFromUrl(setting.image_url) }}
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                          />
                        </svg>
                      </a>
                      <span v-else class="text-sm text-gray-400">-</span>
                    </div>
                  </div>
                </div>

                <!-- دکمه‌های عملیاتی -->
                <div class="flex items-center gap-3 mt-6 pt-4 border-t border-gray-100">
                  <button
                    class="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-lg transition-colors text-sm font-medium"
                    @click="triggerUpload(setting.key)"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                      />
                    </svg>
                    {{ setting.image_url ? 'تغییر تصویر' : 'آپلود تصویر' }}
                  </button>

                  <button
                    v-if="setting.image_url"
                    class="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-lg transition-colors text-sm font-medium"
                    @click="deleteImage(setting.key)"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                      />
                    </svg>
                    حذف تصویر
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>

    <!-- Input مخفی برای دریافت فایل -->
    <input
      ref="fileInputRef"
      accept="image/jpeg,image/png,image/webp,image/svg+xml,image/x-icon,.ico"
      class="hidden"
      type="file"
      @change="handleFileChange"
    />
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { AxiosError } from 'axios'
import { useNotificationStore } from '@/stores/notification'

import { deleteSettingImageApi, getSettingImagesApi, uploadSettingImageApi } from '@/api/settingApi'

const settings = ref([])
const isFetching = ref(true)
const uploadingKey = ref(null)

const fileInputRef = ref(null)
const activeKeyForUpload = ref(null)

const expandedKey = ref(null)

const notify = useNotificationStore()

const sortedSettings = computed(() => {
  return [...settings.value].sort((a, b) => a.label.localeCompare(b.label, 'fa'))
})

const toggleExpand = (key) => {
  expandedKey.value = expandedKey.value === key ? null : key
}

const getPathFromUrl = (urlString) => {
  if (!urlString) return ''
  try {
    const url = new URL(urlString)
    return url.pathname
  } catch (e) {
    return urlString
  }
}

const handleError = (e) => {
  if (e instanceof AxiosError && e.response?.status === 422) {
    notify.error(e.response.data.message || 'اطلاعات ارسالی معتبر نیست')
  } else {
    notify.error(e.response?.data?.message || 'خطا در ارتباط با سرور')
  }
}

const fetchSettings = async () => {
  isFetching.value = true
  try {
    const response = await getSettingImagesApi()
    if (response.data.status === 'success') {
      settings.value = response.data.data
    }
  } catch (error) {
    handleError(error)
  } finally {
    isFetching.value = false
  }
}

const triggerUpload = (key) => {
  activeKeyForUpload.value = key
  if (fileInputRef.value) {
    fileInputRef.value.value = ''
    fileInputRef.value.click()
  }
}

const handleFileChange = async (event) => {
  const file = event.target.files[0]
  if (!file || !activeKeyForUpload.value) return

  if (file.size > 2 * 1024 * 1024) {
    notify.error('حجم فایل نباید بیشتر از ۲ مگابایت باشد')
    return
  }

  const key = activeKeyForUpload.value
  uploadingKey.value = key

  if (expandedKey.value !== key) {
    expandedKey.value = key
  }

  const formData = new FormData()
  formData.append('key', key)
  formData.append('image', file)

  try {
    const response = await uploadSettingImageApi(formData)

    if (response.data.status === 'success') {
      const index = settings.value.findIndex((s) => s.key === key)
      if (index !== -1) {
        settings.value[index].image_url = response.data.image_url
      }
      notify.success('تصویر با موفقیت بروزرسانی شد')
    }
  } catch (error) {
    handleError(error)
  } finally {
    uploadingKey.value = null
    activeKeyForUpload.value = null
  }
}

const deleteImage = async (key) => {
  if (!confirm('آیا از حذف این تصویر اطمینان دارید؟')) return

  uploadingKey.value = key
  try {
    const response = await deleteSettingImageApi(key)

    if (response.data.status === 'success') {
      const index = settings.value.findIndex((s) => s.key === key)
      if (index !== -1) {
        settings.value[index].image_url = null
      }
      notify.success('تصویر با موفقیت حذف شد')
    }
  } catch (error) {
    handleError(error)
  } finally {
    uploadingKey.value = null
  }
}

onMounted(() => {
  fetchSettings()
})
</script>

<style scoped>
.dir-ltr {
  direction: ltr;
}
</style>
