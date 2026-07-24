<template>
  <div class="admin-settings min-h-screen font-vazir bg-[#F8FAFC] p-4 md:p-8">
    <!-- هدر صفحه -->
    <div class="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h2 class="text-2xl font-bold text-[#1E293B] flex items-center gap-2">
          <!-- آیکون هدر -->
          <svg
            class="h-7 w-7 text-[#2563EB]"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          تنظیمات عمومی سایت
        </h2>
        <p class="text-[#475569] text-sm mt-1">
          مدیریت اطلاعات پایه، لینک‌های هدر، شبکه‌های اجتماعی و فوتر
        </p>
      </div>

      <!-- دکمه ذخیره در هدر -->
      <button
        :disabled="isSaving || siteSettingsStore.isLoading"
        class="hidden md:flex items-center justify-center gap-2 bg-[#2563EB] hover:bg-blue-700 text-white font-medium py-2.5 px-6 rounded-lg shadow-sm transition-all duration-200 disabled:opacity-70"
        @click="saveSettings"
      >
        <svg
          v-if="isSaving"
          class="animate-spin h-5 w-5 text-white"
          fill="none"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
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
        <svg
          v-else
          class="h-5 w-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M5 13l4 4L19 7"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
          />
        </svg>
        <span>{{ isSaving ? 'در حال ذخیره...' : 'ذخیره تغییرات' }}</span>
      </button>
    </div>

    <!-- اسکلت لودینگ -->
    <div v-if="siteSettingsStore.isLoading" class="animate-pulse space-y-6">
      <div
        v-for="i in 4"
        :key="i"
        class="bg-white rounded-xl h-48 w-full border border-gray-100 shadow-sm"
      ></div>
    </div>

    <!-- فرم تنظیمات -->
    <form v-else class="space-y-6" @submit.prevent="saveSettings">
      <!-- بخش ۱: اطلاعات پایه و ارتباطی -->
      <section
        class="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:border-[#2563EB]/30 transition-colors duration-300"
      >
        <div class="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
          <div class="bg-blue-50 p-2 rounded-lg text-[#2563EB]">
            <svg
              class="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
              />
            </svg>
          </div>
          <div>
            <h3 class="text-lg font-bold text-[#1E293B]">اطلاعات پایه و ارتباطی</h3>
            <p class="text-xs text-[#475569] mt-0.5">اطلاعات اصلی سایت جهت نمایش در صفحات و فوتر</p>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-semibold text-[#475569] mb-2">عنوان سایت</label>
            <input
              v-model="form.site_title"
              class="w-full bg-[#F8FAFC] border border-gray-200 text-[#1E293B] rounded-lg px-4 py-2.5 focus:bg-white focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 transition-all outline-none"
              placeholder="مثال: بیوتیلی"
              type="text"
            />
          </div>
          <div>
            <label class="block text-sm font-semibold text-[#475569] mb-2">شماره تماس</label>
            <input
              v-model="form.contact_phone"
              class="w-full bg-[#F8FAFC] border border-gray-200 text-[#1E293B] rounded-lg px-4 py-2.5 focus:bg-white focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 transition-all outline-none text-left"
              dir="ltr"
              placeholder="021-88888888"
              type="text"
            />
          </div>
          <div class="md:col-span-2">
            <label class="block text-sm font-semibold text-[#475569] mb-2">آدرس فیزیکی</label>
            <input
              v-model="form.contact_address"
              class="w-full bg-[#F8FAFC] border border-gray-200 text-[#1E293B] rounded-lg px-4 py-2.5 focus:bg-white focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 transition-all outline-none"
              placeholder="آدرس شرکت یا فروشگاه"
              type="text"
            />
          </div>
          <div class="md:col-span-2">
            <label class="block text-sm font-semibold text-[#475569] mb-2"
              >توضیحات فوتر (درباره ما)</label
            >
            <textarea
              v-model="form.footer_description"
              class="w-full bg-[#F8FAFC] border border-gray-200 text-[#1E293B] rounded-lg px-4 py-2.5 focus:bg-white focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 transition-all outline-none"
              rows="3"
            ></textarea>
          </div>
        </div>
      </section>

      <!-- بخش ۲: مدیریت منوی هدر -->
      <section
        class="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:border-[#2563EB]/30 transition-colors duration-300"
      >
        <div class="flex items-center justify-between mb-6 border-b border-gray-100 pb-4">
          <div class="flex items-center gap-3">
            <div class="bg-purple-50 p-2 rounded-lg text-purple-600">
              <svg
                class="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4 6h16M4 12h16M4 18h7"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                />
              </svg>
            </div>
            <div>
              <h3 class="text-lg font-bold text-[#1E293B]">لینک‌های منوی هدر</h3>
              <p class="text-xs text-[#475569] mt-0.5">مدیریت لینک‌های دسترسی سریع در بالای سایت</p>
            </div>
          </div>
          <button
            class="text-sm text-[#2563EB] font-bold hover:underline flex items-center gap-1"
            type="button"
            @click="addHeaderLink"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                d="M12 4v16m8-8H4"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
              ></path>
            </svg>
            افزودن لینک
          </button>
        </div>

        <div class="space-y-4">
          <div
            v-for="(link, index) in form.header_nav_links"
            :key="index"
            class="flex flex-col md:flex-row gap-4 items-start bg-[#F8FAFC] p-4 rounded-lg border border-gray-200"
          >
            <div class="flex-1 w-full grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-semibold text-[#475569] mb-1">عنوان لینک</label>
                <input
                  v-model="link.name"
                  class="w-full bg-white border border-gray-200 text-[#1E293B] rounded-lg px-3 py-2 text-sm focus:border-[#2563EB] outline-none"
                  placeholder="مثال: فروشگاه"
                  type="text"
                />
              </div>
              <div>
                <label class="block text-xs font-semibold text-[#475569] mb-1">مسیر (Path)</label>
                <input
                  v-model="link.path"
                  class="w-full bg-white border border-gray-200 text-[#1E293B] rounded-lg px-3 py-2 text-sm focus:border-[#2563EB] outline-none text-left"
                  dir="ltr"
                  placeholder="/products"
                  type="text"
                />
              </div>
            </div>
            <button
              class="text-red-500 hover:text-red-700 md:mt-6 p-2 bg-white rounded-lg border border-red-100 hover:bg-red-50"
              type="button"
              @click="removeHeaderLink(index)"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                />
              </svg>
            </button>
          </div>
        </div>
      </section>

      <!-- بخش ۳: لینک‌های دسترسی سریع فوتر -->
      <section
        class="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:border-[#2563EB]/30 transition-colors duration-300"
      >
        <div class="flex items-center justify-between mb-6 border-b border-gray-100 pb-4">
          <div class="flex items-center gap-3">
            <div class="bg-indigo-50 p-2 rounded-lg text-indigo-600">
              <svg
                class="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                />
              </svg>
            </div>
            <div>
              <h3 class="text-lg font-bold text-[#1E293B]">دسترسی سریع (فوتر)</h3>
              <p class="text-xs text-[#475569] mt-0.5">مدیریت لینک‌های ستون دسترسی سریع در فوتر</p>
            </div>
          </div>
          <button
            class="text-sm text-[#2563EB] font-bold hover:underline flex items-center gap-1"
            type="button"
            @click="addFooterQuickLink"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                d="M12 4v16m8-8H4"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
              ></path>
            </svg>
            افزودن لینک
          </button>
        </div>

        <div class="space-y-4">
          <div
            v-for="(link, index) in form.footer_quick_links"
            :key="index"
            class="flex flex-col md:flex-row gap-4 items-start bg-[#F8FAFC] p-4 rounded-lg border border-gray-200"
          >
            <div class="flex-1 w-full grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-semibold text-[#475569] mb-1">عنوان لینک</label>
                <input
                  v-model="link.name"
                  class="w-full bg-white border border-gray-200 text-[#1E293B] rounded-lg px-3 py-2 text-sm focus:border-[#2563EB] outline-none"
                  placeholder="مثال: محصولات ما"
                  type="text"
                />
              </div>
              <div>
                <label class="block text-xs font-semibold text-[#475569] mb-1">مسیر (Path)</label>
                <input
                  v-model="link.path"
                  class="w-full bg-white border border-gray-200 text-[#1E293B] rounded-lg px-3 py-2 text-sm focus:border-[#2563EB] outline-none text-left"
                  dir="ltr"
                  placeholder="/shop"
                  type="text"
                />
              </div>
            </div>
            <button
              class="text-red-500 hover:text-red-700 md:mt-6 p-2 bg-white rounded-lg border border-red-100 hover:bg-red-50"
              type="button"
              @click="removeFooterQuickLink(index)"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                />
              </svg>
            </button>
          </div>
        </div>
      </section>

      <!-- بخش ۴: لینک‌های خدمات مشتریان فوتر -->
      <section
        class="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:border-[#2563EB]/30 transition-colors duration-300"
      >
        <div class="flex items-center justify-between mb-6 border-b border-gray-100 pb-4">
          <div class="flex items-center gap-3">
            <div class="bg-orange-50 p-2 rounded-lg text-orange-600">
              <svg
                class="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                />
              </svg>
            </div>
            <div>
              <h3 class="text-lg font-bold text-[#1E293B]">خدمات مشتریان (فوتر)</h3>
              <p class="text-xs text-[#475569] mt-0.5">
                مدیریت لینک‌های ستون خدمات مشتریان در فوتر
              </p>
            </div>
          </div>
          <button
            class="text-sm text-[#2563EB] font-bold hover:underline flex items-center gap-1"
            type="button"
            @click="addFooterServiceLink"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                d="M12 4v16m8-8H4"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
              ></path>
            </svg>
            افزودن لینک
          </button>
        </div>

        <div class="space-y-4">
          <div
            v-for="(link, index) in form.footer_customer_services"
            :key="index"
            class="flex flex-col md:flex-row gap-4 items-start bg-[#F8FAFC] p-4 rounded-lg border border-gray-200"
          >
            <div class="flex-1 w-full grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-semibold text-[#475569] mb-1">عنوان لینک</label>
                <input
                  v-model="link.name"
                  class="w-full bg-white border border-gray-200 text-[#1E293B] rounded-lg px-3 py-2 text-sm focus:border-[#2563EB] outline-none"
                  placeholder="مثال: پیگیری سفارش"
                  type="text"
                />
              </div>
              <div>
                <label class="block text-xs font-semibold text-[#475569] mb-1">مسیر (Path)</label>
                <input
                  v-model="link.path"
                  class="w-full bg-white border border-gray-200 text-[#1E293B] rounded-lg px-3 py-2 text-sm focus:border-[#2563EB] outline-none text-left"
                  dir="ltr"
                  placeholder="/tracking"
                  type="text"
                />
              </div>
            </div>
            <button
              class="text-red-500 hover:text-red-700 md:mt-6 p-2 bg-white rounded-lg border border-red-100 hover:bg-red-50"
              type="button"
              @click="removeFooterServiceLink(index)"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                />
              </svg>
            </button>
          </div>
        </div>
      </section>

      <!-- بخش ۵: شبکه‌های اجتماعی -->
      <section
        class="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:border-[#2563EB]/30 transition-colors duration-300"
      >
        <div class="flex items-center justify-between mb-6 border-b border-gray-100 pb-4">
          <div class="flex items-center gap-3">
            <div class="bg-pink-50 p-2 rounded-lg text-pink-600">
              <svg
                class="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                />
              </svg>
            </div>
            <div>
              <h3 class="text-lg font-bold text-[#1E293B]">شبکه‌های اجتماعی</h3>
              <p class="text-xs text-[#475569] mt-0.5">آیکون و لینک صفحات مجازی شما</p>
            </div>
          </div>
          <button
            class="text-sm text-[#2563EB] font-bold hover:underline flex items-center gap-1"
            type="button"
            @click="addSocialLink"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                d="M12 4v16m8-8H4"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
              ></path>
            </svg>
            افزودن شبکه
          </button>
        </div>

        <div class="space-y-4">
          <div
            v-for="(social, index) in form.social_links"
            :key="index"
            class="flex flex-col md:flex-row gap-4 items-start bg-[#F8FAFC] p-4 rounded-lg border border-gray-200"
          >
            <div class="flex-1 w-full grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label class="block text-xs font-semibold text-[#475569] mb-1">نام شبکه</label>
                <input
                  v-model="social.name"
                  class="w-full bg-white border border-gray-200 text-[#1E293B] rounded-lg px-3 py-2 text-sm focus:border-[#2563EB]"
                  placeholder="مثال: اینستاگرام"
                  type="text"
                />
              </div>
              <div>
                <label class="block text-xs font-semibold text-[#475569] mb-1"
                  >آدرس لینک (URL)</label
                >
                <input
                  v-model="social.url"
                  class="w-full bg-white border border-gray-200 text-[#1E293B] rounded-lg px-3 py-2 text-sm focus:border-[#2563EB] text-left"
                  dir="ltr"
                  placeholder="https://..."
                  type="url"
                />
              </div>
              <div>
                <label class="block text-xs font-semibold text-[#475569] mb-1">کلاس آیکون</label>
                <input
                  v-model="social.icon_class"
                  class="w-full bg-white border border-gray-200 text-[#1E293B] rounded-lg px-3 py-2 text-sm focus:border-[#2563EB] text-left"
                  dir="ltr"
                  placeholder="fab fa-instagram"
                  type="text"
                />
              </div>
            </div>
            <button
              class="text-red-500 hover:text-red-700 md:mt-6 p-2 bg-white rounded-lg border border-red-100 hover:bg-red-50"
              type="button"
              @click="removeSocialLink(index)"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                />
              </svg>
            </button>
          </div>
        </div>
      </section>

      <!-- بخش ۶: نمادهای اعتماد -->
      <section
        class="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:border-[#2563EB]/30 transition-colors duration-300"
      >
        <div class="flex items-center justify-between mb-6 border-b border-gray-100 pb-4">
          <div class="flex items-center gap-3">
            <div class="bg-[#ECFDF5] p-2 rounded-lg text-[#04786A]">
              <svg
                class="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                />
              </svg>
            </div>
            <div>
              <h3 class="text-lg font-bold text-[#1E293B]">نمادهای اعتماد</h3>
              <p class="text-xs text-[#475569] mt-0.5">
                مدیریت نماد الکترونیک (اینماد)، ساماندهی و ...
              </p>
            </div>
          </div>
          <button
            class="text-sm text-[#2563EB] font-bold hover:underline flex items-center gap-1"
            type="button"
            @click="addTrustBadge"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                d="M12 4v16m8-8H4"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
              ></path>
            </svg>
            افزودن نماد
          </button>
        </div>

        <div class="space-y-4">
          <div
            v-for="(badge, index) in form.trust_badges"
            :key="index"
            class="flex flex-col md:flex-row gap-4 items-start bg-[#F8FAFC] p-4 rounded-lg border border-gray-200"
          >
            <div class="flex-1 w-full space-y-4">
              <div>
                <label class="block text-xs font-semibold text-[#475569] mb-1"
                  >عنوان نماد (اختیاری)</label
                >
                <input
                  v-model="badge.title"
                  class="w-full bg-white border border-gray-200 text-[#1E293B] rounded-lg px-3 py-2 text-sm focus:border-[#2563EB]"
                  placeholder="مثال: اینماد"
                  type="text"
                />
              </div>
              <div>
                <label class="block text-xs font-semibold text-[#475569] mb-1"
                  >کد HTML یا اسکریپت</label
                >
                <textarea
                  v-model="badge.code_or_image"
                  class="w-full bg-white border border-gray-200 text-[#1E293B] rounded-lg px-3 py-2 text-sm focus:border-[#2563EB] font-mono text-left"
                  dir="ltr"
                  placeholder="<script>...</script>"
                  rows="3"
                ></textarea>
              </div>
            </div>
            <button
              class="text-red-500 hover:text-red-700 md:mt-6 p-2 bg-white rounded-lg border border-red-100 hover:bg-red-50"
              title="حذف نماد"
              type="button"
              @click="removeTrustBadge(index)"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                />
              </svg>
            </button>
          </div>
        </div>
      </section>

      <!-- دکمه ذخیره در پایین فرم -->
      <div class="flex justify-end pt-4 pb-8 md:pb-0">
        <button
          :disabled="isSaving || siteSettingsStore.isLoading"
          class="w-full md:w-auto flex items-center justify-center gap-2 bg-[#2563EB] hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-xl shadow-md transition-all duration-200 disabled:opacity-70"
          type="submit"
        >
          <svg
            v-if="isSaving"
            class="animate-spin h-5 w-5 text-white"
            fill="none"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
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
          <span>{{ isSaving ? 'در حال ثبت اطلاعات...' : 'ذخیره تنظیمات سیستم' }}</span>
        </button>
      </div>
    </form>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { useNotificationStore } from '@/stores/notification'
import { useSiteSettingsStore } from '@/stores/siteSettings'

const isSaving = ref(false)
const notify = useNotificationStore()
const siteSettingsStore = useSiteSettingsStore()

// ساختار دیتای فرم آپدیت شده با لینک‌های فوتر
const form = ref({
  site_title: '',
  footer_description: '',
  contact_address: '',
  contact_phone: '',
  header_nav_links: [] as { name: string; path: string }[],
  footer_quick_links: [] as { name: string; path: string }[],
  footer_customer_services: [] as { name: string; path: string }[],
  social_links: [] as { name: string; url: string; icon_class: string }[],
  trust_badges: [] as { title: string; code_or_image: string }[],
})

// متدهای مدیریت آرایه‌ها
const addHeaderLink = () => form.value.header_nav_links.push({ name: '', path: '' })
const removeHeaderLink = (index: number) => form.value.header_nav_links.splice(index, 1)

const addFooterQuickLink = () => form.value.footer_quick_links.push({ name: '', path: '' })
const removeFooterQuickLink = (index: number) => form.value.footer_quick_links.splice(index, 1)

const addFooterServiceLink = () => form.value.footer_customer_services.push({ name: '', path: '' })
const removeFooterServiceLink = (index: number) =>
  form.value.footer_customer_services.splice(index, 1)

const addSocialLink = () => form.value.social_links.push({ name: '', url: '', icon_class: '' })
const removeSocialLink = (index: number) => form.value.social_links.splice(index, 1)

const addTrustBadge = () => form.value.trust_badges.push({ title: '', code_or_image: '' })
const removeTrustBadge = (index: number) => form.value.trust_badges.splice(index, 1)

// دریافت تنظیمات از استور
const fetchSettings = async () => {
  try {
    await siteSettingsStore.fetchSettings(true)

    if (siteSettingsStore.settings) {
      const fetchedSettings = siteSettingsStore.settings

      // تعیین نوع پارامترها و اضافه شدن کلیدهای جدید به لیست بررسی
      const processValue = (key: string, value: any) => {
        if (
          typeof value === 'string' &&
          [
            'header_nav_links',
            'footer_quick_links',
            'footer_customer_services',
            'social_links',
            'trust_badges',
          ].includes(key)
        ) {
          try {
            return JSON.parse(value)
          } catch (e) {
            return []
          }
        }
        return value
      }

      if (Array.isArray(fetchedSettings)) {
        fetchedSettings.forEach((item: any) => {
          if (item.key && Object.keys(form.value).includes(item.key)) {
            ;(form.value as any)[item.key] =
              processValue(item.key, item.value) ?? (form.value as any)[item.key]
          }
        })
      } else if (typeof fetchedSettings === 'object' && fetchedSettings !== null) {
        Object.keys(fetchedSettings).forEach((key: string) => {
          if (Object.keys(form.value).includes(key)) {
            ;(form.value as any)[key] =
              processValue(key, (fetchedSettings as Record<string, any>)[key]) ??
              (form.value as any)[key]
          }
        })
      }
    }
  } catch (error) {
    console.error('خطا در دریافت تنظیمات', error)
    notify.error('خطا در دریافت اطلاعات تنظیمات.')
  }
}

// ذخیره تنظیمات از طریق استور
const saveSettings = async () => {
  try {
    isSaving.value = true
    await siteSettingsStore.updateSettings({ settings: form.value })
    notify.success('تنظیمات با موفقیت ذخیره شد.')
  } catch (error) {
    console.error('خطا در ذخیره تنظیمات', error)
    notify.error('خطا در ذخیره‌سازی اطلاعات.')
  } finally {
    isSaving.value = false
  }
}

onMounted(() => {
  fetchSettings()
})
</script>
