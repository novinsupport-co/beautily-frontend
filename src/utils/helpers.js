// مسیر فایل: src/utils/helpers.js

export const toPersianDigits = (num) => {
  if (num === null || num === undefined) return ''
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹']
  return num.toString().replace(/\d/g, (x) => persianDigits[x])
}

export const formatPrice = (p) => {
  // استفاده از fa-IR هم جداکننده می‌گذارد و هم اعداد را فارسی می‌کند
  return p ? Number(p).toLocaleString('fa-IR') : '۰'
}
