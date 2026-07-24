import { defineStore } from 'pinia'
import axios from '@/lib/axios'

interface HomeHero {
  id: number
  title: string | null
  subtitle: string | null
  cta_text: string | null
  cta_link: string | null
  image_url: string | null
  is_active: boolean
  sort_order: number
}

export const useHomeHeroStore = defineStore('homeHero', {
  state: () => ({
    heroes: [] as HomeHero[],
    isLoading: false,
    error: null as string | null,
  }),

  actions: {
    async fetchHeroes() {
      this.isLoading = true
      this.error = null
      try {
        const response = await axios.get('/admin/home-heroes')
        this.heroes = response.data.data
      } catch (err: any) {
        this.error = err.response?.data?.message || 'خطا در دریافت لیست هیروها'
      } finally {
        this.isLoading = false
      }
    },

    async createHero(formData: FormData) {
      this.isLoading = true
      this.error = null
      try {
        const response = await axios.post('/admin/home-heroes', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
        this.heroes.push(response.data.data)
        return response.data
      } catch (err: any) {
        this.error = err.response?.data?.message || 'خطا در ایجاد هیرو'
        throw err
      } finally {
        this.isLoading = false
      }
    },

    async updateHero(id: number, formData: FormData) {
      this.isLoading = true
      this.error = null
      try {
        // برای پشتیبانی لاراول از آپدیت فایل در متد POST باید از _method=PUT استفاده شود
        formData.append('_method', 'PUT')
        const response = await axios.post(`/admin/home-heroes/${id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })

        const index = this.heroes.findIndex((h) => h.id === id)
        if (index !== -1) {
          this.heroes[index] = response.data.data
        }
        return response.data
      } catch (err: any) {
        this.error = err.response?.data?.message || 'خطا در ویرایش هیرو'
        throw err
      } finally {
        this.isLoading = false
      }
    },

    async deleteHero(id: number) {
      this.isLoading = true
      this.error = null
      try {
        await axios.delete(`/admin/home-heroes/${id}`)
        this.heroes = this.heroes.filter((h) => h.id !== id)
      } catch (err: any) {
        this.error = err.response?.data?.message || 'خطا در حذف هیرو'
        throw err
      } finally {
        this.isLoading = false
      }
    },
  },
})
