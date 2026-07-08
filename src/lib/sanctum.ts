import axios from 'axios'

// const APP_URL = import.meta.env.VITE_APP_URL || 'http://beautyshop.test'
const APP_URL = import.meta.env.VITE_APP_URL || 'https://api.beautily.ir'

export async function getCsrfCookie() {
  return axios.get(`${APP_URL}/sanctum/csrf-cookie`, {
    withCredentials: true,
    withXSRFToken: true,
    headers: {
      'X-Requested-With': 'XMLHttpRequest',
    },
  })
}
