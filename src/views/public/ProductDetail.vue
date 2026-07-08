<template>
  <main class="min-h-screen bg-[#F9FBFC] pb-24 font-iransans text-slate-900" dir="rtl">
    <!-- Header / Breadcrumb -->
    <header class="bg-white/80 backdrop-blur-xl sticky top-0 z-50 border-b border-slate-100/60">
      <div class="max-w-[1400px] mx-auto px-6 py-4 flex justify-between items-center">
        <nav class="flex items-center gap-2 text-[10px] font-iransans-bold text-slate-400">
          <RouterLink class="hover:text-slate-900 transition-colors" to="/">خانه</RouterLink>
          <span>/</span>
          <span class="text-slate-800">{{
            product?.primary_category?.name || 'جزئیات محصول'
          }}</span>
        </nav>

        <div
          v-if="product?.brand"
          class="flex items-center gap-3 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100 shadow-sm"
        >
          <span class="text-xs font-iransans-black text-slate-900">برند محصول</span>

          <div class="flex items-center gap-2">
            <img
              v-if="product.brand.logo_url"
              :alt="product.brand.name"
              :src="product.brand.logo_url"
              class="w-8 h-8 object-contain rounded-md"
            />
            <span class="text-xs font-iransans-black text-slate-900">{{ product.brand.name }}</span>
          </div>
        </div>
      </div>
    </header>

    <section class="max-w-[1400px] mx-auto px-4 mt-8">
      <Loader v-if="loading" />

      <template v-else-if="product">
        <!-- Main Product Info Grid -->
        <div class="grid lg:grid-cols-12 gap-8 lg:gap-12">
          <!-- Right Column: Images & Short Desc -->
          <div class="lg:col-span-5">
            <div class="sticky top-28 space-y-6">
              <!-- Rating, Comments, Questions Bar -->
              <div
                class="flex items-center justify-center sm:justify-start gap-4 bg-white px-6 py-3.5 rounded-2xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.03)] border border-slate-100/80"
              >
                <!-- بخش ستاره‌ها و امتیاز -->
                <div
                  :title="`امتیاز ${toPersianDigits(product?.rating || 0)} از ۵`"
                  class="flex items-center gap-1.5 cursor-help"
                >
                  <div class="flex items-center gap-0.5" dir="ltr">
                    <svg
                      v-for="i in 5"
                      :key="i"
                      :class="
                        i <= Math.round(product?.rating || 0) ? 'text-amber-400' : 'text-slate-200'
                      "
                      class="w-4 h-4 fill-current transition-colors duration-300"
                      viewBox="0 0 20 20"
                    >
                      <path
                        d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                      />
                    </svg>
                  </div>
                  <span class="text-xs font-iransans-black pt-0.5 text-slate-700">
                    {{ toPersianDigits(product?.rating || 0) }}
                  </span>
                </div>

                <div class="w-1.5 h-1.5 bg-slate-200 rounded-full"></div>

                <!-- تعداد دیدگاه‌ها -->
                <button
                  class="text-[11px] font-iransans-bold text-slate-500 hover:text-rose-500 transition-colors"
                  @click="activeTab = 'reviews'"
                >
                  دیدگاه‌ها ({{ toPersianDigits(product?.reviews_count || 0) }})
                </button>

                <div class="w-1.5 h-1.5 bg-slate-200 rounded-full"></div>

                <!-- تعداد پرسش‌ها -->
                <button
                  class="text-[11px] font-iransans-bold text-slate-500 hover:text-rose-500 transition-colors"
                  @click="activeTab = 'questions'"
                >
                  پرسش‌ها ({{ toPersianDigits(product?.questions_count || 0) }})
                </button>
              </div>

              <!-- Main Image Box with Floating Icons -->
              <div
                class="relative aspect-square sm:aspect-[4/3] lg:aspect-square bg-gradient-to-tr from-slate-100/60 via-slate-50 to-slate-100/60 rounded-[2rem] shadow-sm border border-slate-200/50 overflow-hidden group flex items-center justify-center"
              >
                <!-- Dotted Background Pattern -->
                <div
                  class="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:24px_24px] opacity-40"
                ></div>

                <!-- Product Image -->
                <img
                  :alt="product.name"
                  :src="
                    activeImage ||
                    product?.images?.thumbnail?.urls?.large ||
                    product?.images?.thumbnail?.url
                  "
                  class="relative z-0 w-3/4 h-3/4 object-contain p-4 transition-transform duration-700 ease-out group-hover:scale-110 drop-shadow-2xl"
                />

                <!-- Discount Badge -->
                <div
                  v-if="displayDiscountPercent > 0"
                  class="absolute top-6 left-6 bg-gradient-to-r from-rose-500 to-rose-400 text-white font-iransans-black text-[11px] px-4 py-2 rounded-2xl rounded-tl-sm shadow-lg shadow-rose-500/30 z-10 flex items-center gap-1.5"
                >
                  <span>{{ toPersianDigits(displayDiscountPercent) }}٪ تخفیف</span>
                </div>

                <!-- Floating Action Buttons -->
                <div class="absolute top-6 right-6 flex flex-col gap-3 z-20">
                  <!-- Share -->
                  <button
                    class="group/btn relative w-11 h-11 bg-white/80 hover:bg-slate-900 backdrop-blur-md rounded-2xl flex items-center justify-center text-slate-500 hover:text-purple-500 transition-all duration-300 shadow-sm border border-slate-100/50"
                  >
                    <svg
                      class="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="1.8"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                    <span
                      class="absolute right-14 opacity-0 translate-x-2 group-hover/btn:translate-x-0 group-hover/btn:opacity-100 transition-all duration-300 bg-purple-500 text-white text-[10px] font-iransans-bold py-2 px-3 rounded-xl whitespace-nowrap pointer-events-none shadow-xl"
                    >
                      اشتراک‌گذاری
                    </span>
                  </button>

                  <!-- Price Chart -->
                  <button
                    class="group/btn relative w-11 h-11 bg-white/80 hover:bg-slate-900 backdrop-blur-md rounded-2xl flex items-center justify-center text-slate-500 hover:text-purple-500 transition-all duration-300 shadow-sm border border-slate-100/50"
                  >
                    <svg
                      class="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="1.8"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                    <span
                      class="absolute right-14 opacity-0 translate-x-2 group-hover/btn:translate-x-0 group-hover/btn:opacity-100 transition-all duration-300 bg-purple-500 text-white text-[10px] font-iransans-bold py-2 px-3 rounded-xl whitespace-nowrap pointer-events-none shadow-xl"
                    >
                      نمودار قیمت
                    </span>
                  </button>

                  <!-- Favorite -->
                  <button
                    :class="[
                      'group/btn relative w-11 h-11 backdrop-blur-md rounded-2xl flex items-center justify-center transition-all duration-300 shadow-sm border',
                      product?.is_favorited
                        ? 'bg-rose-50 border-rose-200 text-rose-500'
                        : 'bg-white/80 hover:bg-slate-900 border-slate-100/50 text-slate-500 hover:text-rose-500',
                    ]"
                    :disabled="isTogglingFavorite"
                    @click="handleToggleFavorite"
                  >
                    <svg
                      :class="[
                        'w-5 h-5 transition-all duration-300',
                        product?.is_favorited ? 'fill-current scale-110' : 'fill-none',
                      ]"
                      stroke="currentColor"
                      stroke-width="1.8"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                    <span
                      :class="[
                        'absolute right-14 opacity-0 translate-x-2 group-hover/btn:translate-x-0 group-hover/btn:opacity-100 transition-all duration-300 text-white text-[10px] font-iransans-bold py-2 px-3 rounded-xl whitespace-nowrap pointer-events-none shadow-xl',
                        product?.is_favorited ? 'bg-rose-500' : 'bg-slate-800',
                      ]"
                    >
                      {{
                        product?.is_favorited ? 'حذف از علاقه‌مندی‌ها' : 'افزودن به علاقه‌مندی‌ها'
                      }}
                    </span>
                  </button>
                </div>
              </div>

              <!-- Dock Style Gallery Slider -->
              <div v-if="product?.images" class="flex justify-center w-full">
                <div
                  class="bg-white/80 backdrop-blur-xl border border-slate-200/60 p-2 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex gap-2 overflow-x-auto no-scrollbar max-w-full"
                >
                  <div
                    v-for="(img, idx) in [
                      product.images.thumbnail,
                      ...(product.images.gallery || []),
                    ]"
                    :key="idx"
                    :class="
                      activeImage === (img?.urls?.large || img?.url || img)
                        ? 'ring-2 ring-slate-900 shadow-md bg-white scale-[1.02]'
                        : 'bg-slate-50 hover:bg-white hover:shadow-sm opacity-70 hover:opacity-100 border border-transparent'
                    "
                    class="relative w-16 h-16 sm:w-[72px] sm:h-[72px] flex-shrink-0 rounded-xl cursor-pointer transition-all duration-300 p-1.5 overflow-hidden group/thumb"
                    @click="activeImage = img?.urls?.large || img?.url || img"
                  >
                    <img
                      v-if="img"
                      :src="img.urls?.thumb || img.url || img"
                      class="w-full h-full object-contain transition-transform duration-500 group-hover/thumb:scale-110"
                    />
                  </div>
                </div>
              </div>

              <!-- Short Description -->
              <div
                v-if="product?.short_description"
                class="bg-white p-5 rounded-2xl shadow-sm border border-slate-100/80 relative mt-4 overflow-hidden group"
              >
                <div
                  class="absolute right-0 top-0 bottom-0 w-1.5 bg-slate-200 group-hover:bg-slate-800 transition-colors duration-500"
                ></div>
                <p
                  class="text-slate-500 font-iransans-medium leading-loose text-[13px] text-justify pl-2 pr-4"
                >
                  {{ product.short_description }}
                </p>
              </div>
            </div>
          </div>

          <!-- Left Column: Details & Add to Cart -->
          <div class="lg:col-span-7 space-y-8">
            <div class="bg-white rounded-3xl p-8 md:p-10 shadow-sm border border-slate-50">
              <!-- Title & Meta -->
              <div class="space-y-4 mb-8">
                <div class="flex items-center gap-3 text-[10px] font-iransans-bold text-slate-400">
                  <span
                    v-if="product?.status?.is_active && displayStock > 0"
                    class="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-md"
                  >
                    موجود در انبار
                  </span>
                  <span v-else class="px-3 py-1 bg-rose-50 text-rose-600 rounded-md">
                    ناموجود
                  </span>
                  <span v-if="displaySku">SKU: {{ toPersianDigits(displaySku) }}</span>
                </div>
                <h1 class="text-2xl md:text-3xl font-iransans-black text-slate-900 leading-snug">
                  {{ product?.name }}
                </h1>
              </div>

              <!-- BOX: Attributes, Guarantees & Tags -->
              <div class="bg-slate-50/50 rounded-2xl border border-slate-100 p-6 md:p-8 space-y-8">
                <!-- 2 Columns: Right (Variants) / Left (Info) -->
                <div class="grid md:grid-cols-2 gap-8 items-start">
                  <!-- Right Column: Variants Selection -->
                  <div>
                    <div v-if="availableAttributes.length > 0" class="space-y-6">
                      <div v-for="attr in availableAttributes" :key="attr.name" class="space-y-3">
                        <h4
                          class="text-[11px] font-iransans-black text-slate-400 uppercase tracking-widest"
                        >
                          انتخاب {{ attr.label }}
                        </h4>
                        <div class="flex flex-wrap gap-2">
                          <button
                            v-for="val in attr.options"
                            :key="val"
                            :class="[
                              selectedAttributes[attr.name] === val
                                ? 'bg-slate-900 text-white shadow-lg ring-2 ring-slate-900 ring-offset-2'
                                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200',
                              'px-4 py-2 rounded-xl text-xs font-iransans-bold transition-all',
                            ]"
                            @click="selectAttribute(attr.name, val)"
                          >
                            <span>{{ val }}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                    <!-- پیام در صورت نداشتن ویژگی -->
                    <div
                      v-else
                      class="text-xs text-slate-400 font-iransans-medium bg-white p-4 rounded-xl border border-slate-100 border-dashed"
                    >
                      ویژگی قابل انتخابی برای این محصول وجود ندارد.
                    </div>
                  </div>

                  <!-- Left Column: Delivery & Authenticity Cards -->
                  <div class="space-y-4">
                    <!-- Delivery Info -->
                    <div
                      class="flex items-center gap-3 bg-white p-4 rounded-xl border border-slate-100 shadow-sm text-slate-600 font-iransans-medium text-[11px] leading-relaxed"
                    >
                      <div
                        class="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center flex-shrink-0 text-emerald-500"
                      >
                        <svg
                          class="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          viewBox="0 0 24 24"
                        >
                          <path
                            d="M3 8h13l3 4v6h-4m4-6H6m4 6H3v-6h13"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                        </svg>
                      </div>
                      <span>ارسال سریع و رایگان برای خریدهای بالای ۷۰۰ هزار تومان</span>
                    </div>

                    <!-- Authenticity -->
                    <div
                      class="flex items-center gap-3 bg-white p-4 rounded-xl border border-slate-100 shadow-sm text-slate-600 font-iransans-medium text-[11px] leading-relaxed"
                    >
                      <div
                        class="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0 text-blue-500"
                      >
                        <svg
                          class="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          viewBox="0 0 24 24"
                        >
                          <path
                            d="M12 6l-8 6 8 6 8-6-8-6z"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                        </svg>
                      </div>
                      <span>ضمانت اصالت و سلامت کالا</span>
                    </div>
                  </div>
                </div>

                <!-- Bottom Row: Categories & Tags (Badge Style with Labels) -->
                <div
                  v-if="product?.categories?.length || product?.tags?.length"
                  class="border-t border-slate-200/60 pt-6 space-y-4"
                >
                  <!-- Categories -->
                  <div
                    v-if="product?.categories?.length"
                    class="flex flex-col sm:flex-row sm:items-center gap-3"
                  >
                    <span class="text-[11px] font-iransans-black text-slate-400 min-w-[70px]"
                      >دسته‌بندی:</span
                    >
                    <div class="flex flex-wrap gap-2">
                      <RouterLink
                        v-for="cat in product.categories"
                        :key="cat.id"
                        :to="{ name: 'category', params: { slug: cat.slug } }"
                        class="px-3 py-1.5 rounded-lg text-[11px] font-iransans-bold bg-sky-50 text-sky-600 hover:bg-sky-100 transition-colors border border-sky-100 shadow-sm"
                      >
                        {{ cat.name }}
                      </RouterLink>
                    </div>
                  </div>

                  <!-- Tags -->
                  <div
                    v-if="product?.tags?.length"
                    class="flex flex-col sm:flex-row sm:items-center gap-3"
                  >
                    <span class="text-[11px] font-iransans-black text-slate-400 min-w-[70px]"
                      >برچسب‌ها:</span
                    >
                    <div class="flex flex-wrap gap-2">
                      <RouterLink
                        v-for="tag in product.tags"
                        :key="tag.id"
                        :to="{ name: 'tag', params: { slug: tag.slug } }"
                        class="px-3 py-1.5 rounded-lg text-[11px] font-iransans-bold bg-amber-50 text-amber-600 hover:bg-amber-100 transition-colors border border-amber-100 shadow-sm"
                      >
                        # {{ tag.name }}
                      </RouterLink>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Price & Add to Cart Container -->
              <div
                v-if="product?.prices"
                class="mt-6 bg-white rounded-2xl p-6 md:p-8 border border-slate-100 shadow-[0_12px_40px_-12px_rgba(0,0,0,0.04)]"
              >
                <!-- Stock Indicator & Compare Button Container -->
                <div
                  class="flex flex-wrap items-center justify-between gap-4 mb-6 border-b border-slate-50 pb-6"
                >
                  <!-- Stock Indicator -->
                  <div class="flex items-center gap-4">
                    <div
                      v-if="displayStock > 0"
                      class="flex items-center gap-2 text-emerald-600 font-iransans-bold bg-emerald-50/50 px-4 py-2 rounded-xl"
                    >
                      <span class="relative flex h-3 w-3">
                        <span
                          class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"
                        ></span>
                        <span
                          class="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"
                        ></span>
                      </span>
                      <span class="text-xs"
                        >موجودی انبار: {{ toPersianDigits(displayStock) }} عدد</span
                      >
                    </div>
                    <div
                      v-else
                      class="flex items-center gap-2 text-rose-500 font-iransans-bold bg-rose-50/50 px-4 py-2 rounded-xl"
                    >
                      <span class="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                      <span class="text-xs">در حال حاضر ناموجود</span>
                    </div>
                  </div>

                  <!-- دکمه مقایسه کالا منتقل شده به اینجا -->
                  <button
                    :class="[
                      'flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-iransans-bold transition-all border',
                      compareStore.isInCompare(product.id)
                        ? 'bg-blue-50/80 text-blue-600 border-blue-100 shadow-sm'
                        : 'bg-slate-50/50 text-slate-500 border-slate-100 hover:bg-blue-50/50 hover:text-blue-600 hover:border-blue-100',
                    ]"
                    title="مقایسه کالا"
                    @click="compareStore.toggleCompare(product)"
                  >
                    <svg
                      class="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                    <span>
                      {{
                        compareStore.isInCompare(product.id) ? 'حذف از مقایسه' : 'افزودن به مقایسه'
                      }}
                    </span>
                  </button>
                </div>

                <div class="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                  <!-- Price Block -->
                  <div class="text-center md:text-right space-y-2">
                    <!-- Discount Badge & Old Price -->
                    <div
                      v-if="displayDiscountPercent > 0"
                      class="flex items-center justify-center md:justify-start gap-3 mb-1"
                    >
                      <div
                        class="text-rose-500 text-[11px] font-iransans-black bg-rose-50 px-3 py-1 rounded-lg"
                      >
                        {{ toPersianDigits(displayDiscountPercent) }}٪ تخفیف
                      </div>
                      <div
                        class="text-slate-400 text-sm font-iransans-bold line-through opacity-70"
                      >
                        {{ toPersianDigits(formatPrice(displayBasePrice)) }}
                      </div>
                    </div>

                    <!-- Final Price -->
                    <div class="flex items-baseline justify-center md:justify-start gap-2">
                      <span class="text-3xl md:text-4xl font-iransans-black text-slate-900">
                        {{ toPersianDigits(formatPrice(displayFinalPrice)) }}
                      </span>
                      <span class="text-xs font-iransans-black text-slate-400">تومان</span>
                    </div>
                  </div>

                  <!-- Quantity + Add to Cart -->
                  <div
                    class="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full md:w-auto"
                  >
                    <!-- Quantity Selector -->
                    <div
                      class="flex items-center justify-between bg-slate-50 rounded-xl border border-slate-200 p-1 shadow-sm h-[52px]"
                    >
                      <button
                        :disabled="quantity >= displayStock"
                        class="w-10 h-full flex items-center justify-center text-xl hover:text-rose-500 transition disabled:opacity-50"
                        @click="quantity < displayStock ? quantity++ : null"
                      >
                        +
                      </button>

                      <span class="w-10 text-center font-iransans-black text-sm">
                        {{ toPersianDigits(quantity) }}
                      </span>

                      <button
                        :disabled="quantity <= 1"
                        class="w-10 h-full flex items-center justify-center text-xl hover:text-rose-500 transition disabled:opacity-50"
                        @click="quantity > 1 ? quantity-- : null"
                      >
                        -
                      </button>
                    </div>

                    <!-- Add to Cart Button -->
                    <button
                      :disabled="!product?.status?.is_active || displayStock <= 0"
                      class="flex-1 sm:flex-none px-8 h-[52px] bg-rose-500 hover:bg-rose-600 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-xl font-iransans-black text-sm transition-all duration-300 shadow-lg shadow-rose-200 hover:shadow-xl flex items-center justify-center gap-2 min-w-[200px]"
                      @click="handleAddToCart"
                    >
                      <svg
                        class="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        viewBox="0 0 24 24"
                      >
                        <path
                          d="M3 3h2l.4 2M7 13h10l3-7H6.4M7 13L5.4 5M7 13l-1.5 6m10.5-6l1.5 6M9 21h0m6 0h0"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                      <span>
                        {{
                          product?.status?.call_for_price ? 'استعلام قیمت' : 'افزودن به سبد خرید'
                        }}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Section: Description & Specifications Tabs -->
        <div class="mt-12 bg-white rounded-3xl p-8 md:p-10 shadow-sm border border-slate-50">
          <!-- هدر تب‌ها -->
          <div
            class="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 bg-slate-50/70 p-2 rounded-2xl border border-slate-100"
          >
            <button
              v-for="tab in tabs"
              :key="tab.id"
              :class="
                activeTab === tab.id
                  ? 'bg-white text-rose-500 shadow-md ring-1 ring-slate-100/50 scale-[1.02]'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200/50'
              "
              class="flex flex-col lg:flex-row items-center justify-center gap-2 lg:gap-3 py-3 lg:py-4 px-2 rounded-xl transition-all duration-300 group cursor-pointer"
              @click="activeTab = tab.id"
            >
              <!-- آیکون اختصاصی هر تب -->
              <div
                :class="
                  activeTab === tab.id
                    ? 'text-rose-500'
                    : 'text-slate-400 group-hover:text-slate-600'
                "
              >
                <!-- آیکون نقد و بررسی -->
                <svg
                  v-if="tab.id === 'desc'"
                  class="w-5 h-5 lg:w-6 lg:h-6"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.8"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>

                <!-- آیکون مشخصات فنی -->
                <svg
                  v-else-if="tab.id === 'specs'"
                  class="w-5 h-5 lg:w-6 lg:h-6"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.8"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>

                <!-- آیکون نظرات کاربران -->
                <svg
                  v-else-if="tab.id === 'reviews'"
                  class="w-5 h-5 lg:w-6 lg:h-6"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.8"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>

                <!-- آیکون پرسش و پاسخ -->
                <svg
                  v-else-if="tab.id === 'questions'"
                  class="w-5 h-5 lg:w-6 lg:h-6"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.8"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>

              <!-- متن تب -->
              <span class="text-[11px] lg:text-sm font-iransans-bold">{{ tab.label }}</span>
            </button>
          </div>

          <!-- محتوای تب‌ها -->
          <div class="mt-8">
            <!-- Tab Content: Description -->
            <div v-show="activeTab === 'desc'">
              <div
                v-if="product?.long_description"
                class="prose prose-slate max-w-none font-iransans leading-loose text-slate-600 prose-headings:font-iransans-black prose-a:text-rose-500 text-sm"
                v-html="product.long_description"
              ></div>
              <div v-else class="text-center py-8 text-slate-400 font-iransans-medium text-sm">
                توضیحات تکمیلی برای این محصول ثبت نشده است.
              </div>
            </div>

            <!-- Tab Content: Technical Specs -->
            <div v-show="activeTab === 'specs'">
              <div
                v-if="product?.specifications?.length"
                class="bg-slate-50/40 border border-slate-100 rounded-2xl p-2 sm:p-4"
              >
                <ul class="space-y-1">
                  <li
                    v-for="(spec, index) in product.specifications"
                    :key="index"
                    class="flex flex-col sm:flex-row sm:items-center py-3 sm:py-4 px-4 sm:px-6 rounded-xl hover:bg-white hover:shadow-[0_2px_12px_-4px_rgba(0,0,0,0.06)] transition-all duration-300 group border border-transparent hover:border-slate-100/80"
                  >
                    <div class="sm:w-1/3 flex items-center gap-3 mb-2 sm:mb-0">
                      <div
                        class="w-2 h-2 rounded-full bg-slate-300 group-hover:bg-rose-400 group-hover:scale-110 transition-all duration-300"
                      ></div>
                      <span
                        class="text-[13px] font-iransans-bold text-slate-500 group-hover:text-slate-700 transition-colors"
                      >
                        {{ spec.key }}
                      </span>
                    </div>
                    <div
                      class="sm:w-2/3 text-[14px] font-iransans-black text-slate-800 leading-relaxed pr-5 sm:pr-0"
                    >
                      {{ spec.value }}
                    </div>
                  </li>
                </ul>
              </div>
              <div
                v-else
                class="text-center py-12 bg-slate-50/50 rounded-2xl border border-slate-100 border-dashed"
              >
                <span class="text-slate-500 font-iransans-medium text-sm"
                  >مشخصات فنی برای این محصول ثبت نشده است.</span
                >
              </div>
            </div>

            <!-- Tab Content: Reviews (New) -->
            <div v-show="activeTab === 'reviews'">
              <ProductReviewsTab v-if="product?.id" :product-id="product.id" />
            </div>

            <!-- Tab Content: Questions (New) -->
            <div v-show="activeTab === 'questions'">
              <ProductQuestionsTab v-if="product?.id" :product-id="product.id" />
            </div>
          </div>
        </div>

        <!-- Section: Related Products Slider -->
        <div v-if="product?.related_products?.length" class="mt-16 space-y-8">
          <div class="flex items-center gap-3 px-2">
            <div class="w-1.5 h-6 bg-rose-400 rounded-full"></div>
            <h3 class="text-xl font-iransans-black text-slate-900">محصولات مرتبط</h3>
          </div>

          <div class="flex overflow-x-auto gap-5 pb-8 px-2 no-scrollbar">
            <RouterLink
              v-for="related in product.related_products"
              :key="related.slug || related.id"
              :to="`/product/${related.slug || related.id}`"
              class="min-w-[260px] w-[260px] bg-white p-4 rounded-2xl border border-slate-50 shadow-sm hover:shadow-md transition-all duration-300 group"
            >
              <div class="aspect-square rounded-xl bg-[#F8F9FA] overflow-hidden mb-5 relative p-4">
                <img
                  :alt="related.name"
                  :src="related.thumbnail?.url || related.thumbnail || related.image"
                  class="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <h4
                class="font-iransans-bold text-slate-800 mb-3 line-clamp-2 text-xs leading-relaxed"
              >
                {{ related.name }}
              </h4>
              <div class="text-left flex items-baseline justify-end gap-1">
                <span class="text-lg font-iransans-black text-slate-900">
                  {{ toPersianDigits(formatPrice(related.price || related.prices?.final)) }}
                </span>
                <span class="text-[10px] text-slate-400 font-iransans-medium">تومان</span>
              </div>
            </RouterLink>
          </div>
        </div>
      </template>

      <!-- Fallback / Error state -->
      <div v-else-if="!loading && !product" class="text-center py-24 space-y-4">
        <h2 class="text-xl font-iransans-black text-slate-800">محصولی یافت نشد!</h2>
        <p class="text-sm text-slate-500 font-iransans-medium">
          ممکن است آدرس را اشتباه وارد کرده باشید یا محصول حذف شده باشد.
        </p>
        <RouterLink
          class="inline-block mt-4 px-6 py-2.5 bg-slate-900 text-white rounded-xl font-iransans-bold text-xs"
          to="/"
        >
          بازگشت به فروشگاه
        </RouterLink>
      </div>
    </section>
  </main>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useProductsStore } from '@/stores/products'
