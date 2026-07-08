// src/stores/compareStore.ts
import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import type { ProductAPI } from '@/api/productApi' // مسیر دقیق فایل تایپ خود را در صورت نیاز اصلاح کنید
import { useNotificationStore } from '@/stores/notification'

export const useCompareStore = defineStore('compare', () => {
  const notify = useNotificationStore()

  // حداکثر تعداد مجاز برای مقایسه
  const MAX_ITEMS = 4

  // گرفتن داده‌های قبلی از LocalStorage (اگر وجود داشته باشد)
  const storedItems = localStorage.getItem('compareItems')
  const items = ref<ProductAPI[]>(storedItems ? JSON.parse(storedItems) : [])

  // ذخیره خودکار در LocalStorage با هر بار تغییر لیست
  watch(
    items,
    (newItems) => {
      localStorage.setItem('compareItems', JSON.stringify(newItems))
    },
    { deep: true },
  )

  // افزودن یا حذف محصول از لیست مقایسه
  const toggleCompare = (product: ProductAPI) => {
    const index = items.value.findIndex((p) => p.id === product.id)

    if (index > -1) {
      // اگر در لیست بود، حذفش کن
      items.value.splice(index, 1)
      notify.info('محصول از لیست مقایسه حذف شد')
    } else {
      // اگر در لیست نبود، اضافه‌اش کن
      if (items.value.length >= MAX_ITEMS) {
        notify.warning(`شما حداکثر ${MAX_ITEMS} محصول را می‌توانید مقایسه کنید`)
        return
      }
      items.value.push(product)
      notify.success('محصول به لیست مقایسه اضافه شد')
    }
  }

  // حذف یک محصول خاص
  const removeItem = (productId: number) => {
    items.value = items.value.filter((p) => p.id !== productId)
    notify.info('محصول از لیست مقایسه حذف شد')
  }

  // پاک کردن کل لیست
  const clearCompare = () => {
    items.value = []
    notify.success('لیست مقایسه پاک شد')
  }

  // بررسی اینکه آیا یک محصول در لیست مقایسه هست یا خیر
  const isInCompare = (productId: number) => {
    return items.value.some((p) => p.id === productId)
  }

  return {
    items,
    toggleCompare,
    removeItem,
    clearCompare,
    isInCompare,
    MAX_ITEMS,
  }
})
