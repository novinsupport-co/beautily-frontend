<template>
  <div
    class="products-page min-h-screen py-8"
    style="font-family: 'Vazirmatn', 'Vazir', sans-serif; background-color: #f5f5f7"
  >
    <div class="container mx-auto px-4 lg:px-8">
      <!-- عنوان صفحه و نوار جستجو -->
      <div
        class="flex flex-col md:flex-row justify-between items-center p-4 rounded-2xl shadow-sm mb-6"
        style="background-color: #ffffff"
      >
        <h1 class="text-2xl font-bold mb-4 md:mb-0" style="color: #333333">
          جستجوی پیشرفته محصولات
        </h1>
        <div class="relative w-full md:w-1/3">
          <input
            v-model="filters.q"
            class="w-full pl-4 pr-10 py-2 border rounded-xl outline-none transition-all text-sm"
            placeholder="نام محصول را جستجو کنید..."
            style="border-color: #eedac5; color: #333333"
            type="text"
            @blur="$event.target.style.borderColor = '#EEDAC5'"
            @focus="$event.target.style.borderColor = '#FC9FAF'"
            @input="debouncedFetch"
          />
          <svg
            class="w-5 h-5 absolute right-3 top-2.5"
            fill="none"
            stroke="currentColor"
            style="color: #777777"
            viewBox="0 0 24 24"
          >
            <path
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
            ></path>
          </svg>
        </div>
      </div>

      <div class="flex flex-col lg:flex-row gap-6">
        <!-- سایدبار فیلترها -->
        <aside
          class="w-full lg:w-1/4 p-6 rounded-2xl shadow-sm h-fit sticky top-4"
          style="background-color: #ffffff"
        >
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-lg font-bold" style="color: #333333">فیلترها</h2>
            <button
              class="text-sm transition-colors"
              onmouseout="this.style.color='#DFA9C7'"
              onmouseover="this.style.color='#FC9FAF'"
              style="color: #dfa9c7"
              @click="resetFilters"
            >
              حذف همه
            </button>
          </div>

          <!-- فیلتر موجودی کالا -->
          <div class="mb-6 pb-6 border-b" style="border-color: #f3f5f8">
            <label class="flex items-center cursor-pointer justify-between">
              <span class="text-sm font-medium" style="color: #333333">فقط کالاهای موجود</span>
              <div class="relative">
                <input
                  v-model="filters.in_stock"
                  class="sr-only"
                  type="checkbox"
                  @change="fetchProducts"
                />
                <div
                  :style="{ backgroundColor: filters.in_stock ? '#FC9FAF' : '#EEDAC5' }"
                  class="block w-10 h-6 rounded-full transition-colors"
                ></div>
                <div
                  :class="{ 'transform translate-x-4': filters.in_stock }"
                  class="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform"
                ></div>
              </div>
            </label>
          </div>

          <!-- فیلتر دسته‌بندی‌ها (داینامیک) -->
          <div class="mb-6 pb-6 border-b" style="border-color: #f3f5f8">
            <h3 class="text-sm font-bold mb-3" style="color: #333333">دسته‌بندی</h3>
            <div class="space-y-2 max-h-40 overflow-y-auto custom-scrollbar pr-1">
              <label
                v-for="cat in filterOptions.categories"
                :key="cat.slug"
                class="flex items-center cursor-pointer"
              >
                <input
                  v-model="filters.category"
                  :value="cat.slug"
                  class="rounded focus:ring-0 w-4 h-4 custom-checkbox"
                  type="checkbox"
                  @change="fetchProducts"
                />
                <span class="mr-2 text-sm" style="color: #777777">{{ cat.name }}</span>
              </label>
            </div>
          </div>

          <!-- فیلتر برندها (داینامیک) -->
          <div class="mb-6 pb-6 border-b" style="border-color: #f3f5f8">
            <h3 class="text-sm font-bold mb-3" style="color: #333333">برند سازنده</h3>
            <div class="space-y-2 max-h-40 overflow-y-auto custom-scrollbar pr-1">
              <label
                v-for="brand in filterOptions.brands"
                :key="brand.slug"
                class="flex items-center cursor-pointer"
              >
                <input
                  v-model="filters.brand"
                  :value="brand.slug"
                  class="rounded focus:ring-0 w-4 h-4 custom-checkbox"
                  type="checkbox"
                  @change="fetchProducts"
                />
                <span class="mr-2 text-sm" style="color: #777777">{{ brand.name }}</span>
              </label>
            </div>
          </div>

          <!-- فیلتر محدوده قیمت -->
          <div class="mb-2">
            <h3 class="text-sm font-bold mb-3" style="color: #333333">محدوده قیمت (تومان)</h3>
            <div class="flex items-center gap-2">
              <input
                v-model="filters.min_price"
                class="w-1/2 p-2 text-sm border rounded-lg text-center outline-none"
                placeholder="از"
                style="border-color: #eedac5; color: #333333"
                type="number"
                @blur="$event.target.style.borderColor = '#EEDAC5'"
                @change="debouncedFetch"
                @focus="$event.target.style.borderColor = '#FC9FAF'"
              />
              <span style="color: #777777">-</span>
              <input
                v-model="filters.max_price"
                class="w-1/2 p-2 text-sm border rounded-lg text-center outline-none"
                placeholder="تا"
                style="border-color: #eedac5; color: #333333"
                type="number"
                @blur="$event.target.style.borderColor = '#EEDAC5'"
                @change="debouncedFetch"
                @focus="$event.target.style.borderColor = '#FC9FAF'"
              />
            </div>
          </div>
        </aside>

        <!-- بخش نمایش محصولات و مرتب‌سازی -->
        <div class="w-full lg:w-3/4">
          <!-- نوار مرتب‌سازی -->
          <div
            class="p-4 rounded-2xl shadow-sm mb-6 flex flex-wrap items-center gap-4"
            style="background-color: #ffffff"
          >
            <span class="text-sm font-medium flex items-center gap-2" style="color: #333333">
              <svg
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                style="color: #777777"
                viewBox="0 0 24 24"
              >
                <path
                  d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                ></path>
              </svg>
              مرتب‌سازی:
            </span>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="option in sortOptions"
                :key="option.value"
                :class="['px-4 py-2 text-sm rounded-xl transition-all']"
                :style="{
                  backgroundColor: filters.sort === option.value ? '#FC9FAF' : '#F3F5F8',
                  color: filters.sort === option.value ? '#FFFFFF' : '#777777',
                  fontWeight: filters.sort === option.value ? 'bold' : 'normal',
                }"
                @click="setSort(option.value)"
              >
                {{ option.label }}
              </button>
            </div>
          </div>

          <!-- وضعیت لودینگ -->
          <div v-if="loading" class="flex justify-center items-center py-20">
            <div
              class="animate-spin rounded-full h-12 w-12 border-b-2"
              style="border-color: #fc9faf"
            ></div>
          </div>

          <!-- گرید محصولات -->
          <div
            v-else-if="products.length > 0"
            class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
          >
            <div
              v-for="product in products"
              :key="product.id"
              class="rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow relative group flex flex-col"
              style="background-color: #ffffff"
            >
              <!-- برچسب تخفیف (نمایش در صورت موجود بودن و داشتن تخفیف) -->
              <div
                v-if="hasStock(product) && !isCallForPrice(product) && getDiscount(product) > 0"
                class="absolute top-4 right-4 text-white text-xs font-bold px-2 py-1 rounded-lg z-10"
                style="background-color: #fc9faf"
              >
                %{{ getDiscount(product) }}
              </div>

              <!-- تصویر محصول -->
              <router-link
                :to="`/product/${product.slug}`"
                class="relative w-full h-48 mb-4 overflow-hidden rounded-xl flex items-center justify-center cursor-pointer"
                style="background-color: #f3f5f8"
              >
                <img
                  :alt="product.name"
                  :src="getProductImage(product)"
                  class="max-h-full object-contain group-hover:scale-105 transition-transform duration-300"
                />
              </router-link>

              <!-- دسته بندی و برند -->
              <div class="flex justify-between items-center text-xs mb-2" style="color: #777777">
                <span v-if="product.category">{{ product.category.name }}</span>
                <span
                  v-if="product.brand"
                  class="px-2 py-0.5 rounded"
                  style="background-color: #f3f5f8"
                  >{{ product.brand.name }}</span
                >
              </div>

              <!-- نام کالا -->
              <router-link
                :to="`/product/${product.slug}`"
                class="text-sm font-bold mb-2 line-clamp-2 cursor-pointer transition-colors"
                onmouseout="this.style.color='#333333'"
                onmouseover="this.style.color='#FC9FAF'"
                style="color: #333333"
              >
                {{ product.name }}
              </router-link>

              <!-- امتیاز -->
              <div class="flex items-center mb-auto">
                <svg class="w-4 h-4" fill="currentColor" style="color: #fc9faf" viewBox="0 0 20 20">
                  <path
                    d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                  />
                </svg>
                <span class="text-sm mr-1" style="color: #777777">{{
                  product.rating && Number(product.rating) > 0
                    ? Number(product.rating).toFixed(1)
                    : 'بدون امتیاز'
                }}</span>
              </div>

              <!-- بخش وضعیت موجودی و قیمت کالا -->
              <div
                class="mt-4 border-t pt-3 flex flex-col justify-end min-h-[60px]"
                style="border-color: #f3f5f8"
              >
                <!-- حالت تماس بگیرید -->
                <template v-if="isCallForPrice(product)">
                  <div class="text-center font-bold text-lg w-full" style="color: #333333">
                    تماس بگیرید
                  </div>
                </template>

                <!-- حالت ناموجود -->
                <template v-else-if="!hasStock(product)">
                  <div
                    class="text-center font-bold text-sm w-full py-1 rounded"
                    style="color: #777777; background-color: #f3f5f8"
                  >
                    ناموجود
                  </div>
                </template>

                <!-- حالت موجود و نمایش قیمت -->
                <template v-else>
                  <div class="flex justify-between items-end">
                    <!-- لیبل موجودی -->
                    <div
                      class="text-xs font-bold px-2 py-1 rounded"
                      style="background-color: #e6f4ea; color: #1e8e3e"
                    >
                      موجود
                    </div>

                    <!-- قیمت -->
                    <div class="flex flex-col items-end">
                      <div
                        v-if="getDiscount(product) > 0"
                        class="text-sm line-through mb-1"
                        style="color: #777777"
                      >
                        {{ formatPrice(getOldPrice(product)) }}
                      </div>
                      <div class="text-left font-bold text-lg" style="color: #333333">
                        {{ formatPrice(getFinalPrice(product)) }}
                        <span class="text-xs font-normal" style="color: #777777">تومان</span>
                      </div>
                    </div>
                  </div>
                </template>
              </div>

              <!-- دکمه مشاهده محصول -->
              <button
                class="w-full mt-4 text-sm font-bold py-2.5 rounded-xl transition-colors border"
                onmouseout="this.style.backgroundColor='#F3F5F8'; this.style.color='#DFA9C7'"
                onmouseover="this.style.backgroundColor='#FC9FAF'; this.style.color='#FFFFFF'"
                style="background-color: #f3f5f8; color: #dfa9c7; border-color: transparent"
                @click="goToDetail(product.slug)"
              >
                مشاهده محصول
              </button>
            </div>
          </div>

          <!-- حالت خالی (Empty State) -->
          <div
            v-else
            class="rounded-2xl p-16 text-center shadow-sm flex flex-col items-center"
            style="background-color: #ffffff"
          >
            <div
              class="w-24 h-24 rounded-full flex items-center justify-center mb-6"
              style="background-color: #f3f5f8"
            >
              <svg
                class="w-12 h-12"
                fill="none"
                stroke="currentColor"
                style="color: #eedac5"
                viewBox="0 0 24 24"
              >
                <path
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                ></path>
              </svg>
            </div>
            <h3 class="text-xl font-bold mb-2" style="color: #333333">محصولی یافت نشد!</h3>
            <p class="text-sm" style="color: #777777">
              با فیلترهای انتخاب شده هیچ محصولی پیدا نکردیم. لطفا فیلترها را تغییر دهید.
            </p>
            <button
              class="mt-6 px-6 py-2 rounded-xl text-sm font-bold transition-all text-white"
              onmouseout="this.style.backgroundColor='#FC9FAF'"
              onmouseover="this.style.backgroundColor='#DFA9C7'"
              style="background-color: #fc9faf"
              @click="resetFilters"
            >
              حذف فیلترها
            </button>
          </div>

          <!-- صفحه‌بندی (Pagination) -->
          <div v-if="meta && meta.last_page > 1" class="flex justify-center mt-8 gap-2">
            <button
              v-for="page in meta.last_page"
              :key="page"
              :style="{
                backgroundColor: filters.page === page ? '#FC9FAF' : '#FFFFFF',
                color: filters.page === page ? '#FFFFFF' : '#777777',
                borderColor: filters.page === page ? '#FC9FAF' : '#EEDAC5',
              }"
              class="w-10 h-10 rounded-xl text-sm font-bold transition-all flex items-center justify-center border"
              @click="changePage(page)"
            >
              {{ page }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getFiltersDataApi, getProductsApi } from '@/api/productApi'

