<template>
  <div
    class="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12"
    dir="rtl"
    style="font-family: 'Vazirmatn', 'Vazir', sans-serif"
  >
    <!-- هدر صفحه -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-6">
      <div class="flex items-center gap-4">
        <div
          class="w-14 h-14 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl flex items-center justify-center shadow-sm"
        >
          <svg
            class="w-7 h-7 text-gray-700 dark:text-gray-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
            />
          </svg>
        </div>
        <div>
          <h1
            class="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight"
          >
            مقایسه کالاها
          </h1>
          <p class="text-sm md:text-base text-gray-500 dark:text-gray-400 mt-1.5">
            بررسی و مقایسه دقیق مشخصات فنی و قیمت محصولات
          </p>
        </div>
      </div>

      <button
        v-if="items.length > 0"
        class="group flex items-center gap-2 px-5 py-2.5 text-gray-600 hover:text-red-600 bg-white hover:bg-red-50 border border-gray-200 hover:border-red-200 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-red-500/10 dark:text-gray-300 rounded-xl font-bold transition-all duration-300 shadow-sm"
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
        حذف همه لیست
      </button>
    </div>

    <!-- حالت خالی (Empty State) -->
    <div
      v-if="items.length === 0"
      class="flex flex-col items-center justify-center py-24 bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-gray-200 dark:border-gray-800"
    >
      <div class="w-32 h-32 mb-6 relative">
        <div
          class="absolute inset-0 bg-gray-100 dark:bg-gray-800 rounded-full animate-ping opacity-50"
        ></div>
        <div
          class="relative w-full h-full bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-full flex items-center justify-center shadow-inner"
        >
          <svg
            class="w-14 h-14 text-gray-300 dark:text-gray-600"
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
      <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-3">لیست مقایسه خالی است!</h3>
      <p class="text-gray-500 dark:text-gray-400 mb-8 text-center max-w-md leading-relaxed">
        برای بررسی تفاوت‌ها و امکانات، محصولات مورد نظر خود را از فروشگاه به لیست مقایسه اضافه کنید.
      </p>
      <router-link
        class="px-8 py-3.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-2xl shadow-lg shadow-red-600/20 transform hover:-translate-y-0.5 transition-all duration-300"
        to="/products"
      >
        مشاهده فروشگاه
      </router-link>
    </div>

    <!-- جدول مقایسه -->
    <div
      v-else
      class="bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden relative"
    >
      <!-- کانتینر اسکرول افقی برای موبایل -->
      <div class="overflow-x-auto custom-scrollbar relative z-10">
        <table class="w-full text-right border-collapse min-w-[900px] table-fixed">
          <!-- هدر جدول (چسبان به بالا) -->
          <thead class="bg-white dark:bg-gray-900">
            <tr>
              <!-- ستون عناوین (چسبان به راست و بالا) -->
              <th
                class="sticky-top-right p-6 bg-gray-50 dark:bg-gray-800/80 border-b border-l border-gray-200 dark:border-gray-700 w-[220px] align-top shadow-[2px_0_5px_rgba(0,0,0,0.02)]"
              >
                <div class="text-gray-900 dark:text-white font-black text-xl mb-2">مشخصات</div>
                <div class="text-sm text-gray-500 dark:text-gray-400 font-normal leading-relaxed">
                  تفاوت‌ها را با دقت بررسی کنید
                </div>
              </th>

              <!-- ستون محصولات -->
              <th
                v-for="product in items"
                :key="product.id"
                class="sticky-top p-5 border-b border-l last:border-l-0 border-gray-200 dark:border-gray-700 w-[300px] align-top bg-white dark:bg-gray-900 group"
              >
                <!-- دکمه حذف محصول -->
                <button
                  class="absolute top-4 left-4 z-10 w-9 h-9 flex items-center justify-center text-gray-400 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-xl shadow-sm transition-all duration-300"
                  title="حذف از لیست"
                  @click="compareStore.removeItem(product.id)"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      d="M6 18L18 6M6 6l12 12"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                    />
                  </svg>
                </button>

                <!-- تصویر -->
                <router-link
                  :to="`/product/${product.slug}`"
                  class="block mb-4 relative bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl overflow-hidden group-hover:border-gray-300 dark:group-hover:border-gray-600 transition-colors duration-300"
                >
                  <img
                    :alt="product.name"
                    :src="getProductImage(product)"
                    class="w-full h-52 object-contain p-4 transform group-hover:scale-105 transition-transform duration-500"
                  />
                </router-link>

                <!-- نام محصول -->
                <h3
                  class="text-base font-bold text-gray-900 dark:text-white mb-4 line-clamp-2 leading-relaxed min-h-[3rem]"
                >
                  <router-link
                    :to="`/product/${product.slug}`"
                    class="hover:text-red-600 dark:hover:text-red-400 transition-colors"
                  >
                    {{ product.name }}
                  </router-link>
                </h3>

                <!-- بخش قیمت گذاری کامل -->
                <div
                  class="pt-4 border-t border-gray-100 dark:border-gray-800 h-[88px] flex flex-col justify-end"
                >
                  <div
                    v-if="isCallForPrice(product)"
                    class="text-gray-900 dark:text-white font-black text-xl text-left w-full"
                  >
                    تماس بگیرید
                  </div>
                  <div
                    v-else-if="getFinalPrice(product)"
                    class="flex flex-col gap-1 w-full text-left"
                  >
                    <!-- قیمت اصلی و درصد تخفیف -->
                    <div class="flex items-center justify-end gap-2 h-6">
                      <span
                        v-if="getDiscount(product) > 0"
                        class="text-sm text-gray-400 dark:text-gray-500 line-through"
                      >
                        {{ formatPrice(getBasePrice(product)) }}
                      </span>
                      <span
                        v-if="getDiscount(product) > 0"
                        class="px-2 py-0.5 bg-red-600 text-white text-xs font-bold rounded-lg tracking-wide"
                      >
                        {{ getDiscount(product) }}٪
                      </span>
                    </div>
                    <!-- قیمت نهایی -->
                    <div
                      class="text-gray-900 dark:text-white font-black text-2xl flex items-center justify-end gap-1"
                    >
                      {{ formatPrice(getFinalPrice(product)) }}
                      <span class="text-xs font-normal text-gray-500 dark:text-gray-400"
                        >تومان</span
                      >
                    </div>
                  </div>
                  <div v-else class="text-gray-400 text-base font-normal text-left w-full">
                    نامشخص
                  </div>
                </div>
              </th>
            </tr>
          </thead>

          <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
            <!-- ردیف امتیاز و نظرات -->
            <tr class="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
              <td
                class="sticky-right p-5 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 font-bold border-l border-gray-200 dark:border-gray-700 text-sm shadow-[2px_0_5px_rgba(0,0,0,0.02)]"
              >
                امتیاز و دیدگاه‌ها
              </td>
              <td
                v-for="product in items"
                :key="`rating-${product.id}`"
                class="p-5 border-l border-gray-200 dark:border-gray-800"
              >
                <div class="flex items-center gap-3">
                  <!-- ستاره و امتیاز -->
                  <div
                    class="flex items-center gap-1 bg-amber-50 dark:bg-amber-500/10 px-2 py-1 rounded-md"
                  >
                    <svg class="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                      />
                    </svg>
                    <span class="text-amber-600 dark:text-amber-400 font-bold text-sm pt-0.5">{{
                      product.rating || '۰'
                    }}</span>
                  </div>
                  <!-- تعداد نظر و سوال -->
                  <div class="flex flex-col text-xs text-gray-500 dark:text-gray-400 gap-1">
                    <span>{{ product.reviews_count || 0 }} نظر کاربران</span>
                    <span>{{ product.questions_count || 0 }} پرسش و پاسخ</span>
                  </div>
                </div>
              </td>
            </tr>

            <!-- ردیف دسته‌بندی (اصلاح شده) -->
            <tr class="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
              <td
                class="sticky-right p-5 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 font-bold border-l border-gray-200 dark:border-gray-700 text-sm shadow-[2px_0_5px_rgba(0,0,0,0.02)]"
              >
                دسته‌بندی
              </td>
              <td
                v-for="product in items"
                :key="`cat-${product.id}`"
                class="p-5 border-l border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 text-sm"
              >
                <span
                  class="inline-flex px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-lg font-medium"
                >
                  <!-- تغییر داده شده به primary_category -->
                  {{ product.primary_category?.name || 'بدون دسته‌بندی' }}
                </span>
              </td>
            </tr>

            <!-- ردیف برند (اضافه شده) -->
            <tr class="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
              <td
                class="sticky-right p-5 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 font-bold border-l border-gray-200 dark:border-gray-700 text-sm shadow-[2px_0_5px_rgba(0,0,0,0.02)]"
              >
                برند
              </td>
              <td
                v-for="product in items"
                :key="`brand-${product.id}`"
                class="p-5 border-l border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 text-sm"
              >
                <span
                  v-if="product.brand"
                  class="inline-flex px-3 py-1.5 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-lg font-medium"
                >
                  {{ product.brand.name }}
                </span>
                <span v-else class="text-gray-400">بدون برند</span>
              </td>
            </tr>

            <!-- ردیف برچسب‌ها (اضافه شده) -->
            <tr class="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
              <td
                class="sticky-right p-5 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 font-bold border-l border-gray-200 dark:border-gray-700 text-sm shadow-[2px_0_5px_rgba(0,0,0,0.02)]"
              >
                برچسب‌ها
              </td>
              <td
                v-for="product in items"
                :key="`tags-${product.id}`"
                class="p-5 border-l border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 text-sm"
              >
                <div v-if="product.tags && product.tags.length > 0" class="flex flex-wrap gap-2">
                  <span
                    v-for="tag in product.tags"
                    :key="tag.id"
                    class="px-2.5 py-1 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md text-xs font-medium text-gray-600 dark:text-gray-300"
                  >
                    {{ tag.name }}
                  </span>
                </div>
                <span v-else class="text-gray-400">بدون برچسب</span>
              </td>
            </tr>

            <!-- ردیف وضعیت موجودی -->
            <tr class="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
              <td
                class="sticky-right p-5 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 font-bold border-l border-gray-200 dark:border-gray-700 text-sm shadow-[2px_0_5px_rgba(0,0,0,0.02)]"
              >
                وضعیت کالا
              </td>
              <td
                v-for="product in items"
                :key="`stock-${product.id}`"
                class="p-5 border-l border-gray-200 dark:border-gray-800"
              >
                <div
                  v-if="hasStock(product)"
                  class="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-lg font-bold text-sm"
                >
                  <span class="relative flex h-2.5 w-2.5">
                    <span
                      class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"
                    ></span>
                    <span
                      class="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"
                    ></span>
                  </span>
                  موجود در انبار
                </div>
                <div
                  v-else
                  class="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 rounded-lg font-bold text-sm"
                >
                  <span class="w-2.5 h-2.5 rounded-full bg-gray-400 dark:bg-gray-500"></span>
                  ناموجود
                </div>
              </td>
            </tr>

            <!-- جداکننده مشخصات فنی -->
            <tr>
              <td
                :colspan="items.length + 1"
                class="bg-gray-50 dark:bg-gray-800 border-y border-gray-200 dark:border-gray-700 py-3 px-5 text-gray-800 dark:text-white font-black text-sm"
              >
                مشخصات فنی و ویژگی‌ها
              </td>
            </tr>

            <!-- ردیف‌های مشخصات فنی (تولید پویا) -->
            <tr
              v-for="(specKey, index) in allSpecificationKeys"
              :key="specKey"
              class="hover:bg-gray-50/80 dark:hover:bg-gray-800/50 transition-colors group"
            >
              <td
                class="sticky-right p-5 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 font-bold border-l border-gray-200 dark:border-gray-700 text-sm shadow-[2px_0_5px_rgba(0,0,0,0.02)]"
              >
                {{ specKey }}
              </td>
              <td
                v-for="product in items"
                :key="`spec-${product.id}-${index}`"
                class="p-5 border-l border-gray-200 dark:border-gray-800 text-gray-800 dark:text-gray-300 text-sm leading-relaxed"
              >
                <div v-if="getSpecValue(product, specKey)" class="flex items-start gap-2">
                  <svg
                    class="w-4 h-4 text-green-500 mt-0.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M5 13l4 4L19 7"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                    />
                  </svg>
                  <span>{{ getSpecValue(product, specKey) }}</span>
                </div>
                <div v-else class="text-gray-300 dark:text-gray-600 text-lg pr-6">-</div>
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
/* استایل‌های حرفه‌ای جدول و اسکرول‌بار */
.custom-scrollbar::-webkit-scrollbar {
  height: 10px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: #f8fafc; /* gray-50 */
  border-radius: 10px;
  margin: 0 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #cbd5e1; /* gray-300 */
  border-radius: 10px;
  border: 2px solid #f8fafc;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #94a3b8; /* gray-400 */
}

/* برای حالت دارک مود اسکرول بار */
@media (prefers-color-scheme: dark) {
  .custom-scrollbar::-webkit-scrollbar-track {
    background: #111827; /* gray-900 */
    border-top: 1px solid #1f2937;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: #374151; /* gray-700 */
    border: 2px solid #111827;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #4b5563; /* gray-600 */
  }
}

/* کلاس‌های مربوط به چسبان بودن در اسکرول */
.sticky-top {
  position: sticky;
  top: 0;
  z-index: 20;
}
.sticky-right {
  position: sticky;
  right: 0;
  z-index: 10;
}
.sticky-top-right {
  position: sticky;
  top: 0;
  right: 0;
  z-index: 30; /* در اولویت بالاتر برای گوشه بالا سمت راست */
}
</style>
