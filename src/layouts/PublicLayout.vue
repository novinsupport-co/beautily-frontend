<template>
  <div class="flex flex-col min-h-screen bg-gray-50">
    <PublicNavbar />
    <main class="flex-1">
      <RouterView />
    </main>
    <PublicFooter />
  </div>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue'
import { useCartStore } from '@/stores/cart'
import { useAuthStore } from '@/stores/auth'
import { useCategoriesStore } from '@/stores/categories'
import PublicNavbar from '@/components/layout/PublicNavbar.vue'
import PublicFooter from '@/components/layout/PublicFooter.vue'

const cart = useCartStore()
const auth = useAuthStore()
const categoryStore = useCategoriesStore()

onMounted(async () => {
  // ۱. لود کردن دسته‌بندی‌ها
  await categoryStore.fetchCategories()

  // ۲. اصلاح شرط احراز هویت:
  // اگر در استور شما تابع است، حتماً () بگذارید.
  // اگر Getter است و باز هم خطا دارید، مطمئن شوید در استور به درستی تعریف شده.
  if (typeof auth.isAuthenticated === 'function' ? auth.isAuthenticated() : auth.isAuthenticated) {
    cart.fetchCart()
  }
})
</script>
