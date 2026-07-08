<template>
  <aside
    :class="[
      'fixed top-0 right-0 h-full z-50 transition-transform duration-300 ease-in-out md:relative md:translate-x-0 w-64 bg-white dark:bg-slate-900 shadow-2xl md:shadow-none flex flex-col border-l border-slate-100 dark:border-slate-800 font-vazir',
      isOpen ? 'translate-x-0' : 'translate-x-full',
    ]"
  >
    <!-- Logo & Header -->
    <div class="flex items-center justify-between px-5 py-6 mb-2 shrink-0">
      <div class="flex items-center gap-3">
        <div
          class="w-11 h-11 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30"
        >
          <svg
            class="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>
        <span class="font-extrabold text-lg text-slate-800 dark:text-white tracking-tight">
          بیوتی شاپ
        </span>
      </div>

      <!-- دکمه بستن سایدبار در موبایل -->
      <button
        aria-label="بستن منو"
        class="md:hidden flex items-center justify-center w-10 h-10 text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-red-100 dark:hover:bg-red-500/20 hover:text-red-500 dark:hover:text-red-400 transition-all duration-200 active:scale-90"
        @click="$emit('close')"
      >
        <svg
          class="h-6 w-6"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M6 18L18 6M6 6l12 12" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </button>
    </div>

    <!-- Navigation Links -->
    <nav class="flex-1 overflow-y-auto px-4 pb-10 space-y-1 custom-scrollbar">
      <RouterLink active-class="nav-link-active" class="nav-link" to="/admin/dashboard">
        <i class="pi pi-th-large text-lg opacity-80"></i>
        <span>داشبورد عملیاتی</span>
      </RouterLink>

      <div class="pt-5">
        <div class="nav-label">مدیریت کالاها</div>
        <div class="space-y-0.5 mt-2">
          <RouterLink active-class="nav-link-sub-active" class="nav-link-sub" to="/admin/products">
            <i class="pi pi-list text-[13px] opacity-70"></i>
            <span>لیست محصولات</span>
          </RouterLink>
          <RouterLink
            active-class="nav-link-sub-active"
            class="nav-link-sub"
            to="/admin/products/create"
          >
            <i class="pi pi-plus-circle text-[13px] opacity-70"></i>
            <span>افزودن محصول جدید</span>
          </RouterLink>
          <RouterLink
            active-class="nav-link-sub-active"
            class="nav-link-sub"
            to="/admin/ProductVariants"
          >
            <i class="pi pi-sitemap text-[13px] opacity-70"></i>
            <span>ویژگی‌های محصول</span>
          </RouterLink>
          <RouterLink
            active-class="nav-link-sub-active"
            class="nav-link-sub"
            to="/admin/CouponManager"
          >
            <i class="pi pi-ticket text-[13px] opacity-70"></i>
            <span>کوپن و تخفیف‌ها</span>
          </RouterLink>
          <RouterLink
            active-class="nav-link-sub-active"
            class="nav-link-sub"
            to="/admin/categories"
          >
            <i class="pi pi-tags text-[13px] opacity-70"></i>
            <span>دسته‌بندی و برندها</span>
          </RouterLink>
          <RouterLink
            active-class="nav-link-sub-active"
            class="nav-link-sub"
            to="/admin/OrderManager"
          >
            <i class="pi pi-shopping-cart text-[13px] opacity-70"></i>
            <span>مدیریت سفارش‌ها</span>
          </RouterLink>
        </div>
      </div>

      <!-- گروه: جامعه مشتریان و تعاملات -->
      <div class="pt-5">
        <div class="nav-label text-slate-400 text-xs font-iransans-bold mb-2 px-3">
          جامعه مشتریان
        </div>
        <div class="space-y-1 mt-2">
          <RouterLink
            active-class="nav-link-active bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400"
            class="flex items-center gap-2 px-3 py-2.5 rounded-xl text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
            to="/admin/users"
          >
            <i class="pi pi-users text-lg"></i>
            <span class="font-iransans-medium text-sm">مدیریت کاربران</span>
          </RouterLink>
          <RouterLink
            active-class="nav-link-active bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400"
            class="flex items-center gap-2 px-3 py-2.5 rounded-xl text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
            to="/admin/reviews"
          >
            <i class="pi pi-comments text-lg"></i>
            <span class="font-iransans-medium text-sm">مدیریت نظرات</span>
          </RouterLink>
          <RouterLink
            active-class="nav-link-active bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400"
            class="flex items-center gap-2 px-3 py-2.5 rounded-xl text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
            to="/admin/questions"
          >
            <i class="pi pi-question-circle text-lg"></i>
            <span class="font-iransans-medium text-sm">پرسش و پاسخ‌ها</span>
          </RouterLink>
        </div>
      </div>

      <div class="pt-5">
        <div class="nav-label">پایداری سیستم</div>
        <div class="space-y-0.5 mt-2">
          <RouterLink active-class="nav-link-sub-active" class="nav-link-sub" to="/admin/logs">
            <i class="pi pi-file-edit text-[13px] opacity-70"></i>
            <span>گزارشات سیستمی</span>
          </RouterLink>
          <RouterLink active-class="nav-link-sub-active" class="nav-link-sub" to="/admin/logState">
            <i class="pi pi-chart-line text-[13px] opacity-70"></i>
            <span>وضعیت لحظه‌ای لاگ</span>
          </RouterLink>
          <RouterLink
            active-class="nav-link-sub-active"
            class="nav-link-sub"
            to="/admin/LogMonitoring"
          >
            <i class="pi pi-desktop text-[13px] opacity-70"></i>
            <span>مانیتورینگ سرویس‌ها</span>
          </RouterLink>
        </div>
      </div>

      <div class="pt-5">
        <div class="nav-label">توسعه و ابزارها</div>
        <div class="space-y-0.5 mt-2">
          <RouterLink
            active-class="nav-link-sub-active"
            class="nav-link-sub"
            to="/admin/CommunicationDashboard"
          >
            <i class="pi pi-comments text-[13px] opacity-70"></i>
            <span>مدیریت ارتباطات</span>
          </RouterLink>

          <!-- لینک اضافه شده: تنظیمات فروشگاه -->
          <RouterLink
            active-class="nav-link-sub-active"
            class="nav-link-sub"
            to="/admin/shop-settings"
          >
            <i class="pi pi-cog text-[13px] opacity-70"></i>
            <span>تنظیمات مالی و فروشگاه</span>
          </RouterLink>

          <RouterLink
            active-class="nav-link-sub-active"
            class="nav-link-sub"
            to="/admin/notification-templateForm"
          >
            <i class="pi pi-mobile text-[13px] opacity-70"></i>
            <span>هشدارها-ایمیل پیامک</span>
          </RouterLink>

          <RouterLink
            active-class="nav-link-sub-active"
            class="nav-link-sub"
            to="/admin/system-images"
          >
            <i class="pi pi-mobile text-[13px] opacity-70"></i>
            <span>مدیریت تصاویر سایت</span>
          </RouterLink>
          <RouterLink active-class="nav-link-sub-active" class="nav-link-sub" to="/admin/test-api">
            <i class="pi pi-code text-[13px] opacity-70"></i>
            <span>API Sandbox</span>
          </RouterLink>
        </div>
      </div>
    </nav>
  </aside>
