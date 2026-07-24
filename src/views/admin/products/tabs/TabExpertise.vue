<template>
  <div class="space-y-6 animate-in fade-in duration-500 pb-20">
    <!-- بخش محتوای متنی (کشویی/آکاردئون به صورت عمودی) -->
    <section class="space-y-4">
      <!-- آکاردئون نقد و بررسی تخصصی -->
      <div
        class="bg-white border border-slate-100 shadow-sm rounded-[2rem] overflow-hidden transition-all duration-300"
      >
        <!-- هدر کشو -->
        <button
          class="w-full flex items-center justify-between p-6 hover:bg-slate-50/50 transition-colors focus:outline-none"
          type="button"
          @click="isReviewExpanded = !isReviewExpanded"
        >
          <div class="flex items-center gap-3">
            <span class="text-xl">✍️</span>
            <span class="text-sm font-iransans-bold text-slate-700">نقد و بررسی تخصصی</span>
            <!-- اندیکاتور پر بودن محتوا -->
            <span
              v-if="form.expert_review && form.expert_review !== '<p></p>'"
              class="text-[10px] bg-emerald-50 text-emerald-600 px-2.5 py-0.5 rounded-full border border-emerald-100"
            >
              محتوا ثبت شده
            </span>
          </div>
          <!-- آیکون فلش با انیمیشن چرخش 180 درجه -->
          <svg
            :class="{ 'rotate-180': isReviewExpanded }"
            class="w-5 h-5 text-slate-400 transition-transform duration-300"
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

        <!-- محتوای داخل کشو -->
        <div
          v-show="isReviewExpanded"
          class="border-t border-slate-100/80 p-6 bg-slate-50/20 transition-all"
        >
          <div class="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-inner">
            <TiptapEditor v-model="form.expert_review" />
          </div>
        </div>
      </div>

      <!-- آکاردئون آموزش استفاده -->
      <div
        class="bg-white border border-slate-100 shadow-sm rounded-[2rem] overflow-hidden transition-all duration-300"
      >
        <!-- هدر کشو -->
        <button
          class="w-full flex items-center justify-between p-6 hover:bg-slate-50/50 transition-colors focus:outline-none"
          type="button"
          @click="isHowToUseExpanded = !isHowToUseExpanded"
        >
          <div class="flex items-center gap-3">
            <span class="text-xl">💡</span>
            <span class="text-sm font-iransans-bold text-slate-700">آموزش استفاده</span>
            <!-- اندیکاتور پر بودن محتوا -->
            <span
              v-if="form.how_to_use && form.how_to_use !== '<p></p>'"
              class="text-[10px] bg-emerald-50 text-emerald-600 px-2.5 py-0.5 rounded-full border border-emerald-100"
            >
              محتوا ثبت شده
            </span>
          </div>
          <!-- آیکون فلش با انیمیشن چرخش 180 درجه -->
          <svg
            :class="{ 'rotate-180': isHowToUseExpanded }"
            class="w-5 h-5 text-slate-400 transition-transform duration-300"
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

        <!-- محتوای داخل کشو -->
        <div
          v-show="isHowToUseExpanded"
          class="border-t border-slate-100/80 p-6 bg-slate-50/20 transition-all"
        >
          <div class="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-inner">
            <TiptapEditor v-model="form.how_to_use" />
          </div>
        </div>
      </div>
    </section>

    <!-- بخش انتخاب ترکیبات و نشان‌های اعتماد -->
    <section class="grid lg:grid-cols-2 gap-6">
      <!-- ترکیبات (Ingredients) -->
      <div class="bg-white border border-slate-100 shadow-sm p-6 rounded-[2.5rem]">
        <label class="flex items-center gap-2 text-sm font-iransans-bold text-slate-700 mb-4">
          <span class="text-lg">🧪</span>
          ترکیبات فعال (Ingredients)
        </label>

        <div class="relative">
          <select
            class="input-fancy !py-3 bg-slate-50 cursor-pointer appearance-none"
            @change="addIngredient"
          >
            <option disabled selected value="">انتخاب ترکیب...</option>
            <option
              v-for="item in ingredientsList"
              :key="item.id"
              :disabled="isIngredientSelected(item.id)"
              :value="item.id"
            >
              {{ item.name }}
            </option>
          </select>
          <div
            class="pointer-events-none absolute inset-y-0 left-0 flex items-center px-4 text-slate-400"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                d="M19 9l-7 7-7-7"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
              ></path>
            </svg>
          </div>
        </div>

        <div class="flex flex-wrap gap-2 mt-5 min-h-[40px]">
          <span
            v-for="id in form.ingredient_ids"
            :key="id"
            class="chip-tag bg-blue-50 text-blue-600 border-blue-100"
          >
            {{ getIngredientName(id) }}
            <button
              class="w-5 h-5 flex items-center justify-center rounded-full hover:bg-blue-200 transition-colors"
              type="button"
              @click="removeIngredient(id)"
            >
              ✕
            </button>
          </span>
          <span v-if="!form.ingredient_ids?.length" class="text-xs text-slate-400 mt-2">
            هیچ ترکیبی انتخاب نشده است.
          </span>
        </div>
      </div>

      <!-- نشان‌های اعتماد (Trust Badges) -->
      <div class="bg-white border border-slate-100 shadow-sm p-6 rounded-[2.5rem]">
        <label class="flex items-center gap-2 text-sm font-iransans-bold text-slate-700 mb-4">
          <span class="text-lg">🛡️</span>
          نشان‌های اعتماد / ویژگی‌های بارز
        </label>

        <div class="relative">
          <select
            class="input-fancy !py-3 bg-slate-50 cursor-pointer appearance-none"
            @change="addTrustBadge"
          >
            <option disabled selected value="">انتخاب نشان...</option>
            <option
              v-for="badge in trustBadgesList"
              :key="badge.id"
              :disabled="isTrustBadgeSelected(badge.id)"
              :value="badge.id"
            >
              {{ badge.name }}
            </option>
          </select>
          <div
            class="pointer-events-none absolute inset-y-0 left-0 flex items-center px-4 text-slate-400"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                d="M19 9l-7 7-7-7"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
              ></path>
            </svg>
          </div>
        </div>

        <div class="flex flex-wrap gap-2 mt-5 min-h-[40px]">
          <span
            v-for="id in form.trust_badge_ids"
            :key="id"
            class="chip-tag bg-emerald-50 text-emerald-600 border-emerald-100"
          >
            {{ getTrustBadgeName(id) }}
            <button
              class="w-5 h-5 flex items-center justify-center rounded-full hover:bg-emerald-200 transition-colors"
              type="button"
              @click="removeTrustBadge(id)"
            >
              ✕
            </button>
          </span>
          <span v-if="!form.trust_badge_ids?.length" class="text-xs text-slate-400 mt-2">
            هیچ نشانی انتخاب نشده است.
          </span>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import TiptapEditor from '@/views/admin/products/components/TiptapEditor.vue'

