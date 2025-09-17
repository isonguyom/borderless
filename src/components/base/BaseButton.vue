<template>
  <button :type="type" :disabled="disabled || loading" :aria-busy="loading"
    class="inline-flex items-center justify-center rounded-lg font-medium px-4 py-2 transition focus:outline-none focus-visible:ring-offset-2"
    :class="[
      variantClasses,
      disabled || loading ? 'opacity-60 cursor-not-allowed' : 'hover:bg-primary-dark hover:text-white cursor-pointer focus-visible:ring-2 focus-visible:ring-primary-dark'
    ]">
    <span v-if="loading" class="flex items-center gap-2">
      <i class="bi bi-arrow-repeat animate-spin"></i>
      <span>{{ loadingText || 'Loading...' }}</span>
    </span>
    <span v-else>
      <slot />
    </span>
  </button>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  type: { type: String, default: 'button' },
  variant: { type: String, default: 'primary' }, // primary | secondary | danger | light | dark
  disabled: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },
  loadingText: { type: String, default: '' }
})

const variantClasses = computed(() => {
  switch (props.variant) {
    case 'secondary':
      return 'bg-light-surface text-dark-text'
    case 'danger':
      return 'bg-danger text-white hover:bg-red-600 focus:ring-danger'
    case 'light':
      return 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-primary'
    case 'dark':
      return 'bg-gray-900 text-white hover:bg-black focus:ring-gray-700'
    default: // primary
      return 'bg-primary text-white hover:bg-primary-dark focus:ring-primary-light'
  }
})
</script>
