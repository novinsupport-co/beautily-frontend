<template>
  <div
    class="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 bg-[#FDFBF9] min-h-screen"
    dir="rtl"
    style="font-family: 'Vazirmatn', 'Vazir', sans-serif"
  >
    <!-- هدر صفحه -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-6">
      <div class="flex items-center gap-4">
        <div
          class="w-14 h-14 bg-[#F57A9B]/10 border border-[#F57A9B]/20 rounded-2xl flex items-center justify-center shadow-sm"
        >
          <svg class="w-7 h-7 text-[#F57A9B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
            />
          </svg>
        </div>
        <div>
          <h1 class="text-2xl md:text-3xl font-extrabold text-[#333333] tracking-tight">
            مقایسه محصولات
          </h1>
          <p class="text-sm md:text-base text-[#777777] mt-1.5">
            بررسی دقیق مشخصات فنی برای خریدی هوشمندانه‌تر
          </p>
        </div>
      </div>

      <button
        v-if="items.length > 0"
        class="group flex items-center gap-2 px-5 py-2.5 text-[#777777] hover:text-red-500 bg-white hover:bg-red-50 border border-gray-200 hover:border-red-200 rounded-xl font-bold transition-all duration-300 shadow-sm"
        @click="compareStore.clearCompare()"
      >
        <svg
          class="w-5 h-5 transition-transform group-hover:rotate-12"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
          />
        </svg>
        پاکسازی لیست
      </button>
    </div>

    <!-- حالت خالی (Empty State) -->
    <div
      v-if="items.length === 0"
      class="flex flex-col items-center justify-center py-24 bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-[#EEDAC5]/30"
    >
      <div class="w-32 h-32 mb-6 relative">
        <div class="absolute inset-0 bg-[#DFA9C7]/20 rounded-full animate-ping opacity-50"></div>
        <div
          class="relative w-full h-full bg-[#F5F5F7] border border-[#EEDAC5] rounded-full flex items-center justify-center shadow-inner"
        >
          <svg
            class="w-14 h-14 text-[#BC846C]/60"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
            />
          </svg>
        </div>
      </div>
      <h3 class="text-2xl font-bold text-[#333333] mb-3">لیست مقایسه خالی است!</h3>
      <p class="text-[#777777] mb-8 text-center max-w-md leading-relaxed">
        محصولات زیبایی مورد نظر خود را از فروشگاه انتخاب کنید تا تفاوت‌ها را در یک نگاه ببینید.
      </p>
      <router-link
        class="px-8 py-3.5 bg-[#F57A9B] hover:bg-[#DFA9C7] text-white font-bold rounded-2xl shadow-lg shadow-[#F57A9B]/30 transform hover:-translate-y-1 transition-all duration-300"
        to="/products"
      >
        بازگشت به فروشگاه
      </router-link>
    </div>

    <!-- جدول مقایسه -->
    <div
      v-else
      class="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-[#EEDAC5]/30 overflow-hidden relative"
    >
      <div class="overflow-x-auto custom-scrollbar relative z-10">
        <table class="w-full text-right border-collapse table-fixed min-w-[800px]">
          <!-- هدر جدول (محصولات) -->
          <thead>
            <tr>
              <!-- ستون ثابت عناوین -->
              <th
                class="sticky-top-right p-6 bg-[#FDFBF9] border-b border-l border-[#EEDAC5]/30 w-[180px] md:w-[220px] align-top shadow-[4px_0_12px_rgba(0,0,0,0.03)] z-30"
              >
                <div class="text-[#333333] font-black text-lg md:text-xl mb-2">مشخصات</div>
                <div class="text-xs md:text-sm text-[#777777] font-normal leading-relaxed">
                  تفاوت‌ها را بررسی کنید
                </div>
              </th>

              <!-- ستون محصولات -->
              <th
                v-for="product in items"
                :key="product.id"
                class="sticky-top p-4 md:p-6 border-b border-l last:border-l-0 border-[#EEDAC5]/30 min-w-[260px] md:w-[320px] align-top bg-white group"
              >
                <div
                  class="relative bg-[#F5F5F7] rounded-2xl p-4 transition-all duration-300 hover:shadow-md border border-transparent hover:border-[#F57A9B]/20"
                >
                  <!-- دکمه حذف -->
                  <button
                    class="absolute top-2 left-2 z-10 w-8 h-8 flex items-center justify-center text-[#777777] bg-white border border-gray-200 hover:border-red-400 hover:text-red-500 rounded-lg shadow-sm transition-all duration-300 opacity-0 group-hover:opacity-100"
                    title="حذف از لیست"
                    @click="compareStore.removeItem(product.id)"
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

                  <router-link
                    :to="`/product/${product.slug}`"
                    class="block mb-4 overflow-hidden rounded-xl bg-white"
                  >
                    <img
                      :alt="product.name"
                      :src="getProductImage(product)"
                      class="w-full h-40 md:h-48 object-contain p-2 mix-blend-multiply transform group-hover:scale-105 transition-transform duration-500"
                    />
                  </router-link>

                  <h3
                    class="text-sm md:text-base font-bold text-[#333333] mb-4 line-clamp-2 leading-relaxed min-h-[3rem]"
                  >
                    <router-link
                      :to="`/product/${product.slug}`"
                      class="hover:text-[#F57A9B] transition-colors"
                    >
                      {{ product.name }}
                    </router-link>
                  </h3>

                  <div class="pt-4 border-t border-gray-200 h-[80px] flex flex-col justify-end">
                    <div v-if="isCallForPrice(product)" class="text-[#333333] font-black text-lg">
                      تماس بگیرید
                    </div>
                    <div
                      v-else-if="getFinalPrice(product)"
                      class="flex flex-col gap-1 w-full text-left"
                    >
                      <div class="flex items-center justify-end gap-2 h-6">
                        <span
                          v-if="getDiscount(product) > 0"
                          class="text-xs text-[#777777] line-through"
                        >
                          {{ formatPrice(getBasePrice(product)) }}
                        </span>
                        <span
                          v-if="getDiscount(product) > 0"
                          class="px-2 py-0.5 bg-[#F57A9B] text-white text-[10px] font-bold rounded-lg"
                        >
                          {{ getDiscount(product) }}٪
                        </span>
                      </div>
                      <div
                        class="text-[#333333] font-black text-xl flex items-center justify-end gap-1"
                      >
                        {{ formatPrice(getFinalPrice(product)) }}
                        <span class="text-[10px] font-normal text-[#777777]">تومان</span>
                      </div>
                    </div>
                  </div>
                </div>
              </th>
            </tr>
          </thead>

          <tbody class="divide-y divide-[#EEDAC5]/30">
            <!-- ردیف امتیاز -->
            <tr class="hover:bg-[#FDFBF9] transition-colors">
              <td
                class="sticky-right p-4 md:p-5 bg-white text-[#333333] font-bold border-l border-[#EEDAC5]/30 text-xs md:text-sm shadow-[4px_0_12px_rgba(0,0,0,0.02)] z-20"
              >
                امتیاز کاربران
              </td>
              <td
                v-for="product in items"
                :key="`rating-${product.id}`"
                class="p-4 md:p-5 border-l border-[#EEDAC5]/30"
              >
                <div class="flex items-center gap-2">
                  <div class="flex items-center gap-1 bg-[#E9DDD2]/40 px-2.5 py-1 rounded-lg">
                    <svg class="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                      />
                    </svg>
                    <span class="text-amber-700 font-bold text-sm">{{
                      product.rating || '۰'
                    }}</span>
                  </div>
                </div>
              </td>
            </tr>

            <!-- ردیف برند -->
            <tr class="hover:bg-[#FDFBF9] transition-colors">
              <td
                class="sticky-right p-4 md:p-5 bg-white text-[#333333] font-bold border-l border-[#EEDAC5]/30 text-xs md:text-sm shadow-[4px_0_12px_rgba(0,0,0,0.02)] z-20"
              >
                برند
              </td>
              <td
                v-for="product in items"
                :key="`brand-${product.id}`"
                class="p-4 md:p-5 border-l border-[#EEDAC5]/30"
              >
                <span
                  v-if="product.brand"
                  class="inline-flex px-3 py-1.5 bg-gray-50 text-[#333333] border border-gray-100 rounded-lg text-sm font-medium"
                >
                  {{ product.brand.name }}
                </span>
                <span v-else class="text-[#777777] text-sm">نامشخص</span>
              </td>
            </tr>

            <!-- ردیف موجودی -->
            <tr class="hover:bg-[#FDFBF9] transition-colors">
              <td
                class="sticky-right p-4 md:p-5 bg-white text-[#333333] font-bold border-l border-[#EEDAC5]/30 text-xs md:text-sm shadow-[4px_0_12px_rgba(0,0,0,0.02)] z-20"
              >
                وضعیت
              </td>
              <td
                v-for="product in items"
                :key="`stock-${product.id}`"
                class="p-4 md:p-5 border-l border-[#EEDAC5]/30"
              >
                <div
                  v-if="hasStock(product)"
                  class="inline-flex items-center gap-2 px-3 py-1.5 bg-[#EEDAC5]/20 text-[#BC846C] rounded-lg font-bold text-xs md:text-sm"
                >
                  موجود در فروشگاه
                </div>
                <div
                  v-else
                  class="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 text-[#777777] rounded-lg font-bold text-xs md:text-sm"
                >
                  ناموجود
                </div>
              </td>
            </tr>

            <!-- جداکننده مشخصات فنی -->
            <tr>
              <td
                :colspan="items.length + 1"
                class="bg-[#F5F5F7] border-y border-[#EEDAC5]/30 py-3 md:py-4 px-5 text-[#333333] font-black text-sm md:text-base"
              >
                ویژگی‌های تخصصی
              </td>
            </tr>

            <!-- مشخصات پویا -->
            <tr
              v-for="(specKey, index) in allSpecificationKeys"
              :key="specKey"
              class="hover:bg-[#FDFBF9] transition-colors group"
            >
              <td
                class="sticky-right p-4 md:p-5 bg-white text-[#333333] font-bold border-l border-[#EEDAC5]/30 text-xs md:text-sm shadow-[4px_0_12px_rgba(0,0,0,0.02)] z-20"
              >
                {{ specKey }}
              </td>
              <td
                v-for="product in items"
                :key="`spec-${product.id}-${index}`"
                class="p-4 md:p-5 border-l border-[#EEDAC5]/30 text-[#333333] text-sm leading-relaxed"
              >
                <div v-if="getSpecValue(product, specKey)" class="flex items-start gap-2">
                  <span
                    class="w-1.5 h-1.5 rounded-full bg-[#F57A9B] mt-1.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  ></span>
                  <span>{{ getSpecValue(product, specKey) }}</span>
                </div>
                <div v-else class="text-[#DFA9C7] text-lg pr-4">-</div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useCompareStore } from '@/stores/compareStore'

