<script setup>
defineProps({
  details: {
    type: Object,
    default: () => ({
      title: "Something went wrong",
      description: "We couldn’t load your data. Please try again.",
    })
  },
  retry: { type: Function, default: null }
})
</script>

<template>
  <div class="flex flex-col items-center justify-center p-6 text-center text-red-600 dark:text-red-500">
    <div class="text-3xl md:text-5xl mb-2">
      <i class="bi bi-exclamation-circle"></i>
    </div>
    <h3 class="font-semibold text-lg">{{ details.title }}</h3>
    <p class="text-sm mt-1">{{ details.description }}</p>
    <button v-if="retry" @click="retry"
      class="mt-4 px-8 py-2 border text-red-600 dark:text-red-500 rounded-lg text-sm font-bold hover:text-white hover:border-red-600 hover:bg-red-600 transition-colors cursor-pointer">
      Retry
    </button>
  </div>
</template>
