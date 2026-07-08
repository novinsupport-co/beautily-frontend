<template>
  <div
    class="h-[calc(100vh-2rem)] flex flex-col font-iransans overflow-hidden text-right"
    dir="rtl"
  >
    <div
      class="flex-shrink-0 flex flex-col md:flex-row md:items-center justify-between bg-white dark:bg-slate-800 p-6 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-700 gap-4 mb-6"
    >
      <div class="flex items-center gap-4">
        <div>
          <h2 class="text-2xl font-iransans-bold text-slate-800 dark:text-white">
            مدیریت طبقه‌بندی
          </h2>
          <p class="text-slate-400 text-sm mt-1">ساختار درختی دسته‌ها، برندها و برچسب‌ها</p>
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

      <div class="flex bg-slate-100 dark:bg-slate-900 p-1.5 rounded-2xl w-fit">
        <button
          v-for="tab in ['categories', 'brands', 'tags']"
          :key="tab"
          :class="
            activeTab === tab
              ? 'bg-white dark:bg-slate-700 shadow-sm text-indigo-600'
              : 'text-slate-500'
          "
          class="px-6 py-2 rounded-xl text-sm font-iransans-bold transition-all"
          @click="activeTab = tab"
        >
          {{ tab === 'categories' ? 'دسته‌بندی‌ها' : tab === 'brands' ? 'برندها' : 'تگ‌ها' }}
        </button>
      </div>
    </div>

    <div class="flex-1 grid lg:grid-cols-3 gap-8 min-h-0">
      <div class="lg:col-span-2 overflow-y-auto pr-2 custom-scrollbar pb-10">
        <div v-if="activeTab !== 'categories'" class="mb-6 sticky top-0 z-10">
          <div class="relative">
            <input
              v-model="searchQuery"
              :placeholder="activeTab === 'brands' ? 'جستجوی برند...' : 'جستجوی تگ (برچسب)...'"
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

        <div v-if="activeTab === 'categories'" class="space-y-4">
          <div v-if="categories.length === 0" class="empty-state">
            هنوز هیچ دسته‌بندی ایجاد نشده است.
          </div>
          <div v-for="cat in categories" :key="cat.id">
            <CategoryItem
              :category="cat"
              :selected-id="form.id"
              @delete="deleteItem"
              @edit="editItem"
              @select="editItem"
            />
          </div>
        </div>

        <div v-else-if="activeTab === 'brands'" class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div v-if="filteredBrands.length === 0" class="empty-state col-span-2">
            برندی با این نام یافت نشد.
          </div>
          <div
            v-for="brand in filteredBrands"
            :key="brand.id"
            :class="form.id === brand.id ? 'active-item' : 'border-slate-100 dark:border-slate-700'"
            class="list-card group"
            @click="editItem(brand)"
          >
            <div class="flex items-center gap-4">
              <div class="image-box">
                <img
                  v-if="brand.logo_url"
                  :src="brand.logo_url"
                  class="w-full h-full object-cover"
                />
                <svg
                  v-else
                  class="w-6 h-6 text-slate-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                  />
                </svg>
              </div>
              <div>
                <h4 class="font-iransans-bold text-slate-700 dark:text-slate-200">
                  {{ brand.name }}
                </h4>
                <p class="text-[10px] text-slate-400 font-mono">{{ brand.slug }}</p>
              </div>
            </div>
            <button class="delete-btn" @click.stop="deleteItem(brand.id)">
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

        <div
          v-else-if="activeTab === 'tags'"
          class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3"
        >
          <div v-if="filteredTags.length === 0" class="empty-state col-span-full">
            تگی با این عنوان یافت نشد.
          </div>
          <div
            v-for="tag in filteredTags"
            :key="tag.id"
            :class="
              form.id === tag.id
                ? 'bg-indigo-600 text-white shadow-indigo-200'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-100'
            "
            class="flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer group transition-all"
            @click="editItem(tag)"
          >
            <span class="text-xs font-iransans-bold truncate ml-2"># {{ tag.name }}</span>
            <button
              class="opacity-0 group-hover:opacity-100 transition-opacity hover:text-rose-500"
              @click.stop="deleteItem(tag.id)"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  d="M6 18L18 6M6 6l12 12"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

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
                : 'افزودن ' +
                  (activeTab === 'categories' ? 'دسته' : activeTab === 'brands' ? 'برند' : 'تگ') +
                  ' جدید'
            }}
          </h3>

          <form class="space-y-5" @submit.prevent="handleSubmit">
            <div class="space-y-1">
              <label class="text-xs font-bold text-slate-400 mr-2">نام عنوان</label>
              <input
                v-model="form.name"
                class="input-fancy"
                placeholder="عنوان مورد نظر..."
                required
              />
            </div>

            <div v-if="activeTab === 'categories'" class="space-y-1">
              <label class="text-xs font-bold text-slate-400 mr-2">انتخاب والد</label>
              <select v-model="form.parent_id" class="input-fancy">
                <option :value="null">دسته اصلی (ریشه)</option>
                <option v-for="opt in parentOptions" :key="opt.id" :value="opt.id">
                  {{ opt.label }}
                </option>
              </select>
            </div>

            <div v-if="activeTab === 'brands'" class="space-y-1">
              <label class="text-xs font-bold text-slate-400 mr-2">لوگو برند</label>
              <div class="flex items-center gap-4">
                <input
                  class="text-xs block w-full file:bg-indigo-50 file:text-indigo-600 file:border-none file:px-4 file:py-2 file:rounded-lg cursor-pointer"
                  type="file"
                  @change="handleFileUpload"
                />
                <div
                  v-if="logoPreview"
                  class="w-12 h-12 rounded-lg border overflow-hidden shrink-0"
                >
                  <img :src="logoPreview" class="w-full h-full object-cover" />
                </div>
              </div>
            </div>

            <div class="space-y-1">
              <label class="text-xs font-bold text-slate-400 mr-2">توضیحات (اختیاری)</label>
              <textarea v-model="form.description" class="input-fancy" rows="3"></textarea>
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
import CategoryItem from '@/views/admin/categories/CategoryItem.vue'
import { useNotificationStore } from '@/stores/notification'

