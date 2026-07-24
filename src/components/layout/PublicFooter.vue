<template>
  <footer
    class="bg-[#FDFBF9] border-t border-[#E9DDD2] font-iransans pt-10 md:pt-16 pb-6 md:pb-8"
    dir="rtl"
  >
    <div class="container mx-auto px-4 md:px-8">
      <!--
        بخش بالایی فوتر
        در موبایل: 2 ستون / در تبلت: 4 ستون / در دسکتاپ: 12 ستون
      -->
      <div
        class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-12 gap-y-10 gap-x-4 md:gap-x-8 mb-10 md:mb-12"
      >
        <!-- ستون اول: درباره ما و لوگو -->
        <div class="col-span-2 md:col-span-4 lg:col-span-4 space-y-5 md:space-y-6">
          <RouterLink class="inline-block group" to="/">
            <div class="flex items-center gap-3">
              <Logo
                class="h-7 md:h-9 w-auto transform group-hover:scale-105 transition-transform duration-500"
              />
              <span
                class="text-slate-700 font-black text-lg md:text-xl tracking-wide group-hover:text-[#BC846C] transition-colors"
              >
                {{ settingsStore.settings?.site_title || 'بیوتیلی' }}
              </span>
            </div>
          </RouterLink>
          <p
            class="text-slate-500 text-[13px] md:text-sm leading-relaxed text-justify pl-0 lg:pl-6"
          >
            {{
              settingsStore.settings?.footer_description ||
              'بیوتیلی مرجع تخصصی نقد، بررسی و فروش محصولات زیبایی و بهداشتی اصل است. هدف ما ارائه بهترین محصولات با ضمانت اصالت کالا و مشاوره‌های تخصصی برای زیبایی و سلامت پوست و موی شماست.'
            }}
          </p>
          <!-- شبکه‌های اجتماعی -->
          <div class="flex items-center gap-3 md:gap-4 flex-wrap">
            <template v-if="parsedSocialLinks.length">
              <a
                v-for="(social, index) in parsedSocialLinks"
                :key="index"
                :href="social.url"
                :title="social.name"
                class="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-white border border-[#E9DDD2] flex items-center justify-center text-slate-400 hover:bg-[#BC846C] hover:text-white hover:border-[#BC846C] transition-all duration-300 transform hover:-translate-y-1"
                target="_blank"
              >
                <i :class="social.icon_class" class="text-base md:text-lg"></i>
              </a>
            </template>
            <template v-else>
              <a
                v-for="i in 4"
                :key="i"
                class="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-white border border-[#E9DDD2] flex items-center justify-center text-slate-400 hover:bg-[#BC846C] hover:text-white hover:border-[#BC846C] transition-all duration-300 transform hover:-translate-y-1"
                href="#"
              >
                <svg class="w-4 h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07...z" />
                </svg>
              </a>
            </template>
          </div>
        </div>

        <!-- ستون دوم: دسترسی سریع -->
        <div class="col-span-1 md:col-span-2 lg:col-span-2">
          <h4
            class="text-[#BC846C] font-black text-[13px] md:text-sm mb-4 md:mb-6 flex items-center gap-2"
          >
            <span class="w-1.5 h-1.5 bg-[#BC846C] rounded-full"></span>
            دسترسی سریع
          </h4>
          <ul class="space-y-2 md:space-y-3">
            <li v-for="link in quickLinks" :key="link.name">
              <RouterLink
                :to="link.path"
                class="text-[13px] md:text-sm text-slate-600 hover:text-[#BC846C] hover:pr-2 transition-all flex items-center gap-2 group py-1"
              >
                <span
                  class="w-1 h-1 bg-slate-300 rounded-full group-hover:bg-[#BC846C] transition-colors"
                ></span>
                {{ link.name }}
              </RouterLink>
            </li>
          </ul>
        </div>

        <!-- ستون سوم: خدمات مشتریان -->
        <div class="col-span-1 md:col-span-2 lg:col-span-2">
          <h4
            class="text-[#BC846C] font-black text-[13px] md:text-sm mb-4 md:mb-6 flex items-center gap-2"
          >
            <span class="w-1.5 h-1.5 bg-[#BC846C] rounded-full"></span>
            خدمات مشتریان
          </h4>
          <ul class="space-y-2 md:space-y-3">
            <li v-for="link in customerServices" :key="link.name">
              <RouterLink
                :to="link.path"
                class="text-[13px] md:text-sm text-slate-600 hover:text-[#BC846C] hover:pr-2 transition-all flex items-center gap-2 group py-1"
              >
                <span
                  class="w-1 h-1 bg-slate-300 rounded-full group-hover:bg-[#BC846C] transition-colors"
                ></span>
                {{ link.name }}
              </RouterLink>
            </li>
          </ul>
        </div>

        <!-- ستون چهارم: ارتباط و نمادها -->
        <div class="col-span-2 md:col-span-4 lg:col-span-4">
          <h4
            class="text-[#BC846C] font-black text-[13px] md:text-sm mb-4 md:mb-6 flex items-center gap-2"
          >
            <span class="w-1.5 h-1.5 bg-[#BC846C] rounded-full"></span>
            ارتباط با ما
          </h4>
          <div class="space-y-3 md:space-y-4 text-[13px] md:text-sm text-slate-600">
            <div class="flex items-start gap-3">
              <svg
                class="w-5 h-5 text-slate-400 mt-0.5 shrink-0"
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
              <span class="leading-relaxed">{{
                settingsStore.settings?.contact_address ||
                'تهران، خیابان ولیعصر، برج تجاری، پلاک 123'
              }}</span>
            </div>
            <div class="flex items-center gap-3">
              <svg
                class="w-5 h-5 text-slate-400 shrink-0"
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
              <span dir="ltr">{{ settingsStore.settings?.contact_phone || '۰۲۱ - ۸۸۸۸۸۸۸۸' }}</span>
            </div>
          </div>

          <!-- نمادهای اعتماد -->
          <div class="flex flex-wrap gap-2 md:gap-3 mt-6">
            <template v-if="parsedTrustBadges.length">
              <div
                v-for="(badge, index) in parsedTrustBadges"
                :key="index"
                class="w-16 h-20 md:w-20 md:h-24 bg-white border border-[#E9DDD2] rounded-xl flex items-center justify-center p-1 md:p-2 grayscale hover:grayscale-0 transition-all cursor-pointer shadow-sm"
                v-html="badge.code_or_image"
              ></div>
            </template>
            <template v-else>
              <div
                class="w-16 h-20 md:w-20 md:h-24 bg-white border border-[#E9DDD2] rounded-xl flex items-center justify-center grayscale hover:grayscale-0 transition-all cursor-pointer shadow-sm"
              >
                <span class="text-[10px] md:text-xs text-slate-400 text-center px-1"
                  >نماد اعتماد</span
                >
              </div>
              <div
                class="w-16 h-20 md:w-20 md:h-24 bg-white border border-[#E9DDD2] rounded-xl flex items-center justify-center grayscale hover:grayscale-0 transition-all cursor-pointer shadow-sm"
              >
                <span class="text-[10px] md:text-xs text-slate-400 text-center px-1">ساماندهی</span>
              </div>
            </template>
          </div>
        </div>
      </div>

      <!-- بخش کپی رایت -->
      <div
        class="pt-6 md:pt-8 border-t border-[#E9DDD2]/50 flex flex-col-reverse md:flex-row items-center justify-between gap-4"
      >
        <p
          class="text-slate-400 text-[11px] md:text-xs font-iransans-light text-center md:text-right"
        >
          تمامی حقوق مادی و معنوی این وب‌سایت متعلق به
          {{ settingsStore.settings?.site_title || 'بیوتیلی' }} است. $2026$ ©
        </p>
        <div class="flex items-center gap-4 text-[11px] md:text-xs text-slate-400">
          <RouterLink class="hover:text-[#BC846C] transition-colors py-1" to="/privacy"
            >حریم خصوصی</RouterLink
          >
          <span class="w-1 h-1 bg-[#E9DDD2] rounded-full"></span>
          <RouterLink class="hover:text-[#BC846C] transition-colors py-1" to="/terms"
            >قوانین و مقررات</RouterLink
          >
        </div>
      </div>
    </div>
  </footer>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import Logo from '@/components/Logo/BeautyLogo.vue'
