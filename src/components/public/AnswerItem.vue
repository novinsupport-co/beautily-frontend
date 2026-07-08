<template>
  <div
    class="answer-item bg-white p-4 rounded-xl mt-4 border border-gray-100 shadow-sm transition-all hover:shadow-md"
  >
    <!-- هدر پاسخ (کاربر و متن) -->
    <div class="flex items-center gap-3 mb-3">
      <div
        class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm"
      >
        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
          />
        </svg>
      </div>
      <div>
        <span class="font-bold text-sm text-gray-800">
          {{ answer.user?.name || 'کاربر مهمان' }}
          <span
            v-if="answer.is_admin"
            class="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full mr-1"
            >پشتیبان سایت</span
          >
        </span>
      </div>
    </div>

    <p class="text-gray-700 text-sm leading-relaxed pr-11">{{ answer.body }}</p>

    <!-- اکشن‌ها: لایک، دیس‌لایک، ریپلای -->
    <div class="flex items-center gap-3 mt-4 pr-11 border-b border-gray-50 pb-3">
      <!-- دکمه لایک -->
      <button
        class="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-50 text-green-600 border border-green-200 hover:bg-green-600 hover:text-white transition-colors text-xs font-medium"
        @click="handleVote(true)"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
          />
        </svg>
        <span>{{ localLikes }}</span>
      </button>

      <!-- دکمه دیس‌لایک -->
      <button
        class="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-50 text-red-500 border border-red-200 hover:bg-red-500 hover:text-white transition-colors text-xs font-medium"
        @click="handleVote(false)"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
          />
        </svg>
        <span>{{ localDislikes }}</span>
      </button>

      <!-- دکمه پاسخ دادن -->
      <button
        class="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-gray-500 hover:bg-gray-100 transition-colors text-xs font-medium mr-auto"
        @click="showReplyForm = !showReplyForm"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
          />
        </svg>
        پاسخ دادن
      </button>
    </div>

    <!-- فرم ریپلای -->
    <div v-if="showReplyForm" class="mt-3 pr-11">
      <textarea
        v-model="replyText"
        :disabled="isSubmitting"
        class="w-full border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg p-3 text-sm resize-none outline-none transition-all"
        placeholder="پاسخ خود را برای این کاربر بنویسید..."
        rows="2"
      ></textarea>
      <div class="flex justify-end gap-2 mt-2">
        <button
          class="px-4 py-1.5 text-xs text-gray-500 hover:bg-gray-100 rounded-md transition-colors"
          @click="showReplyForm = false"
        >
          انصراف
        </button>
        <button
          :disabled="isSubmitting || !replyText.trim()"
          class="bg-blue-600 text-white px-4 py-1.5 rounded-md text-xs hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-60"
          @click="submitReply"
        >
          <span
            v-if="isSubmitting"
            class="animate-spin w-3 h-3 border-2 border-white border-t-transparent rounded-full"
          ></span>
          ارسال پاسخ
        </button>
      </div>
    </div>

    <!-- بخش بازگشتی: لود کردن ریپلای‌های این پاسخ (تودرتو) -->
    <!-- توجه: حلقه روی localReplies زده می‌شود تا آپدیت‌های آنی (درجا) اعمال شوند -->
    <div
      v-if="localReplies && localReplies.length > 0"
      class="mr-4 md:mr-10 border-r-2 border-gray-100 pr-4 mt-2"
    >
      <AnswerItem v-for="reply in localReplies" :key="reply.id" :answer="reply" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { replyToAnswerApi, voteAnswerApi } from '@/api/userApi.ts' // نام کامپوننت برای بازگشتی بودن اجباری است

// نام کامپوننت برای بازگشتی بودن اجباری است
defineOptions({ name: 'AnswerItem' })

const props = defineProps({
  answer: { type: Object, required: true },
})

const showReplyForm = ref(false)
const replyText = ref('')
const isSubmitting = ref(false)

// استفاده از داده‌های لوکال (Local State) برای آپدیت آنی و بدون نیاز به رفرش صفحه
const localReplies = ref(props.answer.replies || [])
const localLikes = ref(props.answer.votes?.filter((v) => v.is_like === 1).length || 0)
const localDislikes = ref(props.answer.votes?.filter((v) => v.is_like === 0).length || 0)

// هندل کردن لایک و دیس‌لایک
const handleVote = async (isLike) => {
  // آپدیت سریع در رابط کاربری (Optimistic Update)
  if (isLike) localLikes.value++
  else localDislikes.value++

  try {
    // ارسال به بک‌اند
    await voteAnswerApi(props.answer.id, isLike)
  } catch (error) {
    // در صورت خطا، لایک اضافه‌شده را برمی‌گردانیم
    if (isLike) localLikes.value--
    else localDislikes.value--
    console.error('خطا در ثبت رای:', error)
  }
}

// هندل کردن ارسال ریپلای
const submitReply = async () => {
  if (!replyText.value.trim()) return

  isSubmitting.value = true
  try {
    // ارسال متن پاسخ به سرور (با متغیر درست replyText)
    const response = await replyToAnswerApi(props.answer.id, { body: replyText.value })

    // اگر سرور پاسخ را برگرداند، آن را به لیست لوکال اضافه می‌کنیم تا درجا نمایش داده شود
    if (response.data && response.data.reply) {
      localReplies.value.push(response.data.reply)
    }

    // ریست کردن فرم
    replyText.value = ''
    showReplyForm.value = false
  } catch (error) {
    console.error('خطا در ارسال پاسخ:', error)
    alert('متاسفانه خطایی در ارسال پاسخ رخ داد.')
  } finally {
    isSubmitting.value = false
  }
}
</script>
