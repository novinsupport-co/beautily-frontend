<template>
  <div class="category-node mt-3">
    <div
      :class="selectedId === category.id
        ? 'border-indigo-500 ring-4 ring-indigo-500/10 shadow-lg translate-x-[-4px] bg-indigo-50/20'
        : 'border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm'"
      class="group flex items-center justify-between p-4 rounded-[1.5rem] border cursor-pointer transition-all duration-300 relative"
      @click="$emit('select', category)"
    >
      <div class="flex items-center gap-4 text-right">
        <div
          :class="selectedId === category.id ? 'bg-indigo-600 border-indigo-600 text-white shadow-md' : 'bg-slate-50 dark:bg-slate-900 text-slate-400 border-slate-100 dark:border-slate-700'"
          class="w-10 h-10 rounded-xl border flex items-center justify-center transition-all duration-300"
        >
          <svg v-if="selectedId === category.id" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M5 13l4 4L19 7" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" />
          </svg>
          <svg v-else-if="category.recursive_children?.length" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
          </svg>
          <div v-else class="w-1.5 h-1.5 rounded-full bg-current"></div>
        </div>

        <div>
          <span
            :class="selectedId === category.id ? 'text-indigo-600' : 'text-slate-700 dark:text-slate-200'"
            class="text-sm font-iransans-bold transition-colors"
          >
            {{ category.name }}
          </span>
          <div v-if="category.recursive_children?.length" class="text-[10px] text-slate-400 mt-0.5">
            {{ category.recursive_children.length }} زیرمجموعه
          </div>
        </div>
      </div>

      <div class="flex items-center gap-1">
        <button
          class="w-9 h-9 flex items-center justify-center text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-xl transition-all"
          title="ویرایش"
          @click.stop="$emit('edit', category)"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2.828 2.828 0 114 4L11.828 15H9v-2.828l8.586-8.586z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
          </svg>
        </button>
        <button
          class="w-9 h-9 flex items-center justify-center text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-xl transition-all"
          title="حذف"
          @click.stop="$emit('delete', category.id)"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
          </svg>
        </button>
      </div>
    </div>

    <div
      v-if="category.recursive_children?.length"
      class="mr-10 mt-1 border-r-2 border-dashed border-slate-100 dark:border-slate-800 pr-4"
    >
      <CategoryItem
        v-for="child in category.recursive_children"
        :key="child.id"
        :category="child"
        :selected-id="selectedId"
        @delete="$emit('delete', $event)"
        @edit="$emit('edit', $event)"
        @select="$emit('select', $event)"
      />
    </div>
  </div>
</template>

<script setup>
defineProps({
  category: { type: Object, required: true },
  selectedId: { type: [Number, String], default: null }
})
defineEmits(['edit', 'delete', 'select'])
</script>

<style scoped>
.category-node {
  animation: slideIn 0.3s ease-out;
}
@keyframes slideIn {
  from { opacity: 0; transform: translateY(5px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
