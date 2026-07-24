<template>
  <div class="product-questions-tab font-vazir text-gray-800 p-4">
    <!-- فرم ثبت سوال جدید -->
    <div class="bg-gray-50 p-6 rounded-lg border border-gray-200 mb-8">
      <h3 class="text-lg font-bold mb-4 flex items-center gap-2">
        <svg
          class="h-6 w-6 text-blue-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
          />
        </svg>
        پرسش خود را درباره این محصول ثبت کنید
      </h3>
      <div class="mb-4">
        <textarea
          v-model="newQuestionBody"
          :disabled="submittingQuestion"
          class="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
          placeholder="متن پرسش خود را اینجا بنویسید..."
          rows="3"
        ></textarea>
      </div>
      <div class="flex justify-end">
        <button
          :disabled="submittingQuestion || !newQuestionBody.trim()"
          class="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:opacity-50 flex items-center gap-2"
          @click="handleNewQuestionSubmit"
        >
          <svg
            v-if="submittingQuestion"
            class="animate-spin h-5 w-5 text-white"
            fill="none"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            ></circle>
            <path
              class="opacity-75"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              fill="currentColor"
            ></path>
          </svg>
          {{ submittingQuestion ? 'در حال ثبت...' : 'ثبت پرسش' }}
        </button>
      </div>
    </div>

    <!-- لیست سوالات -->
    <div>
      <h3 class="text-xl font-bold mb-6 border-b pb-2">پرسش و پاسخ‌ها ({{ questions.length }})</h3>

      <!-- حالت بارگذاری -->
      <div v-if="loading" class="flex justify-center items-center py-10">
        <svg
          class="animate-spin h-8 w-8 text-blue-600"
          fill="none"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          ></circle>
          <path class="opacity-75" d="M4 12a8 8 0 018-8v8H4z" fill="currentColor"></path>
        </svg>
      </div>

      <!-- حالت خالی -->
      <div
        v-else-if="questions.length === 0"
        class="text-center py-10 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-300"
      >
        <svg
          class="h-12 w-12 mx-auto text-gray-400 mb-3"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
          />
        </svg>
        <p>هنوز پرسشی برای این محصول ثبت نشده است. شما اولین نفر باشید!</p>
      </div>

      <!-- نمایش سوالات و پاسخ‌ها -->
      <div v-else class="space-y-6">
        <div
          v-for="question in questions"
          :key="question.id"
          class="border border-gray-200 rounded-lg p-5"
        >
          <!-- هدر سوال -->
          <div class="flex items-center gap-3 mb-3">
            <div
              class="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-bold"
            >
              <svg
                class="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                />
              </svg>
            </div>
            <div>
              <p class="font-bold text-gray-800">{{ question.user?.name || 'کاربر مهمان' }}</p>
              <!-- اصلاح تاریخ ثبت پرسش -->
              <p class="text-xs text-gray-500">
                {{
                  question.created_at
                    ? new Date(question.created_at).toLocaleDateString('fa-IR')
                    : ''
                }}
              </p>
            </div>
          </div>
          <!-- متن سوال -->
          <p class="text-gray-800 mb-4 leading-relaxed">{{ question.body }}</p>

          <!-- دکمه پاسخ دادن -->
          <button
            class="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 mb-4"
            @click="openReplyForm(question.id)"
          >
            <svg
              class="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
              />
            </svg>
            پاسخ دادن
          </button>

          <!-- فرم پاسخ دادن -->
          <div
            v-if="replyingTo === question.id"
            class="mt-3 mb-5 pl-4 sm:pl-10 border-r-2 border-blue-500 pr-4"
          >
            <textarea
              v-model="replyBody"
              :disabled="submittingReply"
              class="w-full px-3 py-2 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none mb-2"
              placeholder="پاسخ خود را بنویسید..."
              rows="2"
            ></textarea>
            <div class="flex gap-2 justify-end">
              <button
                class="px-4 py-1.5 text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                @click="cancelReply"
              >
                انصراف
              </button>
              <button
                :disabled="submittingReply || !replyBody.trim()"
                class="px-4 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-1"
                @click="handleAnswerSubmit(question.id)"
              >
                <svg
                  v-if="submittingReply"
                  class="animate-spin h-4 w-4 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                  ></circle>
                  <path class="opacity-75" d="M4 12a8 8 0 018-8v8H4z" fill="currentColor"></path>
                </svg>
                ارسال پاسخ
              </button>
            </div>
          </div>

          <!-- لیست پاسخ‌ها -->
          <!-- در میان حلقه v-for سوالات -->
          <div class="answers-container mt-4">
            <h4 class="font-bold text-md mb-2">پاسخ‌ها:</h4>
            <!-- در اینجا فقط پاسخ‌های اصلی را لود میکنیم -->
            <AnswerItem
              v-for="parentAnswer in question.parent_answers"
              :key="parentAnswer.id"
              :answer="parentAnswer"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import {
  getProductQuestionsApi,
  submitProductQuestionApi,
  submitQuestionAnswerApi,
} from '@/api/questionApi'
import AnswerItem from '@/components/public/AnswerItem.vue'

const props = defineProps<{
  productId: number
}>()

// استیت‌ها
const questions = ref<any[]>([])
const loading = ref(true)

const newQuestionBody = ref('')
const submittingQuestion = ref(false)

const replyingTo = ref<number | null>(null)
const replyBody = ref('')
const submittingReply = ref(false)

// واکشی سوالات
const fetchQuestions = async () => {
  loading.value = true
  try {
    const response = await getProductQuestionsApi(props.productId)
    questions.value = response.data.data || response.data
  } catch (error) {
    console.error('خطا در دریافت سوالات:', error)
  } finally {
    loading.value = false
  }
}

// ثبت سوال جدید
const handleNewQuestionSubmit = async () => {
  if (!newQuestionBody.value.trim()) return

  submittingQuestion.value = true
  try {
    await submitProductQuestionApi(props.productId, { body: newQuestionBody.value })
    alert('پرسش شما با موفقیت ثبت شد و پس از تایید نمایش داده می‌شود.')
    newQuestionBody.value = ''
    await fetchQuestions() // بروزرسانی لیست
  } catch (error) {
    console.error('خطا در ثبت سوال:', error)
    alert('متاسفانه در ثبت پرسش مشکلی رخ داد.')
  } finally {
    submittingQuestion.value = false
  }
}

// مدیریت فرم پاسخ
const openReplyForm = (questionId: number) => {
  replyingTo.value = questionId
  replyBody.value = ''
}

const cancelReply = () => {
  replyingTo.value = null
  replyBody.value = ''
}

// ثبت پاسخ کاربر
const handleAnswerSubmit = async (questionId: number) => {
  if (!replyBody.value.trim()) return

  submittingReply.value = true
  try {
    await submitQuestionAnswerApi(questionId, { body: replyBody.value })
    alert('پاسخ شما با موفقیت ثبت شد.')
    cancelReply()
    await fetchQuestions() // دریافت مجدد لیست تا پاسخ جدید دیده شود
  } catch (error) {
    console.error('خطا در ثبت پاسخ:', error)
    alert('متاسفانه در ثبت پاسخ مشکلی رخ داد.')
  } finally {
    submittingReply.value = false
  }
}

onMounted(() => {
  fetchQuestions()
})
</script>

<style scoped>
.font-vazir {
  font-family: 'Vazirmatn', 'Vazir', sans-serif; /* مطمئن شوید این فونت در پروژه تعریف شده است */
}
</style>
