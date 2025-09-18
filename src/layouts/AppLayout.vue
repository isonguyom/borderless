<script setup>
import { storeToRefs } from 'pinia';
import { useAuthStore } from '@/stores/auth';

import DashboardHeader from './DashboardHeader.vue';
import FixedSidebar from './FixedSidebar.vue';
import MobileNav from './MobileNav.vue';

const auth = useAuthStore()
const { user } = storeToRefs(auth)


</script>
<template>
  <div
    class="flex flex-col lg:flex-row justify-between h-screen bg-light-surface dark:bg-dark-surface relative overflow-hidden">
    <!-- Sidebar -->
    <FixedSidebar />

    <!-- Main Content -->
    <main class="flex-1 overflow-y-auto">
      <DashboardHeader :user="user" />

      <div class="px-4 mt-6">
        <slot />
      </div>
    </main>

    <!-- Mobile Nav -->
    <MobileNav />
  </div>
</template>
