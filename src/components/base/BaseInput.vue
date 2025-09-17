<template>
  <div class="flex flex-col gap-1 w-full">
    <label v-if="label" :for="id" class="text-sm font-medium"
      :class="variant === 'dark' ? 'text-gray-200' : 'text-gray-700'">
      {{ label }}
    </label>

    <div class="relative">
      <input :id="id" v-model="modelValueProxy" :type="type" :placeholder="placeholder" :disabled="disabled || loading"
        :aria-invalid="!!error" :aria-describedby="error ? `${id}-error` : null"
        class="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-offset-2 transition"
        :class="[
          variantClasses,
          error
            ? 'border-danger focus:ring-danger'
            : 'focus:ring-primary-dark',
          disabled || loading ? 'opacity-50 cursor-not-allowed' : ''
        ]" />
      <!-- optional spinner -->
      <span v-if="loading" class="absolute right-3 top-1/2 -translate-y-1/2">
        <i class="bi bi-arrow-repeat animate-spin text-gray-400"></i>
      </span>
    </div>

    <p v-if="error" :id="`${id}-error`" class="text-danger text-xs" role="alert">
      {{ error }}
    </p>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  id: { type: String, default: () => `input-${Math.random().toString(36).slice(2, 7)}` },
  modelValue: { type: String, default: '' },
  label: { type: String, default: '' },
  placeholder: { type: String, default: '' },
  type: { type: String, default: 'text' },
  variant: { type: String, default: 'normal' }, // normal | light | dark
  error: { type: String, default: '' },
  disabled: { type: Boolean, default: false },
  loading: { type: Boolean, default: false }
})

const emit = defineEmits(['update:modelValue'])

const modelValueProxy = computed({
  get: () => props.modelValue,
  set: v => emit('update:modelValue', v)
})

const variantClasses = computed(() => {
  switch (props.variant) {
    case 'light':
      return 'border-gray-200/20 bg-gray-300/10 text-light-text placeholder:text-gray-300/80'
    case 'dark':
      return 'bg-gray-900 text-white border-gray-700'
    default:
      return 'bg-white text-gray-900'
  }
})
</script>
