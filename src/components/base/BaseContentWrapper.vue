<script setup>
import BaseLoadingState from "@/components/base/BaseLoadingState.vue"
import BaseEmptyState from "@/components/base/BaseEmptyState.vue"
import BaseErrorState from "@/components/base/BaseErrorState.vue"

defineProps({
  loading: { type: Boolean, default: false },
  error: { type: [Boolean, String], default: false },
  items: { type: [Array, Object], default: () => [] },
  errorState: {
    type: Object,
    default: () => ({
      title: "Something went wrong",
      description: "Please try again later."
    })
  },
  emptyState: {
    type: Object,
    default: () => ({
      title: "No Data Available",
      description: "There is nothing to show here.",
    })
  },
  retry: { type: Function, default: null }
})
</script>

<template>
  <div class="w-full h-full">
    <!-- Loading -->
    <BaseLoadingState v-if="loading" />

    <!-- Error -->
    <BaseErrorState v-else-if="error && error.length > 0" :details="errorState" :retry="retry" />


    <!-- Empty -->
    <BaseEmptyState v-else-if="!items ||
      (Array.isArray(items) && items.length === 0) ||
      (typeof items === 'object' && Object.keys(items).length === 0)" :details="emptyState" />


    <!-- Content -->
    <slot v-else :items="items" />
  </div>
</template>
