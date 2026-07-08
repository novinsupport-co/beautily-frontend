// src/stores/products.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getProductDetailsApi, getProductsApi, ProductAPI } from '@/api/productApi'

export const useProductsStore = defineStore('products', () => {
  const products = ref<ProductAPI[]>([])
  const product = ref<ProductAPI | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchProducts(params?: Record<string, any>) {
    loading.value = true
    error.value = null
    try {
      const { data } = await getProductsApi(params)
      // اگر API شما paginator می‌دهد: data.data
      products.value = Array.isArray(data.data ? data.data : data)
        ? data.data
          ? data.data
          : data
        : []
    } catch (e: any) {
      error.value = e.response?.data?.message || e.message || 'خطا در دریافت محصولات'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function fetchProduct(slugOrId: string | number) {
    loading.value = true
    error.value = null
    try {
      const { data } = await getProductDetailsApi(slugOrId)
      product.value = data.data ?? data
    } catch (e: any) {
      error.value = e.response?.data?.message || e.message || 'خطا در دریافت محصول'
      throw e
    } finally {
      loading.value = false
    }
  }

  return {
    products,
    product,
    loading,
    error,
    fetchProducts,
    fetchProduct,
  }
})
