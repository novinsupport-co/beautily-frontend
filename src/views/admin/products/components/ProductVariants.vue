<template>
  <div
    class="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-sm mt-8"
  >
    <h3
      class="font-iransans-bold text-lg mb-6 text-slate-800 dark:text-white flex items-center gap-2"
    >
      <div class="w-2 h-6 bg-indigo-600 rounded-full"></div>
      تنوع محصول و قیمت‌گذاری
    </h3>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
      <div class="space-y-2">
        <label class="text-xs font-bold text-slate-400 mr-2">انتخاب ویژگی (مثلاً رنگ)</label>
        <select v-model="selectedAttribute" class="input-fancy" @change="addAttributeToProduct">
          <option :value="null">انتخاب ویژگی...</option>
          <option v-for="attr in allAttributes" :key="attr.id" :value="attr">
            {{ attr.label }}
          </option>
        </select>
      </div>
    </div>

    <div class="flex flex-wrap gap-4 mb-8">
      <div
        v-for="(attr, index) in productAttributes"
        :key="index"
        class="bg-slate-50 dark:bg-slate-900 p-4 rounded-3xl border border-slate-100 relative w-full md:w-64"
      >
        <button
          class="absolute left-2 top-2 text-rose-500 hover:bg-rose-50 p-1 rounded-lg"
          @click="removeAttr(index)"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M6 18L18 6M6 6l12 12" stroke-width="2" />
          </svg>
        </button>
        <span class="text-xs font-bold text-indigo-600 block mb-3">{{ attr.label }}</span>

        <div class="flex flex-wrap gap-2">
          <label
            v-for="val in attr.values"
            :key="val.id"
            class="inline-flex items-center gap-1 bg-white px-2 py-1 rounded-lg border text-[10px] cursor-pointer hover:border-indigo-500"
          >
            <input
              v-model="selectedValues[attr.name]"
              :value="val.value"
              type="checkbox"
              @change="generateVariants"
            />
            {{ val.value }}
          </label>
        </div>
      </div>
    </div>

    <div v-if="variants.length > 0" class="overflow-x-auto">
      <table class="w-full text-sm text-right">
        <thead>
          <tr class="text-slate-400 border-b">
            <th class="pb-3 pr-4">ترکیب ویژگی‌ها</th>
            <th class="pb-3">SKU (کد انبار)</th>
            <th class="pb-3">قیمت (تومان)</th>
            <th class="pb-3">موجودی</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(v, idx) in variants"
            :key="idx"
            class="border-b last:border-0 hover:bg-slate-50/50"
          >
            <td class="py-4 pr-4">
              <span class="font-iransans-bold text-slate-700">
                {{ Object.values(v.variant_attributes).join(' / ') }}
              </span>
            </td>
            <td class="py-4">
              <input v-model="v.sku" class="input-table" placeholder="SKU-123" />
            </td>
            <td class="py-4"><input v-model="v.price" class="input-table w-32" type="number" /></td>
            <td class="py-4"><input v-model="v.stock" class="input-table w-20" type="number" /></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import axios from '@/lib/axios'

const allAttributes = ref([]) // کل ویژگی‌های تعریف شده در دیتابیس
const productAttributes = ref([]) // ویژگی‌هایی که برای این محصول انتخاب شده
const selectedValues = ref({}) // مقادیر تیک خورده
const variants = ref([]) // خروجی نهایی برای ارسال به دیتابیس

const fetchData = async () => {
  const res = await axios.get('/admin/attributes')
  allAttributes.value = res.data.data
}

const addAttributeToProduct = (e) => {
  const attr = allAttributes.value.find((a) => a.id == e.target.value.id)
  if (attr && !productAttributes.value.find((a) => a.id == attr.id)) {
    productAttributes.value.push(attr)
    selectedValues.value[attr.name] = []
  }
}

// تابع جادویی برای ساخت ترکیب (Cartesian Product)
const generateVariants = () => {
  const keys = Object.keys(selectedValues.value).filter((k) => selectedValues.value[k].length > 0)
  if (keys.length === 0) {
    variants.value = []
    return
  }

  let combinations = [{}]
  keys.forEach((key) => {
    const nextCombos = []
    selectedValues.value[key].forEach((val) => {
      combinations.forEach((combo) => {
        nextCombos.push({ ...combo, [key]: val })
      })
    })
    combinations = nextCombos
  })

  variants.value = combinations.map((c) => ({
    variant_attributes: c,
    sku: '',
    price: 0,
    stock: 0,
  }))
}
// اضافه کردن این بخش به انتهای اسکریپت کامپوننت
const emit = defineEmits(['update:modelValue'])

watch(
  variants,
  (newVal) => {
    emit('update:modelValue', newVal)
  },
  { deep: true },
)

onMounted(fetchData)
</script>

<style scoped>
.input-fancy {
  @apply w-full border border-slate-100 rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-slate-50/50;
}
.input-table {
  @apply bg-white border border-slate-100 rounded-xl px-3 py-2 text-xs outline-none focus:border-indigo-500;
}
</style>
