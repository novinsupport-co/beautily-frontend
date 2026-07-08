<template>
  <header
    class="sticky top-0 z-[100] bg-[#FDFBF9]/95 backdrop-blur-md border-b border-[#E9DDD2] font-iransans transition-all duration-300"
  >
    <div class="container mx-auto px-3 md:px-8">
      <div class="h-16 md:h-20 flex items-center justify-between gap-2 md:gap-8" dir="rtl">
        <div class="flex-shrink-0">
          <RouterLink class="group" to="/">
            <Logo
              class="h-7 md:h-9 w-auto transform group-hover:scale-105 transition-transform duration-500"
            />
          </RouterLink>
        </div>

        <div class="hidden md:flex flex-1 max-w-xl relative group mx-4">
          <div class="relative w-full">
            <input
              v-model="searchQuery"
              class="w-full bg-[#F4ECE6]/50 border border-[#E9DDD2] rounded-2xl py-2.5 pr-12 pl-10 text-sm focus:bg-white focus:ring-4 focus:ring-[#BC846C]/10 focus:border-[#BC846C] transition-all outline-none placeholder:text-slate-400"
              placeholder="جستجو در محصولات بیوتیلی..."
              type="text"
              @blur="handleBlur"
              @focus="isSearchFocused = true"
              @keyup.enter="handleSearch"
            />

            <div class="absolute right-4 top-1/2 -translate-y-1/2 text-[#BC846C]">
              <svg
                v-if="!isSearching"
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  stroke-linecap="round"
                  stroke-width="2"
                />
              </svg>
              <svg v-else class="w-5 h-5 animate-spin" viewBox="0 0 24 24">
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  fill="none"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="opacity-75"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  fill="currentColor"
                ></path>
              </svg>
            </div>

            <button
              v-if="searchQuery"
              class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-rose-500 transition-colors"
              @click="searchQuery = ''"
            >
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  d="M10 8.586L2.929 1.515 1.515 2.929 8.586 10l-7.071 7.071 1.414 1.414L10 11.414l7.071 7.071 1.414-1.414L11.414 10l7.071-7.071-1.414-1.414L10 8.586z"
                />
              </svg>
            </button>
          </div>

          <div
            v-if="isSearchFocused"
            class="absolute top-full left-0 w-full mt-2 bg-white rounded-2xl shadow-2xl border border-[#E9DDD2] overflow-hidden z-[150]"
          >
            <div v-if="searchQuery.length < 2" class="p-5">
              <div class="mb-5">
                <h3
                  class="text-[10px] font-black text-[#BC846C] uppercase tracking-[0.2em] mb-3 flex items-center gap-2"
                >
                  <span class="w-1.5 h-1.5 bg-[#BC846C] rounded-full"></span>
                  دسته‌بندی‌های محبوب
                </h3>
                <div class="flex flex-wrap gap-2">
                  <RouterLink
                    v-for="cat in popularCategories"
                    :key="cat.id"
                    :to="`/category/${cat.slug}`"
                    class="px-3 py-1.5 bg-[#FDFBF9] border border-[#E9DDD2] rounded-lg text-xs text-slate-600 hover:border-[#BC846C] hover:text-[#BC846C] transition-all"
                  >
                    {{ cat.name }}
                  </RouterLink>
                </div>
              </div>

              <div>
                <h3
                  class="text-[10px] font-black text-[#BC846C] uppercase tracking-[0.2em] mb-3 flex items-center gap-2"
                >
                  <span class="w-1.5 h-1.5 bg-[#BC846C] rounded-full"></span>
                  پیشنهاد ویژه بیوتیلی
                </h3>
                <p class="text-[11px] text-slate-400 italic px-2">
                  محصولات جدید بر اساس سلیقه شما در حال آماده‌سازی است...
                </p>
              </div>
            </div>

            <div v-else class="max-h-[400px] overflow-y-auto custom-scrollbar bg-white">
              <div v-if="searchResults && searchResults.length > 0" class="flex flex-col">
                <RouterLink
                  v-for="item in searchResults"
                  :key="item.id"
                  :to="`/product/${item.slug}`"
                  class="flex items-center gap-4 p-4 hover:bg-[#FDFBF9] border-b border-[#F4ECE6] last:border-0 transition-all group/item"
                  @click="isSearchFocused = false"
                >
                  <div
                    class="w-12 h-12 flex-shrink-0 bg-gray-50 rounded-xl overflow-hidden border border-[#E9DDD2]"
                  >
                    <img
                      :src="item.images?.thumbnail?.url || '/placeholder-image.png'"
                      class="w-full h-full object-cover group-hover/item:scale-110 transition-transform duration-500"
                    />
                  </div>

                  <div class="flex flex-col flex-1 text-right overflow-hidden">
                    <span
                      class="text-sm font-bold text-slate-700 truncate group-hover/item:text-[#BC846C] transition-colors"
                    >
                      {{ item.name }}
                    </span>
                    <div class="flex items-center gap-2 mt-1">
                      <span
                        v-if="item.prices"
                        class="text-[12px] font-black text-[#BC846C]"
                        dir="rtl"
                      >
                        {{ formatPrice(item.prices.final) }}
                        <small class="font-normal text-[10px]">تومان</small>
                      </span>
                    </div>
                  </div>

                  <svg
                    class="w-4 h-4 text-slate-300 group-hover/item:translate-x-[-3px] transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M15 19l-7-7 7-7"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                    />
                  </svg>
                </RouterLink>
              </div>

              <div v-else-if="!isSearching" class="p-12 text-center">
                <div class="text-slate-300 mb-2 font-bold text-xl">:(</div>
                <div class="text-slate-500 text-sm font-bold">نتیجه‌ای پیدا نکردیم</div>
                <div class="text-slate-400 text-xs mt-1">کلمه دیگری را امتحان کنید</div>
              </div>
            </div>
          </div>
        </div>

        <div class="flex items-center gap-2 md:gap-4">
          <template v-if="!auth.isAuthenticated">
            <RouterLink
              class="flex items-center gap-2 px-4 py-2 rounded-xl text-slate-700 text-sm font-bold border border-[#E9DDD2] hover:bg-[#BC846C] hover:text-white transition-all"
              to="/auth/login"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  d="M16 12H4m12 0-4 4m4-4-4-4m3-4h2a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3h-2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                />
              </svg>
              <span class="hidden sm:inline">ورود / عضویت</span>
            </RouterLink>
          </template>
          <template v-else>
            <RouterLink
              class="p-2.5 bg-[#F4ECE6]/60 border border-[#E9DDD2] rounded-xl text-slate-600 hover:bg-white transition-all"
              to="/user/dashboard"
            >
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path
                  d="M12 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm-2 9a4 4 0 0 0-4 4v1a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-1a4 4 0 0 0-4-4h-4Z"
                />
              </svg>
            </RouterLink>
          </template>

          <div class="h-8 w-[1px] bg-[#E9DDD2]"></div>

          <!-- دکمه مقایسه کالا -->
          <router-link
            class="relative p-2 text-gray-600 hover:text-[#BC846C] transition-colors"
            title="مقایسه کالاها"
            to="/compare"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
              />
            </svg>
            <span
              v-if="compareStore.items.length > 0"
              class="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-[#BC846C] rounded-full"
            >
              {{ compareStore.items.length }}
            </span>
          </router-link>

          <CartDropdown />
          <MobileMenu />
        </div>
      </div>

      <nav class="hidden md:flex items-center h-14 border-t border-[#E9DDD2]/50" dir="rtl">
        <ul class="flex items-center gap-10 text-[12px] font-bold text-slate-600 h-full">
          <li class="group h-full flex items-center static">
            <button
              class="flex items-center gap-2 group-hover:text-[#BC846C] transition-colors h-full border-b-2 border-transparent group-hover:border-[#BC846C] px-1"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M4 6h16M4 12h16M4 18h16" stroke-linecap="round" stroke-width="2" />
              </svg>
              دسته‌بندی محصولات
            </button>

            <div
              class="absolute top-full right-0 w-full bg-white shadow-2xl border-t border-[#E9DDD2] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-[110]"
            >
              <div class="container mx-auto flex min-h-[400px]">
                <div class="w-1/4 bg-[#FDFBF9] p-6 border-l border-[#E9DDD2]/60">
                  <ul class="space-y-1 text-right">
                    <li
                      v-for="category in categories"
                      :key="category.id"
                      @mouseenter="activeTab = category.id"
                    >
                      <RouterLink
                        :class="[
                          'flex items-center justify-between px-5 py-3.5 rounded-xl transition-all font-black',
                          activeTab === category.id
                            ? 'bg-white text-[#BC846C] shadow-sm border border-[#E9DDD2]'
                            : 'hover:bg-white/50',
                        ]"
                        :to="`/category/${category.slug}`"
                      >
                        {{ category.name }}
                        <svg
                          v-if="activeTab === category.id"
                          class="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            d="M15 19l-7-7 7-7"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                          />
                        </svg>
                      </RouterLink>
                    </li>
                  </ul>
                </div>
                <div class="w-3/4 p-10 text-right">
                  <div
                    v-if="currentSubCategories?.children?.length"
                    class="grid grid-cols-3 gap-x-10 gap-y-8"
                  >
                    <div v-for="sub in currentSubCategories.children" :key="sub.id">
                      <RouterLink
                        :to="`/category/${sub.slug}`"
                        class="font-black text-slate-900 border-r-4 border-[#BC846C] pr-3 mb-4 block hover:text-[#BC846C] transition-colors"
                      >
                        {{ sub.name }}
                      </RouterLink>
                      <ul class="space-y-2 pr-4 border-r border-[#F4ECE6]">
                        <li v-for="child in sub.children" :key="child.id">
                          <RouterLink
                            :to="`/category/${child.slug}`"
                            class="text-xs text-slate-500 hover:text-[#BC846C] transition-all inline-block hover:translate-x-[-5px]"
                          >
                            {{ child.name }}
                          </RouterLink>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </li>
          <li v-for="link in navLinks" :key="link.to">
            <RouterLink
              :to="link.to"
              class="hover:text-[#BC846C] transition-all relative py-2 group"
            >
              {{ link.text }}
              <span
                class="absolute bottom-0 right-0 w-0 h-0.5 bg-[#BC846C] transition-all group-hover:w-full"
              ></span>
            </RouterLink>
          </li>
        </ul>
      </nav>
    </div>
  </header>
