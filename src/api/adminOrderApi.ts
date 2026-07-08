import axiosInstance from '@/lib/axios'

export const getAdminOrdersApi = (params?: any) => axiosInstance.get('/admin/orders', { params })

export const getAdminOrderByIdApi = (orderId: number) =>
  axiosInstance.get(`/admin/orders/${orderId}`)

// تغییر وضعیت سفارش (و ثبت کد رهگیری)
export const updateOrderStatusApi = (
  orderId: number,
  payload: { status: string; tracking_code?: string | null },
) => axiosInstance.post(`/admin/orders/${orderId}/status`, payload)

// تایید یا رد فیش واریزی
export const verifyOrderReceiptApi = (
  orderId: number,
  payload: { action: 'approve' | 'reject'; admin_note?: string },
) => axiosInstance.post(`/admin/orders/${orderId}/verify-receipt`, payload)
