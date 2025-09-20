<template>
  <div class="flex flex-col gap-1 w-full">
    <!-- Label -->
    <label v-if="label" :for="id" :class="['text-sm font-medium', labelClasses]">
      {{ label }}
    </label>

    <!-- Select wrapper -->
    <div class="relative flex items-center">
      <!-- Prefix slot -->
      <slot name="prefix" />

      <!-- Select -->
      <select v-bind="$attrs" :id="id" :value="modelValue" :disabled="disabled || loading" @change="onChange"
        :aria-invalid="!!error" :aria-disabled="disabled || loading" :aria-describedby="error ? `${id}-error` : null"
        class="w-full border focus:outline-none focus:ring-2 focus:ring-offset-1 transition bg-white dark:bg-gray-800"
        :class="[
          variantClasses, sizeClasses,
          error
            ? 'border-danger focus:ring-danger'
            : disabled || loading
              ? 'opacity-50 cursor-not-allowed'
              : 'focus:ring-primary-light hover:border-primary'
        ]">
        <option disabled value="">Select...</option>
        <option v-for="opt in options" :key="opt.value" :value="opt.value"
          :disabled="disabledOptions.includes(opt.value)" :class="disabled ? 'opacity-60' : 'opacity-100'">
          {{ opt.label }}
        </option>
      </select>

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
  modelValue: [String, Number],
  label: { type: String, default: "" },
  options: {
    type: Array,
    default: () => [],
  },
  error: { type: String, default: "" },
  disabledOptions: {
    type: Array,
    default: () => [],
  },
  disabled: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },
  variant: { type: String, default: "normal" }, // normal | light | dark,
  size: { type: String, default: 'md' }
})

const emit = defineEmits(["update:modelValue"])

const id = `select-${Math.random().toString(36).slice(2, 9)}`

// Emit value on change
function onChange(event) {
  emit("update:modelValue", event.target.value)
}

// Size styles
const sizeClasses = computed(() => {
  switch (props.size) {
    case "sm":
      return "px-2 py-1 text-sm rounded"
    case "lg":
      return "px-5 py-3 text-lg rounded-xl"
    default:
      return "px-3 py-2 text-base rounded-lg"
  }
})
// Variant styles
const variantClasses = computed(() => {
  switch (props.variant) {
    case "light":
      return "border-gray-200/20 bg-gray-300/10 text-light-text"
    case "dark":
      return "bg-gray-900/10 text-white border-gray-700/50"
    default:
      return "bg-gray-100 border-gray-300 dark:bg-gray-700 dark:border-gray-600"
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
