<script setup>
defineProps({
  modelValue: { type: Boolean, required: true },
  title: { type: String, default: '' }
})
defineEmits(['update:modelValue'])
</script>

<template>
  <transition name="fade">
    <div v-if="modelValue" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div class="bg-white dark:bg-dark-surface rounded-xl shadow-lg w-full max-w-md p-6">
        <header class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-bold">{{ title }}</h2>
          <button @click="$emit('update:modelValue', false)">
            <i class="bi bi-x-lg"></i>
          </button>
        </header>

        <div>
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
