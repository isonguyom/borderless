<template>
  <div class="flex flex-col gap-1 w-full">
    <!-- Label -->
    <label v-if="label" :for="id" :class="['text-sm font-medium', labelClasses]">
      {{ label }}
    </label>

    <!-- Input wrapper -->
    <div class="relative flex items-center">
      <!-- Prefix slot -->
      <slot name="prefix" />

      <!-- Input -->
      <input v-bind="$attrs" :id="id" :type="type" :placeholder="placeholder" :disabled="disabled || loading"
        :aria-invalid="!!error" :aria-disabled="disabled || loading" :aria-describedby="error ? `${id}-error` : null"
        :value="modelValue" @input="handleInput"
        class="w-full rounded-lg border px-3 py-2 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-1 transition"
        :class="[
          variantClasses,
          error ? 'border-danger focus:ring-danger' : disabled || loading ? 'opacity-50 cursor-not-allowed' : 'focus:ring-primary-light hover:border-primary'
        ]" />

      <!-- optional spinner -->
      <span v-if="loading" class="absolute right-3 top-1/2 -translate-y-1/2">
        <i class="bi bi-arrow-repeat animate-spin text-gray-400"></i>
      </span>

      <!-- Suffix slot -->
      <slot name="suffix" />
    </div>

    <!-- Error -->
    <p v-if="error" :id="`${id}-error`" class="text-danger text-xs" role="alert">
      {{ error }}
    </p>
  </div>
</template>

<script setup>
import { computed } from "vue"

defineOptions({ inheritAttrs: false })

const props = defineProps({
  id: {
    type: String,
    default: () => `input-${Math.random().toString(36).slice(2, 7)}`
  },
  modelValue: {
    type: [String, Number, null],
    default: ""
  },
  label: { type: String, default: "" },
  placeholder: { type: String, default: "" },
  type: { type: String, default: "text" },
  variant: { type: String, default: "normal" }, // normal | light | dark
  error: { type: String, default: "" },
  disabled: { type: Boolean, default: false },
  loading: { type: Boolean, default: false }
})

const emit = defineEmits(["update:modelValue"])

// Just forward raw input value
const handleInput = (e) => {
  emit("update:modelValue", e.target.value)
}

// Variant classes
const variantClasses = computed(() => {
  switch (props.variant) {
    case "light":
      return "border-gray-200/20 bg-gray-300/10 text-light-text"
    case "dark":
      return "bg-gray-900/10 text-white border-gray-700/50"
    default:
      return "bg-gray-100 border-gray-300 dark:bg-gray-800 dark:border-gray-700"
  }
})
const labelClasses = computed(() => {
  switch (props.variant) {
    case "light":
      return "text-gray-300"
    case "dark":
      return "text-gray-500"
    default:
      return "text-gray-500 dark:text-gray-300"
  }
})
</script>
