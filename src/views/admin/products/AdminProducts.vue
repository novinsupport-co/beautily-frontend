<template>
  <main class="min-h-screen bg-slate-50 text-slate-800 p-4 md:p-6 font-vazir dir-rtl">
    <!-- Header -->
    <header
      class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 md:mb-8 bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-slate-200/60"
    >
      <div class="flex items-center gap-4">
        <div class="p-3.5 bg-blue-50 rounded-2xl text-blue-600 shrink-0 shadow-inner">
          <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
            />
          </svg>
        </div>
        <div>
          <h1 class="text-xl md:text-2xl font-extrabold text-slate-800 tracking-tight">
            مدیریت محصولات
          </h1>
          <p class="text-sm text-slate-500 mt-1.5 font-medium">
            لیست و مدیریت تمامی کالاهای فروشگاه
          </p>
        </div>
      </div>

      <router-link
        class="inline-flex w-full md:w-auto items-center justify-center gap-2.5 px-6 py-3 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 shadow-md shadow-blue-600/20 hover:shadow-lg"
        to="/admin/products/create"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            d="M12 4v16m8-8H4"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2.5"
          />
        </svg>
        افزودن محصول جدید
      </router-link>
    </header>

    <!-- Filters -->
    <section
      class="bg-white p-5 rounded-2xl shadow-sm border border-slate-200/60 mb-6 flex flex-col md:flex-row flex-wrap items-stretch md:items-center gap-4"
    >
      <div class="relative w-full md:flex-1 md:min-w-[280px]">
        <div
          class="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-400"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
            />
          </svg>
        </div>
        <input
          v-model="filters.search"
          class="w-full pl-4 pr-11 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none placeholder:text-slate-400"
          placeholder="جستجو بر اساس نام یا کد کالا (SKU)..."
          type="text"
          @keyup.enter="fetchProducts"
        />
      </div>

      <select
        v-model="filters.category_id"
        class="w-full md:w-auto px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none md:min-w-[180px] cursor-pointer"
      >
        <option value="">همه دسته‌بندی‌ها</option>
        <option v-for="cat in categories" :key="cat.id" :value="cat.id">
          {{ cat.name }}
        </option>
      </select>

      <select
        v-model="filters.status"
        class="w-full md:w-auto px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none md:min-w-[150px] cursor-pointer"
      >
        <option value="">همه وضعیت‌ها</option>
        <option value="available">موجود</option>
        <option value="unavailable">ناموجود</option>
        <option value="preorder">پیش‌سفارش</option>
      </select>

      <div class="flex items-center gap-3 w-full md:w-auto">
        <button
          class="flex-1 md:flex-none px-6 py-3 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 focus:ring-4 focus:ring-blue-500/20 transition-all shadow-md shadow-blue-600/20"
          @click="fetchProducts"
        >
          اعمال فیلتر
        </button>
        <button
          class="flex-1 md:flex-none px-6 py-3 bg-white border border-slate-200 text-slate-600 text-sm font-bold rounded-xl hover:bg-slate-50 hover:text-slate-800 focus:ring-4 focus:ring-slate-200 transition-all"
          @click="resetFilters"
        >
          بازنشانی
        </button>
      </div>
    </section>

    <!-- Content Area -->
    <div v-if="loading" class="flex flex-col items-center justify-center py-24">
      <div
        class="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mb-5 shadow-sm"
      ></div>
      <p class="text-slate-500 font-bold animate-pulse text-sm">در حال دریافت اطلاعات محصولات...</p>
    </div>

    <div v-else>
      <div
        v-if="products.length === 0"
        class="bg-white p-10 md:p-16 rounded-2xl shadow-sm border border-slate-200/60 text-center"
      >
        <div
          class="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-5 text-slate-300 ring-8 ring-slate-50/50"
        >
          <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
            />
          </svg>
        </div>
        <h3 class="text-xl font-extrabold text-slate-700 mb-2">هیچ محصولی یافت نشد!</h3>
        <p class="text-slate-500 text-sm font-medium">
          محصولی با فیلترهای انتخابی شما مطابقت ندارد. لطفاً فیلترها را تغییر دهید.
        </p>
      </div>

      <!-- Products Table -->
      <div
        v-else
        class="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden w-full"
      >
        <div class="overflow-x-auto w-full">
          <table
            class="w-full text-right text-sm border-collapse whitespace-nowrap md:whitespace-normal"
          >
            <thead>
              <tr class="bg-slate-50/80 border-b border-slate-200 text-slate-600">
                <th class="py-4 px-4 md:px-6 w-16 text-center">جزئیات</th>
                <th class="py-4 px-4 md:px-6 font-bold min-w-[280px]">مشخصات محصول</th>
                <th class="py-4 px-4 md:px-6 font-bold min-w-[130px]">دسته‌بندی</th>
                <th class="py-4 px-4 md:px-6 font-bold min-w-[140px]">آمار و بازخورد</th>
                <th class="py-4 px-4 md:px-6 font-bold min-w-[130px]">قیمت پایه</th>
                <th class="py-4 px-4 md:px-6 font-bold text-center min-w-[110px]">موجودی کلی</th>
                <th class="py-4 px-4 md:px-6 font-bold text-left min-w-[110px]">عملیات</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <template v-for="item in products" :key="item.id">
                <!-- Main Product Row -->
                <tr class="hover:bg-slate-50/80 transition-colors duration-200 group">
                  <!-- Expand Toggle -->
                  <td class="py-4 px-4 md:px-6 text-center">
                    <button
                      class="p-2 rounded-xl hover:bg-blue-50 text-slate-400 hover:text-blue-600 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      @click="toggleRow(item.id)"
                    >
                      <svg
                        :class="expandedRows.includes(item.id) ? 'rotate-180 text-blue-600' : ''"
                        class="w-5 h-5 transform transition-transform duration-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          d="M19 9l-7 7-7-7"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2.5"
                        />
                      </svg>
                    </button>
                  </td>

                  <!-- Product Info -->
                  <td class="py-4 px-4 md:px-6">
                    <div class="flex items-center gap-3 md:gap-4">
                      <div
                        class="relative w-12 h-12 md:w-16 md:h-16 rounded-xl border border-slate-200 bg-slate-50 overflow-hidden flex-shrink-0 shadow-sm"
                      >
                        <img
                          v-if="item.images?.thumbnail?.url"
                          :alt="item.name"
                          :src="item.images.thumbnail.url"
                          class="w-full h-full object-cover"
                        />
                        <svg
                          v-else
                          class="w-6 h-6 md:w-7 md:h-7 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-slate-300"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="1.5"
                          />
                        </svg>
                      </div>
                      <div class="whitespace-normal">
                        <h3
                          class="font-bold text-slate-800 text-sm md:text-base mb-1.5 line-clamp-2 leading-tight"
                        >
                          {{ item.name }}
                        </h3>
                        <div class="flex items-center gap-2">
                          <span
                            class="text-[11px] md:text-xs text-slate-500 font-mono font-medium bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200/60"
                          >
                            SKU: {{ item.sku || '---' }}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>

                  <!-- Category -->
                  <td class="py-4 px-4 md:px-6">
                    <span
                      class="inline-flex items-center px-3 py-1.5 rounded-lg text-[11px] md:text-xs font-semibold bg-slate-100 text-slate-600 whitespace-nowrap ring-1 ring-inset ring-slate-500/10"
                    >
                      {{ item.primary_category?.name || 'بدون دسته‌بندی' }}
                    </span>
                  </td>

                  <!-- Stats & Feedbacks (New Column) -->
                  <td class="py-4 px-4 md:px-6">
                    <div class="flex flex-col gap-2">
                      <!-- Stars Rating -->
                      <div
                        :title="`امتیاز ${toPersianDigits(item.rating || 0)} از ۵`"
                        class="flex items-center gap-1.5 cursor-default"
                      >
                        <div class="flex items-center" dir="ltr">
                          <svg
                            v-for="i in 5"
                            :key="i"
                            :class="
                              i <= Math.round(item.rating || 0)
                                ? 'text-amber-400'
                                : 'text-slate-200'
                            "
                            class="w-3.5 h-3.5 fill-current"
                            viewBox="0 0 20 20"
                          >
                            <path
                              d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                            />
                          </svg>
                        </div>
                        <span class="text-[11px] font-bold text-slate-600 pt-0.5">
                          {{ toPersianDigits(item.rating || 0) }}
                        </span>
                      </div>

                      <!-- Comments & Questions Count -->
                      <div class="flex items-center gap-2">
                        <!-- Reviews Badge -->
                        <span
                          class="flex items-center gap-1 bg-blue-50/80 text-blue-600 px-2 py-0.5 rounded-md text-[10px] font-bold border border-blue-100"
                          title="تعداد نظرات تایید شده"
                        >
                          <svg
                            class="w-3 h-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                            />
                          </svg>
                          {{ toPersianDigits(item.reviews_count || 0) }}
                        </span>

                        <!-- Questions Badge -->
                        <span
                          class="flex items-center gap-1 bg-amber-50/80 text-amber-600 px-2 py-0.5 rounded-md text-[10px] font-bold border border-amber-100"
                          title="تعداد پرسش‌ها"
                        >
                          <svg
                            class="w-3 h-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                            />
                          </svg>
                          {{ toPersianDigits(item.questions_count || 0) }}
                        </span>
                      </div>
                    </div>
                  </td>

                  <!-- Price -->
                  <td class="py-4 px-4 md:px-6">
                    <div
                      v-if="item.prices?.discount"
                      class="text-[11px] md:text-xs text-rose-500 line-through mb-1 whitespace-nowrap font-medium"
                    >
                      {{ formatPrice(item.prices.base || 0) }}
                    </div>
                    <div
                      class="font-extrabold text-slate-800 whitespace-nowrap text-sm md:text-base"
                    >
                      {{ formatPrice(item.prices?.final || 0) }}
                      <span class="text-[9px] md:text-[10px] text-slate-400 font-medium mr-0.5"
                        >تومان</span
                      >
                    </div>
                  </td>

                  <!-- Total Stock -->
                  <td class="py-4 px-4 md:px-6 text-center">
                    <span
                      v-if="(item.stock?.quantity || item.stock || 0) > 0"
                      class="inline-flex items-center justify-center min-w-[60px] px-2.5 py-1.5 rounded-lg text-[11px] md:text-xs font-bold bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20 whitespace-nowrap"
                    >
                      {{ item.stock?.quantity || item.stock }} {{ item.stock?.unit || 'عدد' }}
                    </span>
                    <span
                      v-else
                      class="inline-flex items-center justify-center min-w-[60px] px-2.5 py-1.5 rounded-lg text-[11px] md:text-xs font-bold bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-600/20 whitespace-nowrap"
                    >
                      ناموجود
                    </span>
                  </td>

                  <!-- Actions -->
                  <td class="py-4 px-4 md:px-6 text-left">
                    <div class="flex items-center justify-end gap-2">
                      <router-link
                        :to="`/admin/products/${item.id}/edit`"
                        class="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all tooltip-trigger"
                        title="ویرایش محصول"
                      >
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            d="M11 5H6a2 2 0 00-2-2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                          />
                        </svg>
                      </router-link>
                      <button
                        class="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all tooltip-trigger"
                        title="حذف محصول"
                        @click="deleteProduct(item.id)"
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
                  </td>
                </tr>

                <!-- Expanded Variants Row (colspan تغییر کرد به 7) -->
                <tr v-if="expandedRows.includes(item.id)" class="bg-slate-50/50">
                  <td class="p-0 border-b border-slate-200" colspan="7">
                    <div class="px-4 py-5 md:px-8 md:py-6">
                      <div
                        class="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden"
                      >
                        <div
                          class="bg-blue-50/50 px-5 py-3.5 border-b border-blue-100/50 flex items-center gap-2.5"
                        >
                          <div class="p-1 bg-blue-100 rounded-md text-blue-600">
                            <svg
                              class="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2.5"
                              />
                            </svg>
                          </div>
                          <h4 class="text-sm font-bold text-blue-900">
                            لیست واریانت‌ها (انواع محصول)
                          </h4>
                        </div>

                        <div
                          v-if="item.variants && item.variants.length > 0"
                          class="overflow-x-auto"
                        >
                          <table class="w-full text-sm text-right whitespace-nowrap">
                            <thead
                              class="bg-white border-b border-slate-100 text-slate-500 text-xs"
                            >
                              <tr>
                                <th class="py-3.5 px-5 font-bold min-w-[200px]">ویژگی‌ها</th>
                                <th class="py-3.5 px-5 font-bold min-w-[120px]">کد کالا (SKU)</th>
                                <th class="py-3.5 px-5 font-bold min-w-[120px]">قیمت فروش</th>
                                <th class="py-3.5 px-5 font-bold text-center min-w-[100px]">
                                  موجودی انبار
                                </th>
                              </tr>
                            </thead>
                            <tbody class="divide-y divide-slate-50">
                              <tr
                                v-for="variant in item.variants"
                                :key="variant.id"
                                class="hover:bg-slate-50/80 transition-colors"
                              >
                                <!-- Attribute extraction -->
                                <td class="py-3 px-5">
                                  <div class="flex flex-wrap gap-2">
                                    <template
                                      v-if="
                                        variant.variant_attributes &&
                                        Object.keys(variant.variant_attributes).length > 0
                                      "
                                    >
                                      <span
                                        v-for="(value, key) in variant.variant_attributes"
                                        :key="key"
                                        class="inline-flex items-center px-2 py-1 rounded-lg text-[10px] md:text-xs font-bold bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-600/10 shadow-sm"
                                      >
                                        {{ key }}: {{ value }}
                                      </span>
                                    </template>
                                    <span v-else class="text-slate-400 text-xs font-medium">-</span>
                                  </div>
                                </td>
                                <!-- Variant SKU -->
                                <td class="py-3 px-5 text-slate-500 font-mono text-xs font-medium">
                                  {{ variant.sku || '-' }}
                                </td>

                                <!-- Variant Price -->
                                <td class="py-3 px-5 font-extrabold text-slate-700 text-sm">
                                  {{ formatPrice(variant.price || item.prices?.final || 0) }}
                                  <span class="text-[9px] md:text-[10px] text-slate-400 font-medium"
                                    >تومان</span
                                  >
                                </td>

                                <!-- Variant Stock -->
                                <td class="py-3 px-5 text-center">
                                  <span
                                    v-if="(variant.stock?.quantity ?? variant.stock ?? 0) > 0"
                                    class="inline-flex items-center justify-center min-w-[50px] text-emerald-700 font-bold bg-emerald-50 ring-1 ring-inset ring-emerald-600/20 px-2 py-1 rounded-md text-[11px] md:text-xs"
                                  >
                                    {{ variant.stock?.quantity ?? variant.stock }} عدد
                                  </span>
                                  <span
                                    v-else
                                    class="inline-flex items-center justify-center min-w-[50px] text-rose-700 font-bold bg-rose-50 ring-1 ring-inset ring-rose-600/20 px-2 py-1 rounded-md text-[11px] md:text-xs"
                                  >
                                    ناموجود
                                  </span>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                        <div
                          v-else
                          class="p-6 md:p-8 text-center text-sm font-medium text-slate-500 bg-slate-50/50"
                        >
                          این کالا بدون ویژگی متغیر (ساده) ثبت شده است.
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Pagination -->
      <div
        v-if="products.length > 0 && meta.last_page > 1"
        class="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-200/60"
      >
        <span class="text-sm font-medium text-slate-500">
          صفحه <span class="font-extrabold text-slate-800">{{ meta.current_page }}</span> از
          <span class="font-extrabold text-slate-800">{{ meta.last_page }}</span>
        </span>

        <div class="flex items-center gap-3 w-full sm:w-auto">
          <button
            :disabled="!meta.prev_page_url"
            class="flex-1 sm:flex-none px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 disabled:opacity-50 disabled:hover:bg-white disabled:hover:border-slate-200 disabled:hover:text-slate-600 disabled:cursor-not-allowed transition-all shadow-sm"
            @click="changePage(-1)"
          >
            صفحه قبل
          </button>
          <button
            :disabled="!meta.next_page_url"
            class="flex-1 sm:flex-none px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 disabled:opacity-50 disabled:hover:bg-white disabled:hover:border-slate-200 disabled:hover:text-slate-600 disabled:cursor-not-allowed transition-all shadow-sm"
            @click="changePage(1)"
          >
            صفحه بعد
          </button>
        </div>
      </div>
    </div>
  </main>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue'
