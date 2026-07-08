import axiosInstance from '@/lib/axios'

// ارسال فیش واریزی
export const uploadPaymentReceipt = async (orderId: number, formData: FormData) => {
  // حذف هدر دستی برای جلوگیری از باگ boundary
  const response = await axiosInstance.post(`/orders/${orderId}/payment-receipt`, formData)
  return response.data
}

// دریافت لیست تراکنش‌های مالی کاربر
export const getTransactionsApi = () => axiosInstance.get('/transactions')