import { useCartStore } from '@/stores/cart'
import { useNotificationStore } from '@/stores/notification'
import Loader from '@/components/ui/Loader.vue'
import { useCompareStore } from '@/stores/compareStore'
import ProductReviewsTab from '@/components/public/ProductReviewsTab.vue'
import ProductQuestionsTab from '@/components/public/ProductQuestionsTab.vue'
import { toggleFavorite } from '@/api/productApi'

const route = useRoute()
const productStore = useProductsStore()
const cartStore = useCartStore()
const notify = useNotificationStore()
const compareStore = useCompareStore()
const handleCompare = () => {
  compareStore.toggleCompare(product.value)
}
// --- States ---
const activeImage = ref(null)
const quantity = ref(1)
const selectedAttributes = ref({})
const isTogglingFavorite = ref(false)

const activeTab = ref('desc')

const tabs = [
  { id: 'desc', label: 'نقد و بررسی' },
  { id: 'specs', label: 'مشخصات فنی' },
  { id: 'reviews', label: 'نظرات کاربران' },
  { id: 'questions', label: 'پرسش و پاسخ' },
]

// --- Computed Properties (Data) ---
const loading = computed(() => productStore.loading)
const product = computed(() => productStore.product)

// --- Logic: استخراج هوشمند ویژگی‌ها ---
const availableAttributes = computed(() => {
  if (!product.value?.variants?.length) return []

  const attrsMap = {}
  product.value.variants.forEach((variant) => {
    const attrs = variant.variant_attributes || variant.attributes || {}
    Object.entries(attrs).forEach(([key, value]) => {
      if (!attrsMap[key]) attrsMap[key] = new Set()
      attrsMap[key].add(value)
    })
  })

  return Object.keys(attrsMap).map((key) => ({
    name: key,
    label: key,
    options: Array.from(attrsMap[key]),
  }))
})

