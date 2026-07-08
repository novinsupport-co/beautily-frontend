import axiosInstance from '@/lib/axios'

export interface CategoryAPI {
  id: number
  name: string
  slug: string
  recursive_children?: CategoryAPI[] // اضافه کردن این خط برای تایپ‌اسکریپت
}

// اضافه کردن پارامتر برای اطمینان از دریافت ساختار درختی از سمت لاراول/بک‌ند
export const getCategoriesApi = () => axiosInstance.get('/categories')
