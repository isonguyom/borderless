<template>
  <div class="min-h-screen flex flex-col">

    <div class="w-full flex-1 grid grid-cols-1 md:grid-cols-2">
      <!-- Left side (brand / illustration) -->
      <div class="hidden md:flex flex-col items-center justify-center p-6 relative">
        <!-- Decorative element -->
        <div class="absolute top-0 left-0 w-full h-full bg-[url('/patterns/dots.svg')] opacity-20"></div>

        <div class="relative z-10 text-center">
          <img src="/onboard_wallet.svg" alt="" class="max-h-80">
        </div>
      </div>

      <!-- Right side (auth card) -->
      <div class="flex items-center justify-center p-4">
        <div class="w-full max-w-md shadow-lg rounded-xl px-4 py-8 sm:px-8 bg-primary">
          <!-- Brand -->
          <div class="w-full overflow-hidden mb-3 flex justify-center text-light-surface">
            <BrandName />
          </div>

          <!-- Welcome message -->
          <h2 class="text-2xl text-white mb-8 text-center capitalize font-light">
            {{ welcomeMsg }}
          </h2>

          <!-- Page Content -->
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import BrandName from '@/components/BrandName.vue';

defineProps({
  welcomeMsg: { type: String, default: 'Welcome' }
})

</script>
