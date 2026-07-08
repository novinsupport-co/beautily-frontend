<template>
  <aside
    class="w-full bg-white dark:bg-slate-800 rounded-2xl shadow-[0_2px_20px_-4px_rgba(0,0,0,0.05)] dark:shadow-none border border-gray-100 dark:border-slate-700 p-5"
  >
    <!-- اطلاعات مختصر کاربر -->
    <div
      class="flex items-center gap-4 pb-6 mb-4 border-b border-gray-100 dark:border-slate-700/80"
    >
      <div
        class="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-900/60 dark:to-blue-800/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-2xl overflow-hidden shrink-0 shadow-inner"
      >
        <!-- اگر کاربر آواتار داشته باشد -->
        <img
          v-if="userAvatar"
          :alt="userName"
          :src="userAvatar"
          class="w-full h-full object-cover"
        />
        <!-- اگر کاربر آواتار نداشته باشد -->
        <span v-else>{{ userInitial }}</span>
        <!-- نقطه سبز وضعیت آنلاین -->
        <div
          class="absolute bottom-1 right-1 w-3 h-3 bg-green-500 border-2 border-white dark:border-slate-800 rounded-full"
        ></div>
      </div>

      <div class="overflow-hidden flex-1">
        <h2
          :title="userName"
          class="font-bold text-gray-800 dark:text-white truncate text-base mb-0.5"
        >
          {{ userName }}
        </h2>
        <div
          class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-gray-100 dark:bg-slate-700 text-xs font-medium text-gray-500 dark:text-gray-400"
        >
          کاربر عادی
        </div>
      </div>
    </div>

    <!-- لینک‌های منو -->
    <nav class="space-y-1.5">
      <router-link
        v-for="item in menuItems"
        :key="item.title"
        :class="[
          $route.name === item.routeName
            ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20 dark:shadow-blue-900/40'
            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700/50 hover:text-blue-600 dark:hover:text-blue-400',
        ]"
        :to="{ name: item.routeName }"
        class="group flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 relative overflow-hidden"
      >
        <!-- آیکون SVG -->
        <svg
          :class="{
            'text-white': $route.name === item.routeName,
            'text-gray-400 dark:text-gray-500 group-hover:text-blue-600 dark:group-hover:text-blue-400':
              $route.name !== item.routeName,
          }"
          class="w-5 h-5 shrink-0 transition-transform duration-300 group-hover:scale-110"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          v-html="icons[item.icon]"
        ></svg>
        <span class="relative z-10">{{ item.title }}</span>
      </router-link>

      <!-- خط جداکننده -->
      <div class="h-px bg-gray-100 dark:bg-slate-700/80 my-4"></div>

      <!-- لینک خروج -->
      <button
        class="w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-300 transition-all duration-300 group"
        @click.prevent="logout"
      >
        <svg
          class="w-5 h-5 shrink-0 text-red-400 group-hover:text-red-500 transition-transform duration-300 group-hover:-translate-x-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
          ></path>
        </svg>
        خروج از حساب کاربری
      </button>
    </nav>
  </aside>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const userName = computed(() => authStore.user?.name || 'کاربر مهمان')
const userInitial = computed(() => userName.value.charAt(0))
const userAvatar = computed(() => authStore.user?.avatar_url || authStore.user?.avatar?.url || null)

// آیکون‌ها
const icons: Record<string, string> = {
  dashboard: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>`,
  orders: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>`,
  favorites: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>`,
  profile: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>`,
  addresses: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>`,
  reviews: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>`,
  transactions: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2zM10 8.5a.5.5 0 11-1 0 .5.5 0 011 0zm5 5a.5.5 0 11-1 0 .5.5 0 011 0z"></path>`,
}

const menuItems = [
  { title: 'داشبورد', routeName: 'user.dashboard', icon: 'dashboard' },
  { title: 'سفارش‌های من', routeName: 'user.orders', icon: 'orders' },
  { title: 'علاقه‌مندی‌ها', routeName: 'user.favorites', icon: 'favorites' },
  { title: 'اطلاعات حساب', routeName: 'user.profile', icon: 'profile' },
  { title: 'آدرس‌ها', routeName: 'user.addresses', icon: 'addresses' },
  { title: 'دیدگاه‌ها', routeName: 'user.reviews', icon: 'reviews' },
  { title: 'تراکنش‌ها', routeName: 'user.transactions', icon: 'transactions' },
]

async function logout() {
  await authStore.logout()
  router.push({ name: 'auth.login' })
}
</script>
