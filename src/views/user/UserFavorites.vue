<template>
  <div class="space-y-6 font-vazir">
    <!-- هدر صفحه -->
    <div>
      <h1 class="text-2xl font-bold text-[#333333] dark:text-white mb-2">لیست علاقه‌مندی‌ها</h1>
      <p class="text-sm text-[#777777] dark:text-gray-400">
        محصولاتی که دوست داشته‌اید را اینجا مدیریت کنید.
      </p>
    </div>

    <!-- حالت لودینگ -->
    <div v-if="loading" class="py-20 flex flex-col items-center justify-center text-center">
      <div
        class="w-12 h-12 border-4 border-[#EEDAC5] border-t-[#F57A9B] rounded-full animate-spin mb-4"
      ></div>
      <span class="text-[#777777] font-medium text-sm animate-pulse mt-4"
        >در حال بارگذاری علاقه‌مندی‌ها...</span
      >
    </div>

    <!-- لیست محصولات -->
    <div
      v-else-if="favorites.length > 0"
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
    >
      <!-- کارت محصول -->
      <div
        v-for="product in favorites"
        :key="product.id"
        class="group bg-[#FDFBF9] dark:bg-slate-800 rounded-2xl border border-[#E9DDD2] dark:border-slate-700 shadow-sm overflow-hidden hover:shadow-lg hover:shadow-[#F57A9B]/10 transition-all duration-300 relative"
      >
        <!-- دکمه حذف -->
        <button
          class="absolute top-3 left-3 z-10 bg-white/80 dark:bg-slate-800/80 hover:bg-red-50 dark:hover:bg-red-900/30 text-gray-400 hover:text-red-500 p-2 rounded-full backdrop-blur-sm transition-colors"
          title="حذف از علاقه‌مندی‌ها"
          @click="removeFavorite(product.id)"
        >
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path
              d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
            />
          </svg>
        </button>

        <!-- تصویر محصول -->
        <router-link
          :to="`/product/${product.slug}`"
          class="block relative aspect-square bg-[#F5F5F7] dark:bg-slate-700/50 p-4"
        >
          <img
            :alt="product.name"
            :src="getProductImage(product)"
            class="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal group-hover:scale-105 transition-transform duration-500"
          />

          <!-- لیبل ناموجود -->
          <div
            v-if="!isAvailable(product)"
            class="absolute inset-0 bg-white/50 dark:bg-slate-900/50 backdrop-blur-[2px] flex items-center justify-center"
          >
            <span class="bg-[#333333] text-white text-xs font-bold px-3 py-1.5 rounded-lg"
              >ناموجود</span
            >
          </div>
        </router-link>

        <!-- اطلاعات محصول -->
        <div class="p-4 flex flex-col gap-3">
          <router-link
            :to="`/product/${product.slug}`"
            class="font-medium text-[#333333] dark:text-gray-100 hover:text-[#F57A9B] dark:hover:text-[#DFA9C7] transition-colors line-clamp-2 min-h-[3rem]"
          >
            {{ product.name }}
          </router-link>

          <div class="flex items-end justify-between mt-auto pt-2">
            <div>
              <div
                v-if="isAvailable(product)"
                class="font-bold text-[#333333] dark:text-white text-lg"
              >
                {{ formatPrice(product.prices?.final) }}
                <span class="text-xs text-[#777777] dark:text-gray-400 font-normal">تومان</span>
              </div>
            </div>
          </div>

          <!-- دکمه افزودن به سبد / مشاهده -->
          <button
            v-if="isAvailable(product)"
            class="w-full py-2.5 mt-2 text-sm font-medium text-[#F57A9B] dark:text-[#DFA9C7] border border-[#DFA9C7] dark:border-[#F57A9B]/50 hover:bg-[#F57A9B]/10 dark:hover:bg-[#F57A9B]/20 rounded-xl transition-colors"
            @click="handleAddToCart(product)"
          >
            {{
              product.variants && product.variants.length > 0
                ? 'مشاهده و انتخاب گزینه‌ها'
                : 'افزودن به سبد خرید'
            }}
          </button>
        </div>
      </div>
    </div>

    <!-- حالت خالی -->
    <div
      v-else
      class="py-20 flex flex-col items-center justify-center text-center bg-[#FDFBF9] dark:bg-slate-800 rounded-2xl border border-dashed border-[#E9DDD2] dark:border-slate-700"
    >
      <div class="w-24 h-24 mb-6 text-[#DFA9C7] dark:text-slate-600">
        <svg fill="currentColor" viewBox="0 0 24 24">
          <path
            d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
          />
        </svg>
      </div>
      <h3 class="text-xl font-bold text-[#333333] dark:text-white mb-2">
        لیست علاقه‌مندی‌های شما خالی است!
      </h3>
      <p class="text-[#777777] dark:text-gray-400 max-w-md mx-auto">
        شما هنوز هیچ محصولی را به لیست علاقه‌مندی‌های خود اضافه نکرده‌اید.
      </p>
      <router-link
        class="mt-6 px-8 py-3 bg-[#F57A9B] hover:bg-[#DFA9C7] text-white rounded-xl font-medium transition-colors shadow-lg shadow-[#F57A9B]/20"
        to="/products"
      >
        مشاهده محصولات
      </router-link>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { useNotificationStore } from '@/stores/notification'
