<template>
  <div
    class="border border-gray-300 rounded-lg overflow-hidden bg-white shadow-sm font-sans"
    dir="rtl"
  >
    <!-- نوار ابزار اصلی -->
    <div
      v-if="editor"
      class="flex flex-wrap items-center gap-1 p-2 border-b bg-gray-50 text-gray-700 select-none"
    >
      <!-- تاریخچه (Undo / Redo) -->
      <button
        :disabled="!editor.can().undo()"
        class="p-1.5 rounded hover:bg-gray-200 disabled:opacity-40"
        title="بازگشت (Undo)"
        @click.prevent="editor.chain().focus().undo().run()"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
          />
        </svg>
      </button>
      <button
        :disabled="!editor.can().redo()"
        class="p-1.5 rounded hover:bg-gray-200 disabled:opacity-40"
        title="تکرار (Redo)"
        @click.prevent="editor.chain().focus().redo().run()"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            d="M21 10h-10a8 8 0 00-8 8v2m18-8l-6 6m6-6l-6-6"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
          />
        </svg>
      </button>

      <span class="w-px h-6 bg-gray-300 mx-1"></span>

      <!-- استایل قلم (Heading / Paragraph) -->
      <select
        class="bg-white border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-pink-500"
        @change="setHeading($event)"
      >
        <option :selected="editor.isActive('paragraph')" value="paragraph">
          متن عادی (Paragraph)
        </option>
        <option :selected="editor.isActive('heading', { level: 1 })" value="1">عنوان ۱ (H1)</option>
        <option :selected="editor.isActive('heading', { level: 2 })" value="2">عنوان ۲ (H2)</option>
        <option :selected="editor.isActive('heading', { level: 3 })" value="3">عنوان ۳ (H3)</option>
        <option :selected="editor.isActive('heading', { level: 4 })" value="4">عنوان ۴ (H4)</option>
      </select>

      <!-- انتخاب فونت -->
      <select
        class="bg-white border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-pink-500"
        @change="setFontFamily($event)"
      >
        <option value="sans-serif">فونت سیستم (Default)</option>
        <option value="Vazirmatn">وزیر متن</option>
        <option value="Tahoma">تاهما (Tahoma)</option>
        <option value="Arial">Arial</option>
        <option value="Times New Roman">Times New Roman</option>
      </select>

      <!-- انتخاب سایز فونت -->
      <select
        class="bg-white border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-pink-500"
        @change="setFontSize($event)"
      >
        <option value="">سایز پیش‌فرض</option>
        <option value="12px">12px</option>
        <option value="14px">14px</option>
        <option value="16px">16px</option>
        <option value="18px">18px</option>
        <option value="20px">20px</option>
        <option value="24px">24px</option>
        <option value="32px">32px</option>
      </select>

      <span class="w-px h-6 bg-gray-300 mx-1"></span>

      <!-- استایل‌های متنی پایه -->
      <button
        :class="{ 'bg-pink-100 text-pink-600': editor.isActive('bold') }"
        class="p-1.5 rounded hover:bg-gray-200 font-bold"
        title="ضخیم (Bold)"
        @click.prevent="editor.chain().focus().toggleBold().run()"
      >
        B
      </button>
      <button
        :class="{ 'bg-pink-100 text-pink-600': editor.isActive('italic') }"
        class="p-1.5 rounded hover:bg-gray-200 italic"
        title="کج (Italic)"
        @click.prevent="editor.chain().focus().toggleItalic().run()"
      >
        I
      </button>
      <button
        :class="{ 'bg-pink-100 text-pink-600': editor.isActive('underline') }"
        class="p-1.5 rounded hover:bg-gray-200 underline"
        title="زیرخط (Underline)"
        @click.prevent="editor.chain().focus().toggleUnderline().run()"
      >
        U
      </button>
      <button
        :class="{ 'bg-pink-100 text-pink-600': editor.isActive('strike') }"
        class="p-1.5 rounded hover:bg-gray-200 line-through"
        title="خط‌خورده (Strike)"
        @click.prevent="editor.chain().focus().toggleStrike().run()"
      >
        S
      </button>

      <!-- بالانویس و زیرنویس -->
      <button
        :class="{ 'bg-pink-100 text-pink-600': editor.isActive('subscript') }"
        class="p-1.5 rounded hover:bg-gray-200 text-xs font-mono"
        title="زیرنویس (Subscript)"
        @click.prevent="editor.chain().focus().toggleSubscript().run()"
      >
        X₂
      </button>
      <button
        :class="{ 'bg-pink-100 text-pink-600': editor.isActive('superscript') }"
        class="p-1.5 rounded hover:bg-gray-200 text-xs font-mono"
        title="بالانویس (Superscript)"
        @click.prevent="editor.chain().focus().toggleSuperscript().run()"
      >
        X²
      </button>

      <span class="w-px h-6 bg-gray-300 mx-1"></span>

      <!-- رنگ متن و رنگ پس‌زمینه (Highlight) -->
      <div class="flex items-center gap-1" title="رنگ متن">
        <span class="text-xs text-gray-500">رنگ:</span>
        <input
          :value="editor.getAttributes('textStyle').color || '#000000'"
          class="w-6 h-6 border rounded cursor-pointer p-0 bg-transparent"
          type="color"
          @input="editor.chain().focus().setColor($event.target.value).run()"
        />
      </div>

      <div class="flex items-center gap-1" title="رنگ پس‌زمینه (هایلایت)">
        <span class="text-xs text-gray-500">هایلایت:</span>
        <input
          :value="editor.getAttributes('highlight').color || '#ffffff'"
          class="w-6 h-6 border rounded cursor-pointer p-0 bg-transparent"
          type="color"
          @input="editor.chain().focus().setHighlight({ color: $event.target.value }).run()"
        />
        <button
          class="text-xs text-red-500 hover:underline px-1"
          @click.prevent="editor.chain().focus().unsetHighlight().run()"
        >
          حذف
        </button>
      </div>

      <span class="w-px h-6 bg-gray-300 mx-1"></span>

      <!-- چینش متن -->
      <button
        :class="{ 'bg-pink-100 text-pink-600': editor.isActive({ textAlign: 'right' }) }"
        class="p-1.5 rounded hover:bg-gray-200"
        title="راست‌چین"
        @click.prevent="editor.chain().focus().setTextAlign('right').run()"
      >
        راست
      </button>
      <button
        :class="{ 'bg-pink-100 text-pink-600': editor.isActive({ textAlign: 'center' }) }"
        class="p-1.5 rounded hover:bg-gray-200"
        title="وسط‌چین"
        @click.prevent="editor.chain().focus().setTextAlign('center').run()"
      >
        وسط
      </button>
      <button
        :class="{ 'bg-pink-100 text-pink-600': editor.isActive({ textAlign: 'left' }) }"
        class="p-1.5 rounded hover:bg-gray-200"
        title="چپ‌چین"
        @click.prevent="editor.chain().focus().setTextAlign('left').run()"
      >
        چپ
      </button>
      <button
        :class="{ 'bg-pink-100 text-pink-600': editor.isActive({ textAlign: 'justify' }) }"
        class="p-1.5 rounded hover:bg-gray-200"
        title="تراز شده (Justify)"
        @click.prevent="editor.chain().focus().setTextAlign('justify').run()"
      >
        تراز
      </button>

      <span class="w-px h-6 bg-gray-300 mx-1"></span>

      <!-- لیست‌ها -->
      <button
        :class="{ 'bg-pink-100 text-pink-600': editor.isActive('bulletList') }"
        class="p-1.5 rounded hover:bg-gray-200"
        title="لیست نشانه‌دار"
        @click.prevent="editor.chain().focus().toggleBulletList().run()"
      >
        • لیست
      </button>
      <button
        :class="{ 'bg-pink-100 text-pink-600': editor.isActive('orderedList') }"
        class="p-1.5 rounded hover:bg-gray-200"
        title="لیست عددی"
        @click.prevent="editor.chain().focus().toggleOrderedList().run()"
      >
        ۱. لیست
      </button>

      <span class="w-px h-6 bg-gray-300 mx-1"></span>

      <!-- درج امکانات (لینک، تصویر، جدول، خط افقی) -->
      <button
        :class="{ 'bg-pink-100 text-pink-600': editor.isActive('link') }"
        class="p-1.5 rounded hover:bg-gray-200 text-blue-600"
        title="افزودن لینک"
        @click.prevent="setLink"
      >
        لینک
      </button>
      <button
        v-if="editor.isActive('link')"
        class="p-1.5 rounded hover:bg-gray-200 text-red-500"
        title="حذف لینک"
        @click.prevent="editor.chain().focus().unsetLink().run()"
      >
        حذف لینک
      </button>

      <button
        class="p-1.5 rounded hover:bg-gray-200 text-green-600"
        title="درج تصویر"
        @click.prevent="addImage"
      >
        تصویر
      </button>
      <button
        class="p-1.5 rounded hover:bg-gray-200 text-indigo-600"
        title="درج جدول"
        @click.prevent="insertTable"
      >
        جدول
      </button>
      <button
        class="p-1.5 rounded hover:bg-gray-200"
        title="خط افقی (Divider)"
        @click.prevent="editor.chain().focus().setHorizontalRule().run()"
      >
        خط‌جداکننده
      </button>

      <!-- پاکسازی استایل‌ها -->
      <button
        class="p-1.5 rounded hover:bg-red-50 text-red-600 mr-auto"
        title="پاک کردن تمام قالب‌بندی‌ها"
        @click.prevent="editor.chain().focus().clearNodes().unsetAllMarks().run()"
      >
        حذف استایل‌ها
      </button>
    </div>

    <!-- نوار ابزار ویرایش جدول (فقط زمانی که داخل جدول کلیک شده باشد نشان داده می‌شود) -->
    <div
      v-if="editor && editor.isActive('table')"
      class="flex flex-wrap items-center gap-1 p-2 border-b bg-indigo-50 text-xs text-indigo-900"
    >
      <span class="font-bold ml-2">مدیریت جدول:</span>
      <button
        class="px-2 py-1 rounded bg-white border border-indigo-200 hover:bg-indigo-100"
        @click.prevent="editor.chain().focus().addColumnBefore().run()"
      >
        افزودن ستون قبل
      </button>
      <button
        class="px-2 py-1 rounded bg-white border border-indigo-200 hover:bg-indigo-100"
        @click.prevent="editor.chain().focus().addColumnAfter().run()"
      >
        افزودن ستون بعد
      </button>
      <button
        class="px-2 py-1 rounded bg-red-100 border border-red-200 hover:bg-red-200 text-red-700"
        @click.prevent="editor.chain().focus().deleteColumn().run()"
      >
        حذف ستون
      </button>
      <span class="w-px h-4 bg-indigo-200 mx-1"></span>
      <button
        class="px-2 py-1 rounded bg-white border border-indigo-200 hover:bg-indigo-100"
        @click.prevent="editor.chain().focus().addRowBefore().run()"
      >
        افزودن سطر قبل
      </button>
      <button
        class="px-2 py-1 rounded bg-white border border-indigo-200 hover:bg-indigo-100"
        @click.prevent="editor.chain().focus().addRowAfter().run()"
      >
        افزودن سطر بعد
      </button>
      <button
        class="px-2 py-1 rounded bg-red-100 border border-red-200 hover:bg-red-200 text-red-700"
        @click.prevent="editor.chain().focus().deleteRow().run()"
      >
        حذف سطر
      </button>
      <span class="w-px h-4 bg-indigo-200 mx-1"></span>
      <button
        class="px-2 py-1 rounded bg-red-600 text-white hover:bg-red-700"
        @click.prevent="editor.chain().focus().deleteTable().run()"
      >
        حذف کل جدول
      </button>
    </div>

    <!-- محتوای ادیتور -->
    <editor-content
      :editor="editor"
      class="p-4 min-h-[300px] prose max-w-none focus:outline-none"
    />
  </div>
