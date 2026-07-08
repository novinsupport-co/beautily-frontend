<template>
  <div class="p-6 md:p-10 space-y-8 animate-in fade-in duration-700 font-vazir">
    <!-- Header -->
    <div class="flex flex-col md:flex-row justify-between items-center gap-6">
      <div>
        <h1 class="text-3xl font-bold text-slate-800 dark:text-white flex items-center gap-3">
          <span
            class="bg-indigo-600 text-white p-2.5 rounded-2xl shadow-lg shadow-indigo-200 dark:shadow-none"
            >📦</span
          >
          مدیریت سفارشات
        </h1>
        <p class="text-slate-500 mt-2 font-medium">پیگیری، تایید و پردازش خریدهای فروشگاه</p>
      </div>

      <div class="relative w-full md:w-96">
        <input
          v-model="search"
          class="w-full bg-white dark:bg-slate-900 border-none rounded-[1.5rem] px-12 py-4 shadow-sm focus:ring-2 focus:ring-indigo-500 transition-all text-sm font-medium text-slate-700 dark:text-slate-300"
          placeholder="جستجو (شماره سفارش، نام، موبایل...)"
          type="text"
          @input="debounceSearch"
        />
        <MagnifyingGlassIcon class="w-6 h-6 text-slate-400 absolute right-4 top-4" />
      </div>
    </div>

    <!-- Main Table Card -->
    <div
      class="bg-white dark:bg-slate-900 rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-800 overflow-x-auto relative min-h-[400px]"
    >
      <div
        v-if="loading"
        class="absolute inset-0 bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm z-10 flex items-center justify-center rounded-[2rem]"
      >
        <div
          class="animate-spin rounded-full h-12 w-12 border-4 border-indigo-100 border-t-indigo-600"
        ></div>
      </div>

      <table class="w-full text-right border-collapse min-w-[1000px]">
        <thead>
          <tr
            class="bg-slate-50/80 dark:bg-slate-800/80 text-slate-500 text-xs tracking-wide uppercase border-b border-slate-100 dark:border-slate-800"
          >
            <th class="p-5 font-bold">شماره سفارش</th>
            <th class="p-5 font-bold">مشتری</th>
            <th class="p-5 font-bold">مبلغ نهایی</th>
            <th class="p-5 font-bold">وضعیت پرداخت</th>
            <th class="p-5 font-bold">وضعیت سفارش</th>
            <th class="p-5 font-bold text-center">تاریخ ثبت</th>
            <th class="p-5 font-bold text-center">جزئیات</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
          <template v-for="order in orders" :key="order.id">
            <!-- ردیف اصلی جدول -->
            <tr
              :class="[
                { 'bg-indigo-50/30 dark:bg-indigo-900/10': expandedOrderId === order.id },
                order.status === 'expired'
                  ? 'opacity-60 bg-slate-100 dark:bg-slate-800/50 grayscale-[50%]' /* ظاهر آرشیوی */
                  : 'hover:bg-slate-50/50 dark:hover:bg-slate-800/30',
              ]"
              class="transition-all group"
            >
              <td class="p-5 font-bold text-indigo-600 dark:text-indigo-400 tracking-widest">
                #{{ toPersianDigits(order.order_no) }}
              </td>
              <td class="p-5">
                <div class="flex flex-col">
                  <span class="font-bold text-slate-800 dark:text-slate-200">{{
                    order.customer?.name || order.user?.name || 'بدون نام'
                  }}</span>
                  <span class="text-[11px] text-slate-400 font-medium mt-1">{{
                    toPersianDigits(order.customer?.phone || order.user?.mobile)
                  }}</span>
                </div>
              </td>
              <td class="p-5 font-bold text-slate-700 dark:text-slate-300">
                {{ toPersianDigits(formatPrice(order.payable)) }}
                <span class="text-[10px] text-slate-400 font-normal">تومان</span>
              </td>

              <!-- ستون وضعیت پرداخت -->
              <td class="p-5">
                <span :class="paymentStatusBadge(order.payment_status)">
                  {{ getPaymentStatusText(order.payment_status) }}
                </span>
              </td>

              <!-- ستون وضعیت سفارش -->
              <td class="p-5">
                <!-- اگر لغو سیستمی باشد، امکان تغییر وضعیت بسته می‌شود -->
                <div
                  v-if="order.status === 'expired'"
                  class="inline-flex items-center px-3 py-1.5 rounded-xl text-[11px] font-bold bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300 shadow-inner"
                >
                  🚫 لغو سیستمی (زمان منقضی شده)
                </div>

                <!-- در غیر این صورت فیلد انتخاب وضعیت نمایش داده می‌شود -->
                <div v-else class="flex flex-col gap-2 w-max">
                  <select
                    :class="statusClasses(order.status)"
                    class="rounded-xl px-3 py-1.5 text-[11px] font-bold border-none focus:ring-0 cursor-pointer transition-all shadow-sm"
                    @change="handleStatusChange(order, $event)"
                    @click.stop
                  >
                    <option value="pending_payment">در انتظار پرداخت</option>
                    <option value="pending_review">در انتظار بررسی</option>
                    <option value="processing">در حال پردازش / بسته‌بندی</option>
                    <option value="shipped">ارسال شده</option>
                    <option value="delivered">تحویل داده شده</option>
                    <option value="cancelled">لغو شده</option>
                    <option value="returned">مرجوع شده (عودت)</option>
                    <option value="failed">ناموفق / دارای مشکل</option>
                  </select>

                  <div
                    v-if="order.tracking_code"
                    class="text-[10px] font-bold text-indigo-600 flex items-center gap-1 bg-indigo-50 dark:bg-indigo-900/30 px-2 py-1 rounded-lg"
                  >
                    <span class="text-indigo-400">رهگیری:</span>
                    <span>{{ toPersianDigits(order.tracking_code) }}</span>
                  </div>
                </div>
              </td>

              <td class="p-5 text-[12px] text-slate-500 font-medium text-center">
                {{ formatJalali(order.created_at || order.date) }}
              </td>

              <td class="p-5 text-center">
                <button
                  :class="
                    expandedOrderId === order.id
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                  "
                  class="p-2 rounded-xl transition-all flex items-center justify-center mx-auto"
                  @click="toggleExpand(order.id)"
                >
                  <ChevronUpIcon v-if="expandedOrderId === order.id" class="w-5 h-5" />
                  <ChevronDownIcon v-else class="w-5 h-5" />
                </button>
              </td>
            </tr>

            <!-- ناحیه کشویی جزئیات -->
            <tr v-if="expandedOrderId === order.id">
              <td class="p-0 border-b-2 border-indigo-500" colspan="7">
                <div
                  class="bg-slate-50/50 dark:bg-slate-800/20 p-6 md:p-8 animate-in slide-in-from-top-2 duration-300 shadow-inner"
                >
                  <div
                    v-if="loadingDetails"
                    class="flex flex-col items-center justify-center py-10"
                  >
                    <div
                      class="animate-spin rounded-full h-8 w-8 border-2 border-indigo-200 border-t-indigo-600 mb-4"
                    ></div>
                    <p class="text-slate-400 text-sm font-medium">در حال دریافت اطلاعات...</p>
                  </div>

                  <div v-else-if="detailedOrder" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <!-- مشخصات تحویل -->
                    <div
                      class="bg-white dark:bg-slate-900 p-6 rounded-[1.5rem] shadow-sm border border-slate-100 dark:border-slate-800"
                    >
                      <h4
                        class="text-xs font-bold text-slate-400 mb-5 tracking-widest uppercase flex items-center gap-2"
                      >
                        <MapPinIcon class="w-4 h-4 text-indigo-500" /> مشخصات تحویل
                      </h4>
                      <div class="space-y-4 text-sm">
                        <p class="flex items-center justify-between">
                          <span class="text-slate-500">تحویل گیرنده:</span>
                          <span class="font-bold text-slate-800 dark:text-slate-200">
                            {{ detailedOrder.customer?.name || detailedOrder.user?.name || '---' }}
                          </span>
                        </p>
                        <p class="flex items-center justify-between">
                          <span class="text-slate-500">شماره تماس:</span>
                          <span class="font-bold text-slate-800 dark:text-slate-200">
                            {{
                              toPersianDigits(
                                detailedOrder.customer?.phone ||
                                  detailedOrder.user?.mobile ||
                                  '---',
                              )
                            }}
                          </span>
                        </p>
                        <hr class="border-slate-100 dark:border-slate-800 my-2" />
                        <div class="flex items-start justify-between gap-4">
                          <span class="text-slate-500 shrink-0">آدرس:</span>
                          <span
                            class="font-bold text-slate-800 dark:text-slate-200 text-left text-xs leading-relaxed"
                          >
                            {{
                              detailedOrder.address?.province ||
                              detailedOrder.shipping_address?.province ||
                              ''
                            }}
                            -
                            {{
                              detailedOrder.address?.city ||
                              detailedOrder.shipping_address?.city ||
                              ''
                            }}
                            -
                            {{
                              detailedOrder.address?.full_address ||
                              detailedOrder.shipping_address?.address ||
                              'آدرس نامشخص'
                            }}
                          </span>
                        </div>
                        <p class="flex items-center justify-between">
                          <span class="text-slate-500">کد پستی:</span>
                          <span
                            class="font-bold text-slate-800 dark:text-slate-200 tracking-widest"
                          >
                            {{
                              toPersianDigits(
                                detailedOrder.address?.postal_code ||
                                  detailedOrder.shipping_address?.postal_code ||
                                  '---',
                              )
                            }}
                          </span>
                        </p>
                      </div>
                    </div>

                    <!-- سبد خرید -->
                    <div
                      class="bg-white dark:bg-slate-900 p-6 rounded-[1.5rem] shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col"
                    >
                      <h4
                        class="text-xs font-bold text-slate-400 mb-5 tracking-widest uppercase flex items-center gap-2"
                      >
                        <ShoppingBagIcon class="w-4 h-4 text-indigo-500" /> سبد خرید
                      </h4>
                      <div
                        class="flex-1 overflow-y-auto max-h-[260px] pr-2 custom-scrollbar space-y-3"
                      >
                        <div
                          v-for="item in detailedOrder.items"
                          :key="item.id"
                          class="flex gap-3 items-center bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl"
                        >
                          <!-- تصویر کالا -->
                          <div
                            class="w-12 h-12 shrink-0 rounded-lg overflow-hidden bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 flex items-center justify-center"
                          >
                            <img
                              v-if="item.product?.cover_image"
                              :alt="item.product_snapshot_name"
                              :src="item.product.cover_image"
                              class="w-full h-full object-cover"
                            />
                            <span v-else class="text-[9px] text-slate-400">بدون عکس</span>
                          </div>

                          <!-- مشخصات کالا -->
                          <div class="flex-1 min-w-0">
                            <p
                              :title="item.product_snapshot_name"
                              class="font-bold text-xs text-slate-800 dark:text-slate-200 truncate"
                            >
                              {{ item.product_snapshot_name }}
                            </p>
                            <div class="flex items-center gap-2 mt-1.5 text-[11px]">
                              <span class="text-slate-500"
                                >{{
                                  toPersianDigits(formatPrice(item.unit_price || item.price))
                                }}
                                تومان</span
                              >
                              <span class="text-slate-300 dark:text-slate-600">|</span>
                              <span class="text-indigo-600 dark:text-indigo-400 font-bold"
                                >تعداد: {{ toPersianDigits(item.quantity) }}</span
                              >
                            </div>
                          </div>

                          <!-- جمع کل این سطر -->
                          <div
                            class="text-left shrink-0 font-bold text-xs text-slate-700 dark:text-slate-300"
                          >
                            {{
                              toPersianDigits(
                                formatPrice((item.unit_price || item.price) * item.quantity),
                              )
                            }}
                            <span class="text-[9px] font-normal text-slate-400 block mt-0.5"
                              >تومان</span
                            >
                          </div>
                        </div>
                      </div>

                      <!-- جمع کل مبلغ کالاها -->
                      <div
                        class="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center"
                      >
                        <span class="text-xs font-bold text-slate-500">مبلغ کل کالاها:</span>
                        <span class="font-bold text-sm text-slate-800 dark:text-slate-200">
                          {{ toPersianDigits(formatPrice(detailedOrder.payable || 0)) }} تومان
                        </span>
                      </div>
                    </div>

                    <!-- وضعیت مالی و فیش واریزی -->
                    <div
                      class="bg-white dark:bg-slate-900 p-6 rounded-[1.5rem] shadow-sm border border-slate-100 dark:border-slate-800"
                    >
                      <h4
                        class="text-xs font-bold text-slate-400 mb-5 tracking-widest uppercase flex items-center gap-2"
                      >
                        <BanknotesIcon class="w-4 h-4 text-indigo-500" /> تراکنش و فیش واریزی
                      </h4>

                      <!-- بستن قابلیت‌ها برای سفارش لغو سیستمی -->
                      <div
                        v-if="order.status === 'expired' || detailedOrder.status === 'expired'"
                        class="h-full flex items-center justify-center"
                      >
                        <div
                          class="bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 p-4 rounded-xl text-center text-xs font-bold border border-rose-100 dark:border-rose-800/50"
                        >
                          این سفارش به دلیل عدم پرداخت در زمان مقرر، به صورت سیستمی لغو شده است و
                          قابل ویرایش نمی‌باشد.
                        </div>
                      </div>

                      <div
                        v-else-if="
                          detailedOrder.payment_status === 'pending_verification' ||
                          detailedOrder.transactions?.length
                        "
                      >
                        <!-- جزئیات کامل تراکنش -->
                        <div class="flex flex-col xl:flex-row items-start gap-5 mb-6">
                          <!-- بخش عکس فیش (در صورت وجود) -->
                          <div
                            v-if="receiptImage"
                            class="w-24 h-24 shrink-0 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 relative group cursor-pointer shadow-sm"
                            @click="openImage(receiptImage)"
                          >
                            <img
                              :src="receiptImage"
                              alt="فیش"
                              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                          <div
                            v-else
                            class="w-24 h-24 shrink-0 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 border border-dashed border-slate-200 dark:border-slate-700 text-[10px] font-bold"
                          >
                            بدون فیش
                          </div>

                          <!-- لیست اطلاعات تراکنش -->
                          <div class="flex-1 w-full space-y-3 text-xs">
                            <div
                              class="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-2"
                            >
                              <span class="text-slate-500">مبلغ پرداخت:</span>
                              <span
                                class="font-bold text-emerald-600 dark:text-emerald-400 text-sm"
                              >
                                {{ toPersianDigits(formatPrice(latestTransaction?.amount)) }} تومان
                              </span>
                            </div>

                            <div
                              v-if="latestTransaction?.gateway"
                              class="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-2"
                            >
                              <span class="text-slate-500">روش/درگاه:</span>
                              <span class="font-bold text-slate-700 dark:text-slate-300">
                                {{
                                  latestTransaction.gateway === 'transfer'
                                    ? 'فیش بانکی'
                                    : latestTransaction.gateway
                                }}
                              </span>
                            </div>

                            <div
                              v-if="latestTransaction?.tracking_code"
                              class="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-2"
                            >
                              <span class="text-slate-500">کد پیگیری:</span>
                              <span
                                class="font-bold text-slate-800 dark:text-slate-200 tracking-widest"
                              >
                                {{ toPersianDigits(latestTransaction.tracking_code) }}
                              </span>
                            </div>

                            <div
                              v-if="latestTransaction?.reference_id"
                              class="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-2"
                            >
                              <span class="text-slate-500">شماره مرجع:</span>
                              <span
                                class="font-bold text-slate-800 dark:text-slate-200 tracking-widest"
                              >
                                {{ toPersianDigits(latestTransaction.reference_id) }}
                              </span>
                            </div>

                            <div
                              v-if="latestTransaction?.created_at"
                              class="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-2"
                            >
                              <span class="text-slate-500">تاریخ تراکنش:</span>
                              <span class="font-bold text-slate-700 dark:text-slate-300">
                                {{ formatJalali(latestTransaction.created_at) }}
                              </span>
                            </div>

                            <!-- توضیحات تراکنش -->
                            <div v-if="latestTransaction?.description" class="pt-1">
                              <span class="text-slate-500 block mb-1.5">توضیحات:</span>
                              <div
                                class="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg text-slate-700 dark:text-slate-300 leading-relaxed font-medium"
                              >
                                {{ latestTransaction.description }}
                              </div>
                            </div>
                          </div>
                        </div>

                        <!-- دکمه‌های تایید و رد فیش -->
                        <div>
                          <div
                            v-if="
                              ['pending_verification', 'pending'].includes(
                                detailedOrder.payment_status,
                              )
                            "
                            class="flex gap-2"
                          >
                            <button
                              class="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white py-2.5 rounded-xl font-bold text-sm shadow-sm transition-colors"
                              @click="verifyReceipt('approve')"
                            >
                              تایید فیش / تراکنش
                            </button>
                            <button
                              class="flex-1 bg-rose-500 hover:bg-rose-600 text-white py-2.5 rounded-xl font-bold text-sm shadow-sm transition-colors"
                              @click="verifyReceipt('reject')"
                            >
                              رد تراکنش و لغو سفارش
                            </button>
                          </div>
                          <div
                            v-else-if="detailedOrder.payment_status === 'paid'"
                            class="flex flex-col gap-2"
                          >
                            <div
                              class="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 py-2.5 rounded-xl text-center text-xs font-bold border border-emerald-100 dark:border-emerald-800/50 flex items-center justify-center gap-2"
                            >
                              <span>✅</span>
                              تراکنش با موفقیت تایید شده است
                            </div>
                            <!-- دکمه لغو تایید فقط برای ادمین جهت احتیاط -->
                            <button
                              class="w-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 text-xs font-medium mt-1 transition-colors"
                              @click="verifyReceipt('pending')"
                            >
                              بازگرداندن وضعیت به در حال بررسی
                            </button>
                          </div>
                        </div>
                      </div>

                      <!-- حالت بدون تراکنش -->
                      <div v-else class="h-full flex items-center justify-center">
                        <div class="text-center">
                          <div
                            class="bg-slate-50 dark:bg-slate-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3"
                          >
                            <BanknotesIcon class="w-8 h-8 text-slate-300 dark:text-slate-600" />
                          </div>
                          <p class="text-slate-500 dark:text-slate-400 text-sm font-medium">
                            هیچ تراکنشی ثبت نشده است
                          </p>
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

    <!-- Tracking Code Modal -->
    <div
      v-if="showTrackingModal"
      class="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in"
    >
      <div
        class="bg-white dark:bg-slate-900 w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl animate-in zoom-in-95 duration-300"
      >
        <h3 class="text-lg font-bold text-slate-800 dark:text-white mb-4">ثبت کد رهگیری پستی</h3>
        <p class="text-sm text-slate-500 mb-6 leading-relaxed">
          برای تغییر وضعیت به «ارسال شده»، لطفاً کد رهگیری را وارد نمایید:
        </p>
        <input
          v-model="trackingCode"
          class="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 text-center font-bold tracking-widest focus:ring-2 focus:ring-indigo-500 mb-6 text-slate-800 dark:text-white transition-all"
          placeholder="مثلاً: 123456789012345678901234"
          type="text"
        />
        <div class="flex gap-3">
          <button
            class="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-2xl font-bold shadow-lg"
            @click="submitStatusUpdate"
          >
            تایید و ثبت
          </button>
          <button
            class="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 py-3 rounded-2xl font-bold"
            @click="showTrackingModal = false"
          >
            انصراف
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useNotificationStore } from '@/stores/notification'
import { useConfirmStore } from '@/stores/confirm'

