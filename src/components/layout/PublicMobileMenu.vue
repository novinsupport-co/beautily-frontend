<template>
  <div class="md:hidden flex items-center">
    <button class="p-2 text-slate-700 outline-none" @click="open = true">
      <svg
        aria-hidden="true"
        class="w-7 h-7"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M5 7h14M5 12h14M5 17h14" stroke-linecap="round" stroke-width="2" />
      </svg>
    </button>

    <transition name="fade">
      <div
        v-if="open"
        class="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200]"
        @click="closeMenu"
      ></div>
    </transition>

    <transition name="slide">
      <div
        v-if="open"
        class="fixed top-0 right-0 w-[85%] max-w-[320px] bg-[#FDFBF9] shadow-2xl z-[210] flex flex-col border-l border-[#E9DDD2]"
        dir="rtl"
        style="height: 100dvh"
      >
        <div
          class="flex-shrink-0 p-5 border-b border-[#E9DDD2] flex items-center justify-between bg-white"
        >
          <div class="flex items-center gap-2">
            <div class="w-1 h-6 bg-[#BC846C] rounded-full"></div>
            <span class="font-black text-slate-800">منوی بیوتیلی</span>
          </div>
          <button
            class="text-slate-400 p-2 hover:bg-red-50 hover:text-red-500 rounded-full transition-colors"
            @click="closeMenu"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M6 18L18 6M6 6l12 12" stroke-linecap="round" stroke-width="2.5" />
            </svg>
          </button>
        </div>

        <div class="flex-1 overflow-y-auto p-4 custom-scrollbar font-iransans">
          <ul class="space-y-3">
            <li>
              <RouterLink
                class="flex items-center gap-3 p-3 rounded-2xl hover:bg-[#F4ECE6] text-slate-700 font-bold text-sm transition-all"
                to="/"
                @click="closeMenu"
              >
                <svg
                  class="w-5 h-5 text-[#BC846C]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                  />
                </svg>
                خانه
              </RouterLink>
            </li>

            <li class="p-3 rounded-2xl bg-[#F4ECE6]/40 border border-[#E9DDD2]/50">
              <p
                class="text-[10px] font-black text-[#BC846C] mb-3 px-1 uppercase tracking-widest opacity-70"
              >
                ویترین محصولات
              </p>

              <div v-for="cat in categoryStore.categories" :key="cat.id" class="mb-2">
                <div
                  class="flex items-center justify-between w-full bg-white/60 rounded-xl overflow-hidden border border-[#E9DDD2]/30"
                >
                  <RouterLink
                    :to="`/category/${cat.slug}`"
                    class="flex-1 p-3 text-[14px] text-slate-700 font-bold"
                    @click="closeMenu"
                  >
                    {{ cat.name }}
                  </RouterLink>

                  <button
                    v-if="cat.children && cat.children.length > 0"
                    class="p-3 border-r border-[#E9DDD2]/30 hover:bg-[#BC846C]/10 transition-colors"
                    @click="toggleCat(cat.id)"
                  >
                    <svg
                      :class="{ 'rotate-180': activeCat === cat.id }"
                      class="w-4 h-4 transition-transform text-[#BC846C]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M19 9l-7 7-7-7" stroke-linecap="round" stroke-width="2.5" />
                    </svg>
                  </button>
                </div>

                <transition name="expand">
                  <div
                    v-if="activeCat === cat.id"
                    class="mr-4 mt-1 space-y-1 border-r-2 border-[#BC846C]/20 overflow-hidden"
                  >
                    <RouterLink
                      v-for="sub in cat.children"
                      :key="sub.id"
                      :to="`/category/${sub.slug}`"
                      class="block p-3 text-[13px] text-slate-500 hover:text-[#BC846C] transition-colors"
                      @click="closeMenu"
                    >
                      {{ sub.name }}
                    </RouterLink>
                  </div>
                </transition>
              </div>
            </li>

            <li>
              <RouterLink
                class="flex items-center gap-3 p-3 rounded-2xl hover:bg-[#F4ECE6] text-slate-700 font-bold text-sm transition-all"
                to="/products"
                @click="closeMenu"
              >
                <svg
                  class="w-5 h-5 text-[#BC846C]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                    stroke-linecap="round"
                    stroke-width="2"
                  />
                </svg>
                همه محصولات
              </RouterLink>
            </li>
          </ul>
        </div>

        <div class="flex-shrink-0 p-5 border-t border-[#E9DDD2] bg-white">
          <template v-if="!auth.isAuthenticated">
            <RouterLink
              class="flex items-center justify-center gap-2 w-full py-4 bg-[#BC846C] text-white rounded-2xl font-bold text-sm shadow-lg shadow-[#BC846C]/20"
              to="/auth/login"
              @click="closeMenu"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                />
              </svg>
              ورود / عضویت
            </RouterLink>
          </template>
          <template v-else>
            <div class="space-y-3">
              <RouterLink
                class="flex items-center justify-center gap-2 w-full py-3 bg-slate-900 text-white rounded-xl font-bold text-[13px]"
                to="/user/dashboard"
                @click="closeMenu"
              >
                مشاهده پنل کاربری
              </RouterLink>
              <button
                class="w-full text-center py-2 text-rose-500 text-xs font-black border border-rose-100 rounded-xl hover:bg-rose-50 transition-colors"
                @click="handleLogout"
              >
                خروج از حساب
              </button>
            </div>
          </template>
        </div>
      </div>
    </transition>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useCategoriesStore } from '@/stores/categories'

const auth = useAuthStore()
const categoryStore = useCategoriesStore()
const router = useRouter()
const open = ref(false)
const activeCat = ref<number | null>(null)

watch(open, (val) => {
  if (val) document.body.style.overflow = 'hidden'
  else document.body.style.overflow = ''
})

const closeMenu = () => {
  open.value = false
  activeCat.value = null
}

const toggleCat = (id: number) => {
  activeCat.value = activeCat.value === id ? null : id
}

const handleLogout = async () => {
  try {
    await (auth as any).logout()
    router.push('/auth/login')
    closeMenu()
  } catch (e) {
    console.error('Logout failed', e)
  }
}
</script>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* انیمیشن باز شدن نرم لیست */
.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s ease-out;
  max-height: 500px;
}
.expand-enter-from,
.expand-leave-to {
  max-height: 0;
  opacity: 0;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 0px;
}
</style>
