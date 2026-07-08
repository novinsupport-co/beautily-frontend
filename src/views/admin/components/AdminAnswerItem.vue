<template>
  <div
    class="admin-answer-item relative bg-white border border-gray-100 rounded-xl p-4 mt-4 shadow-sm hover:shadow-md transition-shadow duration-200 vazir-font"
  >
    <!-- نشانگر سلسله مراتب (خط کنار برای زیبایی) -->
    <div
      class="absolute right-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-100 to-transparent rounded-r-xl"
    ></div>

    <!-- هدر پاسخ -->
    <div class="flex flex-wrap items-center justify-between gap-3 mb-3">
      <div class="flex items-center gap-2">
        <!-- آیکون کاربر -->
        <div class="bg-gray-100 p-1.5 rounded-full text-gray-500">
          <svg
            class="w-4 h-4"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>
        <span class="font-semibold text-sm text-gray-800">
          {{ answer.user?.name || 'کاربر مهمان' }}
        </span>
        <!-- بج ادمین -->
        <span
          v-if="answer.is_admin"
          class="flex items-center gap-1 text-[11px] bg-indigo-50 border border-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full font-medium"
        >
          <svg
            class="w-3 h-3"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              clip-rule="evenodd"
              d="M16.403 12.652a3 3 0 0 0 0-5.304 3 3 0 0 0-3.75-3.751 3 3 0 0 0-5.305 0 3 3 0 0 0-3.751 3.75 3 3 0 0 0 0 5.305 3 3 0 0 0 3.75 3.751 3 3 0 0 0 5.305 0 3 3 0 0 0 3.751-3.75Zm-2.546-4.46a.75.75 0 0 0-1.214-.883l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z"
              fill-rule="evenodd"
            />
          </svg>
          ادمین
        </span>
      </div>

      <!-- دکمه حذف پاسخ -->
      <button
        :disabled="isDeleting"
        class="flex items-center gap-1 text-xs text-rose-500 hover:text-rose-700 hover:bg-rose-50 border border-transparent hover:border-rose-100 px-2 py-1.5 rounded-lg transition-colors disabled:opacity-50"
        @click="handleDelete"
      >
        <svg
          v-if="!isDeleting"
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
        <svg
          v-else
          class="animate-spin w-4 h-4"
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
        <span>{{ isDeleting ? 'حذف...' : 'حذف پاسخ' }}</span>
      </button>
    </div>

    <!-- متن پاسخ -->
    <p class="text-gray-700 text-sm leading-7 pr-2">{{ answer.body }}</p>

    <!-- نمایش آمار لایک و دیس‌لایک -->
    <div class="flex items-center gap-4 mt-4 pr-2 border-t border-gray-50 pt-3">
      <div
        class="flex items-center gap-1.5 text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md"
      >
        <svg
          class="w-3.5 h-3.5"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0 .745.556.5.96a8.958 8.958 0 0 0-1.302 4.665c0 1.194.232 2.333.654 3.375Z"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        <span class="font-medium">{{ likesCount }}</span>
      </div>
      <div class="flex items-center gap-1.5 text-xs text-rose-600 bg-rose-50 px-2 py-1 rounded-md">
        <svg
          class="w-3.5 h-3.5"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M7.498 15.25H4.372c-1.026 0-1.945-.694-2.054-1.715a12.137 12.137 0 0 1-.068-1.285c0-2.848.992-5.464 2.649-7.521C5.287 4.247 5.886 4 6.504 4h4.016a4.5 4.5 0 0 1 1.423.23l3.114 1.04a4.5 4.5 0 0 0 1.423.23h1.294M7.498 15.25c.618 0 .991.724.725 1.282A7.471 7.471 0 0 0 7.5 19.75 2.25 2.25 0 0 0 9.75 22a.75.75 0 0 0 .75-.75v-1.5c0-.648.13-1.266.368-1.83.238-.564.582-1.077 1.01-1.52.428-.443.935-.788 1.498-1.012A4.49 4.49 0 0 1 15 14.25v-3.75m-7.5 4.75h3.75m-3.75 0h-.44m5.632-4.108c-.083-.205-.173-.405-.27-.602-.197-.4.078-.898.523-.898h.908c.889 0 1.713.518 1.972 1.368.175.57.305 1.163.385 1.77.08.607.12 1.225.12 1.854 0 1.553-.295 3.036-.831 4.398C20.613 14.547 19.833 15 19 15h-1.053c-.472 0-.745-.556-.5-.96a8.95 8.95 0 0 0 1.302-4.665c0-1.194-.232-2.333-.654-3.375Z"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        <span class="font-medium">{{ dislikesCount }}</span>
      </div>
    </div>

    <!-- بخش بازگشتی: لود کردن ریپلای‌های این پاسخ -->
    <div
      v-if="answer.replies && answer.replies.length > 0"
      class="mr-4 border-r-2 border-gray-100 pr-3 mt-3 relative"
    >
      <AdminAnswerItem
        v-for="reply in answer.replies"
        :key="reply.id"
        :answer="reply"
        @answer-deleted="$emit('answer-deleted', $event)"
      />
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { adminQuestionApi } from '@/api/adminQuestionApi'

defineOptions({ name: 'AdminAnswerItem' })

const props = defineProps({
  answer: { type: Object, required: true },
})

const emit = defineEmits(['answer-deleted'])
const isDeleting = ref(false)

const likesCount = computed(() => props.answer.votes?.filter((v) => v.is_like === 1).length || 0)
const dislikesCount = computed(() => props.answer.votes?.filter((v) => v.is_like === 0).length || 0)

const handleDelete = async () => {
  if (!confirm('آیا از حذف این پاسخ مطمئن هستید؟')) return

  isDeleting.value = true
  try {
    await adminQuestionApi.deleteAnswer(props.answer.id)
    emit('answer-deleted', props.answer.id)
  } catch (error) {
    console.error('خطا در حذف پاسخ:', error)
    alert('خطا در حذف پاسخ!')
  } finally {
    isDeleting.value = false
  }
}
</script>

<style scoped>
.vazir-font {
  font-family: 'Vazirmatn', 'Vazir', tahoma, sans-serif;
}
</style>
