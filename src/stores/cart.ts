import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import axios from '@/lib/axios'

export const useCartStore = defineStore('cart', () => {
  // --- State ---
  const items = ref<any[]>([])
  const loading = ref(false)
  const loadedOnce = ref(false) // برای جلوگیری از لود تکراری

  // استیت جدید برای ذخیره خلاصه مالی (محاسبات سمت سرور)
  const summary = ref({
    subtotal: 0,
    tax_amount: 0,
    packaging_cost: 0,
    shipping_cost: 0,
    total_payable: 0,
  })

  // --- Getters ---
  const totalQuantity = computed(() => items.value.reduce((sum, item) => sum + item.quantity, 0))

  // قیمت کل حالا از total_payable در خلاصه (summary) که از سرور می‌آید خوانده می‌شود
  const totalPrice = computed(() => summary.value.total_payable)

  // --- Actions ---

  // ۱. دریافت سبد از سرور
  async function fetchCart() {
    loading.value = true
    try {
      const { data } = await axios.get('/cart')
      items.value = data.data

      // اگر سرور خلاصه مالی (summary) را برگرداند، آن را در استیت ذخیره می‌کنیم
      if (data.summary) {
        summary.value = data.summary
      }

      loadedOnce.value = true // ثبت موفقیت‌آمیز بودن دریافت دیتا
    } catch (error) {
      console.error('خطا در دریافت سبد خرید:', error)
    } finally {
      loading.value = false
    }
  }

  // ۲. افزودن به سبد خرید
  async function addItem(productId: number, variantId: number | null = null, qty: number = 1) {
    try {
      await axios.post('/cart', {
        product_id: productId,
        variant_id: variantId,
        quantity: qty,
      })
      await fetchCart() // بروزرسانی سبد از سرور پس از افزودن
    } catch (error) {
      console.error('خطا در افزودن به سبد خرید:', error)
      throw error
    }
  }

  // ۳. تغییر تعداد آیتم
  async function updateQuantity(cartItemId: number, qty: number) {
    if (qty <= 0) {
      return removeItem(cartItemId)
    }

    try {
      await axios.put(`/cart/${cartItemId}`, {
        quantity: qty,
      })
      await fetchCart()
    } catch (error) {
      console.error('خطا در بروزرسانی تعداد:', error)
    }
  }

  // ۴. حذف یک آیتم
  async function removeItem(cartItemId: number) {
    try {
      await axios.delete(`/cart/${cartItemId}`)
      await fetchCart()
    } catch (error) {
      console.error('خطا در حذف آیتم:', error)
    }
  }

  // ۵. خالی کردن کل سبد خرید
  async function clearCart() {
    try {
      // ارسال درخواست به روت جدید در بک‌اند
      await axios.delete('/cart/clear')
      items.value = [] // خالی کردن استیت فرانت‌اند بلافاصله پس از موفقیت

      // ریست کردن خلاصه مالی به صفر
      summary.value = {
        subtotal: 0,
        tax_amount: 0,
        packaging_cost: 0,
        shipping_cost: 0,
        total_payable: 0,
      }
    } catch (error) {
      console.error('خطا در خالی کردن سبد خرید:', error)
      throw error
    }
  }

  // ایجاد نام مستعار (Alias) برای جلوگیری از خطاهای احتمالی در کامپوننت‌هایی که clear را صدا می‌زنند
  async function clear() {
    await clearCart()
  }

  return {
    items,
    summary, // این مورد اضافه شد تا در کامپوننت‌ها قابل دسترس باشد
    loading,
    loadedOnce,
    totalQuantity,
    totalPrice,
    fetchCart,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    clear,
  }
})
