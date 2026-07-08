<template>
  <nav class="text-sm text-gray-600 mb-4" aria-label="breadcrumb">
    <ol class="flex flex-wrap gap-1 items-center">
      <li>
        <RouterLink to="/" class="hover:text-brand-primary font-medium">
          خانه
        </RouterLink>
      </li>

      <li v-for="(crumb, index) in crumbs" :key="index" class="flex items-center">
        <span class="mx-1 text-gray-400">/</span>
        <RouterLink
          v-if="crumb.to"
          :to="crumb.to"
          class="hover:text-brand-primary"
        >
          {{ crumb.label }}
        </RouterLink>
        <span v-else class="text-gray-500">{{ crumb.label }}</span>
      </li>
    </ol>
  </nav>
</template>

<script setup>
const props = defineProps({
  crumbs: {
    type: Array,
    default: () => [],
  },
});
</script>
