import { reactive, ref } from 'vue'
import { ProductService } from '@/services/admin/product.service'

export function useProductForm() {
  const loading = ref(false)
  const errors = ref<Record<string, string[]>>({})

  const form = reactive({
    name: '',
    sku: '',
    base_price: '',
    discount_price: '',
    stock_quantity: 0,
    unit: 'عدد',
    status: 'available',
    is_active: true,
    primary_category_id: '',
    category_ids: [] as number[],
    tag_ids: [] as number[],
    short_description: '',
    long_description: '',
    meta: {
      title: '',
      description: '',
      keywords: [] as string[],
    },
    thumbnail: null as File | null,
    gallery: [] as File[],
  })

  const toFormData = () => {
    const fd = new FormData()

    Object.entries(form).forEach(([key, value]: any) => {
      if (value === null) return

      if (Array.isArray(value)) {
        value.forEach((v) => fd.append(`${key}[]`, v))
      } else if (typeof value === 'object') {
        Object.entries(value).forEach(([k, v]: any) => {
          if (Array.isArray(v)) {
            v.forEach((item) => fd.append(`meta[${k}][]`, item))
          } else {
            fd.append(`meta[${k}]`, v)
          }
        })
      } else {
        fd.append(key, value)
      }
    })

    if (form.thumbnail) {
      fd.append('thumbnail', form.thumbnail)
    }

    form.gallery.forEach((file) => {
      fd.append('gallery[]', file)
    })

    return fd
  }

  const submitCreate = async () => {
    loading.value = true
    errors.value = {}

    try {
      await ProductService.create(toFormData())
    } catch (e: any) {
      errors.value = e.response?.data?.errors || {}
      throw e
    } finally {
      loading.value = false
    }
  }

  const submitUpdate = async (id: number) => {
    loading.value = true
    errors.value = {}

    try {
      await ProductService.update(id, toFormData())
    } catch (e: any) {
      errors.value = e.response?.data?.errors || {}
      throw e
    } finally {
      loading.value = false
    }
  }

  return {
    form,
    loading,
    errors,
    submitCreate,
    submitUpdate,
  }
}
