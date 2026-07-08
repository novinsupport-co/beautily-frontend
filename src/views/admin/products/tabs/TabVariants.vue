<template>
  <div class="space-y-6">
    <!-- بخش انتخاب ویژگی‌ها -->
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <h4 class="text-lg font-iransans-bold text-slate-700 dark:text-slate-200">
          ویژگی‌های تنوع محصول
        </h4>
        <select class="input-fancy-v max-w-xs" @change="addAttributeToProduct">
          <option value="">➕ افزودن ویژگی جدید به این محصول...</option>
          <option v-for="attr in allAttributes" :key="attr.id" :value="JSON.stringify(attr)">
            {{ attr.label }} ({{ attr.name }})
          </option>
        </select>
      </div>

      <!-- نمایش ویژگی‌های انتخاب شده و مقادیر آن‌ها -->
      <div v-if="productAttributes.length > 0" class="flex flex-wrap gap-4">
        <div
          v-for="(attr, index) in productAttributes"
          :key="index"
          class="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl shadow border border-slate-100 dark:border-slate-700 flex flex-col gap-3 w-full md:w-[calc(50%-1rem)] lg:w-[calc(33%-1rem)]"
        >
          <div class="flex items-center justify-between">
            <button
              class="text-xs text-rose-500 hover:text-rose-600 dark:hover:text-rose-400 hover:underline flex items-center gap-1 transition-colors"
              @click="removeAttr(index)"
            >
              <svg
                class="w-4 h-4"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                viewBox="0 0 24 24"
              >
                <path
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              حذف ویژگی
            </button>
            <span class="font-iransans-bold text-sm text-slate-800 dark:text-slate-200">
              {{ attr.label }}
            </span>
          </div>

          <div class="flex flex-wrap gap-3 mt-2">
            <label
              v-for="val in attr.values"
              :key="val.id"
              class="flex items-center gap-2 text-sm cursor-pointer bg-white dark:bg-slate-700 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-600 hover:border-brand-500 transition-colors"
            >
              <input
                v-model="selectedValues[attr.name]"
                :value="val.value"
                class="rounded border-slate-300 text-brand-500 focus:ring-brand-500"
                type="checkbox"
                @change="generateVariants"
              />
              <!-- نمایش دایره رنگ در صورت وجود color_code -->
              <span
                v-if="val.color_code"
                :style="{ backgroundColor: val.color_code }"
                class="w-3 h-3 rounded-full border border-slate-300 block shadow-sm"
              ></span>
              <span class="text-slate-600 dark:text-slate-300">{{ val.value }}</span>
            </label>
          </div>
        </div>
      </div>
    </div>

    <!-- بخش مدیریت تنوع‌های تولید شده -->
    <div
      v-if="props.form.variants && props.form.variants.length > 0"
      class="space-y-4 pt-6 border-t border-slate-200 dark:border-slate-700"
    >
      <div class="flex items-center justify-between">
        <h4 class="text-lg font-iransans-bold text-slate-700 dark:text-slate-200">
          مدیریت تنوع‌ها ({{ props.form.variants.length }} مورد)
        </h4>
        <button
          class="bg-rose-50 text-rose-600 hover:bg-rose-100 dark:bg-rose-500/10 dark:hover:bg-rose-500/20 text-sm px-4 py-2 rounded-lg transition-colors"
          @click.prevent="clearVariants"
        >
          پاکسازی همه تنوع‌ها
        </button>
      </div>

      <!-- هشدار عدم تطابق موجودی -->
      <div
        v-if="isStockMismatch"
        class="p-4 mb-4 text-sm text-rose-700 bg-rose-50 rounded-xl border border-rose-200 flex items-center gap-2"
      >
        <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
          />
        </svg>
        <div>
          <strong class="font-iransans-bold">خطا در توزیع موجودی:</strong>
          مجموع موجودی تنوع‌ها ({{ totalVariantsStock }}) با موجودی کل محصول ({{
            props.form.stock_quantity || 0
          }}) برابر نیست. لطفاً مقادیر را اصلاح کنید.
        </div>
      </div>

      <div class="grid gap-4">
        <div
          v-for="(v, idx) in props.form.variants"
          :key="idx"
          class="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-all"
        >
          <!-- بخش بالا: ویژگی‌های این تنوع -->
          <div
            class="mb-4 pb-4 border-b border-slate-100 dark:border-slate-700 flex items-center gap-2"
          >
            <span class="text-xs text-slate-500 dark:text-slate-400">ترکیب:</span>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="(val, key) in v.variant_attributes"
                :key="key"
                class="bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-300 border border-brand-200 dark:border-brand-500/20 px-3 py-1 rounded-lg text-xs font-iransans-bold"
              >
                {{ val }}
              </span>
            </div>
          </div>

          <!-- بخش پایین: فرمت شبکه‌ای مقادیر -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 items-start">
            <!-- SKU -->
            <div class="space-y-1.5">
              <label class="text-[11px] font-iransans-bold text-slate-500 dark:text-slate-400"
                >کد تنوع (SKU)</label
              >
              <input
                v-model="v.sku"
                class="input-fancy-v ltr-input !py-2.5 text-sm w-full"
                dir="ltr"
                placeholder="مثال: PRD-RED"
                type="text"
              />
            </div>

            <!-- قیمت اصلی -->
            <div class="space-y-1.5">
              <label class="text-[11px] font-iransans-bold text-slate-500 dark:text-slate-400"
                >قیمت اصلی (تومان)</label
              >
              <input
                :value="formatDisplayPrice(v.price)"
                class="input-fancy-v ltr-input !py-2.5 font-mono w-full"
                dir="ltr"
                placeholder="0"
                type="text"
                @input="updateVariantPrice(idx, $event)"
              />
            </div>

            <!-- قیمت با تخفیف -->
            <div class="space-y-1.5">
              <label class="text-[11px] font-iransans-bold text-slate-500 dark:text-slate-400"
                >قیمت با تخفیف (تومان)</label
              >
              <input
                :value="formatDisplayPrice(v.discount_price)"
                class="input-fancy-v ltr-input !py-2.5 font-mono w-full"
                dir="ltr"
                placeholder="بدون تخفیف"
                type="text"
                @input="updateVariantDiscountPrice(idx, $event)"
              />
            </div>

            <!-- موجودی انبار -->
            <div class="space-y-1.5">
              <label class="text-[11px] font-iransans-bold text-slate-500 dark:text-slate-400"
                >موجودی در انبار</label
              >
              <input
                v-model.number="v.stock"
                class="input-fancy-v ltr-input !py-2.5 font-mono text-center w-full"
                dir="ltr"
                min="0"
                placeholder="0"
                type="number"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- راهنمای خالی بودن لیست تنوع‌ها -->
    <div
      v-else
      class="text-center py-10 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-dashed border-slate-300 dark:border-slate-700"
    >
      <p class="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
        هنوز هیچ تنوعی برای این محصول ایجاد نشده است.<br />
        با انتخاب ویژگی‌ها از منوی بالا، تنوع‌ها به صورت خودکار ساخته می‌شوند.
      </p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, reactive, ref, watch } from 'vue'
