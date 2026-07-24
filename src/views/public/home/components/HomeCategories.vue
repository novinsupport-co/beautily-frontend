<template>
  <!-- استفاده از relative و حذف پس‌زمینه سالید برای هماهنگی با لایه شیشه‌ای والد -->
  <section v-if="categories && categories.length" class="py-12 lg:py-20 relative w-full z-10">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- هدر بخش -->
      <div class="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
        <div class="relative pr-4">
          <!-- المان تزئینی کوچک کناری با استایل گرادیان سافت -->
          <div
            class="absolute right-0 top-1 w-1.5 h-10 bg-gradient-to-b from-[#F57A9B] to-[#DFA9C7] rounded-full shadow-[0_2px_8px_rgba(245,122,155,0.4)]"
          ></div>

          <h2 class="text-xl sm:text-3xl font-extrabold text-[#333333] mb-2 tracking-tight">
            دسته‌بندی‌های محبوب
          </h2>
          <p class="text-[#777777] text-sm sm:text-base font-medium">
            محصولات مورد نیاز خود را سریع‌تر پیدا کنید
          </p>
        </div>

        <!-- دکمه دسکتاپ شیشه‌ای یکپارچه -->
        <router-link
          class="hidden sm:flex items-center gap-1.5 px-4 py-2 text-sm font-bold text-[#F57A9B] bg-white/40 backdrop-blur-sm rounded-xl border border-white/50 shadow-sm hover:bg-white/70 hover:shadow-md transition-all duration-300 group"
          to="/categories"
        >
          مشاهده همه
          <svg
            class="h-4 w-4 transform transition-transform duration-300 group-hover:-translate-x-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M15 19l-7-7 7-7"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2.5"
            />
          </svg>
        </router-link>
      </div>

      <!-- گرید دسته‌بندی‌ها -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-12 lg:gap-10 text-center">
        <router-link
          v-for="category in categories"
          :key="category.id"
          :to="`/category/${category.slug}`"
          class="group block outline-none"
        >
          <!-- کانتینر دایره‌ای با قاب شیشه‌ای دولایه و افکت Glow رنگی در حالت Hover -->
          <div
            class="relative mb-6 mx-auto w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 rounded-full p-2 bg-white/60 backdrop-blur-md shadow-[0_8px_30px_rgba(0,0,0,0.04)] group-hover:shadow-[0_20px_40px_rgba(242,124,154,0.35)] border border-white/70 transition-all duration-500 ease-out group-hover:-translate-y-2 group-focus-visible:ring-4 group-focus-visible:ring-[#F57A9B]/40"
          >
            <!-- ماسک داخلی تصویر با پس‌زمینه ملایم خاکی/کرم -->
            <div
              class="w-full h-full rounded-full overflow-hidden relative bg-[#E9DDD2] shadow-inner"
            >
              <!-- لایه رنگی روی تصویر در هاور -->
              <div
                class="absolute inset-0 bg-gradient-to-tr from-[#F57A9B]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 pointer-events-none"
              ></div>
              <img
                :alt="category.name"
                :src="getImage(category)"
                class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
                loading="lazy"
              />
            </div>

            <!-- بج شیشه‌ای تعداد محصولات با خوانایی بالا -->
            <div class="absolute -bottom-3 left-1/2 -translate-x-1/2 z-20">
              <span
                class="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-white/90 backdrop-blur-md text-xs font-bold text-[#777777] group-hover:text-[#F57A9B] border border-white shadow-[0_4px_12px_rgba(0,0,0,0.05)] transition-all duration-300 whitespace-nowrap"
              >
                {{ category.count || category.products_count || 0 }} محصول
              </span>
            </div>
          </div>

          <!-- نام دسته‌بندی با افکت هاور هماهنگ -->
          <h3
            class="text-lg font-bold text-[#333333] group-hover:text-[#F57A9B] transition-colors duration-300 mt-2"
          >
            {{ category.name }}
          </h3>
        </router-link>
      </div>

      <!-- دکمه موبایل شیشه‌ای اختصاصی -->
      <div class="mt-12 text-center sm:hidden">
        <router-link
          class="inline-flex items-center justify-center px-6 py-4 rounded-[1.5rem] bg-white/50 backdrop-blur-md border border-white/60 text-[#F57A9B] font-bold w-full shadow-sm active:scale-95 transition-all duration-300"
          to="/categories"
        >
          مشاهده همه دسته‌بندی‌ها
          <svg class="h-4 w-4 ms-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              d="M15 19l-7-7 7-7"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2.5"
            />
          </svg>
        </router-link>
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
import type { PropType } from 'vue'

interface Category {
  id: number | string
  name: string
  slug: string
  count?: string | number
  products_count?: string | number
  image?: string
  image_url?: string
}

defineProps({
  categories: {
    type: Array as PropType<Category[]>,
    required: true,
    default: () => [],
  },
})

// دریافت ایمن تصویر با بک‌فال بک مناسب
const getImage = (category: Category): string => {
  return category.image_url || category.image || '/default-category.png'
}
</script>

<style scoped>
/* اضافه کردن افکت ترنزیشن کلی به عناصر متنی */
h3 {
  transition: color 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
