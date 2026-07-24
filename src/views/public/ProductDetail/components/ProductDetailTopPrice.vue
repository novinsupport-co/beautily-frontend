<template>
  <div class="space-y-4 mb-8">
    <div class="flex items-center gap-3 text-[10px] font-iransans-bold text-slate-400">
      <span
        v-if="product?.status?.is_active && displayStock > 0"
        class="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-md"
      >
        موجود در انبار
      </span>
      <span v-else class="px-3 py-1 bg-rose-50 text-rose-600 rounded-md"> ناموجود </span>
      <span v-if="displaySku">SKU: {{ toPersianDigits(displaySku) }}</span>
    </div>
    <h1 class="text-2xl md:text-3xl font-iransans-black text-slate-900 leading-snug">
      {{ product?.name }}
    </h1>
  </div>
</template>

<script setup>
import { toPersianDigits as _toPersianDigits } from '@/utils/helpers.js'

const toPersianDigits = _toPersianDigits

defineProps({
  product: {
    type: Object,
    default: () => ({}),
  },
  displayStock: {
    type: Number,
    default: 0,
  },
  displaySku: {
    type: [String, Number],
    default: null,
  },
})
</script>
