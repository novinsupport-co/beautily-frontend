<template>
  <div v-if="ingredients && ingredients.length" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
    <div
      v-for="ingredient in ingredients"
      :key="ingredient.id"
      class="group flex flex-col p-4 bg-white border border-[#EEDAC5]/50 rounded-2xl hover:shadow-md hover:border-[#DFA9C7] transition-all duration-300 cursor-default"
    >
      <div class="flex items-center gap-3 mb-2">
        <!-- آیکون پیش‌فرض در صورت نبود آیکون ترکیب -->
        <div class="w-8 h-8 rounded-full bg-[#F5F5F7] flex items-center justify-center text-rose-400 group-hover:bg-rose-50 group-hover:text-rose-500 transition-colors">
          <img v-if="ingredient.icon" :src="ingredient.icon" class="w-5 h-5 object-contain" />
          <svg v-else class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path clip-rule="evenodd" d="M7 2a1 1 0 00-.707 1.707L7 4.414v3.758a1 1 0 01-.293.707l-4 4C.817 14.769 2.156 18 4.828 18h10.343c2.673 0 4.012-3.231 2.122-5.121l-4-4A1 1 0 0113 8.172V4.414l.707-.707A1 1 0 0013 2H7zm2 6.172V4h2v4.172a3 3 0 00.879 2.12l1.027 1.028a4 4 0 00-2.171.102l-.47.156a4 4 0 01-2.53 0l-.563-.187a1.993 1.993 0 00-.114-.035l1.063-1.063A3 3 0 009 8.172z" fill-rule="evenodd" /></svg>
        </div>
        <span class="text-sm font-iransans-bold text-slate-700">{{ ingredient.name }}</span>
      </div>
      <span v-if="ingredient.inci_name" class="text-[11px] text-slate-400 font-sans tracking-wide mt-auto uppercase">
        {{ ingredient.inci_name }}
      </span>
    </div>
  </div>
  <div v-else class="flex flex-col items-center justify-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-slate-400">
    <svg class="h-10 w-10 mb-3 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" /></svg>
    <span class="font-iransans-medium text-sm">ترکیباتی برای این محصول ثبت نشده است.</span>
  </div>
</template>

<script setup>
defineProps({
  ingredients: {
    type: Array,
    default: () => [],
  },
})
</script>
