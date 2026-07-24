import { defineStore } from 'pinia'
import axios from '@/lib/axios' // اطمینان از مسیر صحیح axios instance

/**
 * @interface HomeBlog
 * @description ساختار داده‌های یک آیتم در بخش مقالات صفحه اصلی
 */
export interface HomeBlog {
  id: number
  title: string
  link: string | null
  order: number
  is_active: boolean // بهتر است از boolean استفاده شود
  image_url?: string // این پراپرتی از بک‌اند می‌آید
  image_alt: string | null
}

/**
 * @interface HomeBlogState
 * @description ساختار state برای ماژول homeBlogs
 */
interface HomeBlogState {
  homeBlogs: HomeBlog[]
  loading: boolean
  error: string | null
}

export const useHomeBlogsStore = defineStore('homeBlogs', {
  state: (): HomeBlogState => ({
    homeBlogs: [],
    loading: false,
    error: null,
  }),

  actions: {
    /**
     * دریافت لیست مقالات از API
     */
    async fetchHomeBlogs() {
      this.loading = true
      this.error = null
      try {
        const response = await axios.get<{ data: HomeBlog[] }>('/admin/home-blogs')
        this.homeBlogs = response.data.data
      } catch (err: any) {
        this.error = err.response?.data?.message || 'خطا در دریافت اطلاعات مقالات.'
        console.error('Fetch HomeBlogs Error:', err)
      } finally {
        this.loading = false
      }
    },

    /**
     * افزودن یک مقاله جدید
     * @param {FormData} formData - اطلاعات فرم شامل تصویر
     */
    async addHomeBlog(formData: FormData): Promise<HomeBlog> {
      this.loading = true
      this.error = null
      try {
        const response = await axios.post<{ data: HomeBlog }>('/admin/home-blogs', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
        this.homeBlogs.unshift(response.data.data) // unshift برای نمایش آیتم جدید در ابتدای لیست
        return response.data.data
      } catch (err: any) {
        this.error = err.response?.data?.message || 'خطا در افزودن مقاله.'
        console.error('Add HomeBlog Error:', err)
        throw err
      } finally {
        this.loading = false
      }
    },

    /**
     * به‌روزرسانی یک مقاله موجود
     * @param {number} id - شناسه مقاله
     * @param {FormData} formData - اطلاعات فرم شامل تصویر جدید (در صورت وجود)
     */
    async updateHomeBlog(id: number, formData: FormData): Promise<HomeBlog> {
      this.loading = true
      this.error = null
      try {
        // از متد POST استفاده می‌کنیم زیرا FormData ارسال می‌شود و لاراول با _method:PUT آن را مدیریت می‌کند
        const response = await axios.post<{ data: HomeBlog }>(`/admin/home-blogs/${id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
        const index = this.homeBlogs.findIndex((b) => b.id === id)
        if (index !== -1) {
          this.homeBlogs[index] = response.data.data
        }
        return response.data.data
      } catch (err: any) {
        this.error = err.response?.data?.message || 'خطا در به‌روزرسانی مقاله.'
        console.error('Update HomeBlog Error:', err)
        throw err
      } finally {
        this.loading = false
      }
    },

    /**
     * حذف یک مقاله
     * @param {number} id - شناسه مقاله
     */
    async deleteHomeBlog(id: number) {
      this.loading = true
      this.error = null
      try {
        await axios.delete(`/admin/home-blogs/${id}`)
        this.homeBlogs = this.homeBlogs.filter((b) => b.id !== id)
      } catch (err: any) {
        this.error = err.response?.data?.message || 'خطا در حذف مقاله.'
        console.error('Delete HomeBlog Error:', err)
        throw err
      } finally {
        this.loading = false
      }
    },
  },
})
