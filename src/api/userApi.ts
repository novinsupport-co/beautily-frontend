// src/api/userApi.ts
import axiosInstance from '@/lib/axios'

// دریافت اطلاعات کاربر لاگین شده
export const getUserApi = () => axiosInstance.get('/user')

// دریافت اطلاعات داشبورد
export const getUserDashboardApi = () => axiosInstance.get('/user/dashboard')

// لیست کاربران (برای پنل ادمین)
export const getUsersApi = () => axiosInstance.get('/users')

// -----------------------------------------------------
// موارد مربوط به پروفایل و حساب کاربری:
// -----------------------------------------------------

export interface UserProfileData {
  name: string
  email?: string
  national_code?: string
}

// آپدیت پروفایل کاربر
export const updateUserProfileApi = (data: UserProfileData) => {
  return axiosInstance.put('/profile', data)
}

// تغییر رمز عبور
export const changePasswordApi = (data: any) => {
  return axiosInstance.post('/change-password', data)
}

// آپلود آواتار
export const uploadAvatarApi = (formData: FormData) => {
  return axiosInstance.post('/avatar', formData)
}

// حذف آواتار
export const deleteAvatarApi = () => {
  return axiosInstance.delete('/avatar')
}

// -----------------------------------------------------
// توابع مربوط به پرسش و پاسخ:
// -----------------------------------------------------
export const replyToAnswerApi = (answerId: number, data: { body: string }) => {
  return axiosInstance.post(`/answers/${answerId}/reply`, data)
}

export const voteAnswerApi = (answerId: number, isLike: boolean) => {
  return axiosInstance.post(`/answers/${answerId}/vote`, { is_like: isLike })
}
// APIهای جدید برای دریافت نظرات و پرسش‌های کاربر
export const getUserReviewsApi = () => axiosInstance.get('/my-reviews')
export const getUserQuestionsApi = () => axiosInstance.get('/my-questions')

// درخواست کد تایید موبایل
export const requestMobileVerifyApi = (data: { mobile: string }) => {
  return axiosInstance.post('/verify-mobile/request', data)
}

// ارسال کد تایید موبایل
export const verifyMobileOtpApi = (data: { mobile: string; code: string }) => {
  return axiosInstance.post('/verify-mobile/verify', data)
}

// درخواست کد تایید ایمیل
export const requestEmailVerifyApi = (data: { email: string }) => {
  return axiosInstance.post('/verify-email/request', data)
}

// ارسال کد تایید ایمیل
export const verifyEmailOtpApi = (data: { email: string; code: string }) => {
  return axiosInstance.post('/verify-email/verify', data)
}
