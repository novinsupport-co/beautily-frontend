<template>
  <div class="hidden lg:block">
    <div class="sticky top-10 space-y-6">
      <div class="flex items-center gap-2 mb-4">
        <span class="relative flex h-3 w-3">
          <span
            class="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"
          ></span>
          <span class="relative inline-flex rounded-full h-3 w-3 bg-pink-500"></span>
        </span>
        <h3 class="text-lg font-iransans-bold text-slate-700 dark:text-slate-300">
          پیش‌نمایش زنده کارت
        </h3>
      </div>

      <div
        class="bg-white dark:bg-slate-800 rounded-[2.5rem] overflow-hidden shadow-2xl border border-slate-100 dark:border-slate-700 group"
      >
        <div class="relative aspect-square bg-slate-100 dark:bg-slate-900 overflow-hidden">
          <img
            v-if="displayImage"
            :src="displayImage"
            class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div
            v-else
            class="flex items-center justify-center h-full text-slate-300 font-iransans-light text-sm italic"
          >
            تصویری انتخاب نشده
          </div>

          <div
            v-if="!form.call_for_price && hasDiscount"
            class="absolute top-5 right-5 bg-pink-500 text-white px-3 py-1.5 rounded-2xl text-xs font-iransans-bold shadow-xl animate-pulse z-10"
          >
            {{ discountPercent }}% تخفیف
          </div>

          <div
            v-if="!form.is_active"
            class="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] flex items-center justify-center"
          >
            <span
              class="bg-white/90 text-slate-800 px-4 py-1 rounded-full text-xs font-iransans-bold"
              >غیرفعال در سایت</span
            >
          </div>
        </div>

        <div class="p-8 space-y-4 text-right" dir="rtl">
          <h4 class="text-xl font-iransans-bold text-slate-800 dark:text-white truncate">
            {{ form.name || 'نام محصول شما' }}
          </h4>

          <div class="flex flex-wrap gap-1 justify-start">
            <span
              v-for="id in form.category_ids.slice(0, 2)"
              :key="id"
              class="text-[10px] bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-lg text-slate-500"
            >
              {{ getCategoryName(id) }}
            </span>
          </div>

          <div
            class="pt-6 border-t border-slate-50 dark:border-slate-700 flex justify-between items-center"
          >
            <div class="flex flex-col items-start text-left" dir="ltr">
              <template v-if="form.call_for_price">
                <span class="text-xl font-iransans-bold text-amber-600">تماس بگیرید</span>
                <span class="text-[10px] text-slate-400 font-iransans-light">Price on Request</span>
              </template>

              <template v-else>
                <span
                  v-if="hasDiscount"
                  class="text-sm text-slate-300 line-through decoration-pink-500/40"
                >
                  {{ formatPrice(form.base_price) }}
                </span>
                <span
                  class="text-2xl font-iransans-bold text-slate-900 dark:text-white flex items-center gap-1"
                >
                  {{ formatPrice(form.discount_price || form.base_price) }}
                  <span class="text-xs text-slate-400 font-iransans-light">تومان</span>
                </span>
              </template>
            </div>

            <div
              :class="
                form.is_active
                  ? 'bg-pink-500 shadow-pink-200 cursor-pointer'
                  : 'bg-slate-300 shadow-none cursor-not-allowed'
              "
              class="w-12 h-12 rounded-2xl text-white flex items-center justify-center shadow-lg transition-all active:scale-90"
            >
              <span v-if="form.call_for_price">📞</span>
              <span v-else>🛒</span>
            </div>
          </div>
        </div>
      </div>

      <div
        class="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-3xl border border-amber-100 dark:border-amber-900/30"
      >
        <p
          class="text-[11px] text-amber-700 dark:text-amber-400 text-center font-iransans-medium leading-relaxed italic"
        >
          تغییرات شما در لحظه در این کارت اعمال می‌شود.
          <span v-if="form.call_for_price" class="block mt-1 font-iransans-bold text-amber-600"
            >⚠️ قیمت‌ها در حالت توافقی نمایش داده نمی‌شوند.</span
          >
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

const props = defineProps({
  form: { type: Object, required: true },
  allCategories: { type: Array, default: () => [] },
})

// تابع فرمت قیمت
const formatPrice = (value: any) => {
  const val = parseInt(value)
  if (!val || val === 0) return '۰'
  return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

// چک کردن وجود تخفیف
const hasDiscount = computed(() => {
  const base = parseFloat(props.form.base_price) || 0
  const discount = parseFloat(props.form.discount_price) || 0
  return discount > 0 && base > discount
})

// محاسبه درصد تخفیف
const discountPercent = computed(() => {
  const base = parseFloat(props.form.base_price) || 0
  const discount = parseFloat(props.form.discount_price) || 0
  if (base > 0 && discount > 0) {
    return Math.round(100 - (discount * 100) / base)
  }
  return 0
})

// پیدا کردن نام دسته‌بندی
const getCategoryName = (id: number) => {
  const cat = (props.allCategories as any[])?.find((c: any) => c.id === id)
  return cat ? cat.name : 'دسته بندی'
}

// محاسبه آدرس تصویر
// در بخش computed فایل LivePreview.vue
const displayImage = computed(() => {
  // ۱. اگر تصویر جدیدی انتخاب شده (در حالت ثبت یا ویرایش)
  if (props.form.new_thumbnail instanceof File) {
    return URL.createObjectURL(props.form.new_thumbnail)
  }
  // ۲. اگر از قبل آدرس پیش‌نمایش مستقیم داریم
  if (props.form.preview_url) return props.form.preview_url

  // ۳. اگر تصویر از دیتابیس آمده (حالت ویرایش)
  if (props.form.images?.thumbnail?.urls?.medium) {
    return props.form.images.thumbnail.urls.medium
  }
  return null
})
</script>
