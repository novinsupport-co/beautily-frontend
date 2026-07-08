<template>
  <div class="p-4 md:p-6 lg:p-8 max-w-[1400px] font-vazir mx-auto min-h-screen">
    <!-- هدر و فیلترها -->
    <div
      class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-5 bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200/60 dark:border-slate-700"
    >
      <div>
        <h1 class="text-2xl font-black text-slate-800 dark:text-white flex items-center gap-3">
          مدیریت نظرات کاربران
          <span
            v-if="!isLoading && totalReviews"
            class="bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400 text-xs px-3 py-1.5 rounded-lg font-bold border border-indigo-100 dark:border-indigo-800/50"
          >
            {{ totalReviews }} نظر ثبت شده
          </span>
        </h1>
        <p class="text-sm text-slate-500 dark:text-slate-400 mt-2 font-medium">
          در این بخش می‌توانید نظرات، نقاط قوت/ضعف، پاسخ مستقیم سایت و پاسخ‌های کاربران را مدیریت
          کنید.
        </p>
      </div>

      <!-- فیلتر وضعیت -->
      <div class="w-full sm:w-auto relative group">
        <select
          v-model="filterStatus"
          class="w-full sm:w-64 appearance-none border-2 border-slate-100 dark:border-slate-700 rounded-xl px-5 py-3 text-sm font-medium bg-slate-50 dark:bg-slate-900/50 text-slate-700 dark:text-slate-200 hover:border-indigo-300 dark:hover:border-indigo-500/50 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all cursor-pointer"
          @change="fetchReviews(1)"
        >
          <option value="">همه نظرات</option>
          <option value="pending">در انتظار تایید</option>
          <option value="approved">تایید شده</option>
          <option value="rejected">رد شده</option>
        </select>
        <div
          class="pointer-events-none absolute inset-y-0 left-0 flex items-center px-4 text-slate-400 group-hover:text-indigo-500 transition-colors"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              d="M19 9l-7 7-7-7"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
            ></path>
          </svg>
        </div>
      </div>
    </div>

    <!-- کانتینر اصلی جدول -->
    <div
      class="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200/60 dark:border-slate-700 flex flex-col overflow-hidden"
    >
      <!-- وضعیت لودینگ -->
      <div v-if="isLoading" class="flex flex-col items-center justify-center py-20">
        <div class="relative w-12 h-12">
          <div
            class="absolute inset-0 border-4 border-slate-100 dark:border-slate-700 rounded-full"
          ></div>
          <div
            class="absolute inset-0 border-4 border-indigo-500 rounded-full border-t-transparent animate-spin"
          ></div>
        </div>
        <span class="mt-4 text-slate-500 dark:text-slate-400 font-medium text-sm"
          >در حال دریافت اطلاعات...</span
        >
      </div>

      <!-- وضعیت خالی -->
      <div
        v-else-if="reviews.length === 0"
        class="flex flex-col items-center justify-center py-24 text-center px-4"
      >
        <div
          class="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-full mb-5 border-2 border-dashed border-slate-200 dark:border-slate-700"
        >
          <svg
            class="w-12 h-12 text-slate-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
            ></path>
          </svg>
        </div>
        <h3 class="text-xl font-bold text-slate-800 dark:text-white mb-2">هیچ نظری یافت نشد</h3>
        <p class="text-slate-500 dark:text-slate-400 max-w-sm">
          با توجه به فیلترهای اعمال شده، در حال حاضر هیچ نظری برای نمایش وجود ندارد.
        </p>
      </div>

      <!-- جدول -->
      <div v-else class="overflow-x-auto">
        <table class="w-full text-sm text-right">
          <thead
            class="bg-slate-50 dark:bg-slate-900/40 text-slate-600 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700"
          >
            <tr>
              <th class="px-6 py-5 whitespace-nowrap">مشخصات کاربر و محصول</th>
              <th class="px-6 py-5 w-5/12 min-w-[300px]">متن و جزئیات نظر</th>
              <th class="px-6 py-5 text-center whitespace-nowrap">امتیاز</th>
              <th class="px-6 py-5 text-center whitespace-nowrap">وضعیت</th>
              <th class="px-6 py-5 text-center whitespace-nowrap">عملیات</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 dark:divide-slate-700/50">
            <template v-for="review in reviews" :key="review.id">
              <!-- سطر اصلی نظر -->
              <tr
                :class="[
                  'hover:bg-slate-50/80 dark:hover:bg-slate-700/20 transition-all group',
                  expandedRows.includes(review.id) ? 'bg-slate-50/50 dark:bg-slate-800/80' : '',
                ]"
              >
                <!-- کاربر و محصول -->
                <td class="px-6 py-5 align-top">
                  <div class="flex flex-col gap-2">
                    <div class="flex items-center gap-2">
                      <div
                        class="w-9 h-9 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-sm"
                      >
                        {{ (review.user?.name || 'ک').charAt(0) }}
                      </div>
                      <div class="flex flex-col">
                        <span class="font-bold text-slate-800 dark:text-slate-200 text-sm">
                          {{ review.user?.name || 'کاربر ناشناس' }}
                        </span>
                        <!-- نمایش نشان خریدار بودن -->
                        <span
                          v-if="review.is_buyer"
                          class="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mt-0.5"
                        >
                          <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              clip-rule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              fill-rule="evenodd"
                            ></path>
                          </svg>
                          خریدار محصول
                        </span>
                      </div>
                    </div>
                    <span
                      class="text-xs font-medium text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-700/50 px-2.5 py-1.5 rounded-lg inline-block w-max max-w-[200px] truncate border border-slate-200 dark:border-slate-600"
                    >
                      محصول: {{ review.product?.name || 'نامشخص' }}
                    </span>
                  </div>
                </td>

                <!-- متن و جزئیات نظر -->
                <td class="px-6 py-5 align-top">
                  <div class="mb-2 font-black text-slate-800 dark:text-slate-100 text-base">
                    {{ review.title || 'بدون عنوان' }}
                  </div>
                  <p
                    class="text-slate-600 dark:text-slate-300 leading-relaxed text-sm font-medium mb-3"
                  >
                    {{ review.body }}
                  </p>

                  <!-- نقاط قوت و ضعف -->
                  <div
                    v-if="
                      (review.advantages && review.advantages.length) ||
                      (review.disadvantages && review.disadvantages.length)
                    "
                    class="flex flex-col gap-2 mt-3"
                  >
                    <!-- نقاط قوت -->
                    <div
                      v-if="review.advantages && review.advantages.length"
                      class="flex items-start gap-2"
                    >
                      <svg
                        class="w-4 h-4 text-emerald-500 shrink-0 mt-0.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          d="M12 4v16m8-8H4"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                        ></path>
                      </svg>
                      <div class="flex flex-wrap gap-1">
                        <span
                          v-for="(adv, index) in review.advantages"
                          :key="index"
                          class="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 rounded-md border border-emerald-100 dark:border-emerald-800/30"
                        >
                          {{ adv }}
                        </span>
                      </div>
                    </div>
                    <!-- نقاط ضعف -->
                    <div
                      v-if="review.disadvantages && review.disadvantages.length"
                      class="flex items-start gap-2"
                    >
                      <svg
                        class="w-4 h-4 text-rose-500 shrink-0 mt-0.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          d="M20 12H4"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                        ></path>
                      </svg>
                      <div class="flex flex-wrap gap-1">
                        <span
                          v-for="(dis, index) in review.disadvantages"
                          :key="index"
                          class="text-[11px] font-bold text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/20 px-2 py-0.5 rounded-md border border-rose-100 dark:border-rose-800/30"
                        >
                          {{ dis }}
                        </span>
                      </div>
                    </div>
                  </div>
                </td>

                <!-- امتیاز -->
                <td class="px-6 py-5 text-center align-top">
                  <div
                    class="flex items-center justify-center gap-1.5 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 px-3 py-1.5 rounded-xl w-max mx-auto font-black text-sm border border-amber-100 dark:border-amber-800/30"
                  >
                    {{ review.rating }}
                    <svg
                      class="w-4 h-4 text-amber-500 pb-[1px]"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                      ></path>
                    </svg>
                  </div>
                </td>

                <!-- وضعیت -->
                <td class="px-6 py-5 text-center align-top">
                  <span
                    v-if="review.status === 'pending'"
                    class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800/50"
                  >
                    <span class="relative flex h-2 w-2">
                      <span
                        class="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"
                      ></span>
                      <span class="relative inline-flex rounded-full h-2 w-2 bg-yellow-500"></span>
                    </span>
                    در انتظار بررسی
                  </span>
                  <span
                    v-else-if="review.status === 'approved'"
                    class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50"
                  >
                    <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
                    تایید شده
                  </span>
                  <span
                    v-else-if="review.status === 'rejected'"
                    class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold bg-rose-50 text-rose-700 dark:bg-rose-900/20 dark:text-rose-400 border border-rose-200 dark:border-rose-800/50"
                  >
                    <span class="w-2 h-2 rounded-full bg-rose-500"></span>
                    رد شده
                  </span>
                </td>

                <!-- دکمه‌های عملیات -->
                <td class="px-6 py-5 align-top">
                  <div class="flex items-center justify-center gap-2">
                    <button
                      v-if="review.status !== 'approved'"
                      class="p-2 text-emerald-600 bg-emerald-50 hover:bg-emerald-500 hover:text-white dark:text-emerald-400 dark:bg-emerald-900/30 dark:hover:bg-emerald-600 dark:hover:text-white rounded-xl transition-all shadow-sm"
                      title="تایید نظر"
                      @click="changeStatus(review.id, 'approved')"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          d="M5 13l4 4L19 7"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                        ></path>
                      </svg>
                    </button>
                    <button
                      v-if="review.status !== 'rejected'"
                      class="p-2 text-orange-600 bg-orange-50 hover:bg-orange-500 hover:text-white dark:text-orange-400 dark:bg-orange-900/30 dark:hover:bg-orange-600 dark:hover:text-white rounded-xl transition-all shadow-sm"
                      title="رد نظر"
                      @click="changeStatus(review.id, 'rejected')"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          d="M6 18L18 6M6 6l12 12"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                        ></path>
                      </svg>
                    </button>
                    <button
                      class="p-2 text-rose-600 bg-rose-50 hover:bg-rose-500 hover:text-white dark:text-rose-400 dark:bg-rose-900/30 dark:hover:bg-rose-600 dark:hover:text-white rounded-xl transition-all shadow-sm"
                      title="حذف دائم نظر"
                      @click="removeReview(review.id)"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                        ></path>
                      </svg>
                    </button>

                    <div class="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-1"></div>

                    <!-- دکمه مدیریت پاسخ و ریپلای‌ها -->
                    <button
                      :class="
                        expandedRows.includes(review.id)
                          ? 'bg-indigo-500 text-white dark:bg-indigo-600'
                          : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-500 hover:text-white dark:text-indigo-400 dark:bg-indigo-900/30 dark:hover:bg-indigo-600 dark:hover:text-white'
                      "
                      class="relative flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all font-medium text-xs shadow-sm"
                      title="ثبت پاسخ مدیر و مدیریت ریپلای‌ها"
                      @click="toggleRow(review)"
                    >
                      <span>مدیریت پاسخ</span>
                      <span
                        v-if="review.replies_count"
                        :class="
                          expandedRows.includes(review.id)
                            ? 'bg-white text-indigo-600 dark:bg-slate-800 dark:text-indigo-400'
                            : 'bg-indigo-100 text-indigo-700 dark:bg-indigo-800/50 dark:text-indigo-300'
                        "
                        class="flex items-center justify-center min-w-[1.25rem] h-5 px-1 rounded-md text-[10px] font-black ml-1"
                      >
                        {{ review.replies_count }}
                      </span>
                      <svg
                        :class="expandedRows.includes(review.id) ? 'rotate-180' : ''"
                        class="w-4 h-4 transition-transform duration-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          d="M19 9l-7 7-7-7"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                        ></path>
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>

              <!-- سطر بازشونده (پاسخ مدیر + لیست ریپلای‌ها) -->
              <tr v-if="expandedRows.includes(review.id)">
                <td
                  class="p-0 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30 relative"
                  colspan="5"
                >
                  <div
                    class="absolute right-0 top-0 bottom-0 w-1 bg-indigo-500/50 dark:bg-indigo-500/30"
                  ></div>

                  <div class="p-4 sm:p-6 lg:p-8">
                    <div class="flex flex-col gap-6">
                      <!-- بخش ثبت پاسخ مستقیم مدیر -->
                      <div
                        class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm p-5"
                      >
                        <div class="flex items-center gap-2 mb-3">
                          <svg
                            class="w-5 h-5 text-indigo-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                            ></path>
                          </svg>
                          <h4 class="text-sm font-black text-slate-800 dark:text-slate-100">
                            پاسخ رسمی فروشگاه (ادمین)
                          </h4>
                        </div>
                        <textarea
                          v-model="adminReplyDrafts[review.id]"
                          class="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all resize-none"
                          placeholder="پاسخ مستقیم خود به این نظر را اینجا بنویسید... (کاربران این پاسخ را به عنوان پاسخ رسمی سایت می‌بینند)"
                          rows="3"
                        ></textarea>
                        <div class="flex justify-end mt-3">
                          <button
                            :disabled="savingAdminReply[review.id]"
                            class="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm disabled:opacity-50"
                            @click="submitAdminReply(review.id)"
                          >
                            <svg
                              v-if="savingAdminReply[review.id]"
                              class="w-4 h-4 animate-spin"
                              fill="none"
                              viewBox="0 0 24 24"
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
                              class="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                d="M5 13l4 4L19 7"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                              ></path>
                            </svg>
                            {{
                              savingAdminReply[review.id] ? 'در حال ثبت...' : 'ثبت / ویرایش پاسخ'
                            }}
                          </button>
                        </div>
                      </div>

                      <!-- بخش پاسخ‌های کاربران (ریپلای‌ها) -->
                      <div
                        v-if="(review.replies_count || 0) > 0"
                        class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm overflow-hidden"
                      >
                        <div
                          class="bg-slate-50 dark:bg-slate-900/50 px-5 py-3 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between"
                        >
                          <h4
                            class="text-sm font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2"
                          >
                            <svg
                              class="w-4 h-4 text-indigo-500"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                              ></path>
                            </svg>
                            پاسخ‌های کاربران به این نظر ({{ review.replies_count }})
                          </h4>
                        </div>

                        <div class="p-5">
                          <div
                            v-if="loadingReplies[review.id]"
                            class="flex items-center justify-center py-8"
                          >
                            <div
                              class="w-6 h-6 border-2 border-slate-200 border-t-indigo-500 rounded-full animate-spin ml-3"
                            ></div>
                            <span class="text-sm text-slate-500 font-medium">در حال دریافت...</span>
                          </div>

                          <div v-else-if="reviewReplies[review.id]?.length" class="space-y-4">
                            <div
                              v-for="reply in reviewReplies[review.id]"
                              :key="reply.id"
                              class="bg-slate-50 dark:bg-slate-700/30 p-4 rounded-xl border border-slate-100 dark:border-slate-600 flex flex-col sm:flex-row gap-4"
                            >
                              <div class="flex items-start gap-3 sm:w-1/4 shrink-0">
                                <div
                                  class="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center font-bold text-sm shrink-0"
                                >
                                  {{ (reply.user?.name || 'ک').charAt(0) }}
                                </div>
                                <div class="flex flex-col gap-1">
                                  <span class="font-bold text-slate-800 dark:text-white text-sm">{{
                                    reply.user?.name || 'کاربر'
                                  }}</span>
                                  <span
                                    class="text-[11px] font-medium text-slate-400 dark:text-slate-500"
                                    >{{
                                      new Date(reply.created_at).toLocaleDateString('fa-IR')
                                    }}</span
                                  >
                                  <span
                                    :class="{
                                      'text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800/50':
                                        reply.status === 'pending',
                                      'text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800/50':
                                        reply.status === 'approved',
                                      'text-rose-600 bg-rose-50 dark:text-rose-400 dark:bg-rose-900/20 border-rose-200 dark:border-rose-800/50':
                                        reply.status === 'rejected',
                                    }"
                                    class="px-2 py-0.5 rounded flex w-max text-[10px] font-bold border mt-0.5"
                                  >
                                    {{
                                      reply.status === 'pending'
                                        ? 'در انتظار بررسی'
                                        : reply.status === 'approved'
                                          ? 'تایید شده'
                                          : 'رد شده'
                                    }}
                                  </span>
                                </div>
                              </div>
                              <div
                                class="flex-1 flex flex-col justify-between gap-3 bg-white dark:bg-slate-800 p-3 rounded-lg border border-slate-100 dark:border-slate-700/50"
                              >
                                <p
                                  class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed"
                                >
                                  {{ reply.body }}
                                </p>
                                <div
                                  class="flex flex-wrap gap-2 justify-end border-t border-slate-50 dark:border-slate-700 pt-2 mt-2"
                                >
                                  <button
                                    v-if="reply.status !== 'approved'"
                                    class="px-3 py-1.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:text-white dark:bg-emerald-900/20 dark:text-emerald-400 dark:hover:bg-emerald-600 dark:hover:text-white rounded-lg text-[11px] font-bold transition-all"
                                    @click="updateReplyStatus(review.id, reply.id, 'approved')"
                                  >
                                    تایید پاسخ
                                  </button>
                                  <button
                                    v-if="reply.status !== 'rejected'"
                                    class="px-3 py-1.5 bg-orange-50 text-orange-600 hover:bg-orange-500 hover:text-white dark:bg-orange-900/20 dark:text-orange-400 dark:hover:bg-orange-600 dark:hover:text-white rounded-lg text-[11px] font-bold transition-all"
                                    @click="updateReplyStatus(review.id, reply.id, 'rejected')"
                                  >
                                    رد کردن
                                  </button>
                                  <button
                                    class="px-3 py-1.5 bg-rose-50 text-rose-600 hover:bg-rose-500 hover:text-white dark:bg-rose-900/20 dark:text-rose-400 dark:hover:bg-rose-600 dark:hover:text-white rounded-lg text-[11px] font-bold transition-all sm:mr-auto"
                                    @click="deleteReply(review.id, reply.id)"
                                  >
                                    حذف دائم
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div
        v-if="totalPages > 1 && !isLoading"
        class="px-6 py-5 border-t border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/30 flex flex-col sm:flex-row items-center justify-between gap-4"
      >
        <span class="text-sm font-medium text-slate-500 dark:text-slate-400">
          نمایش صفحه
          <span class="font-black text-indigo-600 dark:text-indigo-400 mx-1">{{
            currentPage
          }}</span>
          از
          <span class="font-black text-slate-700 dark:text-slate-300 mx-1">{{ totalPages }}</span>
        </span>
        <div class="flex items-center gap-2">
          <button
            :disabled="currentPage === 1"
            class="px-4 py-2 text-sm font-bold text-slate-700 bg-white border-2 border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-slate-800 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700 transition-all shadow-sm"
            @click="fetchReviews(currentPage - 1)"
          >
            قبلی
          </button>
          <button
            :disabled="currentPage === totalPages"
            class="px-4 py-2 text-sm font-bold text-slate-700 bg-white border-2 border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-slate-800 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700 transition-all shadow-sm"
            @click="fetchReviews(currentPage + 1)"
          >
            بعدی
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { adminReviewApi } from '@/api/adminReviewApi'
import axios from '@/lib/axios'

