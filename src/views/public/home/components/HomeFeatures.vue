<script lang="ts" setup>
// ۱. تعریف اینترفیس برای ساختار دیتای هر ویژگی (تایپ‌اسکریپت)
export interface Feature {
  id: number
  title: string
  description: string
  icon: string // رشته حاوی کدهای SVG
}

// ۲. تعریف پراپس برای دریافت دیتا از کامپوننت والد (HomeView.vue)
defineProps<{
  features?: Feature[] | null
}>()
</script>

<template>
  <section class="py-16 relative overflow-hidden z-10">
    <div class="container mx-auto px-4 lg:px-8">
      <!-- بررسی وجود دیتا برای جلوگیری از خطای رندر -->
      <div
        v-if="features && features.length > 0"
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 xl:gap-8"
      >
        <!-- حلقه روی ویژگی‌ها -->
        <div
          v-for="feature in features"
          :key="feature.id"
          class="group relative flex flex-col items-center text-center p-8 bg-white/40 backdrop-blur-md border border-white/60 rounded-[2.5rem] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(242,124,154,0.3)] hover:border-[#F57A9B]/40 overflow-hidden"
        >
          <!-- هاله رنگی تزئینی در بک‌گراند کارت -->
          <div
            class="absolute -top-12 -right-12 w-32 h-32 bg-gradient-to-br from-[#F57A9B]/10 to-[#DFA9C7]/20 rounded-full blur-2xl transition-all duration-700 group-hover:scale-150 group-hover:opacity-100 opacity-60 z-0"
          ></div>

          <!-- محفظه آیکون شیشه‌ای با افکت هاور تعاملی -->
          <div
            class="relative z-10 w-20 h-20 mb-6 flex items-center justify-center rounded-2xl bg-white/80 backdrop-blur-sm shadow-[0_8px_20px_rgba(0,0,0,0.03)] border border-white text-[#F57A9B] transition-all duration-500 group-hover:scale-110 group-hover:-rotate-6 group-hover:bg-[#F57A9B] group-hover:text-white [&>svg]:w-9 [&>svg]:h-9 [&>svg]:transition-colors [&>svg]:duration-300"
            v-html="feature.icon"
          ></div>

          <!-- عنوان با تغییر رنگ ملایم -->
          <h3
            class="relative z-10 text-xl font-extrabold mb-3 text-[#333333] transition-colors duration-300 group-hover:text-[#F57A9B]"
          >
            {{ feature.title }}
          </h3>

          <!-- توضیحات -->
          <p class="relative z-10 text-sm text-[#777777] font-medium leading-relaxed">
            {{ feature.description }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* انیمیشن چرخش و تغییر رنگ یکپارچه در فایل‌های استایل گلوبال هندل می‌شود */
</style>
