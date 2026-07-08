import axiosInstance from '@/lib/axios'

export interface OrderItemPayload {
  id: number
  name: string
  price: number
  quantity: number
}

export interface CreateOrderPayload {
  items: OrderItemPayload[]
  total_price: number
  payment_method?: string
  [key: string]: any
}

export const createOrderApi = (payload: CreateOrderPayload) =>
  axiosInstance.post('/orders', payload)

// دریافت لیست تمام سفارشات کاربر
export const getOrdersApi = () => axiosInstance.get('/orders')

// دریافت جزئیات یک سفارش خاص (برای گرفتن زمان انقضا و مبلغ در صفحه آپلود فیش)
export const getOrderByIdApi = (orderId: number) => axiosInstance.get(`/orders/${orderId}`)
