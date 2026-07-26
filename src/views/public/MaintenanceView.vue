<template>
  <div
    class="min-h-screen bg-[#FDFBF9] flex items-center justify-center p-4 relative overflow-hidden font-iransans"
    dir="rtl"
  >
    <!-- افکت‌های بلور پس‌زمینه (Blur Orbs) منطبق با رنگ‌های برند -->
    <div
      class="absolute top-1/4 right-1/4 w-96 h-96 bg-[#F57A9B]/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"
    ></div>
    <div
      class="absolute bottom-1/4 left-1/4 w-96 h-96 bg-[#DFA9C7]/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"
    ></div>

    <div class="relative w-full max-w-lg z-10">
      <!-- کارت اصلی Glassmorphism -->
      <div
        class="bg-white/60 backdrop-blur-xl border border-white/40 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] rounded-[2.5rem] p-8 md:p-10 text-center"
      >
        <!-- آیکون متحرک -->
        <div
          class="w-20 h-20 md:w-24 md:h-24 mx-auto mb-6 bg-gradient-to-tr from-[#F57A9B] to-[#DFA9C7] rounded-full flex items-center justify-center shadow-lg shadow-[#F57A9B]/30 animate-pulse"
        >
          <svg
            class="w-10 h-10 md:w-12 md:h-12 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
            ></path>
            <path
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
            ></path>
          </svg>
        </div>

        <h1 class="text-xl md:text-2xl font-black text-[#333333] mb-4">
          بیوتیلی در حال بروزرسانی است
        </h1>

        <p class="text-[#777777] leading-relaxed text-[13px] md:text-base mb-8">
          {{
            siteSettingsStore.settings?.maintenance_message ||
            'در حال ارتقای سیستم برای ارائه خدمات بهتر به شما هستیم. لطفا دقایقی دیگر مراجعه فرمایید.'
          }}
        </p>

        <!-- خط جداکننده -->
        <hr class="border-[#E9DDD2]/60 mb-6" />

        <!-- اطلاعات تماس و پشتیبانی -->
        <div class="space-y-4 text-right">
          <!-- آدرس -->
          <div class="flex items-start gap-3 text-[#555555]">
            <div class="bg-white/50 p-2 rounded-lg shrink-0 shadow-sm border border-white/40">
              <svg
                class="w-5 h-5 text-[#BC846C]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                />
                <path
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                />
              </svg>
            </div>
            <span class="text-[13px] md:text-sm leading-relaxed mt-1">
              {{
                siteSettingsStore.settings?.contact_address ||
                'تهران، خیابان ولیعصر، برج تجاری، پلاک ۱۲۳'
              }}
            </span>
          </div>

          <!-- تلفن -->
          <div class="flex items-center gap-3 text-[#555555]">
            <div class="bg-white/50 p-2 rounded-lg shrink-0 shadow-sm border border-white/40">
              <svg
                class="w-5 h-5 text-[#BC846C]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                />
              </svg>
            </div>
            <span class="text-[13px] md:text-sm font-medium mt-1" dir="ltr">
              {{ siteSettingsStore.settings?.contact_phone || '۰۲۱ - ۸۸۸۸۸۸۸۸' }}
            </span>
          </div>
        </div>

        <!-- شبکه‌های اجتماعی -->
        <div class="flex items-center justify-center gap-3 md:gap-4 mt-8 flex-wrap">
          <template v-if="parsedSocialLinks.length">
            <a
              v-for="(social, index) in parsedSocialLinks"
              :key="index"
              :href="social.url"
              :title="social.name"
              class="w-10 h-10 rounded-xl bg-white/70 backdrop-blur-sm border border-white flex items-center justify-center text-slate-500 shadow-sm hover:bg-[#BC846C] hover:text-white hover:border-[#BC846C] hover:shadow-md transition-all duration-300 transform hover:-translate-y-1"
              target="_blank"
            >
              <i :class="social.icon_class" class="text-lg"></i>
            </a>
          </template>
          <template v-else>
            <!-- پشتیبان در صورت خالی بودن -->
            <a
              v-for="i in 3"
              :key="i"
              class="w-10 h-10 rounded-xl bg-white/70 backdrop-blur-sm border border-white flex items-center justify-center text-slate-400 shadow-sm hover:bg-[#BC846C] hover:text-white transition-all duration-300 transform hover:-translate-y-1"
              href="#"
            >
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07...z" />
              </svg>
            </a>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useSiteSettingsStore } from '@/stores/siteSettings'

const siteSettingsStore = useSiteSettingsStore()

// تابع کمکی برای پارس کردن ایمن رشته‌های JSON (مشابه فوتر)
const safeParse = (data: any, fallback: any[]) => {
  if (!data) return fallback
  if (Array.isArray(data)) return data.length ? data : fallback
  try {
    const parsed = JSON.parse(data)
    return Array.isArray(parsed) && parsed.length ? parsed : fallback
  } catch (e) {
    return fallback
  }
}

// پارس کردن لینک‌های شبکه‌های اجتماعی از استور تنظیمات سایت
const parsedSocialLinks = computed(() => {
  return safeParse(siteSettingsStore.settings?.social_links, [])
})
</script>

<style scoped>
/* در صورت نیاز به افزودن انیمیشن blob سفارشی در tailwind.config.js */
</style>
