<script setup>
defineProps({
  modelValue: String,
  options: { type: Array, default: () => [] }
})

defineEmits(['update:modelValue'])
</script>

<template>
  <select
    :value="modelValue"
    @change="$emit('update:modelValue', $event.target.value)"
    class="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-primary outline-none"
  >
    <option disabled value="">Select an option</option>
    <option v-for="opt in options" :key="opt.value" :value="opt.value">
      {{ opt.label }}
    </option>
  </select>
</template>
