<template>
  <div class="flex min-h-screen bg-gray-100 dark:bg-slate-900 relative">
    <!-- لایه تاریک پس‌زمینه برای حالت موبایل -->
    <div
      v-if="isSidebarOpen"
      class="fixed inset-0 bg-black/50 z-40 md:hidden"
      @click="isSidebarOpen = false"
    ></div>

    <!-- پاس دادن وضعیت منو به سایدبار -->
    <AdminSidebar :is-open="isSidebarOpen" @close="isSidebarOpen = false" />
    <div class="flex flex-col flex-1 w-full overflow-hidden">
      <!-- گوش دادن به کلیک دکمه همبرگری از هدر -->
      <AdminHeader @toggle-sidebar="isSidebarOpen = !isSidebarOpen" />
      <main class="p-6 flex-1 overflow-y-auto">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import AdminHeader from '@/components/layout/AdminHeader.vue'
import AdminSidebar from '@/components/layout/AdminSidebar.vue'

// متغیر وضعیت برای باز و بسته بودن سایدبار در موبایل
const isSidebarOpen = ref(false)
</script>
