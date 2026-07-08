<template>
  <div
    class="admin-questions p-4 md:p-8 bg-gray-50/50 min-h-screen vazir-font text-right"
    dir="rtl"
  >
    <!-- هدر صفحه و عنوان -->
    <div class="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h2 class="text-2xl font-black text-gray-800 flex items-center gap-2">
          <svg
            class="w-7 h-7 text-blue-600"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 0 1-.825-.242m9.345-8.334a2.126 2.126 0 0 0-.476-.095 48.64 48.64 0 0 0-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0 0 11.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          مدیریت پرسش و پاسخ‌ها
        </h2>
        <p class="text-sm text-gray-500 mt-2">بررسی، تایید و پاسخ‌دهی به نظرات و سوالات کاربران</p>
      </div>
    </div>

    <!-- فیلترها (تب‌ها) -->
    <div
      class="bg-white p-2 rounded-2xl shadow-sm border border-gray-100 flex overflow-x-auto gap-2 mb-8 hide-scrollbar"
    >
      <button
        v-for="status in ['all', 'approved', 'pending', 'rejected']"
        :key="status"
        :class="[
          'px-6 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 whitespace-nowrap flex items-center gap-2',
          filterStatus === status
            ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
            : 'bg-transparent text-gray-600 hover:bg-gray-50',
        ]"
        @click="setFilter(status)"
      >
        <span
          v-if="status === 'pending' && filterStatus !== 'pending'"
          class="relative flex h-2 w-2"
        >
          <span
            class="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"
          ></span>
          <span class="relative inline-flex rounded-full h-2 w-2 bg-yellow-500"></span>
        </span>
        {{ statusLabels[status] }}
      </button>
    </div>

    <!-- وضعیت لودینگ -->
    <div v-if="loading" class="flex flex-col items-center justify-center py-20">
      <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mb-4"></div>
      <p class="text-gray-500 text-sm">در حال دریافت اطلاعات...</p>
    </div>

    <!-- لیست خالی -->
    <div
      v-else-if="questions.length === 0"
      class="bg-white rounded-2xl shadow-sm border border-gray-100 p-16 text-center"
    >
      <div class="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg
          class="w-10 h-10 text-gray-400"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>
      <h3 class="text-lg font-bold text-gray-800 mb-1">هیچ سوالی یافت نشد!</h3>
      <p class="text-sm text-gray-500">برای فیلتر انتخاب شده، هیچ پرسشی در سیستم وجود ندارد.</p>
    </div>

    <!-- لیست سوالات -->
    <div v-else class="space-y-6">
      <div
        v-for="question in questions"
        :key="question.id"
        class="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-200 overflow-hidden"
      >
        <!-- هدر کارت سوال -->
        <div
          class="bg-gray-50/80 px-6 py-4 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4"
        >
          <div>
            <h3 class="font-bold text-gray-800 text-base mb-1">
              {{ question.product?.name || 'محصول نامشخص' }}
            </h3>
            <div class="flex items-center gap-2 text-xs text-gray-500 font-medium">
              <span class="flex items-center gap-1">
                <svg
                  class="w-3.5 h-3.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M10 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM3.465 14.493a1.23 1.23 0 0 0 .41 1.412A9.957 9.957 0 0 0 10 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 0 0-13.074.003Z"
                  />
                </svg>
                {{ question.user?.name || 'کاربر مهمان' }}
              </span>
              <span class="text-gray-300">|</span>
              <span dir="ltr">{{ new Date(question.created_at).toLocaleDateString('fa-IR') }}</span>
            </div>
          </div>

          <!-- اکشن‌های وضعیت سوال -->
          <div class="flex items-center gap-3">
            <select
              v-model="question.status"
              :class="statusColors[question.status]"
              class="border outline-none rounded-xl text-sm px-3 py-2 font-medium appearance-none cursor-pointer text-center min-w-[120px]"
              @change="handleStatusChange(question.id, question.status)"
            >
              <option value="pending">در انتظار تایید</option>
              <option value="approved">تایید شده</option>
              <option value="rejected">رد شده</option>
            </select>
            <button
              class="flex items-center gap-1 bg-white border border-rose-200 text-rose-600 px-3 py-2 rounded-xl text-sm font-medium hover:bg-rose-50 transition-colors"
              @click="handleDeleteQuestion(question.id)"
            >
              <svg
                class="w-4 h-4"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              حذف
            </button>
          </div>
        </div>

        <div class="p-6">
          <!-- متن سوال -->
          <div
            class="bg-blue-50/50 p-5 rounded-xl text-gray-800 mb-6 border border-blue-100/50 leading-8 text-sm"
          >
            <span class="inline-flex items-center gap-1 font-bold text-blue-700 ml-2">
              <svg
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              پرسش:
            </span>
            {{ question.body }}
          </div>

          <!-- فرم پاسخ مستقیم ادمین -->
          <div class="mb-6 bg-gray-50 p-4 rounded-xl border border-gray-100">
            <label class="block text-sm font-bold text-gray-700 mb-2"
              >ثبت پاسخ مستقیم (به عنوان ادمین)</label
            >
            <div class="relative">
              <textarea
                v-model="replyTexts[question.id]"
                class="w-full border border-gray-200 rounded-xl p-3 pl-24 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all resize-none bg-white"
                placeholder="پاسخ خود را اینجا بنویسید..."
                rows="2"
              ></textarea>
              <button
                :disabled="!replyTexts[question.id]"
                class="absolute left-2 bottom-2 bg-blue-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
                @click="submitAdminReply(question.id)"
              >
                ارسال
                <svg
                  class="w-4 h-4 rotate-180"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3.105 2.288a.75.75 0 0 0-.826.95l1.414 4.926A1.5 1.5 0 0 0 5.135 9.25h6.115a.75.75 0 0 1 0 1.5H5.135a1.5 1.5 0 0 0-1.442 1.086l-1.414 4.926a.75.75 0 0 0 .826.95 28.897 28.897 0 0 0 15.293-7.155.75.75 0 0 0 0-1.114A28.897 28.897 0 0 0 3.105 2.288Z"
                  />
                </svg>
              </button>
            </div>
          </div>

          <!-- نمایش پاسخ‌های تودرتو -->
          <div
            v-if="question.parent_answers?.length > 0"
            class="mt-6 border-t border-gray-100 pt-6"
          >
            <h4 class="font-bold text-sm text-gray-800 mb-4 flex items-center gap-2">
              <svg
                class="w-5 h-5 text-indigo-500"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              پاسخ‌های ثبت شده
            </h4>
            <div class="space-y-4">
              <AdminAnswerItem
                v-for="answer in question.parent_answers"
                :key="answer.id"
                :answer="answer"
                @answer-deleted="removeAnswerFromList"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import AdminAnswerItem from '@/views/admin/components/AdminAnswerItem.vue' // مسیر را در صورت نیاز اصلاح کنید
