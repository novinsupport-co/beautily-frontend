<template>
  <div
    class="h-[calc(100vh-2rem)] flex flex-col font-iransans overflow-hidden text-right"
    dir="rtl"
  >
    <!-- Header -->
    <div
      class="flex-shrink-0 flex flex-col md:flex-row md:items-center justify-between bg-white dark:bg-slate-800 p-6 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-700 gap-4 mb-6"
    >
      <div class="flex items-center gap-4">
        <div>
          <h2 class="text-2xl font-iransans-bold text-slate-800 dark:text-white">
            مدیریت تخصص و اعتماد
          </h2>
          <p class="text-slate-400 text-sm mt-1">مدیریت ترکیبات فعال و نشان‌های اعتماد محصولات</p>
        </div>

        <button
          v-if="isEdit"
          class="mr-4 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-100 transition-all flex items-center gap-2 text-sm font-iransans-bold shadow-sm"
          @click="resetForm()"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              d="M12 4v16m8-8H4"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
            />
          </svg>
          افزودن مورد جدید
        </button>
      </div>

      <!-- Tabs -->
      <div class="flex bg-slate-100 dark:bg-slate-900 p-1.5 rounded-2xl w-fit">
        <button
          v-for="tab in ['ingredients', 'trust_badges']"
          :key="tab"
          :class="
            activeTab === tab
              ? 'bg-white dark:bg-slate-700 shadow-sm text-indigo-600'
              : 'text-slate-500'
          "
          class="px-6 py-2 rounded-xl text-sm font-iransans-bold transition-all"
          @click="activeTab = tab"
        >
          {{ tab === 'ingredients' ? 'ترکیبات فعال' : 'نشان‌های اعتماد' }}
        </button>
      </div>
    </div>

    <!-- Main Content -->
    <div class="flex-1 grid lg:grid-cols-3 gap-8 min-h-0">
      <!-- List Section -->
      <div class="lg:col-span-2 overflow-y-auto pr-2 custom-scrollbar pb-10">
        <!-- Search -->
        <div class="mb-6 sticky top-0 z-10">
          <div class="relative">
            <input
              v-model="searchQuery"
              :placeholder="
                activeTab === 'ingredients' ? 'جستجوی ترکیب...' : 'جستجوی نشان اعتماد...'
              "
              class="w-full bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl py-4 pr-12 pl-4 text-sm focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm"
              type="text"
            />
            <svg
              class="w-6 h-6 text-slate-400 absolute right-4 top-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
              />
            </svg>
          </div>
        </div>

        <!-- Ingredients/Badges List -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div v-if="filteredItems.length === 0" class="empty-state col-span-2">
            موردی یافت نشد.
          </div>

          <div
            v-for="item in filteredItems"
            :key="item.id"
            :class="[
              form.id === item.id ? 'active-item' : 'border-slate-100 dark:border-slate-700',
              !item.is_active ? 'opacity-50 grayscale' : '',
            ]"
            class="list-card group"
            @click="editItem(item)"
          >
            <div class="flex items-center gap-4">
              <div
                :class="
                  activeTab === 'ingredients'
                    ? 'bg-blue-50 text-blue-500'
                    : 'bg-emerald-50 text-emerald-500'
                "
                class="icon-box"
              >
                <!-- نمایش داینامیک آیکون بر اساس نوع داده -->
                <span v-if="activeTab === 'ingredients'" class="text-xl">🧪</span>
                <template v-else-if="activeTab === 'trust_badges'">
                  <!-- اگر مقدار آیکون شامل فرمت تصویر یا مسیر بود (مدیریت تصاویر آپلودی) -->
                  <img
                    v-if="isImageUrl(item.icon)"
                    :src="getMediaUrl(item)"
                    class="w-full h-full object-contain p-1"
                  />
                  <!-- اگر مقدار آیکون کلاس فونت بود (مثلا fas fa-leaf) -->
                  <i v-else-if="item.icon" :class="item.icon" class="text-xl"></i>
                  <!-- حالت پیش فرض -->
                  <span v-else class="text-xl">🛡️</span>
                </template>
              </div>
              <div>
                <div class="flex items-center gap-2">
                  <h4 class="font-iransans-bold text-slate-700 dark:text-slate-200">
                    {{ item.name }}
                  </h4>
                  <span
                    v-if="!item.is_active"
                    class="px-2 py-0.5 text-[10px] bg-rose-100 text-rose-600 rounded-full font-bold"
                  >
                    غیرفعال
                  </span>
                </div>
                <!-- نمایش INCI Name برای ترکیبات -->
                <p
                  v-if="activeTab === 'ingredients' && item.inci_name"
                  class="text-xs text-indigo-500 mt-1"
                  dir="ltr"
                >
                  {{ item.inci_name }}
                </p>
                <p
                  v-if="item.description"
                  class="text-[10px] text-slate-400 mt-1 truncate max-w-[150px]"
                >
                  {{ item.description }}
                </p>
              </div>
            </div>

            <button class="delete-btn" @click.stop="deleteItem(item.id)">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Form Section -->
      <div class="lg:col-span-1 h-full">
        <div
          class="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-sm h-full overflow-y-auto custom-scrollbar"
        >
          <h3
            class="font-iransans-bold text-lg mb-6 text-slate-800 dark:text-white text-center flex items-center justify-center gap-2"
          >
            <span
              :class="isEdit ? 'bg-orange-500' : 'bg-green-500'"
              class="w-2 h-2 rounded-full animate-pulse"
            ></span>
            {{
              isEdit
                ? 'ویرایش: ' + form.name
                : 'افزودن ' + (activeTab === 'ingredients' ? 'ترکیب' : 'نشان') + ' جدید'
            }}
          </h3>

          <form class="space-y-5" @submit.prevent="handleSubmit">
            <!-- وضعیت فعال/غیرفعال -->
            <div
              class="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-700"
            >
              <label
                class="text-xs font-bold text-slate-600 dark:text-slate-300 cursor-pointer select-none"
                for="statusToggle"
              >
                وضعیت نمایش (فعال)
              </label>
              <div
                class="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in"
              >
                <input
                  id="statusToggle"
                  v-model="form.is_active"
                  class="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer"
                  type="checkbox"
                />
                <label
                  class="toggle-label block overflow-hidden h-5 rounded-full bg-slate-300 cursor-pointer"
                  for="statusToggle"
                ></label>
              </div>
            </div>

            <div class="space-y-1">
              <label class="text-xs font-bold text-slate-400 mr-2">نام</label>
              <input
                v-model="form.name"
                :placeholder="activeTab === 'ingredients' ? 'مثال: ویتامین C' : 'مثال: بدون پارابن'"
                class="input-fancy"
                required
              />
            </div>

            <!-- فیلد اختصاصی تب ترکیبات: INCI Name -->
            <div v-if="activeTab === 'ingredients'" class="space-y-1">
              <label class="text-xs font-bold text-slate-400 mr-2">نام علمی (INCI)</label>
              <input
                v-model="form.inci_name"
                class="input-fancy"
                dir="ltr"
                placeholder="مثال: Ascorbic Acid"
              />
            </div>

            <!-- فیلد اختصاصی تب نشان‌ها: Image Upload -->
            <div v-if="activeTab === 'trust_badges'" class="space-y-1">
              <label class="text-xs font-bold text-slate-400 mr-2">تصویر نشان (آیکون)</label>
              <div class="flex items-center gap-3">
                <div class="flex-1 relative">
                  <input
                    accept="image/*"
                    class="input-fancy file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-iransans-bold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                    type="file"
                    @change="handleFileUpload"
                  />
                </div>
                <div
                  v-if="form.icon_preview"
                  class="w-12 h-12 rounded-xl border border-slate-200 overflow-hidden flex-shrink-0 bg-slate-50 flex items-center justify-center p-1"
                >
                  <!-- پیش نمایش تصویر آپلودی یا آیکون فعلی -->
                  <img
                    v-if="isImageUrl(form.icon_preview)"
                    :src="form.icon_preview"
                    class="w-full h-full object-contain"
                  />
                  <i v-else :class="form.icon_preview" class="text-xl text-slate-500"></i>
                </div>
              </div>
              <p class="text-[10px] text-slate-400 mt-1 px-2">تصویر با فرمت PNG/JPG انتخاب کنید.</p>
            </div>

            <div class="space-y-1">
              <label class="text-xs font-bold text-slate-400 mr-2">توضیحات (اختیاری)</label>
              <textarea
                v-model="form.description"
                class="input-fancy"
                placeholder="توضیحات مختصر..."
                rows="4"
              ></textarea>
            </div>

            <div class="pt-4 space-y-3">
              <button
                :disabled="loading"
                class="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-2xl font-iransans-bold shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2"
                type="submit"
              >
                <span
                  v-if="loading"
                  class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"
                ></span>
                {{ isEdit ? 'بروزرسانی تغییرات' : 'ثبت در سیستم' }}
              </button>
              <button
                v-if="isEdit"
                class="w-full text-slate-400 text-sm py-2 hover:text-slate-600 transition-colors"
                type="button"
                @click="resetForm()"
              >
                انصراف
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import axios from '@/lib/axios'
import { useNotificationStore } from '@/stores/notification'

