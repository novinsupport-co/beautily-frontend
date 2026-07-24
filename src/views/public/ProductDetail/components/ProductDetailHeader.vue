<template>
  <header class="bg-white/80 backdrop-blur-xl sticky top-0 z-50 border-b border-slate-100/60">
    <div class="max-w-[1400px] mx-auto px-6 py-4 flex justify-between items-center">
      <nav class="flex items-center gap-2 text-[10px] font-iransans-bold text-slate-400">
        <RouterLink class="hover:text-slate-900 transition-colors" to="/">خانه</RouterLink>
        <span>/</span>
        <span class="text-slate-800">{{ product?.primary_category?.name || 'جزئیات محصول' }}</span>
      </nav>

      <div
        v-if="product?.brand"
        class="flex items-center gap-3 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100 shadow-sm"
      >
        <span class="text-xs font-iransans-black text-slate-900">برند محصول</span>

        <div class="flex items-center gap-2">
          <img
            v-if="product.brand.logo_url"
            :alt="product.brand.name"
            :src="product.brand.logo_url"
            class="w-8 h-8 object-contain rounded-md"
          />
          <span class="text-xs font-iransans-black text-slate-900">{{ product.brand.name }}</span>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
// دریافت آبجکت محصول از کامپوننت والد
defineProps({
  product: {
    type: Object,
    default: null,
  },
})
</script>
