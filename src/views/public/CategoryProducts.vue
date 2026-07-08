<template>
  <div class="container py-10">
    <h1 class="text-2xl font-bold mb-6">محصولات دسته: {{ slug }}</h1>

    <div v-if="loading">در حال بارگذاری...</div>

    <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      <ProductCard v-for="product in products" :key="product.id" :product="product" />
    </div>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { useCategoriesStore } from '@/stores/categories'
import { onMounted } from 'vue'
import ProductCard from '@/components/products/ProductCard.vue'

const route = useRoute()
const slug = route.params.slug

const store = useCategoriesStore()

const loading = computed(() => store.loading)
const products = computed(() => store.categoryProducts)

onMounted(() => {
  store.fetchCategoryProducts(slug)
})
</script>
