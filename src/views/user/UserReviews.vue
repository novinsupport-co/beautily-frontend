<template>
  <div class="space-y-6 font-vazir">
    <!-- هدر صفحه -->
    <div>
      <h1 class="text-2xl font-bold text-[#333333] dark:text-white mb-2">دیدگاه‌ها و پرسش‌ها</h1>
      <p class="text-sm text-[#777777] dark:text-gray-400">
        تاریخچه نظرات و سوالات شما درباره محصولات فروشگاه.
      </p>
    </div>

    <!-- تب‌ها -->
    <div class="flex border-b border-[#E9DDD2] dark:border-slate-700">
      <button
        :class="
          activeTab === 'reviews'
            ? 'border-[#F57A9B] text-[#F57A9B] dark:border-[#DFA9C7] dark:text-[#DFA9C7]'
            : 'border-transparent text-[#777777] hover:text-[#333333] dark:text-gray-400 dark:hover:text-gray-300'
        "
        class="pb-4 px-4 text-sm font-bold border-b-2 transition-colors flex items-center gap-2"
        @click="activeTab = 'reviews'"
      >
        دیدگاه‌های من
      </button>
      <button
        :class="
          activeTab === 'questions'
            ? 'border-[#F57A9B] text-[#F57A9B] dark:border-[#DFA9C7] dark:text-[#DFA9C7]'
            : 'border-transparent text-[#777777] hover:text-[#333333] dark:text-gray-400 dark:hover:text-gray-300'
        "
        class="pb-4 px-4 text-sm font-bold border-b-2 transition-colors flex items-center gap-2"
        @click="activeTab = 'questions'"
      >
        پرسش‌های من
      </button>
    </div>

    <!-- رندر کردن کامپوننت‌ها بر اساس تب فعال -->
    <div class="mt-4">
      <TabUserReviews v-if="activeTab === 'reviews'" />
      <TabUserQuestions v-if="activeTab === 'questions'" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

// ایمپورت کردن دو کامپوننت ساخته شده
import TabUserReviews from '@/views/user/Tabs/TabUserReviews.vue'
import TabUserQuestions from '@/views/user/Tabs/TabUserQuestions.vue'

// مدیریت تب فعال
const activeTab = ref('reviews')
</script>
