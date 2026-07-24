<template>
  <div v-if="relatedProducts?.length" class="mt-16 space-y-8">
    <div class="flex items-center gap-3 px-2">
      <div class="w-1.5 h-6 rounded-full" style="background-color: #f57a9b"></div>
      <h3 class="text-xl font-iransans-black text-slate-900">محصولات مرتبط</h3>
    </div>

    <div class="flex overflow-x-auto gap-5 pb-8 px-2 no-scrollbar">
      <RouterLink
        v-for="related in relatedProducts"
        :key="related.slug || related.id"
        :to="{ name: 'public.product.detail', params: { slug: related.slug || related.id } }"
        class="min-w-[260px] w-[260px] bg-white p-4 rounded-2xl border border-slate-50 shadow-sm hover:shadow-md transition-all duration-300 group"
      >
        <div class="aspect-square rounded-xl bg-[#F5F5F7] overflow-hidden mb-5 relative p-4">
          <img
            :alt="related.name"
            :src="related.thumbnail?.url || related.thumbnail || related.image"
            class="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
          />
        </div>
        <h4 class="font-iransans-bold text-slate-800 mb-3 line-clamp-2 text-xs leading-relaxed">
          {{ related.name }}
        </h4>
        <div class="text-left flex items-baseline justify-end gap-1">
          <span class="text-lg font-iransans-black text-slate-900">
            {{ toPersianDigits(formatPrice(related.price || related.prices?.final)) }}
          </span>
          <span class="text-[10px] text-slate-400 font-iransans-medium">تومان</span>
        </div>
      </RouterLink>
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
  relatedProducts: {
    type: Array,
    default: () => [],
  },
})
</script>