const props = defineProps({
  form: { type: Object, required: true },
  ingredients: { type: [Array, Object], default: () => [] },
  trustBadges: { type: [Array, Object], default: () => [] },
})

const isReviewExpanded = ref(true)
const isHowToUseExpanded = ref(false)

// استخراج آرایه با پوشش تمام لایه‌های احتمالی (دبل رپ شدنِ دیتا)
const extractArray = (data) => {
  if (!data) return []

  // ۱. اگر مستقیماً آرایه است
  if (Array.isArray(data)) return data

  // ۲. اگر دیتا درون کلید data پیچیده شده است (رایج در Resource و Pagination لاراول)
  if (data.data) {
    if (Array.isArray(data.data)) return data.data
    // اگر لاراول آن را به آبجکت تبدیل کرده باشد
    if (typeof data.data === 'object') return Object.values(data.data)
  }

  // ۳. اگر کل دیتا یک آبجکت است (تبدیل مقادیر آبجکت به آرایه)
  if (typeof data === 'object') {
    return Object.values(data)
  }

  return []
}

const ingredientsList = computed(() => extractArray(props.ingredients))
const trustBadgesList = computed(() => extractArray(props.trustBadges))

// تابع کمکی برای استخراج ID ایمن (چه عدد پاس داده شود چه کل آبجکت از سمت دیتابیس)
const extractId = (item) => {
  return typeof item === 'object' && item !== null ? Number(item.id) : Number(item)
}

// ==========================================
// هندلرهای ترکیبات (Ingredients)
// ==========================================

const isIngredientSelected = (id) => {
  if (!props.form.ingredient_ids) return false
  return props.form.ingredient_ids.some((selectedItem) => extractId(selectedItem) === Number(id))
}

const getIngredientName = (item) => {
  const safeId = extractId(item)
  const found = ingredientsList.value.find((i) => Number(i.id) === safeId)

  // اگر پیدا شد نام را برمی‌گردانیم، در غیر این صورت اگر خود آبجکت پاس داده شده و نام دارد همان را نشان می‌دهیم
  if (found) return found.name
  if (typeof item === 'object' && item.name) return item.name

  return 'در حال بارگذاری...'
}

const addIngredient = (e) => {
  const target = e.target
  const id = Number(target.value)

  if (!props.form.ingredient_ids) {
    props.form.ingredient_ids = []
  }

  if (id && !isIngredientSelected(id)) {
    // هنگام اضافه کردن جدید، فقط ID را پوش می‌کنیم
    props.form.ingredient_ids.push(id)
  }
  target.value = ''
}

const removeIngredient = (item) => {
  const safeId = extractId(item)
  const idx = props.form.ingredient_ids.findIndex(
    (selectedItem) => extractId(selectedItem) === safeId,
  )
  if (idx !== -1) props.form.ingredient_ids.splice(idx, 1)
}

// ==========================================
// هندلرهای نشان‌های اعتماد (Trust Badges)
// ==========================================

const isTrustBadgeSelected = (id) => {
  if (!props.form.trust_badge_ids) return false
  return props.form.trust_badge_ids.some((selectedItem) => extractId(selectedItem) === Number(id))
}

const getTrustBadgeName = (item) => {
  const safeId = extractId(item)
  const found = trustBadgesList.value.find((b) => Number(b.id) === safeId)

  if (found) return found.name
  if (typeof item === 'object' && item.name) return item.name

  return 'در حال بارگذاری...'
}

const addTrustBadge = (e) => {
  const target = e.target
  const id = Number(target.value)

  if (!props.form.trust_badge_ids) {
    props.form.trust_badge_ids = []
  }

  if (id && !isTrustBadgeSelected(id)) {
    props.form.trust_badge_ids.push(id)
  }
  target.value = ''
}

const removeTrustBadge = (item) => {
  const safeId = extractId(item)
  const idx = props.form.trust_badge_ids.findIndex(
    (selectedItem) => extractId(selectedItem) === safeId,
  )
  if (idx !== -1) props.form.trust_badge_ids.splice(idx, 1)
}
</script>

<style scoped>
.input-fancy {
  @apply w-full border border-slate-200 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-pink-500 outline-none transition-all text-sm font-iransans-medium;
}

.chip-tag {
  @apply px-3 py-1.5 rounded-full text-xs font-bold border flex items-center gap-2 transition-all;
}
</style>
