<template>
  <div
    class="h-[calc(100vh-2rem)] flex flex-col font-iransans overflow-hidden text-right"
    dir="rtl"
  >
    <div
      class="flex-shrink-0 flex flex-col md:flex-row md:items-center justify-between bg-white dark:bg-slate-800 p-6 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-700 gap-4 mb-6"
    >
      <div>
        <h2 class="text-2xl font-iransans-bold text-slate-800 dark:text-white">مدیریت ویژگی‌ها</h2>
        <p class="text-slate-400 text-sm mt-1">تعریف متغیرهایی مثل رنگ، سایز، حجم و مشخصات فنی</p>
      </div>
      <button
        class="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-iransans-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 flex items-center justify-center gap-2"
        @click="resetForm"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            d="M12 4v16m8-8H4"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
          />
        </svg>
        افزودن ویژگی جدید
      </button>
    </div>

    <div class="flex-1 grid lg:grid-cols-3 gap-8 min-h-0">
      <div class="lg:col-span-2 overflow-y-auto pr-2 custom-scrollbar pb-10">
        <div v-if="attributes.length === 0" class="empty-state">هنوز هیچ ویژگی تعریف نشده است.</div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            v-for="attr in attributes"
            :key="attr.id"
            class="bg-white dark:bg-slate-800 p-5 rounded-[2rem] border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-all group relative"
          >
            <div class="flex justify-between items-start mb-4">
              <div>
                <h3 class="font-iransans-bold text-slate-700 dark:text-white text-lg">
                  {{ attr.label }}
                </h3>
                <span class="text-[10px] text-slate-400 font-mono tracking-wider"
                  >کد فنی: {{ attr.name }}</span
                >
              </div>
              <div class="flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                <button
                  class="p-2 text-indigo-500 hover:bg-indigo-50 dark:hover:bg-slate-700 rounded-xl transition-colors"
                  @click="editItem(attr)"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2.828 2.828 0 114 4L11.828 15H9v-2.828l8.586-8.586z"
                      stroke-width="2"
                    />
                  </svg>
                </button>
                <button
                  class="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-slate-700 rounded-xl transition-colors"
                  @click="deleteItem(attr.id)"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      stroke-width="2"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <div class="flex flex-wrap gap-2">
              <div
                v-for="val in attr.values"
                :key="val.id"
                class="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-xl text-xs text-slate-600 dark:text-slate-300"
              >
                <span
                  v-if="val.color_code"
                  :style="{ backgroundColor: val.color_code }"
                  class="w-3 h-3 rounded-full border border-black/10"
                ></span>
                {{ val.value }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="lg:col-span-1 h-full">
        <div
          class="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-sm h-full flex flex-col overflow-hidden"
        >
          <h3
            class="font-iransans-bold text-lg mb-6 text-slate-800 dark:text-white flex items-center gap-2"
          >
            <span
              :class="isEdit ? 'bg-orange-500' : 'bg-green-500'"
              class="w-2 h-2 rounded-full animate-pulse"
            ></span>
            {{ isEdit ? 'ویرایش ویژگی: ' + form.label : 'تعریف ویژگی جدید' }}
          </h3>

          <div class="flex-1 overflow-y-auto custom-scrollbar pr-1 space-y-5">
            <div class="space-y-1">
              <label class="text-xs font-bold text-slate-400 mr-2"
                >نام فنی (انگلیسی - برای سیستم)</label
              >
              <input
                v-model="form.name"
                class="input-fancy font-mono"
                placeholder="e.g. color, size, volume"
              />
            </div>

            <div class="space-y-1">
              <label class="text-xs font-bold text-slate-400 mr-2"
                >عنوان نمایشی (فارسی - برای کاربر)</label
              >
              <input v-model="form.label" class="input-fancy" placeholder="مثلاً: انتخاب رنگ" />
            </div>

            <hr class="border-slate-50 dark:border-slate-700 my-4" />

            <div class="space-y-3">
              <div class="flex items-center justify-between mr-2">
                <label class="text-xs font-bold text-slate-400">مقادیر ویژگی</label>
                <button
                  class="text-indigo-600 text-xs font-iransans-bold hover:underline"
                  @click="addValue"
                >
                  + افزودن سطر
                </button>
              </div>

              <div
                v-for="(val, index) in form.values"
                :key="index"
                class="flex gap-2 group/row items-center bg-slate-50/50 dark:bg-slate-900/50 p-2 rounded-2xl border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all"
              >
                <input
                  v-model="form.values[index].value"
                  class="flex-1 bg-transparent border-none outline-none text-sm px-2"
                  placeholder="مقدار (مثلاً قرمز)"
                />

                <input
                  v-model="form.values[index].color_code"
                  class="w-6 h-6 rounded-lg cursor-pointer border-none bg-transparent"
                  type="color"
                />

                <button
                  class="text-slate-300 hover:text-rose-500 transition-colors p-1"
                  @click="removeValue(index)"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M6 18L18 6M6 6l12 12" stroke-width="2" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <div class="pt-6 space-y-3 mt-auto">
            <button
              :disabled="loading"
              class="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-2xl font-iransans-bold shadow-lg shadow-indigo-100 transition-all flex items-center justify-center gap-2"
              @click="saveAttribute"
            >
              <span
                v-if="loading"
                class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"
              ></span>
              {{ isEdit ? 'بروزرسانی ویژگی' : 'ثبت در سیستم' }}
            </button>
            <button
              v-if="isEdit"
              class="w-full text-slate-400 text-sm py-2 hover:text-slate-600"
              @click="resetForm"
            >
              انصراف
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {onMounted, ref} from 'vue'
import axios from '@/lib/axios'
import {useNotificationStore} from '@/stores/notification'

const attributes = ref([])
const loading = ref(false)
const isEdit = ref(false)
const notify = useNotificationStore()

const form = ref({
  id: null,
  name: '',
  label: '',
  values: [{ value: '', color_code: '#ffffff' }],
})

const fetchData = async () => {
  try {
    const res = await axios.get('/admin/attributes')
    attributes.value = res.data.data
  } catch (e) {
    notify.error('خطا در دریافت لیست ویژگی‌ها')
  }
}

const addValue = () => form.value.values.push({ value: '', color_code: '#ffffff' })
const removeValue = (index) => {
  if (form.value.values.length > 1) form.value.values.splice(index, 1)
}

const saveAttribute = async () => {
  if (!form.value.name || !form.value.label) {
    notify.error('لطفاً نام و عنوان ویژگی را وارد کنید')
    return
  }

  loading.value = true
  try {
    const url = isEdit.value ? `/admin/attributes/${form.value.id}` : '/admin/attributes'
    const method = isEdit.value ? 'put' : 'post'
    await axios[method](url, form.value)
    notify.success('ویژگی با موفقیت ذخیره شد')
    resetForm()
    fetchData()
  } catch (e) {
    notify.error(e.response?.data?.message || 'خطا در عملیات')
  } finally {
    loading.value = false
  }
}

const editItem = (item) => {
  isEdit.value = true
  form.value = {
    id: item.id,
    name: item.name,
    label: item.label,
    values: item.values.map((v) => ({ value: v.value, color_code: v.color_code || '#ffffff' })),
  }
}

const deleteItem = async (id) => {
  if (!confirm('آیا از حذف این ویژگی و تمام مقادیر آن اطمینان دارید؟')) return
  try {
    await axios.delete(`/admin/attributes/${id}`)
    notify.success('ویژگی حذف شد')
    fetchData()
  } catch (e) {
    notify.error('خطا در حذف')
  }
}

const resetForm = () => {
  form.value = { id: null, name: '', label: '', values: [{ value: '', color_code: '#ffffff' }] }
  isEdit.value = false
}

onMounted(fetchData)
</script>

<style scoped>
.input-fancy {
  @apply w-full border border-slate-100 dark:border-slate-700 rounded-2xl px-4 py-3.5 focus:ring-2 focus:ring-indigo-500 outline-none transition-all bg-slate-50/50 dark:bg-slate-900 text-sm;
}
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  @apply bg-slate-200 rounded-full;
}
.empty-state {
  @apply text-center p-12 bg-white dark:bg-slate-800 rounded-[2rem] border-2 border-dashed border-slate-100 dark:border-slate-700 text-slate-400 col-span-full;
}
</style>
