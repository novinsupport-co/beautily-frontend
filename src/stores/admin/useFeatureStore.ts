import { defineStore } from 'pinia'
import axiosInstance from '@/lib/axios'

export interface Feature {
  id: number
  title: string
  description?: string
  icon: string
  is_active: boolean
  order: number
}

export const useAdminFeatureStore = defineStore('adminFeature', {
  state: () => ({
    features: [] as Feature[],
    loading: false,
  }),

  actions: {
    // دریافت لیست تمامی ویژگی‌ها از سرور
    async fetchFeatures() {
      this.loading = true
      try {
        const response = await axiosInstance.get('/admin/features')
        // فرض بر این است که بک‌اند داده‌ها را درون response.data.data برمی‌گرداند (مطابق Resource لاراول)
        this.features = response.data.data
      } finally {
        this.loading = false
      }
    },

    // ایجاد ویژگی جدید
    async createFeature(payload: Omit<Feature, 'id'>) {
      const response = await axiosInstance.post('/admin/features', payload)
      // اضافه کردن دیتای جدید به استیت برای آپدیت در لحظه UI
      this.features.push(response.data.data)
      return response.data
    },

    // ویرایش یک ویژگی موجود
    async updateFeature(id: number, payload: Partial<Feature>) {
      const response = await axiosInstance.put(`/admin/features/${id}`, payload)

      // پیدا کردن ایندکس ویژگی در استیت و جایگزینی آن با دیتای آپدیت شده
      const index = this.features.findIndex((f) => f.id === id)
      if (index !== -1) {
        this.features[index] = response.data.data
      }
      return response.data
    },

    // حذف یک ویژگی
    async deleteFeature(id: number) {
      await axiosInstance.delete(`/admin/features/${id}`)
      // فیلتر کردن و حذف آیتم از استیت برای آپدیت در لحظه UI
      this.features = this.features.filter((f) => f.id !== id)
    },
  },
})
