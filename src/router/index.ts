import { createRouter, createWebHistory, RouteLocationNormalized } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useSiteSettingsStore } from '@/stores/siteSettings'

// Layouts
import PublicLayout from '@/layouts/PublicLayout.vue'
import AuthLayout from '@/layouts/AuthLayout.vue'
import UserLayout from '@/layouts/UserLayout.vue'
import AdminLayout from '@/layouts/AdminLayout.vue'

// Views - Public
import Home from '@/views/public/home/Home.vue'
import Products from '@/views/public/Products.vue'
import PublicProductDetail from '@/views/public/ProductDetail/ProductDetail.vue'
import Category from '@/views/public/CategoryProducts.vue'
import CartPage from '@/components/cart/CartPage.vue'
import NotFound from '@/views/public/NotFound.vue'
import Compare from '@/views/public/CompareProducts.vue'
import MaintenanceView from '@/views/public/MaintenanceView.vue'

// Views - Auth
import LoginView from '@/views/auth/LoginView.vue'
import RegisterView from '@/views/auth/RegisterView.vue'
import ForgotPassword from '@/views/auth/ForgotPasswordView.vue'
import ResetPassword from '@/views/auth/ForgotPasswordView.vue'

// Views - User
import UserDashboard from '@/views/user/Dashboard.vue'
import CheckoutPage from '@/views/user/CheckoutPage.vue'
import UserOrders from '@/views/user/UserOrders.vue'
import UserFavorites from '@/views/user/UserFavorites.vue'
import UserProfile from '@/views/user/UserProfile.vue'
import UserAddresses from '@/views/user/UserAddresses.vue'
import UserReviews from '@/views/user/UserReviews.vue'
import UserTransactions from '@/views/user/UserTransactions.vue'
import PaymentReceipt from '@/views/user/PaymentReceipt.vue'
import UserOrderDetail from '@/views/user/UserOrderDetail.vue'

// Views - Admin
import AdminDashboard from '@/views/admin/Dashboard.vue'
import AdminProducts from '@/views/admin/products/AdminProducts.vue'
import AdminUsers from '@/views/admin/Users/Users.vue'
import AdminLogs from '@/views/admin/Logs/LogDashboard.vue'
import logState from '@/views/admin/Logs/LogsStatsView.vue'
import ApiTest from '@/views/admin/Testes/ApiSandbox.vue'
import AdminProductVariants from '@/views/admin/attributes/AttributeIndex.vue'
import ExpertiseManager from '@/views/admin/categories/ExpertiseManager.vue'
import AdminSiteSettings from '@/views/admin/settings/AdminSiteSettings.vue'
import AdminReviews from '@/views/admin/reviews/AdminReviews.vue'
import AdminQuestions from '@/views/admin/questions/AdminQuestions.vue'
import SystemImages from '@/views/admin/settings/SystemImages.vue'
import AdminProductCreate from '@/views/admin/products/ProductCreate.vue'
import AdminProductEdit from '@/views/admin/products/ProductEdit.vue'
import AdminCategories from '@/views/admin/categories/CategoryIndex.vue'
import AminCouponManager from '@/views/admin/CouponManager.vue'
import AdminOrderManager from '@/views/admin/orders/OrderManager.vue'
import AdminLogMonitoring from '@/views/admin/Logs/LogMonitoring.vue'
import AdminCommunicationDashboard from '@/views/admin/Commonications/CommunicationDashboard.vue'
import NotificationManager from '@/views/admin/settings/NotificationManager.vue'
import AdminShopSettings from '@/views/admin/settings/AdminShopSettings.vue'
import AdminHomeSettings from '@/views/admin/home/HomeSettings.vue'

