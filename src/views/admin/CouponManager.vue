<template>
  <div class="p-6 md:p-10 space-y-8 animate-in fade-in duration-700 font-iransans">
    <div
      class="flex flex-col md:flex-row justify-between items-center gap-4 bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] shadow-sm border border-slate-50 dark:border-slate-800"
    >
      <div>
        <h1
          class="text-3xl font-iransans-bold text-slate-800 dark:text-white flex items-center gap-3"
        >
          <span class="bg-indigo-100 dark:bg-indigo-900/50 p-2 rounded-2xl text-2xl">🎟️</span>
          مدیریت کدهای تخفیف
        </h1>
        <p class="text-slate-500 text-sm mt-2 mr-12">ساخت و مانیتورینگ کمپین‌های تخفیفی</p>
      </div>
      <button
        class="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-2xl font-iransans-bold shadow-lg shadow-indigo-200 dark:shadow-none transition-all hover:scale-105 flex items-center gap-2 group"
        @click="openModal()"
      >
        <svg
          class="w-5 h-5 group-hover:rotate-90 transition-transform"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 4v16m8-8H4" stroke-linecap="round" stroke-width="2.5" />
        </svg>
        کد تخفیف جدید
      </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <div
        v-for="coupon in coupons"
        :key="coupon.id"
        class="ticket-card bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 p-6 relative group hover:border-indigo-300 transition-all duration-500"
      >
        <div
          class="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-[#f8fafc] dark:bg-slate-950 rounded-full border-l border-slate-100 dark:border-slate-800"
        ></div>
        <div
          class="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-[#f8fafc] dark:bg-slate-950 rounded-full border-r border-slate-100 dark:border-slate-800"
        ></div>

        <div class="flex justify-between items-start mb-8">
          <div
            class="cursor-pointer bg-slate-50 dark:bg-slate-800/50 border-2 border-dashed border-slate-200 dark:border-slate-700 px-5 py-2 rounded-2xl group/code relative hover:border-indigo-400 transition-colors"
            @click="copyToClipboard(coupon)"
          >
            <span
              class="text-indigo-600 dark:text-indigo-400 font-mono font-bold text-xl tracking-wider"
            >
              {{ coupon.code }}
            </span>

            <transition name="fade-up">
              <div
                v-if="copiedId === coupon.id"
                class="absolute inset-0 bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-iransans-bold text-sm z-10"
              >
                کپی شد
              </div>
            </transition>

            <div
              v-if="copiedId !== coupon.id"
              class="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] px-3 py-1.5 rounded-xl opacity-0 group-hover/code:opacity-100 transition-all shadow-xl whitespace-nowrap"
            >
              کلیک برای کپی 📋
            </div>
          </div>

          <div class="flex gap-1">
            <button
              class="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-xl transition-all"
              @click="openModal(coupon)"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                  stroke-width="2"
                />
              </svg>
            </button>
            <button
              class="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-xl transition-all"
              @click="deleteCoupon(coupon.id)"
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

        <div class="space-y-4">
          <div class="flex justify-between items-end">
            <div>
              <p class="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-1">
                میزان تخفیف
              </p>
              <span class="text-2xl font-iransans-bold text-slate-800 dark:text-white">
                {{ coupon.type === 'percent' ? coupon.value + '%' : formatPrice(coupon.value) }}
                <small v-if="coupon.type === 'fixed'" class="text-xs mr-1">تومان</small>
              </span>
            </div>
            <div class="text-left">
              <span
                :class="
                  coupon.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                "
                class="px-3 py-1 rounded-lg text-[10px] font-bold"
              >
                {{ coupon.is_active ? 'فعال' : 'غیرفعال' }}
              </span>
            </div>
          </div>

          <div class="pt-4 border-t border-slate-50 dark:border-slate-800">
            <div class="flex justify-between text-[10px] mb-2">
              <span class="text-slate-400 italic font-mono"
                >📅 {{ coupon.expires_at_fa || 'بدون تاریخ' }}</span
              >
              <span class="text-slate-500 font-bold"
                >{{ coupon.used_count }} / {{ coupon.usage_limit || '∞' }}</span
              >
            </div>
            <div class="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div
                :style="{ width: (coupon.used_count / (coupon.usage_limit || 1)) * 100 + '%' }"
                class="bg-indigo-500 h-full shadow-[0_0_8px_rgba(79,70,229,0.5)] transition-all duration-1000"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="isModalOpen"
      class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md"
    >
      <div
        class="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-[2.5rem] p-10 shadow-2xl animate-in zoom-in duration-300 relative overflow-visible"
      >
        <button
          class="absolute top-6 left-6 text-slate-400 hover:text-slate-800 transition-colors"
          @click="isModalOpen = false"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M6 18L18 6M6 6l12 12" stroke-width="2" />
          </svg>
        </button>

        <h2
          class="text-2xl font-iransans-bold mb-10 text-slate-800 dark:text-white flex items-center gap-3"
        >
          <span class="w-2 h-8 bg-indigo-600 rounded-full"></span>
          {{ editingId ? 'ویرایش اطلاعات کوپن' : 'تعریف کوپن تخفیف جدید' }}
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div class="space-y-2">
            <label class="label-fancy">کد اختصاصی</label>
            <input v-model="form.code" class="input-fancy" placeholder="مثلا: SPRING2024" />
          </div>
          <div class="space-y-2">
            <label class="label-fancy">نوع محاسبه</label>
            <select v-model="form.type" class="input-fancy">
              <option value="percent">درصدی (%)</option>
              <option value="fixed">مبلغ ثابت (تومان)</option>
            </select>
          </div>
          <div class="space-y-2">
            <label class="label-fancy">مقدار تخفیف</label>
            <input v-model="form.value" class="input-fancy" placeholder="0" type="number" />
          </div>
          <div class="space-y-2">
            <label class="label-fancy">حداقل مبلغ سفارش</label>
            <input
              v-model="form.min_order_value"
              class="input-fancy"
              placeholder="0"
              type="number"
            />
          </div>
          <div class="space-y-2">
            <label class="label-fancy">سقف استفاده (تعداد)</label>
            <input
              v-model="form.usage_limit"
              class="input-fancy"
              placeholder="بی‌نهایت"
              type="number"
            />
          </div>
          <div class="space-y-2 relative">
            <label class="label-fancy">تاریخ و ساعت انقضا</label>
            <date-picker
              v-model="form.expires_at"
              auto-submit
              color="#4f46e5"
              compact-time
              custom-input=".my-custom-input"
              display-format="jYYYY/jMM/jDD HH:mm"
              format="YYYY-MM-DD HH:mm:ss"
              type="datetime"
            />
            <input
              :value="form.expires_at"
              class="my-custom-input input-fancy !cursor-pointer"
              placeholder="انتخاب زمان انقضا..."
              readonly
            />
          </div>
        </div>

        <div class="flex justify-end gap-4 mt-12">
          <button
            class="px-8 py-3 text-slate-500 font-bold hover:bg-slate-50 rounded-2xl transition-colors"
            @click="isModalOpen = false"
          >
            انصراف
          </button>
          <button
            class="bg-indigo-600 hover:bg-indigo-700 text-white px-12 py-4 rounded-2xl font-iransans-bold shadow-lg shadow-indigo-100 transition-all active:scale-95"
            @click="saveCoupon"
          >
            {{ editingId ? 'بروزرسانی نهایی' : 'ثبت و انتشار کد' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import axios from '@/lib/axios'
import DatePicker from 'vue3-persian-datetime-picker'

const coupons = ref([])
const isModalOpen = ref(false)
const editingId = ref(null)
const copiedId = ref(null)

const form = ref({
  code: '',
  type: 'percent',
  value: 0,
  min_order_value: 0,
  usage_limit: null,
  expires_at: '',
  is_active: true,
})

const fetchCoupons = async () => {
  const res = await axios.get('/admin/coupons')
  coupons.value = res.data.data
}

const openModal = (coupon = null) => {
  if (coupon) {
    editingId.value = coupon.id
    form.value = { ...coupon }
  } else {
    editingId.value = null
    form.value = {
      code: '',
      type: 'percent',
      value: 0,
      min_order_value: 0,
      usage_limit: null,
      expires_at: '',
      is_active: true,
    }
  }
  isModalOpen.value = true
}

const copyToClipboard = async (coupon) => {
  try {
    const text = coupon.code
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text)
    } else {
      const textArea = document.createElement('textarea')
      textArea.value = text
      textArea.style.position = 'fixed'
      textArea.style.left = '-9999px'
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      textArea.remove()
    }
    copiedId.value = coupon.id
    setTimeout(() => {
      copiedId.value = null
    }, 1500)
  } catch (err) {
    console.error('Copy failed', err)
  }
}

