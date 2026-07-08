import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createHead } from '@vueuse/head'
import { defaultConfig, plugin as FormKit } from '@formkit/vue'
import { fa } from '@formkit/i18n'
import formkitConfig from './formkit.config'

import App from './App.vue'
import router from './router'

import '@/styles/main.css'
import '@fortawesome/fontawesome-free/css/all.min.css'
import { useAuthStore } from '@/stores/auth'

// ---------------------------
const app = createApp(App)

// Pinia
const pinia = createPinia()
app.use(pinia)

const auth = useAuthStore()

// 🔥 بازیابی سشن
auth.restoreSession()

// 🔥 Sync Logout بین تمام تب‌ها
auth.initAuthSync()

// 🔥 تشخیص اکسپایر شدن سشن
auth.watchSessionExpiration()

// 🔥 Auto-refresh سشن
auth.autoRefreshSession()

// ---------------------------
app.use(router)
app.use(createHead())

const fk = typeof formkitConfig === 'function' ? formkitConfig() : formkitConfig
app.use(FormKit, defaultConfig({ ...fk, locales: { fa }, locale: 'fa' }))

app.mount('#app')
