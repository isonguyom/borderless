import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes = [
  {
    path: '/test',
    name: 'Test',
    component: () => import('@/views/TestView.vue')
  },
  {
    path: '/onboard',
    name: 'Onboard',
    component: () => import('@/views/OnboardView.vue')
  },
  {
    path: '/',
    name: 'Dashboard',
    component: () => import('@/views/HomeView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/analytics',
    name: 'Analytics',
    component: () => import('@/views/AnalyticsView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/history',
    name: 'History',
    component: () => import('@/views/HistoryView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/wallet',
    name: 'Wallet',
    component: () => import('@/views/WalletView.vue'),
    meta: { requiresAuth: true }
  },
  { path: '/settings', name: 'Settings', component: () => import('@/views/SettingsView.vue'), meta: { requiresAuth: true } },

]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 🔒 Guard
router.beforeEach((to, from, next) => {
  const auth = useAuthStore()
  auth.loadSession()

  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    next('/onboard')
  } else if (to.path === '/onboard' && auth.isAuthenticated) {
    next('/')
  } else {
    next()
  }
})

export default router
