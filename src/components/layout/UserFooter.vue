<template>
  <footer class="bg-[#FDFBF9] border-t border-[#E9DDD2] mt-16 font-sans">
    <!-- بخش اصلی فوتر -->
    <div
      class="max-w-[1440px] mx-auto px-4 md:px-8 pt-16 pb-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8"
    >
      <!-- ۱. درباره ما و لوگو -->
      <div class="space-y-6">
        <router-link class="block" to="/">
          <img
            :src="displaySettings.site_logo"
            alt="بیوتیلی"
            class="h-14 object-contain transition-transform hover:scale-105 duration-300"
          />
        </router-link>
        <p class="text-[14px] text-[#777777] leading-loose text-justify">
          {{ displaySettings.footer_description }}
        </p>
      </div>

      <!-- ۲. لینک‌های سریع -->
      <div>
        <h4 class="text-lg font-bold text-[#333333] mb-6 relative inline-block">
          لینک‌های سریع
          <span class="absolute -bottom-2 right-0 w-1/2 h-[3px] bg-[#F57A9B] rounded-full"></span>
        </h4>
        <ul class="space-y-3">
          <li v-for="(link, index) in displaySettings.footer_quick_links" :key="index">
            <RouterLink
              :to="link.url"
              class="flex items-center text-[14px] text-[#777777] hover:text-[#BC846C] transition-all duration-300 hover:-translate-x-2 group"
            >
              <i
                class="fas fa-angle-left text-[12px] ml-2 text-[#DFA9C7] opacity-0 group-hover:opacity-100 transition-opacity"
              ></i>
              {{ link.title }}
            </RouterLink>
          </li>
        </ul>
      </div>

      <!-- ۳. اطلاعات تماس -->
      <div>
        <h4 class="text-lg font-bold text-[#333333] mb-6 relative inline-block">
          ارتباط با ما
          <span class="absolute -bottom-2 right-0 w-1/2 h-[3px] bg-[#F57A9B] rounded-full"></span>
        </h4>
        <ul class="space-y-4 text-[14px] text-[#777777]">
          <li class="flex items-start">
            <div
              class="w-8 h-8 rounded-full bg-[#EEDAC5] flex items-center justify-center text-[#BC846C] shrink-0 ml-3"
            >
              <i class="fas fa-map-marker-alt"></i>
            </div>
            <span class="leading-relaxed pt-1">{{ displaySettings.contact_address }}</span>
          </li>
          <li class="flex items-center">
            <div
              class="w-8 h-8 rounded-full bg-[#EEDAC5] flex items-center justify-center text-[#BC846C] shrink-0 ml-3"
            >
              <i class="fas fa-phone-alt"></i>
            </div>
            <a
              :href="'tel:' + displaySettings.contact_phone"
              class="hover:text-[#BC846C] transition-colors pt-1"
              dir="ltr"
            >
              {{ displaySettings.contact_phone }}
            </a>
          </li>
          <li class="flex items-center">
            <div
              class="w-8 h-8 rounded-full bg-[#EEDAC5] flex items-center justify-center text-[#BC846C] shrink-0 ml-3"
            >
              <i class="fas fa-envelope"></i>
            </div>
            <a
              :href="'mailto:' + displaySettings.contact_email"
              class="hover:text-[#BC846C] transition-colors pt-1"
            >
              {{ displaySettings.contact_email }}
            </a>
          </li>
        </ul>
      </div>

      <!-- ۴. شبکه‌های اجتماعی و اعتماد -->
      <div>
        <h4 class="text-lg font-bold text-[#333333] mb-6 relative inline-block">
          شبکه‌های اجتماعی
          <span class="absolute -bottom-2 right-0 w-1/2 h-[3px] bg-[#F57A9B] rounded-full"></span>
        </h4>
        <div class="flex flex-wrap gap-3 mb-8">
          <a
            v-for="(social, index) in displaySettings.footer_socials"
            :key="index"
            :aria-label="social.icon_class"
            :href="social.url"
            class="w-10 h-10 rounded-full bg-white border border-[#E9DDD2] flex items-center justify-center text-[#777777] hover:bg-[#F57A9B] hover:text-white hover:border-[#F57A9B] transition-all duration-300 shadow-sm hover:shadow-md"
            rel="noopener noreferrer"
            target="_blank"
          >
            <i :class="[social.icon_class, 'text-lg']"></i>
          </a>
        </div>

        <!-- جایگاه نماد اعتماد (اختیاری) -->
        <div class="flex gap-4">
          <!-- <img src="/assets/images/enamad.png" alt="نماد اعتماد" class="h-20 bg-white rounded-lg p-2 border border-[#E9DDD2]" /> -->
        </div>
      </div>
    </div>

    <!-- نوار کپی‌رایت پایین فوتر -->
    <div class="bg-white border-t border-[#E9DDD2] py-4">
      <div
        class="max-w-[1440px] mx-auto px-4 md:px-8 flex flex-col md:flex-row justify-between items-center text-[13px] text-[#777777]"
      >
        <p>{{ displaySettings.copyright_text }}</p>
        <p class="mt-2 md:mt-0">
          طراحی و توسعه با ❤️ توسط
          <a class="text-[#BC846C] font-semibold hover:text-[#F57A9B] transition-colors" href="#"
            >تیم توسعه</a
          >
        </p>
      </div>
    </div>
  </footer>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import { getPublicSettingApi } from '@/api/settingApi' // اضافه شدن ایمپورت API

