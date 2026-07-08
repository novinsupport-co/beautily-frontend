<script lang="ts" setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const auth = useAuthStore()

// تعریف emit برای باز کردن/بستن سایدبار در موبایل
const emit = defineEmits(['toggle-sidebar'])

const logout = async () => {
  await auth.logout()
  router.push('/auth/login')
}
</script>

<template>
  <header
    class="sticky top-0 z-40 flex justify-between items-center px-6 py-4 bg-white/70 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800/80 shadow-sm transition-all duration-300 font-vazir"
  >
    <!-- گروه سمت راست: دکمه منوی موبایل + عنوان -->
    <div class="flex items-center gap-4">
      <!-- دکمه منوی همبرگری (فقط موبایل) با افکت‌های تعاملی جدید -->
      <button
        aria-label="باز و بسته کردن منو"
        class="md:hidden flex items-center justify-center w-10 h-10 rounded-xl bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400 border border-blue-100/50 dark:border-slate-700 shadow-sm hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white transition-all duration-300 active:scale-90 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
        @click="emit('toggle-sidebar')"
      >
        <svg
          class="w-6 h-6"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>

      <h1 class="text-xl sm:text-2xl font-black text-slate-800 dark:text-white tracking-tight">
        پنل مدیریت
      </h1>
    </div>

    <!-- گروه سمت چپ: دکمه خروج -->
    <button
      class="group flex items-center gap-2.5 px-4 py-2.5 text-sm font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800/80 rounded-xl hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-slate-700 dark:hover:text-blue-400 border border-transparent hover:border-blue-100 dark:hover:border-slate-600 transition-all duration-300 active:scale-95 shadow-sm hover:shadow-md"
      @click="logout"
    >
      <!-- آیکون خروج با انیمیشن حرکت به سمت چپ هنگام Hover -->
      <svg
        class="w-5 h-5 transition-transform duration-300 group-hover:-translate-x-1"
        fill="none"
        stroke="currentColor"
        stroke-width="2.5"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
      <span class="hidden sm:inline">خروج از حساب</span>
    </button>
  </header>
</template>
