<template>
  <div>
    <div v-if="availableAttributes.length > 0" class="space-y-6">
      <div v-for="attr in availableAttributes" :key="attr.name" class="space-y-3">
        <h4 class="text-[11px] font-iransans-black text-slate-400 uppercase tracking-widest">
          انتخاب {{ attr.label }}
        </h4>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="val in attr.options"
            :key="val"
            :class="[
              selectedAttributes[attr.name] === val
                ? 'bg-slate-900 text-white shadow-lg ring-2 ring-slate-900 ring-offset-2'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200',
              'px-4 py-2 rounded-xl text-xs font-iransans-bold transition-all',
            ]"
            @click="$emit('select-attribute', attr.name, val)"
          >
            <span>{{ val }}</span>
          </button>
        </div>
      </div>
    </div>
    <div
      v-else
      class="text-xs text-slate-400 font-iransans-medium bg-white p-4 rounded-xl border border-slate-100 border-dashed"
    >
      ویژگی قابل انتخابی برای این محصول وجود ندارد.
    </div>
  </div>
</template>

<script setup>
defineProps({
  availableAttributes: {
    type: Array,
    default: () => [],
  },
  selectedAttributes: {
    type: Object,
    default: () => ({}),
  },
})

defineEmits(['select-attribute'])
</script>
