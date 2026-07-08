import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getCategoriesApi } from '@/api/categoriesApi' // اصلاح مسیر ایمپورت

export const useCategoriesStore = defineStore('categories', () => {
  const categories = ref([])
  const loading = ref(false)

  // فایل: src/stores/categories.ts

  const formatRecursive = (data: any[]): Category[] => {
    return data.map((item) => ({
      id: item.id,
      name: item.name,
      slug: item.slug,
      // تطبیق با نام فیلد در CategoryResource
      children: item.recursive_children ? formatRecursive(item.recursive_children) : [],
    }))
  }
  async function fetchCategories() {
    loading.value = true
    try {
      const response = await getCategoriesApi()
      // در اکثر سیستم‌های لاراول داده‌ها در response.data.data هستند
      const rawData = response.data?.data || response.data || []
      categories.value = formatRecursive(rawData)
      console.log('Categories synced:', categories.value) // برای عیب‌یابی در کنسول
    } catch (error) {
      console.error('خطا در دریافت دسته‌ها:', error)
    } finally {
      loading.value = false
    }
  }

  return { categories, loading, fetchCategories }
})
