<template>
  <section
    class="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white p-6"
    dir="rtl"
  >
    <div class="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-center">
      <!-- Illustration -->
      <div class="flex items-center justify-center">
        <div
          class="relative w-64 h-64 sm:w-72 sm:h-72 md:w-96 md:h-96 rounded-3xl shadow-2xl bg-white/60 backdrop-blur p-4 sm:p-6 flex flex-col items-center justify-center"
        >
          <!-- Decorative rings -->
          <div
            class="absolute -left-8 -top-8 w-28 h-28 sm:w-32 sm:h-32 rounded-full opacity-10 bg-gradient-to-tr from-brand-primary to-brand-secondary animate-blob"
          />
          <div
            class="absolute -right-6 -bottom-6 w-20 h-20 sm:w-24 sm:h-24 rounded-full opacity-8 bg-gradient-to-bl from-yellow-300 to-pink-300 animate-blob animation-delay-2000"
          />

          <!-- Cute broken robot / map SVG -->
          <svg
            aria-hidden
            class="w-44 h-44 sm:w-52 sm:h-52 md:w-56 md:h-56"
            viewBox="0 0 200 200"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="g1" x1="0" x2="1">
                <stop offset="0%" stop-color="#7c3aed" />
                <stop offset="100%" stop-color="#06b6d4" />
              </linearGradient>
            </defs>
            <g transform="translate(10,10)">
              <rect
                fill="#f8fafc"
                height="110"
                rx="18"
                ry="18"
                stroke="url(#g1)"
                stroke-width="3"
                width="140"
                x="10"
                y="20"
              />
              <path
                d="M30 60 C50 30, 110 30, 130 60"
                fill="none"
                stroke="#fde68a"
                stroke-linecap="round"
                stroke-width="6"
              />
              <circle cx="50" cy="80" fill="#ef4444" r="6" />
              <circle cx="110" cy="80" fill="#60a5fa" r="6" />
            </g>
          </svg>

          <span
            class="absolute text-sm sm:text-base bottom-16 sm:bottom-20 text-gray-400 font-vazir-medium"
          >
            خطای ۴۰۴ — صفحه مورد نظر پیدا نشد
          </span>
        </div>
      </div>

      <!-- Content -->
      <div class="text-right">
        <h1 class="text-5xl sm:text-6xl md:text-7xl font-iransans-bold text-gray-800 leading-tight">
          ۴۰۴
        </h1>
        <p class="mt-2 text-base sm:text-lg md:text-lg text-gray-600 max-w-xl font-iransans-medium">
          به نظر می‌رسد صفحه‌ای که به دنبال آن هستید حذف شده، نام‌گذاری شده یا در دسترس نیست.
        </p>

        <!-- Vertical layout -->
        <div class="mt-6 flex flex-col items-stretch gap-3">
          <button
            class="inline-flex items-center justify-center w-full h-12 rounded-2xl shadow-lg font-iransans-bold text-white bg-gradient-to-r from-brand-primary to-brand-secondary hover:scale-105 transform transition"
            @click="goHome"
          >
            بازگشت به صفحه اصلی
          </button>

          <FormKit
            :actions="false"
            :validation-messages="{ length: 'حداقل ۲ کاراکتر وارد کنید.' }"
            class="w-full h-12 px-5 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-primary bg-white text-gray-700"
            name="q"
            placeholder="جستجو در سایت..."
            type="search"
            validation="length:2,100"
            @submit="searchHandler"
          />
        </div>

        <div class="mt-6 text-sm text-gray-500 space-y-2">
          <div>
            پیشنهاد ما:
            <router-link class="text-brand-primary font-iransans-medium hover:underline" to="/">
              بازدید صفحه اصلی
            </router-link>
          </div>
          <div>
            اگر فکر می‌کنید این خطا نادرست است، لطفاً از طریق
            <router-link
              class="text-brand-primary font-iransans-medium hover:underline"
              to="/contact"
            >
              تماس با ما
            </router-link>
            اطلاع دهید.
          </div>
        </div>

        <div class="mt-8 text-xs text-gray-400">کد خطا: <span class="font-mono">404</span></div>
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import router from '@/router'
import type { FormKitNode } from '@formkit/core'

const q = ref('')

const goHome = () => {
  router.push('/')
}

const searchHandler = (payload: any, node?: FormKitNode) => {
  const query = payload?.q || q.value || ''
  if (!query || query.trim().length < 2) return
  router.push({ path: '/search', query: { q: query } })
}
</script>

<style scoped>
@keyframes blob {
  0% {
    transform: translateY(0) scale(1);
  }
  50% {
    transform: translateY(-6px) scale(1.03);
  }
  100% {
    transform: translateY(0) scale(1);
  }
}
.animate-blob {
  animation: blob 5s infinite ease-in-out;
}
.animation-delay-2000 {
  animation-delay: 2s;
}
</style>
