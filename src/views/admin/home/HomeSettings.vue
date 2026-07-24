<template>
  <div class="admin-settings min-h-screen font-vazir bg-[#F8FAFC] p-4 md:p-8">
    <!-- هدر صفحه -->
    <div class="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h2 class="text-xl md:text-2xl font-bold text-[#1E293B] flex items-center gap-2">
          <svg
            class="h-6 w-6 md:h-7 md:w-7 text-blue-600"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          مدیریت محتوای صفحه اصلی
        </h2>
        <p class="text-[#475569] text-xs md:text-sm mt-2">
          از این بخش می‌توانید محتوای ویترین سایت را مدیریت کنید.
        </p>
      </div>
    </div>

    <!-- بخش انتخابگر تب‌ها -->
    <div class="mb-6">
      <!-- حالت موبایل: منوی کشویی (Select) مدرن -->
      <div class="md:hidden relative">
        <select
          v-model="activeTab"
          class="block w-full appearance-none rounded-xl border border-gray-200 bg-white py-3 px-4 pr-10 text-sm font-medium text-gray-700 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option v-for="tab in tabs" :key="tab.value" :value="tab.value">
            {{ tab.label }}
          </option>
        </select>
        <!-- آیکون فلش برای منوی کشویی (ویژه حالت RTL) -->
        <div
          class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500"
        >
          <svg
            class="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19 9l-7 7-7-7"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
            ></path>
          </svg>
        </div>
      </div>

      <!-- حالت دسکتاپ: تب‌های خطی (Pills) -->
      <div class="hidden md:flex bg-white rounded-xl shadow-sm border border-gray-200 p-1.5 w-max">
        <nav aria-label="Tabs" class="flex space-x-2 rtl:space-x-reverse min-w-max">
          <button
            v-for="tab in tabs"
            :key="tab.value"
            :class="[
              activeTab === tab.value
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-[#475569] hover:bg-gray-50 hover:text-[#1E293B]',
              'px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 whitespace-nowrap',
            ]"
            @click="activeTab = tab.value"
          >
            {{ tab.label }}
          </button>
        </nav>
      </div>
    </div>

    <!-- محتوای تب‌ها -->
    <div class="mt-4 transition-all duration-300">
      <HomeHeroManager v-if="activeTab === 'heroes'" />
      <HomeProductSliderManager v-else-if="activeTab === 'product_sliders'" />
      <BannerManager v-else-if="activeTab === 'banners'" />
      <FeatureManager v-else-if="activeTab === 'features'" />
      <HomeCategoriesManager v-else-if="activeTab === 'categories'" />
      <HomeBlogsManager v-else-if="activeTab === 'blogs'" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import BannerManager from '@/views/admin/home/Tabs/BannerManager.vue'
import FeatureManager from '@/views/admin/home/Tabs/FeatureManager.vue'
import HomeHeroManager from '@/views/admin/home/Tabs/HomeHeroManager.vue'
import HomeCategoriesManager from '@/views/admin/home/Tabs/HomeCategoriesManager.vue'
import HomeBlogsManager from '@/views/admin/home/Tabs/HomeBlogsManager.vue'
import HomeProductSliderManager from '@/views/admin/home/Tabs/HomeProductSliderManager.vue'

// تایپ‌های ممکن برای تب‌ها
type TabKey = 'heroes' | 'product_sliders' | 'banners' | 'features' | 'categories' | 'blogs'

const activeTab = ref<TabKey>('heroes')

// آرایه تب‌ها برای مدیریت راحت‌تر و جلوگیری از تکرار کد در قالب
const tabs: { label: string; value: TabKey }[] = [
  { label: 'اسلایدر اصلی (هیرو)', value: 'heroes' },
  { label: 'اسلایدرهای محصول', value: 'product_sliders' },
  { label: 'بنرهای تبلیغاتی', value: 'banners' },
  { label: 'ویژگی‌های فروشگاه', value: 'features' },
  { label: 'دسته‌بندی‌ها', value: 'categories' },
  { label: 'مقالات', value: 'blogs' },
]
</script>
