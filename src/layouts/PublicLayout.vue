<template>
  <div class="flex flex-col min-h-screen bg-gray-50">
    <PublicNavbar :settings="settingsStore.settings" />

    <main class="flex-1">
      <RouterView />
    </main>

    <PublicFooter :settings="settingsStore.settings" />
  </div>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue'
import { useCartStore } from '@/stores/cart'
import { useAuthStore } from '@/stores/auth'
import { useCategoriesStore } from '@/stores/categories'
import { useSiteSettingsStore } from '@/stores/siteSettings'

import PublicNavbar from '@/components/layout/PublicNavbar.vue'
import PublicFooter from '@/components/layout/PublicFooter.vue'

const cart = useCartStore()
const auth = useAuthStore()
const categoryStore = useCategoriesStore()
const settingsStore = useSiteSettingsStore()

onMounted(async () => {
  // دریافت داده‌های اختصاصی پابلیک (مثل دسته‌بندی‌ها)
  await categoryStore.fetchCategories()

  // بررسی وضعیت لاگین بودن کاربر به صورت مستقیم و ساده
  if (auth.isAuthenticated) {
    cart.fetchCart()
  }
})
</script>
