<template>
  <transition name="fade">
    <div v-if="show" :class="[
      'fixed bottom-4 right-4 px-4 py-3 rounded shadow-lg text-white min-w-[200px]',
      type === 'success' ? 'bg-success' : 'bg-danger'
    ]">
      {{ message }}
    </div>
  </transition>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  message: { type: String, required: true },
  type: { type: String, default: 'success' }, // success | error
  duration: { type: Number, default: 3000 }
})

const show = ref(true)

watch(
  () => props.message,
  () => {
    show.value = true
    setTimeout(() => (show.value = false), props.duration)
  },
  { immediate: true }
)
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
