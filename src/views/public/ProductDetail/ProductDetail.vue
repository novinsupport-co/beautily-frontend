<template>
  <main class="min-h-screen bg-[#F9FBFC] pb-24 font-iransans text-slate-900" dir="rtl">
    <!-- Header / Breadcrumb -->
    <ProductHeader :product="product" />

    <section class="max-w-[1400px] mx-auto px-4 mt-8">
      <Loader v-if="loading" />

      <template v-else-if="product">
        <!-- Main Product Info Grid -->
        <div class="grid lg:grid-cols-12 gap-8 lg:gap-12 relative">
          <!-- Right Column: Images & Short Desc -->
          <div class="lg:col-span-5">
            <div class="sticky top-28 space-y-6">
              <!-- Rating, Comments, Questions Bar -->
              <ProductRatingBar :product="product" @updateTab="activeTab = 'community'" />

              <!-- Main Image Box -->
              <ProductMainImage
                v-model:active-image="activeImage"
                :display-discount-percent="displayDiscountPercent"
                :is-toggling-favorite="isTogglingFavorite"
                :product="product"
                @share="handleShare"
                @toggle-favorite="handleToggleFavorite"
                @show-price-chart="handleShowPriceChart"
              />
              <!-- Short Description -->
              <ProductDetailShortDescription :short-description="product?.short_description" />
            </div>
          </div>

          <!-- Left Column: Details, Cart, Ingredients, Badges -->
          <div id="purchase-section" class="lg:col-span-7 space-y-8">
            <div class="bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-slate-50">
              <ProductDetailTopPrice
                :display-sku="displaySku"
                :display-stock="displayStock"
                :product="product"
              />

              <div
                class="bg-slate-50/50 rounded-2xl border border-slate-100 p-6 md:p-8 space-y-8 mt-6"
              >
                <div class="grid md:grid-cols-2 gap-8 items-start">
                  <ProductDetailVariants
                    :available-attributes="availableAttributes"
                    :selected-attributes="selectedAttributes"
                    @select-attribute="selectAttribute"
                  />
                  <ProductDetailGuarantees />
                </div>
                <ProductDetailTaxonomy :product="product" />
              </div>

              <div class="mt-8">
                <ProductDetailPurchaseBox
                  v-model:quantity="quantity"
                  :display-base-price="displayBasePrice"
                  :display-discount-percent="displayDiscountPercent"
                  :display-final-price="displayFinalPrice"
                  :display-stock="displayStock"
                  :is-in-compare="compareStore.isInCompare(product?.id)"
                  :product="product"
                  @toggle-compare="compareStore.toggleCompare(product)"
                  @add-to-cart="handleAddToCart"
                />
              </div>

              <!-- نشان‌های اعتماد و ترکیبات در کنار باکس خرید -->
              <!-- نشان‌های اعتماد و ترکیبات -->
              <div class="mt-10 flex flex-col gap-6 border-t border-slate-100 pt-8">
                <!-- باکس نشان‌های اعتماد -->
                <div
                  v-if="product?.trust_badges?.length"
                  class="bg-slate-50/60 rounded-2xl border border-slate-100 p-5"
                >
                  <h4
                    class="text-base font-iransans-black text-slate-800 mb-4 flex items-center gap-2"
                  >
                    <span class="w-1.5 h-5 bg-[#F57A9B] rounded-full block"></span>
                    نشان‌های اعتماد و کیفیت
                  </h4>
                  <ProductDetailTrustBadges :badges="product?.trust_badges" />
                </div>

                <!-- باکس ترکیبات -->
                <div
                  v-if="product?.ingredients?.length"
                  class="bg-slate-50/60 rounded-2xl border border-slate-100 p-5"
                >
                  <h4
                    class="text-base font-iransans-black text-slate-800 mb-4 flex items-center gap-2"
                  >
                    <span class="w-1.5 h-5 bg-[#DFA9C7] rounded-full block"></span>
                    ترکیبات اصلی محصول
                  </h4>
                  <ProductDetailIngredients :ingredients="product?.ingredients" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Section: Combined Tabs (Info & Community) -->
        <div class="mt-12 bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-slate-50">
          <!-- هدر تب‌ها (با قابلیت اسکرول افقی در موبایل) -->
          <!-- هدر تب‌ها (با قابلیت اسکرول افقی در موبایل) -->
          <div
            class="flex overflow-x-auto no-scrollbar snap-x snap-mandatory gap-3 bg-slate-50/60 p-2.5 rounded-2xl border border-slate-100"
          >
            <button
              v-for="tab in tabs"
              :key="tab.id"
              :class="[
                'min-w-[160px] flex-1 snap-center flex items-center justify-center py-3.5 px-4 rounded-xl transition-all duration-300 group cursor-pointer border',
                activeTab === tab.id
                  ? 'bg-white text-[#F57A9B] border-slate-100/80 shadow-sm relative overflow-hidden'
                  : 'bg-transparent border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-100/50',
              ]"
              @click="activeTab = tab.id"
            >
              <!-- نوار رنگی کوچک در حالت فعال برای همخوانی با عناوین باکس‌ها -->
              <span
                v-if="activeTab === tab.id"
                class="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#F57A9B] rounded-l-full"
              ></span>

              <span class="text-[14px] font-iransans-bold whitespace-nowrap">{{ tab.label }}</span>
            </button>
          </div>

          <!-- محتوای تب‌ها -->
          <div class="mt-10">
            <!-- تب ۱: معرفی و مشخصات (ادغام بررسی، آموزش، توضیحات و مشخصات) -->
            <div v-show="activeTab === 'info'" class="space-y-12">
              <!-- نقد و بررسی تخصصی -->
              <section v-if="product?.expert_review">
                <h3 class="text-lg font-iransans-black text-slate-800 mb-6 flex items-center gap-2">
                  <span class="w-1.5 h-6 bg-[#F57A9B] rounded-full block"></span>
                  نقد و بررسی تخصصی
                </h3>
                <ProductDetailExpertReview :content="product?.expert_review" />
              </section>

              <!-- آموزش استفاده -->
              <section v-if="product?.how_to_use">
                <h3 class="text-lg font-iransans-black text-slate-800 mb-6 flex items-center gap-2">
                  <span class="w-1.5 h-6 bg-[#DFA9C7] rounded-full block"></span>
                  آموزش استفاده
                </h3>
                <ProductDetailHowToUse :content="product?.how_to_use" />
              </section>

              <!-- مشخصات فنی -->
              <section>
                <h3 class="text-lg font-iransans-black text-slate-800 mb-6 flex items-center gap-2">
                  <span class="w-1.5 h-6 bg-slate-800 rounded-full block"></span>
                  مشخصات فنی
                </h3>
                <div
                  v-if="product?.specifications?.length"
                  class="bg-slate-50/40 border border-slate-100 rounded-2xl p-4"
                >
                  <ul class="space-y-1">
                    <li
                      v-for="(spec, index) in product.specifications"
                      :key="index"
                      class="flex flex-col sm:flex-row sm:items-center py-4 px-6 rounded-xl hover:bg-white hover:shadow-sm transition-all duration-300 group border border-transparent hover:border-slate-100"
                    >
                      <div class="sm:w-1/3 flex items-center gap-3 mb-2 sm:mb-0">
                        <div
                          class="w-2 h-2 rounded-full bg-slate-300 group-hover:bg-[#F57A9B] transition-colors"
                        ></div>
                        <span class="text-[13px] font-iransans-bold text-slate-500">{{
                          spec.key
                        }}</span>
                      </div>
                      <div class="sm:w-2/3 text-[14px] font-iransans-black text-slate-800">
                        {{ spec.value }}
                      </div>
                    </li>
                  </ul>
                </div>
                <div
                  v-else
                  class="text-center py-12 bg-slate-50/50 rounded-2xl border border-slate-100 border-dashed flex flex-col items-center justify-center gap-3"
                >
                  <svg
                    class="w-10 h-10 text-slate-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="1.5"
                    />
                  </svg>
                  <span class="text-slate-500 font-iransans-medium text-sm"
                    >مشخصات فنی برای این محصول ثبت نشده است.</span
                  >
                </div>
              </section>

              <!-- توضیحات تکمیلی -->
              <section>
                <h3 class="text-lg font-iransans-black text-slate-800 mb-6 flex items-center gap-2">
                  <span class="w-1.5 h-6 bg-slate-400 rounded-full block"></span>
                  توضیحات تکمیلی
                </h3>
                <div
                  v-if="product?.long_description"
                  class="prose prose-slate max-w-none font-iransans leading-loose text-slate-600 prose-headings:font-iransans-black prose-a:text-[#F57A9B] text-sm"
                  v-html="product.long_description"
                ></div>
                <div
                  v-else
                  class="text-center py-12 bg-slate-50/50 rounded-2xl border border-slate-100 border-dashed flex flex-col items-center justify-center gap-3"
                >
                  <svg
                    class="w-10 h-10 text-slate-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="1.5"
                    />
                  </svg>
                  <span class="text-slate-500 font-iransans-medium text-sm"
                    >توضیحات تکمیلی ثبت نشده است.</span
                  >
                </div>
              </section>
            </div>

            <!-- تب ۲: نظرات و پرسش‌ها -->
            <div v-show="activeTab === 'community'" class="space-y-12">
              <section>
                <h3 class="text-lg font-iransans-black text-slate-800 mb-6">نظرات کاربران</h3>
                <ProductReviewsTab v-if="product?.id" :product-id="product.id" />
              </section>

              <hr class="border-slate-100" />

              <section>
                <h3 class="text-lg font-iransans-black text-slate-800 mb-6">پرسش و پاسخ</h3>
                <ProductQuestionsTab v-if="product?.id" :product-id="product.id" />
              </section>
            </div>
          </div>
        </div>

        <!-- Section: Related Products Slider -->
        <ProductDetailRelatedProducts :related-products="product?.related_products" />
      </template>

      <!-- Fallback / Error state -->
      <div v-else-if="!loading && !product" class="text-center py-24 space-y-4">
        <!-- ... (بدون تغییر) ... -->
      </div>
    </section>

    <!-- Mobile Sticky Purchase Bar -->
    <div
      v-if="product && !loading"
      class="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 p-4 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] flex justify-between items-center"
    >
      <div class="flex flex-col">
        <span class="text-xs text-slate-500 font-iransans-medium mb-1">قیمت نهایی:</span>
        <span class="text-sm font-iransans-black text-slate-800"
          >{{ displayFinalPrice }} تومان</span
        >
      </div>
      <a
        class="px-6 py-3 bg-[#F57A9B] hover:bg-rose-500 text-white rounded-xl font-iransans-bold text-sm shadow-md transition-colors"
        href="#purchase-section"
      >
        افزودن به سبد خرید
      </a>
    </div>
  </main>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useProductsStore } from '@/stores/products.js'