const router = useRouter()
const route = useRoute()

const products = ref([])
const meta = ref(null)
const loading = ref(true)
let debounceTimer = null

// استیت مقادیر دریافتی از سرور برای فیلترها
const filterOptions = ref({
  categories: [],
  brands: [],
  tags: [],
})

// مقادیر فیلترهای انتخابی کاربر
const filters = reactive({
  q: route.query.q || '',
  category: route.query.category
    ? Array.isArray(route.query.category)
      ? route.query.category
      : [route.query.category]
    : [],
  brand: route.query.brand
    ? Array.isArray(route.query.brand)
      ? route.query.brand
      : [route.query.brand]
    : [],
  min_price: route.query.min_price || null,
  max_price: route.query.max_price || null,
  in_stock: route.query.in_stock === 'true',
  sort: route.query.sort || 'latest',
  page: Number(route.query.page) || 1,
})

const sortOptions = [
  { label: 'جدیدترین', value: 'latest' },
  { label: 'ارزان‌ترین', value: 'cheapest' },
  { label: 'گران‌ترین', value: 'expensive' },
  { label: 'محبوب‌ترین', value: 'popular' },
]

// تابع دریافت مقادیر فیلترها از API
const loadFilterData = async () => {
  try {
    const data = await getFiltersDataApi()
    filterOptions.value.categories = data.categories || []
    filterOptions.value.brands = data.brands || []
    filterOptions.value.tags = data.tags || []
  } catch (error) {
    console.error('خطا در دریافت اطلاعات فیلترها:', error)
  }
}

