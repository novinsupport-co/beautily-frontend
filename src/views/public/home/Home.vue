<template>
  <div
    class="min-h-screen bg-gradient-to-br from-gray-100 via-[#FDFBF9] to-gray-200 flex flex-col font-vazir relative overflow-hidden"
    dir="rtl"
  >
    <!-- هاله‌های نوری مشابه صفحه لاگین (رفع یکنواختی و ایجاد عمق) -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none z-0">
      <div
        class="absolute -top-20 -right-20 w-[500px] h-[500px] bg-[#F57A9B]/10 rounded-full blur-[80px]"
      ></div>
      <div
        class="absolute top-[30%] -left-32 w-[600px] h-[600px] bg-[#DFA9C7]/15 rounded-full blur-[100px]"
      ></div>
      <div
        class="absolute -bottom-20 right-1/4 w-[400px] h-[400px] bg-[#EEDAC5]/20 rounded-full blur-[80px]"
      ></div>
    </div>

    <!-- افکت ترانزیشن -->
    <Transition mode="out-in" name="fade">
      <!-- ۱. صفحه بارگذاری -->
      <div
        v-if="homeStore.isLoading"
        class="relative z-10 flex-grow flex flex-col items-center justify-center min-h-[80vh] px-4 animate-fade-in-up"
      >
        <div class="relative flex justify-center items-center w-20 h-20 mb-6">
          <svg
            class="w-12 h-12 text-[#F57A9B] animate-spin drop-shadow-md"
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
        </div>
        <p class="text-[#333333] font-extrabold text-lg mb-1 tracking-tight">
          در حال آماده‌سازی...
        </p>
        <p class="text-[#777777] text-sm font-medium">تجربه زیبایی شما به زودی آغاز می‌شود</p>
      </div>

      <!-- ۲. نمایش خطا -->
      <div
        v-else-if="homeStore.error"
        class="relative z-10 flex-grow flex items-center justify-center min-h-[80vh] px-4 animate-fade-in-up"
      >
        <div
          class="bg-white/60 backdrop-blur-md rounded-[2.5rem] p-8 max-w-md w-full text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/50"
        >
          <div
            class="w-16 h-16 mx-auto bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mb-5 shadow-sm"
          >
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
              />
            </svg>
          </div>
          <h3 class="text-xl font-extrabold text-[#333333] mb-2 tracking-tight">
            خطا در دریافت اطلاعات
          </h3>
          <p class="text-[#777777] mb-6 text-sm leading-relaxed font-medium">
            {{ homeStore.error }}
          </p>
          <button
            class="relative w-full py-3 overflow-hidden font-bold text-white transition-all duration-300 rounded-xl bg-[#F57A9B] hover:bg-opacity-90 active:scale-[0.98] shadow-[0_8px_20px_-8px_rgba(242,124,154,0.6)] flex items-center justify-center gap-2"
            @click="fetchData"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
              />
            </svg>
            تلاش مجدد
          </button>
        </div>
      </div>

      <!-- ۳. محتوای اصلی صفحه -->
      <main v-else class="relative z-10 flex-grow flex flex-col pb-12 w-full animate-fade-in-up">
        <!-- هیرو (اسلایدر اصلی) -->
        <HomeHero v-if="homeStore.heroSlides?.length" :slides="homeStore.heroSlides" />

        <!-- ویژگی‌ها -->
        <HomeFeatures v-if="homeStore.features?.length" :features="homeStore.features" />

        <!-- دسته‌بندی‌ها (گلس‌مورفیسم مشابه پس‌زمینه فرم) -->
        <div
          class="w-full bg-white/40 backdrop-blur-md border-y border-white/60 shadow-[0_4px_30px_rgba(0,0,0,0.02)] mt-8"
        >
          <HomeCategories v-if="homeStore.categories?.length" :categories="homeStore.categories" />
        </div>

        <!-- اسلایدر محصولات -->
        <div class="flex flex-col gap-y-6 py-8">
          <HomeProductSlider
            v-if="homeStore.latestProducts?.length"
            :products="homeStore.latestProducts"
            link="/products?sort=latest"
            title="جدیدترین محصولات"
          />
          <HomeProductSlider
            v-if="homeStore.latestProducts?.length"
            :products="homeStore.latestProducts"
            link="/products?sort=Manual"
            title="پیشنهادات ویژه"
          />
        </div>

        <!-- بنرهای تبلیغاتی -->
        <HomePromoBanner v-if="homeStore.promoBanners?.length" :banners="homeStore.promoBanners" />

        <!-- مقالات صفحه اصلی -->
        <HomeBlog v-if="homeStore.latestPosts?.length" :posts="homeStore.latestPosts" />
      </main>
    </Transition>
  </div>
</template>

<script lang="ts" setup>
import { defineAsyncComponent, onMounted } from 'vue'
import { useHomeStore } from '@/stores/homeStore'

const HomeHero = defineAsyncComponent(() => import('./components/HomeHero.vue'))
const HomeFeatures = defineAsyncComponent(() => import('./components/HomeFeatures.vue'))
const HomeCategories = defineAsyncComponent(() => import('./components/HomeCategories.vue'))
const HomeProductSlider = defineAsyncComponent(() => import('./components/HomeProductSlider.vue'))
const HomePromoBanner = defineAsyncComponent(() => import('./components/HomePromoBanner.vue'))
const HomeBlog = defineAsyncComponent(() => import('./components/HomeBlog.vue'))

const homeStore = useHomeStore()

const fetchData = async () => {
  await homeStore.fetchHomeData()
}

onMounted(() => {
  if (!homeStore.latestProducts?.length) {
    fetchData()
  }
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.animate-fade-in-up {
  animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
