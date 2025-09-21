<script setup>
defineProps({
  label: { type: String, required: true },   // Button text e.g. Deposit
  icon: { type: String, required: true },    // Bootstrap icon name e.g. bi-send
  color: { type: String, default: 'bg-primary' } // Optional: override color
})

defineEmits(['click'])
</script>

<template>
  <button @click="$emit('click')"
    class="p-2 rounded-xl flex flex-col items-center justify-center text-white hover:opacity-80 cursor-pointer transition w-full"
    :class="color">
    <i :class="`bi ${icon} text-xl md:text-2xl mb-1`"></i>
    <span class="text-sm md:text-base font-medium">{{ label }}</span>
  </button>
</template>
