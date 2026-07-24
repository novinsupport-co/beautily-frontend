<template>
  <div v-if="badges && badges.length" class="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
    <div
      v-for="badge in badges"
      :key="badge.id"
      class="flex flex-col items-center justify-center p-4 bg-white rounded-2xl shadow-sm border border-[#F5F5F7] hover:border-[#F57A9B] hover:shadow-md transition-all duration-300 text-center gap-3 group"
    >
      <div class="w-12 h-12 flex items-center justify-center bg-slate-50 rounded-full group-hover:bg-rose-50 transition-colors">
        <!-- اصلاح کلید از image به icon -->
        <img v-if="badge.icon" :alt="badge.name" :src="badge.icon" class="w-7 h-7 object-contain" />
        <svg v-else class="h-6 w-6 text-slate-400 group-hover:text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" /></svg>
      </div>
      <span class="text-xs font-iransans-bold text-slate-600 group-hover:text-slate-800">{{ badge.name }}</span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  badges: {
    type: Array,
    default: () => []
  }
})
</script>
