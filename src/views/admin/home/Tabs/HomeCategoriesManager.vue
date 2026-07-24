<template>
  <section
    class="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-200 hover:border-blue-500/30 transition-colors duration-300"
  >
    <!-- هدر بخش -->
    <div
      class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-gray-100 pb-4"
    >
      <div class="flex items-center gap-3">
        <div class="bg-blue-50 p-2 rounded-lg text-blue-600 shrink-0">
          <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
            ></path>
          </svg>
        </div>
        <div>
          <h2 class="text-base md:text-lg font-bold text-[#1E293B]">
            مدیریت دسته‌بندی‌های صفحه اصلی
          </h2>
          <p class="text-xs text-[#475569] mt-0.5">
            مدیریت و مرتب‌سازی دسته‌های منتخب برای نمایش در ویترین
          </p>
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
        افزودن دسته‌بندی جدید
      </button>
    </div>

    <!-- وضعیت لودینگ -->
    <div
      v-if="store.isLoading && store.categories.length === 0"
      class="flex justify-center items-center py-12"
    >
      <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
    </div>

    <!-- نمایش داده‌ها -->
    <div v-else>
      <!-- حالت موبایل: کارت‌ها -->
      <div class="md:hidden space-y-4">
        <div
          v-if="store.categories.length === 0"
          class="p-6 text-center text-gray-500 bg-gray-50 rounded-xl border border-gray-100"
        >
          هیچ دسته‌بندی برای صفحه اصلی یافت نشد.
        </div>

        <div
          v-for="item in store.categories"
          :key="'mobile-' + item.id"
          class="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col gap-3"
        >
          <div class="flex justify-between items-start gap-3">
            <img
              v-if="item.image"
              :src="item.image"
              alt="Category Image"
              class="w-16 h-16 object-cover rounded-md shadow-sm border border-gray-200 shrink-0"
            />
            <div
              v-else
              class="w-16 h-16 bg-gray-100 rounded-md flex items-center justify-center text-[10px] text-gray-400 shrink-0 text-center border border-gray-200"
            >
              بدون عکس
            </div>

            <div class="flex flex-col items-end gap-2">
              <span
                :class="
                  item.is_active
                    ? 'text-emerald-700 bg-emerald-100 border-emerald-200'
                    : 'text-gray-700 bg-gray-100 border-gray-200'
                "
                class="px-2.5 py-1 rounded-md text-xs font-medium border"
              >
                {{ item.is_active ? 'فعال' : 'غیرفعال' }}
              </span>
              <span
                class="bg-blue-50 border border-blue-100 text-blue-700 px-2 py-0.5 rounded text-[10px] font-medium"
              >
                ترتیب: {{ item.order }}
              </span>
            </div>
          </div>

          <div class="flex flex-col gap-1 mt-1">
            <h4 class="font-bold text-[#1E293B] text-sm">{{ item.title }}</h4>
            <p class="text-xs text-gray-500 truncate mt-1" dir="ltr">
              {{ item.link || 'بدون لینک' }}
            </p>
          </div>

          <div class="flex items-center gap-2 mt-2 pt-3 border-t border-gray-100">
            <button
              class="flex-1 inline-flex justify-center items-center gap-1 bg-white border border-blue-200 text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-lg transition-all text-xs font-medium"
              @click="openModal(item)"
            >
              ویرایش
            </button>
            <button
              class="flex-1 inline-flex justify-center items-center gap-1 bg-white border border-red-200 text-red-600 hover:bg-red-50 px-3 py-2 rounded-lg transition-all text-xs font-medium"
              @click="deleteCategory(item.id)"
            >
              حذف
            </button>
          </div>
        </div>
      </div>

      <!-- حالت دسکتاپ: جدول -->
      <div
        class="hidden md:block overflow-x-auto rounded-xl border border-gray-100 shadow-sm custom-scrollbar"
      >
        <table class="w-full text-right">
          <thead class="bg-[#F8FAFC] border-b border-gray-100">
            <tr>
              <th class="px-6 py-4 text-xs font-semibold text-[#1E293B] uppercase tracking-wider">
                تصویر
              </th>
              <th class="px-6 py-4 text-xs font-semibold text-[#1E293B] uppercase tracking-wider">
                عنوان
              </th>
              <th class="px-6 py-4 text-xs font-semibold text-[#1E293B] uppercase tracking-wider">
                لینک
              </th>
              <th
                class="px-6 py-4 text-xs font-semibold text-[#1E293B] uppercase tracking-wider text-center"
              >
                ترتیب
              </th>
              <th
                class="px-6 py-4 text-xs font-semibold text-[#1E293B] uppercase tracking-wider text-center"
              >
                وضعیت
              </th>
              <th
                class="px-6 py-4 text-xs font-semibold text-[#1E293B] uppercase tracking-wider text-center"
              >
                عملیات
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50">
            <tr v-if="store.categories.length === 0">
              <td class="px-6 py-12 text-center text-gray-500 text-sm" colspan="6">
                هیچ دسته‌بندی برای صفحه اصلی یافت نشد.
              </td>
            </tr>
            <tr
              v-for="item in store.categories"
              :key="'desktop-' + item.id"
              class="hover:bg-gray-50/80 transition-colors"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <img
                  v-if="item.image"
                  :src="item.image"
                  alt="Category Image"
                  class="h-12 w-12 rounded-lg object-cover border border-gray-200 shadow-sm"
                />
                <div
                  v-else
                  class="h-12 w-12 rounded-lg bg-gray-100 flex items-center justify-center text-[10px] text-gray-400 border border-gray-200"
                >
                  بدون عکس
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {{ item.title }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500" dir="ltr">
                {{ item.link || '-' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-center">
                <span
                  class="bg-gray-100 border border-gray-200 text-gray-700 px-2.5 py-1 rounded-md text-xs font-medium"
                >
                  {{ item.order }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-center">
                <span
                  :class="
                    item.is_active
                      ? 'text-emerald-700 bg-emerald-100 border-emerald-200'
                      : 'text-gray-700 bg-gray-100 border-gray-200'
                  "
                  class="px-2.5 py-1 rounded-md text-xs font-medium border"
                >
                  {{ item.is_active ? 'فعال' : 'غیرفعال' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-center">
                <div class="flex items-center justify-center gap-2">
                  <button
                    class="inline-flex items-center gap-1 bg-white border border-blue-200 text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-lg shadow-sm transition-all text-xs font-medium"
                    @click="openModal(item)"
                  >
                    ویرایش
                  </button>
                  <button
                    class="inline-flex items-center gap-1 bg-white border border-red-200 text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg shadow-sm transition-all text-xs font-medium"
                    @click="deleteCategory(item.id)"
                  >
                    حذف
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- مودال افزودن / ویرایش -->
    <div
      v-if="isModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none p-4"
    >
      <div
        class="fixed inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity"
        @click="closeModal"
      ></div>

      <div
        class="relative w-full max-w-lg mx-auto bg-white rounded-2xl shadow-2xl z-10 flex flex-col max-h-[90vh]"
      >
        <div
          class="flex items-center justify-between border-b border-gray-100 bg-[#F8FAFC] px-6 py-4 rounded-t-2xl shrink-0"
        >
          <h3 class="text-lg font-bold text-[#1E293B]">
            {{ isEditing ? 'ویرایش دسته‌بندی' : 'افزودن دسته‌بندی جدید' }}
          </h3>
          <button
            class="text-gray-400 hover:text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition-colors"
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
                >عنوان دسته‌بندی <span class="text-red-500">*</span></label
              >
              <input
                v-model="form.title"
                class="w-full bg-[#F8FAFC] border border-gray-200 text-[#1E293B] rounded-lg px-4 py-2.5 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
                required
                type="text"
              />
            </div>

            <div>
              <label class="block text-sm font-semibold text-[#475569] mb-2">لینک (URL)</label>
              <input
                v-model="form.link"
                class="w-full bg-[#F8FAFC] border border-gray-200 text-[#1E293B] rounded-lg px-4 py-2.5 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
                dir="ltr"
                placeholder="/category/slug"
                type="text"
              />
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label class="block text-sm font-semibold text-[#475569] mb-2">ترتیب نمایش</label>
                <input
                  v-model="form.order"
                  class="w-full bg-[#F8FAFC] border border-gray-200 text-[#1E293B] rounded-lg px-4 py-2.5 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
                  min="0"
                  type="number"
                />
              </div>
              <div class="flex flex-col justify-end">
                <div
                  class="flex items-center justify-between p-2.5 bg-gray-50 rounded-lg border border-gray-100 h-[46px]"
                >
                  <span class="text-sm font-semibold text-[#475569]">وضعیت فعال</span>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input v-model="form.is_active" class="sr-only peer" type="checkbox" />
                    <div
                      class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"
                    ></div>
                  </label>
                </div>
              </div>
            </div>

            <div>
              <label class="block text-sm font-semibold text-[#475569] mb-2">تصویر</label>
              <input
                accept="image/*"
                class="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-colors"
                type="file"
                @change="handleImageUpload"
              />
              <div
                v-if="imagePreview"
                class="mt-4 relative group rounded-lg overflow-hidden border border-gray-200 w-24 h-24"
              >
                <img :src="imagePreview" alt="Preview" class="w-full h-full object-cover" />
              </div>
            </div>
          </form>
        </div>

        <div
          class="border-t border-gray-100 bg-[#F8FAFC] px-6 py-4 rounded-b-2xl flex justify-end gap-3 shrink-0"
        >
          <button
            class="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            type="button"
            @click="closeModal"
          >
            انصراف
          </button>
          <button
            :disabled="isSubmitting"
            class="px-6 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-70 min-w-[130px] justify-center shadow-sm"
            type="button"
            @click="submitForm"
          >
            <span
              v-if="isSubmitting"
              class="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"
            ></span>
            <span>{{
              isSubmitting ? 'در حال ثبت...' : isEditing ? 'ذخیره تغییرات' : 'ثبت دسته‌بندی'
            }}</span>
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import axios from '@/lib/axios'
import { useNotificationStore } from '@/stores/notification'
import { useConfirmStore } from '@/stores/confirm'
import { useHomeCategoriesStore } from '@/stores/admin/homeCategories'

const notify = useNotificationStore()
const confirmStore = useConfirmStore()
const store = useHomeCategoriesStore()

const isSubmitting = ref(false)
const isModalOpen = ref(false)
const isEditing = ref(false)
const imagePreview = ref(null)

const form = ref({
  id: null,
  title: '',
  link: '',
  order: 0,
  is_active: true,
  image: null,
})

const fetchItems = async () => {
  try {
    await store.fetchCategories()
  } catch (error) {
    notify.error('خطا در دریافت لیست دسته‌بندی‌ها')
  }
}

const openModal = (item = null) => {
  if (item) {
    isEditing.value = true
    form.value = {
      id: item.id,
      title: item.title,
      link: item.link,
      order: item.order,
      is_active: Boolean(item.is_active),
      image: null,
    }
    imagePreview.value = item.image ? item.image : null
  } else {
    isEditing.value = false
    form.value = {
      id: null,
      title: '',
      link: '',
      order: 0,
      is_active: true,
      image: null,
    }
    imagePreview.value = null
  }
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
  imagePreview.value = null
}

const handleImageUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    form.value.image = file
    imagePreview.value = URL.createObjectURL(file)
  }
}

const submitForm = async () => {
  if (!form.value.title) {
    notify.error('لطفاً عنوان دسته‌بندی را وارد کنید')
    return
  }

  isSubmitting.value = true
  const formData = new FormData()
  formData.append('title', form.value.title)
  formData.append('link', form.value.link || '')
  formData.append('order', form.value.order)
  formData.append('is_active', form.value.is_active ? 1 : 0)

  if (form.value.image) {
    formData.append('image', form.value.image)
  }

  try {
    if (isEditing.value) {
      formData.append('_method', 'PUT')
      await axios.post(`/admin/home-categories/${form.value.id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      await store.fetchCategories()
      notify.success('دسته‌بندی با موفقیت بروزرسانی شد')
    } else {
      await store.addCategory(formData)
      notify.success('دسته‌بندی جدید با موفقیت اضافه شد')
    }
    closeModal()
  } catch (error) {
    notify.error('خطا در ذخیره اطلاعات دسته‌بندی')
  } finally {
    isSubmitting.value = false
  }
}

const deleteCategory = async (id) => {
  const confirmed = await confirmStore.ask({
    title: 'حذف دسته‌بندی',
    message: 'آیا از حذف این دسته‌بندی اطمینان دارید؟ این عملیات غیرقابل بازگشت است.',
    type: 'warning',
    confirmText: 'بله، حذف شود',
    cancelText: 'انصراف',
  })

  if (confirmed) {
    try {
      await store.removeCategory(id)
      notify.success('دسته‌بندی با موفقیت حذف شد')
    } catch (error) {
      notify.error('خطا در حذف دسته‌بندی')
    }
  }
}

onMounted(() => {
  fetchItems()
})
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>
