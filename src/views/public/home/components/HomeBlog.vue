<template>
  <!-- استفاده از relative و حذف بک‌گراند سالید جهت هماهنگی با لایه‌های شیشه‌ای والد -->
  <section class="py-20 relative overflow-hidden z-10">
    <!-- هاله نورانی پس‌زمینه اختصاصی این بخش -->
    <div
      class="absolute top-0 right-0 w-80 h-80 bg-[#EEDAC5]/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none"
    ></div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <!-- هدر بخش مقالات -->
      <div class="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-6">
        <div class="relative pr-4">
          <!-- خط تزئینی عمودی با گرادیان سافت -->
          <div
            class="absolute right-0 top-1.5 w-1.5 h-10 bg-gradient-to-b from-[#F57A9B] to-[#DFA9C7] rounded-full shadow-[0_2px_8px_rgba(245,122,155,0.4)]"
          ></div>
          <h2 class="text-2xl sm:text-4xl font-extrabold text-[#333333] mb-3 tracking-tight">
            مجله زیبایی
            <span class="text-transparent bg-clip-text bg-gradient-to-l from-[#F57A9B] to-[#DFA9C7]"
              >Beautily</span
            >
          </h2>
          <p class="text-[#777777] text-sm sm:text-base font-medium">
            جدیدترین ترفندها و مقالات آموزشی مراقبت از پوست و مو
          </p>
        </div>

        <!-- دکمه دسکتاپ شیشه‌ای یکپارچه -->
        <router-link
          class="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 bg-white/40 backdrop-blur-sm rounded-xl border border-white/50 text-[#333333] hover:text-[#F57A9B] hover:bg-white/70 hover:shadow-md transition-all duration-300 font-bold group"
          to="/blog"
        >
          مشاهده همه
          <svg
            class="h-4 w-4 transform transition-transform duration-300 group-hover:-translate-x-1"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
            viewBox="0 0 24 24"
          >
            <path d="M15 19l-7-7 7-7" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </router-link>
      </div>

      <!-- گرید مقالات -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <article
          v-for="post in posts"
          :key="post.id"
          class="bg-white/40 backdrop-blur-md rounded-[2.5rem] overflow-hidden border border-white/60 group flex flex-col transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(242,124,154,0.25)] hover:border-[#F57A9B]/40"
        >
          <!-- تصویر مقاله با کانتینر منحنی داخلی -->
          <div
            class="relative overflow-hidden aspect-[4/3] bg-[#E9DDD2] m-3 rounded-[2rem] shadow-inner"
          >
            <img
              v-if="getImage(post)"
              :alt="post.title"
              :src="getImage(post)"
              class="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              loading="lazy"
            />
            <div
              v-else
              class="w-full h-full flex flex-col items-center justify-center text-[#777777]/50 gap-2"
            >
              <svg
                class="w-10 h-10 text-[#777777]/40"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.5"
                ></path>
              </svg>
              <span class="text-xs font-bold">بدون تصویر</span>
            </div>

            <!-- لایه رنگی روی تصویر در حالت Hover -->
            <div
              class="absolute inset-0 bg-gradient-to-tr from-[#F57A9B]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            ></div>

            <!-- بج دسته‌بندی شیشه‌ای روی تصویر -->
            <div v-if="getCategory(post)" class="absolute top-4 right-4 z-10">
              <span
                class="bg-white/80 backdrop-blur-md text-[#333333] text-xs font-extrabold px-4 py-2 rounded-2xl shadow-sm border border-white"
              >
                {{ getCategory(post) }}
              </span>
            </div>
          </div>

          <!-- محتوای مقاله -->
          <div class="px-8 pb-8 pt-4 flex flex-col flex-grow relative">
            <!-- متادیتا با استایل سافت -->
            <div class="flex items-center text-xs text-[#777777] mb-4 gap-3 font-medium">
              <span
                v-if="post.created_at || post.date"
                class="flex items-center bg-white/50 backdrop-blur-sm border border-white/40 px-3 py-1.5 rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.01)]"
              >
                <svg
                  class="h-4 w-4 ml-1.5 text-[#F57A9B]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                  />
                </svg>
                {{ post.created_at || post.date }}
              </span>

              <span
                v-if="post.reading_time || post.readingTime"
                class="flex items-center bg-white/50 backdrop-blur-sm border border-white/40 px-3 py-1.5 rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.01)]"
              >
                <svg
                  class="h-4 w-4 ml-1.5 text-[#F57A9B]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                  />
                </svg>
                {{ post.reading_time || post.readingTime }} دقیقه مطالعه
              </span>
            </div>

            <!-- عنوان -->
            <h3
              class="text-lg sm:text-xl font-extrabold text-[#333333] mb-3 line-clamp-2 leading-snug group-hover:text-[#F57A9B] transition-colors duration-300"
            >
              <router-link :to="`/blog/${post.slug}`" class="focus:outline-none">
                <span aria-hidden="true" class="absolute inset-0"></span>
                {{ post.title }}
              </router-link>
            </h3>

            <!-- خلاصه مقاله -->
            <p
              class="text-[#777777] text-sm leading-relaxed line-clamp-3 mb-6 flex-grow font-medium"
            >
              {{ post.excerpt || post.summary || '' }}
            </p>

            <!-- بخش پایینی کارت و دکمه ادامه مطلب -->
            <div
              class="mt-auto pt-4 border-t border-white/40 flex items-center justify-between relative z-20"
            >
              <span
                class="text-sm font-bold text-[#F57A9B] group-hover:text-[#DFA9C7] transition-colors flex items-center gap-1.5"
              >
                ادامه مطلب
                <svg
                  class="h-4 w-4 transform transition-transform duration-300 group-hover:-translate-x-1.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M15 19l-7-7 7-7"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2.5"
                  />
                </svg>
              </span>
            </div>
          </div>
        </article>
      </div>

      <!-- دکمه مشاهده همه برای موبایل با افکت شیشه‌ای تعاملی -->
      <div class="mt-12 text-center sm:hidden">
        <router-link
          class="inline-flex items-center justify-center px-6 py-4 rounded-[1.5rem] bg-white/50 backdrop-blur-md border border-white/60 text-[#F57A9B] font-bold w-full shadow-sm active:scale-95 transition-all duration-300"
          to="/blog"
        >
          مشاهده همه مقالات
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

interface Post {
  id: number | string
  title: string
  slug: string
  excerpt?: string
  summary?: string
  image?: string
  image_url?: string
  category?: string | { id: number; name: string; title?: string }
  date?: string
  created_at?: string
  readingTime?: number | string
  reading_time?: number | string
}

defineProps({
  posts: {
    type: Array as PropType<Post[]>,
    required: true,
    default: () => [],
  },
})

const getImage = (post: Post): string => {
  return post.image_url || post.image || ''
}

const getCategory = (post: Post): string => {
  if (!post.category) return ''
  if (typeof post.category === 'object') {
    return post.category.title || post.category.name || ''
  }
  return post.category
}
</script>

<style scoped>
/* ترنزیشن روان برای لینک‌ها و عناوین */
h3 a {
  transition: color 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
