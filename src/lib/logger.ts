import axiosInstance from '@/lib/axios'

export const FrontendLogger = {
  info: (type: string, message: string, payload?: any) => log('info', type, message, payload),
  warning: (type: string, message: string, payload?: any) => log('warning', type, message, payload),
  error: (type: string, message: string, payload?: any) => log('error', type, message, payload),
}

async function log(level: string, type: string, message: string, payload?: any) {
  try {
    await axiosInstance.post('/frontend/log', {
      level,
      type,
      message,
      payload,
    })
  } catch (err) {
    console.error('Failed to send log to server:', err)
  }
}