const activeTab = ref('categories')
const categories = ref([])
const brands = ref([])
const tags = ref([])
const isEdit = ref(false)
const loading = ref(false)
const selectedFile = ref(null)
const logoPreview = ref(null)
const searchQuery = ref('')
const notify = useNotificationStore()

const form = ref({ id: null, name: '', parent_id: null, description: '' })

// دریافت داده‌ها از سرور
const fetchData = async () => {
  try {
    const [catRes, brandRes, tagRes] = await Promise.all([
      axios.get('/admin/categories'),
      axios.get('/admin/brands'),
      axios.get('/admin/tags'),
    ])
    categories.value = formatCategories(catRes.data.data)
    brands.value = brandRes.data.data
    tags.value = tagRes.data.data
  } catch (error) {
    notify.error('خطا در بارگذاری داده‌ها')
  }
}

// فیلتر و مرتب‌سازی آنی برندها (الفبایی)
const filteredBrands = computed(() => {
  let result = brands.value
  if (searchQuery.value) {
    result = result.filter((b) => b.name.toLowerCase().includes(searchQuery.value.toLowerCase()))
  }
  // مرتب‌سازی بر اساس نام (فارسی/انگلیسی)
  return [...result].sort((a, b) => a.name.localeCompare(b.name, 'fa'))
})

// فیلتر و مرتب‌سازی آنی تگ‌ها (الفبایی)
const filteredTags = computed(() => {
  let result = tags.value
  if (searchQuery.value) {
    result = result.filter((t) => t.name.toLowerCase().includes(searchQuery.value.toLowerCase()))
  }
  // مرتب‌سازی الفبایی تگ‌ها از الف تا ی
  return [...result].sort((a, b) => a.name.localeCompare(b.name, 'fa'))
})

const formatCategories = (items) => {
  if (!items) return []
  return items.map((item) => ({
    ...item,
    recursive_children: formatCategories(item.recursive_children || item.recursiveChildren || []),
  }))
}

const parentOptions = computed(() => {
  const options = []
  const traverse = (items, prefix = '') => {
    items.forEach((item) => {
      options.push({ id: item.id, label: prefix + item.name })
      if (item.recursive_children?.length)
        traverse(item.recursive_children, prefix + item.name + ' > ')
    })
  }
  traverse(categories.value)
  return options.filter((opt) => opt.id !== form.value.id)
})

const handleFileUpload = (e) => {
  const file = e.target.files[0]
  if (file) {
    selectedFile.value = file
    logoPreview.value = URL.createObjectURL(file)
  }
}

const handleSubmit = async () => {
  loading.value = true
  try {
    const fd = new FormData()
    fd.append('name', form.value.name)
    fd.append('description', form.value.description || '')

    if (activeTab.value === 'categories') {
      if (form.value.parent_id) fd.append('parent_id', form.value.parent_id)
    } else if (activeTab.value === 'brands') {
      if (selectedFile.value) fd.append('logo', selectedFile.value)
    }

    if (isEdit.value) fd.append('_method', 'PUT')

    const endpoint = `/admin/${activeTab.value}${isEdit.value ? `/${form.value.id}` : ''}`
    await axios.post(endpoint, fd)

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
  form.value = {
    id: item.id,
    name: item.name,
    parent_id: item.parent_id || null,
    description: item.description || '',
  }
  logoPreview.value = item.logo_url || null
}

const deleteItem = async (id) => {
  if (!confirm('آیا از حذف این مورد اطمینان دارید؟')) return
  try {
    await axios.delete(`/admin/${activeTab.value}/${id}`)
    notify.success('با موفقیت حذف شد')
    if (form.value.id === id) resetForm()
    fetchData()
  } catch (error) {
    notify.error('خطا در حذف')
  }
}

const resetForm = () => {
  form.value = { id: null, name: '', parent_id: null, description: '' }
  isEdit.value = false
  selectedFile.value = null
  logoPreview.value = null
  searchQuery.value = ''
  const fileInputs = document.querySelectorAll('input[type="file"]')
  fileInputs.forEach((i) => (i.value = ''))
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

/* اصلاح کلاس خطادار */
.list-card {
  @apply flex items-center justify-between bg-white dark:bg-slate-800 p-4 rounded-3xl border cursor-pointer transition-all;
}

.active-item {
  @apply border-indigo-500 ring-4 ring-indigo-500/10 shadow-lg bg-indigo-50/30;
}

.image-box {
  @apply w-14 h-14 rounded-2xl overflow-hidden bg-slate-50 border flex items-center justify-center relative;
}

.delete-btn {
  @apply w-9 h-9 flex items-center justify-center text-rose-500 hover:bg-rose-50 rounded-xl transition-all opacity-0;
}

/* برای اینکه وقتی روی کارت هاور شد، دکمه حذف ظاهر شود */
.group:hover .delete-btn {
  @apply opacity-100;
}
</style>
