<template>
  <div class="space-y-10 animate-in fade-in duration-500 pb-20">
    <section class="grid md:grid-cols-3 gap-6 items-end">
      <div
        class="flex items-center justify-between bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl px-5 py-3.5 h-[58px]"
      >
        <span class="text-sm font-iransans-bold text-slate-600 dark:text-slate-300"
          >نمایش در سایت:</span
        >
        <label class="relative inline-flex items-center cursor-pointer">
          <input v-model="form.is_active" class="sr-only peer" type="checkbox" />
          <div
            class="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:bg-pink-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"
          ></div>
        </label>
      </div>

      <div
        class="flex items-center justify-between bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl px-5 py-3.5 h-[58px] border-amber-100 bg-amber-50/10"
      >
        <span class="text-sm font-iransans-bold text-amber-600">قیمت (تماس بگیرید):</span>
        <label class="relative inline-flex items-center cursor-pointer">
          <input v-model="form.call_for_price" class="sr-only peer" type="checkbox" />
          <div
            class="w-11 h-6 bg-slate-200 peer-checked:bg-amber-500 rounded-full peer after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"
          ></div>
        </label>
      </div>
    </section>

    <section class="grid md:grid-cols-2 gap-6">
      <div class="space-y-2">
        <label class="text-sm font-iransans-medium text-slate-500 mr-2">نام محصول</label>
        <input v-model="form.name" class="input-fancy" placeholder="مثلا: سرم ویتامین C" />
      </div>
      <div>
        <label class="block text-sm font-bold text-slate-700 mb-2">اسلاگ (URL محصول)</label>
        <input
          v-model="form.slug"
          class="w-full p-3 rounded-xl border border-slate-200 outline-none"
          dir="ltr"
        />
      </div>
    </section>

    <section
      class="relative bg-slate-50/50 p-6 rounded-[2.5rem] border border-slate-100 grid md:grid-cols-4 gap-6"
    >
      <div
        v-if="form.call_for_price"
        class="absolute inset-0 z-20 bg-white/60 backdrop-blur-[2px] flex items-center justify-center rounded-[2.5rem]"
      >
        <span class="font-iransans-bold text-amber-700">قیمت توافقی فعال است</span>
      </div>
      <div class="relative">
        <label class="text-xs absolute -top-2.5 right-4 bg-white px-2">قیمت اصلی</label>
        <input
          v-model="formattedBasePrice"
          :readonly="form.call_for_price"
          class="input-fancy ltr-input !pt-5"
        />
      </div>
      <div class="relative">
        <label class="text-xs absolute -top-2.5 right-4 bg-white px-2">درصد تخفیف</label>
        <input
          v-model.number="discountPercent"
          :readonly="form.call_for_price"
          class="input-fancy ltr-input !pt-5"
          type="number"
        />
      </div>
      <div class="relative">
        <label class="text-xs absolute -top-2.5 right-4 bg-white px-2 text-emerald-500"
          >قیمت نهایی</label
        >
        <input
          v-model="formattedDiscountPrice"
          :readonly="form.call_for_price"
          class="input-fancy ltr-input !pt-5 border-emerald-100"
        />
      </div>
      <div class="relative">
        <label class="text-xs absolute -top-2.5 right-4 bg-white px-2">موجودی</label>
        <input
          v-model.number="form.stock_quantity"
          class="input-fancy ltr-input !pt-5"
          type="number"
        />
      </div>
    </section>

    <section class="grid md:grid-cols-2 gap-8">
      <div class="bg-white border p-6 rounded-[2.5rem]">
        <div class="flex justify-between mb-4">
          <label class="text-sm font-iransans-bold">دسته‌بندی‌ها</label>
          <button
            class="text-xs text-emerald-600"
            type="button"
            @click="showNewCatInput = !showNewCatInput"
          >
            ➕ جدید
          </button>
        </div>
        <div v-if="showNewCatInput" class="mb-4 flex gap-2">
          <input
            v-model="newCatName"
            class="flex-1 border rounded-xl p-2 text-sm"
            placeholder="نام دسته..."
            @keyup.enter="handleCreateCategory"
          />
          <button
            class="bg-emerald-500 text-white px-4 rounded-xl"
            type="button"
            @click="handleCreateCategory"
          >
            ثبت
          </button>
        </div>
        <select class="w-full border rounded-2xl p-4 text-sm" @change="addCategory">
          <option value="">📂 انتخاب کنید...</option>
          <option
            v-for="cat in allCategories"
            :key="cat.id"
            :disabled="form.category_ids.includes(cat.id)"
            :value="cat.id"
          >
            {{ cat.name }}
          </option>
        </select>
        <div class="flex flex-wrap gap-2 mt-4">
          <span v-for="id in form.category_ids" :key="id" class="chip-tag">
            {{ getCategoryName(id) }}
            <button type="button" @click="removeCategory(id)">✕</button>
          </span>
        </div>
      </div>

      <div class="space-y-6">
        <div class="bg-white border p-6 rounded-[2.5rem] relative">
          <label class="block text-sm font-iransans-bold mb-4">تگ‌های محصول</label>
          <div class="relative">
            <input
              v-model="tagInput"
              class="input-fancy"
              placeholder="تایپ کنید و اینتر بزنید..."
              @focus="showTagSuggestions = true"
              @keydown.enter.prevent="addTag"
            />
            <div
              v-if="showTagSuggestions && filteredTags.length > 0"
              class="absolute z-50 w-full mt-2 bg-white border shadow-2xl rounded-2xl max-h-48 overflow-y-auto"
            >
              <div
                v-for="tag in filteredTags"
                :key="tag.id"
                class="px-4 py-3 hover:bg-slate-50 cursor-pointer text-sm border-b last:border-0"
                @mousedown="selectTag(tag.name)"
              >
                <span class="text-slate-400">#</span> {{ tag.name }}
              </div>
            </div>
          </div>
          <div class="flex flex-wrap gap-2 mt-4">
            <span v-for="(tag, i) in form.tag_names" :key="tag" class="chip-tag"
              >#{{ tag }}
              <button type="button" @click="form.tag_names.splice(i, 1)">✕</button></span
            >
          </div>
        </div>

        <div class="space-y-1">
          <label class="text-xs font-bold text-slate-400 mr-2">برند محصول</label>
          <select v-model="form.brand_id" class="input-fancy">
            <option :value="null">بدون برند (متفرقه)</option>
            <option v-for="brand in brands" :key="brand.id" :value="brand.id">
              {{ brand.name }}
            </option>
          </select>
        </div>
      </div>
    </section>

    <div class="grid lg:grid-cols-3 gap-8">
      <div class="space-y-4">
        <h4 class="font-iransans-bold">🖼️ تصویر اصلی</h4>
        <div
          class="relative aspect-square rounded-[2rem] border-4 border-dashed flex items-center justify-center bg-slate-50 overflow-hidden group"
        >
          <template v-if="thumbnailPreview || form.images?.thumbnail">
            <img
              :src="thumbnailPreview || form.images.thumbnail?.url"
              class="w-full h-full object-cover"
            />
            <button
              class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 text-white"
              type="button"
              @click="removeThumbnail"
            >
              حذف
            </button>
          </template>
          <input
            v-else
            class="absolute inset-0 opacity-0 cursor-pointer"
            type="file"
            @change="onThumbnailChange"
          />
        </div>
      </div>
      <div class="lg:col-span-2 space-y-4">
        <h4 class="font-iransans-bold">📸 گالری</h4>
        <div class="grid grid-cols-4 gap-4">
          <label
            class="aspect-square border-2 border-dashed rounded-[2rem] flex items-center justify-center cursor-pointer"
          >
            <input class="hidden" multiple type="file" @change="onGalleryChange" />
            <span class="text-2xl">+</span>
          </label>
          <div
            v-for="(file, index) in galleryPreviews"
            :key="index"
            class="relative aspect-square border-2 border-pink-400 rounded-[2rem] overflow-hidden"
          >
            <img :src="file.url" class="w-full h-full object-cover" />
            <button class="absolute inset-0 bg-black/40 text-white" @click="removeNewImage(index)">
              حذف
            </button>
          </div>
          <div
            v-for="(img, index) in form.images?.gallery"
            :key="img.id"
            class="relative aspect-square border rounded-[2rem] overflow-hidden"
          >
            <img :src="img.urls?.thumb" class="w-full h-full object-cover" />
            <button
              class="absolute inset-0 bg-red-500/40 text-white"
              @click="removeExistingImage(index)"
            >
              حذف
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="space-y-6">
      <textarea
        v-model="form.short_description"
        class="input-fancy"
        placeholder="توضیح کوتاه..."
        rows="2"
      ></textarea>
      <textarea
        v-model="form.long_description"
        class="input-fancy"
        placeholder="توضیح کامل..."
        rows="5"
      ></textarea>
      <div class="p-4 bg-slate-50 rounded-2xl border border-dashed">
        <label class="block text-sm font-bold mb-2">فایل کاتالوگ (PDF)</label>
        <div
          v-if="form.catalog_url"
          class="mb-2 flex justify-between items-center bg-emerald-50 p-2 rounded-lg"
        >
          <span class="text-xs text-emerald-700">فایل فعلی موجود است</span>
          <a
            :href="form.catalog_url"
            class="text-xs bg-emerald-500 text-white px-2 py-1 rounded"
            target="_blank"
            >مشاهده</a
          >
        </div>
        <input accept=".pdf" type="file" @change="handleCatalogChange" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import axios from '@/lib/axios'