</template>

<script setup>
import { EditorContent, Extension, useEditor } from '@tiptap/vue-3'
import { StarterKit } from '@tiptap/starter-kit'
import { Underline } from '@tiptap/extension-underline'
import { TextAlign } from '@tiptap/extension-text-align'
import { Link } from '@tiptap/extension-link'
import { Image } from '@tiptap/extension-image'
import { TextStyle } from '@tiptap/extension-text-style'
import { Color } from '@tiptap/extension-color'
import { Highlight } from '@tiptap/extension-highlight'
import { FontFamily } from '@tiptap/extension-font-family'
import { Subscript } from '@tiptap/extension-subscript'
import { Superscript } from '@tiptap/extension-superscript'
import { Table } from '@tiptap/extension-table'
import { TableRow } from '@tiptap/extension-table-row'
import { TableCell } from '@tiptap/extension-table-cell'
import { TableHeader } from '@tiptap/extension-table-header'
import { onBeforeUnmount, watch } from 'vue' // اکستنشن سفارشی جهت افزودن سایز فونت (Font Size)

// اکستنشن سفارشی جهت افزودن سایز فونت (Font Size)
const FontSize = Extension.create({
  name: 'fontSize',
  addOptions() {
    return {
      types: ['textStyle'],
    }
  },
  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          fontSize: {
            default: null,
            parseHTML: (element) => element.style.fontSize?.replace(/['"]+/g, ''),
            renderHTML: (attributes) => {
              if (!attributes.fontSize) return {}
              return { style: `font-size: ${attributes.fontSize}` }
            },
          },
        },
      },
    ]
  },
  addCommands() {
    return {
      setFontSize:
        (fontSize) =>
        ({ chain }) => {
          return chain().setMark('textStyle', { fontSize }).run()
        },
      unsetFontSize:
        () =>
        ({ chain }) => {
          return chain().setMark('textStyle', { fontSize: null }).removeEmptyTextStyle().run()
        },
    }
  },
})

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['update:modelValue'])

