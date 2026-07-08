<template>
  <div class="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900 font-iransans" dir="rtl">
    <!-- ۱. هدر اصلی -->
    <UserHeader />

    <!-- ۲. بخش میانی (سایدبار + محتوا) -->
    <!-- حذف محدودیت عرض برای حالت تمام‌عرض -->
    <div
      class="flex-1 w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex flex-col md:flex-row gap-6 lg:gap-8"
    >
      <!-- ستون سایدبار (منوی کاربری) -->
      <!-- سایدبار را چسبان (Sticky) کردیم تا در اسکرول‌های طولانی همیشه در دسترس باشد -->
      <UserSidebar class="hidden md:block w-64 lg:w-72 shrink-0 sticky top-24 h-fit z-10" />

      <!-- ستون محتوای اصلی -->
      <main class="flex-1 min-w-0">
        <router-view v-slot="{ Component }">
          <transition mode="out-in" name="fade-slide">
            <component :is="Component" />
          </transition>
        </router-view>
      </main>
    </div>

    <!-- ۳. فوتر -->
    <UserFooter />
  </div>
</template>

<script lang="ts" setup>
import UserHeader from '@/components/layout/UserHeader.vue'
import UserFooter from '@/components/layout/UserFooter.vue'
import UserSidebar from '@/components/layout/UserSidebar.vue'
</script>

<style scoped>
/* انیمیشن جذاب‌تر برای جابجایی بین صفحات */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition:
    opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1),
    transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(15px);
}
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-15px);
}
</style>
