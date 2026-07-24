import { defineStore } from 'pinia'
import { ref } from 'vue'
import axiosInstance from '@/lib/axios'

export const useHomeStore = defineStore('home', () => {
  // State
  const heroSlides = ref([])
  const categories = ref([])
  const latestProducts = ref([])
  const latestPosts = ref([])
  const features = ref([])
  const promoBanners = ref([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Actions
  const fetchHomeData = async () => {
    isLoading.value = true
    error.value = null

    try {
      const response = await axiosInstance.get('/v1/home')

      // لاگ برای بررسی دقیق ساختار در کنسول
      console.log('API Response:', response.data)

      const responseData = response.data.data ? response.data.data : response.data

      // اضافه کردن ?.data برای باز کردن لایه اضافی Resourceهای لاراول
      heroSlides.value = responseData.hero_slides?.data || responseData.hero_slides || []
      categories.value = responseData.categories?.data || responseData.categories || []
      latestProducts.value =
        responseData.latest_products?.data || responseData.latest_products || []
      latestPosts.value = responseData.latest_posts?.data || responseData.latest_posts || []
      features.value = responseData.features?.data || responseData.features || []
      promoBanners.value = responseData.promo_banners?.data || responseData.promo_banners || []
    } catch (err: any) {
      error.value = err.response?.data?.message || 'خطایی در دریافت اطلاعات رخ داد.'
      console.error('Home Store Error:', err)
    } finally {
      isLoading.value = false
    }
  }

  return {
    heroSlides,
    categories,
    latestProducts,
    latestPosts,
    features,
    promoBanners,
    isLoading,
    error,
    fetchHomeData,
  }
})
