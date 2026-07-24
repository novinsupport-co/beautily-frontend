<template>
  <div
    v-if="product?.prices"
    class="mt-6 bg-white rounded-2xl p-6 md:p-8 border border-slate-100 shadow-[0_12px_40px_-12px_rgba(0,0,0,0.04)]"
  >
    <div
      class="flex flex-wrap items-center justify-between gap-4 mb-6 border-b border-slate-50 pb-6"
    >
      <div class="flex items-center gap-4">
        <div
          v-if="displayStock > 0"
          class="flex items-center gap-2 text-emerald-600 font-iransans-bold bg-emerald-50/50 px-4 py-2 rounded-xl"
        >
          <span class="relative flex h-3 w-3">
            <span
              class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"
            ></span>
            <span class="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
          <span class="text-xs">موجودی انبار: {{ toPersianDigits(displayStock) }} عدد</span>
        </div>
        <div
          v-else
          class="flex items-center gap-2 text-rose-500 font-iransans-bold bg-rose-50/50 px-4 py-2 rounded-xl"
        >
          <span class="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
          <span class="text-xs">در حال حاضر ناموجود</span>
        </div>
      </div>

      <button
        :class="[
          'flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-iransans-bold transition-all border',
          isInCompare
            ? 'bg-blue-50/80 text-blue-600 border-blue-100 shadow-sm'
            : 'bg-slate-50/50 text-slate-500 border-slate-100 hover:bg-blue-50/50 hover:text-blue-600 hover:border-blue-100',
        ]"
        title="مقایسه کالا"
        @click="$emit('toggle-compare')"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path
            d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        <span>{{ isInCompare ? 'حذف از مقایسه' : 'افزودن به مقایسه' }}</span>
      </button>
    </div>

    <div class="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
      <div class="text-center md:text-right space-y-2">
        <div
          v-if="displayDiscountPercent > 0"
          class="flex items-center justify-center md:justify-start gap-3 mb-1"
        >
          <div
            class="text-rose-500 text-[11px] font-iransans-black bg-rose-50 px-3 py-1 rounded-lg"
          >
            {{ toPersianDigits(displayDiscountPercent) }}٪ تخفیف
          </div>
          <div class="text-slate-400 text-sm font-iransans-bold line-through opacity-70">
            {{ toPersianDigits(formatPrice(displayBasePrice)) }}
          </div>
        </div>

        <div class="flex items-baseline justify-center md:justify-start gap-2">
          <span class="text-3xl md:text-4xl font-iransans-black text-slate-900">
            {{ toPersianDigits(formatPrice(displayFinalPrice)) }}
          </span>
          <span class="text-xs font-iransans-black text-slate-400">تومان</span>
        </div>
      </div>

      <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full md:w-auto">
        <div
          class="flex items-center justify-between bg-slate-50 rounded-xl border border-slate-200 p-1 shadow-sm h-[52px]"
        >
          <button
            :disabled="quantity >= displayStock"
            class="w-10 h-full flex items-center justify-center text-xl hover:text-rose-500 transition disabled:opacity-50"
            @click="quantity < displayStock ? $emit('update:quantity', quantity + 1) : null"
          >
            +
          </button>
          <span class="w-10 text-center font-iransans-black text-sm">
            {{ toPersianDigits(quantity) }}
          </span>
          <button
            :disabled="quantity <= 1"
            class="w-10 h-full flex items-center justify-center text-xl hover:text-rose-500 transition disabled:opacity-50"
            @click="quantity > 1 ? $emit('update:quantity', quantity - 1) : null"
          >
            -
          </button>
        </div>

        <button
          :disabled="!product?.status?.is_active || displayStock <= 0"
          class="flex-1 sm:flex-none px-8 h-[52px] bg-rose-500 hover:bg-rose-600 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-xl font-iransans-black text-sm transition-all duration-300 shadow-lg shadow-rose-200 hover:shadow-xl flex items-center justify-center gap-2 min-w-[200px]"
          @click="$emit('add-to-cart')"
        >
          <svg
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            viewBox="0 0 24 24"
          >
            <path
              d="M3 3h2l.4 2M7 13h10l3-7H6.4M7 13L5.4 5M7 13l-1.5 6m10.5-6l1.5 6M9 21h0m6 0h0"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <span>{{ product?.status?.call_for_price ? 'استعلام قیمت' : 'افزودن به سبد خرید' }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  formatPrice as _formatPrice,
  toPersianDigits as _toPersianDigits,
} from '@/utils/helpers.js'

const toPersianDigits = _toPersianDigits
const formatPrice = _formatPrice

defineProps({
  product: { type: Object, default: () => ({}) },
  displayStock: { type: Number, default: 0 },
  displayDiscountPercent: { type: Number, default: 0 },
  displayBasePrice: { type: [Number, String], default: 0 },
  displayFinalPrice: { type: [Number, String], default: 0 },
  quantity: { type: Number, default: 1 },
  isInCompare: { type: Boolean, default: false },
})

defineEmits(['update:quantity', 'add-to-cart', 'toggle-compare'])
</script>
