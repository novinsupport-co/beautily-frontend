<template>
  <section class="w-full relative px-4 sm:px-6 lg:px-8 pt-6 pb-4 group">
    <Swiper
      :autoplay="{ delay: 5000, disableOnInteraction: false }"
      :loop="slides && slides.length > 1"
      :modules="[Autoplay, Pagination, Navigation]"
      :slides-per-view="1"
      class="w-full h-[450px] md:h-[600px] lg:h-[650px] hero-swiper rounded-[2.5rem] overflow-hidden shadow-[0_15px_40px_-15px_rgba(0,0,0,0.15)] border border-white/50"
      navigation
      pagination
    >
      <SwiperSlide v-for="(slide, index) in slides" :key="index">
        <div class="relative w-full h-full flex items-center">
          <!-- تصویر بک‌گراند اسلاید با افکت زوم ملایم -->
          <img
            :alt="slide.title || 'بنر بیوتیلی'"
            :src="slide.image_url"
            class="absolute inset-0 w-full h-full object-cover object-center animate-image-pan"
            loading="lazy"
          />

          <!-- لایه تاریک/گرادیان شیشه‌ای ملایم -->
          <div
            class="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-l from-gray-900/60 via-gray-900/20 to-transparent"
          ></div>

          <!-- محتوای متنی اسلاید محصور در باکس شیشه‌ای -->
          <div
            class="relative z-10 container mx-auto px-6 lg:px-12 flex flex-col justify-center h-full text-right"
          >
            <div
              class="max-w-2xl transform transition-all duration-700 translate-y-0 opacity-100 bg-white/10 backdrop-blur-md border border-white/20 p-8 md:p-10 rounded-[2rem] shadow-lg"
            >
              <h2
                v-if="slide.title"
                class="text-3xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4 drop-shadow-md leading-tight tracking-tight"
              >
                {{ slide.title }}
              </h2>

              <p
                v-if="slide.subtitle"
                class="text-base md:text-xl text-[#FDFBF9] mb-8 font-medium drop-shadow-sm opacity-90 line-clamp-2"
              >
                {{ slide.subtitle }}
              </p>

              <router-link
                v-if="slide.cta_link"
                :to="slide.cta_link"
                class="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-[#F57A9B] text-white text-base font-bold rounded-xl hover:bg-opacity-90 active:scale-[0.98] transition-all duration-300 shadow-[0_8px_20px_-8px_rgba(242,124,154,0.6)]"
              >
                <span>{{ slide.cta_text || 'مشاهده محصولات' }}</span>
                <svg
                  class="h-5 w-5 rtl:rotate-180 transition-transform group-hover:translate-x-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    clip-rule="evenodd"
                    d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                    fill-rule="evenodd"
                  />
                </svg>
              </router-link>
            </div>
          </div>
        </div>
      </SwiperSlide>
    </Swiper>
  </section>
</template>

<script lang="ts" setup>
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Autoplay, Navigation, Pagination } from 'swiper/modules'

import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'

interface Slide {
  image_url: string
  title?: string
  subtitle?: string
  cta_link?: string
  cta_text?: string
}

defineProps<{
  slides: Slide[]
}>()
</script>

<style scoped>
@keyframes image-pan {
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(1.05);
  }
}
.animate-image-pan {
  animation: image-pan 20s ease-in-out infinite alternate;
}

:deep(.swiper-button-next::after),
:deep(.swiper-button-prev::after),
:deep(.swiper-button-next::before),
:deep(.swiper-button-prev::before) {
  content: none !important;
  display: none !important;
}

:deep(.swiper-button-next),
:deep(.swiper-button-prev) {
  --swiper-navigation-size: 0px !important;
  color: transparent !important;
  background-color: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(8px);
  width: 48px;
  height: 48px;
  border-radius: 50%;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background-repeat: no-repeat;
  background-position: center;
  background-size: 20px;
  border: 1px solid rgba(255, 255, 255, 0.4);
}

:deep(.swiper-button-next:hover),
:deep(.swiper-button-prev:hover) {
  background-color: #f57a9b;
  border-color: #f57a9b;
  transform: scale(1.05);
  box-shadow: 0 8px 20px -8px rgba(242, 124, 154, 0.6);
}

:deep(.swiper-rtl .swiper-button-prev) {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23333333'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2.5' d='M9 5l7 7-7 7'/%3E%3C/svg%3E");
}
:deep(.swiper-rtl .swiper-button-prev:hover) {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23ffffff'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2.5' d='M9 5l7 7-7 7'/%3E%3C/svg%3E");
}

:deep(.swiper-rtl .swiper-button-next) {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23333333'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2.5' d='M15 19l-7-7 7-7'/%3E%3C/svg%3E");
}
:deep(.swiper-rtl .swiper-button-next:hover) {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23ffffff'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2.5' d='M15 19l-7-7 7-7'/%3E%3C/svg%3E");
}
</style>
