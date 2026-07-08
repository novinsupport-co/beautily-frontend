<!-- src/components/ConfirmDialog.vue -->
<template>
  <transition name="fade">
    <!-- پس‌زمینه تیره -->
    <div
      v-if="isOpen"
      class="fixed inset-0 z-[10000] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm"
    >
      <!-- مدال تایید -->
      <transition appear name="scale">
        <div
          class="bg-white rounded-xl shadow-2xl p-6 w-11/12 max-w-sm flex flex-col font-iransans"
        >
          <!-- هدر (آیکون و عنوان) -->
          <div class="flex items-center gap-3 mb-4">
            <div
              :class="iconBgColor"
              class="flex items-center justify-center w-10 h-10 rounded-full"
            >
              <!-- می‌توانید از آیکون‌های Heroicons یا هر کتابخانه‌ای استفاده کنید. اینجا یک آیکون ساده SVG است -->
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  v-if="type === 'danger'"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                />
                <path
                  v-else
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                />
              </svg>
            </div>
            <h3 class="text-lg font-iransans-bold text-slate-800">{{ title }}</h3>
          </div>

          <!-- متن پیام -->
          <p class="text-slate-600 mb-6 text-sm leading-relaxed">
            {{ message }}
          </p>

          <!-- دکمه‌ها -->
          <div class="flex justify-end gap-3 mt-auto">
            <button
              class="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
              @click="cancel"
            >
              {{ cancelText }}
            </button>
            <button
              :class="buttonColor"
              class="px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors"
              @click="accept"
            >
              {{ confirmText }}
            </button>
          </div>
        </div>
      </transition>
    </div>
  </transition>
</template>

<script lang="ts" setup>
import {computed} from 'vue'
import {storeToRefs} from 'pinia'
import {useConfirmStore} from '@/stores/confirm'

const confirmStore = useConfirmStore()
const { isOpen, title, message, confirmText, cancelText, type } = storeToRefs(confirmStore)
const { accept, cancel } = confirmStore

// داینامیک کردن رنگ‌ها بر اساس نوع دیالوگ
const iconBgColor = computed(() => {
  if (type.value === 'danger') return 'bg-rose-500'
  if (type.value === 'warning') return 'bg-amber-500'
  return 'bg-blue-500'
})

const buttonColor = computed(() => {
  if (type.value === 'danger') return 'bg-rose-500 hover:bg-rose-600'
  if (type.value === 'warning') return 'bg-amber-500 hover:bg-amber-600'
  return 'bg-blue-500 hover:bg-blue-600'
})
</script>

<style scoped>
/* انیمیشن پس‌زمینه */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* انیمیشن بزرگ شدن مدال */
.scale-enter-active {
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.scale-leave-active {
  transition: all 0.2s ease-in;
}
.scale-enter-from,
.scale-leave-to {
  opacity: 0;
  transform: scale(0.9) translateY(10px);
}
</style>