import {
  getAdminOrderByIdApi,
  getAdminOrdersApi,
  updateOrderStatusApi,
  verifyOrderReceiptApi,
} from '@/api/adminOrderApi'
import {
  BanknotesIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  MagnifyingGlassIcon,
  MapPinIcon,
  ShoppingBagIcon,
} from '@heroicons/vue/24/outline'

const confirmDialog = useConfirmStore()
const notify = useNotificationStore()
const orders = ref([])
const loading = ref(true)
const search = ref('')

const expandedOrderId = ref(null)
const detailedOrder = ref(null)
const loadingDetails = ref(false)

const showTrackingModal = ref(false)
const trackingCode = ref('')
const pendingStatusUpdate = ref(null)

const latestTransaction = computed(() => {
  if (!detailedOrder.value?.transactions || detailedOrder.value.transactions.length === 0)
    return null
  return detailedOrder.value.transactions[detailedOrder.value.transactions.length - 1]
})

const receiptImage = computed(() => {
  if (!latestTransaction.value || !latestTransaction.value.media) return null
  const media = latestTransaction.value.media.find((m) => m.collection_name === 'receipt')
  return media ? media.original_url : null
})

const fetchOrders = async () => {
  try {
    loading.value = true
    const res = await getAdminOrdersApi({ search: search.value })
    orders.value = res.data.data || []
  } catch (err) {
    console.error('خطا در بارگذاری لیست:', err)
    notify.error('خطا در بارگذاری لیست:', err)
  } finally {
    loading.value = false
  }
}