// ======================= توابع پردازش کارت محصول =======================

// چک کردن موجودی
const hasStock = (product) => {
  if (product.variants && product.variants.length > 0) {
    return product.variants.some((variant) => variant.stock > 0)
  }
  return product.stock?.quantity > 0
}

// محاسبه قیمت نهایی (کمترین قیمت واریانت‌های موجود، یا قیمت نهایی محصول ساده)
const getFinalPrice = (product) => {
  if (product.variants && product.variants.length > 0) {
    const availableVariants = product.variants.filter((v) => v.stock > 0)
    if (availableVariants.length > 0) {
      return Math.min(...availableVariants.map((v) => Number(v.price)))
    } else {
      return Math.min(...product.variants.map((v) => Number(v.price)))
    }
  }
  return Number(product.prices?.final || 0)
}

// بررسی برای نمایش "تماس بگیرید"
const isCallForPrice = (product) => {
  if (product.status?.call_for_price) return true
  if (getFinalPrice(product) === 0) return true
  return false
}

// دریافت قیمت قبل از تخفیف (ویژه محصولات ساده که قیمت اصلی‌شان از نهایی بیشتر است)
const getOldPrice = (product) => {
  if (!product.variants || product.variants.length === 0) {
    const base = Number(product.prices?.base || 0)
    const final = Number(product.prices?.final || 0)
    if (base > final) {
      return base
    }
  }
  return null
}

