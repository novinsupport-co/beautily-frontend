// src/stores/notification.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'

// تعریف انواع مجاز برای نوتیفیکیشن
export type NotificationType = 'success' | 'error' | 'info' | 'warning'

interface Notification {
  id: number
  message: string
  type: NotificationType
}

export const useNotificationStore = defineStore('notification', () => {
  const notifications = ref<Notification[]>([])
  let nextId = 1

  function success(message: string) {
    addNotification(message, 'success')
  }

  function error(message: string) {
    addNotification(message, 'error')
  }

  function info(message: string) {
    addNotification(message, 'info')
  }

  function warning(message: string) {
    addNotification(message, 'warning')
  }

  function addNotification(message: string, type: NotificationType) {
    const id = nextId++
    notifications.value.push({ id, message, type })

    // حذف خودکار بعد از ۳ ثانیه
    setTimeout(() => removeNotification(id), 3000)
  }

  function removeNotification(id: number) {
    const index = notifications.value.findIndex((n) => n.id === id)
    if (index !== -1) notifications.value.splice(index, 1)
  }

  return {
    notifications,
    success,
    error,
    info,
    warning,
    removeNotification,
  }
})
