// src/api/addressApi.ts (مسیر را بر اساس ساختار پروژه خود تنظیم کنید)
import axiosInstance from '@/lib/axios'

export default {
  getAddresses() {
    return axiosInstance.get('/addresses')
  },

  createAddress(data: any) {
    return axiosInstance.post('/addresses', data)
  },

  updateAddress(id: number, data: any) {
    return axiosInstance.put(`/addresses/${id}`, data)
  },

  deleteAddress(id: number) {
    return axiosInstance.delete(`/addresses/${id}`)
  },

  setDefaultAddress(id: number) {
    return axiosInstance.patch(`/addresses/${id}/set-default`)
  },
}
