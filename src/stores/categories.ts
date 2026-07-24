import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getCategoriesApi, getCategoryProductsApi } from '@/api/categoriesApi'

// تعریف دقیق ساختار دسته بندی بر اساس جدول categories
export interface Category {
  id: number
  name: string
  slug: string
  parent_id?: number | null
  description?: string | null
  created_at?: string | null
  updated_at?: string | null
  children?: Category[]
}

// تعریف دقیق ساختار محصول بر اساس جدول products
export interface Product {
  id: number
  name: string
  slug: string
  sku: string | null
  base_price: number | string
  discount_price: number | string | null
  stock: number
  stock_quantity: number
  status: string
  is_active: number | boolean
  image: string | null
  gallery: any | null
  short_description: string | null
  description: string | null
  long_description: string | null
  expert_review: string | null
  how_to_use: string | null
  rating: number | string
  reviews_count: number
  questions_count: number
  brand_id: number | null
  primary_category_id: number | null
  unit: string | null
  catalog_path: string | null
  call_for_price: number | boolean
  meta: any | null
  specifications: any | null
  created_at: string | null
  updated_at: string | null
}

export const useCategoriesStore = defineStore('categories', () => {
  // اعمال Type ها به ref
  const categories = ref<Category[]>([])
  const categoryProducts = ref<Product[]>([])
  const loading = ref(false)

  const formatRecursive = (data: any[]): Category[] => {
    return data.map((item) => ({
      id: item.id,
      name: item.name,
      slug: item.slug,
      parent_id: item.parent_id,
      description: item.description,
      children: item.recursive_children ? formatRecursive(item.recursive_children) : [],
    }))
  }

  async function fetchCategories() {
    loading.value = true
    try {
      const response = await getCategoriesApi()
      const rawData = response.data?.data || response.data || []
      categories.value = formatRecursive(rawData)
    } catch (error) {
      console.error('خطا در دریافت دسته‌ها:', error)
    } finally {
      loading.value = false
    }
  }

  async function fetchCategoryProducts(slug: string) {
    loading.value = true
    categoryProducts.value = []
    try {
      const response = await getCategoryProductsApi(slug)

      // استخراج هوشمند آرایه محصولات از آبجکت Pagination
      const payload = response.data?.data || response.data
      categoryProducts.value =
        payload?.data && Array.isArray(payload.data)
          ? payload.data
          : Array.isArray(payload)
            ? payload
            : []
    } catch (error) {
      console.error('خطا در دریافت محصولات دسته:', error)
    } finally {
      loading.value = false
    }
  }

  return { categories, categoryProducts, loading, fetchCategories, fetchCategoryProducts }
})
