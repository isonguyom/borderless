<script setup>
defineProps({
  message: { type: String, default: "Loading..." }
})
</script>

<template>
  <div class="flex flex-col items-center justify-center p-6 text-center text-gray-500 dark:text-gray-300">
    <!-- Spinner -->
    <i class="bi bi-arrow-clockwise text-5xl text-primary animate-spin"></i>

    <p class="font-medium mt-2">{{ message }}</p>
  </div>
</template>
