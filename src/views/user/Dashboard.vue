<template>
  <div class="space-y-6 font-iransans">
    <!-- ۱. بنر خوش‌آمدگویی و تکمیل پروفایل -->
    <div
      class="bg-gradient-to-l from-[#F57A9B] to-[#DFA9C7] rounded-2xl p-6 md:p-8 shadow-lg text-white relative overflow-hidden"
    >
      <!-- پترن پس‌زمینه تزئینی -->
      <svg
        class="absolute opacity-10 right-0 top-0 w-64 h-64 transform translate-x-16 -translate-y-16"
        fill="currentColor"
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="50" cy="50" r="50" />
      </svg>

      <div
        class="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
      >
        <div>
          <h1 class="text-2xl font-bold mb-2">سلام، خوش آمدید! 👋</h1>
          <p class="text-white/90 text-sm md:text-base leading-relaxed max-w-xl">
            به پنل کاربری خود در بیوتیلی خوش آمدید. از اینجا می‌توانید سفارشات، علاقه‌مندی‌ها و
            اطلاعات حساب کاربری خود را به راحتی مدیریت کنید.
          </p>
        </div>
        <div
          class="bg-white/20 backdrop-blur-sm px-4 py-3 rounded-xl border border-white/30 text-center w-full md:w-auto"
        >
          <p class="text-sm font-medium mb-1">امتیاز شما (کلاب)</p>
          <p class="text-2xl font-bold text-[#FDFBF9]">
            ۱۲۰ <span class="text-xs font-normal text-white/80">امتیاز</span>
          </p>
        </div>
      </div>
    </div>

    <!-- ۲. ویجت‌های آماری (۴ ستونه) -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      <!-- سفارش‌های جاری -->
      <div
        class="bg-[#FDFBF9] dark:bg-slate-800 rounded-2xl p-5 border border-[#E9DDD2] dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow group"
      >
        <div class="flex items-center gap-4">
          <div
            class="p-3.5 rounded-2xl bg-[#F5F5F7] dark:bg-slate-700 text-[#F57A9B] dark:text-[#DFA9C7] group-hover:scale-110 transition-transform border border-[#EEDAC5] dark:border-slate-600"
          >
            <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                d="M13 10V3L4 14h7v7l9-11h-7z"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
              ></path>
            </svg>
          </div>
          <div>
            <p class="text-sm text-[#777777] dark:text-gray-400 mb-1">سفارش‌های جاری</p>
            <p class="text-2xl font-bold text-[#333333] dark:text-white">
              ۲ <span class="text-xs font-normal text-[#777777]">مورد</span>
            </p>
          </div>
        </div>
      </div>

      <!-- سفارش‌های تحویل شده -->
      <div
        class="bg-[#FDFBF9] dark:bg-slate-800 rounded-2xl p-5 border border-[#E9DDD2] dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow group"
      >
        <div class="flex items-center gap-4">
          <div
            class="p-3.5 rounded-2xl bg-[#EEDAC5]/40 dark:bg-slate-700 text-[#BC846C] dark:text-[#EEDAC5] group-hover:scale-110 transition-transform border border-[#EEDAC5] dark:border-slate-600"
          >
            <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
              ></path>
            </svg>
          </div>
          <div>
            <p class="text-sm text-[#777777] dark:text-gray-400 mb-1">سفارش‌های تحویل شده</p>
            <p class="text-2xl font-bold text-[#333333] dark:text-white">
              ۱۴ <span class="text-xs font-normal text-[#777777]">مورد</span>
            </p>
          </div>
        </div>
      </div>

      <!-- کیف پول -->
      <div
        class="bg-[#FDFBF9] dark:bg-slate-800 rounded-2xl p-5 border border-[#E9DDD2] dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow group"
      >
        <div class="flex items-center gap-4">
          <div
            class="p-3.5 rounded-2xl bg-[#DFA9C7]/20 dark:bg-slate-700 text-[#F57A9B] dark:text-[#DFA9C7] group-hover:scale-110 transition-transform border border-[#EEDAC5] dark:border-slate-600"
          >
            <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
              ></path>
            </svg>
          </div>
          <div>
            <p class="text-sm text-[#777777] dark:text-gray-400 mb-1">موجودی کیف پول</p>
            <p class="text-lg font-bold text-[#333333] dark:text-white">
              ۱۵۰,۰۰۰ <span class="text-xs font-normal text-[#777777]">تومان</span>
            </p>
          </div>
        </div>
      </div>

      <!-- علاقه‌مندی‌ها -->
      <div
        class="bg-[#FDFBF9] dark:bg-slate-800 rounded-2xl p-5 border border-[#E9DDD2] dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow group"
      >
        <div class="flex items-center gap-4">
          <div
            class="p-3.5 rounded-2xl bg-[#F5F5F7] dark:bg-slate-700 text-[#BC846C] dark:text-[#EEDAC5] group-hover:scale-110 transition-transform border border-[#EEDAC5] dark:border-slate-600"
          >
            <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
              ></path>
            </svg>
          </div>
          <div>
            <p class="text-sm text-[#777777] dark:text-gray-400 mb-1">کالاهای نشان‌شده</p>
            <p class="text-2xl font-bold text-[#333333] dark:text-white">
              ۸ <span class="text-xs font-normal text-[#777777]">کالا</span>
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- ۳. چیدمان دو ستونه برای بخش‌های محتوایی -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- ستون راست (بزرگتر): آخرین سفارش‌ها -->
      <div
        class="lg:col-span-2 bg-[#FDFBF9] dark:bg-slate-800 rounded-2xl border border-[#E9DDD2] dark:border-slate-700 shadow-sm flex flex-col"
      >
        <div
          class="p-5 border-b border-[#E9DDD2] dark:border-slate-700 flex items-center justify-between"
        >
          <h3 class="text-lg font-bold text-[#333333] dark:text-white flex items-center gap-2">
            <svg
              class="w-5 h-5 text-[#BC846C]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
              ></path>
            </svg>
            آخرین سفارش‌ها
          </h3>
          <router-link
            :to="{ name: 'user.orders' }"
            class="text-sm text-[#F57A9B] hover:text-[#DFA9C7] dark:text-[#DFA9C7] dark:hover:text-white font-medium flex items-center gap-1 transition-colors"
          >
            مشاهده همه
            <svg
              class="w-4 h-4 rtl:rotate-180"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M9 5l7 7-7 7"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
              ></path>
            </svg>
          </router-link>
        </div>

        <div class="p-5 flex-1 flex flex-col justify-center">
          <div class="space-y-4">
            <div
              class="flex items-center justify-between p-4 rounded-xl border border-[#E9DDD2] dark:border-slate-700 bg-[#F5F5F7]/50 dark:bg-slate-800/50"
            >
              <div class="flex items-center gap-4">
                <div
                  class="w-12 h-12 rounded-lg bg-[#EEDAC5]/30 dark:bg-slate-700 flex-shrink-0 flex items-center justify-center border border-[#E9DDD2] dark:border-slate-600"
                >
                  <svg
                    class="w-6 h-6 text-[#BC846C] dark:text-[#DFA9C7]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                    ></path>
                  </svg>
                </div>
                <div>
                  <div class="flex items-center gap-2 mb-1">
                    <span class="text-sm font-bold text-[#333333] dark:text-white"
                      >DKC-98765432</span
                    >
                    <span
                      class="px-2 py-0.5 rounded-md bg-[#EEDAC5]/50 text-[#BC846C] dark:bg-slate-700 dark:text-[#DFA9C7] border border-[#E9DDD2] dark:border-slate-600 text-xs font-medium"
                      >در حال پردازش</span
                    >
                  </div>
                  <p class="text-xs text-[#777777] dark:text-gray-400">
                    ۱۴ فروردین ۱۴۰۵ | مبلغ: ۴۵۰,۰۰۰ تومان
                  </p>
                </div>
              </div>
              <button
                class="hidden sm:block text-[#777777] hover:text-[#F57A9B] dark:text-gray-400 dark:hover:text-[#DFA9C7] transition-colors"
              >
                <svg
                  class="w-5 h-5 rtl:rotate-180"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M9 5l7 7-7 7"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                  ></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- ستون چپ (کوچکتر): اطلاعیه‌ها یا دسترسی سریع -->
      <div
        class="bg-[#FDFBF9] dark:bg-slate-800 rounded-2xl border border-[#E9DDD2] dark:border-slate-700 shadow-sm p-5"
      >
        <h3
          class="text-lg font-bold text-[#333333] dark:text-white mb-4 border-b border-[#E9DDD2] dark:border-slate-700 pb-3 flex items-center gap-2"
        >
          <svg class="w-5 h-5 text-[#F57A9B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
            ></path>
          </svg>
          پیام‌ها و اطلاعیه‌ها
        </h3>

        <ul class="space-y-4">
          <li class="flex gap-3">
            <div class="mt-1 w-2 h-2 rounded-full bg-[#F57A9B] shrink-0"></div>
            <div>
              <p class="text-sm font-medium text-[#333333] dark:text-gray-200">
                کد تخفیف نوروزی شما 🌸
              </p>
              <p class="text-xs text-[#777777] dark:text-gray-400 mt-1">
                با کد NOROUZ1405 از ۲۰٪ تخفیف بهره‌مند شوید.
              </p>
            </div>
          </li>
          <li class="flex gap-3">
            <div class="mt-1 w-2 h-2 rounded-full bg-[#BC846C] shrink-0"></div>
            <div>
              <p class="text-sm font-medium text-[#333333] dark:text-gray-200">
                سفارش شما تحویل داده شد
              </p>
              <p class="text-xs text-[#777777] dark:text-gray-400 mt-1">
                سفارش DKC-8765 در تاریخ ۱۲ فروردین تحویل شد.
              </p>
            </div>
          </li>
          <li class="flex gap-3">
            <div class="mt-1 w-2 h-2 rounded-full bg-[#E9DDD2] dark:bg-slate-600 shrink-0"></div>
            <div>
              <p class="text-sm font-medium text-[#333333] dark:text-gray-200">
                تکمیل اطلاعات حساب کاربری
              </p>
              <p class="text-xs text-[#777777] dark:text-gray-400 mt-1">
                برای دریافت فاکتور رسمی، لطفا کدملی خود را ثبت کنید.
              </p>
            </div>
          </li>
        </ul>

        <div class="mt-6 pt-4 border-t border-[#E9DDD2] dark:border-slate-700">
          <router-link
            :to="{ name: 'user.profile' }"
            class="w-full flex items-center justify-center py-2 bg-[#F5F5F7] hover:bg-[#EEDAC5]/30 dark:bg-slate-700/50 dark:hover:bg-slate-700 text-sm text-[#777777] hover:text-[#F57A9B] dark:text-gray-300 dark:hover:text-[#DFA9C7] rounded-lg transition-colors border border-[#E9DDD2] dark:border-slate-600"
          >
            ویرایش اطلاعات حساب
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
// می‌توانید استور کاربری را اینجا فراخوانی کنید تا نام و امتیاز کاربر داینامیک شود
</script>
