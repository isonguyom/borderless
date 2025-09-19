<template>
  <transition name="fade">
    <div v-if="show" role="alert" :class="[
      'fixed px-4 py-3 rounded-2xl shadow-lg text-white min-w-[200px] flex items-center justify-between gap-2',
      typeClasses,
      positionClasses
    ]">
      <span>{{ message }}</span>
      <button v-if="closable" @click="show = false" class="text-white/80 hover:text-white">
        <i class="bi bi-x-lg"></i>
      </button>
    </div>
  </transition>
</template>

<script setup>
import { ref, watch, computed } from 'vue'

const props = defineProps({
  message: { type: String, required: true },
  type: { type: String, default: 'success' }, // success | error | info | warning
  duration: { type: Number, default: 3000 },
  position: { type: String, default: 'bottom-right' }, // top-right | top-left | bottom-right | bottom-left
  closable: { type: Boolean, default: true }
})

const show = ref(false)
let timeoutId = null

const typeClasses = computed(() => {
  switch (props.type) {
    case 'error':
      return 'bg-danger'
    case 'info':
      return 'bg-blue-600'
    case 'warning':
      return 'bg-warning'
    default: // success
      return 'bg-success'
  }
})

const positionClasses = computed(() => {
  switch (props.position) {
    case 'top-right': return 'top-4 right-4'
    case 'top-left': return 'top-4 left-4'
    case 'bottom-left': return 'bottom-4 left-4'
    default: return 'bottom-4 right-4' // bottom-right
  }
})

watch(
  () => props.message,
  () => {
    show.value = true
    if (timeoutId) clearTimeout(timeoutId)
    timeoutId = setTimeout(() => (show.value = false), props.duration)
  },
  { immediate: true }
)
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