import { useCartStore } from '@/stores/cart.js'
import { useNotificationStore } from '@/stores/notification.js'
import { useCompareStore } from '@/stores/compareStore.js'
import Loader from '@/components/ui/Loader.vue'

// Components
import ProductReviewsTab from '@/views/public/ProductDetail/components/ProductReviewsTab.vue'
import ProductQuestionsTab from '@/views/public/ProductDetail/components/ProductQuestionsTab.vue'
import ProductHeader from '@/views/public/ProductDetail/components/ProductDetailHeader.vue'
import ProductDetailTopPrice from '@/views/public/ProductDetail/components/ProductDetailTopPrice.vue'
import ProductRatingBar from '@/views/public/ProductDetail/components/ProductDetailRatingBar.vue'
import ProductMainImage from '@/views/public/ProductDetail/components/ProductDetailImageGallery.vue'
import ProductDetailShortDescription from '@/views/public/ProductDetail/components/ProductDetailShortDescription.vue'
import ProductDetailVariants from '@/views/public/ProductDetail/components/ProductDetailVariants.vue'
import ProductDetailGuarantees from '@/views/public/ProductDetail/components/ProductDetailGuarantees.vue'
import ProductDetailTaxonomy from '@/views/public/ProductDetail/components/ProductDetailTaxonomy.vue'
import ProductDetailPurchaseBox from '@/views/public/ProductDetail/components/ProductDetailPurchaseBox.vue'
import ProductDetailRelatedProducts from '@/views/public/ProductDetail/components/ProductDetailRelatedProducts.vue'
import ProductDetailTrustBadges from '@/views/public/ProductDetail/components/ProductDetailTrustBadges.vue'
import ProductDetailIngredients from '@/views/public/ProductDetail/components/ProductDetailIngredients.vue'
import ProductDetailExpertReview from '@/views/public/ProductDetail/components/ProductDetailExpertReview.vue'
import ProductDetailHowToUse from '@/views/public/ProductDetail/components/ProductDetailHowToUse.vue'

