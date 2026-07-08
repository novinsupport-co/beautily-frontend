import defaultTheme from 'tailwindcss/defaultTheme'
import formKitTailwind from '@formkit/themes/tailwindcss'

export default {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
    './node_modules/@formkit/themes/dist/**/*.{css,js}',
  ],
  theme: {
    extend: {
      colors: {
        'brand-primary': '#F27C9A', // صورتی اصلی
        'brand-secondary': '#DFA9C7', // صورتی کم‌رنگ
        'brand-accent': '#EEDAC5', // کرم روشن
        'brand-neutral': '#F5F5F7', // خاکستری خیلی روشن
        'brand-dark': '#333333', // مشکی کم‌رنگ
        'brand-medium': '#777777', // خاکستری متوسط
        'brand-white': '#FFFFFF', // سفید
      },
      fontFamily: {
        sans: ['Vazirmatn', ...defaultTheme.fontFamily.sans],

        /* Vazir */
        vazir: ['Vazir', 'sans-serif'],
        'vazir-thin': ['Vazir-Thin', 'sans-serif'],
        'vazir-light': ['Vazir-Light', 'sans-serif'],
        'vazir-medium': ['Vazir-Medium', 'sans-serif'],
        'vazir-bold': ['Vazir-Bold', 'sans-serif'],

        /* Tanha */
        'tanha-small': ['Tanha-small', 'sans-serif'],
        'tanha-medium': ['Tanha-Medium', 'sans-serif'],
        'tanha-bold': ['Tanha-Bold', 'sans-serif'],

        /* IRANSans */
        iransans: ['IRANSans-Regular', 'sans-serif'],
        'iransans-thin': ['IRANSans-Thin', 'sans-serif'],
        'iransans-ultralight': ['IRANSans-UltraLight', 'sans-serif'],
        'iransans-light': ['IRANSans-Light', 'sans-serif'],
        'iransans-medium': ['IRANSans-Medium', 'sans-serif'],
        'iransans-demibold': ['IRANSans-DemiBold', 'sans-serif'],
        'iransans-bold': ['IRANSans-Bold', 'sans-serif'],
        'iransans-extrabold': ['IRANSans-ExtraBold', 'sans-serif'],
        'iransans-black': ['IRANSans-Black', 'sans-serif'],
        'iransans-extrablack': ['IRANSans-ExtraBlack', 'sans-serif'],
        'iransans-heavy': ['IRANSans-Heavy', 'sans-serif'],
      },
      keyframes: {
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.3s ease-out forwards',
      },
    },
  },
  plugins: [formKitTailwind],
}
