import { computed, ref, watch } from 'vue'

export function useProductVariants(product, cartStore, quantity) {
  const selectedAttributes = ref({})

  const availableAttributes = computed(() => {
    if (!product.value?.variants?.length) return []
    const attrsMap = {}
    product.value.variants.forEach((variant) => {
      const attrs = variant.variant_attributes || variant.attributes || {}
      Object.entries(attrs).forEach(([key, value]) => {
        if (!attrsMap[key]) attrsMap[key] = new Set()
        attrsMap[key].add(value)
      })
    })
    return Object.keys(attrsMap).map((key) => ({
      name: key,
      label: key,
      options: Array.from(attrsMap[key]),
    }))
  })

  const currentVariant = computed(() => {
    if (!product.value?.variants?.length) return null
    return product.value.variants.find((variant) => {
      const attrs = variant.variant_attributes || variant.attributes || {}
      return Object.entries(selectedAttributes.value).every(([key, value]) => attrs[key] === value)
    })
  })

  const cartReservedQuantity = computed(() => {
    if (!product.value || !cartStore.items) return 0
    return cartStore.items.reduce((total, item) => {
      const isSameProduct = item.product_id === product.value.id
      const isSameVariant = (item.variant_id || null) === (currentVariant.value?.id || null)
      return isSameProduct && isSameVariant ? total + item.quantity : total
    }, 0)
  })

  const displaySku = computed(() => currentVariant.value?.sku || product.value?.sku)
  const displayStock = computed(() => {
    const rawStock =
      currentVariant.value?.stock !== undefined
        ? currentVariant.value.stock
        : (product.value?.stock?.quantity ?? product.value?.stock ?? 0)
    return Math.max(rawStock - cartReservedQuantity.value, 0)
  })

  watch(displayStock, (newStock) => {
    if (newStock === 0) quantity.value = 1
    else if (quantity.value > newStock) quantity.value = newStock
  })

  const displayBasePrice = computed(
    () => currentVariant.value?.price || product.value?.prices?.base || 0,
  )
  const displayFinalPrice = computed(
    () =>
      currentVariant.value?.discount_price ||
      currentVariant.value?.price ||
      product.value?.prices?.final ||
      0,
  )
  const displayDiscountPercent = computed(() => {
    if (displayBasePrice.value <= 0) return 0
    const discount = displayBasePrice.value - displayFinalPrice.value
    return discount <= 0 ? 0 : Math.round((discount / displayBasePrice.value) * 100)
  })

  const selectAttribute = (attrName, option) => {
    selectedAttributes.value[attrName] = option
    quantity.value = 1
  }

  return {
    selectedAttributes,
    availableAttributes,
    currentVariant,
    displaySku,
    displayStock,
    displayBasePrice,
    displayFinalPrice,
    displayDiscountPercent,
    selectAttribute,
  }
}