const compareStore = useCompareStore()
const items = computed(() => compareStore.items)

// مدیریت دریافت تصویر
const getProductImage = (product: any) => {
  return (
    product.images?.thumbnail?.urls?.medium ||
    product.images?.thumbnail?.urls?.large ||
    product.images?.thumbnail?.url ||
    product.thumbnail ||
    '/placeholder.png' // تصویر پیش‌فرض
  )
}

// فرمت‌دهی پول
const formatPrice = (price: number) => {
  return new Intl.NumberFormat('fa-IR').format(price)
}

// بررسی موجودی کالا (پشتیبانی از محصولات متغیر و ساده)
const hasStock = (product: any) => {
  if (product.variants && product.variants.length > 0) {
    return product.variants.some((v: any) => v.stock > 0)
  }
  return (product.stock?.quantity || 0) > 0
}

// دریافت قیمت نهایی (محاسبه هوشمند برای محصولات دارای واریانت)
const getFinalPrice = (product: any) => {
  if (product.prices?.final) return product.prices.final

  if (product.variants && product.variants.length > 0) {
    const availableVariants = product.variants.filter((v: any) => v.stock > 0)
    if (availableVariants.length > 0) {
      return Math.min(...availableVariants.map((v: any) => v.price?.final || v.price || 0))
    }
  }
  return 0
}

