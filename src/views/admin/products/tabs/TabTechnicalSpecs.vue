<template>
  <div class="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
    <div class="flex items-center justify-between">
      <div>
        <h3 class="text-xl font-iransans-bold text-slate-800 dark:text-slate-100">🛠️ مشخصات فنی</h3>
        <p class="text-sm text-slate-500 mt-1">ویژگی‌های تخصصی محصول را وارد کنید (مثلاً: جنس، ابعاد، وزن)</p>
      </div>
      <button
        class="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-2xl font-iransans-medium transition-all shadow-lg shadow-indigo-200"
        type="button"
        @click="addSpec"
      >
        <span>➕ افزودن ویژگی جدید</span>
      </button>
    </div>

    <div v-if="form.specifications.length === 0" class="flex flex-col items-center justify-center py-20 border-2 border-dashed border-slate-200 rounded-[3rem] bg-slate-50/50">
      <span class="text-5xl mb-4">📝</span>
      <p class="text-slate-400 font-iransans-medium">هنوز هیچ مشخصاتی وارد نشده است.</p>
    </div>

    <div v-else class="grid gap-4">
      <div
        v-for="(spec, index) in form.specifications"
        :key="index"
        class="grid grid-cols-12 gap-4 bg-white dark:bg-slate-800 p-4 rounded-[2rem] border border-slate-100 dark:border-slate-700 items-center group hover:shadow-md transition-all"
      >
        <div class="col-span-1 text-slate-300 flex justify-center">
          <span class="cursor-grab">⋮⋮</span>
        </div>

        <div class="col-span-5">
          <input
            v-model="spec.key"
            class="input-fancy !py-3 !text-sm"
            placeholder="نام ویژگی (مثلاً: جنس)"
          />
        </div>

        <div class="col-span-5">
          <input
            v-model="spec.value"
            class="input-fancy !py-3 !text-sm border-indigo-50"
            placeholder="مقدار (مثلاً: چرم طبیعی)"
          />
        </div>

        <div class="col-span-1 flex justify-center">
          <button
            class="w-10 h-10 flex items-center justify-center rounded-xl bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white transition-all"  type="button"
            @click="removeSpec(index)"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  form: { type: Object, required: true }
})

// افزودن سطر جدید به آرایه مشخصات
const addSpec = () => {
  if (!props.form.specifications) props.form.specifications = [];
  props.form.specifications.push({ key: '', value: '' });
}

// حذف سطر
const removeSpec = (index) => {
  props.form.specifications.splice(index, 1);
}
</script>

<style scoped>
.input-fancy {
  @apply w-full bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-xl px-4 py-2 focus:border-indigo-500 outline-none transition-all;
}
</style>
