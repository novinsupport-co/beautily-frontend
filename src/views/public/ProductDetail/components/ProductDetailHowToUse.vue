<template>
  <div v-if="content" class="bg-[#F5F5F7] p-6 rounded-2xl border border-slate-100 relative overflow-hidden">
    <div class="absolute right-0 top-0 bottom-0 w-1 bg-[#DFA9C7]"></div>
    <div
      class="prose prose-slate max-w-none font-iransans leading-relaxed text-slate-600 prose-headings:font-iransans-black prose-a:text-rose-500 text-[14px]"
      v-html="content"
    ></div>
  </div>
  <div v-else class="flex flex-col items-center justify-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-slate-400">
    <svg class="h-10 w-10 mb-3 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" /></svg>
    <span class="font-iransans-medium text-sm">آموزش استفاده برای این محصول ثبت نشده است.</span>
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
