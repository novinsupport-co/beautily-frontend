<template>
  <section
    class="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-200 hover:border-blue-500/30 transition-colors duration-300"
  >
    <!-- هدر بخش اسلایدرها -->
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
          <h2 class="text-base md:text-lg font-bold text-[#1E293B]">مدیریت اسلایدرهای محصول</h2>
          <p class="text-xs text-[#475569] mt-0.5">
            مدیریت لیست محصولات صفحه اصلی (داینامیک و دستی)
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
        افزودن اسلایدر جدید
      </button>
    </div>

    <!-- وضعیت لودینگ -->
    <div
      v-if="sliderStore.loading && sliderStore.sliders.length === 0"
      class="flex justify-center items-center py-12"
    >
      <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
    </div>

    <!-- نمایش داده‌ها -->
    <div v-else>
      <!-- حالت موبایل: کارت‌ها -->
      <div class="md:hidden space-y-4">
        <div
          v-if="sliderStore.sliders.length === 0"
          class="p-6 text-center text-gray-500 bg-gray-50 rounded-xl border border-gray-100"
        >
          هیچ اسلایدری یافت نشد.
        </div>

        <div
          v-for="slider in sliderStore.sliders"
          :key="'mobile-' + slider.id"
          class="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col gap-3"
        >
          <div class="flex justify-between items-start gap-3">
            <h4 class="font-bold text-[#1E293B] text-sm">{{ slider.title }}</h4>
            <div class="flex flex-col items-end gap-2 shrink-0">
              <span
                :class="
                  slider.is_active
                    ? 'text-emerald-700 bg-emerald-100 border-emerald-200'
                    : 'text-gray-700 bg-gray-100 border-gray-200'
                "
                class="px-2.5 py-1 rounded-md text-xs font-medium border"
              >
                {{ slider.is_active ? 'فعال' : 'غیرفعال' }}
              </span>
            </div>
          </div>

          <div class="flex items-center justify-between text-xs mt-1">
            <span class="text-gray-500">نوع اسلایدر:</span>
            <span
              v-if="slider.type === 'dynamic'"
              class="px-2 py-1 bg-purple-50 text-purple-600 border border-purple-100 rounded text-[10px] font-medium"
            >
              داینامیک ({{ slider.query_type }})
            </span>
            <span
              v-else
              class="px-2 py-1 bg-orange-50 text-orange-600 border border-orange-100 rounded text-[10px] font-medium"
            >
              دستی (انتخابی)
            </span>
          </div>

          <div class="flex items-center gap-2 mt-2 pt-3 border-t border-gray-100">
            <button
              class="flex-1 inline-flex justify-center items-center gap-1 bg-white border border-blue-200 text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-lg transition-all text-xs font-medium"
              @click="openModal(slider)"
            >
              ویرایش
            </button>
            <button
              class="flex-1 inline-flex justify-center items-center gap-1 bg-white border border-red-200 text-red-600 hover:bg-red-50 px-3 py-2 rounded-lg transition-all text-xs font-medium"
              @click="deleteSlider(slider.id)"
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
              <th class="px-6 py-4 font-semibold whitespace-nowrap">عنوان</th>
              <th class="px-6 py-4 font-semibold whitespace-nowrap">نوع</th>
              <th class="px-6 py-4 font-semibold text-center whitespace-nowrap w-24">وضعیت</th>
              <th class="px-6 py-4 font-semibold text-center whitespace-nowrap w-40">عملیات</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50">
            <tr v-if="sliderStore.sliders.length === 0">
              <td class="px-6 py-12 text-center text-gray-500 text-sm" colspan="4">
                هیچ اسلایدری یافت نشد.
              </td>
            </tr>
            <tr
              v-for="slider in sliderStore.sliders"
              :key="'desktop-' + slider.id"
              class="hover:bg-gray-50/80 transition-colors"
            >
              <td class="px-6 py-4 font-medium text-[#1E293B] whitespace-nowrap">
                {{ slider.title }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  v-if="slider.type === 'dynamic'"
                  class="px-2.5 py-1 bg-purple-50 text-purple-600 border border-purple-100 rounded-md text-xs font-medium"
                >
                  داینامیک ({{ slider.query_type }})
                </span>
                <span
                  v-else
                  class="px-2.5 py-1 bg-orange-50 text-orange-600 border border-orange-100 rounded-md text-xs font-medium"
                >
                  دستی (Manual)
                </span>
              </td>
              <td class="px-6 py-4 text-center whitespace-nowrap">
                <span
                  :class="
                    slider.is_active
                      ? 'text-emerald-700 bg-emerald-100 border-emerald-200'
                      : 'text-gray-700 bg-gray-100 border-gray-200'
                  "
                  class="px-2.5 py-1 rounded-md text-xs font-medium border"
                >
                  {{ slider.is_active ? 'فعال' : 'غیرفعال' }}
                </span>
              </td>
              <td class="px-6 py-4 text-center whitespace-nowrap">
                <div class="flex items-center justify-center gap-2">
                  <button
                    class="inline-flex items-center gap-1 bg-white border border-blue-200 text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-lg shadow-sm transition-all text-xs font-medium"
                    @click="openModal(slider)"
                  >
                    ویرایش
                  </button>
                  <button
                    class="inline-flex items-center gap-1 bg-white border border-red-200 text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg shadow-sm transition-all text-xs font-medium"
                    @click="deleteSlider(slider.id)"
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

    <!-- مودال ایجاد / ویرایش -->
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
            {{ isEditing ? 'ویرایش اسلایدر' : 'افزودن اسلایدر جدید' }}
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

        <!-- بدنه مودال -->
        <div class="overflow-y-auto p-6 custom-scrollbar space-y-6">
          <!-- عنوان -->
          <div>
            <label class="block text-sm font-semibold text-[#475569] mb-2"
              >عنوان اسلایدر <span class="text-red-500">*</span></label
            >
            <input
              v-model="form.title"
              class="w-full bg-[#F8FAFC] border border-gray-200 text-[#1E293B] rounded-lg px-4 py-2.5 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
              placeholder="مثال: پرفروش‌ترین محصولات"
              type="text"
            />
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

          <!-- نوع اسلایدر -->
          <div>
            <label class="block text-sm font-semibold text-[#475569] mb-2"
              >نوع اسلایدر <span class="text-red-500">*</span></label
            >
            <div class="flex gap-4">
              <label
                :class="{ 'bg-blue-50/50 border-blue-200': form.type === 'dynamic' }"
                class="flex items-center gap-2 cursor-pointer p-3 border border-gray-200 rounded-lg hover:bg-gray-50 flex-1 transition-colors"
              >
                <input
                  v-model="form.type"
                  class="text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                  type="radio"
                  value="dynamic"
                />
                <span class="text-sm font-medium text-gray-700">داینامیک (خودکار)</span>
              </label>
              <label
                :class="{ 'bg-orange-50/50 border-orange-200': form.type === 'manual' }"
                class="flex items-center gap-2 cursor-pointer p-3 border border-gray-200 rounded-lg hover:bg-gray-50 flex-1 transition-colors"
              >
                <input
                  v-model="form.type"
                  class="text-orange-600 focus:ring-orange-500 w-4 h-4 cursor-pointer"
                  type="radio"
                  value="manual"
                />
                <span class="text-sm font-medium text-gray-700">دستی (انتخابی)</span>
              </label>
            </div>
          </div>

          <!-- تنظیمات داینامیک -->
          <div
            v-if="form.type === 'dynamic'"
            class="p-4 bg-blue-50/50 border border-blue-100 rounded-xl"
          >
            <label class="block text-sm font-semibold text-[#475569] mb-2"
              >شرط نمایش (Query Type)</label
            >
            <select
              v-model="form.query_type"
              class="w-full bg-white border border-gray-200 text-[#1E293B] rounded-lg px-4 py-2.5 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
            >
              <option value="latest">جدیدترین محصولات</option>
              <option value="bestseller">پرفروش‌ترین محصولات</option>
              <option value="most_viewed">پربازدیدترین محصولات</option>
              <option value="discounted">محصولات تخفیف‌دار</option>
            </select>
            <p class="text-xs text-gray-500 mt-2 font-medium">
              محصولات به صورت خودکار بر اساس این شرط در سایت نمایش داده می‌شوند.
            </p>
          </div>

          <!-- تنظیمات دستی (Manual) -->
          <div
            v-if="form.type === 'manual'"
            class="p-4 bg-orange-50/50 border border-orange-100 rounded-xl min-h-[200px]"
          >
            <label class="block text-sm font-semibold text-[#475569] mb-2">انتخاب محصولات</label>

            <!-- فیلد جستجو -->
            <div class="relative mb-4">
              <input
                v-model="searchQuery"
                class="w-full bg-white border border-gray-200 text-[#1E293B] rounded-lg px-4 py-2.5 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all outline-none text-sm"
                placeholder="نام یا کد محصول را برای جستجو وارد کنید..."
                type="text"
                @input="handleSearch"
              />

              <!-- لیست نتایج جستجو -->
              <ul
                v-if="isSearchOpen && searchResults.length > 0"
                class="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl max-h-48 overflow-y-auto custom-scrollbar"
              >
                <li
                  v-for="product in searchResults"
                  :key="product.id"
                  class="px-4 py-2.5 cursor-pointer hover:bg-orange-50 text-sm border-b last:border-0 border-gray-100 flex justify-between items-center transition-colors"
                  @click="addProduct(product)"
                >
                  <span class="font-medium text-gray-700">{{ product.name || product.title }}</span>
                  <span
                    v-if="product.sku"
                    class="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded"
                    >{{ product.sku }}</span
                  >
                </li>
              </ul>

              <!-- وضعیت جستجو -->
              <div
                v-if="isSearching"
                class="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl p-3 text-sm text-center text-gray-500"
              >
                در حال جستجو...
              </div>
              <div
                v-if="
                  !isSearching &&
                  isSearchOpen &&
                  searchResults.length === 0 &&
                  searchQuery.length >= 2
                "
                class="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl p-3 text-sm text-center text-gray-500"
              >
                محصولی یافت نشد.
              </div>
            </div>

            <!-- محصولات انتخاب شده -->
            <div v-if="selectedProducts.length > 0" class="flex flex-wrap gap-2">
              <div
                v-for="product in selectedProducts"
                :key="product.id"
                class="flex items-center bg-white border border-orange-200 shadow-sm rounded-lg pl-2 pr-3 py-1.5 text-xs font-medium text-gray-700"
              >
                <span>{{ product.name || product.title || `محصول ${product.id}` }}</span>
                <button
                  class="mr-2 text-red-400 hover:text-red-600 hover:bg-red-50 p-1 rounded transition-colors focus:outline-none"
                  type="button"
                  @click="removeProduct(product.id)"
                >
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      d="M6 18L18 6M6 6l12 12"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                    ></path>
                  </svg>
                </button>
              </div>
            </div>
            <div
              v-else
              class="text-center text-xs text-gray-400 py-4 border-2 border-dashed border-gray-200 rounded-lg bg-white/50"
            >
              هنوز محصولی انتخاب نشده است.
            </div>
          </div>
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
            :disabled="sliderStore.loading"
            class="px-6 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-70 min-w-[130px] justify-center shadow-sm"
            type="button"
            @click="submitForm"
          >
            <span
              v-if="sliderStore.loading"
              class="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"
            ></span>
            <span>{{
              sliderStore.loading ? 'در حال ذخیره...' : isEditing ? 'ذخیره تغییرات' : 'ثبت اسلایدر'
            }}</span>
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { type HomeProductSlider, useHomeProductSlidersStore } from '@/stores/admin/homeProductSliders'
import { useNotificationStore } from '@/stores/notification'
import { useConfirmStore } from '@/stores/confirm'
import axiosInstance from '@/lib/axios' // اتصال به Store ها

// اتصال به Store ها
const sliderStore = useHomeProductSlidersStore()
const notify = useNotificationStore()
const confirmStore = useConfirmStore()

// وضعیت‌های مودال
const isModalOpen = ref(false)
const isEditing = ref(false)

// داده‌های فرم
const form = ref<{
  id: number | null | undefined
  title: string
  type: 'dynamic' | 'manual'
  query_type: string | null
  sort_order: number
  is_active: boolean
}>({
  id: null,
  title: '',
  type: 'dynamic',
  query_type: 'latest',
  sort_order: 0,
  is_active: true,
})

// ----- منطق جستجو و انتخاب محصول -----
const searchQuery = ref('')
const searchResults = ref<any[]>([])
const selectedProducts = ref<any[]>([])
const isSearching = ref(false)
const isSearchOpen = ref(false)
let searchTimeout: ReturnType<typeof setTimeout> | null = null

// هندلر جستجو با Debounce
const handleSearch = () => {
  const query = searchQuery.value.trim()

  if (query.length < 2) {
    searchResults.value = []
    isSearchOpen.value = false
    return
  }

  isSearchOpen.value = true
  isSearching.value = true

  if (searchTimeout) clearTimeout(searchTimeout)

  searchTimeout = setTimeout(async () => {
    try {
      const response = await axiosInstance.get('/admin/products/search', {
        params: { q: query },
      })
      searchResults.value = response.data.data || response.data
    } catch (error: any) {
      notify.error(error.response?.data?.message || 'خطا در جستجوی محصول')
      searchResults.value = []
    } finally {
      isSearching.value = false
    }
  }, 500)
}

const addProduct = (product: any) => {
  if (!selectedProducts.value.some((p) => p.id === product.id)) {
    selectedProducts.value.push(product)
  }
  searchQuery.value = ''
  searchResults.value = []
  isSearchOpen.value = false
}

const removeProduct = (id: number) => {
  selectedProducts.value = selectedProducts.value.filter((p) => p.id !== id)
}
// -------------------------------------

// دریافت داده‌ها هنگام لود کامپوننت
onMounted(async () => {
  try {
    await sliderStore.fetchSliders()
  } catch (error: any) {
    notify.error(error.response?.data?.message || 'خطا در دریافت لیست اسلایدرها.')
  }
})

const openModal = (slider?: HomeProductSlider) => {
  if (slider) {
    isEditing.value = true
    form.value = {
      id: slider.id,
      title: slider.title,
      type: slider.type,
      query_type: slider.query_type || 'latest',
      sort_order: slider.sort_order || 0,
      is_active: Boolean(slider.is_active),
    }
    selectedProducts.value = slider.products ? [...slider.products] : []
  } else {
    isEditing.value = false
    resetForm()
  }
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
  resetForm()
}

const resetForm = () => {
  form.value = {
    id: null,
    title: '',
    type: 'dynamic',
    query_type: 'latest',
    sort_order: 0,
    is_active: true,
  }
  selectedProducts.value = []
  searchQuery.value = ''
  searchResults.value = []
  isSearchOpen.value = false
}

const submitForm = async () => {
  if (!form.value.title.trim()) {
    notify.error('وارد کردن عنوان اسلایدر الزامی است.')
    return
  }

  const payload: HomeProductSlider = {
    title: form.value.title,
    type: form.value.type,
    query_type: form.value.type === 'dynamic' ? form.value.query_type : null,
    sort_order: form.value.sort_order,
    product_ids: form.value.type === 'manual' ? selectedProducts.value.map((p) => p.id) : [],
    is_active: form.value.is_active,
  }

  try {
    if (isEditing.value && form.value.id !== undefined && form.value.id !== null) {
      await sliderStore.updateSlider(form.value.id, payload)
      notify.success('اسلایدر با موفقیت ویرایش شد.')
    } else {
      await sliderStore.createSlider(payload)
      notify.success('اسلایدر جدید با موفقیت ایجاد شد.')
    }
    closeModal()
  } catch (error: any) {
    notify.error(error.response?.data?.message || 'خطا در ذخیره اطلاعات اسلایدر.')
  }
}

const deleteSlider = async (id?: number) => {
  if (!id) return

  const isConfirmed = await confirmStore.ask({
    title: 'حذف اسلایدر',
    message: 'آیا از حذف این اسلایدر اطمینان دارید؟ این عملیات غیرقابل بازگشت است.',
    type: 'danger',
    confirmText: 'بله، حذف کن',
    cancelText: 'انصراف',
  })

  if (!isConfirmed) return

  try {
    await sliderStore.deleteSlider(id)
    notify.success('اسلایدر با موفقیت حذف شد.')
  } catch (error: any) {
    notify.error(error.response?.data?.message || 'خطا در حذف اسلایدر.')
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
