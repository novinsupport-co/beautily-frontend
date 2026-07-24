<template>
  <main class="min-h-screen bg-[#f8fafc] dark:bg-slate-950 p-4 md:p-8 font-iransans">
    <div
      class="max-w-7xl mx-auto bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden"
    >
      <header class="p-8 border-b border-slate-50 dark:border-slate-800 bg-slate-50/30">
        <div class="flex flex-col md:flex-row justify-between items-center gap-6">
          <div class="flex items-center gap-4">
            <div class="bg-emerald-500 text-white p-4 rounded-3xl shadow-lg">
              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  d="M12 4v16m8-8H4"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                />
              </svg>
            </div>
            <div>
              <h1 class="text-2xl font-iransans-bold text-slate-800 dark:text-white">
                ثبت محصول جدید
              </h1>
              <p class="text-slate-400 text-sm mt-1">
                افزودن کالا به همراه مشخصات فنی و گالری تصاویر
              </p>
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

      <form class="p-8 lg:p-12" @submit.prevent="submitCreate">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div class="lg:col-span-2">
            <KeepAlive>
              <component
                :is="currentTabComponent"
                :allCategories="categories"
                :brands="brands"
                :form="form"
                :ingredients="ingredients"
                :trustBadges="trustBadges"
                @update-catalog="handleCatalogFileUpdate"
              />
            </KeepAlive>
          </div>
          <aside class="space-y-6">
            <LivePreview :form="form" />
            <div class="pt-6">
              <button
                :disabled="isSaving"
                class="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-5 rounded-[2rem] font-iransans-bold text-xl shadow-xl shadow-emerald-100 transition-all transform active:scale-95 disabled:opacity-50"
                type="submit"
              >
                {{ isSaving ? 'در حال ثبت محصول...' : 'انتشار محصول جدید' }}
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
import { useRouter } from 'vue-router'
import axios from '@/lib/axios'
import { useNotificationStore } from '@/stores/notification'

import TabBasicInfo from './tabs/TabBasicInfo.vue'
import TabTechnicalSpecs from './tabs/TabTechnicalSpecs.vue'
import TabVariants from './tabs/TabVariants.vue'
import TabRelated from './tabs/TabRelated.vue'
import LivePreview from './components/LivePreview.vue'
import TabSeo from './tabs/TabSeo.vue'
import TabExpertise from './tabs/TabExpertise.vue'
// متغیرهای جدید برای دریافت از بک‌اند
const ingredients = ref<any[]>([])
const trustBadges = ref<any[]>([])
const router = useRouter()
const notify = useNotificationStore()

const isSaving = ref(false)
const activeTab = ref('basic')
const categories = ref<any[]>([])
const brands = ref<any[]>([]) // لیست برندها برای لود از بانک
const rawCatalogFile = ref<File | null>(null)

const form = reactive({
  name: '',
  slug: '',
  sku: '',
  base_price: 0,
  discount_price: 0,
  stock_quantity: 0,
  unit: 'عدد',
  status: 'available',
  is_active: true,
  call_for_price: false,
  short_description: '',
  long_description: '',
  brand_id: null as number | null,
  category_ids: [] as number[],
  tag_names: [] as string[],
  specifications: [] as any[],
  variants: [] as any[],
  related_ids: [] as number[],
  related_products: [] as any[],
  seo: {
    title: '',
    description: '',
    canonical_url: '',
    robots: 'index, follow',
  },
  new_thumbnail: null as File | null,
  preview_url: '',
  new_gallery_files: [] as File[],
  images: { thumbnail: null, gallery: [] }, // برای جلوگیری از خطای رندر در صفحه Create
  catalog_url: '',
  thumbnail_alt: '', // اضافه شود
  gallery_alts: [] as string[], // اضافه شود
  expert_review: '',
  how_to_use: '',
  ingredient_ids: [] as number[],
  trust_badge_ids: [] as number[],
})

const tabs = [
  { id: 'basic', label: 'اطلاعات اصلی', component: TabBasicInfo },
  { id: 'expertise', label: 'نقد و بررسی', component: TabExpertise },
  { id: 'specs', label: 'مشخصات فنی', component: TabTechnicalSpecs },
  { id: 'variants', label: 'متغیرها', component: TabVariants },
  { id: 'related', label: 'مرتبط‌ها', component: TabRelated },
  { id: 'seo', label: 'سئو', component: TabSeo },
]