import axios from '@/lib/axios'

const props = defineProps({
  form: { type: Object, required: true },
})

// --- State Management ---
const allAttributes = ref<any[]>([])
const productAttributes = ref<any[]>([])
const selectedValues = reactive<any>({})

// --- Lifecycle Hooks ---
onMounted(() => {
  fetchAttributes()
})

// --- Functions ---
const fetchAttributes = async () => {
  try {
    const res = await axios.get('/admin/attributes')
    allAttributes.value = res.data.data
    restoreExistingVariants()
  } catch (e) {
    console.error('خطا در دریافت لیست ویژگی‌ها:', e)
  }
}

const addAttributeToProduct = (e: Event) => {
  const target = e.target as HTMLSelectElement
  if (!target.value) return
  const attr = JSON.parse(target.value)

  if (!productAttributes.value.find((a) => a.id === attr.id)) {
    productAttributes.value.push(attr)
    selectedValues[attr.name] = []
  }
  target.value = ''
}

const removeAttr = (index: number) => {
  const attr = productAttributes.value[index]
  delete selectedValues[attr.name]
  productAttributes.value.splice(index, 1)
  generateVariants()
}

const generateVariants = () => {
  const keys = Object.keys(selectedValues).filter((k) => selectedValues[k].length > 0)
  if (keys.length === 0) {
    props.form.variants = []
    return
  }

  let combinations: any[] = [{}]
  keys.forEach((key) => {
    const nextCombos: any[] = []
    selectedValues[key].forEach((val: any) => {
      combinations.forEach((combo) => {
        nextCombos.push({ ...combo, [key]: val })
      })
    })
    combinations = nextCombos
  })

  const newVariants = combinations.map((c) => {
    const existing = props.form.variants?.find(
      (v: any) => JSON.stringify(v.variant_attributes) === JSON.stringify(c),
    )

    if (existing) return existing

    // منطق تولید قیمت تنوع جدید:
    // اعمال درصدیِ قیمت محصول اصلی روی تنوع جدید
    const baseVariantPrice = sanitizeNumber(props.form.base_price) || 0
    let discountVariantPrice = sanitizeNumber(props.form.discount_price) || 0

    const percent = mainDiscountPercentage.value
    if (percent > 0) {
      discountVariantPrice = Math.round(baseVariantPrice * (1 - percent))
    }

    return {
      variant_attributes: c,
      sku: existing?.sku || '',
      price: baseVariantPrice,
      discount_price: discountVariantPrice,
      stock: existing?.stock || 0,
    }
  })

  props.form.variants = newVariants
}

