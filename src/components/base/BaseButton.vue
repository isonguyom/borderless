<template>
  <button v-bind="$attrs" :id="id" :type="type" :disabled="disabled || loading" :aria-busy="loading"
    :aria-disabled="disabled || loading"
    class="inline-flex items-center justify-center rounded-lg font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
    :class="[
      sizeClasses,
      variantClasses,
      disabled || loading ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'
    ]">
    <!-- Loading -->
    <span v-if="loading" class="flex items-center gap-2">
      <i class="bi bi-arrow-repeat animate-spin"></i>
      <span>{{ loadingText || 'Loading...' }}</span>
    </span>

    <!-- Default slot -->
    <span v-else class="flex items-center gap-2">
      <slot name="icon-left" />
      <slot />
      <slot name="icon-right" />
    </span>
  </button>
</template>

<script setup>
import { computed } from "vue"

defineOptions({ inheritAttrs: false })

const props = defineProps({
  id: {
    type: String,
    default: () => `btn-${Math.random().toString(36).slice(2, 9)}`
  },
  type: { type: String, default: "button" },
  variant: {
    type: String,
    default: "primary" // primary | secondary | danger | light | dark
  },
  size: {
    type: String,
    default: "md", // sm | md | lg
    validator: (val) => ["sm", "md", "lg"].includes(val)
  },
  disabled: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },
  loadingText: { type: String, default: "" }
})

const variantClasses = computed(() => {
  switch (props.variant) {
    case "secondary":
      return "bg-light-surface text-dark-text hover:bg-gray-100 focus-visible:ring-primary"
    case "danger":
      return "bg-danger text-white hover:bg-red-600 focus-visible:ring-danger"
    case "light":
      return "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus-visible:ring-primary"
    case "dark":
      return "bg-gray-900 text-white hover:bg-black focus-visible:ring-gray-700"
    default: // primary
      return "bg-primary text-white hover:bg-primary-dark focus-visible:ring-primary-light"
  }
})

const sizeClasses = computed(() => {
  switch (props.size) {
    case "sm":
      return "px-3 py-1.5 text-sm"
    case "lg":
      return "px-6 py-3 text-lg"
    default: // md
      return "px-4 py-2 text-base"
  }
})
</script>
