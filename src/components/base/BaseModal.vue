<script setup>
defineProps({
  modelValue: { type: Boolean, required: true },
  title: { type: String, default: '' },
  size: { type: String, default: 'md' } // sm | md | lg
})

defineEmits(['update:modelValue'])

const sizeClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg'
}
</script>

<template>
  <transition name="fade">
    <div v-if="modelValue" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50" role="dialog"
      aria-modal="true" :aria-labelledby="title ? 'modal-title' : null">
      <div :class="['bg-white dark:bg-dark-surface rounded-xl shadow-lg w-full p-6', sizeClasses[size]]">
        <header class="flex justify-between items-center mb-4">
          <h2 v-if="title" :id="'modal-title'" class="text-lg font-bold">
            {{ title }}
          </h2>
          <button @click="$emit('update:modelValue', false)"
            class="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none"
            aria-label="Close modal">
            <i class="bi bi-x-lg"></i>
          </button>
        </header>

        <div class="modal-content">
          <slot />
        </div>
      </div>
    </div>
  </transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
