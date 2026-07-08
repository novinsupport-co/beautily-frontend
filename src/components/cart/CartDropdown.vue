<template>
  <!-- کانتینر اصلی با قابلیت تشخیص هاور ماوس -->
  <div class="relative z-50" @mouseenter="open = true" @mouseleave="open = false">
    <!-- دکمه سبد خرید در هدر (Trigger) -->
    <slot name="trigger">
      <button
        class="relative flex items-center justify-center w-11 h-11 md:w-12 md:h-12 rounded-2xl bg-white dark:bg-slate-800 border-2 border-transparent hover:border-[#BC846C]/30 text-gray-600 dark:text-gray-300 hover:text-[#BC846C] hover:shadow-lg hover:shadow-[#BC846C]/10 transition-all duration-300"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.8"
          ></path>
        </svg>

        <!-- شمارنده سبد با طراحی پاپ -->
        <span
          v-if="cart.totalQuantity > 0"
          class="absolute -top-1.5 -right-1.5 flex items-center justify-center min-w-[22px] h-[22px] px-1 text-[11px] font-black text-white bg-[#BC846C] border-2 border-white dark:border-slate-900 rounded-full shadow-sm"
        >
          {{ cart.totalQuantity }}
        </span>
      </button>
    </slot>

    <!-- پاپ‌آپ سبد خرید -->
    <transition name="dropdown">
      <div
        v-if="open"
        class="absolute left-0 mt-4 w-[340px] md:w-[400px] bg-white dark:bg-slate-800 rounded-3xl shadow-[0_30px_60px_rgba(0,0,0,0.12)] border border-gray-100 dark:border-slate-700 overflow-hidden"
        dir="rtl"
      >
        <!-- هدر دراپ‌داون -->
        <div
          class="px-5 py-4 flex justify-between items-center bg-[#EEDAC5] dark:bg-slate-800/80 backdrop-blur-md border-b border-gray-100/80 dark:border-slate-700"
        >
          <div class="flex items-center gap-2">
            <span class="font-black text-gray-800 dark:text-white text-sm">سبد خرید</span>
            <span
              class="bg-white dark:bg-slate-700 text-gray-600 dark:text-gray-300 text-xs px-2 py-0.5 rounded-full font-bold"
            >
              {{ cart.totalQuantity }} کالا
            </span>
          </div>
          <button
            class="p-1.5 bg-white dark:bg-slate-700 text-gray-400 hover:text-red-500 rounded-xl shadow-sm border border-gray-100 dark:border-slate-600 transition-colors"
            @click="open = false"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                d="M6 18L18 6M6 6l12 12"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2.5"
              ></path>
            </svg>
          </button>
        </div>

        <!-- حالت سبد خالی -->
        <div
          v-if="!cart.items || cart.items.length === 0"
          class="flex flex-col items-center justify-center p-10 text-center"
        >
          <div
            class="w-20 h-20 bg-gray-50 dark:bg-slate-700 rounded-full flex items-center justify-center mb-4 border-2 border-dashed border-gray-200 dark:border-slate-600"
          >
            <svg
              class="w-8 h-8 text-gray-300 dark:text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
              ></path>
            </svg>
          </div>
          <p class="text-gray-500 dark:text-gray-400 font-medium">
            سبد خرید شما در حال حاضر خالی است.
          </p>
        </div>

        <!-- لیست محصولات -->
        <div v-else class="max-h-[55vh] overflow-y-auto custom-scrollbar p-3 space-y-2">
          <div
            v-for="item in cart.items"
            :key="item.id"
            class="group relative flex gap-4 p-3 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl hover:border-[#BC846C]/40 hover:shadow-[0_8px_20px_rgba(188,132,108,0.08)] transition-all duration-300"
          >
            <!-- تصویر محصول -->
            <div
              class="relative w-20 h-20 shrink-0 overflow-hidden rounded-xl bg-gray-50 dark:bg-slate-700 border border-gray-100 dark:border-slate-600"
            >
              <img
                :alt="item.product_name"
                :src="item.image || '/placeholder.png'"
                class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>

            <!-- اطلاعات محصول -->
            <div class="flex-1 flex flex-col justify-between py-0.5">
              <div>
                <div class="flex justify-between items-start gap-2">
                  <h4
                    :title="item.product_name"
                    class="font-bold text-[13px] text-gray-800 dark:text-gray-100 leading-tight line-clamp-2"
                  >
                    {{ item.product_name }}
                  </h4>
                  <!-- دکمه حذف آیتم -->
                  <button
                    class="text-gray-300 hover:text-red-500 transition-colors"
                    @click.prevent="cart.removeItem(item.id)"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                      ></path>
                    </svg>
                  </button>
                </div>

                <!-- بخش تگ‌های ویژگی و SKU -->
                <div class="flex flex-wrap items-center gap-1.5 mt-2">
                  <span
                    v-if="item.variant_name"
                    class="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#BC846C]/10 text-[#BC846C] border border-[#BC846C]/20"
                  >
                    <span class="w-1.5 h-1.5 rounded-full bg-[#BC846C] ml-1.5 opacity-70"></span>
                    {{ item.variant_name }}
                  </span>
                  <span
                    v-if="item.sku"
                    class="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-gray-300"
                  >
                    کد: {{ item.sku }}
                  </span>
                </div>
              </div>

              <!-- بخش قیمت و کنترل تعداد -->
              <div class="flex items-end justify-between mt-3">
                <div class="flex flex-col">
                  <span class="text-[10px] text-gray-400 dark:text-gray-500 mb-0.5">قیمت واحد</span>
                  <div class="text-[#BC846C] font-black text-sm">
                    {{ formatPrice(item.unit_price) }}
                    <span class="text-[9px] font-medium text-gray-500">تومان</span>
                  </div>
                </div>

                <div
                  class="flex items-center bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-600 rounded-lg p-0.5 shadow-sm"
                  @click.prevent
                >
                  <button
                    :disabled="item.quantity <= 1"
                    class="w-6 h-6 flex items-center justify-center text-gray-500 hover:text-gray-800 dark:hover:text-white hover:bg-white dark:hover:bg-slate-700 rounded-md disabled:opacity-40 transition-all"
                    @click="cart.updateQuantity(item.id, item.quantity - 1)"
                  >
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        d="M20 12H4"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="3"
                      ></path>
                    </svg>
                  </button>
                  <span
                    class="w-6 text-center text-[13px] font-bold text-gray-800 dark:text-white"
                    >{{ item.quantity }}</span
                  >
                  <button
                    class="w-6 h-6 flex items-center justify-center text-gray-500 hover:text-gray-800 dark:hover:text-white hover:bg-white dark:hover:bg-slate-700 rounded-md transition-all"
                    @click="cart.updateQuantity(item.id, item.quantity + 1)"
                  >
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        d="M12 4v16m8-8H4"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="3"
                      ></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- فوتر دراپ‌داون (مبلغ کل و دکمه تسویه) -->
        <div
          v-if="cart.items && cart.items.length > 0"
          class="p-4 bg-white dark:bg-slate-800 border-t border-gray-100 dark:border-slate-700 shadow-[0_-10px_20px_rgba(0,0,0,0.02)] z-10 relative"
        >
          <div class="flex justify-between items-end mb-4 px-1">
            <span class="text-sm text-gray-500 dark:text-gray-400 font-medium"
              >مبلغ قابل پرداخت:</span
            >
            <div class="text-right">
              <span class="font-black text-xl text-gray-900 dark:text-white">{{
                formatPrice(cart.totalPrice)
              }}</span>
              <span class="text-xs text-gray-500 mr-1 font-medium">تومان</span>
            </div>
          </div>

          <router-link
            class="group relative w-full flex justify-center items-center gap-2 py-3.5 bg-gradient-to-r from-[#BC846C] to-[#a6725b] text-white rounded-xl font-bold text-[15px] hover:shadow-[0_10px_20px_rgba(188,132,108,0.25)] transition-all duration-300 overflow-hidden"
            to="/cart"
            @click="open = false"
          >
            <span class="relative z-10">ثبت سفارش و تسویه</span>
            <svg
              class="w-5 h-5 relative z-10 rtl:rotate-180 group-hover:-translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
              ></path>
            </svg>
            <div
              class="absolute inset-0 h-full w-full bg-white/20 scale-x-0 group-hover:scale-x-100 transform origin-left transition-transform duration-500 ease-out"
            ></div>
          </router-link>
        </div>
      </div>
    </transition>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useCartStore } from '@/stores/cart'

const cart = useCartStore()
const open = ref(false)

const formatPrice = (price: number | string) => {
  if (!price) return '0'
  return parseFloat(String(price)).toLocaleString('fa-IR')
}
</script>

<style scoped>
/* استایل اسکرول‌بار ظریف و زیبا */
.custom-scrollbar::-webkit-scrollbar {
  width: 5px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
  margin: 5px 0;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 10px;
}
.custom-scrollbar:hover::-webkit-scrollbar-thumb {
  background: #cbd5e1;
}
.dark .custom-scrollbar::-webkit-scrollbar-thumb {
  background: #334155;
}

/* انیمیشن پاپ‌آپ (Smooth Scale & Fade) */
.dropdown-enter-active,
.dropdown-leave-active {
  transition:
    opacity 0.3s ease,
    transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  transform-origin: top right;
}
.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: scale(0.95) translateY(-10px);
}
</style>
