<template>
  <div
    class="min-h-screen relative flex items-start sm:items-center justify-center bg-zinc-50 dark:bg-zinc-950 px-4 pt-6 pb-6 sm:py-10 overflow-hidden font-iransans"
  >
    <!-- افکت‌های نوری پس‌زمینه (مدرن و لوکس) -->
    <div class="absolute inset-0 z-0 pointer-events-none flex justify-center items-center">
      <div
        class="absolute top-[-10%] left-[-10%] w-96 h-96 bg-rose-500/10 dark:bg-rose-500/5 blur-[120px] rounded-full"
      ></div>
      <div
        class="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-zinc-500/10 dark:bg-zinc-500/10 blur-[120px] rounded-full"
      ></div>
    </div>

    <!-- کانتینر اصلی -->
    <div class="relative z-10 w-full max-w-5xl flex flex-col items-center">
      <div class="mb-4 sm:mb-6 flex flex-col items-center text-center animate-fade-in">
        <!-- عنوان داینامیک صفحه -->
        <h2
          v-if="$route.meta.title"
          class="text-lg sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight mt-1"
        >
          {{ $route.meta.title }}
        </h2>
      </div>

      <!-- بخش کارت فرم‌ها -->
      <!-- پدینگ کادر در موبایل به p-4 کاهش یافت تا محتوا جمع‌وجورتر شود -->
      <div
        class="w-full bg-white dark:bg-zinc-900/80 backdrop-blur-xl ring-1 ring-zinc-200 dark:ring-zinc-800 shadow-2xl rounded-[2rem] p-4 sm:p-8 animate-slide-up"
      >
        <!-- بارگذاری کامپوننت‌های لاگین، ثبت‌نام و... همراه با افکت تغییر صفحه -->
        <!-- در فایل AuthLayout.vue -->

        <router-view v-slot="{ Component, route }">
          <transition mode="out-in" name="fade">
            <!-- کلید route.path در اینجا حیاتی است -->
            <component :is="Component" :key="route.path" />
          </transition>
        </router-view>
      </div>
    </div>
  </div>
</template>

<script setup></script>

<style scoped>
/* انیمیشن‌های ورود */
.animate-fade-in {
  animation: fadeIn 0.6s ease-out forwards;
}
.animate-slide-up {
  animation: slideUp 0.5s ease-out forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(15px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* انیمیشن ترانزیشن بین صفحات روتر */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
