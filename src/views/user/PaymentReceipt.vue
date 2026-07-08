<template>
  <div class="max-w-2xl mx-auto space-y-6 font-vazir mt-8">
    <div
      class="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-6 shadow-sm"
    >
      <h1 class="text-2xl font-bold text-gray-800 dark:text-white mb-2">
        تکمیل پرداخت (آپلود فیش)
      </h1>
      <p class="text-sm text-gray-500 dark:text-gray-400 mb-6">
        لطفاً مبلغ سفارش را به شماره حساب سایت واریز کرده و اطلاعات آن را در زیر وارد کنید.
      </p>

      <!-- تایمر انقضا -->
      <div
        v-if="timeLeft > 0"
        class="flex items-center gap-3 bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 p-4 rounded-xl mb-6"
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

      <div v-else class="bg-red-50 text-red-600 p-4 rounded-xl mb-6 font-bold text-center">
        زمان پرداخت این سفارش به پایان رسیده است.
      </div>

      <form v-if="timeLeft > 0" class="space-y-5" @submit.prevent="submitReceipt">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >کد پیگیری بانکی</label
          >
          <input
            v-model="form.tracking_code"
            class="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-900 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="مثال: 1234567890"
            required
            type="text"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >تصویر فیش واریزی</label
          >
          <div
            class="border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-xl p-6 text-center hover:bg-gray-50 dark:hover:bg-slate-700/50 transition"
          >
            <input
              accept="image/*,.pdf"
              class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              required
              type="file"
              @change="handleFileUpload"
            />
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >توضیحات (اختیاری)</label
          >
          <textarea
            v-model="form.description"
            class="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-900 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
            rows="3"
          ></textarea>
        </div>

        <button
          :disabled="isSubmitting"
          class="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
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
