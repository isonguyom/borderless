<script setup>
defineProps({
  show: { type: Boolean, default: false },
  title: { type: String, default: '' }
})

defineEmits(['close'])
</script>

<template>
  <div v-if="show" class="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-lg font-bold">{{ title }}</h2>
        <button @click="$emit('close')" class="text-gray-500 hover:text-gray-700">
          <i class="bi bi-x-lg"></i>
        </button>
      </div>

      <div>
        <slot />
      </div>
    </div>
  </div>
</template>
