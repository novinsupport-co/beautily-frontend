// src/stores/admin/useBannerStore.ts
import { defineStore } from 'pinia'
import { bannerService } from '@/api/bannerApi' // تعریف ساختار داده‌ای بنر بر اساس دیتابیس شما

// تعریف ساختار داده‌ای بنر بر اساس دیتابیس شما
export interface Banner {
  id: number
  title: string
  link: string | null
  type: string
  position: string
  order: number
  is_active: boolean
  image_url?: string
}

export const useAdminBannerStore = defineStore('adminBanner', {
  state: () => ({
    banners: [] as Banner[],
    loading: false,
    error: null as string | null,
  }),
  actions: {
    async fetchBanners() {
      this.loading = true
      this.error = null
      try {
        const response = await bannerService.getBanners()
        // فرض بر این است که ریسورس لاراول داده‌ها را در 'data' کپسوله می‌کند
        this.banners = response.data.data
      } catch (error: any) {
        this.error = error.response?.data?.message || 'خطا در دریافت لیست بنرها'
      } finally {
        this.loading = false
      }
    },

    async createBanner(data: FormData) {
      this.loading = true
      this.error = null
      try {
        const response = await bannerService.createBanner(data)
        // اضافه کردن بنر جدید به ابتدای لیست در استیت
        this.banners.unshift(response.data.data)
        return response.data
      } catch (error: any) {
        this.error = error.response?.data?.message || 'خطا در ایجاد بنر'
        throw error // پرتاب خطا برای هندل کردن در کامپوننت (مثلا نمایش نوتیفیکیشن)
      } finally {
        this.loading = false
      }
    },

    async updateBanner(id: number, data: FormData) {
      this.loading = true
      this.error = null
      try {
        const response = await bannerService.updateBanner(id, data)
        // پیدا کردن بنر در استیت و بروزرسانی آن
        const index = this.banners.findIndex((b) => b.id === id)
        if (index !== -1) {
          this.banners[index] = response.data.data
        }
        return response.data
      } catch (error: any) {
        this.error = error.response?.data?.message || 'خطا در ویرایش بنر'
        throw error
      } finally {
        this.loading = false
      }
    },

    async deleteBanner(id: number) {
      this.loading = true
      this.error = null
      try {
        await bannerService.deleteBanner(id)
        // حذف بنر از استیت
        this.banners = this.banners.filter((b) => b.id !== id)
      } catch (error: any) {
        this.error = error.response?.data?.message || 'خطا در حذف بنر'
        throw error
      } finally {
        this.loading = false
      }
    },
  },
})
