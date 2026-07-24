<template>
  <section
    class="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-200 hover:border-blue-500/30 transition-colors duration-300"
  >
    <!-- هدر بخش هیروها -->
    <div
      class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-gray-100 pb-4"
    >
      <div class="flex items-center gap-3">
        <div class="bg-blue-50 p-2 rounded-lg text-blue-600 shrink-0">
          <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
            ></path>
          </svg>
        </div>
        <div>
          <h2 class="text-base md:text-lg font-bold text-[#1E293B]">لیست هیروهای سایت</h2>
          <p class="text-xs text-[#475569] mt-0.5">مدیریت تصاویر و محتوای اسلایدر اصلی</p>
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
        افزودن هیرو جدید
      </button>
    </div>

    <!-- وضعیت لودینگ -->
    <div
      v-if="heroStore.isLoading && heroStore.heroes.length === 0"
      class="flex justify-center items-center py-12"
    >
      <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
    </div>

    <!-- نمایش داده‌ها -->
    <div v-else>
      <!-- حالت موبایل: کارت‌ها -->
      <div class="md:hidden space-y-4">
        <div
          v-if="heroStore.heroes.length === 0"
          class="p-6 text-center text-gray-500 bg-gray-50 rounded-xl border border-gray-100"
        >
          هیچ هیرویی یافت نشد.
        </div>

        <div
          v-for="hero in heroStore.heroes"
          :key="'mobile-' + hero.id"
          class="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col gap-3"
        >
          <div class="flex justify-between items-start gap-3">
            <img
              v-if="hero.image_url"
              :src="hero.image_url"
              alt="hero"
              class="w-20 h-14 object-cover rounded-md shadow-sm border border-gray-200 shrink-0"
            />
            <div
              v-else
              class="w-20 h-14 bg-gray-100 rounded-md flex items-center justify-center text-[10px] text-gray-400 shrink-0 text-center border border-gray-200"
            >
              بدون عکس
            </div>

            <div class="flex flex-col items-end gap-2">
              <span
                :class="
                  hero.is_active
                    ? 'text-emerald-700 bg-emerald-100 border-emerald-200'
                    : 'text-gray-700 bg-gray-100 border-gray-200'
                "
                class="px-2.5 py-1 rounded-md text-xs font-medium border"
              >
                {{ hero.is_active ? 'فعال' : 'غیرفعال' }}
              </span>
              <span
                class="bg-gray-50 border border-gray-200 text-gray-600 px-2 py-0.5 rounded text-[10px] font-medium"
              >
                ترتیب: {{ hero.sort_order }}
              </span>
            </div>
          </div>

          <div class="flex flex-col gap-1 mt-1">
            <h4 class="font-bold text-[#1E293B] text-sm">{{ hero.title || 'بدون عنوان' }}</h4>
            <p class="text-xs text-gray-500 mt-0.5">{{ hero.subtitle || 'بدون زیرعنوان' }}</p>
          </div>

          <div class="mt-2 bg-blue-50/40 p-2.5 rounded-lg border border-blue-100/50">
            <div class="text-[#1E293B] text-xs font-semibold mb-1">
              دکمه: {{ hero.cta_text || '---' }}
            </div>
            <div class="text-[10px] text-gray-500 truncate" dir="ltr">
              {{ hero.cta_link || '---' }}
            </div>
          </div>

          <div class="flex items-center gap-2 mt-2 pt-3 border-t border-gray-100">
            <button
              class="flex-1 inline-flex justify-center items-center gap-1 bg-white border border-blue-200 text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-lg transition-all text-xs font-medium"
              @click="openModal(hero)"
            >
              ویرایش
            </button>
            <button
              class="flex-1 inline-flex justify-center items-center gap-1 bg-white border border-red-200 text-red-600 hover:bg-red-50 px-3 py-2 rounded-lg transition-all text-xs font-medium"
              @click="deleteHero(hero.id)"
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
        <table class="w-full text-sm text-right text-[#475569]">
          <thead class="text-xs text-[#1E293B] uppercase bg-[#F8FAFC] border-b border-gray-100">
            <tr>
              <th class="px-6 py-4 font-semibold whitespace-nowrap w-24">تصویر</th>
              <th class="px-6 py-4 font-semibold whitespace-nowrap">عنوان و زیرعنوان</th>
              <th class="px-6 py-4 font-semibold whitespace-nowrap">دکمه (CTA)</th>
              <th class="px-6 py-4 font-semibold text-center whitespace-nowrap w-20">ترتیب</th>
              <th class="px-6 py-4 font-semibold text-center whitespace-nowrap w-24">وضعیت</th>
              <th class="px-6 py-4 font-semibold text-center whitespace-nowrap w-40">عملیات</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50">
            <tr v-if="heroStore.heroes.length === 0">
              <td class="px-6 py-12 text-center text-gray-500 text-sm" colspan="6">
                هیچ هیرویی یافت نشد.
              </td>
            </tr>
            <tr
              v-for="hero in heroStore.heroes"
              :key="'desktop-' + hero.id"
              class="hover:bg-gray-50/80 transition-colors"
            >
              <td class="px-6 py-3">
                <img
                  v-if="hero.image_url"
                  :src="hero.image_url"
                  alt="hero"
                  class="w-16 h-12 object-cover rounded-md shadow-sm border border-gray-200"
                />
                <div
                  v-else
                  class="w-16 h-12 bg-gray-100 rounded-md flex items-center justify-center text-[10px] text-gray-400 border border-gray-200"
                >
                  بدون عکس
                </div>
              </td>
              <td class="px-6 py-3 whitespace-nowrap">
                <div class="font-medium text-[#1E293B]">{{ hero.title || '---' }}</div>
                <div class="text-xs text-gray-500 mt-1">{{ hero.subtitle || '---' }}</div>
              </td>
              <td class="px-6 py-3 whitespace-nowrap">
                <div class="text-[#1E293B] text-xs font-medium">{{ hero.cta_text || '---' }}</div>
                <div class="text-[10px] text-gray-500 truncate max-w-[150px] mt-1" dir="ltr">
                  {{ hero.cta_link || '---' }}
                </div>
              </td>
              <td class="px-6 py-3 text-center whitespace-nowrap">
                <span
                  class="bg-gray-100 border border-gray-200 text-gray-700 px-2.5 py-1 rounded-md text-xs font-medium"
                >
                  {{ hero.sort_order }}
                </span>
              </td>
              <td class="px-6 py-3 text-center whitespace-nowrap">
                <span
                  :class="
                    hero.is_active
                      ? 'text-emerald-700 bg-emerald-100 border-emerald-200'
                      : 'text-gray-700 bg-gray-100 border-gray-200'
                  "
                  class="px-2.5 py-1 rounded-md text-xs font-medium border"
                >
                  {{ hero.is_active ? 'فعال' : 'غیرفعال' }}
                </span>
              </td>
              <td class="px-6 py-3 text-center whitespace-nowrap">
                <div class="flex items-center justify-center gap-2">
                  <button
                    class="inline-flex items-center gap-1 bg-white border border-blue-200 text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-lg shadow-sm transition-all text-xs font-medium"
                    @click="openModal(hero)"
                  >
                    ویرایش
                  </button>
                  <button
                    class="inline-flex items-center gap-1 bg-white border border-red-200 text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg shadow-sm transition-all text-xs font-medium"
                    @click="deleteHero(hero.id)"
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

    <!-- مودال افزودن/ویرایش -->
    <div
      v-if="isModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none p-4"
    >
      <div
        class="fixed inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity"
        @click="closeModal"
      ></div>

      <div
        class="relative w-full max-w-2xl mx-auto bg-white rounded-2xl shadow-2xl z-10 flex flex-col max-h-[90vh]"
      >
        <!-- هدر مودال -->
        <div
          class="flex items-center justify-between border-b border-gray-100 bg-[#F8FAFC] px-6 py-4 rounded-t-2xl shrink-0"
        >
          <h3 class="text-lg font-bold text-[#1E293B]">
            {{ editingId ? 'ویرایش هیرو' : 'افزودن هیرو جدید' }}
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

        <!-- بدنه مودال با قابلیت اسکرول -->
        <div class="overflow-y-auto p-6 custom-scrollbar">
          <form class="space-y-5" @submit.prevent="submitForm">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
              <!-- عنوان -->
              <div>
                <label class="block text-sm font-semibold text-[#475569] mb-2"
                  >عنوان (اختیاری)</label
                >
                <input
                  v-model="form.title"
                  class="w-full bg-[#F8FAFC] border border-gray-200 text-[#1E293B] rounded-lg px-4 py-2.5 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
                  placeholder="مثال: جشنواره تابستانه"
                  type="text"
                />
              </div>

              <!-- زیرعنوان -->
              <div>
                <label class="block text-sm font-semibold text-[#475569] mb-2"
                  >زیر عنوان (اختیاری)</label
                >
                <input
                  v-model="form.subtitle"
                  class="w-full bg-[#F8FAFC] border border-gray-200 text-[#1E293B] rounded-lg px-4 py-2.5 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
                  type="text"
                />
              </div>

              <!-- متن دکمه -->
              <div>
                <label class="block text-sm font-semibold text-[#475569] mb-2"
                  >متن دکمه (CTA)</label
                >
                <input
                  v-model="form.cta_text"
                  class="w-full bg-[#F8FAFC] border border-gray-200 text-[#1E293B] rounded-lg px-4 py-2.5 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
                  placeholder="مثال: مشاهده محصولات"
                  type="text"
                />
              </div>

              <!-- لینک دکمه -->
              <div>
                <label class="block text-sm font-semibold text-[#475569] mb-2">لینک دکمه</label>
                <input
                  v-model="form.cta_link"
                  class="w-full bg-[#F8FAFC] border border-gray-200 text-[#1E293B] rounded-lg px-4 py-2.5 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none text-left"
                  dir="ltr"
                  placeholder="https://..."
                  type="text"
                />
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <!-- ترتیب نمایش -->
              <div>
                <label class="block text-sm font-semibold text-[#475569] mb-2">ترتیب نمایش</label>
                <input
                  v-model.number="form.sort_order"
                  class="w-full bg-[#F8FAFC] border border-gray-200 text-[#1E293B] rounded-lg px-4 py-2.5 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
                  min="0"
                  type="number"
                />
              </div>

              <!-- سوییچ وضعیت -->
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

            <!-- آپلود تصویر -->
            <div>
              <label class="block text-sm font-semibold text-[#475569] mb-2">
                تصویر هیرو <span v-if="!editingId" class="text-red-500">*</span>
              </label>
              <div
                class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-200 border-dashed rounded-xl hover:border-blue-400 hover:bg-blue-50/50 transition-colors bg-[#F8FAFC]"
              >
                <div class="space-y-1 text-center">
                  <svg
                    aria-hidden="true"
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
                      <span>انتخاب فایل</span>
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
                    {{ selectedFile ? selectedFile.name : 'PNG, JPG, WEBP' }}
                  </p>
                </div>
              </div>
            </div>
          </form>
        </div>

        <!-- فوتر مودال -->
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
              isSubmitting ? 'در حال ثبت...' : editingId ? 'ذخیره تغییرات' : 'ثبت هیرو'
            }}</span>
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue'
import { useHomeHeroStore } from '@/stores/admin/useHomeHeroStore'
import { useNotificationStore } from '@/stores/notification'
import { useConfirmStore } from '@/stores/confirm'