// --- Logic: پیدا کردن واریانتِ معادل ---
const currentVariant = computed(() => {
  if (!product.value?.variants?.length) return null

  return product.value.variants.find((variant) => {
    const attrs = variant.variant_attributes || variant.attributes || {}
    return Object.entries(selectedAttributes.value).every(([key, value]) => attrs[key] === value)
  })
})

// --- Logic: محاسبه تعداد رزرو شده در سبد خرید فعلی ---
const cartReservedQuantity = computed(() => {
  if (!product.value || !cartStore.items) return 0

  return cartStore.items.reduce((total, item) => {
    const isSameProduct = item.product_id === product.value.id
    const currentVariantId = currentVariant.value ? currentVariant.value.id : null
    const itemVariantId = item.variant_id || null
    const isSameVariant = itemVariantId === currentVariantId

    if (isSameProduct && isSameVariant) {
      return total + item.quantity
    }
    return total
  }, 0)
})

// --- Computed Properties (Dynamic Display) ---
const displaySku = computed(() => currentVariant.value?.sku || product.value?.sku)

const displayStock = computed(() => {
  let rawStock = 0
  if (currentVariant.value && currentVariant.value.stock !== undefined) {
    rawStock = currentVariant.value.stock
  } else {
    rawStock = product.value?.stock?.quantity ?? product.value?.stock ?? 0
  }
  return Math.max(rawStock - cartReservedQuantity.value, 0)
})