import axios from '@/lib/axios'
import { useNotificationStore } from '@/stores/notification'

const notify = useNotificationStore()
const products = ref<any[]>([])
const categories = ref<any[]>([])
const loading = ref(false)
const expandedRows = ref<number[]>([])

const filters = reactive({
  search: '',
  category_id: '',
  status: '',
  page: 1,
  per_page: 12,
})

const meta = reactive({
  current_page: 1,
  last_page: 1,
  next_page_url: null,
  prev_page_url: null,
})

// Utilities
const formatPrice = (price: number | string) => Number(price || 0).toLocaleString('fa-IR')
const toPersianDigits = (n: number | string | undefined) =>
  n?.toString().replace(/\d/g, (x) => '۰۱۲۳۴۵۶۷۸۹'[x as any])

const toggleRow = (id: number) => {
  const index = expandedRows.value.indexOf(id)
  if (index > -1) {
    expandedRows.value.splice(index, 1)
  } else {
    expandedRows.value.push(id)
  }
}

// API Calls
const fetchCategories = async () => {
  try {
    const res = await axios.get('/admin/categories')
    categories.value = res.data?.data || []
  } catch (err) {
    notify.error('خطا در دریافت دسته‌بندی‌ها')
  }
}

const fetchProducts = async () => {
  loading.value = true
  try {
    const res = await axios.get('/admin/products', { params: filters })
    products.value = res.data?.data || []
    if (res.data?.meta) {
      Object.assign(meta, res.data.meta)
    }
  } catch (err) {
    console.error(err)
    notify.error('خطا در دریافت محصولات')
  } finally {
    loading.value = false
  }
}

const changePage = (delta: number) => {
  filters.page = Math.max(1, filters.page + delta)
  fetchProducts()
}

const resetFilters = () => {
  filters.search = ''
  filters.category_id = ''
  filters.status = ''
  filters.page = 1
  fetchProducts()
}

const deleteProduct = async (id: number) => {
  if (!confirm('آیا از حذف این محصول اطمینان دارید؟ این عمل غیرقابل بازگشت است.')) return
  try {
    await axios.delete(`/admin/products/${id}`)
    notify.success('محصول با موفقیت حذف شد')
    fetchProducts()
  } catch (err) {
    console.error(err)
    notify.error('حذف محصول با خطا مواجه شد')
  }
}

// Lifecycle
onMounted(() => {
  fetchCategories()
  fetchProducts()
})
</script>