const activeTab = ref('ingredients')
const ingredients = ref([])
const trust_badges = ref([])
const isEdit = ref(false)
const loading = ref(false)
const searchQuery = ref('')
const notify = useNotificationStore()

// متغیرهای فرم - پشتیبانی از فایل و وضعیت
const form = ref({
  id: null,
  name: '',
  description: '',
  inci_name: '',
  icon_file: null,
  icon_preview: '',
  is_active: true,
})

// تشخیص اینکه آیا رشته یک مسیر تصویر است یا کلاس فونت
const isImageUrl = (str) => {
  if (!str) return false
  return str.startsWith('blob:') || str.startsWith('http') || str.includes('/') || str.includes('.')
}

// تابع کمکی برای گرفتن مسیر مدیا در صورت وجود سیستم Media Library لاراول
const getMediaUrl = (item) => {
  if (item.media && item.media.length > 0) {
    return item.media[0].original_url
  }
  return item.icon
}

const fetchData = async () => {
  try {
    const [ingRes, badgeRes] = await Promise.all([
      axios.get('/admin/ingredients'),
      axios.get('/admin/trust-badges'),
    ])
    ingredients.value = ingRes.data.data || ingRes.data
    trust_badges.value = badgeRes.data.data || badgeRes.data
  } catch (error) {
    notify.error('خطا در بارگذاری داده‌ها')
  }
}

