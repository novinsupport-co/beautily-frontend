<template>
  <main
    class="min-h-screen bg-gray-50/50 dark:bg-slate-900 text-gray-800 dark:text-gray-100 py-8 lg:py-12 vazir-font"
    dir="rtl"
  >
    <section class="container mx-auto px-4 sm:px-6 max-w-7xl">
      <!-- هدر صفحه -->
      <div class="flex items-center justify-between mb-8">
        <h1 class="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          سبد خرید شما
        </h1>
        <span
          v-if="cart.items.length > 0"
          class="px-4 py-1.5 bg-brand-primary/10 text-brand-primary dark:bg-brand-primary/20 rounded-full text-sm font-bold"
        >
          {{ cart.items.length }} کالا
        </span>
      </div>

      <!-- وضعیت در حال بارگذاری -->
      <div
        v-if="cart.loading && cart.items.length === 0"
        class="flex flex-col items-center justify-center py-32 bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700"
      >
        <div
          class="animate-spin rounded-full h-14 w-14 border-4 border-gray-100 dark:border-gray-700 border-t-brand-primary mb-6"
        ></div>
        <p class="text-gray-500 dark:text-gray-400 text-lg font-medium">
          در حال دریافت اطلاعات سبد خرید...
        </p>
      </div>

      <!-- وضعیت سبد خرید خالی -->
      <div
        v-else-if="cart.items.length === 0"
        class="flex flex-col items-center justify-center text-center py-32 bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700"
      >
        <div
          class="w-32 h-32 mb-6 bg-gray-50 dark:bg-slate-700/50 rounded-full flex items-center justify-center"
        >
          <span class="text-6xl">🛍️</span>
        </div>
        <h2 class="text-2xl font-black mb-3 text-gray-900 dark:text-white">
          سبد خرید شما خالی است
        </h2>
        <p
          class="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto leading-relaxed text-sm font-medium"
        >
          شما هنوز هیچ محصولی به سبد خرید خود اضافه نکرده‌اید. برای مشاهده محصولات به صفحه فروشگاه
          بازگردید.
        </p>
        <RouterLink
          class="px-8 py-3.5 bg-brand-primary text-white rounded-2xl hover:bg-brand-primary/90 hover:-translate-y-1 transition-all duration-300 font-bold shadow-lg shadow-brand-primary/30 flex items-center gap-2"
          to="/"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
            />
          </svg>
          بازگشت به فروشگاه
        </RouterLink>
      </div>

      <!-- ساختار دو ستونه: لیست محصولات + خلاصه سفارش -->
      <div v-else class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <!-- ستون سمت راست: لیست محصولات -->
        <div class="lg:col-span-8 space-y-4">
          <div
            v-for="item in cart.items"
            :key="item.id"
            class="group relative flex flex-col sm:flex-row items-center gap-6 bg-white dark:bg-slate-800 p-5 rounded-3xl shadow-sm hover:shadow-md border border-gray-100 dark:border-gray-700 transition-all duration-300"
          >
            <!-- تصویر محصول -->
            <div
              class="w-full sm:w-36 h-36 shrink-0 bg-gray-50 dark:bg-slate-700 rounded-2xl overflow-hidden relative"
            >
              <img
                :alt="item.product_name"
                :src="item.image || '/images/placeholder.jpg'"
                class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>

            <!-- اطلاعات محصول -->
            <div class="flex-1 w-full flex flex-col justify-between py-1">
              <div class="flex justify-between items-start mb-2">
                <div>
                  <h3
                    class="font-extrabold text-lg text-gray-900 dark:text-white mb-2 leading-tight group-hover:text-brand-primary transition-colors"
                  >
                    {{ item.product_name }}
                  </h3>

                  <!-- تگ‌های SKU و Variant -->
                  <div class="flex flex-wrap items-center gap-2 mb-3">
                    <span
                      v-if="item.variant_name"
                      class="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-brand-primary/10 text-brand-primary dark:bg-brand-primary/20"
                    >
                      {{ item.variant_name }}
                    </span>
                    <span
                      v-if="item.sku"
                      class="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-600 dark:bg-slate-700 dark:text-gray-300"
                    >
                      SKU: {{ item.sku }}
                    </span>
                  </div>
                </div>

                <!-- دکمه حذف -->
                <button
                  class="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all"
                  title="حذف کالا"
                  @click="remove(item.id)"
                >
                  <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                    />
                  </svg>
                </button>
              </div>

              <!-- قیمت و انتخاب تعداد -->
              <div
                class="flex flex-wrap items-center justify-between gap-4 mt-auto border-t border-gray-50 dark:border-gray-700/50 pt-4"
              >
                <!-- کنترلر تعداد -->
                <div
                  class="flex items-center bg-gray-50 dark:bg-slate-900/50 p-1 rounded-xl border border-gray-200/60 dark:border-gray-700"
                >
                  <button
                    :disabled="item.quantity <= 1 || cart.loading"
                    class="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-white dark:hover:bg-slate-700 rounded-lg transition-all disabled:opacity-30 shadow-sm"
                    @click="updateQty(item.id, item.quantity - 1)"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        d="M20 12H4"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                      />
                    </svg>
                  </button>
                  <span
                    class="w-12 text-center font-black text-gray-900 dark:text-white text-sm pt-0.5"
                  >
                    {{ item.quantity }}
                  </span>
                  <button
                    :disabled="cart.loading"
                    class="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-white dark:hover:bg-slate-700 rounded-lg transition-all disabled:opacity-30 shadow-sm"
                    @click="updateQty(item.id, item.quantity + 1)"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        d="M12 4v16m8-8H4"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                      />
                    </svg>
                  </button>
                </div>

                <!-- قیمت‌ها -->
                <div class="text-left">
                  <div
                    v-if="item.quantity > 1"
                    class="text-xs text-gray-400 dark:text-gray-500 mb-0.5 font-medium"
                  >
                    {{ formatPrice(item.unit_price) }} تومان / واحد
                  </div>
                  <div
                    class="text-xl font-black text-gray-900 dark:text-white flex items-center gap-1.5 justify-end"
                  >
                    <span>{{ formatPrice(item.total_price) }}</span>
                    <span class="text-sm font-bold text-gray-500 dark:text-gray-400">تومان</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- دکمه خالی کردن سبد -->
          <div class="flex justify-end pt-4">
            <button
              :disabled="cart.loading"
              class="flex items-center gap-2 px-4 py-2 text-sm font-bold text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 transition-colors"
              @click="clearCart"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                />
              </svg>
              خالی کردن کل سبد
            </button>
          </div>
        </div>

        <!-- ستون سمت چپ: خلاصه سفارش (Sticky) -->
        <div class="lg:col-span-4 lg:sticky lg:top-24">
          <div
            class="bg-white dark:bg-slate-800 rounded-3xl shadow-lg shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-gray-700 p-6 relative overflow-hidden"
          >
            <!-- افکت تزئینی پس‌زمینه باکس -->
            <div
              class="absolute -top-24 -left-24 w-48 h-48 bg-brand-primary/5 rounded-full blur-3xl pointer-events-none"
            ></div>

            <h3
              class="text-xl font-black text-gray-900 dark:text-white mb-6 flex items-center gap-2"
            >
              <svg
                class="w-6 h-6 text-brand-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                />
              </svg>
              خلاصه سفارش
            </h3>

            <div class="space-y-4 text-sm font-medium">
              <!-- تعداد اقلام -->
              <div class="flex justify-between items-center text-gray-600 dark:text-gray-300">
                <span>تعداد اقلام:</span>
                <span class="font-bold text-gray-900 dark:text-white"
                  >{{ cart.totalQuantity }} کالا</span
                >
              </div>

              <!-- جمع سبد خرید -->
              <div class="flex justify-between items-center text-gray-600 dark:text-gray-300">
                <span>جمع سبد خرید:</span>
                <span class="font-bold text-gray-900 dark:text-white"
                  >{{ formatPrice(cart.summary.subtotal) }} تومان</span
                >
              </div>

              <!-- مالیات -->
              <div
                v-if="cart.summary.tax_amount > 0"
                class="flex justify-between items-center text-gray-600 dark:text-gray-300"
              >
                <span>مالیات بر ارزش افزوده:</span>
                <span class="font-bold text-gray-900 dark:text-white"
                  >{{ formatPrice(cart.summary.tax_amount) }} تومان</span
                >
              </div>

              <!-- هزینه بسته‌بندی -->
              <div
                v-if="cart.summary.packaging_cost > 0"
                class="flex justify-between items-center text-gray-600 dark:text-gray-300"
              >
                <span>هزینه بسته‌بندی:</span>
                <span class="font-bold text-gray-900 dark:text-white"
                  >{{ formatPrice(cart.summary.packaging_cost) }} تومان</span
                >
              </div>

              <!-- هزینه ارسال -->
              <div class="flex justify-between items-center text-gray-600 dark:text-gray-300">
                <span>هزینه ارسال:</span>
                <span
                  v-if="cart.summary.shipping_cost === 0"
                  class="font-bold text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-500/10 px-2.5 py-1 rounded-md"
                  >رایگان</span
                >
                <span v-else class="font-bold text-gray-900 dark:text-white"
                  >{{ formatPrice(cart.summary.shipping_cost) }} تومان</span
                >
              </div>

              <div class="w-full h-px bg-gray-100 dark:bg-slate-700 my-5"></div>

              <!-- مبلغ نهایی -->
              <div class="flex justify-between items-end">
                <span class="text-gray-900 dark:text-white font-extrabold text-base"
                  >مبلغ قابل پرداخت:</span
                >
                <div class="text-left">
                  <div class="text-2xl font-black text-brand-primary">
                    {{ formatPrice(cart.summary.total_payable) }}
                  </div>
                  <div class="text-xs font-bold text-gray-500 mt-1">تومان</div>
                </div>
              </div>
            </div>

            <!-- دکمه پرداخت -->
            <RouterLink
              :class="{ 'opacity-70 cursor-not-allowed pointer-events-none': cart.loading }"
              class="mt-8 w-full flex items-center justify-center gap-2 py-4 px-6 bg-gradient-to-l from-brand-primary to-blue-600 hover:from-brand-primary hover:to-blue-500 text-white rounded-2xl transition-all duration-300 font-bold text-lg shadow-xl shadow-brand-primary/30 hover:shadow-brand-primary/50 hover:-translate-y-1"
              to="/checkout"
            >
              ثبت سفارش و پرداخت
              <svg
                class="w-5 h-5 rtl:rotate-180"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                />
              </svg>
            </RouterLink>

            <p
              class="text-center text-xs font-medium text-gray-400 dark:text-gray-500 mt-5 flex items-center justify-center gap-1.5"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                />
              </svg>
              پرداخت امن و تضمین شده
            </p>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useCartStore } from '@/stores/cart'

const cart = useCartStore()

const formatPrice = (price: number) =>
  parseFloat(String(price || 0)).toLocaleString('fa-IR', { minimumFractionDigits: 0 })

const updateQty = (cartItemId: number, qty: number) => {
  if (qty <= 0) return
  cart.updateQuantity(cartItemId, qty)
}

const remove = (cartItemId: number) => {
  cart.removeItem(cartItemId)
}

const clearCart = () => {
  if (confirm('آیا از خالی کردن سبد خرید اطمینان دارید؟')) {
    cart.clear()
  }
}

onMounted(() => {
  if (!cart.loadedOnce) {
    cart.fetchCart()
  }
})
</script>

<style scoped>
/* =========== استایل‌های فونت و انیمیشن =========== */

/* اعمال فونت خوانا و زیبا */
.vazir-font {
  font-family: 'Vazirmatn', 'Vazir', 'Tahoma', sans-serif !important;
}

::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 999px;
}
::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* انیمیشن نرم برای دکمه‌ها و هاورها */
button,
a {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
