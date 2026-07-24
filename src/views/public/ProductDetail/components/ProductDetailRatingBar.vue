<template>
  <!-- Rating, Comments, Questions Bar -->
  <div
    class="flex items-center justify-center sm:justify-start gap-4 bg-white px-6 py-3.5 rounded-2xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.03)] border border-slate-100/80"
  >
    <!-- بخش ستاره‌ها و امتیاز -->
    <div
      :title="`امتیاز ${toPersianDigits(product?.rating || 0)} از ۵`"
      class="flex items-center gap-1.5 cursor-help"
    >
      <div class="flex items-center gap-0.5" dir="ltr">
        <svg
          v-for="i in 5"
          :key="i"
          :class="i <= Math.round(product?.rating || 0) ? 'text-amber-400' : 'text-slate-200'"
          class="w-4 h-4 fill-current transition-colors duration-300"
          viewBox="0 0 20 20"
        >
          <path
            d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
          />
        </svg>
      </div>
      <span class="text-xs font-iransans-black pt-0.5 text-slate-700">
        {{ toPersianDigits(product?.rating || 0) }}
      </span>
    </div>

    <div class="w-1.5 h-1.5 bg-slate-200 rounded-full"></div>

    <!-- تعداد دیدگاه‌ها -->
    <button
      class="text-[11px] font-iransans-bold text-slate-500 hover:text-rose-500 transition-colors"
      @click="$emit('updateTab', 'reviews')"
    >
      دیدگاه‌ها ({{ toPersianDigits(product?.reviews_count || 0) }})
    </button>

    <div class="w-1.5 h-1.5 bg-slate-200 rounded-full"></div>

    <!-- تعداد پرسش‌ها -->
    <button
      class="text-[11px] font-iransans-bold text-slate-500 hover:text-rose-500 transition-colors"
      @click="$emit('updateTab', 'questions')"
    >
      پرسش‌ها ({{ toPersianDigits(product?.questions_count || 0) }})
    </button>
  </div>
</template>

<script setup>
import { toPersianDigits } from '@/utils/helpers'

defineProps({
  product: {
    type: Object,
    default: () => ({}),
  },
})

defineEmits(['updateTab'])
</script>
