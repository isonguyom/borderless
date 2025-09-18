<script setup>
import { ref } from "vue"
import BrandName from "@/components/BrandName.vue"

defineProps({
  user: {
    type: Object,
    default: () => ({ emailOrPhone: "" })
  }
})

const isUnreadNotifications = ref(true)

// safely get user initial
function getInitial(value) {
  if (!value || typeof value !== "string") return "?"
  return value.trim().charAt(0).toUpperCase()
}
</script>

<template>
  <header class="w-full flex justify-between lg:justify-end items-center px-4 py-3 shadow-md border-b
           border-gray-300 dark:border-gray-700 bg-light-surface dark:bg-dark-surface">

    <!-- Logo (mobile only) -->
    <BrandName class="lg:hidden" />

    <div class="flex items-center gap-x-2">
      <!-- Notifications -->
      <button type="button" class="relative text-gray-600 dark:text-gray-300 hover:text-primary cursor-pointer"
        aria-label="Notifications">
        <i class="bi bi-bell text-xl" aria-hidden="true"></i>
        <!-- Unread messages indicator -->
        <span v-if="isUnreadNotifications" class="absolute -top-1 -right-1 w-2.5 h-2.5 bg-danger rounded-full"
          role="status" aria-label="You have unread notifications"></span>
      </button>

      <!-- Profile dropdown -->
      <div class="relative profile-dropdown">
        <button type="button" class="flex items-center gap-x-2 px-2 py-1" aria-haspopup="menu"
          aria-label="Profile menu">
          <div class="w-8 h-8 rounded-full flex items-center justify-center text-lg font-bold
                   bg-primary text-white border border-gray-300 dark:border-gray-700">
            {{ getInitial(user?.emailOrPhone) }}
          </div>
          <span class="hidden md:inline text-gray-700 dark:text-gray-300 text-sm truncate max-w-[120px]">
            {{ user?.emailOrPhone }}
          </span>
        </button>
      </div>
    </div>
  </header>
</template>