const toggleExpand = async (orderId) => {
  if (expandedOrderId.value === orderId) {
    expandedOrderId.value = null
    detailedOrder.value = null
    return
  }
  expandedOrderId.value = orderId
  loadingDetails.value = true
  try {
    const res = await getAdminOrderByIdApi(orderId)
    detailedOrder.value = res.data.data
  } catch (error) {
    console.error('خطا در بارگذاری جزئیات')
    notify.error('خطا در بارگذاری جزئیات')
    expandedOrderId.value = null
  } finally {
    loadingDetails.value = false
  }
}

// اصلاح ۱: دریافت صحیح order و newStatus و مدیریت مودال رهگیری
const handleStatusChange = (order, event) => {
  const newStatus = event.target.value
  let codeToUpdate = order.tracking_code

  // باز کردن مودال کد رهگیری برای وضعیت ارسال شده
  if (newStatus === 'shipped') {
    pendingStatusUpdate.value = { orderId: order.id, status: newStatus }
    trackingCode.value = order.tracking_code || ''
    showTrackingModal.value = true
    return
  }

  // لیست وضعیت‌هایی که کد رهگیری در آن‌ها بی‌معنی است و باید پاک شود
  const statusesWithoutTracking = [
    'pending_payment',
    'pending_review',
    'processing',
    'cancelled',
    'failed',
    'returned',
  ]

  if (statusesWithoutTracking.includes(newStatus)) {
    codeToUpdate = null
  }

  updateStatus(order.id, newStatus, codeToUpdate)
}