const routes = [
  {
    path: '/maintenance',
    name: 'maintenance',
    component: MaintenanceView,
  },
  {
    path: '/',
    component: PublicLayout,
    children: [
      { path: '', name: 'public.home', component: Home },
      { path: 'products', name: 'public.products', component: Products },
      { path: 'category/:slug', name: 'category', component: Category },
      { path: 'tag/:slug', name: 'tag', component: Products },
      { path: 'product/:slug', name: 'public.product.detail', component: PublicProductDetail },
      { path: 'cart', name: 'public.cart', component: CartPage },
      { path: 'compare', name: 'pablic.compare', component: Compare },
      { path: 'checkout', name: 'checkout', component: CheckoutPage, meta: { requiresAuth: true } },
    ],
  },
  {
    path: '/auth',
    component: AuthLayout,
    children: [
      { path: 'login', name: 'auth.login', component: LoginView },
      { path: 'register', name: 'auth.register', component: RegisterView },
      { path: 'forgot-password', name: 'auth.forgot-password', component: ForgotPassword },
      { path: 'reset-password', name: 'auth.reset-password', component: ResetPassword },
    ],
  },
  {
    path: '/user',
    component: UserLayout,
    meta: { requiresAuth: true, role: 'user' },
    children: [
      { path: 'dashboard', name: 'user.dashboard', component: UserDashboard },
      { path: 'checkout', name: 'user.checkout', component: CheckoutPage },
      { path: 'orders', name: 'user.orders', component: UserOrders },
      { path: 'favorites', name: 'user.favorites', component: UserFavorites },
      { path: 'profile', name: 'user.profile', component: UserProfile },
      { path: 'addresses', name: 'user.addresses', component: UserAddresses },
      { path: 'transactions', name: 'user.transactions', component: UserTransactions },
      { path: 'reviews', name: 'user.reviews', component: UserReviews },
      { path: 'orders/:id/payment', name: 'user.order.payment', component: PaymentReceipt },
      { path: 'orders/:id', name: 'user.order.detail', component: UserOrderDetail },
    ],
  },
  {
    path: '/admin',
    component: AdminLayout,
    meta: { requiresAuth: true, role: 'admin' },
    children: [
      { path: 'dashboard', name: 'admin.dashboard', component: AdminDashboard },
      { path: 'products', name: 'admin.products', component: AdminProducts },
      { path: 'users', name: 'admin.users', component: AdminUsers },
      { path: 'logs', name: 'admin.logs', component: AdminLogs },
      { path: 'logState', name: 'admin.logState', component: logState },
      { path: 'test-api', name: 'admin.test-api', component: ApiTest },
      { path: 'products/create', name: 'admin.products.create', component: AdminProductCreate },
      { path: 'products/:id/edit', name: 'admin.products.edit', component: AdminProductEdit },
      { path: 'categories', name: 'admin.categories', component: AdminCategories },
      { path: 'ProductVariants', name: 'admin.ProductVariants', component: AdminProductVariants },
      { path: 'CouponManager', name: 'admin.CouponManager', component: AminCouponManager },
      { path: 'OrderManager', name: 'admin.OrderManager', component: AdminOrderManager },
      { path: 'LogMonitoring', name: 'admin.LogMonitoring', component: AdminLogMonitoring },
      {
        path: 'adminSite-settings',
        name: 'admin.adminSite-settings',
        component: AdminSiteSettings,
      },
      {
        path: 'CommunicationDashboard',
        name: 'admin.CommunicationDashboard',
        component: AdminCommunicationDashboard,
      },
      { path: 'reviews', name: 'admin.reviews', component: AdminReviews },
      { path: 'questions', name: 'admin.questions', component: AdminQuestions },
      { path: 'shop-settings', name: 'admin.shop-settings', component: AdminShopSettings },
      {
        path: 'notification-templateForm',
        name: 'admin.notification-templateForm',
        component: NotificationManager,
      },
      { path: 'system-images', name: 'admin.system-images', component: SystemImages },
      { path: 'expertise-manager', name: 'admin.expertise-manager', component: ExpertiseManager },
      {
        path: 'admin-home-settings',
        name: 'admin.admin-home-settings',
        component: AdminHomeSettings,
      },
    ],
  },
  { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFound },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_BASE_URL),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

// =======================
// 🔐 Global Auth & Maintenance Guard
// =======================
router.beforeEach(async (to: RouteLocationNormalized) => {
  const auth = useAuthStore()
  const siteSettings = useSiteSettingsStore()

  // 1. بررسی و بارگذاری تنظیمات سایت اگر هنوز لود نشده است
  if (Object.keys(siteSettings.settings).length === 0) {
    await siteSettings.fetchSettings()
  }

  // 2. همواره تلاش برای بازیابی سشن (احراز هویت) تا نقش کاربر در همه صفحات مشخص شود
  if (!auth.isAuthenticated) {
    await auth.restoreSession()
  }

  const currentUser = auth.user
  const isAdmin = currentUser?.role === 'admin'
  const isAuthRoute = to.path.startsWith('/auth')

  // بررسی وضعیت حالت تعمیرات از استور (اصلاح شده)
  const isMaintenance =
    siteSettings.settings.maintenance_mode === '1' ||
    siteSettings.settings.maintenance_mode === 1 ||
    siteSettings.settings.maintenance_mode === 'true' ||
    siteSettings.settings.maintenance_mode === true

  // الف) هدایت به صفحه تعمیرات برای کاربران عادی (ادمین‌ها و مسیرهای لاگین مستثنی هستند)
  if (isMaintenance && !isAdmin && !isAuthRoute && to.name !== 'maintenance') {
    return { name: 'maintenance' }
  }

  // ب) اگر سایت در حالت تعمیرات نیست اما کاربر تلاش می‌کند صفحه maintenance را باز کند -> هدایت به خانه
  if (!isMaintenance && to.name === 'maintenance') {
    return { name: 'public.home' }
  }

  // 3. جلوگیری از ورود افراد مهمان به صفحات محافظت شده
  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return '/auth/login'
  }

  // 4. چک کردن دسترسی نقش‌ها (Role Guard)
  if (to.meta.requiresAuth && currentUser) {
    const requiredRole = to.meta.role

    // الف) اگر صفحه مخصوص ادمین است ولی شخص ادمین نیست -> پرتاب به پنل یوزر
    if (requiredRole === 'admin' && !isAdmin) {
      return '/user/dashboard'
    }

    // ب) اگر صفحه مخصوص یوزر است ولی شخص ادمین است -> پرتاب به داشبورد ادمین
    if (requiredRole === 'user' && isAdmin) {
      return '/admin/dashboard'
    }
  }

  // 5. جلوگیری از ورود افراد لاگین کرده به صفحات Auth (مثل لاگین/رجیستر)
  if (auth.isAuthenticated && isAuthRoute && currentUser) {
    return isAdmin ? '/admin/dashboard' : '/user/dashboard'
  }
})

export default router
