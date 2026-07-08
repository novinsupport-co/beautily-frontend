// src/api/adminQuestionApi.ts
import axiosInstance from '@/lib/axios'

export const adminQuestionApi = {
  getQuestions: (status?: string, page: number = 1) => {
    return axiosInstance.get('/admin/questions', { params: { status, page } })
  },
  updateStatus: (id: number, status: 'approved' | 'rejected' | 'pending') => {
    return axiosInstance.patch(`/admin/questions/${id}/status`, { status })
  },
  replyQuestion: (id: number, body: string) => {
    return axiosInstance.post(`/admin/questions/${id}/reply`, { body })
  },
  deleteQuestion: (id: number) => {
    return axiosInstance.delete(`/admin/questions/${id}`)
  },
  deleteAnswer: (id: number) => {
    return axiosInstance.delete(`/admin/answers/${id}`)
  },
  // اضافه شدن متدهای جدید:
  updateAnswer: (answerId: number, body: string) => {
    return axiosInstance.patch(`/admin/answers/${answerId}`, { body })
  },
}
