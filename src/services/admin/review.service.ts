import axios from '@/lib/axios'

export const ReviewService = {
  // ================= Public & User =================

  // دریافت نظرات یک محصول خاص
  getProductReviews(productSlugOrId: string | number, params?: any) {
    return axios.get(`/products/${productSlugOrId}/reviews`, { params })
  },

  // ثبت نظر جدید (نیازمند لاگین)
  submitReview(
    productSlugOrId: string | number,
    payload: { rating: number; title?: string; body: string; is_anonymous: boolean },
  ) {
    return axios.post(`/products/${productSlugOrId}/reviews`, payload)
  },

  // ثبت لایک/دیس‌لایک برای یک نظر (نیازمند لاگین)
  submitFeedback(reviewId: number, isHelpful: boolean) {
    return axios.post(`/reviews/${reviewId}/feedback`, { is_helpful: isHelpful })
  },

  // ================= Admin Panel =================

  // دریافت لیست تمام نظرات برای مدیریت
  getAdminReviews(params?: any) {
    return axios.get('/admin/reviews', { params })
  },

  // تغییر وضعیت نظر (تایید/رد)
  updateStatus(reviewId: number, status: 'approved' | 'rejected') {
    return axios.patch(`/admin/reviews/${reviewId}/status`, { status })
  },

  // حذف نظر
  deleteReview(reviewId: number) {
    return axios.delete(`/admin/reviews/${reviewId}`)
  },
}