const saveCoupon = async () => {
  try {
    if (editingId.value) {
      await axios.put(`/admin/coupons/${editingId.value}`, form.value)
    } else {
      await axios.post('/admin/coupons', form.value)
    }
    isModalOpen.value = false
    fetchCoupons()
  } catch (e) {
    alert('خطا در ذخیره‌سازی: ' + (e.response?.data?.message || 'خطای سرور'))
  }
}

const deleteCoupon = async (id) => {
  if (confirm('آیا از حذف این کد تخفیف اطمینان دارید؟ این عمل غیرقابل بازگشت است.')) {
    await axios.delete(`/admin/coupons/${id}`)
    fetchCoupons()
  }
}

const formatPrice = (v) => v.toLocaleString()
onMounted(fetchCoupons)
</script>

<style>
/* Global styles for Persian Date Picker */
.vpd-main {
  font-family: 'iransans', sans-serif !important;
}
.vpd-container {
  z-index: 1000 !important;
}
.vpd-content {
  border-radius: 24px !important;
  border: none !important;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25) !important;
}
.vpd-header {
  background: #4f46e5 !important;
  border-radius: 24px 24px 0 0 !important;
  padding: 15px !important;
}
.vpd-day.vpd-selected .vpd-day-text {
  background: #4f46e5 !important;
}

/* Copy Message Animation */
.fade-up-enter-active,
.fade-up-leave-active {
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.fade-up-enter-from {
  opacity: 0;
  transform: translateY(15px) scale(0.9);
}
.fade-up-leave-to {
  opacity: 0;
  transform: scale(1.1);
}
</style>

<style scoped>
.label-fancy {
  @apply text-[11px] font-bold text-slate-400 mr-2 uppercase tracking-wider;
}
.input-fancy {
  @apply w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl px-5 py-3.5 text-sm focus:border-indigo-500 focus:ring-0 outline-none transition-all dark:text-white;
}
.ticket-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 25px 50px -15px rgba(79, 70, 229, 0.1);
}
</style>
