import axiosInstance from '@/lib/axios'

// دریافت لیست نظرات یک محصول
export const getProductReviewsApi = (productId: string | number) => {
  return axiosInstance.get(`/products/${productId}/reviews`)
}

// ثبت نظر جدید برای محصول
export const submitProductReviewApi = (
  productId: string | number,
  data: { rating: number; title?: string; body: string }, // اینجا تصحیح شود
) => {
  return axiosInstance.post(`/products/${productId}/reviews`, data)
}

// ثبت بازخورد (لایک/دیس‌لایک) برای یک نظر
export const submitReviewFeedbackApi = (
  reviewId: string | number,
  data: { type: 'like' | 'dislike' },
) => {
  return axiosInstance.post(`/reviews/${reviewId}/feedback`, data)
}
