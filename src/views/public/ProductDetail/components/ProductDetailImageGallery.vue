<template>
  <div class="flex flex-col gap-4 w-full">
    <!-- Main Image Box with Floating Icons -->
    <div
      class="relative aspect-square sm:aspect-[4/3] lg:aspect-square bg-gradient-to-tr from-slate-100/60 via-slate-50 to-slate-100/60 rounded-[2rem] shadow-sm border border-slate-200/50 overflow-hidden group flex items-center justify-center"
    >
      <!-- Dotted Background Pattern -->
      <div
        class="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:24px_24px] opacity-40"
      ></div>

      <!-- Product Image -->
      <img
        :alt="product?.name"
        :src="
          activeImage || product?.images?.thumbnail?.urls?.large || product?.images?.thumbnail?.url
        "
        class="relative z-0 w-3/4 h-3/4 object-contain p-4 transition-transform duration-700 ease-out group-hover:scale-110 drop-shadow-2xl"
      />

      <!-- Discount Badge -->
      <div
        v-if="displayDiscountPercent > 0"
        class="absolute top-6 left-6 bg-gradient-to-r from-rose-500 to-rose-400 text-white font-iransans-black text-[11px] px-4 py-2 rounded-2xl rounded-tl-sm shadow-lg shadow-rose-500/30 z-10 flex items-center gap-1.5"
      >
        <span>{{ toPersianDigits(displayDiscountPercent) }}٪ تخفیف</span>
      </div>

      <!-- Floating Action Buttons -->
      <div class="absolute top-6 right-6 flex flex-col gap-3 z-20">
        <!-- Share -->
        <button
          class="group/btn relative w-11 h-11 bg-white/80 hover:bg-slate-900 backdrop-blur-md rounded-2xl flex items-center justify-center text-slate-500 hover:text-purple-500 transition-all duration-300 shadow-sm border border-slate-100/50"
          @click="$emit('share')"
        >
          <svg
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
            viewBox="0 0 24 24"
          >
            <path
              d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <span
            class="absolute right-14 opacity-0 translate-x-2 group-hover/btn:translate-x-0 group-hover/btn:opacity-100 transition-all duration-300 bg-purple-500 text-white text-[10px] font-iransans-bold py-2 px-3 rounded-xl whitespace-nowrap pointer-events-none shadow-xl"
          >
            اشتراک‌گذاری
          </span>
        </button>

        <!-- Price Chart -->
        <button
          class="group/btn relative w-11 h-11 bg-white/80 hover:bg-slate-900 backdrop-blur-md rounded-2xl flex items-center justify-center text-slate-500 hover:text-purple-500 transition-all duration-300 shadow-sm border border-slate-100/50"
          @click="$emit('showPriceChart')"
        >
          <svg
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
            viewBox="0 0 24 24"
          >
            <path
              d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <span
            class="absolute right-14 opacity-0 translate-x-2 group-hover/btn:translate-x-0 group-hover/btn:opacity-100 transition-all duration-300 bg-purple-500 text-white text-[10px] font-iransans-bold py-2 px-3 rounded-xl whitespace-nowrap pointer-events-none shadow-xl"
          >
            نمودار قیمت
          </span>
        </button>

        <!-- Favorite -->
        <button
          :class="[
            'group/btn relative w-11 h-11 backdrop-blur-md rounded-2xl flex items-center justify-center transition-all duration-300 shadow-sm border',
            product?.is_favorited
              ? 'bg-rose-50 border-rose-200 text-rose-500'
              : 'bg-white/80 hover:bg-slate-900 border-slate-100/50 text-slate-500 hover:text-rose-500',
          ]"
          :disabled="isTogglingFavorite"
          @click="$emit('toggleFavorite')"
        >
          <svg
            :class="[
              'w-5 h-5 transition-all duration-300',
              product?.is_favorited ? 'fill-current scale-110' : 'fill-none',
            ]"
            stroke="currentColor"
            stroke-width="1.8"
            viewBox="0 0 24 24"
          >
            <path
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <span
            :class="[
              'absolute right-14 opacity-0 translate-x-2 group-hover/btn:translate-x-0 group-hover/btn:opacity-100 transition-all duration-300 text-white text-[10px] font-iransans-bold py-2 px-3 rounded-xl whitespace-nowrap pointer-events-none shadow-xl',
              product?.is_favorited ? 'bg-rose-500' : 'bg-slate-800',
            ]"
          >
            {{ product?.is_favorited ? 'حذف از علاقه‌مندی‌ها' : 'افزودن به علاقه‌مندی‌ها' }}
          </span>
        </button>
      </div>
    </div>

    <!-- Dock Style Gallery Slider -->
    <div v-if="product?.images" class="flex justify-center w-full mt-2">
      <div
        class="bg-white/80 backdrop-blur-xl border border-slate-200/60 p-2 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex gap-2 overflow-x-auto no-scrollbar max-w-full"
      >
        <div
          v-for="(img, idx) in [product.images.thumbnail, ...(product.images.gallery || [])]"
          :key="idx"
          :class="
            activeImage === (img?.urls?.large || img?.url || img)
              ? 'ring-2 ring-slate-900 shadow-md bg-white scale-[1.02]'
              : 'bg-slate-50 hover:bg-white hover:shadow-sm opacity-70 hover:opacity-100 border border-transparent'
          "
          class="relative w-16 h-16 sm:w-[72px] sm:h-[72px] flex-shrink-0 rounded-xl cursor-pointer transition-all duration-300 p-1.5 overflow-hidden group/thumb"
          @click="$emit('update:activeImage', img?.urls?.large || img?.url || img)"
        >
          <img
            v-if="img"
            :src="img.urls?.thumb || img.url || img"
            class="w-full h-full object-contain transition-transform duration-500 group-hover/thumb:scale-110"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// تغییر نام موقت هنگام ایمپورت برای جلوگیری از تداخل
import { toPersianDigits as _toPersianDigits } from '@/utils/helpers.js'

// ارجاع به تابع تا ادیتور آن را بی‌استفاده تشخیص ندهد و پاک نکند
const toPersianDigits = _toPersianDigits

defineProps({
  product: {
    type: Object,
    required: true,
  },
  activeImage: {
    type: String,
    default: null,
  },
  displayDiscountPercent: {
    type: Number,
    default: 0,
  },
  isTogglingFavorite: {
    type: Boolean,
    default: false,
  },
})

defineEmits(['toggleFavorite', 'share', 'showPriceChart', 'update:activeImage'])
</script>
