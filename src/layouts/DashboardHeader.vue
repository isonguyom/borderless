<script setup>
import { ref } from "vue"

import BrandName from "@/components/BrandName.vue"

defineProps({
  user: {
    type: Object,
    default: () => ({})
  },
})

const isUnreadNotifications = ref(true)

</script>

<template>
  <header
    class="w-full flex justify-between lg:justify-end items-center px-4 py-3 shadow-md border-b border-gray-300 dark:border-gray-700 bg-light-surface dark:bg-dark-surface">

    <!-- Logo -->
    <BrandName class="lg:hidden" />

    <div class="flex items-center gap-x-3">

      <!-- Notifications bell icon -->
      <button class="relative text-gray-600 dark:text-gray-300 hover:text-primary cursor-pointer">
        <i class="bi bi-bell text-xl"></i>

        <!-- Unread messages indicator -->
        <span v-if="isUnreadNotifications"
          class="absolute -top-1 -right-1 mt-1 mr-1 w-2.5 h-2.5 bg-danger rounded-full"></span>
      </button>


      <div class="relative profile-dropdown">
        <!-- Profile avatar and name and profile dropdown menu toggler -->
        <div class="flex items-center gap-x-2 px-2 py-1">
          <img :src="user.avatar" :alt="`${user.name}'s Avatar`"
            class="w-8 h-8 rounded-full border border-gray-300 dark:border-gray-700" />
          <span class="hidden md:inline text-gray-700 dark:text-gray-300 text-sm">{{ user.name
          }}</span>
        </div>
      </div>
    </div>
  </header>
</template>
