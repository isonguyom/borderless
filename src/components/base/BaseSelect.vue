<script setup>
defineProps({
  modelValue: [String, Number],
  label: String,
  options: {
    type: Array,
    default: () => [],
  },
  error: {
    type: String,
    default: "",
  },
  disabledOptions: {
    type: Array,
    default: () => [],
  },
  disabled: Boolean,
})

const emit = defineEmits(["update:modelValue"])

function onChange(event) {
  emit("update:modelValue", event.target.value)
}

const id = `select-${Math.random().toString(36).slice(2, 9)}`
</script>

<template>
  <div class="w-full">
    <label v-if="label" :for="id" class="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
      {{ label }}
    </label>

    <select :id="id"
      class="w-full px-3 py-2 rounded border focus:ring-2 focus:ring-primary focus:outline-none dark:bg-dark-surface"
      :value="modelValue" :disabled="disabled" @change="onChange" :aria-invalid="!!error">
      <option disabled value="">Select...</option>
      <option v-for="opt in options" :key="opt.value" :value="opt.value" :disabled="disabledOptions.includes(opt.value)"
        class="text-gray-900 dark:text-gray-100">
        {{ opt.label }}
      </option>
    </select>

    <p v-if="error" class="text-danger text-sm mt-1">{{ error }}</p>
  </div>
</template>
