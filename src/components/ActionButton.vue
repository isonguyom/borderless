<script setup>
defineProps({
  label: { type: String, required: true },   // Button text e.g. Deposit
  icon: { type: String, required: true },    // Bootstrap icon name e.g. bi-send
  color: { type: String, default: 'bg-primary' } // Optional: override color
})

defineEmits(['click'])
</script>

<template>
  <button
    @click="$emit('click')"
    class="py-3 rounded-xl flex flex-col items-center justify-center text-white hover:opacity-90 transition w-full"
    :class="color"
  >
    <i :class="`bi ${icon} text-2xl mb-1`"></i>
    <span class="font-medium">{{ label }}</span>
  </button>
</template>
