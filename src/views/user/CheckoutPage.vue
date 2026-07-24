<template>
  <main
    class="min-h-screen bg-gradient-to-br from-[#FDFBF9] to-[#F5F5F7] dark:from-[#1a1a2e] dark:to-[#16213e] text-[#333333] dark:text-gray-100 pt-4 pb-10 lg:pt-6 lg:pb-16 font-vazir selection:bg-[#F57A9B] selection:text-white"
    dir="rtl"
  >
    <section class="container mx-auto px-4 sm:px-6 max-w-7xl">
      <!-- هدر صفحه -->
      <div
        class="flex items-end justify-between mb-10 border-b border-[#EEDAC5]/50 dark:border-gray-700/50 pb-6"
      >
        <div>
          <h1
            class="text-2xl md:text-xl font-bold text-[#333333] dark:text-white tracking-tight flex items-center gap-3"
          >
            <span
              class="w-10 h-10 rounded-full bg-[#F57A9B]/10 flex items-center justify-center text-[#F57A9B]"
            >
              <svg
                class="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                />
              </svg>
            </span>
            تکمیل اطلاعات ارسال و پرداخت
          </h1>
        </div>
      </div>

      <div class="grid grid-cols-1 xl:grid-cols-12 gap-8 lg:gap-10 items-start">
        <!-- ستون سمت راست: اطلاعات و اقلام -->
        <div class="xl:col-span-8 space-y-8">
          <!-- بخش ۱: انتخاب آدرس -->
          <div
            class="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white dark:border-gray-700 p-7 sm:p-8 relative overflow-hidden"
          >
            <h2
              class="text-xl font-black mb-6 text-[#333333] dark:text-white flex items-center gap-2"
            >
              <span class="text-[#F57A9B]">۱.</span> انتخاب آدرس تحویل
            </h2>

            <!-- لیست آدرس‌های کاربر -->
            <div v-if="userAddresses.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
              <div
                v-for="addr in userAddresses"
                :key="addr.id"
                :class="
                  selectedAddressId === addr.id
                    ? 'border-[#F57A9B] bg-[#FDFBF9] dark:bg-slate-700/50 ring-2 ring-[#F57A9B]/20 dark:ring-[#DFA9C7]/30'
                    : 'border-[#E9DDD2]/60 bg-white dark:bg-slate-800/50 hover:border-[#DFA9C7]/50 hover:shadow-md'
                "
                class="border rounded-[1.5rem] p-5 cursor-pointer transition-all duration-300 relative group"
                @click="selectAddress(addr)"
              >
                <div
                  v-if="selectedAddressId === addr.id"
                  class="absolute top-4 left-4 text-[#F57A9B] dark:text-[#DFA9C7]"
                >
                  <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      clip-rule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      fill-rule="evenodd"
                    ></path>
                  </svg>
                </div>
                <h3 class="font-black text-[#333333] dark:text-white text-base mb-2">
                  {{ addr.receiver_name || addr.name || 'آدرس ذخیره شده' }}
                </h3>
                <p
                  class="text-sm text-[#777777] dark:text-gray-400 mb-3 leading-relaxed line-clamp-2 font-medium"
                >
                  {{ addr.province }}، {{ addr.city }}، {{ addr.address }}
                </p>
                <span class="text-sm font-bold text-[#BC846C] dark:text-[#DFA9C7] block" dir="ltr">
                  {{ addr.receiver_phone || addr.phone }}
                </span>
              </div>
            </div>
            <div
              v-else
              class="text-sm font-bold text-[#BC846C] bg-[#EEDAC5]/20 dark:bg-slate-700/50 dark:text-[#DFA9C7] p-4 rounded-[1.5rem] border border-[#EEDAC5]/50 dark:border-slate-600 mb-6 flex items-center gap-3"
            >
              <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                ></path>
              </svg>
              شما آدرس ذخیره شده‌ای ندارید. لطفاً اطلاعات گیرنده را در فرم زیر وارد کنید.
            </div>

            <!-- فرم آدرس -->
            <form
              class="grid grid-cols-1 md:grid-cols-2 gap-5 bg-[#FDFBF9]/50 dark:bg-slate-900/30 p-6 rounded-[1.5rem] border border-[#EEDAC5]/30 dark:border-gray-700/50"
            >
              <div>
                <label class="block text-xs font-bold text-[#777777] dark:text-gray-400 mb-2 pl-1"
                  >نام گیرنده</label
                >
                <input
                  v-model="form.receiver_name"
                  class="w-full px-4 py-3 text-sm rounded-xl bg-white dark:bg-slate-800 border border-[#E9DDD2]/60 dark:border-gray-600 focus:ring-2 focus:ring-[#F57A9B]/30 focus:border-[#F57A9B] outline-none text-[#333333] dark:text-white transition-all shadow-sm"
                  type="text"
                />
              </div>
              <div>
                <label class="block text-xs font-bold text-[#777777] dark:text-gray-400 mb-2 pl-1"
                  >موبایل</label
                >
                <input
                  v-model="form.receiver_phone"
                  class="w-full px-4 py-3 text-sm rounded-xl bg-white dark:bg-slate-800 border border-[#E9DDD2]/60 dark:border-gray-600 focus:ring-2 focus:ring-[#F57A9B]/30 focus:border-[#F57A9B] outline-none text-[#333333] dark:text-white transition-all shadow-sm"
                  dir="ltr"
                  type="tel"
                />
              </div>
              <div>
                <label class="block text-xs font-bold text-[#777777] dark:text-gray-400 mb-2 pl-1"
                  >استان</label
                >
                <input
                  v-model="form.province"
                  class="w-full px-4 py-3 text-sm rounded-xl bg-white dark:bg-slate-800 border border-[#E9DDD2]/60 dark:border-gray-600 focus:ring-2 focus:ring-[#F57A9B]/30 focus:border-[#F57A9B] outline-none text-[#333333] dark:text-white transition-all shadow-sm"
                  type="text"
                />
              </div>
              <div>
                <label class="block text-xs font-bold text-[#777777] dark:text-gray-400 mb-2 pl-1"
                  >شهر</label
                >
                <input
                  v-model="form.city"
                  class="w-full px-4 py-3 text-sm rounded-xl bg-white dark:bg-slate-800 border border-[#E9DDD2]/60 dark:border-gray-600 focus:ring-2 focus:ring-[#F57A9B]/30 focus:border-[#F57A9B] outline-none text-[#333333] dark:text-white transition-all shadow-sm"
                  type="text"
                />
              </div>
              <div class="md:col-span-2">
                <label class="block text-xs font-bold text-[#777777] dark:text-gray-400 mb-2 pl-1"
                  >آدرس دقیق</label
                >
                <textarea
                  v-model="form.address"
                  class="w-full px-4 py-3 text-sm rounded-xl bg-white dark:bg-slate-800 border border-[#E9DDD2]/60 dark:border-gray-600 focus:ring-2 focus:ring-[#F57A9B]/30 focus:border-[#F57A9B] outline-none resize-none text-[#333333] dark:text-white transition-all shadow-sm"
                  rows="2"
                ></textarea>
              </div>
              <div>
                <label class="block text-xs font-bold text-[#777777] dark:text-gray-400 mb-2 pl-1"
                  >کد پستی</label
                >
                <input
                  v-model="form.postal_code"
                  class="w-full px-4 py-3 text-sm rounded-xl bg-white dark:bg-slate-800 border border-[#E9DDD2]/60 dark:border-gray-600 focus:ring-2 focus:ring-[#F57A9B]/30 focus:border-[#F57A9B] outline-none text-[#333333] dark:text-white transition-all shadow-sm"
                  type="text"
                />
              </div>
            </form>
          </div>

          <!-- بخش ۲: اقلام سفارش -->
          <div
            class="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white dark:border-gray-700 p-7 sm:p-8 relative overflow-hidden"
          >
            <h2
              class="text-xl font-black mb-6 text-[#333333] dark:text-white flex items-center gap-2"
            >
              <span class="text-[#F57A9B]">۲.</span> اقلام سفارش شما
            </h2>
            <div class="space-y-4">
              <div
                v-for="item in cartStore.items"
                :key="item.id"
                class="flex gap-5 bg-[#FDFBF9]/50 dark:bg-slate-900/30 border border-[#E9DDD2]/40 dark:border-gray-700 p-4 rounded-[1.5rem] hover:shadow-[0_4px_20px_rgb(0,0,0,0.03)] transition-all duration-300"
              >
                <div
                  class="w-24 h-24 bg-white dark:bg-slate-800 border border-[#EEDAC5]/30 dark:border-gray-600 rounded-2xl overflow-hidden flex-shrink-0"
                >
                  <img
                    v-if="item.image"
                    :alt="item.product_name"
                    :src="item.image"
                    class="w-full h-full object-cover"
                  />
                  <div
                    v-else
                    class="w-full h-full flex items-center justify-center text-[#777777] dark:text-gray-500 text-xs font-medium"
                  >
                    بدون عکس
                  </div>
                </div>
                <div class="flex flex-col justify-between flex-grow py-1">
                  <div>
                    <div class="text-base font-black text-[#333333] dark:text-white mb-1">
                      {{ item.product_name || 'محصول نامشخص' }}
                    </div>
                    <div
                      v-if="item.variant_name"
                      class="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold bg-[#EEDAC5]/30 text-[#BC846C] dark:bg-[#BC846C]/20 dark:text-[#EEDAC5]"
                    >
                      {{ item.variant_name }}
                    </div>
                  </div>
                  <div class="flex justify-between items-end mt-2">
                    <span
                      class="text-sm font-bold text-[#777777] dark:text-gray-400 bg-white dark:bg-slate-800 px-3 py-1 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700"
                    >
                      تعداد: {{ item.quantity }}
                    </span>
                    <span
                      class="text-base font-black text-[#333333] dark:text-white flex items-center gap-1"
                    >
                      {{ formatPrice(item.total_price || item.unit_price * item.quantity) }}
                      <span class="text-xs text-[#BC846C] dark:text-[#DFA9C7]">تومان</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- خلاصه سفارش (ستون سمت چپ) -->
        <div class="xl:col-span-4 xl:sticky xl:top-28">
          <div
            class="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-white dark:border-gray-700 p-7 sm:p-8 relative overflow-hidden"
          >
            <!-- افکت تزئینی -->
            <div
              class="absolute -top-20 -right-20 w-48 h-48 bg-gradient-to-br from-[#F57A9B]/10 to-[#DFA9C7]/10 rounded-full blur-3xl pointer-events-none"
            ></div>

            <h2
              class="text-xl font-black text-[#333333] dark:text-white mb-8 flex items-center gap-3"
            >
              <span
                class="w-10 h-10 rounded-full bg-[#F57A9B]/10 flex items-center justify-center text-[#F57A9B]"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                  ></path>
                </svg>
              </span>
              پیش‌فاکتور نهایی
            </h2>

            <div class="space-y-5 text-sm font-medium mb-8">
              <div class="flex justify-between items-center text-[#777777] dark:text-gray-300">
                <span>مبلغ کالاها</span>
                <span class="font-extrabold text-[#333333] dark:text-white"
                  >{{ formatPrice(cartStore.summary?.subtotal) }} تومان</span
                >
              </div>
              <div
                v-if="cartStore.summary?.tax_amount > 0"
                class="flex justify-between items-center text-[#777777] dark:text-gray-300"
              >
                <span>مالیات</span>
                <span class="font-extrabold text-[#333333] dark:text-white"
                  >{{ formatPrice(cartStore.summary?.tax_amount) }} تومان</span
                >
              </div>
              <div class="flex justify-between items-center text-[#777777] dark:text-gray-300">
                <span>هزینه ارسال</span>
                <span
                  v-if="cartStore.summary?.shipping_cost === 0"
                  class="font-black text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-100 dark:border-emerald-900/50"
                >
                  رایگان
                </span>
                <span v-else class="font-extrabold text-[#333333] dark:text-white">
                  {{ formatPrice(cartStore.summary?.shipping_cost) }} تومان
                </span>
              </div>
            </div>

            <!-- خط جداکننده -->
            <div class="relative py-2 mb-6">
              <div aria-hidden="true" class="absolute inset-0 flex items-center">
                <div
                  class="w-full border-t border-dashed border-[#EEDAC5] dark:border-gray-600"
                ></div>
              </div>
            </div>

            <!-- روش پرداخت -->
            <div class="mb-8 relative z-10">
              <h3 class="text-base font-black text-[#333333] dark:text-white mb-4">
                انتخاب روش پرداخت:
              </h3>
              <div
                v-if="shopSettings.is_online_payment_active || shopSettings.is_card_payment_active"
                class="space-y-3"
              >
                <label
                  v-if="shopSettings.is_online_payment_active"
                  :class="
                    paymentMethod === 'zarinpal'
                      ? 'border-[#F57A9B] bg-[#F57A9B]/5 dark:bg-slate-700/80 ring-1 ring-[#F57A9B]/30'
                      : 'border-[#E9DDD2]/60 dark:border-gray-700 bg-white dark:bg-slate-800 hover:border-[#DFA9C7]/60'
                  "
                  class="flex items-center p-4 rounded-2xl cursor-pointer transition-all duration-300"
                >
                  <input
                    v-model="paymentMethod"
                    class="peer sr-only"
                    type="radio"
                    value="zarinpal"
                  />
                  <div
                    :class="paymentMethod === 'zarinpal' ? 'text-[#F57A9B]' : 'text-gray-400'"
                    class="ml-3"
                  >
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                      />
                    </svg>
                  </div>
                  <span
                    :class="
                      paymentMethod === 'zarinpal'
                        ? 'text-[#333333] dark:text-white'
                        : 'text-[#777777] dark:text-gray-300'
                    "
                    class="text-sm font-bold"
                  >
                    درگاه پرداخت اینترنتی امن
                  </span>
                  <span
                    v-if="paymentMethod === 'zarinpal'"
                    class="mr-auto w-4 h-4 rounded-full border-[4px] border-[#F57A9B] bg-white dark:border-[#DFA9C7]"
                  ></span>
                </label>

                <label
                  v-if="shopSettings.is_card_payment_active"
                  :class="
                    paymentMethod === 'transfer'
                      ? 'border-[#F57A9B] bg-[#F57A9B]/5 dark:bg-slate-700/80 ring-1 ring-[#F57A9B]/30'
                      : 'border-[#E9DDD2]/60 dark:border-gray-700 bg-white dark:bg-slate-800 hover:border-[#DFA9C7]/60'
                  "
                  class="flex items-center p-4 rounded-2xl cursor-pointer transition-all duration-300"
                >
                  <input
                    v-model="paymentMethod"
                    class="peer sr-only"
                    type="radio"
                    value="transfer"
                  />
                  <div
                    :class="paymentMethod === 'transfer' ? 'text-[#F57A9B]' : 'text-gray-400'"
                    class="ml-3"
                  >
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                      />
                    </svg>
                  </div>
                  <span
                    :class="
                      paymentMethod === 'transfer'
                        ? 'text-[#333333] dark:text-white'
                        : 'text-[#777777] dark:text-gray-300'
                    "
                    class="text-sm font-bold"
                  >
                    کارت به کارت (آفلاین)
                  </span>
                  <span
                    v-if="paymentMethod === 'transfer'"
                    class="mr-auto w-4 h-4 rounded-full border-[4px] border-[#F57A9B] bg-white dark:border-[#DFA9C7]"
                  ></span>
                </label>
              </div>
              <div
                v-else
                class="text-xs font-bold bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-xl text-center border border-red-100 dark:border-red-900/30"
              >
                در حال حاضر هیچ روش پرداختی فعال نیست.
              </div>
            </div>

            <!-- مبلغ نهایی -->
            <div
              class="flex justify-between items-end bg-[#FDFBF9] dark:bg-slate-900/50 p-4 rounded-2xl border border-[#EEDAC5]/50 dark:border-gray-700 mb-6 relative z-10"
            >
              <span class="text-[#333333] dark:text-white font-black text-base pb-1"
                >مبلغ قابل پرداخت:</span
              >
              <div class="text-left">
                <div class="text-2xl sm:text-3xl font-black text-[#F57A9B] tracking-tight">
                  {{ formatPrice(cartStore.summary?.total_payable) }}
                </div>
                <div class="text-xs font-extrabold text-[#BC846C] mt-1">تومان</div>
              </div>
            </div>

            <!-- پیام خطا -->
            <div
              v-if="errorMessage"
              class="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-2xl text-sm font-bold mb-6 border border-red-100 dark:border-red-900/50 flex items-center gap-2"
            >
              <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                ></path>
              </svg>
              {{ errorMessage }}
            </div>

            <!-- دکمه پرداخت -->
            <button
              :class="
                isLoading || cartStore.items.length === 0 || !paymentMethod
                  ? 'opacity-70 cursor-not-allowed bg-gray-400 dark:bg-slate-700'
                  : 'bg-gradient-to-r from-[#F57A9B] to-[#DFA9C7] hover:from-[#e86b8c] hover:to-[#d09ab8] shadow-[0_8px_25px_rgba(245,122,155,0.3)] hover:shadow-[0_12px_30px_rgba(245,122,155,0.4)] hover:-translate-y-1'
              "
              :disabled="isLoading || cartStore.items.length === 0 || !paymentMethod"
              class="w-full py-4 sm:py-5 px-6 text-white rounded-[1.25rem] transition-all duration-300 font-black text-lg flex justify-center items-center gap-3 relative z-10 group"
              @click="submitCheckout"
            >
              <span v-if="isLoading" class="flex items-center gap-2">
                <svg class="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
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
                در حال پردازش امن...
              </span>
              <template v-else>
                پرداخت و ثبت نهایی سفارش
                <svg
                  class="w-6 h-6 rtl:rotate-180 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                  />
                </svg>
              </template>
            </button>

            <div
              class="mt-5 flex items-center justify-center gap-2 text-xs font-bold text-[#777777] dark:text-gray-400"
            >
              <svg
                class="w-4 h-4 text-[#BC846C]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                />
              </svg>
              تراکنش‌ها به صورت رمزنگاری شده و امن انجام می‌شوند
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script lang="ts" setup>
// کد اسکریپت بدون تغییر
import { onMounted, reactive, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { useAuthStore } from '@/stores/auth'
import { useNotificationStore } from '@/stores/notification'
import axiosInstance from '@/lib/axios'
import addressApi from '@/api/addressApi'

const router = useRouter()
const cartStore = useCartStore()
const authStore = useAuthStore()
const notificationStore = useNotificationStore()

const isLoading = ref(false)
const errorMessage = ref('')
const userAddresses = ref<any[]>([])
const selectedAddressId = ref<number | null>(null)

const shopSettings = ref({
  is_online_payment_active: false,
  is_card_payment_active: false,
})

const paymentMethod = ref('')

const form = reactive({
  receiver_name: '',
  receiver_phone: '',
  province: '',
  city: '',
  address: '',
  postal_code: '',
  payment_method: '',
})

const formatPrice = (price: number | string | undefined) => {
  if (price === undefined || price === null) return '۰'
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

watch(
  () => authStore.user,
  (user) => {
    if (!user) return
    if (!user.national_code || user.national_code === 'null') {
      notificationStore.warning('برای ثبت سفارش، ابتدا باید کد ملی خود را در پروفایل تکمیل کنید.')
      router.push('/user/profile')
      return
    }
    if (!user.mobile || user.mobile === 'null') {
      notificationStore.warning('برای ثبت سفارش، ابتدا باید شماره موبایل خود را ثبت کنید.')
      router.push('/user/profile')
      return
    }
    if (!user.mobile_verified_at || user.mobile_verified_at === 'null') {
      notificationStore.warning('برای ثبت سفارش، شماره موبایل شما باید تایید شده باشد.')
      router.push('/user/profile')
      return
    }
  },
  { immediate: true },
)

onMounted(async () => {
  try {
    const response = await addressApi.getAddresses()
    userAddresses.value = response.data.data || response.data || []
    if (userAddresses.value.length > 0) selectAddress(userAddresses.value[0])
  } catch (error) {
    console.error('خطا در دریافت آدرس‌ها', error)
  }
  try {
    const settingsRes = await axiosInstance.get('/shop-settings')
    const settings = settingsRes.data?.data || settingsRes.data
    if (settings) {
      shopSettings.value.is_online_payment_active =
        String(settings.is_online_payment_active) === '1' ||
        String(settings.is_online_payment_active).toLowerCase() === 'true'
      shopSettings.value.is_card_payment_active =
        String(settings.is_card_payment_active) === '1' ||
        String(settings.is_card_payment_active).toLowerCase() === 'true'
      if (shopSettings.value.is_online_payment_active) paymentMethod.value = 'zarinpal'
      else if (shopSettings.value.is_card_payment_active) paymentMethod.value = 'transfer'
    }
  } catch (error) {
    console.error('خطا در دریافت تنظیمات فروشگاه', error)
    shopSettings.value.is_online_payment_active = true
    shopSettings.value.is_card_payment_active = true
    paymentMethod.value = 'zarinpal'
  }
})

const selectAddress = (addr: any) => {
  selectedAddressId.value = addr.id
  form.receiver_name = addr.receiver_name || addr.name || ''
  form.receiver_phone = addr.receiver_phone || addr.phone || ''
  form.province = addr.province || ''
  form.city = addr.city || ''
  form.address = addr.full_address || addr.address || ''
  form.postal_code = addr.postal_code || ''
}

const submitCheckout = async () => {
  if (!form.province || !form.city || !form.address) {
    errorMessage.value = 'لطفاً آدرس تحویل را به صورت کامل مشخص کنید.'
    return
  }
  if (!paymentMethod.value) {
    errorMessage.value = 'لطفاً یک روش پرداخت انتخاب کنید.'
    return
  }
  isLoading.value = true
  errorMessage.value = ''
  form.payment_method = paymentMethod.value
  try {
    const response = await axiosInstance.post('/checkout/process', form)
    cartStore.items = []
    cartStore.summary = {
      subtotal: 0,
      tax_amount: 0,
      packaging_cost: 0,
      shipping_cost: 0,
      total_payable: 0,
    }
    if (response.data.payment_url) window.location.href = response.data.payment_url
    else {
      notificationStore.success('سفارش شما با موفقیت ثبت شد!')
      router.push('/user/orders')
    }
  } catch (error: any) {
    errorMessage.value = error.response?.data?.message || 'خطایی در ثبت سفارش رخ داد.'
  } finally {
    isLoading.value = false
  }
}
</script>
