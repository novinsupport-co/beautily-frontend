import axios from 'axios'
import axiosInstance from '@/lib/axios'

const RAW_BASE = (import.meta.env.VITE_BASE_URL || 'http://beautyshop.test').replace(
  /\/api\/?$/,
  '',
)
// اضافه کردن یک اینترفیس پایه برای کپچا
export interface CaptchaPayload {
  'cf-turnstile-response'?: string
  captcha_code?: string
  captcha_key?: string
}
// 1. اطلاعات ورود ادمین (ایمیل/موبایل و پسورد)
// 1. اطلاعات ورود ادمین
export interface AdminLoginPayload extends CaptchaPayload {
  email: string
  password: string
}

// 2. درخواست ارسال کد OTP (کاربر عادی)
export interface SendOtpPayload extends CaptchaPayload {
  identifier: string // می‌تواند ایمیل یا موبایل باشد
}

// 3. تایید کد OTP (کاربر عادی) - کپچا نیاز ندارد
export interface VerifyOtpPayload {
  identifier: string
  code: string
  name?: string
}

// 4. ثبت‌نام
export interface RegisterPayload extends CaptchaPayload {
  name: string
  email?: string
  password?: string
  password_confirmation?: string
}

export const getCsrfCookie = () => {
  return axios.get(`${RAW_BASE}/sanctum/csrf-cookie`, { withCredentials: true })
}

// ==========================================
// API های احراز هویت (متصل به ساختار یکپارچه جدید)
// ==========================================

// ورود با رمز عبور (ادمین/کاربر)
export const adminLoginApi = (payload: AdminLoginPayload) =>
  axiosInstance.post('/v1/auth/login', payload)

// ارسال و تایید OTP مشتری
export const sendOtpApi = (payload: SendOtpPayload) =>
  axiosInstance.post('/v1/auth/otp/send', payload)

export const verifyOtpApi = (payload: VerifyOtpPayload) =>
  axiosInstance.post('/v1/auth/otp/verify', payload)

// خروج
export const logoutApi = () => axiosInstance.post('/v1/auth/logout')

// دریافت اطلاعات کاربر لاگین شده
export const getAuthUserApi = () => axiosInstance.get('/v1/user')

// کپچا
export const getLocalCaptchaApi = () => axiosInstance.get('/captcha/api')

export const registerApi = (payload: RegisterPayload) =>
  axiosInstance.post('/v1/auth/register', payload)