const filteredItems = computed(() => {
  let result = activeTab.value === 'ingredients' ? ingredients.value : trust_badges.value

  if (searchQuery.value) {
    result = result.filter((item) =>
      item.name.toLowerCase().includes(searchQuery.value.toLowerCase()),
    )
  }
  return [...result].sort((a, b) => a.name.localeCompare(b.name, 'fa'))
})

// هندل کردن انتخاب فایل تصویر
const handleFileUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    form.value.icon_file = file
    form.value.icon_preview = URL.createObjectURL(file)
  }
}

const handleSubmit = async () => {
  loading.value = true
  try {
    // استفاده از FormData برای پشتیبانی از آپلود فایل
    const formData = new FormData()
    formData.append('name', form.value.name)
    // تبدیل بولین به عدد برای ارسال در فرم‌دیتا
    formData.append('is_active', form.value.is_active ? 1 : 0)

    if (form.value.description) {
      formData.append('description', form.value.description)
    }

    if (activeTab.value === 'ingredients') {
      if (form.value.inci_name) formData.append('inci_name', form.value.inci_name)
    } else {
      // فقط اگر فایل جدیدی انتخاب شده بود ارسالش میکنیم
      if (form.value.icon_file) {
        formData.append('icon', form.value.icon_file)
      }
    }

    let endpoint = `/admin/${activeTab.value.replace('_', '-')}`

    if (isEdit.value) {
      endpoint += `/${form.value.id}`
      // متد PUT در FormData در لاراول باید به این شکل ارسال شود
      formData.append('_method', 'PUT')
    }

    // ارسال به صورت POST (حتی برای آپدیت، چون FormData داریم)
    await axios.post(endpoint, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    notify.success('با موفقیت ذخیره شد')
    resetForm()
    fetchData()
  } catch (error) {
    notify.error(error.response?.data?.message || 'خطا در عملیات')
  } finally {
    loading.value = false
  }
}

const editItem = (item) => {
  isEdit.value = true
  // دقت کنید که is_active باید حتما بولین باشد
  form.value = {
    id: item.id,
    name: item.name,
    description: item.description || '',
    inci_name: item.inci_name || '',
    icon_file: null, // فایل در زمان ویرایش در ابتدا خالی است مگر اینکه آپلود جدیدی شود
    icon_preview: getMediaUrl(item) || '', // نمایش تصویر یا آیکون فعلی از سرور
    is_active: item.is_active !== undefined ? Boolean(item.is_active) : true,
  }
}

const deleteItem = async (id) => {
  if (!confirm('آیا از حذف این مورد اطمینان دارید؟')) return
  try {
    const endpoint = `/admin/${activeTab.value.replace('_', '-')}/${id}`
    await axios.delete(endpoint)
    notify.success('با موفقیت حذف شد')
    if (form.value.id === id) resetForm()
    fetchData()
  } catch (error) {
    notify.error('خطا در حذف')
  }
}

const resetForm = () => {
  form.value = {
    id: null,
    name: '',
    description: '',
    inci_name: '',
    icon_file: null,
    icon_preview: '',
    is_active: true,
  }
  isEdit.value = false
  searchQuery.value = ''

  // ریست کردن فیلد فایل در DOM
  const fileInput = document.querySelector('input[type="file"]')
  if (fileInput) fileInput.value = ''
}

watch(activeTab, () => resetForm())
onMounted(fetchData)
</script>

<style scoped>
.input-fancy {
  @apply w-full border border-slate-100 dark:border-slate-700 rounded-2xl px-4 py-3.5 focus:ring-2 focus:ring-indigo-500 outline-none transition-all bg-slate-50/50 dark:bg-slate-900 text-sm;
}
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  @apply bg-slate-200 rounded-full;
}

