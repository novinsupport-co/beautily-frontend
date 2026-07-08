<template>
  <div class="space-y-8">
    <!-- بخش ثبت نظر جدید -->
    <div class="bg-white border border-slate-100 shadow-sm rounded-2xl p-6 md:p-8">
      <h3 class="text-xl font-bold text-slate-800 mb-6">ثبت دیدگاه جدید</h3>

      <form class="space-y-6" @submit.prevent="submitReview">
        <!-- امتیازدهی -->
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-2"
            >امتیاز شما به این محصول</label
          >
          <div class="flex items-center gap-1">
            <button
              v-for="star in 5"
              :key="star"
              class="focus:outline-none transition-transform hover:scale-110"
              type="button"
              @click="newReview.rating = star"
            >
              <svg
                :class="star <= newReview.rating ? 'text-amber-400' : 'text-slate-200'"
                class="w-8 h-8"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                />
              </svg>
            </button>
          </div>
        </div>

        <!-- عنوان نظر -->
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-2" for="title"
            >عنوان دیدگاه</label
          >
          <input
            id="title"
            v-model="newReview.title"
            class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm"
            placeholder="مثلا: کیفیت ساخت عالی"
            required
            type="text"
          />
        </div>

        <!-- نقاط قوت و ضعف -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
          <!-- نقاط قوت -->
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">نقاط قوت (اختیاری)</label>
            <div class="flex gap-2">
              <input
                v-model="tempAdvantage"
                class="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-sm bg-slate-50"
                placeholder="تایپ کنید و اینتر بزنید..."
                type="text"
                @keydown.enter.prevent="addAdvantage"
              />
              <button
                class="px-4 py-2.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-xl text-sm font-bold transition-colors shrink-0"
                type="button"
                @click="addAdvantage"
              >
                افزودن
              </button>
            </div>
            <!-- تگ‌های نقاط قوت -->
            <div v-if="newReview.advantages.length" class="flex flex-wrap gap-2 mt-3">
              <span
                v-for="(adv, index) in newReview.advantages"
                :key="index"
                class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-bold"
              >
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M12 4v16m8-8H4"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                  ></path>
                </svg>
                {{ adv }}
                <button
                  class="text-emerald-400 hover:text-emerald-700 ml-1"
                  type="button"
                  @click="removeAdvantage(index)"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      d="M6 18L18 6M6 6l12 12"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                    ></path>
                  </svg>
                </button>
              </span>
            </div>
          </div>

          <!-- نقاط ضعف -->
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">نقاط ضعف (اختیاری)</label>
            <div class="flex gap-2">
              <input
                v-model="tempDisadvantage"
                class="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition-all text-sm bg-slate-50"
                placeholder="تایپ کنید و اینتر بزنید..."
                type="text"
                @keydown.enter.prevent="addDisadvantage"
              />
              <button
                class="px-4 py-2.5 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-xl text-sm font-bold transition-colors shrink-0"
                type="button"
                @click="addDisadvantage"
              >
                افزودن
              </button>
            </div>
            <!-- تگ‌های نقاط ضعف -->
            <div v-if="newReview.disadvantages.length" class="flex flex-wrap gap-2 mt-3">
              <span
                v-for="(dis, index) in newReview.disadvantages"
                :key="index"
                class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-50 border border-rose-100 text-rose-700 text-xs font-bold"
              >
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M20 12H4"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                  ></path>
                </svg>
                {{ dis }}
                <button
                  class="text-rose-400 hover:text-rose-700 ml-1"
                  type="button"
                  @click="removeDisadvantage(index)"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      d="M6 18L18 6M6 6l12 12"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                    ></path>
                  </svg>
                </button>
              </span>
            </div>
          </div>
        </div>

        <!-- متن نظر -->
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-2" for="body">متن دیدگاه</label>
          <textarea
            id="body"
            v-model="newReview.body"
            class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none text-sm leading-relaxed"
            placeholder="تجربه استفاده خود را به صورت کامل بنویسید..."
            required
            rows="4"
          ></textarea>
        </div>

        <div class="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <!-- ناشناس بودن -->
          <label class="flex items-center gap-2 cursor-pointer group select-none">
            <input
              v-model="newReview.is_anonymous"
              class="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
              type="checkbox"
            />
            <span
              class="text-sm font-medium text-slate-600 group-hover:text-slate-800 transition-colors"
              >ارسال دیدگاه به صورت ناشناس</span
            >
          </label>

          <button
            :disabled="isSubmitting"
            class="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-8 py-3 rounded-xl font-medium transition-colors shadow-sm flex items-center justify-center gap-2"
            type="submit"
          >
            <svg v-if="isSubmitting" class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
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
            {{ isSubmitting ? 'در حال ثبت...' : 'ثبت دیدگاه' }}
          </button>
        </div>
      </form>
    </div>

    <!-- لیست نظرات -->
    <div
      v-if="loading"
      class="flex flex-col items-center justify-center py-10 text-slate-500 gap-3"
    >
      <div
        class="w-8 h-8 border-4 border-slate-200 border-t-blue-500 rounded-full animate-spin"
      ></div>
      <span class="text-sm font-medium">در حال بارگذاری دیدگاه‌ها...</span>
    </div>

    <div
      v-else-if="reviews.length === 0"
      class="bg-white border border-slate-100 shadow-sm rounded-2xl p-6 md:p-10 text-center"
    >
      <div
        class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-50 text-slate-300 mb-5"
      >
        <svg
          class="w-10 h-10"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          viewBox="0 0 24 24"
        >
          <path
            d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>
      <h3 class="text-lg font-bold text-slate-800 mb-2">هنوز دیدگاهی ثبت نشده است</h3>
      <p class="text-slate-500 text-sm">
        شما اولین نفری باشید که تجربه خود را به اشتراک می‌گذارید.
      </p>
    </div>

    <div v-else class="space-y-6">
      <h3 class="text-xl font-bold text-slate-800 border-b border-slate-100 pb-4">
        دیدگاه کاربران ({{ reviews.length }})
      </h3>

      <!-- آیتم نظر -->
      <div
        v-for="review in reviews"
        :key="review.id"
        class="bg-white border border-slate-100 shadow-sm rounded-2xl p-5 md:p-6 transition-all hover:shadow-md"
      >
        <!-- هدر نظر -->
        <div
          class="flex flex-wrap sm:flex-nowrap justify-between items-start gap-4 mb-4 border-b border-slate-50 pb-4"
        >
          <div>
            <div class="flex items-center flex-wrap gap-2 md:gap-3 mb-2">
              <span
                class="inline-flex items-center justify-center w-9 h-9 rounded-full bg-slate-100 text-slate-600 font-bold text-sm"
              >
                {{ review.is_anonymous ? '؟' : review.user?.name?.charAt(0) || 'ک' }}
              </span>
              <div class="flex flex-col">
                <div class="flex items-center gap-2">
                  <span class="font-bold text-slate-800 text-sm">
                    {{ review.is_anonymous ? 'کاربر ناشناس' : review.user?.name || 'کاربر مهمان' }}
                  </span>
                  <!-- نشان خریدار بودن -->
                  <span
                    v-if="review.is_buyer"
                    class="inline-flex items-center gap-1 bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded text-[10px] font-bold border border-emerald-100"
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
                <span class="text-[11px] font-medium text-slate-400 mt-0.5">
                  {{ new Date(review.created_at).toLocaleDateString('fa-IR') }}
                </span>
              </div>
            </div>
          </div>

          <!-- نمایش ستاره‌های نظر -->
          <div
            class="flex items-center bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-100 shrink-0"
          >
            <span class="text-amber-600 font-black text-sm ml-1.5">{{ review.rating }}</span>
            <svg class="w-4 h-4 text-amber-500 pb-[1px]" fill="currentColor" viewBox="0 0 20 20">
              <path
                d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
              />
            </svg>
          </div>
        </div>

        <!-- محتوای نظر -->
        <div class="mb-5">
          <h4 class="text-base font-bold text-slate-800 mb-2">{{ review.title }}</h4>
          <p class="text-slate-600 leading-relaxed text-sm font-medium">{{ review.body }}</p>

          <!-- نمایش نقاط قوت و ضعف (اصلاح شده برای جلوگیری از نمایش آرایه به صورت رشته) -->
          <div
            v-if="hasItems(review.advantages) || hasItems(review.disadvantages)"
            class="mt-4 flex flex-col gap-2.5"
          >
            <!-- قوت -->
            <div v-if="hasItems(review.advantages)" class="flex items-start gap-2">
              <svg
                class="w-5 h-5 text-emerald-500 shrink-0"
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
              <div class="flex flex-col gap-1">
                <span
                  v-for="(adv, idx) in review.advantages"
                  :key="idx"
                  class="text-sm text-slate-700 font-medium"
                  >{{ adv }}</span
                >
              </div>
            </div>
            <!-- ضعف -->
            <div v-if="hasItems(review.disadvantages)" class="flex items-start gap-2 mt-1">
              <svg
                class="w-5 h-5 text-rose-500 shrink-0"
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
              <div class="flex flex-col gap-1">
                <span
                  v-for="(dis, idx) in review.disadvantages"
                  :key="idx"
                  class="text-sm text-slate-700 font-medium"
                  >{{ dis }}</span
                >
              </div>
            </div>
          </div>
        </div>

        <!-- پاسخ رسمی سایت (ادمین) -->
        <div
          v-if="review.admin_reply"
          class="bg-blue-50/50 border border-blue-100 rounded-xl p-4 mb-5 relative overflow-hidden"
        >
          <div class="absolute right-0 top-0 bottom-0 w-1 bg-blue-500"></div>
          <div class="flex items-center gap-2 mb-2">
            <svg
              class="w-5 h-5 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
              ></path>
            </svg>
            <span class="text-sm font-bold text-blue-800">پاسخ رسمی فروشگاه</span>
          </div>
          <p class="text-sm text-blue-900 leading-relaxed font-medium">{{ review.admin_reply }}</p>
        </div>

        <!-- اکشن‌های نظر (لایک/دیس‌لایک و دکمه پاسخ) -->
        <div
          class="flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 pt-4"
        >
          <button
            class="text-sm font-bold text-slate-500 hover:text-blue-600 flex items-center gap-1.5 transition-colors bg-slate-50 hover:bg-blue-50 px-3 py-1.5 rounded-lg"
            @click="openReplyForm(review.id)"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
              ></path>
            </svg>
            پاسخ به این دیدگاه
          </button>

          <div class="flex items-center gap-4 text-sm text-slate-500">
            <span class="text-xs hidden sm:block">آیا این دیدگاه مفید بود؟</span>
            <button
              class="flex items-center gap-1.5 hover:text-emerald-600 transition-colors bg-slate-50 hover:bg-emerald-50 px-2 py-1 rounded-md"
              @click="toggleReviewFeedback(review.id, 'like')"
            >
              <span class="font-bold text-xs pt-0.5" dir="ltr">{{ review.likes_count || 0 }}</span>
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 01-2-2h-6a2 2 0 01-2-2v-2.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                ></path>
              </svg>
            </button>
            <button
              class="flex items-center gap-1.5 hover:text-rose-600 transition-colors bg-slate-50 hover:bg-rose-50 px-2 py-1 rounded-md"
              @click="toggleReviewFeedback(review.id, 'dislike')"
            >
              <span class="font-bold text-xs pt-0.5" dir="ltr">{{
                review.dislikes_count || 0
              }}</span>
              <svg class="w-4 h-4 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                ></path>
              </svg>
            </button>
          </div>
        </div>

        <!-- فرم ثبت پاسخ (ریپلای) -->
        <div
          v-if="replyingTo === review.id"
          class="mt-4 bg-slate-50 p-4 rounded-xl border border-slate-200 shadow-inner"
        >
          <textarea
            v-model="replyBody"
            class="w-full px-4 py-3 text-sm rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none resize-none mb-3 bg-white"
            placeholder="پاسخ خود را به این نظر بنویسید..."
            rows="2"
          ></textarea>
          <div class="flex justify-end gap-2">
            <button
              class="px-4 py-2 text-sm font-bold text-slate-500 hover:bg-slate-200 rounded-lg transition-colors"
              @click="replyingTo = null"
            >
              انصراف
            </button>
            <button
              class="px-5 py-2 text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-sm"
              @click="submitReply(review.id)"
            >
              ارسال پاسخ
            </button>
          </div>
        </div>

        <!-- نمایش ریپلای‌های کاربران به این نظر -->
        <div
          v-if="review.replies && review.replies.length > 0"
          class="mt-5 mr-2 sm:mr-6 pr-4 sm:pr-6 border-r-2 border-slate-100 space-y-4"
        >
          <div
            v-for="reply in review.replies"
            :key="reply.id"
            class="bg-slate-50/80 rounded-xl p-4 border border-slate-100"
          >
            <div class="flex items-center gap-2 mb-2">
              <span
                class="w-7 h-7 flex items-center justify-center rounded-full bg-slate-200 text-slate-600 text-xs font-bold"
              >
                {{ reply.user?.name?.charAt(0) || 'ک' }}
              </span>
              <div class="flex flex-col">
                <span class="font-bold text-sm text-slate-800">{{
                  reply.user?.name || 'کاربر'
                }}</span>
                <span class="text-[10px] text-slate-400"
                  >پاسخ داد در {{ new Date(reply.created_at).toLocaleDateString('fa-IR') }}</span
                >
              </div>
            </div>
            <p class="text-sm text-slate-600 mb-3 leading-relaxed font-medium">{{ reply.body }}</p>

            <!-- لایک و دیس‌لایک ریپلای -->
            <div class="flex items-center justify-end gap-3 text-slate-400">
              <button
                class="flex items-center gap-1 hover:text-emerald-600 transition-colors"
                @click="toggleReplyFeedback(reply.id, 'like')"
              >
                <span class="text-xs font-bold" dir="ltr">{{ reply.likes_count || 0 }}</span>
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 01-2-2h-6a2 2 0 01-2-2v-2.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                  ></path>
                </svg>
              </button>
              <button
                class="flex items-center gap-1 hover:text-rose-600 transition-colors"
                @click="toggleReplyFeedback(reply.id, 'dislike')"
              >
                <span class="text-xs font-bold" dir="ltr">{{ reply.dislikes_count || 0 }}</span>
                <svg class="w-4 h-4 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5"
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
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import axiosInstance from '@/lib/axios'