const restoreExistingVariants = () => {
  if (props.form.variants && props.form.variants.length > 0) {
    const firstVariantAttributes = props.form.variants[0]?.variant_attributes
    if (!firstVariantAttributes) return

    const keys = Object.keys(firstVariantAttributes)

    keys.forEach((key) => {
      const attr = allAttributes.value.find((a) => a.name === key)
      if (attr && !productAttributes.value.find((a) => a.id === attr.id)) {
        productAttributes.value.push(attr)
        selectedValues[key] = [
          ...new Set(props.form.variants.map((v: any) => v.variant_attributes[key])),
        ]
      }
    })
  }
}

const clearVariants = () => {
  if (confirm('آیا مطمئن هستید که می‌خواهید تمام تنوع‌ها را پاک کنید؟')) {
    props.form.variants = []
    Object.keys(selectedValues).forEach((key) => {
      selectedValues[key] = []
    })
  }
}

// --- Formatting and Parsing ---

const sanitizeNumber = (value: string | number | null | undefined): number => {
  if (value === null || value === undefined) return 0

  let stringValue = String(value)

  if (stringValue.includes('.')) {
    stringValue = stringValue.split('.')[0]
  }

  stringValue = stringValue.replace(/[۰-۹]/g, (w) => String.fromCharCode(w.charCodeAt(0) - 1728))
  stringValue = stringValue.replace(/[٠-٩]/g, (w) => String.fromCharCode(w.charCodeAt(0) - 1584))

  const cleaned = stringValue.replace(/[^0-9]/g, '')

  if (cleaned === '') return 0
  return parseInt(cleaned, 10)
}

const formatDisplayPrice = (price: number | string | null | undefined): string => {
  const numericPrice = sanitizeNumber(price)
  if (numericPrice === 0) return ''
  return numericPrice.toLocaleString('en-US')
}

// آپدیت دستی قیمت‌ها (در صورت تغییر دستی در فیلدهای تنوع)
const updateVariantPrice = (idx: number, event: Event) => {
  const target = event.target as HTMLInputElement
  if (!target) return

  const numericValue = sanitizeNumber(target.value)
  props.form.variants[idx].price = numericValue

  const percent = mainDiscountPercentage.value
  if (percent > 0) {
    props.form.variants[idx].discount_price = Math.round(numericValue * (1 - percent))
  }

  target.value = formatDisplayPrice(numericValue)
}

const updateVariantDiscountPrice = (idx: number, event: Event) => {
  const target = event.target as HTMLInputElement
  if (!target) return

  const numericValue = sanitizeNumber(target.value)
  props.form.variants[idx].discount_price = numericValue
  target.value = formatDisplayPrice(numericValue)
}

// --- Computed Properties ---

// محاسبه زندهِ درصدِ تخفیفِ فرم اصلی
const mainDiscountPercentage = computed(() => {
  const bp = sanitizeNumber(props.form.base_price)
  const dp = sanitizeNumber(props.form.discount_price)
  if (bp > 0 && dp > 0 && dp < bp) {
    return (bp - dp) / bp
  }
  return 0
})

const totalVariantsStock = computed(() => {
  if (!props.form.variants || props.form.variants.length === 0) return 0
  return props.form.variants.reduce((sum: number, v: any) => sum + (Number(v.stock) || 0), 0)
})

const isStockMismatch = computed(() => {
  if (!props.form.variants || props.form.variants.length === 0) return false
  const formStock = Number(props.form.stock_quantity) || 0
  return totalVariantsStock.value !== formStock
})

// --- Watchers ---

// با این ناظر، هر تغییری در تخفیف تب اصلی، بلافاصله روی تمام تنوع‌ها اعمال می‌شود
watch(
  () => [props.form.base_price, props.form.discount_price],
  ([newBase, newDiscount]) => {
    if (!props.form.variants || props.form.variants.length === 0) return

    const percent = mainDiscountPercentage.value

    props.form.variants.forEach((v: any) => {
      const vPrice = sanitizeNumber(v.price)

      if (percent > 0) {
        // اگر درصد تخفیف داریم، همان درصد را روی قیمت تنوع اعمال کن
        v.discount_price = Math.round(vPrice * (1 - percent))
      } else if (sanitizeNumber(newDiscount) === 0) {
        // اگر تخفیف فرم اصلی صفر/حذف شد، تخفیف تنوع‌ها نیز صفر شود
        v.discount_price = 0
      }
    })
  },
  { deep: true },
)
</script>