import { adminQuestionApi } from '@/api/adminQuestionApi'

const questions = ref([])
const loading = ref(true)
const filterStatus = ref('all')
const replyTexts = ref({})

const statusLabels = {
  all: 'همه پرسش‌ها',
  approved: 'تایید شده',
  pending: 'در انتظار تایید',
  rejected: 'رد شده',
}
const statusColors = {
  approved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  pending: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  rejected: 'bg-rose-50 text-rose-700 border-rose-200',
}

// دریافت سوالات
const fetchQuestions = async () => {
  loading.value = true
  try {
    const statusParam = filterStatus.value === 'all' ? '' : filterStatus.value
    const { data } = await adminQuestionApi.getQuestions(statusParam, 1)
    questions.value = data.data || data
  } catch (error) {
    console.error('خطا در دریافت سوالات:', error)
  } finally {
    loading.value = false
  }
}

// تغییر فیلتر
const setFilter = (status) => {
  filterStatus.value = status
  fetchQuestions()
}

// تغییر وضعیت تایید/رد
const handleStatusChange = async (id, newStatus) => {
  try {
    await adminQuestionApi.updateStatus(id, newStatus)
  } catch (error) {
    alert('خطا در تغییر وضعیت')
  }
}

// پاسخ مستقیم ادمین به سوال
const submitAdminReply = async (questionId) => {
  const body = replyTexts.value[questionId]
  if (!body) return

  try {
    await adminQuestionApi.replyQuestion(questionId, body)
    replyTexts.value[questionId] = ''
    fetchQuestions()
  } catch (error) {
    alert('خطا در ثبت پاسخ')
  }
}

// حذف کل سوال
const handleDeleteQuestion = async (id) => {
  if (!confirm('آیا از حذف کامل این سوال و تمام پاسخ‌های آن مطمئن هستید؟')) return
  try {
    await adminQuestionApi.deleteQuestion(id)
    questions.value = questions.value.filter((q) => q.id !== id)
  } catch (error) {
    alert('خطا در حذف سوال')
  }
}

// حذف پاسخ از لیست بدون رفرش (از طریق Event کامپوننت فرزند)
const removeAnswerFromList = () => {
  fetchQuestions()
}

onMounted(() => {
  fetchQuestions()
})
</script>

<style scoped>
.vazir-font {
  font-family: 'Vazirmatn', 'Vazir', tahoma, sans-serif;
}
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
.hide-scrollbar {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}
</style>
