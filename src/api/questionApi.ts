import axiosInstance from '@/lib/axios'

// دریافت لیست پرسش و پاسخ‌های یک محصول
export const getProductQuestionsApi = (productId: string | number) => {
  return axiosInstance.get(`/products/${productId}/questions`)
}

// ثبت پرسش جدید برای محصول
export const submitProductQuestionApi = (
  productId: string | number,
  data: { body: string }, // <--- تغییر از 'question' به 'body'
) => {
  return axiosInstance.post(`/products/${productId}/questions`, data)
}

// ثبت پاسخ برای یک پرسش موجود
export const submitQuestionAnswerApi = (
  questionId: string | number,
  data: { body: string }, // <--- تغییر از 'answer' به 'body'
) => {
  return axiosInstance.post(`/questions/${questionId}/answers`, data)
}