// Composables
import { useProductSEO } from '@/views/public/ProductDetail/composables/useProductSEO'
import { useProductVariants } from '@/views/public/ProductDetail/composables/useProductVariants'
import { useProductActions } from '@/views/public/ProductDetail/composables/useProductActions'

const route = useRoute()
const productStore = useProductsStore()
const cartStore = useCartStore()
const notify = useNotificationStore()
const compareStore = useCompareStore()

// States
const activeImage = ref(null)
const quantity = ref(1)
const activeTab = ref('info') // دیفالت روی تب معرفی

// تب‌های ادغام شده
const tabs = [
  { id: 'info', label: 'معرفی و مشخصات' },
  { id: 'community', label: 'نظرات و پرسش‌ها' },
]

const loading = computed(() => productStore.loading)
const product = computed(() => productStore.product)

// --- Composable Injections ---
useProductSEO(product)

const {
  selectedAttributes,
  availableAttributes,
  currentVariant,
  displaySku,
  displayStock,
  displayBasePrice,
  displayFinalPrice,
  displayDiscountPercent,
  selectAttribute,
} = useProductVariants(product, cartStore, quantity)

const {
  isTogglingFavorite,
  handleShare,
  handleShowPriceChart,
  handleToggleFavorite,
  handleAddToCart,
} = useProductActions(product, cartStore, notify, {
  availableAttributes,
  selectedAttributes,
  currentVariant,
  displayStock,
  quantity,
})

// --- Initialization ---
const init = async () => {
  const slug = route.params.slug ? decodeURIComponent(route.params.slug) : null
  if (!slug) return

  await productStore.fetchProduct(slug)

  if (product.value) {
    activeImage.value =
      product.value.images?.thumbnail?.urls?.large ||
      product.value.images?.thumbnail?.url ||
      product.value.images?.thumbnail
    if (availableAttributes.value.length > 0) {
      availableAttributes.value.forEach((attr) => {
        if (attr.options.length > 0) selectedAttributes.value[attr.name] = attr.options[0]
      })
    }
  }
}

watch(
  () => route.params.slug,
  () => {
    quantity.value = 1
    selectedAttributes.value = {}
    activeTab.value = 'info'
    activeImage.value = null
    window.scrollTo({ top: 0, behavior: 'smooth' })
    init()
  },
)
watch(
  product,
  (newVal) => {
    if (newVal) {
      console.log('Ingredients Data:', newVal.ingredients)
      console.log('Trust Badges Data:', newVal.trust_badges)
    }
  },
  { deep: true },
)
onMounted(init)
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}

.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
