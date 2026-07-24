<template>
  <div
    v-if="shortDescription"
    class="bg-white p-5 rounded-2xl shadow-sm border border-slate-100/80 relative mt-4 overflow-hidden group"
  >
    <div
      class="absolute right-0 top-0 bottom-0 w-1.5 bg-slate-200 group-hover:bg-slate-800 transition-colors duration-500"
    ></div>
    <p class="text-slate-500 font-iransans-medium leading-loose text-[13px] text-justify pl-2 pr-4">
      {{ shortDescription }}
    </p>
  </div>
</template>

<script setup>
defineProps({
  shortDescription: {
    type: String,
    default: null,
  },
})
</script>