// --- Types ---
interface Review {
  id: number
  title: string
  body: string
  rating: number
  status: 'pending' | 'approved' | 'rejected'
  replies_count?: number
  is_buyer?: boolean
  advantages?: string[] | null
  disadvantages?: string[] | null
  admin_reply?: string | null
  user?: { name: string }
  product?: { name: string }
}

interface Reply {
  id: number
  body: string
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
  user?: { name: string }
}

// --- State های نظرات (اصلی) ---
const reviews = ref<Review[]>([])
const isLoading = ref(true)
const filterStatus = ref('')
const currentPage = ref(1)
const totalPages = ref(1)
const totalReviews = ref(0)

// --- State های مربوط به سطر بازشونده (Accordion) ---
const expandedRows = ref<number[]>([])
const reviewReplies = ref<Record<number, Reply[]>>({})
const loadingReplies = ref<Record<number, boolean>>({})

// State های پاسخ مستقیم مدیر
const adminReplyDrafts = ref<Record<number, string>>({})
const savingAdminReply = ref<Record<number, boolean>>({})

// --- متدهای مدیریت نظرات اصلی ---
const fetchReviews = async (page: number = 1) => {
  isLoading.value = true
  try {
    const response = await adminReviewApi.getReviews(filterStatus.value || undefined, page)
    reviews.value = response.data.data
    currentPage.value = response.data.current_page
    totalPages.value = response.data.last_page
    totalReviews.value = response.data.total || 0
  } catch (error) {
    console.error('خطا در دریافت نظرات:', error)
    alert('خطا در ارتباط با سرور هنگام دریافت نظرات.')
  } finally {
    isLoading.value = false
  }
}

