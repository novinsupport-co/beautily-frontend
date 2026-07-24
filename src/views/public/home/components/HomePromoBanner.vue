<template>
  <section v-if="banners && banners.length" class="py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
        <div
          v-for="(banner, index) in banners"
          :key="banner.id"
          :class="[
            'relative overflow-hidden rounded-[2rem] group flex items-center justify-between p-8 sm:p-10 h-[260px] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_15px_40px_-15px_rgba(0,0,0,0.1)] border border-white/50',
            getBgColor(banner, index),
          ]"
        >
          <!-- افکت نوری پس‌زمینه برای عمق بیشتر بنر -->
          <div
            class="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent opacity-50 z-0 pointer-events-none"
          ></div>

          <div class="relative z-10 w-2/3 pr-2">
            <span
              v-if="banner.badge || getBadge(banner)"
              :class="[
                'inline-block px-3.5 py-1.5 mb-4 text-xs font-bold text-white rounded-xl shadow-sm',
                getBadgeColor(banner, index),
              ]"
            >
              {{ banner.badge || getBadge(banner) }}
            </span>
            <h3
              class="text-2xl font-extrabold text-[#333333] mb-2.5 leading-tight tracking-tight"
              v-html="banner.title"
            ></h3>
            <p
              v-if="banner.subtitle || banner.description"
              class="text-[#777777] text-sm font-medium mb-6 line-clamp-2"
            >
              {{ banner.subtitle || banner.description }}
            </p>
            <router-link
              v-if="getLink(banner)"
              :to="getLink(banner)"
              class="inline-flex items-center text-sm font-bold text-[#333333] hover:text-[#F57A9B] transition-colors group/link"
            >
              {{ banner.linkText || 'مشاهده محصولات' }}
              <svg
                class="h-4 w-4 mr-1.5 transform transition-transform group-hover/link:-translate-x-1"
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

          <div
            v-if="getImage(banner)"
            class="absolute left-0 top-0 w-[55%] h-full transition-transform duration-700 ease-out group-hover:scale-105 origin-left z-0"
          >
            <img
              :alt="banner.title"
              :src="getImage(banner)"
              class="w-full h-full object-cover rounded-l-[2rem] mask-image-gradient"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
import type { PropType } from 'vue'

interface Banner {
  id: number | string
  title: string
  description?: string
  subtitle?: string
  url?: string
  link?: string
  image?: string
  image_url?: string
  badge?: string
  bgColorClass?: string
  badgeColorClass?: string
  linkText?: string
}

defineProps({
  banners: {
    type: Array as PropType<Banner[]>,
    required: true,
    default: () => [],
  },
})

const getImage = (banner: Banner): string => {
  return banner.image_url || banner.image || ''
}

const getLink = (banner: Banner): string => {
  return banner.url || banner.link || '#'
}

const getBadge = (banner: Banner): string => {
  return 'پیشنهاد ویژه'
}

const getBgColor = (banner: Banner, index: number): string => {
  if (banner.bgColorClass) return banner.bgColorClass
  // رنگ‌های ملایم سازمانی
  const colors = ['bg-[#EEDAC5]/60', 'bg-[#E9DDD2]/60', 'bg-[#DFA9C7]/20']
  return colors[index % colors.length]
}

const getBadgeColor = (banner: Banner, index: number): string => {
  if (banner.badgeColorClass) return banner.badgeColorClass
  const colors = ['bg-[#F57A9B]', 'bg-[#BC846C]', 'bg-[#333333]']
  return colors[index % colors.length]
}
</script>

<style scoped>
.mask-image-gradient {
  -webkit-mask-image: linear-gradient(to right, rgba(0, 0, 0, 1) 40%, transparent 100%);
  mask-image: linear-gradient(to right, rgba(0, 0, 0, 1) 40%, transparent 100%);
}
</style>
