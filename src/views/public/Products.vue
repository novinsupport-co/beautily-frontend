<template>
  <div
    class="products-page min-h-screen py-8"
    style="font-family: 'Vazirmatn', 'Vazir', sans-serif; background-color: #f5f5f7"
  >
    <div class="container mx-auto px-4 lg:px-8">
      <!-- هدر و جستجو -->
      <div
        class="flex flex-col md:flex-row justify-between items-center p-4 rounded-2xl shadow-sm mb-6 gap-4"
        style="background-color: #ffffff"
      >
        <h1 class="text-2xl font-bold" style="color: #333333">محصولات فروشگاه</h1>

        <div class="flex items-center gap-3 w-full md:w-auto">
          <!-- دکمه فیلتر در موبایل -->
          <button
            class="lg:hidden flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-colors"
            style="background-color: #f3f5f8; color: #333333"
            @click="isMobileFilterOpen = true"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
              ></path>
            </svg>
            فیلترها
          </button>

          <div class="relative w-full md:w-80">
            <input
              v-model="filters.q"
              class="w-full pl-4 pr-10 py-2.5 border rounded-xl outline-none transition-all text-sm"
              placeholder="جستجوی محصول..."
              style="border-color: #eedac5; color: #333333"
              type="text"
              @blur="$event.target.style.borderColor = '#EEDAC5'"
              @focus="$event.target.style.borderColor = '#FC9FAF'"
              @input="debouncedUpdateRoute"
            />
            <svg
              class="w-5 h-5 absolute right-3 top-3"
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
      </div>

      <div class="flex flex-col lg:flex-row gap-6 relative">
        <!-- بک‌گراند تیره برای منوی موبایل -->
        <div
          v-if="isMobileFilterOpen"
          class="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          @click="isMobileFilterOpen = false"
        ></div>

        <!-- سایدبار فیلترها -->
        <aside
          :class="isMobileFilterOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'"
          class="fixed top-0 right-0 h-full w-4/5 max-w-sm lg:static lg:w-1/4 lg:h-fit lg:sticky lg:top-4 z-50 lg:z-auto p-6 rounded-none lg:rounded-2xl shadow-xl lg:shadow-sm transition-transform duration-300 overflow-y-auto lg:overflow-visible"
          style="background-color: #ffffff"
        >
          <div
            class="flex justify-between items-center mb-6 lg:mb-6 pb-4 lg:pb-0 border-b lg:border-none"
          >
            <h2 class="text-lg font-bold" style="color: #333333">فیلترها</h2>

            <!-- دکمه بستن در موبایل -->
            <button
              class="lg:hidden p-2 rounded-lg bg-gray-100 text-gray-600"
              @click="isMobileFilterOpen = false"
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

            <button
              class="hidden lg:block text-sm transition-colors cursor-pointer"
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
                  @change="updateRoute"
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

          <!-- فیلتر دسته‌بندی‌ها -->
          <div class="mb-6 pb-6 border-b" style="border-color: #f3f5f8">
            <h3 class="text-sm font-bold mb-3" style="color: #333333">دسته‌بندی</h3>
            <div class="space-y-3 max-h-48 overflow-y-auto custom-scrollbar pr-1">
              <label
                v-for="cat in filterOptions.categories"
                :key="cat.slug"
                class="flex items-center cursor-pointer group"
              >
                <input
                  v-model="filters.category"
                  :value="cat.slug"
                  class="rounded focus:ring-0 w-4 h-4 custom-checkbox"
                  type="checkbox"
                  @change="updateRoute"
                />
                <span
                  class="mr-3 text-sm group-hover:text-black transition-colors"
                  style="color: #777777"
                  >{{ cat.name }}</span
                >
              </label>
            </div>
          </div>

          <!-- فیلتر برندها -->
          <div class="mb-6 pb-6 border-b" style="border-color: #f3f5f8">
            <h3 class="text-sm font-bold mb-3" style="color: #333333">برند سازنده</h3>
            <div class="space-y-3 max-h-48 overflow-y-auto custom-scrollbar pr-1">
              <label
                v-for="brand in filterOptions.brands"
                :key="brand.slug"
                class="flex items-center cursor-pointer group"
              >
                <input
                  v-model="filters.brand"
                  :value="brand.slug"
                  class="rounded focus:ring-0 w-4 h-4 custom-checkbox"
                  type="checkbox"
                  @change="updateRoute"
                />
                <span
                  class="mr-3 text-sm group-hover:text-black transition-colors"
                  style="color: #777777"
                  >{{ brand.name }}</span
                >
              </label>
            </div>
          </div>

          <!-- فیلتر محدوده قیمت -->
          <div class="mb-2 pb-6 lg:pb-0">
            <h3 class="text-sm font-bold mb-3" style="color: #333333">محدوده قیمت (تومان)</h3>
            <div class="flex items-center gap-2">
              <input
                v-model="filters.min_price"
                class="w-1/2 p-2.5 text-sm border rounded-xl text-center outline-none"
                placeholder="از"
                type="number"
                @change="debouncedUpdateRoute"
              />
              <span style="color: #777777">-</span>
              <input
                v-model="filters.max_price"
                class="w-1/2 p-2.5 text-sm border rounded-xl text-center outline-none"
                placeholder="تا"
                type="number"
                @change="debouncedUpdateRoute"
              />
            </div>
          </div>

          <!-- دکمه اعمال در موبایل -->
          <div class="mt-4 lg:hidden pb-10">
            <button
              class="w-full py-3 rounded-xl text-white font-bold"
              style="background-color: #fc9faf"
              @click="isMobileFilterOpen = false"
            >
              مشاهده محصولات
            </button>
            <button
              class="w-full mt-2 py-3 rounded-xl font-bold"
              style="color: #fc9faf; background-color: #fff0f3"
              @click="resetFilters"
            >
              حذف فیلترها
            </button>
          </div>
        </aside>

        <!-- بخش اصلی -->
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
            <div class="flex flex-wrap gap-2 overflow-x-auto pb-1 custom-scrollbar">
              <router-link
                v-for="option in sortOptions"
                :key="option.value"
                :style="{
                  backgroundColor: filters.sort === option.value ? '#FC9FAF' : '#F3F5F8',
                  color: filters.sort === option.value ? '#FFFFFF' : '#777777',
                }"
                :to="{ query: { ...$route.query, sort: option.value, page: 1 } }"
                class="px-4 py-2 text-sm rounded-xl transition-all whitespace-nowrap hover:bg-opacity-80"
              >
                {{ option.label }}
              </router-link>
            </div>
          </div>

          <!-- لودینگ -->
          <div v-if="loading" class="flex justify-center items-center py-32">
            <div
              class="animate-spin rounded-full h-12 w-12 border-b-2"
              style="border-color: #fc9faf"
            ></div>
          </div>

          <!-- گرید محصولات (مدرن) -->
          <div
            v-else-if="products.length > 0"
            class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
          >
            <div
              v-for="product in products"
              :key="product.id"
              class="group bg-white rounded-2xl p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl relative flex flex-col border border-transparent hover:border-pink-100"
            >
              <!-- برچسب تخفیف -->
              <div
                v-if="hasStock(product) && !isCallForPrice(product) && getDiscount(product) > 0"
                class="absolute top-4 right-4 text-white text-xs font-bold px-2.5 py-1.5 rounded-lg z-10 shadow-sm"
                style="background-color: #fc9faf"
              >
                %{{ getDiscount(product) }}
              </div>

              <!-- تصویر -->
              <router-link
                :to="{ name: 'public.product.detail', params: { slug: product.slug } }"
                class="relative w-full aspect-square mb-4 overflow-hidden rounded-xl bg-gray-50 flex items-center justify-center"
              >
                <img
                  :alt="product.image?.alt || product.name"
                  :src="getProductImage(product)"
                  class="max-h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                />
                <!-- لایه محو و دکمه شناور روی عکس -->
                <div
                  class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 flex items-center justify-center"
                >
                  <span
                    class="opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 bg-white/90 text-pink-500 text-sm font-bold py-2 px-4 rounded-full backdrop-blur-sm shadow-md"
                  >
                    مشاهده سریع
                  </span>
                </div>
              </router-link>

              <!-- اطلاعات متنی -->
              <div class="flex-grow flex flex-col">
                <div class="flex justify-between items-center text-xs mb-2 text-gray-500">
                  <span v-if="product.category">{{ product.category.name }}</span>
                  <span class="flex items-center gap-1 text-yellow-400">
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                      />
                    </svg>
                    <span class="text-gray-500 mt-0.5">{{
                      product.rating > 0 ? Number(product.rating).toFixed(1) : '-'
                    }}</span>
                  </span>
                </div>

                <router-link
                  :to="{ name: 'public.product.detail', params: { slug: product.slug } }"
                  class="text-[15px] font-bold mb-3 line-clamp-2 text-gray-800 group-hover:text-pink-400 transition-colors leading-relaxed"
                >
                  {{ product.name }}
                </router-link>

                <!-- قیمت و دکمه -->
                <div class="mt-auto pt-3 border-t border-gray-100 flex items-end justify-between">
                  <template v-if="isCallForPrice(product)">
                    <div
                      class="text-center font-bold text-gray-800 w-full py-2 bg-gray-50 rounded-xl"
                    >
                      تماس بگیرید
                    </div>
                  </template>
                  <template v-else-if="!hasStock(product)">
                    <div
                      class="text-center font-bold text-gray-500 w-full py-2 bg-gray-50 rounded-xl"
                    >
                      ناموجود
                    </div>
                  </template>
                  <template v-else>
                    <div class="flex flex-col">
                      <span
                        v-if="getDiscount(product) > 0"
                        class="text-xs text-gray-400 line-through mb-0.5"
                      >
                        {{ formatPrice(getOldPrice(product)) }}
                      </span>
                      <div class="font-bold text-lg text-gray-800">
                        {{ formatPrice(getFinalPrice(product)) }}
                        <span class="text-xs font-normal text-gray-500">تومان</span>
                      </div>
                    </div>

                    <!-- آیکون سبد خرید در هاور -->
                    <button
                      class="w-10 h-10 rounded-xl flex items-center justify-center transition-all bg-pink-50 text-pink-400 hover:bg-pink-400 hover:text-white"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                        ></path>
                      </svg>
                    </button>
                  </template>
                </div>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div
            v-else
            class="rounded-2xl p-16 text-center shadow-sm flex flex-col items-center bg-white"
          >
            <div class="w-24 h-24 rounded-full flex items-center justify-center mb-6 bg-gray-50">
              <svg
                class="w-12 h-12 text-pink-200"
                fill="none"
                stroke="currentColor"
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
            <h3 class="text-xl font-bold mb-2 text-gray-800">محصولی یافت نشد!</h3>
            <p class="text-sm text-gray-500 mb-6">با فیلترهای انتخاب شده هیچ محصولی پیدا نکردیم.</p>
            <button
              class="px-6 py-2.5 rounded-xl text-sm font-bold transition-all text-white bg-pink-400 hover:bg-pink-500 shadow-md shadow-pink-200"
              @click="resetFilters"
            >
              حذف فیلترها
            </button>
          </div>

          <!-- صفحه‌بندی -->
          <div v-if="meta && meta.last_page > 1" class="flex justify-center mt-10 gap-2 flex-wrap">
            <router-link
              v-for="page in meta.last_page"
              :key="page"
              :style="{
                backgroundColor: filters.page === page ? '#FC9FAF' : '#FFFFFF',
                color: filters.page === page ? '#FFFFFF' : '#777777',
                borderColor: filters.page === page ? '#FC9FAF' : '#EEDAC5',
              }"
              :to="{ query: { ...$route.query, page: page } }"
              class="w-10 h-10 rounded-xl text-sm font-bold transition-all flex items-center justify-center border hover:shadow-md"
            >
              {{ page }}
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getFiltersDataApi, getProductsApi } from '@/api/productApi'