const changeStatus = async (id: number, status: 'approved' | 'rejected') => {
  try {
    await adminReviewApi.updateStatus(id, status)
    const index = reviews.value.findIndex((r) => r.id === id)
    if (index !== -1) {
      reviews.value[index].status = status
    }
  } catch (error) {
    console.error('خطا در تغییر وضعیت:', error)
    alert('عملیات تغییر وضعیت با خطا مواجه شد.')
  }
}

const removeReview = async (id: number) => {
  if (!confirm('آیا از حذف دائم این نظر اطمینان دارید؟ تمامی پاسخ‌های آن نیز حذف خواهند شد.'))
    return
  try {
    await adminReviewApi.deleteReview(id)
    reviews.value = reviews.value.filter((r) => r.id !== id)
    expandedRows.value = expandedRows.value.filter((rowId) => rowId !== id)
    if (totalReviews.value > 0) totalReviews.value--
  } catch (error) {
    console.error('خطا در حذف نظر:', error)
    alert('خطا در حذف نظر.')
  }
}

// --- متدهای مدیریت بخش بازشونده (پاسخ مدیر و ریپلای‌ها) ---

// 1. باز و بسته کردن سطر
const toggleRow = async (review: Review) => {
  const index = expandedRows.value.indexOf(review.id)
  if (index > -1) {
    // اگر باز بود، ببند
    expandedRows.value.splice(index, 1)
  } else {
    // اگر بسته بود، باز کن
    expandedRows.value.push(review.id)

    // مقداردهی اولیه فیلد پاسخ مدیر از دیتابیس
    if (adminReplyDrafts.value[review.id] === undefined) {
      adminReplyDrafts.value[review.id] = review.admin_reply || ''
    }

    // گرفتن ریپلای‌های کاربران (فقط در صورتی که پاسخ کاربری وجود داشته باشد)
    if (!reviewReplies.value[review.id] && (review.replies_count || 0) > 0) {
      await fetchReplies(review.id)
    }
  }
}

