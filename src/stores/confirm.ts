// src/stores/confirm.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'

interface ConfirmOptions {
  title?: string
  message: string
  confirmText?: string
  cancelText?: string
  type?: 'warning' | 'danger' | 'info'
}

export const useConfirmStore = defineStore('confirm', () => {
  const isOpen = ref(false)
  const title = ref('')
  const message = ref('')
  const confirmText = ref('تایید')
  const cancelText = ref('لغو')
  const type = ref<'warning' | 'danger' | 'info'>('warning')

  // نگهداری تابع resolve مربوط به Promise
  let resolveCallback: ((value: boolean) => void) | null = null

  function ask(options: ConfirmOptions): Promise<boolean> {
    title.value = options.title || 'تایید عملیات'
    message.value = options.message
    confirmText.value = options.confirmText || 'تایید'
    cancelText.value = options.cancelText || 'انصراف'
    type.value = options.type || 'warning'
    isOpen.value = true

    // برگرداندن یک Promise که تا زمان کلیک کاربر منتظر می‌ماند
    return new Promise((resolve) => {
      resolveCallback = resolve
    })
  }

  function accept() {
    isOpen.value = false
    if (resolveCallback) resolveCallback(true)
  }

  function cancel() {
    isOpen.value = false
    if (resolveCallback) resolveCallback(false)
  }

  return {
    isOpen,
    title,
    message,
    confirmText,
    cancelText,
    type,
    ask,
    accept,
    cancel,
  }
})
