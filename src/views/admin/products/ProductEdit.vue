<template>
  <main class="min-h-screen bg-[#f8fafc] dark:bg-slate-950 p-4 md:p-8 font-iransans">
    <div
      class="max-w-7xl mx-auto bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden"
    >
      <header class="p-8 border-b border-slate-50 dark:border-slate-800 bg-slate-50/30">
        <div class="flex flex-col md:flex-row justify-between items-center gap-6">
          <div class="flex items-center gap-4">
            <div class="bg-pink-500 text-white p-4 rounded-3xl shadow-lg">
              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                />
              </svg>
            </div>
            <div>
              <h1 class="text-2xl font-iransans-bold text-slate-800 dark:text-white">
                ویرایش محصول
              </h1>
              <p class="text-slate-400 text-sm mt-1">مدیریت مشخصات فنی، قیمت و فایل‌های پیوستی</p>
            </div>
          </div>
          <nav
            class="flex bg-white dark:bg-slate-800 p-2 rounded-[2rem] border border-slate-100 dark:border-slate-700"
          >
            <button
              v-for="tab in tabs"
              :key="tab.id"
              :class="
                activeTab === tab.id
                  ? 'bg-slate-900 text-white shadow-lg'
                  : 'text-slate-500 hover:bg-slate-50'
              "
              class="px-6 py-3 rounded-2xl text-sm font-iransans-bold transition-all duration-300"
              @click="activeTab = tab.id as any"
            >
              {{ tab.label }}
            </button>
          </nav>
        </div>
      </header>

      <form class="p-8 lg:p-12" @submit.prevent="submitAllData">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div class="lg:col-span-2">
            <KeepAlive>
              <component
                :is="currentTabComponent"
                :allCategories="categories"
                :brands="brands"
                :form="form"
                @update-catalog="handleCatalogFileUpdate"
              />
            </KeepAlive>
          </div>
          <aside class="space-y-6">
            <LivePreview :form="form" />
            <div class="pt-6">
              <button
                :disabled="isSaving"
                class="w-full bg-pink-600 hover:bg-pink-700 text-white py-5 rounded-[2rem] font-iransans-bold text-xl shadow-xl shadow-pink-100 transition-all transform active:scale-95 disabled:opacity-50"
                type="submit"
              >
                {{ isSaving ? 'در حال ذخیره تغییرات...' : 'به‌روزرسانی نهایی' }}
              </button>
              <button
                class="w-full mt-4 text-slate-400 hover:text-slate-600 text-sm font-iransans transition-colors"
                type="button"
                @click="router.back()"
              >
                انصراف و بازگشت
              </button>
            </div>
          </aside>
        </div>
      </form>
    </div>
  </main>
</template>

<script lang="ts" setup>
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from '@/lib/axios'
import { useNotificationStore } from '@/stores/notification'

import TabBasicInfo from './tabs/TabBasicInfo.vue'
import TabTechnicalSpecs from './tabs/TabTechnicalSpecs.vue'
import TabVariants from './tabs/TabVariants.vue'
import TabRelated from './tabs/TabRelated.vue'
import LivePreview from './components/LivePreview.vue'

const route = useRoute()
const router = useRouter()
const notify = useNotificationStore()
const productId = route.params.id as string

const isSaving = ref(false)
const activeTab = ref<'basic' | 'specs' | 'variants' | 'related'>('basic')
const categories = ref<any[]>([])
const brands = ref<any[]>([]) // لیست برندها
const rawCatalogFile = ref<File | null>(null)

const form = reactive({
  id: productId,
  name: '',
  sku: '',
  base_price: 0,
  discount_price: 0,
  stock_quantity: 0,
  unit: 'عدد',
  status: 'available',
  is_active: true,
  call_for_price: false,
  brand_id: null as number | null,
  category_ids: [] as number[],
  tag_names: [] as string[],
  images: { thumbnail: null as any, gallery: [] as any[] },
  specifications: [] as any[],
  variants: [] as any[],
  related_ids: [] as number[],
  related_products: [] as any[],
  seo: { title: '', description: '' },
  new_thumbnail: null as File | null,
  preview_url: '',
  new_gallery_files: [] as File[],
  remove_thumbnail_flag: false,
  slug: '',
  short_description: '',
  long_description: '',
  catalog_url: '',
})

const tabs = [
  { id: 'basic', label: 'اطلاعات اصلی', component: TabBasicInfo },
  { id: 'specs', label: 'مشخصات فنی', component: TabTechnicalSpecs },
  { id: 'variants', label: 'متغیرها', component: TabVariants },
  { id: 'related', label: 'مرتبط‌ها', component: TabRelated },
]

const currentTabComponent = computed(() => tabs.find((t) => t.id === activeTab.value)?.component)

