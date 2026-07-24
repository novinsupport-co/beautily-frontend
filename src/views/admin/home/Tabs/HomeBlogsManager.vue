<template>
  <section
    class="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-200 hover:border-blue-500/30 transition-colors duration-300"
  >
    <!-- هدر بخش مقالات -->
    <div
      class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-gray-100 pb-4"
    >
      <div class="flex items-center gap-3">
        <div class="bg-blue-50 p-2 rounded-lg text-blue-600 shrink-0">
          <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10l6 6v10a2 2 0 01-2 2z"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
            ></path>
            <path
              d="M12 11h4m-4 4h4m-8-4h.01M8 15h.01"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
            ></path>
          </svg>
        </div>
        <div>
          <h3 class="text-base md:text-lg font-bold text-[#1E293B]">لیست مقالات صفحه اصلی</h3>
          <p class="text-xs text-[#475569] mt-0.5">مدیریت نمایش مقالات و بلاگ‌ها در ویترین سایت</p>
        </div>
      </div>

      <button
        class="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-5 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 text-sm w-full md:w-auto"
        @click="openModal()"
      >
        <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            d="M12 4v16m8-8H4"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
          ></path>
        </svg>
        افزودن مقاله جدید
      </button>
    </div>

    <!-- وضعیت لودینگ و خطا -->
    <div v-if="blogsStore.loading" class="animate-pulse flex space-x-4 rtl:space-x-reverse mb-4">
      <div class="flex-1 space-y-4 py-1">
        <div class="h-10 bg-gray-200 rounded-lg"></div>
        <div class="h-10 bg-gray-200 rounded-lg"></div>
        <div class="h-10 bg-gray-200 rounded-lg"></div>
      </div>
    </div>
    <div
      v-if="blogsStore.error"
      class="mb-4 text-red-600 bg-red-50 p-3 rounded-lg border border-red-100 text-sm"
    >
      {{ blogsStore.error }}
    </div>

    <!-- لیست داده‌ها (ریسپانسیو: دسکتاپ = جدول، موبایل = کارت) -->
    <div v-if="!blogsStore.loading && !blogsStore.error">
      <!-- حالت موبایل: نمایش به صورت کارت (Card View) -->
      <div class="md:hidden space-y-4">
        <div
          v-if="blogsStore.homeBlogs.length === 0"
          class="p-6 text-center text-gray-500 bg-gray-50 rounded-xl border border-gray-100"
        >
          هیچ مقاله‌ای یافت نشد.
        </div>

        <div
          v-for="blog in blogsStore.homeBlogs"
          :key="'mobile-' + blog.id"
          class="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col gap-3"
        >
          <!-- هدر کارت: تصویر و وضعیت -->
          <div class="flex justify-between items-start gap-3">
            <img
              v-if="blog.image_url"
              :src="blog.image_url"
              alt="تصویر مقاله"
              class="w-20 h-14 object-cover rounded-md shadow-sm border border-gray-200 shrink-0"
            />
            <div
              v-else
              class="w-20 h-14 bg-gray-100 rounded-md flex items-center justify-center text-[10px] text-gray-400 shrink-0"
            >
              بدون عکس
            </div>

            <div class="flex flex-col items-end gap-2">
              <span
                :class="
                  blog.is_active
                    ? 'text-emerald-700 bg-emerald-100 border-emerald-200'
                    : 'text-red-700 bg-red-100 border-red-200'
                "
                class="px-2.5 py-1 rounded-md text-xs font-medium border"
              >
                {{ blog.is_active ? 'فعال' : 'غیرفعال' }}
              </span>
              <span
                class="bg-gray-100 border border-gray-200 text-gray-700 px-2 py-0.5 rounded text-[10px] font-medium"
              >
                ترتیب: {{ blog.order }}
              </span>
            </div>
          </div>

          <!-- اطلاعات مقاله -->
          <div class="flex flex-col gap-1 mt-1">
            <h4 class="font-bold text-[#1E293B] text-sm">{{ blog.title }}</h4>
            <p class="text-xs text-blue-500 truncate mt-1" dir="ltr">
              {{ blog.link || 'بدون لینک' }}
            </p>
          </div>

          <!-- دکمه‌های عملیات -->
          <div class="flex items-center gap-2 mt-2 pt-3 border-t border-gray-100">
            <button
              class="flex-1 inline-flex justify-center items-center gap-1 bg-white border border-blue-200 text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-lg transition-all text-xs font-medium"
              @click="openModal(blog)"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                ></path>
              </svg>
              ویرایش
            </button>
            <button
              class="flex-1 inline-flex justify-center items-center gap-1 bg-white border border-red-200 text-red-600 hover:bg-red-50 px-3 py-2 rounded-lg transition-all text-xs font-medium"
              @click="deleteBlog(blog.id)"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                ></path>
              </svg>
              حذف
            </button>
          </div>
        </div>
      </div>

      <!-- حالت دسکتاپ: جدول استاندارد (مخفی در موبایل) -->
      <div
        class="hidden md:block overflow-x-auto rounded-lg border border-gray-100 custom-scrollbar"
      >
        <table class="w-full text-sm text-right text-[#475569]">
          <thead class="text-xs text-[#1E293B] uppercase bg-[#F8FAFC] border-b border-gray-200">
            <tr>
              <th class="px-4 py-4 font-semibold whitespace-nowrap">تصویر</th>
              <th class="px-4 py-4 font-semibold whitespace-nowrap">عنوان</th>
              <th class="px-4 py-4 font-semibold whitespace-nowrap">لینک</th>
              <th class="px-4 py-4 font-semibold whitespace-nowrap text-center">ترتیب</th>
              <th class="px-4 py-4 font-semibold whitespace-nowrap text-center">وضعیت</th>
              <th class="px-4 py-4 font-semibold text-center whitespace-nowrap">عملیات</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="blogsStore.homeBlogs.length === 0">
              <td class="px-4 py-8 text-center text-gray-500" colspan="6">
                هیچ مقاله‌ای یافت نشد.
              </td>
            </tr>
            <tr
              v-for="blog in blogsStore.homeBlogs"
              :key="'desktop-' + blog.id"
              class="border-b border-gray-50 hover:bg-gray-50/80 transition-colors"
            >
              <td class="px-4 py-3">
                <img
                  v-if="blog.image_url"
                  :src="blog.image_url"
                  alt="تصویر مقاله"
                  class="w-16 h-12 object-cover rounded-md shadow-sm border border-gray-200"
                />
                <div
                  v-else
                  class="w-16 h-12 bg-gray-100 rounded-md flex items-center justify-center text-[10px] text-gray-400"
                >
                  بدون عکس
                </div>
              </td>
              <td class="px-4 py-3 font-medium text-[#1E293B] whitespace-nowrap">
                {{ blog.title }}
              </td>
              <td class="px-4 py-3 truncate max-w-[150px] whitespace-nowrap text-xs" dir="ltr">
                {{ blog.link || '-' }}
              </td>
              <td class="px-4 py-3 text-center whitespace-nowrap">
                <span
                  class="bg-gray-100 border border-gray-200 text-gray-700 px-2.5 py-1 rounded-md text-xs font-medium"
                >
                  {{ blog.order }}
                </span>
              </td>
              <td class="px-4 py-3 text-center whitespace-nowrap">
                <span
                  :class="
                    blog.is_active
                      ? 'text-emerald-700 bg-emerald-100 border-emerald-200'
                      : 'text-red-700 bg-red-100 border-red-200'
                  "
                  class="px-2.5 py-1 rounded-md text-xs font-medium border"
                >
                  {{ blog.is_active ? 'فعال' : 'غیرفعال' }}
                </span>
              </td>
              <td class="px-4 py-3 text-center whitespace-nowrap">
                <div class="flex items-center justify-center gap-2">
                  <button
                    class="inline-flex items-center gap-1 bg-white border border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300 px-3 py-1.5 rounded-lg shadow-sm transition-all text-xs font-medium"
                    @click="openModal(blog)"
                  >
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                      ></path>
                    </svg>
                    ویرایش
                  </button>
                  <button
                    class="inline-flex items-center gap-1 bg-white border border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 px-3 py-1.5 rounded-lg shadow-sm transition-all text-xs font-medium"
                    @click="deleteBlog(blog.id)"
                  >
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                      ></path>
                    </svg>
                    حذف
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- مودال افزودن/ویرایش -->
    <div
      v-if="isModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
    >
      <div class="bg-white rounded-xl w-full max-w-lg shadow-2xl flex flex-col max-h-[90vh]">
        <div
          class="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-[#F8FAFC] rounded-t-xl shrink-0"
        >
          <h3 class="text-lg font-bold text-[#1E293B]">
            {{ editingId ? 'ویرایش مقاله' : 'افزودن مقاله جدید' }}
          </h3>
          <button
            class="text-gray-400 hover:text-red-500 bg-gray-100 hover:bg-red-50 p-1.5 rounded-lg transition-colors"
            @click="closeModal"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                d="M6 18L18 6M6 6l12 12"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
              ></path>
            </svg>
          </button>
        </div>

        <div class="overflow-y-auto p-6 custom-scrollbar">
          <form class="space-y-5" @submit.prevent="submitForm">
            <div>
              <label class="block text-sm font-semibold text-[#475569] mb-2"
                >عنوان مقاله <span class="text-red-500">*</span></label
              >
              <input
                v-model="form.title"
                class="w-full bg-[#F8FAFC] border border-gray-200 text-[#1E293B] rounded-lg px-4 py-2.5 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
                placeholder="مثال: ۱۰ راهکار مراقبت از پوست"
                required
                type="text"
              />
            </div>

            <div>
              <label class="block text-sm font-semibold text-[#475569] mb-2">لینک (URL)</label>
              <input
                v-model="form.link"
                class="w-full bg-[#F8FAFC] border border-gray-200 text-[#1E293B] rounded-lg px-4 py-2.5 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none text-left"
                dir="ltr"
                placeholder="https://..."
                type="text"
              />
            </div>

            <div>
              <label class="block text-sm font-semibold text-[#475569] mb-2">ترتیب نمایش</label>
              <input
                v-model="form.order"
                class="w-full bg-[#F8FAFC] border border-gray-200 text-[#1E293B] rounded-lg px-4 py-2.5 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
                min="0"
                type="number"
              />
            </div>

            <div
              class="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100"
            >
              <span class="text-sm font-semibold text-[#475569]">وضعیت نمایش (فعال)</span>
              <label class="relative inline-flex items-center cursor-pointer">
                <input v-model="form.is_active" class="sr-only peer" type="checkbox" />
                <div
                  class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"
                ></div>
              </label>
            </div>

            <div>
              <label class="block text-sm font-semibold text-[#475569] mb-2">تصویر مقاله</label>

              <!-- پیش‌نمایش تصویر فعلی هنگام ویرایش -->
              <div
                v-if="editingId && form.current_image && !selectedFile"
                class="mb-3 relative group rounded-lg overflow-hidden border border-gray-200 w-32"
              >
                <img
                  :src="form.current_image"
                  alt="current image preview"
                  class="w-full h-24 object-cover"
                />
                <div
                  class="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <span class="text-white text-xs font-medium">تصویر فعلی</span>
                </div>
              </div>

              <div
                class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-200 border-dashed rounded-xl hover:border-blue-400 hover:bg-blue-50/50 transition-colors bg-[#F8FAFC]"
              >
                <div class="space-y-1 text-center">
                  <svg
                    class="mx-auto h-12 w-12 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 48 48"
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                    />
                  </svg>
                  <div class="flex text-sm text-gray-600 justify-center">
                    <label
                      class="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-700 focus-within:outline-none px-2 py-1"
                      for="file-upload"
                    >
                      <span>{{ editingId ? 'تغییر فایل' : 'انتخاب فایل' }}</span>
                      <input
                        id="file-upload"
                        accept="image/*"
                        class="sr-only"
                        name="file-upload"
                        type="file"
                        @change="handleFileChange"
                      />
                    </label>
                  </div>
                  <p
                    class="text-xs text-gray-500 mt-2 font-medium bg-gray-100 py-1 px-2 rounded-md inline-block"
                  >
                    {{ selectedFile ? selectedFile.name : 'PNG, JPG تا 2MB' }}
                  </p>
                </div>
              </div>
            </div>
          </form>
        </div>

        <div
          class="px-6 py-4 border-t border-gray-100 flex justify-end gap-3 bg-[#F8FAFC] rounded-b-xl shrink-0"
        >
          <button
            class="px-5 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm"
            type="button"
            @click="closeModal"
          >
            انصراف
          </button>
          <button
            :disabled="isSubmitting"
            class="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-6 rounded-lg shadow-sm transition-all duration-200 disabled:opacity-70 text-sm min-w-[120px]"
            type="button"
            @click="submitForm"
          >
            <svg
              v-if="isSubmitting"
              class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
              fill="none"
              viewBox="0 0 24 24"
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
            <span>{{ isSubmitting ? 'در حال ثبت...' : 'ذخیره مقاله' }}</span>
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue'
import { useHomeBlogsStore } from '@/stores/admin/homeBlogs'
import { useNotificationStore } from '@/stores/notification'
import { useConfirmStore } from '@/stores/confirm'

const blogsStore = useHomeBlogsStore()
const notify = useNotificationStore()
const confirmStore = useConfirmStore()

const isModalOpen = ref(false)
const isSubmitting = ref(false)
const editingId = ref<number | null>(null)
const selectedFile = ref<File | null>(null)

const form = reactive({
  title: '',
  link: '',
  order: 0,
  is_active: true,
  current_image: '',
})

onMounted(async () => {
  try {
    await blogsStore.fetchHomeBlogs()
  } catch (error: any) {
    notify.error(error.response?.data?.message || 'خطا در دریافت لیست مقالات.')
  }
})

const openModal = (blog: any = null) => {
  if (blog) {
    editingId.value = blog.id
    form.title = blog.title
    form.link = blog.link || ''
    form.order = blog.order || 0
    form.is_active = Boolean(blog.is_active)
    form.current_image = blog.image_url || blog.image || ''
  } else {
    resetForm()
  }
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
  resetForm()
}

const resetForm = () => {
  editingId.value = null
  selectedFile.value = null
  form.title = ''
  form.link = ''
  form.order = 0
  form.is_active = true
  form.current_image = ''
}

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    selectedFile.value = target.files[0]
  }
}

