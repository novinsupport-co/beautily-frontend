<template>
  <div v-if="content" class="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden">
    <!-- نوار تزئینی کنار کادر -->
    <div class="absolute right-0 top-0 bottom-0 w-1 bg-rose-400 opacity-80"></div>

    <div
      class="prose prose-slate max-w-none font-iransans leading-relaxed text-slate-600 prose-headings:font-iransans-black prose-headings:text-slate-800 prose-a:text-rose-500 prose-a:no-underline hover:prose-a:text-rose-600 prose-img:rounded-xl text-[14px]"
      v-html="content"
    ></div>
  </div>
  <div v-else class="flex flex-col items-center justify-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-slate-400">
    <svg class="h-10 w-10 mb-3 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" /></svg>
    <span class="font-iransans-medium text-sm">نقد و بررسی تخصصی برای این محصول ثبت نشده است.</span>
  </div>
</template>

<script setup>
defineProps({
  content: {
    type: String,
    default: '',
  },
})
</script>
