// src/api/bannerApi.ts
import axiosInstance from '@/lib/axios'

export const bannerService = {
  getBanners() {
    return axiosInstance.get('/admin/banners')
  },
  createBanner(data: FormData) {
    return axiosInstance.post('/admin/banners', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
  updateBanner(id: number, data: FormData) {
    data.append('_method', 'PUT') // برای دور زدن محدودیت لاراول در دریافت فایل با متد PUT
    return axiosInstance.post(`/admin/banners/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
  deleteBanner(id: number) {
    return axiosInstance.delete(`/admin/banners/${id}`)
  },
}
