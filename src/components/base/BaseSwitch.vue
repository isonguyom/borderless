<template>
  <div class="flex items-center gap-3">
    <!-- Switch -->
    <button v-bind="$attrs" :id="id" role="switch" :aria-checked="modelValue" :aria-disabled="disabled" type="button"
      @click="toggle" @keydown.enter.prevent="toggle" @keydown.space.prevent="toggle" :disabled="disabled" :class="[
        'relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none focus-visible::ring-2 focus-visible::ring-offset-2 focus-visible:ring-primary-light',
        modelValue ? 'bg-primary' : 'bg-gray-300',
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
      ]">
      <span :class="[
        'inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300',
        modelValue ? 'translate-x-6' : 'translate-x-1',
      ]" />
    </button>

    <!-- Label -->
    <label v-if="label" :for="id" class="text-sm font-medium text-gray-500 dark:text-gray-300 cursor-pointer">
      {{ label }}
    </label>
  </div>
</template>

<script setup>
defineOptions({ inheritAttrs: false })

const props = defineProps({
  id: {
    type: String,
    default: () => `switch-${Math.random().toString(36).slice(2, 9)}`
  },
  modelValue: { type: Boolean, required: true },
  label: { type: String, default: "" },
  disabled: { type: Boolean, default: false }
})

const emit = defineEmits(["update:modelValue"])

const toggle = () => {
  if (!props.disabled) {
    emit("update:modelValue", !props.modelValue)
  }
}
</script>