const submitStatusUpdate = () => {
  if (pendingStatusUpdate.value) {
    updateStatus(
      pendingStatusUpdate.value.orderId,
      pendingStatusUpdate.value.status,
      trackingCode.value,
    )
    showTrackingModal.value = false
  }
}

const updateStatus = async (orderId, status, code = null) => {
  try {
    const res = await updateOrderStatusApi(orderId, { status: status, tracking_code: code })
    if (res.data.message) {
      notify.success(res.data.message)
    } else {
      notify.success('وضعیت سفارش بروزرسانی شد.')
    }

    fetchOrders()
  } catch (e) {
    console.error('خطا در بروزرسانی:', e)
    notify.error('خطا در بروزرسانی:', e)
  }
}

// اصلاح ۲: استفاده از رشته 'cancelled' و null برای لغو دستی سفارش
const verifyReceipt = async (action) => {
  if (!detailedOrder.value) return
  let actionText =
    action === 'approve'
      ? 'تایید فیش'
      : action === 'reject'
        ? 'رد فیش و لغو سفارش'
        : 'بازگرداندن به بررسی'

  // if (!confirm(`آیا از ${actionText} مطمئن هستید؟`)) return
  const isConfirmed = await confirmDialog.ask({
    title: action === 'reject' ? 'هشدار لغو سفارش' : 'تایید عملیات',
    message: `آیا از ${actionText} مطمئن هستید؟`,
    type: action === 'reject' ? 'danger' : 'warning',
    confirmText: 'بله، مطمئنم',
    cancelText: 'خیر',
  })
  if (!isConfirmed) return
  try {
    // مرحله اول: اعمال وضعیت تراکنش
    const res = await verifyOrderReceiptApi(detailedOrder.value.id, { action })

    // مرحله دوم: اگر اکشن reject بود، سفارش هم لغو (حالت cancelled) شود
    if (action === 'reject') {
      await updateOrderStatusApi(detailedOrder.value.id, {
        status: 'cancelled',
        tracking_code: null,
      })
    }
    if (res.data.message) {
      notify.success(res.data.message)
    } else {
      notify.success('انجام شد')
    }
    fetchOrders()
    const detailRes = await getAdminOrderByIdApi(detailedOrder.value.id)
    detailedOrder.value = detailRes.data.data
  } catch (e) {
    notify.error('خطا در عملیات.')
  }
}