const currentTabComponent = computed(() => {
  return tabs.find((t) => t.id === activeTab.value)?.component
})

const handleCatalogFileUpdate = (file: File | null) => {
  rawCatalogFile.value = file
}

// اسلاگ‌ساز خودکار
watch(
  () => form.name,
  (newName) => {
    if (newName) {
      form.slug = newName
        .toLowerCase()
        .trim()
        .replace(/[^\u0600-\u06FFa-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
    } else {
      form.slug = ''
    }
  },
)

// نمایش زنده تصویر انتخابی
watch(
  () => form.new_thumbnail,
  (file) => {
    if (file instanceof File) {
      form.preview_url = URL.createObjectURL(file)
    }
  },
)

// دریافت دسته‌ها و برندها از بانک اطلاعاتی
const fetchInitialData = async () => {
  try {
    const [catRes, brandRes, ingRes, badgeRes] = await Promise.all([
      axios.get('/admin/categories'),
      axios.get('/admin/brands'),
      axios.get('/admin/ingredients'), // API جدید
      axios.get('/admin/trust-badges'), // API جدید
    ])
    categories.value = catRes.data.data
    brands.value = brandRes.data.data
    ingredients.value = ingRes.data.data
    trustBadges.value = badgeRes.data.data
  } catch (error) {
    notify.error('خطا در دریافت اطلاعات اولیه')
  }
}

const submitCreate = async () => {
  isSaving.value = true
  try {
    const fd = new FormData()

    fd.append('name', form.name)
    fd.append('slug', form.slug || '')
    fd.append('sku', form.sku || '')
    fd.append('base_price', String(form.base_price))
    fd.append('discount_price', String(form.discount_price || 0))
    fd.append('stock_quantity', String(form.stock_quantity))
    fd.append('unit', form.unit)
    fd.append('status', form.status)
    fd.append('is_active', form.is_active ? '1' : '0')
    fd.append('call_for_price', form.call_for_price ? '1' : '0')
    fd.append('short_description', form.short_description || '')
    fd.append('long_description', form.long_description || '')
    fd.append('expert_review', form.expert_review || '')
    fd.append('how_to_use', form.how_to_use || '')

    if (form.brand_id) {
      fd.append('brand_id', String(form.brand_id))
    }

    if (form.category_ids.length > 0) {
      fd.append('primary_category_id', String(form.category_ids[0]))
    }

    // ارسال آرایه‌ها به صورت JSON String
    fd.append('ingredients', JSON.stringify(form.ingredient_ids))
    fd.append('trust_badges', JSON.stringify(form.trust_badge_ids))
    fd.append('category_ids', JSON.stringify(form.category_ids))
    fd.append('tag_names', JSON.stringify(form.tag_names))
    fd.append('specifications', JSON.stringify(form.specifications))
    fd.append('variants', JSON.stringify(form.variants))
    fd.append('related_ids', JSON.stringify(form.related_ids || []))

    fd.append('meta[title]', form.seo.title || '')
    fd.append('meta[description]', form.seo.description || '')
    fd.append('meta[canonical_url]', form.seo.canonical_url || '')
    fd.append('meta[robots]', form.seo.robots || 'index, follow')

    if (rawCatalogFile.value instanceof File) {
      fd.append('catalog_file', rawCatalogFile.value)
    }

    if (form.new_thumbnail instanceof File) {
      fd.append('thumbnail', form.new_thumbnail)
      fd.append('thumbnail_alt', form.thumbnail_alt || form.name)
    }

    if (form.new_gallery_files.length > 0) {
      form.new_gallery_files.forEach((file, index) => {
        fd.append('gallery[]', file)
        fd.append(`gallery_alts[${index}]`, form.gallery_alts[index] || form.name)
      })
    }

    await axios.post('/admin/products', fd)

    notify.success('محصول جدید با موفقیت در سیستم ثبت شد')
    router.push('/admin/products')
  } catch (e: any) {
    if (e.response && e.response.status === 422) {
      const errors = e.response.data.errors
      const firstErrorKey = Object.keys(errors)[0]
      notify.error(`خطا: ${errors[firstErrorKey][0]}`)
    } else {
      notify.error('خطا در ثبت محصول. لطفاً دوباره تلاش کنید.')
    }
  } finally {
    isSaving.value = false
  }
}

onMounted(fetchInitialData)
</script>
