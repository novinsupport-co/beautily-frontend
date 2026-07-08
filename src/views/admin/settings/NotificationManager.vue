<template>
  <div class="admin-notifications min-h-screen font-vazir bg-[#F8FAFC] p-4 md:p-8">
    <!-- هدر صفحه -->
    <div class="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h2 class="text-2xl font-bold text-[#1E293B] flex items-center gap-2">
          <svg
            class="h-7 w-7 text-[#2563EB]"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          سیستم مدیریت نوتیفیکیشن‌ها
        </h2>
        <p class="text-[#475569] text-sm mt-1">
          مدیریت رویدادهای سیستمی و الگوهای ارسال پیامک، ایمیل و تلگرام
        </p>
      </div>
    </div>

    <!-- تب‌های ناوبری -->
    <div
      class="mb-6 bg-white p-1.5 rounded-xl shadow-sm border border-gray-200 inline-flex w-full md:w-auto"
    >
      <button
        :class="[
          activeTab === 'events'
            ? 'bg-[#F8FAFC] text-[#2563EB] shadow-sm font-bold border-gray-100'
            : 'text-[#475569] hover:text-[#1E293B] hover:bg-gray-50 border-transparent font-medium',
          'flex-1 md:flex-none px-6 py-2.5 rounded-lg text-sm transition-all border',
        ]"
        @click="activeTab = 'events'"
      >
        ۱. مدیریت رویدادها (Events)
      </button>
      <button
        :class="[
          activeTab === 'templates'
            ? 'bg-[#F8FAFC] text-[#2563EB] shadow-sm font-bold border-gray-100'
            : 'text-[#475569] hover:text-[#1E293B] hover:bg-gray-50 border-transparent font-medium',
          'flex-1 md:flex-none px-6 py-2.5 rounded-lg text-sm transition-all border',
        ]"
        @click="activeTab = 'templates'"
      >
        ۲. مدیریت قالب‌های ارسال (Templates)
      </button>
    </div>

    <div class="relative">
      <!-- لودینگ سراسری -->
      <div
        v-if="isLoadingData"
        class="absolute inset-0 bg-[#F8FAFC]/80 backdrop-blur-sm flex items-center justify-center z-20 rounded-xl"
      >
        <div
          class="flex items-center gap-3 bg-white px-6 py-3 rounded-xl shadow-sm border border-gray-100 text-[#2563EB] font-bold"
        >
          <svg
            class="w-6 h-6 animate-spin"
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
          در حال بارگذاری اطلاعات...
        </div>
      </div>

      <!-- ========================================== -->
      <!-- تب اول: مدیریت رویدادها -->
      <!-- ========================================== -->
      <div v-show="activeTab === 'events'" class="space-y-6">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- فرم ثبت/ویرایش رویداد -->
          <section
            class="lg:col-span-1 bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:border-[#2563EB]/30 transition-colors duration-300 h-fit"
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
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                  />
                </svg>
              </div>
              <div>
                <h3 class="text-lg font-bold text-[#1E293B]">
                  {{ editingEventId ? 'ویرایش رویداد' : 'تعریف رویداد جدید' }}
                </h3>
                <p class="text-xs text-[#475569] mt-0.5">مشخصات رویداد سیستمی را وارد کنید</p>
              </div>
            </div>

            <form class="space-y-5" @submit.prevent="submitEventForm">
              <div>
                <label class="block text-sm font-semibold text-[#475569] mb-2"
                  >عنوان (مثال: ثبت نام کاربر) <span class="text-red-500">*</span></label
                >
                <input
                  v-model="eventForm.title"
                  class="w-full bg-[#F8FAFC] border border-gray-200 text-[#1E293B] rounded-lg px-4 py-2.5 focus:bg-white focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 transition-all outline-none"
                  required
                  type="text"
                />
              </div>
              <div>
                <label class="block text-sm font-semibold text-[#475569] mb-2"
                  >کد سیستمی <span class="text-red-500">*</span></label
                >
                <input
                  v-model="eventForm.code"
                  class="w-full bg-[#F8FAFC] border border-gray-200 text-[#1E293B] rounded-lg px-4 py-2.5 uppercase font-mono text-sm focus:bg-white focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 transition-all outline-none"
                  dir="ltr"
                  placeholder="USER_REGISTER"
                  required
                  type="text"
                />
              </div>
              <div>
                <label class="block text-sm font-semibold text-[#475569] mb-2"
                  >متغیرهای مجاز (با کاما جدا کنید)</label
                >
                <input
                  v-model="eventForm.variablesString"
                  class="w-full bg-[#F8FAFC] border border-gray-200 text-[#1E293B] rounded-lg px-4 py-2.5 font-mono text-sm focus:bg-white focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 transition-all outline-none"
                  dir="ltr"
                  placeholder="user_name, verify_code"
                  type="text"
                />
                <p class="text-xs text-gray-500 mt-1.5 font-medium">
                  این متغیرها در بک‌اند به NMS پاس داده می‌شوند.
                </p>
              </div>

              <div class="flex gap-3 pt-2">
                <button
                  :disabled="isSubmittingEvent"
                  class="flex-1 flex justify-center items-center gap-2 bg-[#2563EB] hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg shadow-sm transition-all duration-200 disabled:opacity-70"
                  type="submit"
                >
                  {{
                    isSubmittingEvent
                      ? 'در حال ثبت...'
                      : editingEventId
                        ? 'بروزرسانی'
                        : 'ثبت رویداد'
                  }}
                </button>
                <button
                  v-if="editingEventId"
                  class="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2.5 px-4 rounded-lg transition-all"
                  type="button"
                  @click="cancelEditEvent"
                >
                  انصراف
                </button>
              </div>
            </form>
          </section>

          <!-- لیست رویدادها -->
          <section
            class="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:border-[#2563EB]/30 transition-colors duration-300"
          >
            <div class="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
              <div class="bg-purple-50 p-2 rounded-lg text-purple-600">
                <svg
                  class="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4 6h16M4 10h16M4 14h16M4 18h16"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                  />
                </svg>
              </div>
              <div>
                <h3 class="text-lg font-bold text-[#1E293B]">رویدادهای ثبت شده</h3>
                <p class="text-xs text-[#475569] mt-0.5">لیست رویدادهای موجود در سیستم</p>
              </div>
            </div>

            <div class="border border-gray-100 rounded-xl overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200 text-sm">
                <thead class="bg-[#F8FAFC]">
                  <tr>
                    <th class="px-4 py-3 text-right font-semibold text-[#475569]">عنوان</th>
                    <th class="px-4 py-3 text-right font-semibold text-[#475569]">کد سیستمی</th>
                    <th class="px-4 py-3 text-right font-semibold text-[#475569]">متغیرها</th>
                    <th class="px-4 py-3 text-center font-semibold text-[#475569]">عملیات</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-100 bg-white">
                  <tr
                    v-for="event in dbEvents"
                    :key="event.id"
                    :class="{ 'bg-blue-50/50': editingEventId === event.id }"
                    class="hover:bg-gray-50 transition-colors"
                  >
                    <td class="px-4 py-3 font-medium text-[#1E293B]">{{ event.title }}</td>
                    <td class="px-4 py-3 font-mono text-[#2563EB] text-xs" dir="ltr">
                      {{ event.code }}
                    </td>
                    <td class="px-4 py-3 text-[#475569] font-mono text-xs" dir="ltr">
                      <div class="flex flex-wrap gap-1">
                        <span
                          v-for="v in event.available_variables"
                          :key="v"
                          class="bg-gray-100 px-1.5 py-0.5 rounded"
                          >{{ v }}</span
                        >
                        <span v-if="!event.available_variables?.length" class="text-gray-400"
                          >بدون متغیر</span
                        >
                      </div>
                    </td>
                    <td class="px-4 py-3 text-center">
                      <div class="flex items-center justify-center gap-3">
                        <button
                          class="text-[#2563EB] hover:text-blue-800 font-medium transition-colors"
                          @click="editEvent(event)"
                        >
                          ویرایش
                        </button>
                        <button
                          class="text-red-500 hover:text-red-700 font-medium transition-colors"
                          @click="deleteEvent(event.id)"
                        >
                          حذف
                        </button>
                      </div>
                    </td>
                  </tr>
                  <tr v-if="!dbEvents?.length">
                    <td class="px-4 py-10 text-center text-gray-500 font-medium" colspan="4">
                      هیچ رویدادی ثبت نشده است.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>

      <!-- ========================================== -->
      <!-- تب دوم: مدیریت قالب‌ها -->
      <!-- ========================================== -->
      <div v-show="activeTab === 'templates'" class="space-y-6">
        <!-- فرم ثبت/ویرایش قالب -->
        <section
          class="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:border-[#2563EB]/30 transition-colors duration-300"
        >
          <div class="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
            <div class="bg-emerald-50 p-2 rounded-lg text-emerald-600">
              <svg
                class="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                />
              </svg>
            </div>
            <div>
              <h3 class="text-lg font-bold text-[#1E293B]">
                {{ editingTemplateId ? 'ویرایش قالب موجود' : 'تعریف قالب جدید' }}
              </h3>
              <p class="text-xs text-[#475569] mt-0.5">
                پیکربندی متن و الگوهای ارسالی برای رویدادها
              </p>
            </div>
          </div>

          <form class="space-y-6" @submit.prevent="submitTemplateForm">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label class="block text-sm font-semibold text-[#475569] mb-2"
                  >رویداد متصل <span class="text-red-500">*</span></label
                >
                <select
                  v-model="templateForm.event_id"
                  class="w-full bg-[#F8FAFC] border border-gray-200 text-[#1E293B] rounded-lg px-4 py-2.5 focus:bg-white focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 transition-all outline-none"
                  required
                >
                  <option disabled value="">انتخاب رویداد...</option>
                  <option v-for="event in dbEvents" :key="event.id" :value="event.id">
                    {{ event.title }} ({{ event.code }})
                  </option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-semibold text-[#475569] mb-2"
                  >کانال ارسال <span class="text-red-500">*</span></label
                >
                <select
                  v-model="templateForm.channel"
                  class="w-full bg-[#F8FAFC] border border-gray-200 text-[#1E293B] rounded-lg px-4 py-2.5 focus:bg-white focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 transition-all outline-none"
                >
                  <option value="sms">پیامک (SMS)</option>
                  <option value="email">ایمیل (Email)</option>
                  <option value="telegram">تلگرام (Telegram)</option>
                </select>
              </div>

              <!-- فرستنده داینامیک بر اساس کانال -->
              <div>
                <label class="block text-sm font-semibold text-[#475569] mb-2">
                  {{
                    templateForm.channel === 'sms'
                      ? 'شماره خط فرستنده'
                      : templateForm.channel === 'email'
                        ? 'انتخاب ایمیل فرستنده'
                        : 'ربات تلگرام فرستنده'
                  }}
                  <span class="text-red-500">*</span>
                </label>

                <input
                  v-if="templateForm.channel === 'sms'"
                  v-model="templateForm.sender_account"
                  class="w-full bg-[#F8FAFC] border border-gray-200 text-[#1E293B] rounded-lg px-4 py-2.5 focus:bg-white focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 transition-all outline-none font-mono"
                  dir="ltr"
                  required
                  type="text"
                />

                <select
                  v-else-if="templateForm.channel === 'email'"
                  v-model="templateForm.sender_account"
                  class="w-full bg-[#F8FAFC] border border-gray-200 text-[#1E293B] rounded-lg px-4 py-2.5 focus:bg-white focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 transition-all outline-none font-mono"
                  dir="ltr"
                  required
                >
                  <option disabled value="">یک ایمیل انتخاب کنید...</option>
                  <!-- نمایش ایمیل کامل، اما ذخیره فرمت کوتاه سازگار با بک‌اند -->
                  <option
                    v-for="email in systemSettings.emails"
                    :key="email"
                    :value="email.split('@')[0]"
                  >
                    {{ email }}
                  </option>
                </select>

                <select
                  v-else-if="templateForm.channel === 'telegram'"
                  v-model="templateForm.sender_account"
                  class="w-full bg-[#F8FAFC] border border-gray-200 text-[#1E293B] rounded-lg px-4 py-2.5 focus:bg-white focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 transition-all outline-none font-mono"
                  dir="ltr"
                  required
                >
                  <option disabled value="">یک ربات انتخاب کنید...</option>
                  <option v-for="bot in systemSettings.telegramBots" :key="bot" :value="bot">
                    {{ bot }}
                  </option>
                </select>
              </div>
            </div>

            <!-- بخش اختصاصی پیامک (Mapping) -->
            <template v-if="templateForm.channel === 'sms'">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-semibold text-[#475569] mb-2"
                    >کد پترن (IPPanel) <span class="text-red-500">*</span></label
                  >
                  <input
                    v-model="templateForm.provider_template_code"
                    class="w-full bg-[#F8FAFC] border border-gray-200 text-[#1E293B] rounded-lg px-4 py-2.5 focus:bg-white focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 transition-all outline-none font-mono"
                    dir="ltr"
                    placeholder="pt-12345"
                    required
                    type="text"
                  />
                </div>
              </div>

              <div class="bg-[#F8FAFC] p-5 rounded-xl border border-gray-200">
                <div class="flex justify-between items-center mb-4">
                  <h3 class="text-sm font-bold text-[#1E293B]">اتصال متغیرها (Mapping)</h3>
                  <button
                    class="text-sm text-[#2563EB] hover:text-blue-800 font-bold flex items-center gap-1"
                    type="button"
                    @click="addMappingRow"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                      ></path>
                    </svg>
                    افزودن متغیر
                  </button>
                </div>
                <div
                  v-for="(map, index) in mappingArray"
                  :key="index"
                  class="flex flex-wrap md:flex-nowrap gap-4 mb-3 items-end"
                >
                  <div class="flex-1 w-full">
                    <label class="block text-xs font-semibold text-[#475569] mb-1.5"
                      >متغیر پترن پیامک</label
                    >
                    <input
                      v-model="map.providerKey"
                      class="w-full bg-white border border-gray-200 text-[#1E293B] rounded-lg px-3 py-2 focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 transition-all outline-none text-sm font-mono"
                      dir="ltr"
                      type="text"
                    />
                  </div>
                  <div class="flex-1 w-full">
                    <label class="block text-xs font-semibold text-[#475569] mb-1.5"
                      >متغیر سیستم ما</label
                    >
                    <select
                      v-model="map.systemKey"
                      class="w-full bg-white border border-gray-200 text-[#1E293B] rounded-lg px-3 py-2 focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 transition-all outline-none text-sm font-mono"
                      dir="ltr"
                    >
                      <option disabled value="">انتخاب کنید...</option>
                      <option
                        v-for="v in getAvailableVariablesForSelectedEvent()"
                        :key="v"
                        :value="v"
                      >
                        {{ v }}
                      </option>
                    </select>
                  </div>
                  <button
                    class="bg-red-50 text-red-500 hover:bg-red-100 p-2 rounded-lg transition-colors mb-0.5"
                    type="button"
                    @click="removeMappingRow(index)"
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
                </div>
                <p v-if="!mappingArray.length" class="text-xs text-gray-500 text-center py-2">
                  موردی یافت نشد. برای افزودن کلیک کنید.
                </p>
              </div>
            </template>

            <!-- بخش اختصاصی ایمیل و تلگرام (Subject & Body داینامیک) -->
            <template v-else>
              <!-- متغیرهای در دسترس برای راهنمایی -->
              <div
                v-if="templateForm.event_id"
                class="bg-blue-50/50 border border-blue-100 p-4 rounded-xl text-sm text-[#1E293B]"
              >
                <strong class="text-[#2563EB] block mb-2">متغیرهای مجاز برای استفاده:</strong>
                <span class="text-[#475569] text-xs">
                  <!-- اضافه شدن v-pre برای جلوگیری از خطای Vue -->
                  می‌توانید به صورت <code v-pre>{{ نام_متغیر }}</code> در متن و عنوان استفاده کنید.
                </span>
                <div class="mt-3 flex flex-wrap gap-2">
                  <span
                    v-for="v in getAvailableVariablesForSelectedEvent()"
                    :key="v"
                    class="bg-white border border-blue-100 text-[#2563EB] px-2.5 py-1 rounded-md font-mono text-xs shadow-sm"
                    dir="ltr"
                    v-text="'{{ ' + v + ' }}'"
                  >
                  </span>

                  <span
                    v-if="!getAvailableVariablesForSelectedEvent().length"
                    class="text-gray-400 text-xs"
                  >
                    متغیری برای این رویداد تعریف نشده است.
                  </span>
                </div>
              </div>

              <div>
                <label class="block text-sm font-semibold text-[#475569] mb-2"
                  >عنوان پیام (Subject) <span class="text-red-500">*</span></label
                >
                <input
                  v-model="templateForm.subject"
                  class="w-full bg-[#F8FAFC] border border-gray-200 text-[#1E293B] rounded-lg px-4 py-2.5 focus:bg-white focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 transition-all outline-none"
                  placeholder="مثال: خوش آمدید {user_name} عزیز"
                  required
                  type="text"
                />
              </div>

              <div>
                <label
                  class="block text-sm font-semibold text-[#475569] mb-2 flex items-center justify-between"
                >
                  <span>متن پیام (Body) <span class="text-red-500">*</span></span>
                  <span class="text-xs text-emerald-600 font-normal bg-emerald-50 px-2 py-1 rounded"
                    >پشتیبانی از HTML</span
                  >
                </label>
                <textarea
                  v-model="templateForm.body"
                  class="w-full bg-[#F8FAFC] border border-gray-200 text-[#1E293B] rounded-lg px-4 py-3 focus:bg-white focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 transition-all outline-none font-mono text-sm leading-relaxed"
                  dir="ltr"
                  placeholder="<p>سلام {user_name}، کد شما: <strong>{verify_code}</strong></p>"
                  required
                  rows="6"
                ></textarea>
              </div>
            </template>

            <!-- تنظیمات وضعیت و دکمه‌ها -->
            <div
              class="flex flex-col md:flex-row items-center justify-between pt-6 border-t border-gray-100 gap-4"
            >
              <div
                class="flex items-center bg-gray-50 px-4 py-2.5 rounded-lg border border-gray-200 w-full md:w-auto"
              >
                <input
                  id="is_active"
                  v-model="templateForm.is_active"
                  class="h-5 w-5 text-[#2563EB] border-gray-300 rounded focus:ring-[#2563EB]"
                  type="checkbox"
                />
                <label class="mr-3 text-sm font-bold text-[#1E293B] cursor-pointer" for="is_active"
                  >قالب فعال باشد</label
                >
              </div>
              <div class="flex gap-3 w-full md:w-auto">
                <button
                  class="flex-1 md:flex-none bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2.5 px-6 rounded-lg transition-all"
                  type="button"
                  @click="resetTemplateForm(true)"
                >
                  انصراف / جدید
                </button>
                <button
                  :disabled="isSubmittingTemplate"
                  class="flex-1 md:flex-none flex justify-center items-center gap-2 bg-[#2563EB] hover:bg-blue-700 text-white font-medium py-2.5 px-8 rounded-lg shadow-sm transition-all duration-200 disabled:opacity-70"
                  type="submit"
                >
                  {{
                    isSubmittingTemplate
                      ? 'در حال پردازش...'
                      : editingTemplateId
                        ? 'بروزرسانی قالب'
                        : 'ذخیره قالب'
                  }}
                </button>
              </div>
            </div>
          </form>
        </section>

        <!-- لیست قالب‌ها -->
        <section
          class="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:border-[#2563EB]/30 transition-colors duration-300"
        >
          <div class="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
            <div class="bg-orange-50 p-2 rounded-lg text-orange-500">
              <svg
                class="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                />
              </svg>
            </div>
            <div>
              <h3 class="text-lg font-bold text-[#1E293B]">قالب‌های ثبت شده</h3>
              <p class="text-xs text-[#475569] mt-0.5">لیست الگوهای پیام متصل به رویدادها</p>
            </div>
          </div>

          <div class="border border-gray-100 rounded-xl overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200 text-sm">
              <thead class="bg-[#F8FAFC]">
                <tr>
                  <th class="px-4 py-3 text-right font-semibold text-[#475569]">رویداد</th>
                  <th class="px-4 py-3 text-right font-semibold text-[#475569]">کانال</th>
                  <th class="px-4 py-3 text-right font-semibold text-[#475569]">فرستنده / پترن</th>
                  <th class="px-4 py-3 text-center font-semibold text-[#475569]">وضعیت</th>
                  <th class="px-4 py-3 text-center font-semibold text-[#475569]">عملیات</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100 bg-white">
                <tr
                  v-for="template in dbTemplates"
                  :key="template.id"
                  :class="{ 'bg-blue-50/50': editingTemplateId === template.id }"
                  class="hover:bg-gray-50 transition-colors"
                >
                  <td class="px-4 py-3 font-bold text-[#1E293B]">
                    {{ getEventTitle(template.event_id) }}
                  </td>
                  <td class="px-4 py-3 uppercase text-xs font-mono" dir="ltr">
                    <span class="bg-gray-100 text-gray-700 px-2 py-1 rounded-md">{{
                      template.channel
                    }}</span>
                  </td>
                  <td class="px-4 py-3 text-[#475569]">
                    <div class="text-right" dir="ltr">
                      <!-- استفاده از تابع displaySenderAccount برای نمایش صحیح -->
                      <div class="font-mono text-sm">{{ displaySenderAccount(template) }}</div>
                      <div
                        v-if="template.provider_template_code"
                        class="text-xs text-[#2563EB] mt-1 font-mono bg-blue-50 inline-block px-1.5 rounded"
                      >
                        {{ template.provider_template_code }}
                      </div>
                    </div>
                  </td>

                  <td class="px-4 py-3 text-center">
                    <span
                      :class="
                        template.is_active
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-red-100 text-red-700'
                      "
                      class="px-2.5 py-1 rounded-md text-xs font-bold"
                    >
                      {{ template.is_active ? 'فعال' : 'غیرفعال' }}
                    </span>
                  </td>
                  <td class="px-4 py-3 text-center">
                    <div class="flex items-center justify-center gap-3">
                      <button
                        class="text-[#2563EB] hover:text-blue-800 font-medium transition-colors"
                        @click="editTemplate(template)"
                      >
                        ویرایش
                      </button>
                      <button
                        class="text-red-500 hover:text-red-700 font-medium transition-colors"
                        @click="deleteTemplate(template.id)"
                      >
                        حذف
                      </button>
                    </div>
                  </td>
                </tr>
                <tr v-if="!dbTemplates?.length">
                  <td class="px-4 py-10 text-center text-gray-500 font-medium" colspan="5">
                    هیچ قالبی ثبت نشده است.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref, watch } from 'vue'
import axiosInstance from '@/lib/axios'
import { useNotificationStore } from '@/stores/notification'

// راه‌اندازی سیستم نوتیفیکیشن
const notify = useNotificationStore()

// State تب‌ها و لودینگ
const activeTab = ref('events')
const isLoadingData = ref(false)

// تنظیمات سیستم برای فرستنده‌ها
const systemSettings = reactive({
  emails: [],
  telegramBots: [],
})

// ==========================================
// بخش رویدادها (Events)
// ==========================================
const dbEvents = ref([])
const isSubmittingEvent = ref(false)
const editingEventId = ref(null)

const eventForm = reactive({
  title: '',
  code: '',
  variablesString: '',
})

// ==========================================
// بخش قالب‌ها (Templates)
// ==========================================
const dbTemplates = ref([])
const isSubmittingTemplate = ref(false)
const editingTemplateId = ref(null)
let isAutoFilling = false // فلگ برای جلوگیری از تداخل watchها

const templateForm = reactive({
  event_id: '',
  channel: 'sms',
  sender_account: '',
  provider_template_code: '',
  subject: '',
  body: '',
  is_active: true,
})
const mappingArray = ref([{ providerKey: '', systemKey: '' }])

// ==========================================
// دریافت اطلاعات در زمان لود صفحه
// ==========================================
onMounted(async () => {
  isLoadingData.value = true
  await Promise.all([fetchEvents(), fetchTemplates(), fetchSystemSenders()])
  isLoadingData.value = false
})

const fetchEvents = async () => {
  try {
    const response = await axiosInstance.get('/admin/notification-events')
    dbEvents.value = response.data.data || response.data || []
  } catch (error) {
    console.error('Error fetching events', error)
    notify.error('خطا در دریافت لیست رویدادها')
    dbEvents.value = []
  }
}

const fetchTemplates = async () => {
  try {
    const response = await axiosInstance.get('/admin/notification-templates')
    dbTemplates.value = response.data.data || response.data || []
  } catch (error) {
    console.error('Error fetching templates', error)
    notify.error('خطا در دریافت لیست قالب‌ها')
    dbTemplates.value = []
  }
}

const fetchSystemSenders = async () => {
  try {
    const res = await axiosInstance.get('/admin/notification-senders')

    if (res.data && res.data.data) {
      systemSettings.emails = res.data.data.emails || []
      systemSettings.telegramBots = res.data.data.telegramBots || []
    }
  } catch (error) {
    console.error('Error fetching system senders:', error)
    notify.error('خطا در دریافت تنظیمات فرستنده‌ها')
    systemSettings.emails = []
    systemSettings.telegramBots = []
  }
}

// ==========================================
// عملیات‌های رویداد (Events)
// ==========================================
const submitEventForm = async () => {
  isSubmittingEvent.value = true
  try {
    const variablesArray = eventForm.variablesString
      ? eventForm.variablesString
          .split(',')
          .map((v) => v.trim())
          .filter((v) => v)
      : []

    const payload = {
      title: eventForm.title,
      code: eventForm.code.toUpperCase(),
      available_variables: variablesArray,
    }

    if (editingEventId.value) {
      await axiosInstance.put(`/admin/notification-events/${editingEventId.value}`, payload)
      notify.success('رویداد با موفقیت بروزرسانی شد.')
    } else {
      await axiosInstance.post('/admin/notification-events', payload)
      notify.success('رویداد با موفقیت ثبت شد.')
    }

    cancelEditEvent()
    await fetchEvents()
  } catch (error) {
    notify.error(error.response?.data?.message || 'خطا در ذخیره رویداد.')
    console.error(error)
  } finally {
    isSubmittingEvent.value = false
  }
}

const editEvent = (event) => {
  editingEventId.value = event.id
  eventForm.title = event.title
  eventForm.code = event.code
  eventForm.variablesString = (event.available_variables || []).join(', ')
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const cancelEditEvent = () => {
  editingEventId.value = null
  eventForm.title = ''
  eventForm.code = ''
  eventForm.variablesString = ''
}

const deleteEvent = async (id) => {
  if (
    !window.confirm(
      'آیا از حذف این رویداد مطمئن هستید؟ (ممکن است قالب‌های متصل به آن نیز حذف شوند)',
    )
  )
    return

  try {
    isLoadingData.value = true
    await axiosInstance.delete(`/admin/notification-events/${id}`)
    await fetchEvents()
    notify.success('رویداد با موفقیت حذف شد.')
  } catch (error) {
    notify.error(error.response?.data?.message || 'خطا در حذف رویداد.')
    console.error(error)
  } finally {
    isLoadingData.value = false
  }
}

// ==========================================
// عملیات‌های قالب‌ها (Templates)
// ==========================================
const getAvailableVariablesForSelectedEvent = () => {
  if (!templateForm.event_id) return []
  const selectedEvent = dbEvents.value.find((e) => e.id === templateForm.event_id)
  return selectedEvent ? selectedEvent.available_variables || [] : []
}

const getEventTitle = (eventId) => {
  const event = dbEvents.value.find((e) => e.id === eventId)
  return event ? event.title : 'نامشخص'
}

const addMappingRow = () => mappingArray.value.push({ providerKey: '', systemKey: '' })
const removeMappingRow = (index) => mappingArray.value.splice(index, 1)

// ==========================================
// قابلیت Auto-fill: گوش دادن به تغییر ترکیب رویداد و کانال
// ==========================================
watch(
  [() => templateForm.event_id, () => templateForm.channel],
  ([newEventId, newChannel], [oldEventId, oldChannel]) => {
    if (isAutoFilling || !newEventId || !newChannel) return

    const existingTemplate = dbTemplates.value.find(
      (t) => t.event_id === newEventId && t.channel === newChannel,
    )

    if (existingTemplate) {
      if (editingTemplateId.value !== existingTemplate.id) {
        isAutoFilling = true
        editTemplate(existingTemplate)
        isAutoFilling = false
      }
    } else {
      if (editingTemplateId.value && oldEventId === newEventId && oldChannel === newChannel) {
        return
      }
      isAutoFilling = true
      resetTemplateForm(false)
      templateForm.event_id = newEventId
      templateForm.channel = newChannel
      isAutoFilling = false
    }
  },
)

const submitTemplateForm = async () => {
  isSubmittingTemplate.value = true

  const payload = { ...templateForm }
  if (templateForm.channel === 'sms') {
    const mappingObj = {}
    mappingArray.value.forEach((item) => {
      if (item.providerKey && item.systemKey) {
        mappingObj[item.providerKey] = item.systemKey
      }
    })
    payload.variable_mapping = Object.keys(mappingObj).length > 0 ? mappingObj : null
    payload.subject = null
    payload.body = null
  } else {
    payload.variable_mapping = null
    payload.provider_template_code = null
  }

  try {
    if (editingTemplateId.value) {
      await axiosInstance.put(`/admin/notification-templates/${editingTemplateId.value}`, payload)
      notify.success('قالب با موفقیت بروزرسانی شد.')
    } else {
      await axiosInstance.post('/admin/notification-templates', payload)
      notify.success('قالب با موفقیت ثبت شد.')
    }

    resetTemplateForm(true)
    await fetchTemplates()
  } catch (error) {
    notify.error(error.response?.data?.message || 'خطا در ذخیره قالب.')
    console.error(error)
  } finally {
    isSubmittingTemplate.value = false
  }
}

// ==========================================
// توابع کمکی برای نمایش ایمیل
// ==========================================
const displaySenderAccount = (template) => {
  if (template.channel === 'email' && template.sender_account) {
    if (template.sender_account.includes('@')) return template.sender_account

    const match = systemSettings.emails.find((e) => e.split('@')[0] === template.sender_account)
    return match || template.sender_account
  }
  return template.sender_account || ''
}

const editTemplate = (template) => {
  editingTemplateId.value = template.id
  templateForm.event_id = template.event_id
  templateForm.channel = template.channel

  let sender = template.sender_account || ''
  if (template.channel === 'email' && sender.includes('@')) {
    sender = sender.split('@')[0]
  }
  templateForm.sender_account = sender

  templateForm.provider_template_code = template.provider_template_code || ''
  templateForm.subject = template.subject || ''
  templateForm.body = template.body || ''
  templateForm.is_active = template.is_active === 1 || template.is_active === true

  if (template.channel === 'sms' && template.variable_mapping) {
    let mapObj = template.variable_mapping
    if (typeof mapObj === 'string') {
      try {
        mapObj = JSON.parse(mapObj)
      } catch (e) {
        mapObj = {}
      }
    }
    const keys = Object.keys(mapObj)
    if (keys.length > 0) {
      mappingArray.value = keys.map((key) => ({
        providerKey: key,
        systemKey: mapObj[key],
      }))
    } else {
      mappingArray.value = [{ providerKey: '', systemKey: '' }]
    }
  } else {
    mappingArray.value = [{ providerKey: '', systemKey: '' }]
  }

  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const resetTemplateForm = (fullReset = false) => {
  editingTemplateId.value = null
  templateForm.sender_account = ''
  templateForm.provider_template_code = ''
  templateForm.subject = ''
  templateForm.body = ''
  templateForm.is_active = true
  mappingArray.value = [{ providerKey: '', systemKey: '' }]

  if (fullReset) {
    templateForm.event_id = ''
    templateForm.channel = 'sms'
  }
}

const deleteTemplate = async (id) => {
  if (!window.confirm('آیا از حذف این قالب مطمئن هستید؟')) return
  try {
    isLoadingData.value = true
    await axiosInstance.delete(`/admin/notification-templates/${id}`)
    await fetchTemplates()
    resetTemplateForm(true)
    notify.success('قالب با موفقیت حذف شد.')
  } catch (error) {
    notify.error(error.response?.data?.message || 'خطا در حذف قالب.')
    console.error(error)
  } finally {
    isLoadingData.value = false
  }
}
</script>
