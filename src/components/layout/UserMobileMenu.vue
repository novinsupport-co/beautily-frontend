<template>
  <div>
    <!-- دکمه همبرگری -->
    <button
      aria-label="منوی کاربری"
      class="p-2.5 rounded-xl bg-[#F5F5F7] dark:bg-slate-800 text-[#777777] dark:text-gray-300 hover:bg-[#EEDAC5]/30 dark:hover:bg-slate-700 hover:text-[#F57A9B] dark:hover:text-[#DFA9C7] transition-all border border-[#E9DDD2] dark:border-slate-700 focus:outline-none"
      @click="isOpen = true"
    >
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          d="M4 6h16M4 12h16M4 18h16"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
        ></path>
      </svg>
    </button>

    <Teleport to="body">
      <transition name="fade">
        <div
          v-if="isOpen"
          class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60] transition-opacity"
          @click="closeMenu"
        ></div>
      </transition>

      <transition name="slide-right">
        <aside
          v-if="isOpen"
          class="fixed top-0 right-0 h-full w-[280px] sm:w-[320px] bg-[#FDFBF9] dark:bg-slate-800 shadow-2xl z-[70] overflow-y-auto flex flex-col font-iransans"
          dir="rtl"
        >
          <!-- هدر منو -->
          <div
            class="flex items-center justify-between p-5 border-b border-[#E9DDD2] dark:border-slate-700/80"
          >
            <span class="font-bold text-[#333333] dark:text-white">منوی کاربری</span>
            <button
              class="p-2 rounded-lg bg-white dark:bg-slate-700 text-[#777777] hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors shadow-sm"
              @click="closeMenu"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  d="M6 18L18 6M6 6l12 12"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                ></path>
              </svg>
            </button>
          </div>

          <!-- اطلاعات کاربر -->
          <div
            class="p-5 border-b border-[#E9DDD2] dark:border-slate-700/80 bg-[#F5F5F7]/50 dark:bg-slate-800/50"
          >
            <div class="flex items-center gap-4">
              <div
                class="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-[#EEDAC5] to-[#E9DDD2] dark:from-slate-700 dark:to-slate-600 flex items-center justify-center text-[#BC846C] dark:text-[#DFA9C7] font-bold text-2xl overflow-hidden shrink-0 shadow-inner"
              >
                <img
                  v-if="userAvatar"
                  :alt="userName"
                  :src="userAvatar"
                  class="w-full h-full object-cover"
                />
                <span v-else>{{ userInitial }}</span>
                <div
                  class="absolute bottom-1 right-1 w-3 h-3 bg-green-500 border-2 border-white dark:border-slate-800 rounded-full"
                ></div>
              </div>
              <div class="overflow-hidden flex-1">
                <h2 class="font-bold text-[#333333] dark:text-white truncate text-base mb-0.5">
                  {{ userName }}
                </h2>
                <div
                  class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-white dark:bg-slate-700 border border-[#E9DDD2] dark:border-slate-600 text-xs font-medium text-[#777777] dark:text-gray-400"
                >
                  کاربر عادی
                </div>
              </div>
            </div>
          </div>

          <!-- لیست لینک‌ها -->
          <nav class="flex-1 p-4 space-y-1.5 overflow-y-auto">
            <router-link
              v-for="item in menuItems"
              :key="item.title"
              :class="[
                $route.name === item.routeName
                  ? 'bg-[#F57A9B] text-white shadow-md shadow-[#F57A9B]/20'
                  : 'text-[#777777] dark:text-gray-300 hover:bg-[#F5F5F7] dark:hover:bg-slate-700/50 hover:text-[#F57A9B] dark:hover:text-[#DFA9C7]',
              ]"
              :to="{ name: item.routeName }"
              class="flex items-center gap-3.5 px-4 py-3.5 rounded-xl text-sm font-medium transition-all"
              @click="closeMenu"
            >
              <svg
                :class="{
                  'text-white': $route.name === item.routeName,
                  'text-[#BC846C] dark:text-gray-500': $route.name !== item.routeName,
                }"
                class="w-5 h-5 shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                v-html="icons[item.icon]"
              ></svg>
              {{ item.title }}
            </router-link>
          </nav>

          <!-- دکمه خروج -->
          <div class="p-4 border-t border-[#E9DDD2] dark:border-slate-700/80">
            <button
              class="w-full flex items-center justify-center gap-3.5 px-4 py-3.5 rounded-xl text-sm font-medium text-red-500 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
              @click="logout"
            >
              <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                ></path>
              </svg>
              خروج از حساب
            </button>
          </div>
        </aside>
      </transition>
    </Teleport>
  </div>
</template>

<script lang="ts" setup>
// کد اسکریپت بدون تغییر در منطق باقی می‌ماند (مشابه ارسال شده توسط شما)
import { computed, ref, watch } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRoute, useRouter } from 'vue-router'

const isOpen = ref(false)
const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()

watch(
  () => route.fullPath,
  () => {
    closeMenu()
  },
)
const closeMenu = () => {
  isOpen.value = false
}
const userName = computed(() => authStore.user?.name || 'کاربر مهمان')
const userInitial = computed(() => userName.value.charAt(0))
const userAvatar = computed(() => authStore.user?.avatar_url || authStore.user?.avatar?.url || null)

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
  closeMenu()
  await authStore.logout()
  router.push({ name: 'auth.login' })
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.slide-right-enter-active,
.slide-right-leave-active {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.slide-right-enter-from,
.slide-right-leave-to {
  transform: translateX(100%);
}
</style>
