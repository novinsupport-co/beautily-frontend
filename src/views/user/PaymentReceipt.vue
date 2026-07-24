<template>
  <div class="max-w-2xl mx-auto space-y-6 font-vazir mt-8">
    <div
      class="bg-[#FDFBF9] dark:bg-slate-800 rounded-2xl border border-[#E9DDD2] dark:border-slate-700 p-6 shadow-sm"
    >
      <h1 class="text-2xl font-bold text-[#333333] dark:text-white mb-2">
        تکمیل پرداخت (آپلود فیش)
      </h1>
      <p class="text-sm text-[#777777] dark:text-gray-400 mb-6">
        لطفاً مبلغ سفارش را به شماره حساب سایت واریز کرده و اطلاعات آن را در زیر وارد کنید.
      </p>

      <!-- تایمر انقضا -->
      <div
        v-if="timeLeft > 0"
        class="flex items-center gap-3 bg-[#EEDAC5]/30 dark:bg-slate-700 text-[#BC846C] dark:text-[#EEDAC5] p-4 rounded-xl mb-6 border border-[#EEDAC5] dark:border-slate-600"
      >
        <svg class="w-6 h-6 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
          ></path>
        </svg>
        <div>
          <p class="font-bold text-sm">زمان باقیمانده برای پرداخت</p>
          <p class="font-mono text-lg tracking-widest" dir="ltr">{{ formattedTime }}</p>
        </div>
      </div>

      <div
        v-else
        class="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/50 text-red-600 dark:text-red-400 p-4 rounded-xl mb-6 font-bold text-center"
      >
        زمان پرداخت این سفارش به پایان رسیده است.
      </div>

      <form v-if="timeLeft > 0" class="space-y-5" @submit.prevent="submitReceipt">
        <div>
          <label class="block text-sm font-medium text-[#333333] dark:text-gray-300 mb-1"
            >کد پیگیری بانکی</label
          >
          <input
            v-model="form.tracking_code"
            class="w-full px-4 py-3 rounded-xl border border-[#E9DDD2] dark:border-slate-600 bg-white dark:bg-slate-900 text-[#333333] dark:text-white focus:ring-2 focus:ring-[#DFA9C7] dark:focus:ring-[#F57A9B] focus:outline-none transition-colors"
            placeholder="مثال: 1234567890"
            required
            type="text"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-[#333333] dark:text-gray-300 mb-1"
            >تصویر فیش واریزی</label
          >
          <div
            class="border-2 border-dashed border-[#E9DDD2] dark:border-slate-600 rounded-xl p-6 text-center hover:bg-[#F5F5F7] dark:hover:bg-slate-700/50 transition-colors"
          >
            <input
              accept="image/*,.pdf"
              class="block w-full text-sm text-[#777777] dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-[#EEDAC5]/30 file:text-[#BC846C] hover:file:bg-[#EEDAC5]/60 dark:file:bg-slate-700 dark:file:text-[#DFA9C7] dark:hover:file:bg-slate-600 transition-colors"
              required
              type="file"
              @change="handleFileUpload"
            />
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-[#333333] dark:text-gray-300 mb-1"
            >توضیحات (اختیاری)</label
          >
          <textarea
            v-model="form.description"
            class="w-full px-4 py-3 rounded-xl border border-[#E9DDD2] dark:border-slate-600 bg-white dark:bg-slate-900 text-[#333333] dark:text-white focus:ring-2 focus:ring-[#DFA9C7] dark:focus:ring-[#F57A9B] focus:outline-none resize-none transition-colors"
            rows="3"
          ></textarea>
        </div>

        <button
          :disabled="isSubmitting"
          class="w-full py-3.5 bg-[#F57A9B] hover:bg-[#DFA9C7] text-white rounded-xl font-bold transition-all disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2 shadow-lg shadow-[#F57A9B]/20 dark:shadow-none"
          type="submit"
        >
          <span
            v-if="isSubmitting"
            class="animate-spin rounded-full h-5 w-5 border-b-2 border-white"
          ></span>
          ثبت و ارسال فیش
        </button>
      </form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { uploadPaymentReceipt } from '@/api/paymentApi'
import { getOrderByIdApi } from '@/api/ordersApi'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const orderId = Number(route.params.id)

const form = ref({ tracking_code: '', description: '' })
const receiptFile = ref<File | null>(null)
const isSubmitting = ref(false)

const timeLeft = ref(0)
const formattedTime = ref('00:00')
let timerInterval: any = null

const startTimer = (expiresAtStr: string) => {
  const expiresAt = new Date(expiresAtStr).getTime()
  timerInterval = setInterval(() => {
    const now = new Date().getTime()
    const distance = expiresAt - now
    if (distance < 0) {
      clearInterval(timerInterval)
      timeLeft.value = 0
      return
    }
    timeLeft.value = distance
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((distance % (1000 * 60)) / 1000)
    formattedTime.value = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }, 1000)
}

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) receiptFile.value = target.files[0]
}

const submitReceipt = async () => {
  if (!receiptFile.value) return
  isSubmitting.value = true
  const formData = new FormData()
  formData.append('receipt_file', receiptFile.value)
  formData.append('tracking_code', form.value.tracking_code)
  formData.append('description', form.value.description)

  try {
    await uploadPaymentReceipt(orderId, formData)
    // تغییر مسیر به صفحه تاریخچه سفارشات
    router.push('/user/orders')
  } catch (error) {
    console.error('خطا در آپلود فیش:', error)
  } finally {
    isSubmitting.value = false
  }
}

onMounted(async () => {
  try {
    const res = await getOrderByIdApi(orderId)
    const orderData = res.data?.data || res.data

    // اگر سفارش قبلا منقضی شده، وضعیت تایمر 0 بماند
    if (orderData.payment_status === 'expired' || orderData.payment_status !== 'pending') {
      timeLeft.value = 0
      return
    }

    if (orderData.expires_at) {
      startTimer(orderData.expires_at)
    } else if (orderData.created_at) {
      // محاسبه 15 دقیقه از زمان ایجاد سفارش
      const orderCreationTime = new Date(orderData.created_at).getTime()
      const expirationTime = orderCreationTime + 15 * 60 * 1000 // 15 دقیقه

      startTimer(new Date(expirationTime).toISOString())
    }
  } catch (e) {
    console.error(e)
  }
})

onUnmounted(() => {
  if (timerInterval) clearInterval(timerInterval)
})
</script>