const handleCatalogFileUpdate = (file: File | null) => {
  rawCatalogFile.value = file
}

watch(
  () => form.name,
  (newName, oldName) => {
    if (oldName && newName && oldName !== newName) {
      form.slug = newName
        .toLowerCase()
        .trim()
        .replace(/[^\u0600-\u06FFa-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
    }
  },
)

watch(
  () => form.new_thumbnail,
  (file) => {
    if (file instanceof File) form.preview_url = URL.createObjectURL(file)
  },
)

const fetchInitialData = async () => {
  try {
    const [prodRes, catRes, brandRes] = await Promise.all([
      axios.get(`/admin/products/${productId}`),
      axios.get('/admin/categories'),
      axios.get('/admin/brands'),
    ])

    const p = prodRes.data.data
    categories.value = catRes.data.data
    brands.value = brandRes.data.data

    Object.assign(form, {
      name: p.name || '',
      sku: p.sku || '',
      base_price: p.prices?.base || 0,
      discount_price: p.prices?.discount || 0,
      stock_quantity: p.stock?.quantity || 0,
      unit: p.stock?.unit || 'عدد',
      status: p.status?.state || 'available',
      is_active: Boolean(p.status?.is_active),
      call_for_price: Boolean(p.status?.call_for_price),
      category_ids: p.categories?.map((c: any) => c.id) || [],
      tag_names: p.tags?.map((t: any) => t.name) || [],
      images: {
        thumbnail: p.images?.thumbnail || null,
        gallery: p.images?.gallery || [],
      },
      variants: p.variants || [],
      brand_id: p.brand ? Number(p.brand.id) : p.brand_id ? Number(p.brand_id) : null,
      specifications: p.specifications || [],
      related_products: p.related_products || [],
      related_ids: p.related_products?.map((rp: any) => rp.id) || [],
      short_description: p.short_description || '',
      long_description: p.long_description || '',
      slug: p.slug || '',
      catalog_url: p.catalog_url || '',
      seo: {
        title: p.meta?.title || '',
        description: p.meta?.description || '',
      },
    })
  } catch (error) {
    notify.error('خطا در بارگذاری اطلاعات محصول')
  }
}

const submitAllData = async () => {
  isSaving.value = true
  try {
    const fd = new FormData()
    fd.append('_method', 'PUT')
    fd.append('name', form.name)
    fd.append('sku', form.sku || '')
    fd.append('base_price', String(form.base_price))
    fd.append('discount_price', String(form.discount_price))
    fd.append('stock_quantity', String(form.stock_quantity))
    fd.append('unit', form.unit)
    fd.append('status', form.status)
    fd.append('is_active', form.is_active ? '1' : '0')
    fd.append('call_for_price', form.call_for_price ? '1' : '0')
    fd.append('slug', form.slug)
    fd.append('short_description', form.short_description || '')
    fd.append('long_description', form.long_description || '')
    fd.append('brand_id', form.brand_id ? String(form.brand_id) : '')
    fd.append('specifications', JSON.stringify(form.specifications))
    fd.append('variants', JSON.stringify(form.variants))
    fd.append('meta[title]', form.seo.title || '')
    fd.append('meta[description]', form.seo.description || '')

    if (form.category_ids.length > 0) {
      form.category_ids.forEach((id, i) => fd.append(`category_ids[${i}]`, String(id)))
    } else {
      // ارسال یک آرایه خالی برای اینکه بک‌ند بفهمد همه حذف شده‌اند
      fd.append('category_ids', '')
    }
    if (form.tag_names.length > 0) {
      form.tag_names.forEach((tag, i) => fd.append(`tag_names[${i}]`, tag))
    } else {
      // ارسال مقدار خالی برای حذف تگ‌ها در سمت سرور
      fd.append('tag_names', '')
    }

    const existingGalleryIds = form.images.gallery.map((img: any) => img.id)
    existingGalleryIds.forEach((id, i) => fd.append(`existing_gallery_ids[${i}]`, String(id)))

    if (rawCatalogFile.value instanceof File) fd.append('catalog_file', rawCatalogFile.value)
    if (form.new_thumbnail instanceof File) fd.append('thumbnail', form.new_thumbnail)
    if (form.new_gallery_files.length > 0) {
      form.new_gallery_files.forEach((file) => fd.append('gallery[]', file))
    }
    fd.append('related_ids', JSON.stringify(form.related_ids || []))

    await axios.post(`/admin/products/${productId}`, fd)
    notify.success('تغییرات محصول با موفقیت ذخیره شد')
    router.push('/admin/products')
  } catch (e: any) {
    notify.error('خطا در ثبت تغییرات')
  } finally {
    isSaving.value = false
  }
}

onMounted(fetchInitialData)
</script>