const router = useRouter()
const route = useRoute()

const products = ref([])
const meta = ref(null)
const loading = ref(true)
const isMobileFilterOpen = ref(false)
let debounceTimer = null

const filterOptions = ref({
  categories: [],
  brands: [],
  tags: [],
})

const sortOptions = [
  { label: 'جدیدترین', value: 'latest' },
  { label: 'ارزان‌ترین', value: 'cheapest' },
  { label: 'گران‌ترین', value: 'expensive' },
  { label: 'محبوب‌ترین', value: 'popular' },
]

// State فیلترها (همگام با URL)
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

// اعمال تغییرات URL به عنوان تنها مرجع (رفع مشکل سئو و روتر)
watch(
  () => route.query,
  (newQuery) => {
    filters.q = newQuery.q || ''
    filters.category = newQuery.category
      ? Array.isArray(newQuery.category)
        ? newQuery.category
        : [newQuery.category]
      : []
    filters.brand = newQuery.brand
      ? Array.isArray(newQuery.brand)
        ? newQuery.brand
        : [newQuery.brand]
      : []
    filters.min_price = newQuery.min_price || null
    filters.max_price = newQuery.max_price || null
    filters.in_stock = newQuery.in_stock === 'true'
    filters.sort = newQuery.sort || 'latest'
    filters.page = Number(newQuery.page) || 1

    fetchProductsFromApi()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  },
  { deep: true },
)

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