const submitForm = async () => {
  isSubmitting.value = true
  try {
    const formData = new FormData()
    formData.append('title', form.title)
    if (form.link) formData.append('link', form.link)
    formData.append('order', String(form.order))
    formData.append('is_active', form.is_active ? '1' : '0')

    if (editingId.value) {
      formData.append('_method', 'PUT')
    }

    if (selectedFile.value) {
      formData.append('image', selectedFile.value)
    }

    if (editingId.value) {
      await blogsStore.updateHomeBlog(editingId.value, formData)
      notify.success('مقاله با موفقیت ویرایش شد.')
    } else {
      await blogsStore.addHomeBlog(formData)
      notify.success('مقاله جدید با موفقیت ایجاد شد.')
    }
    closeModal()
  } catch (error: any) {
    notify.error(error.response?.data?.message || 'خطا در ذخیره اطلاعات.')
  } finally {
    isSubmitting.value = false
  }
}

const deleteBlog = async (id: number) => {
  const isConfirmed = await confirmStore.ask({
    title: 'حذف مقاله',
    message: 'آیا از حذف این مقاله اطمینان دارید؟',
    type: 'danger',
    confirmText: 'بله، حذف کن',
    cancelText: 'انصراف',
  })

  if (!isConfirmed) return

  try {
    await blogsStore.deleteHomeBlog(id)
    notify.success('مقاله با موفقیت حذف شد.')
  } catch (error: any) {
    notify.error(error.response?.data?.message || 'خطا در حذف مقاله.')
  }
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  height: 6px;
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #cbd5e1;
  border-radius: 10px;
}
</style>
