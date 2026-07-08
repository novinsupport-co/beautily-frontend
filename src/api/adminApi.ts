import axiosInstance from '@/lib/axios'

export function getAdminDashboardApi() {
  return axiosInstance.get('/admin/dashboard')
}

export function getAdminProductsApi() {
  return axiosInstance.get('/admin/products')
}

export function createProductApi(payload: Record<string, any>) {
  return axiosInstance.post('/admin/products', payload)
}

export function updateProductApi(id: number, payload: Record<string, any>) {
  return axiosInstance.put(`/admin/products/${id}`, payload)
}

export function deleteProductApi(id: number) {
  return axiosInstance.delete(`/admin/products/${id}`)
}

export const getAdminUsersApi = (params?: { search?: string; page?: number }) => {
  return axiosInstance.get('/admin/users', { params })
}

export const updateUserRoleApi = (id: number, data: { role: string }) => {
  // کلمه axios به axiosInstance تغییر یافت و پیشوند /api حذف شد
  return axiosInstance.put(`/admin/users/${id}/role`, data)
}

export const deleteUserApi = (userId: number) => {
  return axiosInstance.delete(`/admin/users/${userId}`)
}

export const sendUserResetPasswordApi = (userId: number) => {
  return axiosInstance.post(`/admin/users/${userId}/reset-password`)
}

export const createUserApi = (data: any) => {
  // کلمه api به axiosInstance تغییر یافت
  return axiosInstance.post('/admin/users', data)
}
