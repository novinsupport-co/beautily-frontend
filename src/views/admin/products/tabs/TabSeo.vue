<template>
  <div class="bg-white p-6 rounded-2xl border border-slate-200 space-y-6">
    <h3 class="text-lg font-bold text-slate-800 border-b pb-3">تنظیمات سئو (SEO)</h3>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Title -->
      <div>
        <label class="block text-sm font-bold text-slate-700 mb-2">عنوان سئو (Meta Title)</label>
        <input
          v-model="form.seo.title"
          class="w-full border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none"
          placeholder="در صورت خالی بودن، نام محصول قرار می‌گیرد"
          type="text"
        >
        <span class="text-xs text-slate-400 mt-1 block">پیشنهاد: بین ۵۰ تا ۶۰ کاراکتر</span>
      </div>

      <!-- Canonical URL -->
      <div>
        <label class="block text-sm font-bold text-slate-700 mb-2">لینک کانونیکال (Canonical)</label>
        <input
          v-model="form.seo.canonical_url"
          class="w-full border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none"
          dir="ltr"
          placeholder="https://beautily.ir/product/..."
          type="url"
        >
      </div>

      <!-- Robots -->
      <div>
        <label class="block text-sm font-bold text-slate-700 mb-2">وضعیت ربات‌ها (Robots)</label>
        <select v-model="form.seo.robots" class="w-full border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none" dir="ltr">
          <option value="index, follow">Index, Follow (پیش‌فرض)</option>
          <option value="noindex, nofollow">Noindex, Nofollow</option>
          <option value="index, nofollow">Index, Nofollow</option>
          <option value="noindex, follow">Noindex, Follow</option>
        </select>
      </div>

      <!-- Description -->
      <div class="md:col-span-2">
        <label class="block text-sm font-bold text-slate-700 mb-2">توضیحات سئو (Meta Description)</label>
        <textarea
          v-model="form.seo.description"
          class="w-full border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none"
          placeholder="در صورت خالی بودن، چکیده محصول قرار می‌گیرد"
          rows="3"
        ></textarea>
        <span class="text-xs text-slate-400 mt-1 block">پیشنهاد: بین ۱۵۰ تا ۱۶۰ کاراکتر</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  form: any
}>()
</script>
