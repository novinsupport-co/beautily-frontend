import axios from '@/lib/axios'

export const QuestionService = {
  // ================= Public & User =================

  // دریافت سوالات یک محصول خاص
  getProductQuestions(productSlugOrId: string | number, params?: any) {
    return axios.get(`/products/${productSlugOrId}/questions`, { params })
  },

  // ثبت سوال جدید (نیازمند لاگین)
  askQuestion(productSlugOrId: string | number, payload: { body: string; is_anonymous: boolean }) {
    return axios.post(`/products/${productSlugOrId}/questions`, payload)
  },

  // پاسخ کاربر به یک سوال (نیازمند لاگین)
  answerQuestion(questionId: number, payload: { body: string }) {
    return axios.post(`/questions/${questionId}/answers`, payload)
  },

  // ================= Admin Panel =================

  // دریافت لیست تمام سوالات برای مدیریت
  getAdminQuestions(params?: any) {
    return axios.get('/admin/questions', { params })
  },

  // تغییر وضعیت سوال (تایید/رد)
  updateQuestionStatus(questionId: number, status: 'approved' | 'rejected') {
    return axios.patch(`/admin/questions/${questionId}/status`, { status })
  },

  // پاسخ مستقیم ادمین به سوال
  adminReply(questionId: number, payload: { body: string }) {
    return axios.post(`/admin/questions/${questionId}/reply`, payload)
  },

  // حذف سوال
  deleteQuestion(questionId: number) {
    return axios.delete(`/admin/questions/${questionId}`)
  },

  // حذف یک پاسخ خاص
  deleteAnswer(answerId: number) {
    return axios.delete(`/admin/answers/${answerId}`)
  },
}