import { useNotificationStore } from '@/stores/notification'

interface Category {
  id: number
  name: string
}
interface Brand {
  id: number
  name: string
}

const props = defineProps({
  form: { type: Object, required: true },
  allCategories: { type: Array as () => Category[], default: () => [] },
  brands: { type: Array as () => Brand[], default: () => [] },
})

const emit = defineEmits(['update-catalog'])
const notify = useNotificationStore()

const thumbnailPreview = ref('')
const galleryPreviews = ref<{ url: string }[]>([])
const showNewCatInput = ref(false)
const newCatName = ref('')
const tagInput = ref('')
const allTags = ref<any[]>([])
const showTagSuggestions = ref(false)

/* ================== TAGS ================== */
const fetchAllTags = async () => {
  try {
    const res = await axios.get('/admin/tags')
    allTags.value = res.data.data
  } catch (e) {
    console.error('Error fetching tags')
  }
}

const filteredTags = computed(() => {
  const s = tagInput.value.trim().toLowerCase()
  if (!s) return []
  return allTags.value
    .filter((t) => t.name.toLowerCase().includes(s) && !props.form.tag_names.includes(t.name))
    .slice(0, 10)
})

const addTag = () => {
  const val = tagInput.value.trim()
  if (val && !props.form.tag_names.includes(val)) props.form.tag_names.push(val)
  tagInput.value = ''
  showTagSuggestions.value = false
}

