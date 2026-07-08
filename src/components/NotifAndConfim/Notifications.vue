<!-- src/components/Notifications.vue -->
<template>
  <div
    class="fixed top-6 right-6 z-[9999] flex flex-col items-end pointer-events-none w-full max-w-[320px] gap-3"
  >
    <transition-group class="flex flex-col w-full gap-3" name="slide-fade" tag="div">
      <div
        v-for="n in notifications"
        :key="n.id"
        class="pointer-events-auto relative overflow-hidden w-full px-4 py-3.5 rounded-xl bg-brand-white border border-brand-neutral/50 shadow-[0_8px_30px_rgb(0,0,0,0.08)] flex items-center gap-3 transition-all"
        dir="rtl"
      >
        <!-- آیکون بر اساس نوع پیام -->
        <component
          :is="getIcon(n.type)"
          :class="['w-6 h-6 shrink-0', getColorClass(n.type).icon]"
        />

        <!-- متن پیام -->
        <span
          class="w-full text-right text-sm font-iransans-medium text-brand-dark pt-0.5 leading-relaxed"
        >
          {{ n.message }}
        </span>

        <!-- نوار پیشرفت زمان (Progress Bar) -->
        <div
          :class="['absolute bottom-0 right-0 h-1 progress-bar', getColorClass(n.type).progress]"
        ></div>
      </div>
    </transition-group>
  </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { useNotificationStore } from '@/stores/notification'
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XCircleIcon,
} from '@heroicons/vue/24/outline'

const notify = useNotificationStore()
const { notifications } = storeToRefs(notify)

// اختصاص آیکون متناسب با هر نوع اعلان
const getIcon = (type: string) => {
  switch (type) {
    case 'success':
      return CheckCircleIcon
    case 'error':
      return XCircleIcon
    case 'warning':
      return ExclamationTriangleIcon
    case 'info':
      return InformationCircleIcon
    default:
      return InformationCircleIcon
  }
}

// اختصاص رنگ‌های ملایم و هماهنگ با پالت سایت
const getColorClass = (type: string) => {
  switch (type) {
    case 'success':
      return { icon: 'text-emerald-500', progress: 'bg-emerald-500' }
    case 'error':
      // استفاده از rose-500 که یک قرمز ملایم و پخته است و با پالت‌های مدرن همخوانی دارد
      return { icon: 'text-rose-500', progress: 'bg-rose-500' }
    case 'warning':
      return { icon: 'text-amber-500', progress: 'bg-amber-500' }
    case 'info':
      return { icon: 'text-blue-500', progress: 'bg-blue-500' }
    default:
      return { icon: 'text-brand-medium', progress: 'bg-brand-medium' }
  }
}
</script>

<style scoped>
/*
  انیمیشن ورود و خروج
*/
.slide-fade-enter-from {
  transform: translateX(100%) scale(0.95);
  opacity: 0;
}
.slide-fade-enter-active {
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.slide-fade-enter-to {
  transform: translateX(0) scale(1);
  opacity: 1;
}

.slide-fade-leave-from {
  transform: translateX(0) scale(1);
  opacity: 1;
}
.slide-fade-leave-active {
  transition: all 0.3s ease-in;
  position: absolute;
  width: 100%;
}
.slide-fade-leave-to {
  transform: translateX(100%) scale(0.95);
  opacity: 0;
}

/* حرکت نرم پیام‌های باقی‌مانده به سمت بالا */
.slide-fade-move {
  transition: transform 0.4s ease-out;
}

/*
  انیمیشن نوار پیشرفت
*/
.progress-bar {
  animation: progress 3s linear forwards;
}

@keyframes progress {
  0% {
    width: 100%;
  }
  100% {
    width: 0%;
  }
}
</style>