const props = defineProps({
  settings: {
    type: Object,
    required: true,
    default: () => ({}),
  },
})

// استیت برای ذخیره لوگوی واکشی شده از دیتابیس
const fetchedLogoUrl = ref<string | null>(null)

// ۱. تعریف مقادیر پیش‌فرض حرفه‌ای برای زمان‌هایی که API دیتایی ندارد
const defaultSettings = {
  site_logo: '/assets/icon/Beautily-Full-logo.png', // مسیر لوگوی پیش‌فرض
  footer_description:
    'بیوتیلی، همراه شما در مسیر زیبایی. ما با ارائه بهترین و باکیفیت‌ترین محصولات آرایشی و بهداشتی، همراه با تضمین اصالت کالا، تجربه‌ای متفاوت از خرید اینترنتی را برای شما رقم می‌زنیم.',
  footer_quick_links: [
    { title: 'صفحه اصلی', url: '/' },
    { title: 'فروشگاه', url: '/shop' },
    { title: 'درباره ما', url: '/about' },
    { title: 'تماس با ما', url: '/contact' },
    { title: 'پیگیری سفارشات', url: '/order-tracking' },
  ],
  contact_address: 'تهران، خیابان ولیعصر، نرسیده به پارک وی، مجتمع تجاری بیوتیلی، طبقه ۵',
  contact_phone: '۰۲۱-۸۸۸۸۸۸۸۸',
  contact_email: 'info@beautily.ir',
  footer_socials: [
    { icon_class: 'fab fa-instagram', url: 'https://instagram.com' },
    { icon_class: 'fab fa-telegram', url: 'https://telegram.org' },
    { icon_class: 'fab fa-twitter', url: 'https://twitter.com' },
  ],
  copyright_text: '© ۱۴۰۵ تمامی حقوق مادی و معنوی برای فروشگاه اینترنتی بیوتیلی محفوظ است.',
}

// تابع واکشی لوگو از API
const fetchSiteLogo = async () => {
  try {
    const response = await getPublicSettingApi('site_logo')
    if (response.data?.image_url) {
      fetchedLogoUrl.value = response.data.image_url
    }
  } catch (error) {
    console.error('Failed to load site logo', error)
  }
}

// اجرای واکشی در زمان مانت شدن کامپوننت
onMounted(async () => {
  await fetchSiteLogo()
})

// ۲. ساخت یک Computed برای ادغام مقادیر داینامیک و پیش‌فرض
const displaySettings = computed(() => {
  return {
    // اولویت: ۱. لوگوی لود شده از API | ۲. لوگوی پاس داده شده در props | ۳. لوگوی پیش‌فرض
    site_logo: fetchedLogoUrl.value || props.settings?.site_logo || defaultSettings.site_logo,

    footer_description: props.settings?.footer_description || defaultSettings.footer_description,
    footer_quick_links:
      props.settings?.footer_quick_links?.length > 0
        ? props.settings.footer_quick_links
        : defaultSettings.footer_quick_links,
    contact_address: props.settings?.contact_address || defaultSettings.contact_address,
    contact_phone: props.settings?.contact_phone || defaultSettings.contact_phone,
    contact_email: props.settings?.contact_email || defaultSettings.contact_email,
    footer_socials:
      props.settings?.footer_socials?.length > 0
        ? props.settings.footer_socials
        : defaultSettings.footer_socials,
    copyright_text: props.settings?.copyright_text || defaultSettings.copyright_text,
  }
})
</script>
