<template>
  <main
    class="min-h-screen bg-gradient-to-br from-[#FDFBF9] to-[#F5F5F7] dark:from-[#1a1a2e] dark:to-[#16213e] text-[#333333] dark:text-gray-100 pt-4 pb-10 lg:pt-6 lg:pb-16 font-vazir selection:bg-[#F57A9B] selection:text-white"
    dir="rtl"
  >
    <section class="container mx-auto px-4 sm:px-6 max-w-7xl">
      <!-- هدر صفحه -->
      <div
        class="flex items-end justify-between mb-5 border-b border-[#EEDAC5]/50 dark:border-gray-700/50 pb-6"
      >
        <div>
          <h1
            class="text-3xl md:text-xl font-black text-[#333333] dark:text-white tracking-tight mb-2"
          >
            سبد خرید شما
          </h1>
          <p class="text-[#777777] dark:text-gray-400 text-sm font-medium">
            مروری بر محصولاتی که برای زیبایی خود انتخاب کرده‌اید.
          </p>
        </div>
        <span
          v-if="cart.items.length > 0"
          class="px-5 py-2 bg-[#F57A9B]/10 text-[#F57A9B] dark:bg-[#F57A9B]/20 rounded-2xl text-sm font-extrabold border border-[#F57A9B]/20 shadow-sm"
        >
          {{ cart.items.length }} کالا
        </span>
      </div>

      <!-- وضعیت در حال بارگذاری -->
      <div
        v-if="cart.loading && cart.items.length === 0"
        class="flex flex-col items-center justify-center py-40 bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-[2rem] shadow-sm border border-white/50 dark:border-gray-700"
      >
        <div class="relative w-20 h-20 mb-6">
          <div
            class="absolute inset-0 border-4 border-[#EEDAC5] dark:border-gray-700 rounded-full"
          ></div>
          <div
            class="absolute inset-0 border-4 border-[#F57A9B] rounded-full border-t-transparent animate-spin"
          ></div>
        </div>
        <p class="text-[#777777] dark:text-gray-400 text-lg font-bold tracking-wide">
          در حال آماده‌سازی سبد خرید...
        </p>
      </div>

      <!-- وضعیت سبد خرید خالی -->
      <div
        v-else-if="cart.items.length === 0"
        class="flex flex-col items-center justify-center text-center py-32 bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white dark:border-gray-700 relative overflow-hidden"
      >
        <!-- افکت پس‌زمینه -->
        <div
          class="absolute top-0 right-0 w-64 h-64 bg-[#F57A9B]/5 rounded-full blur-3xl pointer-events-none"
        ></div>
        <div
          class="absolute bottom-0 left-0 w-64 h-64 bg-[#DFA9C7]/10 rounded-full blur-3xl pointer-events-none"
        ></div>

        <div
          class="w-32 h-32 mb-8 bg-gradient-to-tr from-[#FDFBF9] to-[#EEDAC5] dark:from-slate-700 dark:to-slate-600 rounded-full flex items-center justify-center shadow-inner relative z-10"
        >
          <svg
            class="w-16 h-16 text-[#F57A9B]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
            />
          </svg>
        </div>
        <h2 class="text-3xl font-black mb-4 text-[#333333] dark:text-white relative z-10">
          سبد خرید شما خالی است
        </h2>
        <p
          class="text-[#777777] dark:text-gray-400 mb-10 max-w-md mx-auto leading-relaxed text-base font-medium relative z-10"
        >
          به نظر می‌رسد هنوز محصولی را انتخاب نکرده‌اید. با مراجعه به فروشگاه، زیبایی را به سبد خود
          اضافه کنید.
        </p>
        <RouterLink
          class="px-10 py-4 bg-gradient-to-l from-[#F57A9B] to-[#DFA9C7] text-white rounded-2xl hover:shadow-lg hover:shadow-[#F57A9B]/30 hover:-translate-y-1 transition-all duration-300 font-extrabold flex items-center gap-3 relative z-10"
          to="/"
        >
          بازگشت به فروشگاه
          <svg class="w-5 h-5 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
            />
          </svg>
        </RouterLink>
      </div>

      <!-- ساختار دو ستونه: لیست محصولات + خلاصه سفارش -->
      <div v-else class="grid grid-cols-1 xl:grid-cols-12 gap-8 lg:gap-10 items-start">
        <!-- ستون سمت راست: لیست محصولات -->
        <div class="xl:col-span-8 space-y-5">
          <div
            v-for="item in cart.items"
            :key="item.id"
            class="group relative flex flex-col sm:flex-row items-center gap-6 bg-white dark:bg-slate-800 p-4 sm:p-5 rounded-[2rem] shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-[#E9DDD2]/40 dark:border-gray-700 transition-all duration-300"
          >
            <!-- تصویر محصول -->
            <div
              class="w-full sm:w-40 h-40 shrink-0 bg-[#FDFBF9] dark:bg-slate-700/50 rounded-3xl overflow-hidden relative border border-[#EEDAC5]/30 dark:border-gray-600"
            >
              <img
                :alt="item.product_name"
                :src="item.image || '/images/placeholder.jpg'"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
              />
            </div>

            <!-- اطلاعات محصول -->
            <div class="flex-1 w-full flex flex-col justify-between py-2">
              <div class="flex justify-between items-start mb-4">
                <div class="pr-1">
                  <h3
                    class="font-black text-lg sm:text-xl text-[#333333] dark:text-white mb-2 leading-tight group-hover:text-[#F57A9B] transition-colors line-clamp-2"
                  >
                    {{ item.product_name }}
                  </h3>

                  <!-- تگ‌های SKU و Variant -->
                  <div class="flex flex-wrap items-center gap-2 mt-3">
                    <span
                      v-if="item.variant_name"
                      class="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-bold bg-[#EEDAC5]/30 text-[#BC846C] dark:bg-[#BC846C]/20 dark:text-[#EEDAC5]"
                    >
                      {{ item.variant_name }}
                    </span>
                    <span
                      v-if="item.sku"
                      class="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-bold bg-gray-100 text-[#777777] dark:bg-slate-700 dark:text-gray-300"
                    >
                      کد: {{ item.sku }}
                    </span>
                  </div>
                </div>

                <!-- دکمه حذف -->
                <button
                  class="p-2.5 text-gray-400 hover:text-white hover:bg-red-500 rounded-2xl transition-all duration-300 shadow-sm hover:shadow-md"
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
              <div class="flex flex-wrap items-end justify-between gap-4 mt-auto">
                <!-- کنترلر تعداد -->
                <div
                  class="flex items-center bg-[#FDFBF9] dark:bg-slate-900/50 p-1.5 rounded-2xl border border-[#EEDAC5]/50 dark:border-gray-700 shadow-inner"
                >
                  <button
                    :disabled="item.quantity <= 1 || cart.loading"
                    class="w-9 h-9 flex items-center justify-center text-[#777777] hover:text-[#333333] dark:text-gray-400 dark:hover:text-white hover:bg-white dark:hover:bg-slate-700 rounded-xl transition-all disabled:opacity-40 shadow-sm border border-transparent hover:border-gray-200 dark:hover:border-gray-600"
                    @click="updateQty(item.id, item.quantity - 1)"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        d="M20 12H4"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2.5"
                      />
                    </svg>
                  </button>
                  <span
                    class="w-12 text-center font-black text-[#333333] dark:text-white text-base pt-0.5"
                  >
                    {{ item.quantity }}
                  </span>
                  <button
                    :disabled="cart.loading"
                    class="w-9 h-9 flex items-center justify-center text-[#777777] hover:text-[#333333] dark:text-gray-400 dark:hover:text-white hover:bg-white dark:hover:bg-slate-700 rounded-xl transition-all disabled:opacity-40 shadow-sm border border-transparent hover:border-gray-200 dark:hover:border-gray-600"
                    @click="updateQty(item.id, item.quantity + 1)"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        d="M12 4v16m8-8H4"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2.5"
                      />
                    </svg>
                  </button>
                </div>

                <!-- قیمت‌ها -->
                <div class="text-left flex flex-col justify-end">
                  <div
                    v-if="item.quantity > 1"
                    class="text-xs text-[#777777] dark:text-gray-500 mb-1 font-bold"
                  >
                    {{ formatPrice(item.unit_price) }} تومان / واحد
                  </div>
                  <div
                    class="text-2xl font-black text-[#333333] dark:text-white flex items-center gap-1.5 justify-end"
                  >
                    <span>{{ formatPrice(item.total_price) }}</span>
                    <span class="text-sm font-extrabold text-[#BC846C] dark:text-[#EEDAC5]"
                      >تومان</span
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- دکمه خالی کردن سبد -->
          <div class="flex justify-end pt-2">
            <button
              :disabled="cart.loading"
              class="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-[#777777] hover:text-red-500 hover:bg-red-50 dark:text-gray-400 dark:hover:text-red-400 dark:hover:bg-red-500/10 rounded-xl transition-colors border border-transparent hover:border-red-100 dark:hover:border-red-900/30"
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
        <div class="xl:col-span-4 xl:sticky xl:top-28">
          <div
            class="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-white dark:border-gray-700 p-7 sm:p-8 relative overflow-hidden"
          >
            <!-- افکت تزئینی -->
            <div
              class="absolute -top-20 -right-20 w-48 h-48 bg-gradient-to-br from-[#F57A9B]/10 to-[#DFA9C7]/10 rounded-full blur-3xl pointer-events-none"
            ></div>

            <h3
              class="text-xl font-black text-[#333333] dark:text-white mb-8 flex items-center gap-3"
            >
              <span
                class="w-10 h-10 rounded-full bg-[#F57A9B]/10 flex items-center justify-center text-[#F57A9B]"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                  />
                </svg>
              </span>
              فاکتور شما
            </h3>

            <div class="space-y-5 text-sm font-medium">
              <!-- تعداد اقلام -->
              <div class="flex justify-between items-center text-[#777777] dark:text-gray-300">
                <span>تعداد اقلام:</span>
                <span class="font-extrabold text-[#333333] dark:text-white"
                  >{{ cart.totalQuantity }} کالا</span
                >
              </div>

              <!-- جمع سبد خرید -->
              <div class="flex justify-between items-center text-[#777777] dark:text-gray-300">
                <span>جمع مبلغ کالاها:</span>
                <span class="font-extrabold text-[#333333] dark:text-white"
                  >{{ formatPrice(cart.summary.subtotal) }} تومان</span
                >
              </div>

              <!-- مالیات -->
              <div
                v-if="cart.summary.tax_amount > 0"
                class="flex justify-between items-center text-[#777777] dark:text-gray-300"
              >
                <span>مالیات بر ارزش افزوده:</span>
                <span class="font-extrabold text-[#333333] dark:text-white"
                  >{{ formatPrice(cart.summary.tax_amount) }} تومان</span
                >
              </div>

              <!-- هزینه بسته‌بندی -->
              <div
                v-if="cart.summary.packaging_cost > 0"
                class="flex justify-between items-center text-[#777777] dark:text-gray-300"
              >
                <span>هزینه بسته‌بندی ویژه:</span>
                <span class="font-extrabold text-[#333333] dark:text-white"
                  >{{ formatPrice(cart.summary.packaging_cost) }} تومان</span
                >
              </div>

              <!-- هزینه ارسال -->
              <div class="flex justify-between items-center text-[#777777] dark:text-gray-300">
                <span>هزینه ارسال:</span>
                <span
                  v-if="cart.summary.shipping_cost === 0"
                  class="font-black text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-100 dark:border-emerald-900/50"
                  >رایگان</span
                >
                <span v-else class="font-extrabold text-[#333333] dark:text-white"
                  >{{ formatPrice(cart.summary.shipping_cost) }} تومان</span
                >
              </div>

              <!-- خط جداکننده -->
              <div class="relative py-4">
                <div aria-hidden="true" class="absolute inset-0 flex items-center">
                  <div
                    class="w-full border-t border-dashed border-[#EEDAC5] dark:border-gray-600"
                  ></div>
                </div>
              </div>

              <!-- مبلغ نهایی -->
              <div
                class="flex justify-between items-end bg-[#FDFBF9] dark:bg-slate-900/50 p-4 rounded-2xl border border-[#EEDAC5]/50 dark:border-gray-700"
              >
                <span class="text-[#333333] dark:text-white font-black text-base pb-1"
                  >مبلغ قابل پرداخت:</span
                >
                <div class="text-left">
                  <div class="text-2xl sm:text-3xl font-black text-[#F57A9B] tracking-tight">
                    {{ formatPrice(cart.summary.total_payable) }}
                  </div>
                  <div class="text-xs font-extrabold text-[#BC846C] mt-1">تومان</div>
                </div>
              </div>
            </div>

            <!-- دکمه پرداخت -->
            <RouterLink
              :class="{ 'opacity-70 cursor-not-allowed pointer-events-none': cart.loading }"
              class="mt-8 w-full flex items-center justify-center gap-3 py-4 sm:py-5 px-6 bg-gradient-to-r from-[#F57A9B] to-[#DFA9C7] hover:from-[#e86b8c] hover:to-[#d09ab8] text-white rounded-[1.25rem] transition-all duration-300 font-black text-lg shadow-[0_8px_25px_rgba(245,122,155,0.3)] hover:shadow-[0_12px_30px_rgba(245,122,155,0.4)] hover:-translate-y-1 group"
              to="/checkout"
            >
              ثبت سفارش و پرداخت
              <svg
                class="w-6 h-6 rtl:rotate-180 group-hover:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                />
              </svg>
            </RouterLink>

            <div
              class="mt-6 flex items-center justify-center gap-2 text-xs font-bold text-[#777777] dark:text-gray-400 bg-gray-50 dark:bg-slate-900/30 py-2.5 rounded-xl"
            >
              <svg
                class="w-4 h-4 text-[#BC846C]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                />
              </svg>
              پرداخت امن و تضمین کیفیت Beautily
            </div>
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
/* اعمال فونت اصلی */
.vazir-font {
  font-family: 'Vazirmatn', 'Vazir', 'Tahoma', sans-serif !important;
}

/* اسکرول‌بار سفارشی ظریف */
::-webkit-scrollbar {
  width: 5px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: #eedac5;
  border-radius: 10px;
}
::-webkit-scrollbar-thumb:hover {
  background: #dfa9c7;
}

/* برای مرورگرهای فایرفاکس */
* {
  scrollbar-width: thin;
  scrollbar-color: #eedac5 transparent;
}
</style>
