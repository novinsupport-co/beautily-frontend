<template>
  <div>
    <!-- عنوان -->
    <h2 class="text-2xl font-bold mb-4 text-brand-dark text-center">
      محصولات جدید
    </h2>

    <!-- شبکه محصولات -->
    <div
      v-if="products.length"
      class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
    >
      <ProductCard
        v-for="product in products"
        :key="product.id"
        :product="product"
      />
    </div>

    <!-- اگر محصولی نبود -->
    <div v-else class="text-center text-gray-500 py-10">
      هیچ محصولی یافت نشد
    </div>
  </div>
</template>

<script setup>
import ProductCard from "./ProductCard.vue";

const props = defineProps({
  products: {
    type: Array,
    required: true,
  },
});
</script>
