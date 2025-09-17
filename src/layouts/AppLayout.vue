<script setup>
import DashboardHeader from './DashboardHeader.vue';
import FixedSidebar from './FixedSidebar.vue';
import MobileNav from './MobileNav.vue';


</script>
<template>
  <div class="flex flex-col lg:flex-row justify-between h-screen bg-light-surface dark:bg-dark-surface relative overflow-hidden">
    <!-- Sidebar -->
     <FixedSidebar />

    <!-- Main Content -->
    <main class="flex-1 overflow-y-auto">
      <DashboardHeader />

      <div class="px-4 mt-6" >
      <slot />
      </div>
    </main>

    <!-- Mobile Nav -->
     <MobileNav />
  </div>
</template>
