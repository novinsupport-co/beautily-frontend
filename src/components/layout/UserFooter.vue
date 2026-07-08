<template>
  <footer
    class="mt-auto border-t border-gray-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.02)]"
  >
    <!-- استفاده از w-full برای مطابقت با تمام‌عرض بودن صفحه -->
    <div class="w-full px-4 sm:px-6 lg:px-8 py-6">
      <div class="flex flex-col md:flex-row items-center justify-between gap-4">
        <div
          class="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400 font-iransans-medium"
        >
          <div
            class="p-1.5 bg-gray-50 dark:bg-slate-800 rounded-lg border border-gray-100 dark:border-slate-700"
          >
            <img
              alt="Beautily Logo"
              class="w-5 h-5 opacity-60 grayscale"
              src="../../assets/icon/LogoSvg.svg"
            />
          </div>
          <span>© ۱۴۰۴ Beautily — تمامی حقوق محفوظ است.</span>
        </div>

        <div
          class="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500 font-iransans-medium bg-gray-50 dark:bg-slate-800/50 px-4 py-2 rounded-full"
        >
          طراحی و توسعه با <span class="text-red-500 animate-pulse">❤️</span> برای زیبایی شما
        </div>
      </div>
    </div>
  </footer>
</template>

<script lang="ts" setup></script>