.empty-state {
  @apply text-center p-12 bg-white dark:bg-slate-800 rounded-[2rem] border-2 border-dashed border-slate-100 dark:border-slate-700 text-slate-400;
}

.list-card {
  @apply flex items-center justify-between bg-white dark:bg-slate-800 p-4 rounded-3xl border cursor-pointer transition-all;
}

.active-item {
  @apply border-indigo-500 ring-4 ring-indigo-500/10 shadow-lg bg-indigo-50/30;
}

.icon-box {
  @apply w-14 h-14 rounded-2xl overflow-hidden border flex items-center justify-center relative;
}

.delete-btn {
  @apply w-9 h-9 flex items-center justify-center text-rose-500 hover:bg-rose-50 rounded-xl transition-all opacity-0;
}

.group:hover .delete-btn {
  @apply opacity-100;
}

/* استایل‌های Toggle (سوییچ وضعیت) */
.toggle-checkbox:checked {
  @apply right-0 border-indigo-500;
  right: 0;
  border-color: #4f46e5;
}
.toggle-checkbox:checked + .toggle-label {
  @apply bg-indigo-500;
  background-color: #4f46e5;
}
.toggle-checkbox {
  right: 0;
  z-index: 1;
  border-color: #e2e8f0;
  transition: all 0.3s;
}
.toggle-label {
  transition: all 0.3s;
}
</style>
