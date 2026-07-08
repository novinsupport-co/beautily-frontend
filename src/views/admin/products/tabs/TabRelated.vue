<template>
  <div class="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
    <div>
      <h3 class="text-xl font-iransans-bold text-slate-800 dark:text-slate-100">
        🔗 محصولات مرتبط
      </h3>
      <p class="text-sm text-slate-500 mt-1">
        محصولاتی که مایلید در صفحه این محصول به عنوان پیشنهاد نمایش داده شوند.
      </p>
    </div>

    <div class="relative group max-w-2xl mx-auto mb-10">
      <div
        class="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-[2rem] blur opacity-10 group-focus-within:opacity-25 transition duration-500"
      ></div>
      <div class="relative flex items-center">
        <div class="absolute right-5 flex items-center pointer-events-none">
          <svg
            class="w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-all"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
            />
          </svg>
        </div>
        <input
          v-model="searchQuery"
          class="w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-700 h-14 pr-14 pl-6 rounded-2xl outline-none focus:border-indigo-500 transition-all font-iransans placeholder:text-slate-400"
          placeholder="نام محصول را برای افزودن جستجو کنید..."
          @input="searchProducts"
        />
        <div v-if="isLoading" class="absolute left-4">
          <div
            class="w-5 h-5 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"
          ></div>
        </div>
      </div>

      <transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="transform scale-95 opacity-0"
        enter-to-class="transform scale-100 opacity-100"
      >
        <div
          v-if="searchResults.length > 0"
          class="absolute z-[100] w-full mt-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[2rem] shadow-2xl max-h-[380px] overflow-y-auto"
        >
          <div
            v-for="item in searchResults"
            :key="item.id"
            class="group/item flex items-center gap-4 p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer border-b last:border-0"
            @click="selectProduct(item)"
          >
            <img :src="getProductImage(item)" class="w-12 h-12 rounded-xl object-cover" />
            <div class="flex-1 text-right">
              <h5 class="text-sm font-iransans-bold text-slate-700 dark:text-slate-200">
                {{ item.name }}
              </h5>
              <p class="text-[10px] text-slate-400 mt-0.5">کد: {{ item.sku || '---' }}</p>
            </div>
            <span class="bg-indigo-600 text-white text-[10px] px-3 py-1.5 rounded-full"
              >+ افزودن</span
            >
          </div>
        </div>
      </transition>
    </div>

    <div class="grid gap-4">
      <div
        v-if="selectedProducts.length === 0"
        class="py-12 border-2 border-dashed border-slate-200 rounded-[2.5rem] text-center bg-slate-50/50"
      >
        <p class="text-slate-400 text-sm">محصولی انتخاب نشده است.</p>
      </div>

      <div
        v-for="(item, index) in selectedProducts"
        :key="item.id"
        class="flex items-center gap-4 bg-white dark:bg-slate-800 p-4 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm"
      >
        <div class="text-slate-300 px-2 cursor-move">⋮⋮</div>
        <img :src="getProductImage(item)" class="w-14 h-14 rounded-2xl object-cover bg-slate-50" />
        <div class="flex-1 text-right">
          <h5 class="font-iransans-bold text-slate-800 dark:text-white">{{ item.name }}</h5>
          <p class="text-[10px] text-slate-400">شناسه: {{ item.id }}</p>
        </div>
        <button
          class="w-10 h-10 flex items-center justify-center rounded-xl bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white transition-all"
          type="button"
          @click="removeProduct(index)"
        >
          ✕
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import axios from '@/lib/axios'

const props = defineProps({
  form: { type: Object, required: true },
})

const searchQuery = ref('')
const searchResults = ref([])
const selectedProducts = ref([])
const isLoading = ref(false)
let searchTimer = null

// اصلاح متد تصویر برای هماهنگی با ریسورس جدید
const getProductImage = (item) => {
  if (!item) return '/placeholder.png'
  // اولویت با آبجکت ریسورس لاراول، سپس داده‌های خام
  return item.thumbnail?.url || item.thumbnail?.urls?.thumb || '/placeholder.png'
}

/**
 * همگام‌سازی محصولات مرتبط هنگام باز شدن صفحه (در حالت ویرایش)
 * نکته: در ProductCreate.vue شما فیلدی به نام related_products ندارید،
 * اما ریسورس بک‌ند آن را می‌فرستد.
 */
onMounted(() => {
  // اگر در حالت ویرایش هستیم و بک‌ند لیست کامل را فرستاده است
  if (props.form.images) {
    // یک نشانه که دیتا از سرور آمده (ویرایش)
    // این بخش را با احتیاط هماهنگ کنید
  }
})

// واچر هوشمند برای مپ کردن داده‌های اولیه از بک‌ند به لیست نمایشی
watch(
  () => props.form.related_products,
  (newVal) => {
    if (newVal) {
      selectedProducts.value = [...newVal]
    }
  },
  { immediate: true },
)
// متد جستجو
const searchProducts = () => {
  clearTimeout(searchTimer)
  if (searchQuery.value.length < 2) {
    searchResults.value = []
    return
  }

  isLoading.value = true
  searchTimer = setTimeout(async () => {
    try {
      const res = await axios.get('/admin/products', {
        params: {
          search: searchQuery.value, // هماهنگ با متد index یا search بک‌ند شما
          exclude_id: props.form.id,
        },
      })
      // اگر بک‌ند ریسورس برمی‌گرداند، دیتا در res.data.data است
      searchResults.value = res.data.data || res.data
    } catch (err) {
      console.error('Search error:', err)
    } finally {
      isLoading.value = false
    }
  }, 500)
}

const selectProduct = (product) => {
  if (!props.form.related_ids.includes(product.id)) {
    props.form.related_ids.push(product.id)

    // اضافه کردن به لیست نمایشی
    selectedProducts.value.push({
      id: product.id,
      name: product.name,
      thumbnail: product.thumbnail, // ذخیره آبجکت تصویر برای نمایش در همین لحظه
    })

    // نکته مهم: اگر والد نیاز به لیست کامل آبجکت‌ها دارد (برای LivePreview)
    if (props.form.related_products) {
      props.form.related_products.push(product)
    }
  }
  searchQuery.value = ''
  searchResults.value = []
}

const removeProduct = (index) => {
  props.form.related_ids.splice(index, 1)
  selectedProducts.value.splice(index, 1)
}

/**
 * حیاتی: وقتی فرم اصلی از بک‌ند لود می‌شود (در حالت ویرایش)،
 * والد لیست related_ids را پر می‌کند اما selectedProducts خالی می‌ماند.
 * این واچر محصولات مرتبط اولیه را از فرم (که از بک‌ند آمده) به لیست نمایشی اضافه می‌کند.
 */
watch(
  () => props.form.related_products,
  (newVal) => {
    // هر بار که والد محصولات مرتبط را از سرور گرفت یا تغییر داد، لیست داخلی را آپدیت کن
    if (newVal && Array.isArray(newVal)) {
      selectedProducts.value = [...newVal]
    } else {
      selectedProducts.value = []
    }
  },
  { immediate: true, deep: true }, // اضافه کردن deep برای اطمینان از ردیابی تغییرات آبجکت
)
</script>