const editor = useEditor({
  content: props.modelValue,
  extensions: [
    StarterKit,
    Underline,
    TextStyle,
    Color,
    Highlight.configure({ multicolor: true }),
    FontFamily,
    FontSize,
    Subscript,
    Superscript,
    TextAlign.configure({
      types: ['heading', 'paragraph'],
      defaultAlignment: 'right', // راست‌چین پیش‌فرض
    }),
    Link.configure({
      openOnClick: false,
    }),
    Image.configure({
      inline: true,
      allowBase64: true,
    }),
    Table.configure({
      resizable: true,
    }),
    TableRow,
    TableHeader,
    TableCell,
  ],
  onUpdate: () => {
    emit('update:modelValue', editor.value.getHTML())
  },
})

// مدیریت تغییرات ورودی از سمت والد
watch(
  () => props.modelValue,
  (value) => {
    if (editor.value.getHTML() === value) return
    editor.value.commands.setContent(value, false)
  },
)

// هندلر استایل قلم (Heading)
const setHeading = (event) => {
  const value = event.target.value
  if (value === 'paragraph') {
    editor.value.chain().focus().setParagraph().run()
  } else {
    editor.value
      .chain()
      .focus()
      .toggleHeading({ level: parseInt(value) })
      .run()
  }
}