const selectTag = (name: string) => {
  if (!props.form.tag_names.includes(name)) props.form.tag_names.push(name)
  tagInput.value = ''
  showTagSuggestions.value = false
}

/* ================== PRICE ================== */
const formatPrice = (v: any) => (v ? v.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '')
const unformatPrice = (v: string) => (v ? parseInt(v.replace(/,/g, ''), 10) || 0 : 0)

const formattedBasePrice = computed({
  get: () => formatPrice(props.form.base_price),
  set: (v) => (props.form.base_price = unformatPrice(v)),
})
const formattedDiscountPrice = computed({
  get: () => formatPrice(props.form.discount_price),
  set: (v) => (props.form.discount_price = unformatPrice(v)),
})
const discountPercent = computed({
  get: () =>
    props.form.base_price > 0 && props.form.discount_price > 0
      ? Math.round(100 - (props.form.discount_price * 100) / props.form.base_price)
      : 0,
  set: (val) => {
    if (props.form.base_price > 0)
      props.form.discount_price = Math.round(props.form.base_price * (1 - val / 100))
  },
})

/* ================== HANDLERS ================== */
const onThumbnailChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    thumbnailPreview.value = URL.createObjectURL(file)
    props.form.new_thumbnail = file
  }
}

const removeThumbnail = () => {
  thumbnailPreview.value = ''
  props.form.new_thumbnail = null
  if (props.form.images) props.form.images.thumbnail = null
}

const onGalleryChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  Array.from(target.files || []).forEach((file) => {
    galleryPreviews.value.push({ url: URL.createObjectURL(file as File) })
    props.form.new_gallery_files.push(file as File)
  })
}

const removeNewImage = (i: number) => {
  galleryPreviews.value.splice(i, 1)
  props.form.new_gallery_files.splice(i, 1)
}
const removeExistingImage = (i: number) => props.form.images.gallery.splice(i, 1)

const getCategoryName = (id: number) =>
  (props.allCategories as Category[]).find((c) => c.id === id)?.name || '...'

const addCategory = (e: Event) => {
  const target = e.target as HTMLSelectElement
  const id = parseInt(target.value)
  if (id && !props.form.category_ids.includes(id)) props.form.category_ids.push(id)
  target.value = ''
}

const removeCategory = (id: number) => {
  const idx = props.form.category_ids.indexOf(id)
  if (idx !== -1) props.form.category_ids.splice(idx, 1)
}

const handleCreateCategory = async () => {
  if (!newCatName.value) return
  try {
    const res = await axios.post('/admin/categories', { name: newCatName.value })
    const newCat = res.data.data as Category
    ;(props.allCategories as Category[]).push(newCat)
    props.form.category_ids.push(newCat.id)
    newCatName.value = ''
    showNewCatInput.value = false
    notify.success('دسته اضافه شد')
  } catch {
    notify.error('خطا در ایجاد دسته')
  }
}

const handleCatalogChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    emit('update-catalog', target.files[0])
  }
}

onMounted(() => {
  fetchAllTags()
  document.addEventListener('click', (e) => {
    if (!(e.target as HTMLElement).closest('.relative')) showTagSuggestions.value = false
  })
})
</script>

<style scoped>
.input-fancy {
  @apply w-full border rounded-2xl px-5 py-4 focus:ring-2 focus:ring-pink-500 outline-none transition-all;
}
.ltr-input {
  direction: ltr;
  text-align: left;
}
.chip-tag {
  @apply px-3 py-1 bg-pink-50 text-pink-600 rounded-full text-xs font-bold border flex items-center gap-2;
}
</style>
