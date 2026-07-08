<template>
  <div class="bg-white p-4 md:p-8 rounded-2xl shadow-sm border border-gray-100">
    <div class="flex items-center justify-between mb-8">
      <h2 class="text-2xl font-black text-gray-800 flex items-center gap-2">
        <svg
          class="w-7 h-7 text-blue-500"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        پرسش‌های من
      </h2>
    </div>

    <!-- حالت لودینگ -->
    <div v-if="loading" class="flex flex-col justify-center items-center py-16 space-y-4">
      <div
        class="w-12 h-12 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"
      ></div>
      <span class="text-gray-500 font-medium text-sm animate-pulse">در حال دریافت اطلاعات...</span>
    </div>

    <!-- حالت خالی بودن لیست -->
    <div
      v-else-if="questions.length === 0"
      class="flex flex-col items-center justify-center py-16 text-center bg-gray-50 rounded-xl border border-dashed border-gray-200"
    >
      <svg
        class="w-16 h-16 text-gray-300 mb-4"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
      <span class="text-gray-500 font-medium">شما تاکنون پرسشی ثبت نکرده‌اید.</span>
    </div>

    <!-- لیست پرسش‌ها -->
    <div v-else class="space-y-6">
      <div
        v-for="question in questions"
        :key="question.id"
        class="bg-white border border-gray-100 hover:border-blue-100 transition-all duration-300 rounded-2xl p-5 shadow-sm hover:shadow-md"
      >
        <!-- هدر پرسش (محصول، وضعیت و تاریخ) -->
        <div
          class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-50 pb-4 mb-4"
        >
          <div class="flex items-center gap-3">
            <div
              class="w-14 h-14 flex-shrink-0 bg-white border border-gray-100 rounded-xl overflow-hidden p-1 shadow-sm"
            >
              <img
                v-if="question.product?.thumbnail?.urls?.thumb"
                :alt="question.product?.title || question.product?.name"
                :src="question.product.thumbnail.urls.thumb"
                class="w-full h-full object-contain rounded-lg"
              />
              <div
                v-else
                class="w-full h-full bg-gray-50 flex items-center justify-center text-gray-300 rounded-lg"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1.5"
                  />
                </svg>
              </div>
            </div>
            <div>
              <span
                class="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-md mb-1 inline-block"
                >درباره محصول</span
              >
              <h3 class="text-sm font-bold text-gray-800 line-clamp-1">
                {{ question.product?.title || question.product?.name }}
              </h3>
            </div>
          </div>

          <div class="flex items-center gap-3">
            <!-- وضعیت تایید پرسش -->
            <span
              v-if="question.status === 'approved'"
              class="text-xs font-medium text-green-600 bg-green-50 border border-green-100 px-2 py-1 rounded-md"
            >
              تایید شده
            </span>
            <span
              v-else-if="question.status === 'pending'"
              class="text-xs font-medium text-yellow-600 bg-yellow-50 border border-yellow-100 px-2 py-1 rounded-md"
            >
              در انتظار تایید
            </span>

            <!-- تاریخ پرسش -->
            <div class="text-xs text-gray-400 font-medium flex items-center gap-1">
              <svg
                class="w-4 h-4"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
                viewBox="0 0 24 24"
              >
                <path
                  d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              {{ new Date(question.created_at).toLocaleDateString('fa-IR') }}
            </div>
          </div>
        </div>

        <!-- متن پرسش اصلی همراه با آواتار کاربر -->
        <div class="flex items-start gap-3 mb-4">
          <div class="flex-shrink-0">
            <!-- نمایش آواتار کاربر ثبت‌کننده پرسش -->
            <img
              v-if="question.user?.avatar_url"
              :alt="question.user.name"
              :src="question.user.avatar_url"
              class="w-10 h-10 rounded-full object-cover border-2 border-gray-100 shadow-sm"
            />
            <!-- Fallback برای زمانی که کاربر آواتار ندارد -->
            <div
              v-else
              class="w-10 h-10 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center font-bold text-lg border-2 border-blue-100 shadow-sm"
            >
              {{ question.user?.name ? question.user.name.charAt(0) : '؟' }}
            </div>
          </div>

          <div class="flex-1 mt-1">
            <h4 class="text-xs font-semibold text-gray-500 mb-1">
              {{ question.user?.name || 'کاربر سایت' }}
            </h4>
            <p class="text-gray-800 font-medium leading-relaxed text-sm md:text-base">
              {{ question.body }}
            </p>
          </div>
        </div>

        <!-- فراخوانی کامپوننت AnswerItem برای نمایش پاسخ‌ها و ریپلای‌ها -->
        <div
          v-if="
            (question.parent_answers && question.parent_answers.length > 0) ||
            (question.answers && question.answers.length > 0)
          "
          class="answers-container mt-4 border-t border-gray-100 pt-5"
        >
          <h4 class="font-bold text-sm mb-4 text-gray-700 flex items-center gap-2">
            <svg
              class="w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
              ></path>
            </svg>
            پاسخ‌ها:
          </h4>

          <!-- لاراول relation مربوط به parentAnswers را در JSON به صورت parent_answers ارسال می‌کند -->
          <AnswerItem
            v-for="answer in question.parent_answers || question.answers"
            :key="answer.id"
            :answer="answer"
          />
        </div>

        <!-- پیغام در صورت عدم وجود پاسخ -->
        <div v-else class="mt-4 border-t border-gray-100 pt-4">
          <p class="text-xs text-gray-400 italic flex items-center gap-1">
            <svg
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
              ></path>
            </svg>
            هنوز پاسخی برای این پرسش ثبت نشده است.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {onMounted, ref} from 'vue'
import {getUserQuestionsApi} from '@/api/userApi' // ایمپورت کامپوننت پاسخ‌ها (این کامپوننت حالا با دیتای کامل شامل آواتار، تاریخ و لایک تغذیه می‌شود)
import AnswerItem from '@/components/public/AnswerItem.vue'

const questions = ref<any[]>([])
const loading = ref(true)

const fetchQuestions = async () => {
  try {
    const response = await getUserQuestionsApi()
    // ساختار paginate لاراول (response.data.data)
    questions.value = response.data.data || response.data
  } catch (error) {
    console.error('خطا در دریافت پرسش‌ها:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchQuestions()
})
</script>
