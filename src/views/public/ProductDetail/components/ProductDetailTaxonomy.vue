<template>
  <div
    v-if="product?.categories?.length || product?.tags?.length"
    class="border-t border-slate-200/60 pt-6 space-y-4"
  >
    <div v-if="product?.categories?.length" class="flex flex-col sm:flex-row sm:items-center gap-3">
      <span class="text-[11px] font-iransans-black text-slate-400 min-w-[70px]">دسته‌بندی:</span>
      <div class="flex flex-wrap gap-2">
        <RouterLink
          v-for="cat in product.categories"
          :key="cat.id"
          :to="{ name: 'category', params: { slug: cat.slug } }"
          class="px-3 py-1.5 rounded-lg text-[11px] font-iransans-bold bg-sky-50 text-sky-600 hover:bg-sky-100 transition-colors border border-sky-100 shadow-sm"
        >
          {{ cat.name }}
        </RouterLink>
      </div>
    </div>

    <div v-if="product?.tags?.length" class="flex flex-col sm:flex-row sm:items-center gap-3">
      <span class="text-[11px] font-iransans-black text-slate-400 min-w-[70px]">برچسب‌ها:</span>
      <div class="flex flex-wrap gap-2">
        <RouterLink
          v-for="tag in product.tags"
          :key="tag.id"
          :to="{ name: 'tag', params: { slug: tag.slug } }"
          class="px-3 py-1.5 rounded-lg text-[11px] font-iransans-bold bg-amber-50 text-amber-600 hover:bg-amber-100 transition-colors border border-amber-100 shadow-sm"
        >
          # {{ tag.name }}
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  product: {
    type: Object,
    default: () => ({}),
  },
})
</script>
