// src/api/settingApi.ts
import axiosInstance from '@/lib/axios' // مسیر فایل اکسیوس کانفیگ شده پروژه‌تان

export const getSettingImagesApi = () => {
  return axiosInstance.get('/admin/setting-images')
}

export const uploadSettingImageApi = (data: FormData) => {
  return axiosInstance.post('/admin/setting-images/upload', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}

export const deleteSettingImageApi = (key: string) => {
  return axiosInstance.delete(`/admin/setting-images/${key}`)
}
// دریافت تنظیمات عمومی (بدون نیاز به توکن/لاگین)
export const getPublicSettingApi = async (key: string) => {
  return axiosInstance.get(`/v1/settings/${key}`)
}