</template>

<script lang="ts" setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useCategoriesStore } from '@/stores/categories'
import { useCartStore } from '@/stores/cart'
import { useCompareStore } from '@/stores/compareStore' // اضافه شدن استور مقایسه
import Logo from '@/components/Logo/BeautyLogo.vue'
import CartDropdown from '@/components/cart/CartDropdown.vue'
import MobileMenu from './PublicMobileMenu.vue'
import axios from '@/lib/axios'

// --- Interfaces ---
interface Category {
  id: number
  name: string
  slug: string
  children?: Category[]
}

interface Product {
  id: number
  name: string
  slug: string
  images?: { thumbnail?: { url: string } }
  prices?: { final: number }
}

const auth = useAuthStore()
const categoryStore = useCategoriesStore()
const cartStore = useCartStore()
const compareStore = useCompareStore() // مقداردهی استور مقایسه
const router = useRouter()

// --- Refs ---
const searchQuery = ref('')
const isSearchFocused = ref(false)
const isSearching = ref(false)
const searchResults = ref<Product[]>([])
const activeTab = ref<number | null>(null)
let abortController: AbortController | null = null
let debounceTimeout: any = null

// --- Computeds ---
const categories = computed<Category[]>(() => (categoryStore as any).categories || [])
const currentSubCategories = computed(
  () => categories.value.find((c) => c.id === activeTab.value) || null,
)
const popularCategories = computed(() => categories.value.slice(0, 5))