const props = defineProps({
  productId: {
    type: [Number, String],
    required: true,
  },
})

// استیت‌های اصلی
const reviews = ref([])
const loading = ref(true)
const isSubmitting = ref(false)

// فرم نظر جدید
const newReview = ref({
  rating: 5,
  title: '',
  body: '',
  advantages: [],
  disadvantages: [],
  is_anonymous: false,
})

// استیت‌های موقت
const tempAdvantage = ref('')
const tempDisadvantage = ref('')

// هلپر (تابع کمکی) بسیار مهم برای اطمینان از آرایه بودن داده قبل از رندر شدن
const hasItems = (items) => {
  return Array.isArray(items) && items.length > 0
}

// متدهای نقاط قوت و ضعف
const addAdvantage = () => {
  const text = tempAdvantage.value.trim()
  if (text && !newReview.value.advantages.includes(text)) {
    newReview.value.advantages.push(text)
  }
  tempAdvantage.value = '' // همیشه پاک شود
}

const removeAdvantage = (index) => {
  newReview.value.advantages.splice(index, 1)
}

const addDisadvantage = () => {
  const text = tempDisadvantage.value.trim()
  if (text && !newReview.value.disadvantages.includes(text)) {
    newReview.value.disadvantages.push(text)
  }
  tempDisadvantage.value = '' // همیشه پاک شود
}

