<template>
  <div
    class="p-4 md:p-8 space-y-8 animate-in fade-in duration-700 font-iransans text-right"
    dir="rtl"
  >
    <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
      <div>
        <h1
          class="text-3xl font-iransans-bold text-slate-800 dark:text-white flex items-center gap-3"
        >
          <span
            class="bg-indigo-600 text-white p-3 rounded-2xl shadow-xl shadow-indigo-200 dark:shadow-none"
            >📡</span
          >
          مرکز مدیریت ارتباطات
        </h1>
        <p class="text-slate-500 dark:text-slate-400 mt-2 font-medium">
          پیکربندی درگاه‌ها، مدیریت پترن‌ها و مانیتورینگ زنده
        </p>
      </div>

      <div class="flex flex-wrap gap-3 w-full lg:w-auto">
        <div
          class="bg-indigo-50 dark:bg-indigo-900/20 px-6 py-4 rounded-[1.5rem] border border-indigo-100 dark:border-indigo-800 shadow-sm min-w-[180px]"
        >
          <p
            class="text-indigo-600 dark:text-indigo-400 text-[10px] font-bold uppercase tracking-wider mb-1"
          >
            اعتبار پنل پیامک
          </p>
          <p class="text-2xl font-iransans-bold text-indigo-800 dark:text-indigo-200">
            {{ formatCurrency(stats.sms_balance) }} <span class="text-xs font-normal">ریال</span>
          </p>
        </div>
        <div
          class="bg-white dark:bg-slate-900 px-6 py-4 rounded-[1.5rem] border border-slate-100 dark:border-slate-800 shadow-sm"
        >
          <p class="text-emerald-600 text-[10px] font-bold uppercase mb-1">
            ارسال موفق {{ filters.type !== 'all' ? `(${filters.type})` : '' }}
          </p>
          <p class="text-2xl font-iransans-bold text-slate-800 dark:text-emerald-400">
            {{ stats.total_sent || 0 }}
          </p>
        </div>
        <div
          class="bg-white dark:bg-slate-900 px-6 py-4 rounded-[1.5rem] border border-slate-100 dark:border-slate-800 shadow-sm"
        >
          <p class="text-rose-600 text-[10px] font-bold uppercase tracking-wider mb-1">
            خطاها {{ filters.type !== 'all' ? `(${filters.type})` : '' }}
          </p>
          <p class="text-2xl font-iransans-bold text-slate-800 dark:text-rose-400">
            {{ stats.total_failed || 0 }}
          </p>
        </div>
      </div>
    </div>

    <div
      class="flex gap-1 bg-slate-100 dark:bg-slate-800/50 p-1.5 rounded-[1.5rem] w-fit overflow-x-auto"
    >
      <button
        v-for="tab in tabs"
        :key="tab.id"
        :class="
          activeTab === tab.id
            ? 'bg-white dark:bg-slate-700 shadow-md text-indigo-600 dark:text-indigo-300'
            : 'text-slate-500 hover:text-slate-700'
        "
        class="px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 flex items-center gap-2 whitespace-nowrap"
        @click="activeTab = tab.id"
      >
        <span>{{ tab.i }}</span> {{ tab.n }}
      </button>
    </div>

    <div class="min-h-[500px]">
      <div v-if="activeTab === 'logs'" class="space-y-6 animate-in slide-in-from-bottom-4">
        <div
          class="bg-white dark:bg-slate-900 p-4 rounded-[2rem] shadow-sm border border-slate-50 dark:border-slate-800 flex flex-wrap gap-4 items-center"
        >
          <select
            v-model="filters.type"
            class="bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm px-4 py-2.5 outline-none"
          >
            <option value="all">همه کانال‌ها</option>
            <option value="sms">پیامک</option>
            <option value="email">ایمیل</option>
            <option value="telegram">تلگرام</option>
          </select>
          <div class="relative flex-1 min-w-[200px]">
            <input
              v-model="filters.search"
              class="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm px-4 py-2.5 pr-10 outline-none"
              placeholder="جستجوی آنی گیرنده یا Trace ID..."
            />
            <span class="absolute right-3 top-2.5 opacity-30">🔍</span>
          </div>
          <div v-if="loadingLogs" class="text-[10px] text-indigo-500 font-bold animate-pulse">
            در حال بروزرسانی...
          </div>
        </div>
        <div
          class="bg-white dark:bg-slate-900 rounded-[2rem] shadow-sm border border-slate-50 dark:border-slate-800 overflow-hidden"
        >
          <table class="w-full text-right border-collapse">
            <thead>
              <tr
                class="bg-slate-50/50 dark:bg-slate-800/50 text-slate-500 text-[11px] font-bold uppercase"
              >
                <th class="p-5">وضعیت / نوع</th>
                <th class="p-5">گیرنده</th>
                <th class="p-5">زمان ارسال</th>
                <th class="p-5">Trace ID</th>
                <th class="p-5 text-center">جزئیات</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-50 dark:divide-slate-800">
              <tr
                v-for="log in logs"
                :key="log.id"
                class="hover:bg-slate-50/50 transition-all text-sm text-slate-700 dark:text-slate-300"
              >
                <td class="p-5">
                  <div class="flex items-center gap-3">
                    <span
                      :class="statusClass(log.status)"
                      class="w-2.5 h-2.5 rounded-full shadow-sm"
                    ></span>
                    <span class="font-bold uppercase text-[10px] tracking-widest">{{
                      log.type
                    }}</span>
                  </div>
                </td>
                <td class="p-5 font-mono text-xs">{{ log.recipient }}</td>
                <td class="p-5 text-xs text-slate-500 font-medium">
                  {{ formatJalali(log.created_at) }}
                </td>
                <td class="p-5 font-mono text-[10px] text-slate-400">#{{ log.trace_id }}</td>
                <td class="p-5 text-center">
                  <button
                    class="p-2.5 hover:bg-indigo-50 dark:hover:bg-slate-800 rounded-xl transition-colors"
                    @click="selectedLog = log"
                  >
                    🔍
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div v-else-if="activeTab === 'patterns'" class="space-y-8 animate-in slide-in-from-right">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div
            class="lg:col-span-1 bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] shadow-sm border border-slate-50 dark:border-slate-800 h-fit"
          >
            <h3 class="text-lg font-iransans-bold mb-6 flex items-center gap-2">
              <span class="bg-emerald-100 text-emerald-600 p-2 rounded-lg text-sm">✚</span> ثبت پترن
              جدید
            </h3>
            <div class="space-y-4">
              <input v-model="patternForm.title" class="input-style" placeholder="عنوان پترن" />
              <div class="grid grid-cols-2 gap-3">
                <input
                  v-model="patternForm.pattern_code"
                  class="input-style font-mono"
                  placeholder="کد پترن"
                />
                <input
                  v-model="patternForm.alias"
                  class="input-style font-mono"
                  placeholder="Alias"
                />
              </div>
              <div class="flex flex-wrap gap-2 p-2 bg-slate-50 dark:bg-slate-800 rounded-xl">
                <span
                  v-for="(v, i) in patternForm.variables"
                  :key="i"
                  class="bg-indigo-600 text-white px-2 py-1 rounded-lg text-xs flex items-center gap-1"
                >
                  {{ v }} <button @click="patternForm.variables.splice(i, 1)">×</button>
                </span>
                <input
                  class="bg-transparent border-none focus:ring-0 text-sm flex-1 outline-none dark:text-white"
                  placeholder="نام متغیر (مثلاً code) را بنویسید و Enter بزنید..."
                  @keydown.enter.prevent="addVariableTag"
                />
              </div>
              <button
                :disabled="savingPattern"
                class="w-full bg-indigo-600 text-white py-3.5 rounded-xl font-bold hover:bg-indigo-700 transition-colors"
                @click="savePattern"
              >
                {{ savingPattern ? 'در حال ثبت...' : 'ثبت پترن نهایی' }}
              </button>
            </div>
          </div>
          <div
            class="lg:col-span-2 bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-sm border border-slate-50 dark:border-slate-800 overflow-hidden"
          >
            <div class="p-6 border-b dark:border-slate-800 flex justify-between items-center">
              <h3 class="font-iransans-bold">لیست پترن‌های تعریف شده</h3>
              <span
                class="text-xs bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full text-slate-500"
                >{{ patterns.length }} پترن</span
              >
            </div>
            <div class="overflow-x-auto">
              <table class="w-full text-right">
                <thead>
                  <tr
                    class="bg-slate-50/50 dark:bg-slate-800/50 text-[10px] text-slate-400 font-bold uppercase"
                  >
                    <th class="p-4">عنوان / مستعار</th>
                    <th class="p-4">کد پترن</th>
                    <th class="p-4">متغیرها</th>
                    <th class="p-4 text-center">عملیات</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-50 dark:divide-slate-800">
                  <tr
                    v-for="p in patterns"
                    :key="p.id"
                    class="text-sm hover:bg-slate-50/50 transition-colors"
                  >
                    <td class="p-4">
                      <p class="font-bold text-slate-700 dark:text-slate-200">{{ p.title }}</p>
                      <p class="text-[10px] font-mono text-indigo-500 uppercase">{{ p.alias }}</p>
                    </td>
                    <td class="p-4 font-mono text-xs text-slate-500">{{ p.pattern_code }}</td>
                    <td class="p-4">
                      <div class="flex flex-wrap gap-1">
                        <span
                          v-for="v in Array.isArray(p.variables)
                            ? p.variables
                            : JSON.parse(p.variables || '[]')"
                          :key="v"
                          class="text-[9px] bg-indigo-50 dark:bg-indigo-900/30 px-1.5 py-0.5 rounded text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-800"
                        >
                          %{{ v }}%
                        </span>
                      </div>
                    </td>
                    <td class="p-4 text-center">
                      <button
                        class="text-rose-400 hover:text-rose-600 p-2 transition-transform hover:scale-110"
                        @click="deletePattern(p.id)"
                      >
                        🗑
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div v-else-if="activeTab === 'settings'" class="animate-in slide-in-from-left">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div
            v-for="(fields, group) in settingGroups"
            :key="group"
            class="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-sm border border-slate-50 dark:border-slate-800"
          >
            <h3 class="text-xl font-iransans-bold mb-6 flex items-center gap-2">
              <span class="w-1.5 h-6 bg-indigo-500 rounded-full"></span> تنظیمات {{ group }}
            </h3>
            <div class="space-y-5">
              <div v-for="field in fields" :key="field.key">
                <label
                  class="block mb-2 text-xs font-bold text-slate-400 uppercase tracking-wider"
                  >{{ field.label }}</label
                >
                <input
                  v-model="settings[field.key]"
                  :type="field.type || 'text'"
                  class="w-full px-4 py-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-indigo-500/20 outline-none transition-all font-mono text-sm dark:text-white"
                />
              </div>
            </div>
          </div>

          <div
            class="md:col-span-2 bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-sm border border-slate-50 dark:border-slate-800"
          >
            <h3 class="text-xl font-iransans-bold mb-6 flex items-center gap-2">
              <span class="w-1.5 h-6 bg-emerald-500 rounded-full"></span>
              پیکربندی سرویس‌های ایمیل (SMTP)
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
              <div
                v-for="acc in ['sale', 'support', 'info', 'noreply']"
                :key="acc"
                class="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-700"
              >
                <p class="font-bold text-sm mb-4 border-b pb-2 capitalize flex justify-between">
                  <span>اکانت {{ acc }}</span>
                  <span class="text-[10px] text-emerald-500">Active</span>
                </p>
                <div class="space-y-4">
                  <div
                    v-for="f in [
                      { k: `mail_${acc}_host`, l: 'SMTP Host' },
                      { k: `mail_${acc}_port`, l: 'Port' },
                      { k: `mail_${acc}_username`, l: 'User / Email' },
                      { k: `mail_${acc}_password`, l: 'Password', t: 'password' },
                      { k: `mail_${acc}_address`, l: 'From Email' },
                      { k: `mail_${acc}_name`, l: 'From Name' },
                    ]"
                    :key="f.k"
                  >
                    <label class="text-[10px] font-bold text-slate-400 uppercase">{{ f.l }}</label>
                    <input
                      v-model="settings[f.k]"
                      :placeholder="f.l"
                      :type="f.t || 'text'"
                      class="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-xs focus:ring-1 focus:ring-emerald-500 outline-none dark:text-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="flex justify-end">
          <button
            :disabled="saving"
            class="bg-indigo-600 text-white px-10 py-4 rounded-2xl font-bold shadow-lg hover:bg-indigo-700 flex items-center gap-2 transition-all"
            @click="saveSettings"
          >
            <span
              v-if="saving"
              class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"
            ></span>
            {{ saving ? 'در حال ذخیره‌سازی...' : 'بروزرسانی پیکربندی سیستم' }}
          </button>
        </div>
      </div>

      <div v-else-if="activeTab === 'test'" class="max-w-3xl mx-auto w-full animate-in zoom-in-95">
        <div
          class="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-xl border border-slate-50 dark:border-slate-800"
        >
          <h3 class="text-2xl font-iransans-bold text-slate-800 dark:text-white mb-8">
            شبیه‌ساز ارسال پیام (تست)
          </h3>
          <div class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block mb-2 text-xs font-bold text-slate-400">نوع کانال ارسال</label>
                <select
                  v-model="testForm.type"
                  class="w-full px-4 py-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border-none font-bold outline-none dark:text-white"
                >
                  <option value="sms">SMS (متن ساده)</option>
                  <option value="sms_pattern">SMS (بر اساس پترن)</option>
                  <option value="telegram">Telegram Bot</option>
                  <option value="email">Email (SMTP)</option>
                </select>
              </div>
              <div v-if="testForm.type === 'email'">
                <label class="block mb-2 text-xs font-bold text-slate-400">از اکانت:</label>
                <select
                  v-model="testForm.email_account"
                  class="w-full px-4 py-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-900/10 border-none font-bold outline-none dark:text-white"
                >
                  <option value="info">Info</option>
                  <option value="sale">Sale</option>
                  <option value="support">Support</option>
                  <option value="noreply">No-Reply</option>
                </select>
              </div>

              <div>
                <label class="block mb-2 text-xs font-bold text-slate-400">گیرنده تست</label>
                <input
                  v-model="testForm.recipient"
                  class="w-full px-4 py-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border-none text-left font-mono outline-none dark:text-white"
                  placeholder="0912... / email"
                />
              </div>
            </div>

            <div v-if="testForm.type !== 'sms_pattern'">
              <label class="block mb-2 text-xs font-bold text-slate-400">محتوای پیام</label>
              <textarea
                v-model="testForm.message"
                class="w-full px-4 py-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border-none resize-none outline-none dark:text-white"
                rows="4"
              ></textarea>
            </div>
            <div v-else class="space-y-4">
              <select
                v-model="selectedPatternAlias"
                class="w-full px-4 py-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border-none font-bold outline-none dark:text-white"
                @change="initPatternVars"
              >
                <option value="">انتخاب پترن مورد نظر...</option>
                <option v-for="p in patterns" :key="p.id" :value="p.alias">{{ p.title }}</option>
              </select>
              <div
                v-if="testForm.variables"
                class="grid grid-cols-2 gap-4 bg-slate-50 dark:bg-slate-800 p-6 rounded-2xl"
              >
                <div v-for="(val, key) in testForm.variables" :key="key">
                  <label class="block mb-1 text-[10px] font-bold text-slate-400 uppercase">{{
                    key
                  }}</label>
                  <input
                    v-model="testForm.variables[key]"
                    class="w-full bg-white dark:bg-slate-700 border-none rounded-lg px-3 py-2 text-sm dark:text-white"
                  />
                </div>
              </div>
            </div>

            <button
              :disabled="testing"
              class="w-full bg-slate-800 dark:bg-indigo-600 text-white py-4 rounded-2xl font-bold shadow-lg hover:scale-[1.01] transition-all"
              @click="runTest"
            >
              {{ testing ? 'در حال ارسال به صف...' : 'شروع عملیات تست ارسال' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="selectedLog"
      class="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md"
    >
      <div
        class="bg-white dark:bg-slate-900 w-full max-w-4xl rounded-[2.5rem] p-8 relative shadow-2xl animate-in zoom-in-95"
      >
        <button
          class="absolute top-8 left-8 text-2xl hover:scale-110 transition-transform dark:text-white"
          @click="selectedLog = null"
        >
          ✕
        </button>
        <h2 class="text-2xl font-iransans-bold mb-8 dark:text-white"># جزئیات تراکنش ارتباطی</h2>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div
            class="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700"
          >
            <p class="text-slate-400 text-xs mb-1">وضعیت نهایی:</p>
            <span
              :class="
                selectedLog.status === 'sent'
                  ? 'text-emerald-500'
                  : selectedLog.status === 'pending'
                    ? 'text-amber-500'
                    : 'text-rose-500'
              "
              class="font-bold uppercase"
            >
              {{ selectedLog.status }}
            </span>
          </div>
          <div
            class="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700"
          >
            <p class="text-slate-400 text-xs mb-1">Trace ID:</p>
            <span class="font-mono text-indigo-500">{{ selectedLog.trace_id }}</span>
          </div>
        </div>

        <div class="space-y-4">
          <p class="text-xs font-bold text-slate-400 uppercase tracking-wider">
            دیتا و پاسخ درگاه:
          </p>
          <pre
            class="bg-slate-900 p-6 rounded-[1.5rem] text-indigo-100 text-[11px] font-mono overflow-auto max-h-[300px]"
            dir="ltr"
            >{{ JSON.stringify(selectedLog, null, 2) }}</pre
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, reactive, ref, watch } from 'vue'
import axios from '@/lib/axios'
import { useNotificationStore } from '@/stores/notification'

// --- State ---
const notify = useNotificationStore()
const activeTab = ref('logs')
const logs = ref([])
const patterns = ref([])
const stats = ref({ total_sent: 0, total_failed: 0, sms_balance: 0 })
const settings = ref({})
const selectedLog = ref(null)
const saving = ref(false)
const testing = ref(false)
const savingPattern = ref(false)
const loadingLogs = ref(false)
const filters = reactive({ type: 'all', search: '' })

const testForm = reactive({
  type: 'sms',
  recipient: '',
  message: '',
  variables: null,
  email_account: 'info',
})
const selectedPatternAlias = ref('')
const patternForm = reactive({ title: '', pattern_code: '', alias: '', variables: [] })

let refreshInterval = null

const tabs = [
  { id: 'logs', n: 'مانیتورینگ', i: '📊' },
  { id: 'patterns', n: 'مدیریت پترن‌ها', i: '🧩' },
  { id: 'settings', n: 'تنظیمات درگاه', i: '⚙️' },
  { id: 'test', n: 'تست عملیاتی', i: '🧪' },
]

const settingGroups = {
  SMS: [
    { key: 'sms_api_key', label: 'API Key (IPPanel)', type: 'password' },
    { key: 'sms_endpoint', label: 'API Endpoint' },
    { key: 'sms_sender', label: 'Sender Number' },
  ],
  Telegram: [
    { key: 'telegram_bot_token', label: 'Bot Token', type: 'password' },
    { key: 'telegram_chat_id', label: 'Admin Chat ID' },
  ],
  General: [{ key: 'log_retention_days', label: 'مدت نگهداری لاگ‌ها (روز)', type: 'number' }],
}

// --- Watchers for Live Monitoring ---

// 1. Debounced Search & Live Filter
let debounceTimer
watch(
  () => [filters.type, filters.search],
  () => {
    clearTimeout(debounceTimer)
    debounceTimer = setTimeout(() => {
      fetchLogs(false)
    }, 400)
  },
)

// 2. Tab-based Polling Control
watch(activeTab, (newTab) => {
  if (newTab === 'logs') {
    startPolling()
  } else {
    stopPolling()
  }
})

// --- Actions ---

const fetchLogs = async (showLoading = true) => {
  if (showLoading) loadingLogs.value = true
  try {
    const { data } = await axios.get('/admin/communication/logs', { params: filters })
    logs.value = data.data || []
    fetchStats()
  } catch (e) {
    console.error('Fetch error')
  } finally {
    loadingLogs.value = false
  }
}

const fetchStats = async () => {
  const { data } = await axios.get('/admin/communication/stats', {
    params: { type: filters.type },
  })
  stats.value = data
}

const fetchSettings = async () => {
  const { data } = await axios.get('/admin/communication/settings')
  settings.value = data
}

const fetchPatterns = async () => {
  const { data } = await axios.get('/admin/communication/patterns')
  patterns.value = data
}

const saveSettings = async () => {
  saving.value = true
  try {
    await axios.post('/admin/communication/settings', { settings: settings.value })
    notify.success('تنظیمات با موفقیت ذخیره و ایمن‌سازی شد.')
  } catch (e) {
    notify.error('خطا در ذخیره‌سازی تنظیمات.')
  } finally {
    saving.value = false
  }
}

const savePattern = async () => {
  savingPattern.value = true
  try {
    await axios.post('/admin/communication/patterns', patternForm)
    notify.success('پترن جدید ثبت شد.')
    fetchPatterns()
    Object.assign(patternForm, { title: '', pattern_code: '', alias: '', variables: [] })
  } catch (e) {
    notify.error('خطا در ثبت پترن.')
  } finally {
    savingPattern.value = false
  }
}

const deletePattern = async (id) => {
  if (confirm('آیا از حذف این پترن اطمینان دارید؟')) {
    try {
      await axios.delete(`/admin/communication/patterns/${id}`)
      notify.success('پترن حذف شد.')
      fetchPatterns()
    } catch (e) {
      notify.error('خطا در حذف پترن.')
    }
  }
}

const addVariableTag = (e) => {
  const val = e.target.value.trim()
  if (val && !patternForm.variables.includes(val)) {
    patternForm.variables.push(val)
    e.target.value = ''
  }
}

const initPatternVars = () => {
  const p = patterns.value.find((p) => p.alias === selectedPatternAlias.value)
  if (p) {
    const vars = {}
    const vList = Array.isArray(p.variables) ? p.variables : JSON.parse(p.variables || '[]')
    vList.forEach((v) => (vars[v] = ''))
    testForm.variables = vars
  } else {
    testForm.variables = null
  }
}

const runTest = async () => {
  testing.value = true
  try {
    const payload = { ...testForm, pattern_alias: selectedPatternAlias.value }
    await axios.post('/admin/communication/test', payload)
    notify.success('پیام در صف قرار گرفت.')
    fetchLogs(false)
  } catch (e) {
    notify.error(e.response?.data?.message || 'خطا در ارسال تست.')
  } finally {
    testing.value = false
  }
}

// --- Lifecycle & Polling ---

const startPolling = () => {
  stopPolling()
  refreshInterval = setInterval(() => {
    fetchLogs(false)
  }, 8000) // هر ۸ ثانیه بروزرسانی
}

const stopPolling = () => {
  if (refreshInterval) clearInterval(refreshInterval)
}

const formatJalali = (dateString) => {
  if (!dateString) return '-'
  return new Intl.DateTimeFormat('fa-IR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(new Date(dateString))
}

const formatCurrency = (v) => new Intl.NumberFormat('fa-IR').format(Math.floor(v || 0))

const statusClass = (s) => ({
  'bg-emerald-500 shadow-lg shadow-emerald-500/20': s === 'sent',
  'bg-rose-500 shadow-lg shadow-rose-500/20': s === 'failed',
  'bg-amber-500 animate-pulse': s === 'pending',
})

onMounted(() => {
  fetchLogs()
  fetchSettings()
  fetchPatterns()
  startPolling()
})

onUnmounted(() => {
  stopPolling()
})
</script>

<style scoped>
.input-style {
  @apply w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-indigo-500/20 outline-none transition-all dark:text-white text-sm;
}

/* Custom Scrollbar for Pre tags */
pre::-webkit-scrollbar {
  height: 6px;
  width: 6px;
}
pre::-webkit-scrollbar-thumb {
  @apply bg-slate-700 rounded-full;
}
</style>
