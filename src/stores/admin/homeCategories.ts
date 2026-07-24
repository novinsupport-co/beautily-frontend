import { defineStore } from 'pinia'
import axios from '@/lib/axios'

export const useHomeCategoriesStore = defineStore('homeCategories', {
  state: () => ({
    categories: [],
    isLoading: false,
  }),
  actions: {
    async fetchCategories() {
      this.isLoading = true
      try {
        const response = await axios.get('/admin/home-categories')
        this.categories = response.data.data
      } finally {
        this.isLoading = false
      }
    },
    async addCategory(formData: FormData) {
      const response = await axios.post('/admin/home-categories', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      await this.fetchCategories()
      return response.data
    },
    async removeCategory(id: number) {
      const response = await axios.delete(`/admin/home-categories/${id}`)
      await this.fetchCategories()
      return response.data
    },
    async updateOrder(orderedIds: number[]) {
      const response = await axios.post('/admin/home-categories/reorder', {
        ordered_ids: orderedIds,
      })
      return response.data
    },
  },
})