// --- Methods ---
const formatPrice = (p: number) => p?.toLocaleString('fa-IR')

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    router.push({ name: 'public.products', query: { q: searchQuery.value.trim() } })
    isSearchFocused.value = false
  }
}

const handleBlur = () => {
  setTimeout(() => {
    isSearchFocused.value = false
  }, 250)
}

// --- Watcher (The Brain of Search) ---
watch(searchQuery, (newVal) => {
  clearTimeout(debounceTimeout)

  if (abortController) {
    abortController.abort()
  }

  const term = newVal?.trim()
  if (term && term.length >= 2) {
    isSearching.value = true

    debounceTimeout = setTimeout(async () => {
      abortController = new AbortController()

      try {
        const response = await axios.get('/products/search', {
          params: { q: term },
          signal: abortController.signal,
        })
        // اصلاح کلیدی: دسترسی مستقیم به آرایه محصولات مطابق JSON شما
        searchResults.value = response.data.data || []
      } catch (error: any) {
        if (error.name === 'CanceledError') return
        console.error('Search error:', error)
        searchResults.value = []
      } finally {
        isSearching.value = false
      }
    }, 400)
  } else {
    searchResults.value = []
    isSearching.value = false
  }
})

const navLinks = [
  { text: 'جدیدترین محصولات', to: '/products' },
  { text: 'تخفیف‌های طلایی', to: '/products?discount=true' },
  { text: 'مجله بیوتیلی', to: '/magazine' },
  { text: 'ارتباط با ما', to: '/about' },
]

onMounted(async () => {
  if (categories.value.length === 0 && (categoryStore as any).fetchCategories) {
    await (categoryStore as any).fetchCategories()
  }
  if (categories.value.length > 0) activeTab.value = categories.value[0].id
})

onUnmounted(() => {
  clearTimeout(debounceTimeout)
  if (abortController) abortController.abort()
})
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: #fdfbf9;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #e9ddd2;
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #bc846c;
}
</style>