// دریافت قیمت پایه/اصلی خط‌خورده
const getBasePrice = (product: any) => {
  if (product.prices?.base) return product.prices.base

  if (product.variants && product.variants.length > 0) {
    const availableVariants = product.variants.filter((v: any) => v.stock > 0)
    if (availableVariants.length > 0) {
      const minFinal = Math.min(
        ...availableVariants.map((v: any) => v.price?.final || v.price || 0),
      )
      // پیدا کردن واریانتی که ارزان‌ترین قیمت نهایی را دارد و برگرداندن قیمت پایه آن
      const cheapestVariant = availableVariants.find(
        (v: any) => (v.price?.final || v.price || 0) === minFinal,
      )
      return cheapestVariant?.price?.base || cheapestVariant?.price || minFinal
    }
  }
  return 0
}

// محاسبه درصد تخفیف به صورت هوشمند
const getDiscount = (product: any) => {
  if (product.prices?.discount_percent) return product.prices.discount_percent

  const base = getBasePrice(product)
  const final = getFinalPrice(product)

  if (base > final && final > 0) {
    return Math.round(((base - final) / base) * 100)
  }
  return 0
}

// بررسی حالت تماس بگیرید
const isCallForPrice = (product: any) => {
  return product.call_for_price || getFinalPrice(product) === 0
}

// استخراج داینامیک تمام مشخصات فنی موجود بین کالاهای مقایسه شده
const allSpecificationKeys = computed(() => {
  const keys = new Set<string>()
  items.value.forEach((product: any) => {
    if (product.specifications && Array.isArray(product.specifications)) {
      product.specifications.forEach((spec: any) => {
        if (spec.key) keys.add(spec.key)
      })
    }
  })
  return Array.from(keys)
})

// دریافت مقدار ویژگی خاص برای کالا (جهت قرارگیری در ردیف مربوطه)
const getSpecValue = (product: any, key: string) => {
  if (!product.specifications || !Array.isArray(product.specifications)) return null
  const spec = product.specifications.find((s: any) => s.key === key)
  return spec ? spec.value : null
}
</script>

<style scoped>
/* اسکرول‌بار اختصاصی هماهنگ با برند بیوتیلی */
.custom-scrollbar::-webkit-scrollbar {
  height: 8px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: #f5f5f7;
  border-radius: 8px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #eedac5;
  border-radius: 8px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #dfa9c7;
}

/* مدیریت Z-Index و ستون‌های چسبان در موبایل و دسکتاپ */
.sticky-top {
  position: sticky;
  top: 0;
  z-index: 10;
}
.sticky-right {
  position: sticky;
  right: 0;
  z-index: 20;
}
.sticky-top-right {
  position: sticky;
  top: 0;
  right: 0;
  z-index: 30; /* اولویت بالا برای تلاقی سطر و ستون ثابت */
}
</style>