// تابع بروزرسانی Route (برای چک‌باکس‌ها و اینپوت‌ها)
const updateRoute = () => {
  const query = { ...filters }
  if (query.page === 1) delete query.page // تمیز کردن URL
  router.push({ query })
}

const debouncedUpdateRoute = () => {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    filters.page = 1
    updateRoute()
  }, 500)
}

const resetFilters = () => {
  router.push({ query: {} }) // Watcher بصورت اتوماتیک دیتای جدید را می‌گیرد
  isMobileFilterOpen.value = false
}

// دریافت محصولات بدون دستکاری مجدد Router
const fetchProductsFromApi = async () => {
  loading.value = true
  try {
    const response = await getProductsApi(filters)
    products.value = response.data.data || response.data
    meta.value = response.data.meta || null
  } catch (error) {
    console.error('خطا در دریافت محصولات:', error)
  } finally {
    loading.value = false
  }
}

// توابع پردازش کارت محصول (مانند قبل)
const hasStock = (product) => {
  if (product.variants && product.variants.length > 0)
    return product.variants.some((v) => v.stock > 0)
  return product.stock?.quantity > 0
}
const getFinalPrice = (product) => {
  if (product.variants && product.variants.length > 0) {
    const available = product.variants.filter((v) => v.stock > 0)
    return available.length > 0
      ? Math.min(...available.map((v) => Number(v.price)))
      : Math.min(...product.variants.map((v) => Number(v.price)))
  }
  return Number(product.prices?.final || 0)
}
const isCallForPrice = (product) => product.status?.call_for_price || getFinalPrice(product) === 0
const getOldPrice = (product) => {
  if (!product.variants || product.variants.length === 0) {
    const base = Number(product.prices?.base || 0)
    const final = Number(product.prices?.final || 0)
    return base > final ? base : null
  }
  return null
}
const getDiscount = (product) => {
  if (!product.variants || product.variants.length === 0) {
    const base = Number(product.prices?.base || 0)
    const final = Number(product.prices?.final || 0)
    return base > final && base > 0 ? Math.round(((base - final) / base) * 100) : 0
  }
  return 0
}
const formatPrice = (price) => (price ? Number(price).toLocaleString('fa-IR') : '0')
const getProductImage = (product) =>
  product.image ||
  product.images?.thumbnail?.urls?.medium ||
  product.thumbnail?.urls?.medium ||
  '/default-product.png'

onMounted(() => {
  loadFilterData()
  fetchProductsFromApi()
})
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
  height: 4px;
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
.custom-checkbox {
  accent-color: #fc9faf;
  cursor: pointer;
}
</style>