// 2. ثبت پاسخ مستقیم مدیر
const submitAdminReply = async (reviewId: number) => {
  savingAdminReply.value[reviewId] = true
  try {
    const text = adminReplyDrafts.value[reviewId] || ''
    await axios.patch(
      `/admin/reviews/${reviewId}/admin-reply`,
      { admin_reply: text },
      { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } },
    )

    // آپدیت استیت اصلی
    const index = reviews.value.findIndex((r) => r.id === reviewId)
    if (index !== -1) {
      reviews.value[index].admin_reply = text
    }

    // نمایش یک فیدبک بصری کوچک به جای alert
    const btnText = 'ثبت شد! ✓'
    // می‌توانید از Toastification هم استفاده کنید اگر نصب دارید
    alert('پاسخ سایت با موفقیت ثبت/بروزرسانی شد.')
  } catch (error) {
    console.error('خطا در ثبت پاسخ ادمین:', error)
    alert('خطا در ثبت پاسخ مدیر.')
  } finally {
    savingAdminReply.value[reviewId] = false
  }
}

// 3. گرفتن لیست ریپلای‌های یک نظر خاص
const fetchReplies = async (reviewId: number) => {
  loadingReplies.value[reviewId] = true
  try {
    const response = await axios.get(`/admin/reviews/${reviewId}/replies`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    })
    reviewReplies.value[reviewId] = response.data
  } catch (error) {
    console.error(`خطا در دریافت پاسخ‌های نظر ${reviewId}:`, error)
  } finally {
    loadingReplies.value[reviewId] = false
  }
}

