import axiosInstance from '@/lib/axios'

export interface CategoryAPI {
  id: number
  name: string
  slug: string
  recursive_children?: CategoryAPI[]
}

export const getCategoriesApi = () => axiosInstance.get('/categories')

// این خط اضافه شود
export const getCategoryProductsApi = (slug: string) =>
  axiosInstance.get(`/categories/${slug}/products`)