const heroStore = useHomeHeroStore()
const notify = useNotificationStore()
const confirmStore = useConfirmStore()

const isModalOpen = ref(false)
const isSubmitting = ref(false)
const editingId = ref<number | null>(null)
const selectedFile = ref<File | null>(null)

const form = reactive({
  title: '',
  subtitle: '',
  cta_text: '',
  cta_link: '',
  sort_order: 0,
  is_active: true,
})

onMounted(async () => {
  try {
    await heroStore.fetchHeroes()
  } catch (error) {
    notify.error('خطا در دریافت لیست هیروها')
    console.error(error)
  }
})

const openModal = (hero: any = null) => {
  if (hero) {
    editingId.value = hero.id
    form.title = hero.title || ''
    form.subtitle = hero.subtitle || ''
    form.cta_text = hero.cta_text || ''
    form.cta_link = hero.cta_link || ''
    form.sort_order = hero.sort_order || 0
    form.is_active = Boolean(hero.is_active)
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
  form.subtitle = ''
  form.cta_text = ''
  form.cta_link = ''
  form.sort_order = 0
  form.is_active = true
}

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    selectedFile.value = target.files[0]
  }
}

const submitForm = async () => {
  if (!editingId.value && !selectedFile.value) {
    notify.error('لطفاً یک تصویر برای هیرو انتخاب کنید.')
    return
  }

  isSubmitting.value = true
  try {
    const formData = new FormData()
    if (form.title) formData.append('title', form.title)
    if (form.subtitle) formData.append('subtitle', form.subtitle)
    if (form.cta_text) formData.append('cta_text', form.cta_text)
    if (form.cta_link) formData.append('cta_link', form.cta_link)
    formData.append('sort_order', form.sort_order.toString())
    formData.append('is_active', form.is_active ? '1' : '0')

    if (editingId.value) {
      formData.append('_method', 'PUT')
    }

    if (selectedFile.value) {
      formData.append('image', selectedFile.value)
    }

    if (editingId.value) {
      await heroStore.updateHero(editingId.value, formData)
      notify.success('هیرو با موفقیت ویرایش شد.')
    } else {
      await heroStore.createHero(formData)
      notify.success('هیرو با موفقیت اضافه شد.')
    }
    closeModal()
  } catch (error) {
    notify.error('خطا در ذخیره اطلاعات. لطفاً دوباره تلاش کنید.')
    console.error(error)
  } finally {
    isSubmitting.value = false
  }
}

const deleteHero = async (id: number) => {
  const isConfirmed = await confirmStore.ask({
    title: 'حذف هیرو',
    message: 'آیا از حذف این هیرو اطمینان دارید؟ این عملیات غیرقابل بازگشت است.',
    type: 'danger',
    confirmText: 'حذف',
    cancelText: 'انصراف',
  })

  if (isConfirmed) {
    try {
      await heroStore.deleteHero(id)
      notify.success('هیرو با موفقیت حذف شد.')
    } catch (error) {
      notify.error('خطا در حذف هیرو.')
      console.error(error)
    }
  }
}
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
  background-color: #cbd5e1;
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>
