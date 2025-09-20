<script setup>
import BrandName from '@/components/BrandName.vue'
import DarkModeToggle from '@/components/DarkModeToggle.vue'
import { useAuthStore } from '@/stores/auth'
import { RouterLink, useRoute } from 'vue-router'

const auth = useAuthStore()
const route = useRoute()

function logout() {
  auth.logout()
}

// Define navigation items
const navItems = [
  { to: '/', label: 'Home', icon: 'bi-house', iconFill: 'bi-house-fill' },
  { to: '/history', label: 'History', icon: 'bi-clock-history', iconFill: 'bi-clock-fill' },
  { to: '/analytics', label: 'Analytics', icon: 'bi-bar-chart', iconFill: 'bi-bar-chart-fill' },
  { to: '/settings', label: 'Settings', icon: 'bi-gear', iconFill: 'bi-gear-fill' },
]

function isActive(path) {
  return route.path === path
}
</script>

<template>
  <!-- Only render if authenticated -->
  <aside v-if="auth.isAuthenticated"
    class="h-screen hidden overflow-y-auto lg:flex gap-y-6 w-64 xl:w-68 text-gray-600 dark:text-gray-300 bg-light-surface dark:bg-dark-surface border-r border-gray-300 dark:border-gray-700 shadow-lg flex-col p-4"
    role="navigation" aria-label="Sidebar navigation">
    <!-- Brand / Logo -->
    <BrandName />

    <!-- Navigation -->
    <nav class="flex-1 space-y-1">
      <ul class="flex flex-col gap-y-3">
        <li v-for="item in navItems" :key="item.to">
          <RouterLink :to="item.to" :class="[
            'flex items-center gap-2 px-3 py-2 rounded-md font-medium transition',
            isActive(item.to)
              ? 'bg-primary text-white'
              : 'text-gray-500 dark:text-gray-400 hover:text-primary'
          ]" :aria-label="item.label" :aria-current="route.path === item.to ? 'page' : null">
            <i :class="`bi ${isActive(item.to) ? item.iconFill : item.icon} text-xl`" aria-hidden="true"></i>
            <span>{{ item.label }}</span>
          </RouterLink>
        </li>
      </ul>
    </nav>

    <div
      class="w-full flex flex-col gap-y-3 bg-light-surface dark:bg-dark-surface border border-gray-300 dark:border-gray-700 shadow-lg p-4 rounded-xl">

      <DarkModeToggle
        class="px-3 py-2 rounded-md flex items-center gap-2 font-medium cursor-pointer text-gray-500 dark:text-gray-400 hover:text-primary">
        <span>Dark mode</span>
      </DarkModeToggle>

      <!-- Logout -->
      <button type="button" @click="logout"
        class="w-full flex items-center gap-2 px-3 py-2 rounded-md border border-danger text-danger hover:bg-danger hover:text-white transition cursor-pointer"
        aria-label="Logout">
        <i class="bi bi-box-arrow-right text-xl" aria-hidden="true"></i>
        <span>Logout</span>
      </button>
    </div>
  </aside>
</template>
