import axios from '@/lib/axios'

export const ProductService = {
  list(params?: any) {
    return axios.get('/admin/products', { params })
  },

  show(id: number | string) {
    return axios.get(`/admin/products/${id}`)
  },

  create(payload: FormData) {
    return axios.post('/admin/products', payload, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },

  update(id: number | string, payload: FormData) {
    return axios.post(`/admin/products/${id}?_method=PUT`, payload, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },

  destroy(id: number | string) {
    return axios.delete(`/admin/products/${id}`)
  },
}
