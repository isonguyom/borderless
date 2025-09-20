<script setup>
defineProps({
  details: {
    type: Object,
    default: () => ({
      title: "No Data Available",
      description: "There is nothing to show here right now.",
    })
  }
})
</script>

<template>
  <div class="flex flex-col items-center justify-center p-6 text-center text-gray-500 dark:text-gray-400">
    <div class="text-3xl md:text-5xl mb-2">
      <i class="bi bi-ban"></i>
    </div>
    <h3 class="font-semibold text-lg">{{ details.title }}</h3>
    <p class="text-sm mt-1">{{ details.description }}</p>
  </div>
</template>
