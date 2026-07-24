import { ref } from 'vue'
import { toggleFavorite } from '@/api/productApi.js'
import { toPersianDigits } from '@/utils/helpers.js'

export function useProductActions(product, cartStore, notify, options) {
  const isTogglingFavorite = ref(false)

  const handleShare = () => {
    if (typeof window !== 'undefined' && navigator.share && product.value) {
      navigator.share({ title: product.value.name, url: window.location.href }).catch(console.error)
    } else {
      navigator.clipboard.writeText(window.location.href)
      notify.success('لینک محصول با موفقیت کپی شد.')
    }
  }

  const handleShowPriceChart = () => console.log('Price chart clicked')

  const handleToggleFavorite = async () => {
    if (isTogglingFavorite.value || !product.value) return
    try {
      isTogglingFavorite.value = true
      product.value.is_favorited = !product.value.is_favorited
      const response = await toggleFavorite(product.value.id)
      product.value.is_favorited = response.is_favorited
      response.is_favorited
        ? notify.success('محصول به علاقه‌مندی‌ها اضافه شد.')
        : notify.info('محصول از علاقه‌مندی‌ها حذف شد.')
    } catch (error) {
      product.value.is_favorited = !product.value.is_favorited
      error.response?.status === 401
        ? notify.error('لطفاً ابتدا وارد حساب کاربری خود شوید.')
        : notify.error('مشکلی در ارتباط با سرور رخ داد.')
    } finally {
      isTogglingFavorite.value = false
    }
  }

  const handleAddToCart = async () => {
    if (!product.value) return
    const { availableAttributes, selectedAttributes, currentVariant, displayStock, quantity } =
      options

    if (availableAttributes.value.length > 0) {
      const isAllSelected = availableAttributes.value.every(
        (attr) => selectedAttributes.value[attr.name],
      )
      if (!isAllSelected) return notify.warning('لطفاً ابتدا تمام ویژگی‌های محصول را انتخاب کنید.')
      if (!currentVariant.value) return notify.info('متاسفانه این ترکیب در حال حاضر موجود نیست.')
    }

    if (displayStock.value === 0) return notify.error('موجودی این محصول به اتمام رسیده است.')
    if (quantity.value > displayStock.value) {
      quantity.value = displayStock.value
      return notify.warning(
        `فقط ${toPersianDigits(displayStock.value)} عدد از این محصول قابل سفارش است.`,
      )
    }

    try {
      await cartStore.addItem(product.value.id, currentVariant.value?.id || null, quantity.value)
      notify.success('محصول با موفقیت به سبد خرید اضافه شد!')
      quantity.value = 1
    } catch (error) {
      notify.error(
        error.response?.data?.message || 'مشکلی در افزودن محصول به سبد خرید به وجود آمد.',
      )
    }
  }

  return {
    isTogglingFavorite,
    handleShare,
    handleShowPriceChart,
    handleToggleFavorite,
    handleAddToCart,
  }
}