watch(displayStock, (newStock) => {
  if (newStock === 0) {
    quantity.value = 1
  } else if (quantity.value > newStock) {
    quantity.value = newStock
  }
})

const displayBasePrice = computed(() => {
  return currentVariant.value?.price || product.value?.prices?.base || 0
})

const displayFinalPrice = computed(() => {
  return (
    currentVariant.value?.discount_price ||
    currentVariant.value?.price ||
    product.value?.prices?.final ||
    0
  )
})

const displayDiscountPercent = computed(() => {
  if (displayBasePrice.value <= 0) return 0
  const discount = displayBasePrice.value - displayFinalPrice.value
  if (discount <= 0) return 0
  return Math.round((discount / displayBasePrice.value) * 100)
})

// --- Utilities ---
const toPersianDigits = (n) => n?.toString().replace(/\d/g, (x) => '۰۱۲۳۴۵۶۷۸۹'[x])
const formatPrice = (p) => (p ? Number(p).toLocaleString() : '۰')

// --- Methods ---
const selectAttribute = (attrName, option) => {
  selectedAttributes.value[attrName] = option
  quantity.value = 1
}

const handleToggleFavorite = async () => {
  if (isTogglingFavorite.value || !product.value) return

  try {
    isTogglingFavorite.value = true
    const previousState = !!product.value.is_favorited
    product.value.is_favorited = !previousState

    const response = await toggleFavorite(product.value.id)
    product.value.is_favorited = response.is_favorited

    if (response.is_favorited) {
      notify.success('محصول به علاقه‌مندی‌ها اضافه شد.')
    } else {
      notify.info('محصول از علاقه‌مندی‌ها حذف شد.')
    }
  } catch (error) {
    console.error('خطا در تغییر وضعیت علاقه‌مندی:', error)
    product.value.is_favorited = !product.value.is_favorited

    if (error.response?.status === 401) {
      notify.error('لطفاً ابتدا وارد حساب کاربری خود شوید.')
    } else {
      notify.error('مشکلی در ارتباط با سرور رخ داد.')
    }
  } finally {
    isTogglingFavorite.value = false
  }
}

