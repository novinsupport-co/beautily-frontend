<template>
  <div class="min-h-screen bg-[#FDFBF9] py-8 font-vazir">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
      <!-- هدر صفحه و مسیرنما (Breadcrumb style) -->
      <div
        class="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-4 border-b border-[#E9DDD2] gap-4"
      >
        <div class="flex items-center">
          <span class="w-1.5 h-8 bg-[#F57A9B] rounded-full ml-3 inline-block shadow-sm"></span>
          <h1 class="text-xl md:text-2xl font-bold text-[#333333]">
            محصولات دسته <span class="text-[#F57A9B] mr-1">{{ slugTitle }}</span>
          </h1>
        </div>

        <div
          v-if="!loading && products?.length > 0"
          class="text-sm font-medium text-[#777777] bg-white px-4 py-2 rounded-xl border border-gray-100 shadow-sm"
        >
          نمایش <span class="text-[#333333] font-bold">{{ products.length }}</span> محصول
        </div>
      </div>

      <!-- وضعیت لودینگ (Skeleton Loading) -->
      <div
        v-if="loading"
        class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6"
      >
        <div
          v-for="i in 10"
          :key="i"
          class="bg-white border border-gray-100 rounded-2xl p-4 flex flex-col h-[350px] animate-pulse"
        >
          <div class="w-full aspect-square bg-gray-200 rounded-xl mb-4"></div>
          <div class="w-1/3 h-3 bg-gray-200 rounded mb-3"></div>
          <div class="w-3/4 h-4 bg-gray-200 rounded mb-4"></div>
          <div class="mt-auto border-t border-gray-50 pt-4 flex flex-col gap-3">
            <div class="w-1/2 h-4 bg-gray-200 rounded self-end"></div>
            <div class="w-full h-10 bg-gray-200 rounded-xl"></div>
          </div>
        </div>
      </div>

      <!-- وضعیت خالی بودن (محصولی یافت نشد) -->
      <div
        v-else-if="!products || products.length === 0"
        class="flex flex-col items-center justify-center py-24 bg-white border border-[#E9DDD2] rounded-3xl shadow-sm mx-auto max-w-3xl text-center"
      >
        <div class="w-24 h-24 bg-[#F5F5F7] rounded-full flex items-center justify-center mb-6">
          <svg
            class="w-10 h-10"
            fill="none"
            stroke="#777777"
            stroke-width="1.5"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M13.5 21v-7.5a2.25 2.25 0 012.25-2.25h1.5a2.25 2.25 0 012.25 2.25v7.5m-6.75-6h2.25m-9-2.25h15m-15 4.5h15m-15 4.5h15M4.5 19.5v-15A2.25 2.25 0 016.75 2.25h10.5A2.25 2.25 0 0119.5 4.5v15M8.25 21h7.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>
        <h3 class="text-xl font-bold text-[#333333] mb-3">محصولی در این دسته یافت نشد!</h3>
        <p class="text-[#777777] mb-8 max-w-md leading-relaxed">
          متاسفانه در حال حاضر هیچ محصولی برای دسته‌بندی
          <span class="font-bold text-[#333333]">{{ slugTitle }}</span> موجود نیست. لطفا بعدا مراجعه
          کنید یا دسته‌بندی‌های دیگر را بررسی نمایید.
        </p>
        <router-link
          class="bg-[#F57A9B] text-white px-8 py-3 rounded-xl font-medium hover:bg-[#df6786] transition-colors shadow-md hover:shadow-lg"
          to="/"
        >
          بازگشت به صفحه اصلی
        </router-link>
      </div>

      <!-- لیست محصولات -->
      <div
        v-else
        class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6"
      >
        <ProductCard v-for="product in products" :key="product.id" :product="product" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { useCategoriesStore } from '@/stores/categories'
import { computed, onMounted, watch } from 'vue'
import ProductCard from '@/components/products/ProductCard.vue'

const route = useRoute()
const store = useCategoriesStore()

// استخراج ایمن slug
const getSafeSlug = (slugParam) => {
  return Array.isArray(slugParam) ? slugParam[0] : slugParam
}

const loading = computed(() => store.loading)
const products = computed(() => store.categoryProducts)

// دکد کردن slug برای نمایش خواناتر در عنوان (مثلا تبدیل %20 به فاصله)
const slugTitle = computed(() => {
  const rawSlug = getSafeSlug(route.params.slug)
  return rawSlug ? decodeURIComponent(rawSlug.replace(/-/g, ' ')) : ''
})

const fetchProducts = (slug) => {
  if (slug) {
    store.fetchCategoryProducts(getSafeSlug(slug))
  }
}

onMounted(() => {
  fetchProducts(route.params.slug)
})

watch(
  () => route.params.slug,
  (newSlug) => {
    fetchProducts(newSlug)
  },
)
</script>
