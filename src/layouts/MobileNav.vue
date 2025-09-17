<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import DarkModeToggle from '@/components/DarkModeToggle.vue'

const auth = useAuthStore()
const route = useRoute()
const showMore = ref(false)
const navRef = ref(null)

function logout() {
  auth.logout()
  showMore.value = false
}

const navItems = [
  { to: '/', label: 'Home', icon: 'bi-house', iconFill: 'bi-house-fill' },
  { to: '/wallet', label: 'Wallet', icon: 'bi-wallet2', iconFill: 'bi-wallet-fill' },
  { to: '/history', label: 'History', icon: 'bi-clock-history', iconFill: 'bi-clock-fill' },
  { to: '/analytics', label: 'Analytics', icon: 'bi-bar-chart', iconFill: 'bi-bar-chart-fill' },
]

// Compute active class and icon variant
function isActive(path) {
  return route.path === path
}

// Close dropdown on outside click or escape
function handleClickOutside(e) {
  if (navRef.value && !navRef.value.contains(e.target)) {
    showMore.value = false
  }
}
function handleEscape(e) {
  if (e.key === 'Escape') showMore.value = false
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  document.addEventListener('keydown', handleEscape)
})
onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
  document.removeEventListener('keydown', handleEscape)
})
</script>

<template>
  <nav v-if="auth.isAuthenticated" ref="navRef" role="navigation" aria-label="Main navigation"
    class="w-full text-gray-500 dark:text-gray-300 bg-light-surface dark:bg-dark-surface border-t border-gray-300 dark:border-gray-800 shadow-lg lg:hidden overflow-hidden">

    <!-- Main bottom bar -->
    <ul class="w-full flex justify-around items-center h-16 px-3 md:px-6 gap-x-1 overflow-x-auto">
      <li v-for="item in navItems" :key="item.to">
        <RouterLink :to="item.to" :class="[
          'flex flex-col items-center justify-center',
          isActive(item.to)
            ? 'text-primary'
            : 'text-gray-500 dark:text-gray-400 hover:text-primary'
        ]" :aria-label="item.label" :aria-current="isActive(item.to) ? 'page' : null">
          <i :class="`bi ${isActive(item.to) ? item.iconFill : item.icon} text-xl md:text-2xl`" aria-hidden="true"></i>
          <span class="text-xs md:text-sm font-medium">{{ item.label }}</span>
        </RouterLink>
      </li>

      <!-- More menu trigger -->
      <li>
        <button type="button" @click="showMore = !showMore"
          :class="['flex flex-col items-center justify-center hover:text-primary cursor-pointer', showMore ? 'text-primary' : 'text-gray-500 dark:text-gray-400']"
          aria-label="More options" :aria-expanded="showMore" aria-controls="more-menu">
          <i class="bi bi-three-dots text-xl md:text-2xl" aria-hidden="true"></i>
          <span class="text-xs md:text-sm font-medium">More</span>
        </button>
      </li>
    </ul>

    <!-- More dropdown -->
    <transition name="fade">
      <div v-if="showMore" id="more-menu" role="menu"
        class="absolute bottom-16 left-0 w-full bg-light-surface dark:bg-dark-surface border-t border-gray-300 dark:border-gray-800 shadow-lg">
        <ul class="flex justify-around items-center h-16">
          <li role="none">
            <RouterLink to="/settings" role="menuitem" :class="[
              'flex flex-col items-center justify-center',
              isActive('/settings')
                ? 'text-primary'
                : 'text-gray-500 dark:text-gray-400 hover:text-primary'
            ]">
              <i :class="`bi ${isActive('/settings') ? 'bi-gear-fill' : 'bi-gear'} text-xl`" aria-hidden="true"></i>
              <span class="text-xs font-medium">Settings</span>
            </RouterLink>
          </li>
          <li role="none">
            <div class="flex flex-col items-center justify-center">
              <DarkModeToggle
                class="flex flex-col text-gray-500 dark:text-gray-400 hover:text-primary text-xl cursor-pointer">
                <span class="text-xs font-medium">Theme</span>
              </DarkModeToggle>
            </div>
          </li>
          <li role="none">
            <button type="button" @click="logout" role="menuitem"
              class="flex flex-col items-center justify-center text-danger hover:text-red-500 cursor-pointer"
              aria-label="Logout">
              <i class="bi bi-box-arrow-right text-xl" aria-hidden="true"></i>
              <span class="text-xs font-medium">Logout</span>
            </button>
          </li>
        </ul>
      </div>
    </transition>
  </nav>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