import type { ProductAPI } from '@/api/productApi'
import { getUserFavoritesApi, toggleFavoriteApi } from '@/api/productApi'

const favorites = ref<ProductAPI[]>([])
const loading = ref(true)

const cartStore = useCartStore()
const notify = useNotificationStore()
const router = useRouter()

const toPersianDigits = (n: number | string | undefined) =>
  n?.toString().replace(/\d/g, (x: string) => '۰۱۲۳۴۵۶۷۸۹'[parseInt(x)]) || '۰'

const formatPrice = (p: number | string | undefined | null) =>
  p ? Number(p).toLocaleString('fa-IR') : '۰'

const getProductImage = (product: ProductAPI) => {
  return (
    product.images?.thumbnail?.urls?.medium ||
    product.images?.thumbnail?.urls?.large ||
    product.images?.thumbnail?.url ||
    '/placeholder.png'
  )
}

const isAvailable = (product: ProductAPI) => {
  if (product.status && !product.status.is_active) return false

  if (product.variants && product.variants.length > 0) {
    return product.variants.some((v) => v.stock > 0)
  }

  return (product.stock?.quantity ?? 0) > 0
}

const fetchFavorites = async () => {
  loading.value = true
  try {
    const response = await getUserFavoritesApi()
    favorites.value = response.data?.data || response.data || []
  } catch (error) {
    console.error('خطا در دریافت لیست علاقه‌مندی‌ها:', error)
    notify.error('دریافت اطلاعات با خطا مواجه شد.')
  } finally {
    loading.value = false
  }
}

const removeFavorite = async (productId: number) => {
  try {
    await toggleFavoriteApi(productId)
    favorites.value = favorites.value.filter((fav) => fav.id !== productId)
    notify.success('محصول با موفقیت از علاقه‌مندی‌ها حذف شد.')
  } catch (error) {
    console.error('خطا در حذف علاقه‌مندی:', error)
    notify.error('خطا در ارتباط با سرور هنگام حذف محصول.')
  }
}

const handleAddToCart = async (product: ProductAPI) => {
  if (!isAvailable(product)) return

  if (product.variants && product.variants.length > 0) {
    router.push(`/product/${product.slug}`)
    notify.info(
      'برای افزودن به سبد خرید، لطفاً ابتدا ویژگی‌های محصول را در صفحه محصول انتخاب کنید.',
    )
    return
  }

  try {
    await cartStore.addItem(product.id, null, 1)
    notify.success('محصول با موفقیت به سبد خرید اضافه شد!')
  } catch (error: any) {
    console.error('خطا در افزودن به سبد خرید:', error)
    const errorMsg =
      error.response?.data?.message || 'مشکلی در افزودن محصول به سبد خرید به وجود آمد.'
    notify.error(errorMsg)
  }
}

onMounted(() => {
  fetchFavorites()
})
</script>
