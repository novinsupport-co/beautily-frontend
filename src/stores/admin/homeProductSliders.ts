import { defineStore } from 'pinia'
import axiosInstance from '@/lib/axios'

export interface HomeProductSlider {
  id?: number
  title: string
  type: 'dynamic' | 'manual'
  query_type: string | null
  sort_order: number
  is_active: boolean
  product_ids?: number[]
  products?: { id: number; name: string; sku: string }[]
}

export const useHomeProductSlidersStore = defineStore('homeProductSliders', {
  state: () => ({
    sliders: [] as HomeProductSlider[],
    loading: false,
    error: null as string | null,
  }),

  actions: {
    async fetchSliders() {
      this.loading = true
      try {
        const response = await axiosInstance.get('/admin/home-product-sliders')
        this.sliders = response.data.data
      } catch (err: any) {
        this.error = err.response?.data?.message || 'خطا در دریافت لیست اسلایدرها'
      } finally {
        this.loading = false
      }
    },

    async createSlider(payload: HomeProductSlider) {
      this.loading = true
      try {
        // برای این ماژول چون تصویری نداریم نیازی به FormData نیست و JSON ارسال می‌شود
        const response = await axiosInstance.post('/admin/home-product-sliders', payload)
        this.sliders.push(response.data.data)
        return response.data.data
      } catch (err: any) {
        throw err
      } finally {
        this.loading = false
      }
    },

    async updateSlider(id: number, payload: HomeProductSlider) {
      this.loading = true
      try {
        const response = await axiosInstance.put(`/admin/home-product-sliders/${id}`, payload)
        const index = this.sliders.findIndex((s) => s.id === id)
        if (index !== -1) {
          this.sliders[index] = response.data.data
        }
        return response.data.data
      } catch (err: any) {
        throw err
      } finally {
        this.loading = false
      }
    },

    async deleteSlider(id: number) {
      try {
        await axiosInstance.delete(`/admin/home-product-sliders/${id}`)
        this.sliders = this.sliders.filter((s) => s.id !== id)
      } catch (err: any) {
        throw err
      }
    },
  },
})
