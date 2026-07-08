import axiosInstance from '@/lib/axios'

// تعریف ساختار واریانت‌ها بر اساس خروجی ProductResource
export interface VariantAPI {
  id: number
  variant_attributes: Record<string, string | number>
  price: number
  stock: number
  sku?: string | null
}

export interface ProductAPI {
  id: number
  name: string
  slug: string
  sku?: string | null

  rating?: number
  reviews_count?: number
  questions_count?: number

  prices?: {
    base: number
    discount?: number | null
    final: number
  }

  stock?: {
    quantity: number
    unit?: string | null
  }

  status?: {
    is_active: boolean
    call_for_price: boolean
  }

  primary_category?: { id: number; name: string; slug?: string } | null
  categories?: { id: number; name: string; slug?: string }[]
  brand?: { id: number; name: string; slug: string; logo_url?: string | null } | null
  tags?: { id: number; name: string; slug: string; description?: string | null }[]

  image?: string | null
  thumbnail?: {
    url?: string
    urls?: {
      large?: string
      thumb?: string
    }
  }
  images?: {
    thumbnail?: {
      url?: string
      urls?: {
        thumb?: string
        medium?: string
        large?: string
        webp?: string
      }
    } | null
    gallery?: any[]
  }
  short_description?: string | null
  description?: string | null
  category?: { id: number; name: string; slug?: string } | null

  specifications?: {
    key: string
    value: string
  }[]

  variants?: VariantAPI[]
}

/**
 * دریافت لیست محصولات (پشتیبانی از پارامترهای جستجوی پیشرفته مانند فیلتر قیمت، برند، دسته و...)
 */
export const getProductsApi = (params?: Record<string, any>) =>
  axiosInstance.get('/products', { params })

/**
 * (جدید) دریافت اطلاعات مورد نیاز برای سایدبار فیلترها (لیست دسته‌ها، برندها و غیره)
 * در صورت نیاز می‌توانید یک روت متناظر در لاراول برای این بسازید.
 */
export const getFiltersDataApi = async () => {
  const response = await axiosInstance.get('/filters-data')
  return response.data.data // برگرداندن {categories, brands, tags}
}

export const getProductDetailsApi = (slugOrId: string | number) =>
  axiosInstance.get(`/products/${slugOrId}`)

/**
 * افزودن یا حذف محصول از علاقه‌مندی‌ها
 * @param productId آیدی محصول
 */
export const toggleFavorite = async (productId: number) => {
  // دقت کنید که پیشوند /api/v1/ در تنظیمات اصلی اکسیوس شما ست شده باشد
  const response = await axiosInstance.post(`/favorites/toggle/${productId}`)
  return response.data // { message: string, is_favorited: boolean }
}

/**
 * دریافت لیست محصولات علاقه‌مندی کاربر (با صفحه‌بندی)
 */
export const getUserFavorites = async (page: number = 1) => {
  const response = await axiosInstance.get(`/favorites/user?page=${page}`)
  return response.data
}

// دریافت لیست علاقه‌مندی‌های کاربر لاگین شده (بدون پارامتر صفحه)
export const getUserFavoritesApi = () => {
  // مسیر را مطابق Route::prefix('favorites')->group(...) تنظیم کردیم
  return axiosInstance.get('/favorites/user')
}

// حذف یک محصول از علاقه‌مندی‌ها
// چون بک‌اند از متد toggle (POST) استفاده می‌کند، یک تابع برای هر دو کار (حذف/افزودن) کافیست
export const toggleFavoriteApi = (productId: number) => {
  return axiosInstance.post(`/favorites/toggle/${productId}`)
}