// 4. تغییر وضعیت یک ریپلای کاربر
const updateReplyStatus = async (
  reviewId: number,
  replyId: number,
  status: 'approved' | 'rejected',
) => {
  try {
    await axios.patch(
      `/admin/review-replies/${replyId}/status`,
      { status },
      { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } },
    )
    if (reviewReplies.value[reviewId]) {
      const replyIndex = reviewReplies.value[reviewId].findIndex((r) => r.id === replyId)
      if (replyIndex !== -1) {
        reviewReplies.value[reviewId][replyIndex].status = status
      }
    }
  } catch (error) {
    console.error('خطا در تغییر وضعیت پاسخ:', error)
    alert('تغییر وضعیت پاسخ با خطا مواجه شد.')
  }
}

// 5. حذف یک ریپلای کاربر
const deleteReply = async (reviewId: number, replyId: number) => {
  if (!confirm('آیا از حذف دائم این پاسخ اطمینان دارید؟')) return
  try {
    await axios.delete(`/admin/review-replies/${replyId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    })
    if (reviewReplies.value[reviewId]) {
      reviewReplies.value[reviewId] = reviewReplies.value[reviewId].filter((r) => r.id !== replyId)
      const reviewIndex = reviews.value.findIndex((r) => r.id === reviewId)
      if (reviewIndex !== -1 && reviews.value[reviewIndex].replies_count) {
        reviews.value[reviewIndex].replies_count! -= 1
      }
    }
  } catch (error) {
    console.error('خطا در حذف پاسخ:', error)
    alert('حذف پاسخ با خطا مواجه شد.')
  }
}

// دریافت اطلاعات هنگام لود اولیه
onMounted(() => {
  fetchReviews(1)
})
</script>
