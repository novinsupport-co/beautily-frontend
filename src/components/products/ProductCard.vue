<template>
  <div
    class="group relative flex flex-col bg-white border border-gray-100 rounded-2xl p-4 shadow-sm hover:shadow-xl transition-all duration-300"
  >
    <!-- نشان تخفیف (Badge) -->
    <div
      v-if="hasDiscount"
      class="absolute top-4 right-4 bg-[#F57A9B] text-white text-xs font-bold px-2.5 py-1 rounded-full z-10 shadow-sm"
    >
      {{ discountPercent }}٪
    </div>

    <!-- نشان ناموجود -->
    <div
      v-if="!isAvailable"
      class="absolute top-4 left-4 bg-gray-500 text-white text-xs font-bold px-2.5 py-1 rounded-full z-10 shadow-sm opacity-90"
    >
      ناموجود
    </div>

    <!-- تصویر محصول -->
    <!-- از روتر لینک استفاده شده تا کاربر با کلیک روی عکس به صفحه محصول برود -->
    <router-link
      :to="`/product/${product.slug}`"
      class="relative block w-full aspect-square rounded-xl overflow-hidden mb-4 bg-[#FDFBF9]"
    >
      <img
        v-if="imageUrl"
        :alt="product.images?.thumbnail?.alt || product.name"
        :src="imageUrl"
        class="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
      />
      <div v-else class="w-full h-full flex items-center justify-center text-[#777777]">
        بدون تصویر
      </div>
    </router-link>

    <!-- محتوای کارت -->
    <div class="flex flex-col flex-grow">
      <!-- برند و امتیاز -->
      <div class="flex justify-between items-center text-xs text-[#777777] mb-2">
        <span class="font-medium bg-[#F5F5F7] px-2 py-0.5 rounded">{{
          product.brand?.name || 'بدون برند'
        }}</span>
        <div v-if="product.rating" class="flex items-center gap-1 font-medium text-[#333333]">
          <svg
            class="h-4 w-4 text-amber-400"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
            />
          </svg>
          {{ product.rating }}
        </div>
      </div>

      <!-- نام محصول -->
      <router-link
        :to="`/product/${product.slug}`"
        class="text-sm md:text-base font-semibold text-[#333333] line-clamp-2 mb-4 hover:text-[#F57A9B] transition-colors leading-relaxed"
      >
        {{ product.name }}
      </router-link>

      <!-- بخش پایین: قیمت و دکمه (چسبیده به پایین کارت) -->
      <div class="mt-auto border-t border-[#F5F5F7] pt-4">
        <!-- قیمت‌ها -->
        <div class="flex items-end justify-between mb-4 min-h-[40px]">
          <div v-if="product.prices" class="flex flex-col w-full text-left">
            <!-- قیمت اصلی خط خورده (در صورت تخفیف) -->
            <span v-if="hasDiscount" class="text-xs text-[#777777] line-through mb-0.5">
              {{ formatPrice(product.prices.base) }}
            </span>
            <div class="flex justify-end items-center gap-1">
              <span
                :class="hasDiscount ? 'text-[#F57A9B]' : 'text-[#333333]'"
                class="text-lg font-bold"
              >
                {{ formatPrice(product.prices.final) }}
              </span>
              <span class="text-xs font-normal text-[#777777]">تومان</span>
            </div>
          </div>
        </div>

        <!-- دکمه افزودن به سبد -->
        <button
          :class="
            isAvailable
              ? 'bg-[#333333] text-white hover:bg-[#F57A9B] shadow-md hover:shadow-lg'
              : 'bg-[#EEDAC5] text-[#777777] cursor-not-allowed'
          "
          :disabled="!isAvailable"
          class="w-full py-2.5 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2"
          @click="addToCart"
        >
          <svg
            v-if="isAvailable"
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          {{ isAvailable ? 'افزودن به سبد خرید' : 'ناموجود' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useCartStore } from '@/stores/cart' // تعریف تایپ دقیق‌تر برای پراپس بر اساس دیتای شما

// تعریف تایپ دقیق‌تر برای پراپس بر اساس دیتای شما
const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
})

const cart = useCartStore()

// استخراج تصویر با اولویت‌بندی فرمت‌ها و سایزها
const imageUrl = computed(() => {
  const images = props.product?.images
  if (!images) return null

  // سعی می‌کنیم عکس medium یا وب‌پ را از thumbnail بگیریم
  if (images.thumbnail?.urls?.medium) return images.thumbnail.urls.medium
  if (images.thumbnail?.urls?.webp) return images.thumbnail.urls.webp
  if (images.thumbnail?.url) return images.thumbnail.url

  // در غیر این صورت عکس اول گالری
  if (images.gallery && images.gallery.length > 0) {
    return images.gallery[0].urls?.medium || images.gallery[0].url
  }

  return null
})

// بررسی موجودی محصول
const isAvailable = computed(() => {
  return props.product?.status?.state === 'available' && props.product?.status?.is_active
})

// بررسی وجود تخفیف
const hasDiscount = computed(() => {
  if (!props.product?.prices) return false
  return props.product.prices.base > props.product.prices.final
})

// محاسبه درصد تخفیف (چون در object اصلی prices درصد نداریم)
const discountPercent = computed(() => {
  if (!hasDiscount.value) return 0
  const base = props.product.prices.base
  const final = props.product.prices.final
  return Math.round(((base - final) / base) * 100)
})

// فرمت کننده قیمت (جداکننده هزارگان)
const formatPrice = (price: number | undefined) => {
  if (!price) return '۰'
  return new Intl.NumberFormat('fa-IR').format(price)
}

const addToCart = async () => {
  if (!props.product || !props.product.id || !isAvailable.value) return

  try {
    // از آنجا که محصول ممکن است دارای Variant باشد، فعلا null ارسال می‌شود.
    // در آینده می‌توانید در صورت وجود variant، کاربر را به صفحه محصول هدایت کنید تا رنگ/سایز را انتخاب کند.
    await cart.addItem(Number(props.product.id), null, 1)

    console.log(`محصول ${props.product.name} به سبد خرید اضافه شد`)
  } catch (error) {
    console.error('خطا در افزودن به سبد:', error)
  }
}
</script>