</template>

<script lang="ts" setup>
import { RouterLink } from 'vue-router'

defineProps<{
  isOpen: boolean
}>()

defineEmits(['close'])
</script>

<style scoped>
/* استایل لینک‌های اصلی (Level 1) */
.nav-link {
  @apply flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 dark:text-slate-400 font-bold hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200;
}

.nav-link-active {
  @apply bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/20 dark:shadow-none hover:bg-blue-700 hover:text-white scale-105 transform !important;
}

/* استایل زیرمنوها (Level 2) */
.nav-link-sub {
  @apply flex items-center gap-3 px-4 py-2.5 rounded-lg text-slate-500 dark:text-slate-400 font-medium text-[13px] hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800/40 transform hover:translate-x-[-4px] transition-all duration-200;
}

.nav-link-sub-active {
  @apply bg-blue-50/80 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 font-extrabold border-r-4 border-blue-600 rounded-r-md !important;
}

/* برچسب‌های دسته‌بندی */
.nav-label {
  @apply px-4 text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider;
}

/* اسکرول‌بار اختصاصی و زیبا برای سایدبار */
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  @apply bg-slate-200 dark:bg-slate-700 rounded-full;
}
.custom-scrollbar:hover::-webkit-scrollbar-thumb {
  @apply bg-slate-400 dark:bg-slate-500;
}
</style>