const getPaymentStatusText = (status) => {
  const statuses = {
    pending: 'در انتظار پرداخت',
    pending_verification: 'در حال بررسی فیش',
    paid: 'پرداخت موفق',
    failed: 'پرداخت ناموفق',
    canceled: 'لغو شده',
    expired: 'لغو سیستمی',
  }
  return statuses[status] || 'نامشخص'
}

const paymentStatusBadge = (status) => {
  const base = 'px-3 py-1.5 rounded-xl text-[10px] font-bold inline-block text-center '
  switch (status) {
    case 'paid':
      return base + 'bg-emerald-100 text-emerald-700'
    case 'pending_verification':
      return base + 'bg-amber-100 text-amber-700 animate-pulse'
    case 'pending':
      return base + 'bg-slate-100 text-slate-700'
    case 'failed':
      return base + 'bg-rose-100 text-rose-700'
    case 'expired':
      return base + 'bg-slate-200 text-slate-500'
    default:
      return base + 'bg-gray-100 text-gray-500'
  }
}

// اصلاح ۳: تنظیم استایل‌های رنگی بر اساس مقادیر Enum جدید
const statusClasses = (statusValue) => {
  const base = 'w-full '
  switch (statusValue) {
    case 'pending_payment':
    case 'pending_review':
      return base + 'bg-amber-50 text-amber-600'
    case 'processing':
      return base + 'bg-blue-50 text-blue-600'
    case 'shipped':
      return base + 'bg-indigo-50 text-indigo-600'
    case 'delivered':
      return base + 'bg-emerald-50 text-emerald-600'
    case 'cancelled':
    case 'returned':
    case 'failed':
      return base + 'bg-rose-50 text-rose-600'
    default:
      return base + 'bg-slate-50 text-slate-600'
  }
}

const toPersianDigits = (str) => {
  if (!str && str !== 0) return '۰'
  return str.toString().replace(/\d/g, (x) => '۰۱۲۳۴۵۶۷۸۹'[x])
}

const formatPrice = (val) => {
  if (!val && val !== 0) return '۰'
  return new Intl.NumberFormat('fa-IR').format(val)
}

const formatJalali = (dateStr) => {
  if (!dateStr) return '---'
  try {
    const date = new Date(dateStr)
    return new Intl.DateTimeFormat('fa-IR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date)
  } catch (e) {
    return dateStr
  }
}

const openImage = (url) => window.open(url, '_blank')

let searchTimeout
const debounceSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(fetchOrders, 500)
}

onMounted(fetchOrders)
</script>

<style scoped>
.font-vazir {
  font-family: 'Vazir', 'Vazir', sans-serif;
}
.custom-scrollbar::-webkit-scrollbar {
  width: 5px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 10px;
}
.dark .custom-scrollbar::-webkit-scrollbar-thumb {
  background: #475569;
}
</style>
