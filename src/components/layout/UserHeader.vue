<template>
  <header
    class="bg-[#FDFBF9]/90 dark:bg-slate-900/90 backdrop-blur-lg sticky top-0 z-40 border-b border-[#E9DDD2] dark:border-slate-800 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] transition-colors duration-300"
  >
    <nav class="w-full px-4 sm:px-6 lg:px-8 h-20 flex justify-between items-center" dir="rtl">
      <!-- بخش راست: لوگو و منوی دسکتاپ -->
      <div class="flex items-center gap-10">
        <Logo class="shrink-0 scale-105" />

        <ul
          class="hidden lg:flex items-center gap-8 text-[#777777] dark:text-gray-400 text-sm font-iransans-medium"
        >
          <li>
            <RouterLink
              class="flex items-center gap-2 hover:text-[#F57A9B] dark:hover:text-[#DFA9C7] transition-colors"
              to="/user/dashboard"
            >
              <HomeIcon class="w-4 h-4" /> پیشخوان
            </RouterLink>
          </li>
          <li>
            <RouterLink
              class="flex items-center gap-2 hover:text-[#F57A9B] dark:hover:text-[#DFA9C7] transition-colors"
              to="/products"
            >
              <ShoppingBagIcon class="w-4 h-4" /> محصولات
            </RouterLink>
          </li>
          <li>
            <RouterLink
              class="flex items-center gap-2 hover:text-[#F57A9B] dark:hover:text-[#DFA9C7] transition-colors"
              to="/user/orders"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                />
              </svg>
              سفارش‌های من
            </RouterLink>
          </li>
          <li>
            <RouterLink
              class="flex items-center gap-2 hover:text-red-500 dark:hover:text-red-400 transition-colors"
              to="/user/favorites"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                />
              </svg>
              علاقه‌مندی‌ها
            </RouterLink>
          </li>
        </ul>
      </div>

      <!-- بخش چپ: آیکون‌ها و دکمه خروج -->
      <div class="hidden md:flex items-center gap-5">
        <router-link
          class="relative p-2.5 text-[#777777] dark:text-gray-400 hover:text-[#F57A9B] dark:hover:text-[#DFA9C7] transition-all rounded-xl hover:bg-[#F5F5F7] dark:hover:bg-slate-800"
          title="مقایسه کالاها"
          to="/compare"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
            />
          </svg>
          <span
            v-if="compareStore.items.length > 0"
            class="absolute top-1.5 right-1.5 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold text-white bg-[#F57A9B] rounded-full border-2 border-white dark:border-slate-900 shadow-sm"
          >
            {{ compareStore.items.length }}
          </span>
        </router-link>

        <CartDropdown />

        <div class="h-8 w-px bg-[#E9DDD2] dark:bg-slate-700 mx-2"></div>

        <button
          class="flex items-center gap-2 text-sm font-iransans-medium text-[#777777] dark:text-gray-300 px-4 py-2 rounded-xl hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/30 dark:hover:text-red-400 transition-all border border-transparent hover:border-red-100 dark:hover:border-red-900/50"
          @click="logout"
        >
          <LogoutIcon class="w-4 h-4" /> خروج
        </button>
      </div>

      <!-- بخش موبایل (همبرگری و سبد خرید) -->
      <div class="md:hidden flex items-center gap-3">
        <CartDropdown />
        <MobileMenu />
      </div>
    </nav>
  </header>
</template>

<script lang="ts" setup>
import { RouterLink, useRouter } from 'vue-router'
import Logo from '@/components/Logo/BeautyLogo.vue'
import { useAuthStore } from '@/stores/auth'
import { useCompareStore } from '@/stores/compareStore'
import CartDropdown from '@/components/cart/CartDropdown.vue'

import ShoppingBagIcon from '@/components/icons/ShoppingBagIcon.vue'
import HomeIcon from '@/components/icons/HomeIcon.vue'
import LogoutIcon from '@/components/icons/LogoutIcon.vue'
import MobileMenu from '@/components/layout/UserMobileMenu.vue'

const router = useRouter()
const auth = useAuthStore()
const compareStore = useCompareStore()

const logout = async () => {
  await auth.logout()
  router.push('/auth/login')
}
</script>