const handleAddToCart = async () => {
  if (!product.value) return

  if (availableAttributes.value.length > 0) {
    const isAllAttributesSelected = availableAttributes.value.every(
      (attr) => selectedAttributes.value[attr.name],
    )

    if (!isAllAttributesSelected) {
      notify.warning('لطفاً ابتدا تمام ویژگی‌های محصول (مانند رنگ و سایز) را انتخاب کنید.')
      return
    }

    if (!currentVariant.value) {
      notify.info('متاسفانه این ترکیب در حال حاضر موجود نیست.')
      return
    }
  }

  if (displayStock.value === 0) {
    notify.error('موجودی این محصول به اتمام رسیده است.')
    return
  }

  if (quantity.value > displayStock.value) {
    notify.warning(`فقط ${toPersianDigits(displayStock.value)} عدد از این محصول قابل سفارش است.`)
    quantity.value = displayStock.value
    return
  }

  const finalVariantId = currentVariant.value ? currentVariant.value.id : null

  try {
    await cartStore.addItem(product.value.id, finalVariantId, quantity.value)
    notify.success('محصول با موفقیت به سبد خرید اضافه شد!')
    quantity.value = 1
  } catch (error) {
    console.error('خطا در افزودن به سبد خرید:', error)
    const errorMsg =
      error.response?.data?.message || 'مشکلی در افزودن محصول به سبد خرید به وجود آمد.'
    notify.error(errorMsg)
  }
}

const init = async () => {
  const slug = route.params.slug ? decodeURIComponent(route.params.slug) : null
  if (!slug) return

  await productStore.fetchProduct(slug)

  if (product.value) {
    activeImage.value =
      product.value.images?.thumbnail?.urls?.large ||
      product.value.images?.thumbnail?.url ||
      product.value.images?.thumbnail

    if (availableAttributes.value.length > 0) {
      availableAttributes.value.forEach((attr) => {
        if (attr.options.length > 0) {
          selectedAttributes.value[attr.name] = attr.options[0]
        }
      })
    }
  }
}

watch(
  () => route.params.slug,
  () => {
    quantity.value = 1
    selectedAttributes.value = {}
    activeTab.value = 'desc'
    activeImage.value = null
    window.scrollTo({ top: 0, behavior: 'smooth' })
    init()
  },
)

onMounted(init)
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}

.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
