<template>
  <div class="bg-white p-4 md:p-8 rounded-2xl shadow-sm border border-slate-100">
    <div class="flex items-center justify-between mb-8">
      <h2 class="text-2xl font-black text-slate-800 flex items-center gap-2">
        <svg
          class="w-7 h-7 text-amber-500"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        دیدگاه‌های من
      </h2>
    </div>

    <!-- حالت لودینگ -->
    <div v-if="loading" class="flex flex-col justify-center items-center py-16 space-y-4">
      <div
        class="w-12 h-12 border-4 border-amber-200 border-t-amber-500 rounded-full animate-spin"
      ></div>
      <span class="text-slate-500 font-medium text-sm animate-pulse">در حال دریافت اطلاعات...</span>
    </div>

    <!-- حالت خالی بودن لیست -->
    <div
      v-else-if="reviews.length === 0"
      class="flex flex-col items-center justify-center py-16 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200"
    >
      <div
        class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white text-slate-300 mb-5 shadow-sm"
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
      <h3 class="text-lg font-bold text-slate-800 mb-2">شما تاکنون دیدگاهی ثبت نکرده‌اید</h3>
      <p class="text-slate-500 text-sm">
        دیدگاه‌های شما پس از ثبت در محصولات، اینجا نمایش داده می‌شوند.
      </p>
    </div>

    <!-- لیست دیدگاه‌ها -->
    <div v-else class="space-y-6">
      <div
        v-for="review in reviews"
        :key="review.id"
        class="bg-white border border-slate-100 hover:border-amber-100 transition-all duration-300 rounded-2xl p-5 md:p-6 shadow-sm hover:shadow-md"
      >
        <!-- هدر دیدگاه: اطلاعات محصول و وضعیت -->
        <div
          class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-50 pb-4 mb-4"
        >
          <div class="flex items-center gap-3">
            <div
              class="w-14 h-14 flex-shrink-0 bg-white border border-slate-100 rounded-xl overflow-hidden p-1 shadow-sm"
            >
              <img
                v-if="review.product?.thumbnail?.urls?.thumb"
                :alt="review.product?.title || review.product?.name"
                :src="review.product.thumbnail.urls.thumb"
                class="w-full h-full object-contain rounded-lg"
              />
              <div
                v-else
                class="w-full h-full bg-slate-50 flex items-center justify-center text-slate-300 rounded-lg"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1.5"
                  />
                </svg>
              </div>
            </div>
            <div>
              <span
                class="text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-1 rounded-md mb-1 inline-block"
                >درباره محصول</span
              >
              <h3 class="text-sm font-bold text-slate-800 line-clamp-1">
                {{ review.product?.title || review.product?.name || 'محصول نامشخص' }}
              </h3>
            </div>
          </div>

          <div class="flex items-center gap-3">
            <!-- وضعیت تایید دیدگاه -->
            <span
              :class="{
                'text-emerald-600 bg-emerald-50 border-emerald-100': review.status === 'approved',
                'text-rose-600 bg-rose-50 border-rose-100': review.status === 'rejected',
                'text-amber-600 bg-amber-50 border-amber-100':
                  review.status === 'pending' || !review.status,
              }"
              class="text-xs font-medium border px-2 py-1 rounded-md whitespace-nowrap"
            >
              {{
                review.status === 'approved'
                  ? 'تایید شده'
                  : review.status === 'rejected'
                    ? 'رد شده'
                    : 'در انتظار تایید'
              }}
            </span>

            <!-- تاریخ دیدگاه -->
            <div class="text-xs text-slate-400 font-medium flex items-center gap-1">
              <svg
                class="w-4 h-4"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
                viewBox="0 0 24 24"
              >
                <path
                  d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              {{ new Date(review.created_at).toLocaleDateString('fa-IR') }}
            </div>
          </div>
        </div>

        <!-- محتوای اصلی دیدگاه -->
        <div class="mb-5">
          <!-- ستاره‌ها و عنوان -->
          <div class="flex flex-wrap items-center gap-3 mb-3">
            <!-- نمایش ستاره‌های نظر -->
            <div
              v-if="review.rating"
              class="flex items-center bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-100 shrink-0"
            >
              <span class="text-amber-600 font-black text-sm ml-1.5">{{ review.rating }}</span>
              <svg class="w-4 h-4 text-amber-500 pb-[1px]" fill="currentColor" viewBox="0 0 20 20">
                <path
                  d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                />
              </svg>
            </div>
            <h4 v-if="review.title" class="text-base font-bold text-slate-800">
              {{ review.title }}
            </h4>
          </div>

          <!-- متن نظر -->
          <p class="text-slate-600 leading-relaxed text-sm font-medium">
            {{ review.body || review.comment }}
          </p>

          <!-- نقاط قوت و ضعف -->
          <div
            v-if="hasItems(review.advantages) || hasItems(review.disadvantages)"
            class="mt-4 flex flex-col gap-2.5 bg-slate-50 p-4 rounded-xl border border-slate-100"
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

        <!-- لایک‌ها و نمایش پاسخ‌های سایر کاربران -->
        <div class="flex flex-col gap-4 border-t border-slate-100 pt-4">
          <!-- شمارنده لایک/دیس‌لایک خود دیدگاه -->
          <div class="flex items-center gap-4 text-sm text-slate-500">
            <span class="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-md">
              <span class="font-bold text-xs pt-0.5 text-emerald-600" dir="ltr">{{
                review.likes_count || 0
              }}</span>
              <svg
                class="w-4 h-4 text-emerald-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 01-2-2h-6a2 2 0 01-2-2v-2.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                ></path>
              </svg>
            </span>
            <span class="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-md">
              <span class="font-bold text-xs pt-0.5 text-rose-600" dir="ltr">{{
                review.dislikes_count || 0
              }}</span>
              <svg
                class="w-4 h-4 mt-0.5 text-rose-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                ></path>
              </svg>
            </span>
            <span class="text-xs hidden sm:block text-slate-400">بازخورد دیگران به دیدگاه شما</span>
          </div>

          <!-- نمایش ریپلای‌های سایر کاربران به این نظر -->
          <div
            v-if="hasItems(review.replies)"
            class="mr-2 sm:mr-6 pr-4 sm:pr-6 border-r-2 border-slate-100 space-y-4"
          >
            <h5 class="text-xs font-bold text-slate-400 mb-2">پاسخ‌های کاربران به دیدگاه شما:</h5>
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
              <p class="text-sm text-slate-600 mb-2 leading-relaxed font-medium">
                {{ reply.body || reply.reply }}
              </p>

              <!-- لایک و دیس‌لایک ریپلای (فقط نمایش آمار) -->
              <div class="flex items-center justify-end gap-3 text-slate-400">
                <div class="flex items-center gap-1">
                  <span class="text-xs font-bold" dir="ltr">{{ reply.likes_count || 0 }}</span>
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 01-2-2h-6a2 2 0 01-2-2v-2.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                    ></path>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { getUserReviewsApi } from '@/api/userApi'

const reviews = ref<any[]>([])
const loading = ref(true)

// هلپر برای چک کردن آرایه‌ها (مخصوص نقاط قوت/ضعف و پاسخ‌ها)
const hasItems = (items: any) => {
  return Array.isArray(items) && items.length > 0
}

const fetchReviews = async () => {
  try {
    const response = await getUserReviewsApi()

    // جداسازی هوشمند آرایه از آبجکت صفحه‌بندی لاراول
    if (response.data && Array.isArray(response.data.data)) {
      reviews.value = response.data.data
    } else if (Array.isArray(response.data)) {
      reviews.value = response.data
    } else {
      reviews.value = []
    }
  } catch (error) {
    console.error('خطا در دریافت دیدگاه‌ها:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchReviews()
})
</script>
