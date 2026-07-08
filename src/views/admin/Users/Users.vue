<template>
  <div class="p-4 md:p-6 relative font-vazir">
    <!-- هدر صفحه -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
      <div>
        <h1 class="text-2xl font-bold text-slate-800 dark:text-white">مدیریت کاربران</h1>
        <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">
          مشاهده و مدیریت حساب‌های کاربری، نقش‌ها و دسترسی‌ها
        </p>
      </div>

      <!-- نوار جستجو و دکمه افزودن -->
      <div class="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
        <div class="relative w-full sm:w-auto">
          <input
            v-model="searchQuery"
            class="pl-10 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none w-full sm:w-64 transition-all"
            placeholder="جستجوی نام یا ایمیل..."
            type="text"
          />
          <i class="pi pi-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"></i>
        </div>
        <!-- دکمه افزودن کاربر -->
        <button
          class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl flex items-center justify-center gap-2 text-sm font-medium transition-colors shadow-sm w-full sm:w-auto"
          @click="openCreateModal"
        >
          <i class="pi pi-user-plus"></i>
          <span>کاربر جدید</span>
        </button>
      </div>
    </div>

    <!-- وضعیت لودینگ اولیه -->
    <div v-if="loading && users.length === 0" class="flex justify-center items-center py-20">
      <div
        class="animate-spin rounded-full h-10 w-10 border-4 border-indigo-200 border-t-indigo-600"
      ></div>
    </div>

    <!-- جدول کاربران -->
    <div
      v-else
      class="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden relative"
    >
      <!-- لودینگ روی جدول هنگام جستجو یا تغییر صفحه -->
      <div
        v-if="loading"
        class="absolute inset-0 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm flex items-center justify-center z-10"
      >
        <div
          class="animate-spin rounded-full h-8 w-8 border-4 border-indigo-200 border-t-indigo-600"
        ></div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-right border-collapse min-w-[900px]">
          <thead>
            <tr
              class="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-700 text-slate-500 dark:text-slate-400 font-medium text-sm"
            >
              <th class="py-4 px-4 md:px-6 font-medium">مشخصات کاربر</th>
              <th class="py-4 px-4 md:px-6 font-medium">تماس</th>
              <th class="py-4 px-4 md:px-6 font-medium">وضعیت تایید و امنیت</th>
              <th class="py-4 px-4 md:px-6 font-medium">نقش</th>
              <th class="py-4 px-4 md:px-6 font-medium text-left">عملیات</th>
            </tr>
          </thead>
          <tbody class="text-sm divide-y divide-slate-100 dark:divide-slate-700">
            <!-- در صورت خالی بودن لیست -->
            <tr v-if="users.length === 0">
              <td class="py-10 text-center text-slate-500" colspan="5">کاربری یافت نشد.</td>
            </tr>

            <!-- حلقه کاربران -->
            <tr
              v-for="user in users"
              :key="user.id"
              class="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors group"
            >
              <!-- مشخصات کاربر -->
              <td class="px-4 md:px-6 py-4 whitespace-nowrap">
                <div class="flex items-center gap-3">
                  <!-- محفظه آواتار -->
                  <div class="relative w-11 h-11 shrink-0">
                    <img
                      :alt="user.name"
                      :src="
                        user.avatar?.url ||
                        `https://ui-avatars.com/api/?name=${user.name}&background=random&color=fff&rounded=true&bold=true`
                      "
                      class="w-full h-full rounded-full object-cover shadow-sm border-2 border-white dark:border-slate-800"
                      @error="handleImageError"
                    />
                    <!-- فال‌بک نام در صورت خطای کامل لود عکس -->
                    <div
                      class="w-full h-full rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 items-center justify-center font-bold text-lg border-2 border-white dark:border-slate-800"
                      style="display: none"
                    >
                      {{ user.name.charAt(0) }}
                    </div>
                  </div>
                  <!-- نام و تاریخ عضویت -->
                  <div class="flex flex-col">
                    <span class="text-sm font-bold text-slate-900 dark:text-white">{{
                      user.name
                    }}</span>
                    <span class="text-[11px] text-slate-500 mt-0.5"
                      >عضویت: <span>{{ convertToJalali(user.joined_at) }}</span></span
                    >
                  </div>
                </div>
              </td>

              <!-- تماس -->
              <td class="py-3 px-4 md:px-6 text-slate-600 dark:text-slate-300 space-y-1.5">
                <div class="flex items-center gap-2 text-xs">
                  <i class="pi pi-envelope text-slate-400"></i>
                  <span dir="ltr">{{ user.email }}</span>
                </div>
                <div class="flex items-center gap-2 text-xs">
                  <i class="pi pi-phone text-slate-400"></i>
                  <span dir="ltr">{{ user.mobile || 'ثبت نشده' }}</span>
                </div>
              </td>

              <!-- وضعیت امنیتی و تاییدات -->
              <td class="py-3 px-4 md:px-6">
                <div class="flex flex-col gap-2.5">
                  <!-- وضعیت ایمیل -->
                  <div class="flex flex-col">
                    <span
                      :class="user.is_email_verified ? 'text-emerald-600' : 'text-slate-400'"
                      class="text-[11px] flex items-center gap-1.5 font-medium"
                    >
                      <i
                        :class="
                          user.is_email_verified ? 'pi pi-check-circle' : 'pi pi-times-circle'
                        "
                      ></i>
                      ایمیل: {{ user.is_email_verified ? 'تایید شده' : 'تایید نشده' }}
                    </span>
                    <span
                      v-if="user.is_email_verified && user.email_verified_at"
                      class="text-[10px] text-slate-400 pr-5"
                    >
                      {{ convertToJalali(user.email_verified_at) }}
                    </span>
                  </div>

                  <!-- وضعیت موبایل -->
                  <div class="flex flex-col">
                    <span
                      :class="user.is_mobile_verified ? 'text-emerald-600' : 'text-slate-400'"
                      class="text-[11px] flex items-center gap-1.5 font-medium"
                    >
                      <i
                        :class="
                          user.is_mobile_verified ? 'pi pi-check-circle' : 'pi pi-times-circle'
                        "
                      ></i>
                      موبایل: {{ user.is_mobile_verified ? 'تایید شده' : 'تایید نشده' }}
                    </span>
                    <span
                      v-if="user.is_mobile_verified && user.mobile_verified_at"
                      class="text-[10px] text-slate-400 pr-5"
                    >
                      {{ convertToJalali(user.mobile_verified_at) }}
                    </span>
                  </div>

                  <!-- ورود دو مرحله‌ای -->
                  <span
                    :class="user.is_two_factor_enabled ? 'text-indigo-600' : 'text-slate-400'"
                    class="text-[11px] flex items-center gap-1.5 font-medium border-t border-slate-100 dark:border-slate-700 pt-1.5"
                  >
                    <i class="pi pi-shield"></i>
                    ورود دو مرحله‌ای: {{ user.is_two_factor_enabled ? 'فعال' : 'غیرفعال' }}
                  </span>
                </div>
              </td>

              <!-- نقش -->
              <td class="py-3 px-4 md:px-6">
                <span
                  :class="
                    user.role === 'admin'
                      ? 'bg-purple-100 text-purple-700 border-purple-200'
                      : 'bg-slate-100 text-slate-700 border-slate-200'
                  "
                  class="px-2.5 py-1 rounded-lg text-xs font-medium border"
                >
                  {{ user.role === 'admin' ? 'مدیر سیستم' : 'کاربر عادی' }}
                </span>
              </td>

              <!-- دکمه‌های عملیات (حذف کلاس‌های مخفی کننده) -->
              <!-- دکمه‌های عملیات -->
              <td class="py-3 px-4 md:px-6 text-left">
                <div class="flex items-center justify-end gap-2">
                  <button
                    class="flex items-center gap-1.5 px-3 py-1.5 bg-blue-400 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-blue-300 dark:hover:bg-indigo-900/50 hover:text-white dark:hover:text-indigo-400 transition-colors rounded-lg text-xs font-medium border border-slate-200 dark:border-slate-600"
                    title="ویرایش"
                    @click="openEditModal(user)"
                  >
                    <i class="pi pi-cog"></i>
                    <span>ویرایش</span>
                  </button>

                  <button
                    class="flex items-center gap-1.5 px-3 py-1.5 bg-rose-400 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-rose-300 dark:hover:bg-rose-900/50 hover:text-white dark:hover:text-rose-400 transition-colors rounded-lg text-xs font-medium border border-slate-200 dark:border-slate-600"
                    title="حذف"
                    @click="openDeleteModal(user)"
                  >
                    <i class="pi pi-trash"></i>
                    <span>حذف</span>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- صفحه‌بندی -->
      <div
        v-if="totalPages > 1"
        class="border-t border-slate-100 dark:border-slate-700 p-4 flex flex-col sm:flex-row items-center justify-between gap-4"
      >
        <span class="text-sm text-slate-500 dark:text-slate-400">
          نمایش صفحه {{ currentPage }} از {{ totalPages }} (کل کاربران: {{ totalUsers }})
        </span>
        <div class="flex gap-1">
          <button
            :disabled="currentPage === 1"
            class="px-3 py-1 rounded-md border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
            @click="changePage(currentPage - 1)"
          >
            قبلی
          </button>
          <button
            v-for="page in totalPages"
            :key="page"
            :class="[
              'w-8 h-8 rounded-md flex items-center justify-center text-sm transition-colors border',
              currentPage === page
                ? 'bg-indigo-600 text-white border-indigo-600'
                : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700',
            ]"
            @click="changePage(page)"
          >
            {{ page }}
          </button>
          <button
            :disabled="currentPage === totalPages"
            class="px-3 py-1 rounded-md border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
            @click="changePage(currentPage + 1)"
          >
            بعدی
          </button>
        </div>
      </div>
    </div>

    <!-- مودال ایجاد کاربر -->
    <div
      v-if="showCreateModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4"
    >
      <div
        class="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto shadow-xl"
      >
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-lg font-bold text-slate-800 dark:text-white">ایجاد کاربر جدید</h3>
          <button
            class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            @click="closeModals"
          >
            <i class="pi pi-times"></i>
          </button>
        </div>

        <form class="space-y-4" @submit.prevent="handleCreateUser">
          <input
            v-model="createForm.name"
            class="w-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            placeholder="نام و نام خانوادگی"
            required
            type="text"
          />
          <input
            v-model="createForm.email"
            class="w-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            placeholder="آدرس ایمیل"
            required
            type="email"
          />
          <input
            v-model="createForm.mobile"
            class="w-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            placeholder="شماره موبایل (اختیاری)"
            type="text"
          />
          <input
            v-model="createForm.password"
            class="w-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            minlength="8"
            placeholder="رمز عبور (حداقل ۸ کاراکتر)"
            required
            type="password"
          />
          <select
            v-model="createForm.role"
            class="w-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-slate-600 dark:text-slate-300"
          >
            <option disabled value="">انتخاب نقش کاربری...</option>
            <option value="user">کاربر عادی</option>
            <option value="admin">مدیر سیستم</option>
          </select>

          <div class="flex justify-end gap-3 mt-8">
            <button
              class="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 rounded-xl text-sm font-medium transition-colors w-full sm:w-auto"
              type="button"
              @click="closeModals"
            >
              انصراف
            </button>
            <button
              :disabled="isActionLoading"
              class="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-medium transition-colors w-full sm:w-auto flex items-center justify-center gap-2 disabled:opacity-50"
              type="submit"
            >
              <i v-if="isActionLoading" class="pi pi-spin pi-spinner text-xs"></i>
              {{ isActionLoading ? 'در حال ثبت...' : 'ثبت کاربر' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal ویرایش کاربر -->
    <div
      v-if="showEditModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm"
    >
      <div
        class="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-md shadow-xl overflow-hidden max-h-[90vh] overflow-y-auto"
      >
        <div
          class="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center"
        >
          <h3 class="font-bold text-lg text-slate-800 dark:text-white">مدیریت کاربر</h3>
          <button
            class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            @click="closeModals"
          >
            <i class="pi pi-times"></i>
          </button>
        </div>
        <div class="p-6 space-y-6">
          <div class="flex items-center gap-3 bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl">
            <i class="pi pi-user text-indigo-500 text-xl"></i>
            <div>
              <p class="font-medium text-slate-800 dark:text-white">{{ selectedUser?.name }}</p>
              <p class="text-xs text-slate-500">{{ selectedUser?.email }}</p>
            </div>
          </div>

          <select
            v-model="editForm.role"
            class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500 text-slate-600 dark:text-slate-300"
          >
            <option value="user">کاربر عادی</option>
            <option value="admin">مدیر سیستم</option>
          </select>

          <div class="border-t border-slate-100 dark:border-slate-700 pt-4">
            <button
              :disabled="isActionLoading"
              class="w-full py-2.5 px-4 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 rounded-xl font-medium text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              @click="handleSendResetLink"
            >
              <i class="pi pi-key"></i>
              ارسال لینک بازیابی رمز عبور
            </button>
          </div>
        </div>
        <div
          class="p-4 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-700 flex justify-end gap-3"
        >
          <button
            class="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-sm w-full sm:w-auto"
            @click="closeModals"
          >
            انصراف
          </button>
          <button
            :disabled="isActionLoading"
            class="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white transition-colors text-sm flex items-center justify-center gap-2 disabled:opacity-50 w-full sm:w-auto"
            @click="handleUpdateRole"
          >
            <i v-if="isActionLoading" class="pi pi-spin pi-spinner text-xs"></i>
            ذخیره تغییرات
          </button>
        </div>
      </div>
    </div>

    <!-- Modal تایید حذف -->
    <div
      v-if="showDeleteModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm"
    >
      <div
        class="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-sm shadow-xl p-6 text-center mx-4"
      >
        <div
          class="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl"
        >
          <i class="pi pi-exclamation-triangle"></i>
        </div>
        <h3 class="font-bold text-lg text-slate-800 dark:text-white mb-2">حذف کاربر</h3>
        <p class="text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
          آیا از حذف کامل کاربر
          <span class="font-bold text-slate-700 dark:text-slate-300"
            >"{{ selectedUser?.name }}"</span
          >
          اطمینان دارید؟ این عملیات غیرقابل بازگشت است.
        </p>
        <div class="flex flex-col sm:flex-row justify-center gap-3">
          <button
            class="px-5 py-2.5 rounded-xl text-slate-600 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600 transition-colors font-medium text-sm w-full"
            @click="closeModals"
          >
            انصراف
          </button>
          <button
            :disabled="isActionLoading"
            class="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white transition-colors font-medium text-sm flex items-center justify-center gap-2 w-full disabled:opacity-50"
            @click="handleDeleteUser"
          >
            <i v-if="isActionLoading" class="pi pi-spin pi-spinner text-xs"></i>
            حذف نهایی
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import {
  createUserApi,
  deleteUserApi,
  getAdminUsersApi,
  sendUserResetPasswordApi,
  updateUserRoleApi,
} from '@/api/adminApi'
import { useNotificationStore } from '@/stores/notification'

interface User {
  id: number
  name: string
  email: string
  mobile: string | null
  role: string
  is_email_verified: boolean
  email_verified_at: string | null
  is_mobile_verified: boolean
  mobile_verified_at: string | null
  is_two_factor_enabled: boolean
  joined_at: string
  avatar?: {
    id: number
    url: string
    urls: any
    alt: string
  } | null
}

const users = ref<User[]>([])
const loading = ref(true)
const searchQuery = ref('')
const currentPage = ref(1)
const totalPages = ref(1)
const totalUsers = ref(0)
const notify = useNotificationStore()

const showEditModal = ref(false)
const showDeleteModal = ref(false)
const showCreateModal = ref(false)
const selectedUser = ref<User | null>(null)
const isActionLoading = ref(false)

const editForm = ref({ role: 'user' })
const createForm = ref({ name: '', email: '', mobile: '', password: '', role: '' })

// تابع تبدیل تاریخ میلادی به شمسی
const convertToJalali = (dateString: string | null) => {
  if (!dateString) return ''
  try {
    // تبدیل رشته تاریخ به شیء Date (جایگزینی / با - برای پشتیبانی بهتر مرورگرها)
    const dateObj = new Date(dateString.replace(/\//g, '-'))

    // اگر تاریخ نامعتبر بود، همان رشته اصلی را برگردان
    if (isNaN(dateObj.getTime())) return dateString

    // فرمت کردن تاریخ به صورت شمسی
    const formatter = new Intl.DateTimeFormat('fa-IR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })

    // خروجی نهایی به شکل "۱۴۰۵/۰۱/۱۵ ۱۴:۳۰"
    return formatter.format(dateObj)
  } catch (error) {
    return dateString
  }
}

// مدیریت خطای لود عکس (تبدیل به حرف اول اسم)
const handleImageError = (e: Event) => {
  const target = e.target as HTMLElement
  target.style.display = 'none'
  if (target.nextElementSibling) {
    ;(target.nextElementSibling as HTMLElement).style.display = 'flex'
  }
}

const fetchUsers = async () => {
  loading.value = true
  try {
    const response = await getAdminUsersApi({
      search: searchQuery.value,
      page: currentPage.value,
    })

    users.value = response.data.data

    if (response.data.meta) {
      totalPages.value = response.data.meta.last_page
      totalUsers.value = response.data.meta.total
    } else if (response.data.last_page) {
      totalPages.value = response.data.last_page
      totalUsers.value = response.data.total
    } else {
      totalPages.value = 1
      totalUsers.value = users.value.length
    }
  } catch (error) {
    console.error('خطا در دریافت لیست کاربران:', error)
    notify.error('خطا در دریافت اطلاعات کاربران از سرور')
  } finally {
    loading.value = false
  }
}

const changePage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

watch(currentPage, () => {
  fetchUsers()
})

let searchTimeout: ReturnType<typeof setTimeout> | null = null
watch(searchQuery, () => {
  if (searchTimeout) clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    currentPage.value = 1
    fetchUsers()
  }, 500)
})

const closeModals = () => {
  showEditModal.value = false
  showDeleteModal.value = false
  showCreateModal.value = false
  selectedUser.value = null
  isActionLoading.value = false
  createForm.value = { name: '', email: '', mobile: '', password: '', role: '' }
}

const openEditModal = (user: User) => {
  selectedUser.value = user
  editForm.value.role = user.role
  showEditModal.value = true
}

const openDeleteModal = (user: User) => {
  selectedUser.value = user
  showDeleteModal.value = true
}

const openCreateModal = () => {
  showCreateModal.value = true
}

const handleCreateUser = async () => {
  if (!createForm.value.role) {
    createForm.value.role = 'user'
  }

  isActionLoading.value = true
  try {
    await createUserApi(createForm.value)
    notify.success('کاربر با موفقیت ایجاد شد')
    closeModals()
    fetchUsers()
  } catch (error: any) {
    notify.error(error.response?.data?.message || 'خطا در ایجاد کاربر')
  } finally {
    isActionLoading.value = false
  }
}

const handleUpdateRole = async () => {
  if (!selectedUser.value) return
  isActionLoading.value = true
  try {
    await updateUserRoleApi(selectedUser.value.id, { role: editForm.value.role })
    notify.success('نقش کاربر با موفقیت به‌روزرسانی شد')
    closeModals()
    fetchUsers()
  } catch (error: any) {
    notify.error(error.response?.data?.message || 'خطا در تغییر نقش کاربر')
  } finally {
    isActionLoading.value = false
  }
}

const handleDeleteUser = async () => {
  if (!selectedUser.value) return
  isActionLoading.value = true
  try {
    await deleteUserApi(selectedUser.value.id)
    notify.success('کاربر با موفقیت حذف شد')
    closeModals()
    if (users.value.length === 1 && currentPage.value > 1) {
      currentPage.value--
    } else {
      fetchUsers()
    }
  } catch (error: any) {
    notify.error(error.response?.data?.message || 'خطا در حذف کاربر')
  } finally {
    isActionLoading.value = false
  }
}

const handleSendResetLink = async () => {
  if (!selectedUser.value) return
  isActionLoading.value = true
  try {
    await sendUserResetPasswordApi(selectedUser.value.id)
    notify.info(`لینک بازیابی رمز عبور به ایمیل ${selectedUser.value.email} ارسال شد`)
    closeModals()
  } catch (error: any) {
    notify.error(error.response?.data?.message || 'خطا در ارسال لینک بازیابی')
  } finally {
    isActionLoading.value = false
  }
}

onMounted(() => {
  fetchUsers()
})
</script>
