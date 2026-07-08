<template>
  <div class="min-h-screen bg-[#F5F5F7] font-vazir-light text-[#333333]" dir="rtl">
    <!-- ================= Header & Navbar ================= -->

    <!-- ================= Hero Section ================= -->
    <section class="relative bg-[#FFFFFF] overflow-hidden">
      <!-- Background Decorative Elements -->
      <div
        class="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#EEDAC5]/40 to-transparent"
      ></div>
      <div
        class="absolute -top-24 -right-24 w-96 h-96 bg-[#FC9FAF] rounded-full mix-blend-multiply filter blur-3xl opacity-30"
      ></div>

      <div class="container mx-auto px-4 md:px-8 py-16 md:py-24 relative z-10">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <!-- Text Content -->
          <div class="flex flex-col gap-6 text-right">
            <span
              class="text-[#DC3287] font-vazir-bold text-sm md:text-base tracking-widest uppercase"
              >کالکشن جدید ۲۰۲۴</span
            >
            <h1 class="text-4xl md:text-6xl text-[#333333] font-vazir-bold leading-[1.3]">
              استایل خود را با <br />
              <span
                class="text-transparent bg-clip-text bg-gradient-to-r from-[#DC3287] to-[#DFA9C7]"
                >شیک‌پوش</span
              >
              بسازید
            </h1>
            <p class="text-[#777777] font-vazir-light text-lg max-w-lg leading-relaxed">
              کشف جدیدترین ترندهای مد و پوشاک با کیفیتی بی‌نظیر. راحتی و زیبایی را در یک قاب تجربه
              کنید و متفاوت‌تر از همیشه بدرخشید.
            </p>
            <div class="flex items-center gap-4 mt-4">
              <button
                class="bg-[#DC3287] hover:bg-[#FC9FAF] text-[#FFFFFF] font-vazir-bold px-8 py-4 rounded-xl shadow-lg shadow-[#DC3287]/30 transition-all transform hover:-translate-y-1"
              >
                مشاهده محصولات
              </button>
              <button
                class="bg-[#F3F5F8] hover:bg-[#EEDAC5] text-[#333333] font-vazir-medium px-8 py-4 rounded-xl transition-colors"
              >
                اطلاعات بیشتر
              </button>
            </div>
          </div>

          <!-- Hero Image/Banner -->
          <div
            class="relative h-[400px] lg:h-[500px] rounded-3xl bg-[#EEDAC5] overflow-hidden shadow-2xl group flex items-center justify-center"
          >
            <!-- جایگزین تصویر -->
            <span class="text-[#FFFFFF] font-vazir-thin text-6xl opacity-40 select-none"
              >تصویر مدل</span
            >

            <!-- Floating Badge -->
            <div
              class="absolute bottom-8 right-8 bg-[#FFFFFF]/90 backdrop-blur p-4 rounded-2xl shadow-xl flex items-center gap-4 animate-bounce-slow"
            >
              <div
                class="bg-[#FC9FAF] w-12 h-12 rounded-full flex items-center justify-center text-[#FFFFFF] font-vazir-bold"
              >
                %۳۰
              </div>
              <div>
                <p class="text-[#333333] font-vazir-bold text-sm">تخفیف ویژه</p>
                <p class="text-[#777777] font-vazir-light text-xs">برای اولین خرید</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ================= Trust Features ================= -->
    <section class="relative -mt-10 z-20">
      <div class="container mx-auto px-4 md:px-8">
        <div
          class="bg-[#FFFFFF] rounded-2xl shadow-xl shadow-gray-200/50 p-6 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-8 divide-y md:divide-y-0 md:divide-x md:divide-x-reverse divide-[#F3F5F8]"
        >
          <div class="flex items-center gap-4 pt-4 md:pt-0">
            <div
              class="w-14 h-14 rounded-2xl bg-[#EEDAC5]/50 flex items-center justify-center text-[#DC3287]"
            >
              <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.5"
                ></path>
              </svg>
            </div>
            <div>
              <h3 class="text-[#333333] font-vazir-bold text-lg">ارسال سریع و رایگان</h3>
              <p class="text-[#777777] font-vazir-light text-sm mt-1">
                خریدهای بالای ۱ میلیون تومان
              </p>
            </div>
          </div>
          <div class="flex items-center gap-4 pt-4 md:pt-0 pl-0 md:pl-4">
            <div
              class="w-14 h-14 rounded-2xl bg-[#DFA9C7]/30 flex items-center justify-center text-[#DC3287]"
            >
              <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.5"
                ></path>
              </svg>
            </div>
            <div>
              <h3 class="text-[#333333] font-vazir-bold text-lg">ضمانت اصالت کالا</h3>
              <p class="text-[#777777] font-vazir-light text-sm mt-1">تضمین کیفیت ۱۰۰٪</p>
            </div>
          </div>
          <div class="flex items-center gap-4 pt-4 md:pt-0 pl-0 md:pl-4">
            <div
              class="w-14 h-14 rounded-2xl bg-[#FC9FAF]/30 flex items-center justify-center text-[#DC3287]"
            >
              <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  d="M16 15v-1a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3m9 14V5a2 2 0 00-2-2H6a2 2 0 00-2 2v16l4-2 4 2 4-2 4 2z"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.5"
                ></path>
              </svg>
            </div>
            <div>
              <h3 class="text-[#333333] font-vazir-bold text-lg">۷ روز ضمانت بازگشت</h3>
              <p class="text-[#777777] font-vazir-light text-sm mt-1">خرید با خیال آسوده</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ================= Categories ================= -->
    <section class="py-20">
      <div class="container mx-auto px-4 md:px-8">
        <div class="flex items-end justify-between mb-10">
          <div>
            <h2 class="text-[#333333] font-vazir-bold text-3xl">دسته‌بندی‌های محبوب</h2>
            <p class="text-[#777777] font-vazir-light mt-2">
              آنچه به دنبالش هستید را راحت‌تر پیدا کنید
            </p>
          </div>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div v-for="i in 4" :key="i" class="group cursor-pointer">
            <div
              class="bg-[#F3F5F8] rounded-full aspect-square mb-4 relative overflow-hidden flex items-center justify-center transition-all duration-300 group-hover:shadow-xl group-hover:shadow-[#EEDAC5]/50 group-hover:-translate-y-2"
            >
              <span class="text-[#777777] font-vazir-light">عکس دسته</span>
              <!-- Overlay -->
              <div
                class="absolute inset-0 bg-gradient-to-t from-[#333333]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
              ></div>
            </div>
            <h3
              class="text-center text-[#333333] font-vazir-medium text-lg group-hover:text-[#DC3287] transition-colors"
            >
              لباس مجلسی
            </h3>
          </div>
        </div>
      </div>
    </section>

    <!-- ================= Featured Products ================= -->
    <section class="py-12 bg-[#FFFFFF]">
      <div class="container mx-auto px-4 md:px-8">
        <div class="flex justify-between items-center mb-10">
          <div class="flex items-center gap-4">
            <h2 class="text-[#333333] font-vazir-bold text-3xl">جدیدترین محصولات</h2>
            <span
              class="hidden md:inline-block px-3 py-1 bg-[#FC9FAF]/20 text-[#DC3287] font-vazir-medium text-sm rounded-full"
              >بروزرسانی امروز</span
            >
          </div>
          <a
            class="text-[#DC3287] font-vazir-medium hover:underline flex items-center gap-1"
            href="#"
          >
            مشاهده همه
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                d="M15 19l-7-7 7-7"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
              ></path>
            </svg>
          </a>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <!-- Product Card -->
          <div
            v-for="i in 4"
            :key="i"
            class="bg-[#FFFFFF] rounded-2xl border border-[#F3F5F8] p-4 transition-all duration-300 hover:shadow-xl hover:shadow-[#DFA9C7]/20 hover:-translate-y-1 group"
          >
            <!-- Image Container -->
            <div
              class="bg-[#F5F5F7] aspect-[4/5] rounded-xl mb-4 overflow-hidden relative flex items-center justify-center"
            >
              <span class="text-[#DFA9C7] font-vazir-thin text-2xl">عکس کالا</span>

              <!-- Badges -->
              <div
                v-if="i === 1"
                class="absolute top-4 right-4 bg-[#DC3287] text-[#FFFFFF] text-xs font-vazir-bold px-3 py-1 rounded-full z-10"
              >
                ویژه
              </div>

              <!-- Quick Actions on Hover -->
              <div
                class="absolute bottom-4 left-0 right-0 flex justify-center gap-2 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 z-10"
              >
                <button
                  class="bg-[#FFFFFF] text-[#333333] hover:text-[#DC3287] w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-colors"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="1.5"
                    ></path>
                  </svg>
                </button>
                <button
                  class="bg-[#DC3287] text-[#FFFFFF] px-6 py-2 rounded-full font-vazir-medium shadow-lg hover:bg-[#FC9FAF] transition-colors"
                >
                  افزودن به سبد
                </button>
              </div>
            </div>

            <!-- Product Info -->
            <div class="flex flex-col gap-1 px-1">
              <span class="text-[#777777] font-vazir-light text-xs">لباس زنانه</span>
              <h3
                class="text-[#333333] font-vazir-medium text-lg leading-tight truncate group-hover:text-[#DC3287] transition-colors"
              >
                پیراهن نخی طرح‌دار کژوال
              </h3>

              <div class="flex items-center justify-between mt-3">
                <div class="flex flex-col">
                  <span
                    v-if="i === 1"
                    class="text-[#777777] font-vazir-light text-sm line-through decoration-[#DC3287]"
                    >۱,۵۰۰,۰۰۰</span
                  >
                  <div class="flex items-center gap-1">
                    <span class="text-[#333333] font-vazir-bold text-xl">۱,۲۵۰,۰۰۰</span>
                    <span class="text-[#777777] font-vazir-light text-xs">تومان</span>
                  </div>
                </div>
                <!-- Color variants indicator -->
                <div class="flex gap-1">
                  <span class="w-3 h-3 rounded-full bg-[#DC3287]"></span>
                  <span class="w-3 h-3 rounded-full bg-[#333333]"></span>
                  <span class="w-3 h-3 rounded-full bg-[#EEDAC5]"></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ================= Full Width Banner ================= -->
    <section class="py-20">
      <div class="container mx-auto px-4 md:px-8">
        <div
          class="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#DFA9C7] to-[#FC9FAF] shadow-2xl flex items-center min-h-[300px]"
        >
          <!-- Deco Background Text -->
          <div
            class="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none overflow-hidden"
          >
            <span class="font-vazir-thin text-[15rem] text-[#FFFFFF] whitespace-nowrap"
              >SUMMER SALE</span
            >
          </div>

          <div class="relative z-10 p-8 md:p-16 text-right w-full md:w-1/2">
            <span
              class="bg-[#FFFFFF]/20 text-[#FFFFFF] font-vazir-medium px-4 py-1 rounded-full text-sm backdrop-blur-sm"
              >فرصت محدود</span
            >
            <h2 class="text-4xl md:text-5xl text-[#FFFFFF] font-vazir-bold mt-4 leading-tight">
              حراج بزرگ فصل<br />تا ۵۰٪ تخفیف
            </h2>
            <p class="text-[#FFFFFF]/90 font-vazir-light mt-4 mb-8 text-lg">
              کد تخفیف:
              <span class="font-vazir-bold bg-[#FFFFFF] text-[#DC3287] px-2 py-1 rounded"
                >OFF50</span
              >
            </p>
            <button
              class="bg-[#FFFFFF] text-[#DC3287] font-vazir-bold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all"
            >
              همین حالا خرید کنید
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- ================= Footer ================= -->
    <footer class="bg-[#333333] text-[#F5F5F7] pt-20 pb-6 border-t-[6px] border-[#DC3287]">
      <div class="container mx-auto px-4 md:px-8">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <!-- About -->
          <div>
            <div class="text-[#FFFFFF] text-3xl font-vazir-bold mb-6">شیک‌پوش</div>
            <p class="text-[#777777] font-vazir-light leading-loose text-sm">
              فروشگاه اینترنتی شیک‌پوش با بیش از یک دهه تجربه در ارائه برترین پوشاک و اکسسوری. هدف
              ما خلق تجربه‌ای لذت‌بخش و مطمئن از خرید آنلاین برای شماست.
            </p>
          </div>

          <!-- Links -->
          <div>
            <h4 class="text-[#FFFFFF] font-vazir-bold text-lg mb-6">لینک‌های مفید</h4>
            <ul class="flex flex-col gap-4 text-[#777777] font-vazir-light text-sm">
              <li><a class="hover:text-[#FC9FAF] transition-colors" href="#">پیگیری سفارشات</a></li>
              <li>
                <a class="hover:text-[#FC9FAF] transition-colors" href="#">شرایط بازگشت کالا</a>
              </li>
              <li>
                <a class="hover:text-[#FC9FAF] transition-colors" href="#">راهنمای سایزبندی</a>
              </li>
              <li><a class="hover:text-[#FC9FAF] transition-colors" href="#">سوالات متداول</a></li>
            </ul>
          </div>

          <!-- Contact -->
          <div>
            <h4 class="text-[#FFFFFF] font-vazir-bold text-lg mb-6">ارتباط با ما</h4>
            <ul class="flex flex-col gap-4 text-[#777777] font-vazir-light text-sm">
              <li class="flex items-center gap-2">
                <svg
                  class="w-5 h-5 text-[#DFA9C7]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1.5"
                  ></path>
                  <path
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1.5"
                  ></path>
                </svg>
                تهران، خیابان ولیعصر، پلاک ۱۰۰
              </li>
              <li class="flex items-center gap-2">
                <svg
                  class="w-5 h-5 text-[#DFA9C7]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1.5"
                  ></path>
                </svg>
                ۰۲۱-۸۸۸۸۸۸۸۸
              </li>
              <li class="flex items-center gap-2">
                <svg
                  class="w-5 h-5 text-[#DFA9C7]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1.5"
                  ></path>
                </svg>
                info@shikpoosh.com
              </li>
            </ul>
          </div>

          <!-- Newsletter -->
          <div>
            <h4 class="text-[#FFFFFF] font-vazir-bold text-lg mb-6">عضویت در خبرنامه</h4>
            <p class="text-[#777777] font-vazir-light text-sm mb-4">
              برای اطلاع از آخرین تخفیف‌ها ایمیل خود را وارد کنید.
            </p>
            <div class="relative">
              <input
                class="w-full bg-[#FFFFFF]/10 text-[#FFFFFF] placeholder-[#777777] font-vazir-light text-sm px-4 py-3 rounded-xl border border-[#FFFFFF]/10 focus:outline-none focus:border-[#DC3287] transition-colors"
                placeholder="ایمیل شما..."
                type="email"
              />
              <button
                class="absolute left-1 top-1 bottom-1 bg-[#DC3287] hover:bg-[#FC9FAF] text-[#FFFFFF] px-4 rounded-lg font-vazir-medium text-sm transition-colors"
              >
                عضویت
              </button>
            </div>
          </div>
        </div>

        <div
          class="border-t border-[#FFFFFF]/10 pt-6 flex flex-col md:flex-row items-center justify-between text-[#777777] font-vazir-thin text-sm"
        >
          <p>© ۱۴۰۵ تمامی حقوق برای فروشگاه شیک‌پوش محفوظ است.</p>
          <div class="flex gap-4 mt-4 md:mt-0">
            <!-- Social Icons (Placeholder) -->
            <a class="hover:text-[#FFFFFF] transition-colors" href="#"
              ><svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path
                  d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"
                /></svg
            ></a>
            <a class="hover:text-[#FFFFFF] transition-colors" href="#"
              ><svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path
                  d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"
                /></svg
            ></a>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
/* انیمیشن شناور شدن نرم برای آیکون تخفیف در هیرو */
@keyframes bounce-slow {
  0%,
  100% {
    transform: translateY(-5%);
    animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
  }
  50% {
    transform: translateY(0);
    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
  }
}
.animate-bounce-slow {
  animation: bounce-slow 3s infinite;
}
</style>