import { useSiteSettingsStore } from '@/stores/siteSettings'

const settingsStore = useSiteSettingsStore()

// تابع کمکی برای پارس کردن ایمن رشته‌های JSON (در صورت نیاز)
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

// لینک‌های پیش‌فرض
const defaultQuickLinks = [
  { name: 'فروشگاه', path: '/products' },
  { name: 'جدیدترین محصولات', path: '/products?sort=newest' },
  { name: 'تخفیف‌های ویژه', path: '/products?discount=true' },
  { name: 'مجله زیبایی بیوتیلی', path: '/magazine' },
  { name: 'درباره ما', path: '/about' },
]

const defaultCustomerServices = [
  { name: 'پرسش‌های متداول', path: '/faq' },
  { name: 'راهنمای خرید', path: '/guide' },
  { name: 'پیگیری سفارش', path: '/user/orders' },
  { name: 'شرایط بازگشت کالا', path: '/returns' },
  { name: 'ثبت شکایات', path: '/complaints' },
]

// ویژگی‌های محاسبه‌شده پویا متصل به استور
const quickLinks = computed(() => {
  return safeParse(settingsStore.settings?.footer_quick_links, defaultQuickLinks)
})

const customerServices = computed(() => {
  return safeParse(settingsStore.settings?.footer_customer_services, defaultCustomerServices)
})

const parsedSocialLinks = computed(() => {
  return safeParse(settingsStore.settings?.social_links, [])
})

const parsedTrustBadges = computed(() => {
  return safeParse(settingsStore.settings?.trust_badges, [])
})
</script>
