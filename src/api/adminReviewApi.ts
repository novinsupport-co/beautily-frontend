// src/api/adminReviewApi.ts
import axiosInstance from '@/lib/axios'

export const adminReviewApi = {
  getReviews: (status?: string, page: number = 1) => {
    return axiosInstance.get('/admin/reviews', { params: { status, page } })
  },
  updateStatus: (id: number, status: 'approved' | 'rejected' | 'pending') => {
    // تغییر put به patch جهت تطابق با روت بک‌اند
    return axiosInstance.patch(`/admin/reviews/${id}/status`, { status })
  },
  deleteReview: (id: number) => {
    return axiosInstance.delete(`/admin/reviews/${id}`)
  },
}