const removeDisadvantage = (index) => {
  newReview.value.disadvantages.splice(index, 1)
}

// استیت‌های ریپلای
const replyingTo = ref(null)
const replyBody = ref('')

// دریافت لیست نظرات
const fetchReviews = async () => {
  loading.value = true
  try {
    const response = await axiosInstance.get(`/products/${props.productId}/reviews`)
    // اطمینان از پارس شدن صحیح داده‌ها
    reviews.value = response.data.data || response.data
  } catch (error) {
    console.error('خطا در دریافت دیدگاه‌ها:', error)
  } finally {
    loading.value = false
  }
}

// ثبت نظر اصلی (اصلاح شده)
const submitReview = async () => {
  // جلوگیری از ارسال فرم خالی
  if (!newReview.value.title.trim() || !newReview.value.body.trim()) {
    alert('لطفا عنوان و متن دیدگاه را وارد کنید.')
    return
  }

  // ترفند مهم: اگر کاربر متنی نوشته بود اما فراموش کرده بود دکمه "افزودن" را بزند، خودکار اضافه‌اش می‌کنیم
  if (tempAdvantage.value.trim()) addAdvantage()
  if (tempDisadvantage.value.trim()) addDisadvantage()

  isSubmitting.value = true

  try {
    await axiosInstance.post(`/products/${props.productId}/reviews`, {
      title: newReview.value.title.trim(),
      body: newReview.value.body.trim(),
      rating: newReview.value.rating,
      // استفاده از Array.from برای تبدیل Proxy استیتِ ویو به آرایه خالص و رفع مشکل سریالایزِ دیتابیس
      advantages: Array.from(newReview.value.advantages),
      disadvantages: Array.from(newReview.value.disadvantages),
      is_anonymous: newReview.value.is_anonymous ? 1 : 0,
    })

    alert('دیدگاه شما با موفقیت ثبت شد و پس از تایید مدیریت نمایش داده می‌شود.')

    // ریست کردن کامل فرم
    newReview.value = {
      rating: 5,
      title: '',
      body: '',
      advantages: [],
      disadvantages: [],
      is_anonymous: false,
    }
    tempAdvantage.value = ''
    tempDisadvantage.value = ''
  } catch (error) {
    console.error('خطا در ثبت دیدگاه:', error)
    alert('مشکلی در ثبت دیدگاه به وجود آمد.')
  } finally {
    isSubmitting.value = false
  }
}