// محاسبه درصد تخفیف (ویژه محصولات ساده - واریانت‌ها طبق ساختار فعلی شما تخفیف ندارند)
const getDiscount = (product) => {
  if (!product.variants || product.variants.length === 0) {
    const base = Number(product.prices?.base || 0)
    const final = Number(product.prices?.final || 0)
    if (base > final && base > 0) {
      return Math.round(((base - final) / base) * 100)
    }
  }
  return 0
}

const formatPrice = (price) => {
  if (!price) return '0'
  return Number(price).toLocaleString('fa-IR')
}

// افزودن پشتیبانی از فیلد مستقیم product.image در کنار گالری
const getProductImage = (product) => {
  return (
    product.image ||
    product.images?.thumbnail?.urls?.medium ||
    product.thumbnail?.urls?.medium ||
    '/default-product.png'
  )
}
// =========================================================================================

const fetchProducts = async () => {
  loading.value = true
  try {
    await router.replace({ query: { ...filters } })
    const response = await getProductsApi(filters)
    products.value = response.data.data || response.data
    meta.value = response.data.meta || null
  } catch (error) {
    console.error('خطا در دریافت محصولات:', error)
  } finally {
    loading.value = false
  }
}

const debouncedFetch = () => {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    filters.page = 1
    fetchProducts()
  }, 500)
}

const setSort = (value) => {
  filters.sort = value
  filters.page = 1
  fetchProducts()
}

const changePage = (page) => {
  filters.page = page
  fetchProducts()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const resetFilters = () => {
  filters.q = ''
  filters.category = []
  filters.brand = []
  filters.min_price = null
  filters.max_price = null
  filters.in_stock = false
  filters.sort = 'latest'
  filters.page = 1
  fetchProducts()
}

const goToDetail = (slug) => {
  router.push({ name: 'public.product.detail', params: { slug } })
}

onMounted(() => {
  loadFilterData()
  fetchProducts()
})
</script>

<style scoped>
/* استایل‌های سفارشی برای اسکرول‌بار سایدبار */
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: #f5f5f7;
  border-radius: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #eedac5;
  border-radius: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #dfa9c7;
}

/* استایل سفارشی چک‌باکس‌ها با رنگ پالت */
.custom-checkbox {
  accent-color: #fc9faf;
  cursor: pointer;
}
</style>
