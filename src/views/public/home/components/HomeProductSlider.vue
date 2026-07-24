<template>
  <section class="py-4 relative z-10 w-full">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- هدر اسلایدر -->
      <div class="flex items-center justify-between mb-8 border-b border-[#EEDAC5]/40 pb-4">
        <h2 class="text-xl md:text-2xl font-extrabold text-[#333333] tracking-tight relative">
          {{ title }}
          <span
            class="absolute -bottom-[17px] right-0 w-3/4 h-1 bg-[#F57A9B] rounded-t-xl shadow-[0_2px_10px_rgba(245,122,155,0.4)]"
          ></span>
        </h2>
        <router-link
          :to="link"
          class="group flex items-center gap-1.5 px-4 py-2 text-sm font-bold text-[#F57A9B] bg-white/40 backdrop-blur-sm rounded-xl border border-white/50 shadow-sm hover:bg-white/70 hover:shadow-md transition-all duration-300"
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

      <!-- بدنه اسلایدر -->
      <Swiper
        :breakpoints="{
          '480': { slidesPerView: 2.2, spaceBetween: 16 },
          '768': { slidesPerView: 3.2, spaceBetween: 24 },
          '1024': { slidesPerView: 4, spaceBetween: 24 },
          '1280': { slidesPerView: 5, spaceBetween: 24 },
        }"
        :free-mode="true"
        :modules="[Navigation, FreeMode]"
        :slides-per-view="1.2"
        :space-between="16"
        class="pb-8 !px-2"
        dir="rtl"
      >
        <SwiperSlide v-for="product in products" :key="product.id" class="h-auto">
          <!-- فرض بر این است که ProductCard خود دارای استایل یکپارچه است -->
          <ProductCard
            :product="product"
            class="h-full transition-transform duration-300 hover:-translate-y-1"
          />
        </SwiperSlide>
      </Swiper>
    </div>
  </section>
</template>

<script lang="ts" setup>
import type { PropType } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { FreeMode, Navigation } from 'swiper/modules'
import ProductCard from '@/components/products/ProductCard.vue'

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/free-mode'

interface Product {
  id: number | string
  [key: string]: any
}

defineProps({
  title: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    default: '/products',
  },
  products: {
    type: Array as PropType<Product[]>,
    default: () => [],
  },
})
</script>

<style scoped>
.swiper {
  padding-bottom: 1.5rem;
}
</style>