// باز کردن کادر پاسخ
const openReplyForm = (reviewId) => {
  replyingTo.value = reviewId
  replyBody.value = ''
}

// ثبت پاسخ برای یک نظر
const submitReply = async (reviewId) => {
  if (!replyBody.value.trim()) return

  try {
    await axiosInstance.post(`/reviews/${reviewId}/reply`, {
      body: replyBody.value,
    })

    alert('پاسخ شما با موفقیت ثبت شد و پس از تایید مدیریت نمایش داده می‌شود.')
    replyingTo.value = null
    replyBody.value = ''
  } catch (error) {
    console.error('خطا در ثبت پاسخ:', error)
    alert('مشکلی در ثبت پاسخ به وجود آمد.')
  }
}

// لایک / دیس‌لایک نظر اصلی
const toggleReviewFeedback = async (reviewId, type) => {
  try {
    await axiosInstance.post(`/reviews/${reviewId}/feedback`, { type })
    fetchReviews()
  } catch (error) {
    console.error('خطا در ثبت بازخورد نظر:', error)
  }
}

// لایک / دیس‌لایک ریپلای
const toggleReplyFeedback = async (replyId, type) => {
  try {
    await axiosInstance.post(`/review-replies/${replyId}/feedback`, { type })
    fetchReviews()
  } catch (error) {
    console.error('خطا در ثبت بازخورد پاسخ:', error)
  }
}

onMounted(() => {
  if (props.productId) {
    fetchReviews()
  }
})
</script>