// هندلر تغییر فونت
const setFontFamily = (event) => {
  const value = event.target.value
  if (value === 'sans-serif') {
    editor.value.chain().focus().unsetFontFamily().run()
  } else {
    editor.value.chain().focus().setFontFamily(value).run()
  }
}

// هندلر تغییر سایز فونت
const setFontSize = (event) => {
  const value = event.target.value
  if (!value) {
    editor.value.chain().focus().unsetFontSize().run()
  } else {
    editor.value.chain().focus().setFontSize(value).run()
  }
}

// هندلر ثبت لینک
const setLink = () => {
  const previousUrl = editor.value.getAttributes('link').href
  const url = window.prompt('آدرس لینک (URL) را وارد کنید:', previousUrl)
  if (url === null) return
  if (url === '') {
    editor.value.chain().focus().extendMarkRange('link').unsetLink().run()
    return
  }
  editor.value.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
}

// هندلر ثبت تصویر
const addImage = () => {
  const url = window.prompt('آدرس تصویر را وارد کنید:')
  if (url) {
    editor.value.chain().focus().setImage({ src: url }).run()
  }
}

// هندلر درج جدول پیش‌فرض
const insertTable = () => {
  editor.value.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
}

onBeforeUnmount(() => {
  editor.value.destroy()
})
</script>

<style>
/* استایل هسته ادیتور جهت نمایش صحیح متون فارسی و کامپوننت‌ها */
.ProseMirror {
  outline: none;
  direction: rtl;
  text-align: right;
}

/* فاصله دهی و استایل تگ‌های پرکاربرد */
.ProseMirror p {
  margin-bottom: 0.75em;
  line-height: 1.6;
}

.ProseMirror h1 {
  font-size: 2em;
  font-weight: bold;
  margin-bottom: 0.5em;
}
.ProseMirror h2 {
  font-size: 1.5em;
  font-weight: bold;
  margin-bottom: 0.5em;
}
.ProseMirror h3 {
  font-size: 1.17em;
  font-weight: bold;
  margin-bottom: 0.5em;
}

/* استایل لیست‌ها */
.ProseMirror ul {
  list-style-type: disc;
  padding-right: 20px;
  margin-bottom: 1em;
}
.ProseMirror ol {
  list-style-type: decimal;
  padding-right: 20px;
  margin-bottom: 1em;
}

/* استایل جداول درون ادیتور */
.ProseMirror table {
  border-collapse: collapse;
  table-layout: fixed;
  width: 100%;
  margin: 1rem 0;
  overflow: hidden;
}
.ProseMirror td,
.ProseMirror th {
  min-width: 1em;
  border: 1px solid #ced4da;
  padding: 8px 10px;
  vertical-align: top;
  box-sizing: border-box;
  position: relative;
}
.ProseMirror th {
  font-weight: bold;
  text-align: right;
  background-color: #f1f3f5;
}
.ProseMirror .selectedCell:after {
  z-index: 2;
  position: absolute;
  content: '';
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background: rgba(200, 200, 255, 0.4);
  pointer-events: none;
}

/* استایل تصاویر */
.ProseMirror img {
  max-width: 100%;
  height: auto;
  display: block;
  margin: 1rem auto;
  border-radius: 4px;
}

/* استایل لینک‌ها */
.ProseMirror a {
  color: #f57a9b; /* هماهنگ با رنگ برند Beautily */
  text-decoration: underline;
  cursor: pointer;
}
</style>
