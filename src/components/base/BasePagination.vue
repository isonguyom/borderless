<script setup>
import { computed } from 'vue'

const props = defineProps({
  totalItems: { type: Number, required: true },   // total transactions
  pageSize: { type: Number, default: 10 },        // items per page
  modelValue: { type: Number, default: 1 }        // current page
})

const emit = defineEmits(['update:modelValue'])

const totalPages = computed(() => Math.ceil(props.totalItems / props.pageSize))

const pages = computed(() => {
  let arr = []
  for (let i = 1; i <= totalPages.value; i++) arr.push(i)
  return arr
})

const changePage = (page) => {
  if (page < 1 || page > totalPages.value) return
  emit('update:modelValue', page)
}
</script>

<template>
  <div v-if="totalPages > 1" class="flex items-center justify-center gap-1 md:p-2 mt-4">
    <!-- Prev button -->
    <button @click="changePage(modelValue - 1)" :disabled="modelValue === 1" class="px-3 py-1 rounded-md text-xs md:text-sm bg-gray-200 dark:bg-gray-700
             text-gray-700 dark:text-gray-200 disabled:opacity-50
             hover:bg-primary/20 disabled:cursor-not-allowed cursor-pointer">
      Prev
    </button>

    <!-- Page numbers -->
    <button v-for="page in pages" :key="page" @click="changePage(page)" :class="[
      'px-3 py-1 rounded-md text-xs md:text-sm cursor-pointer transition-colors',
      modelValue === page
        ? 'bg-primary text-white'
        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-primary/20'
    ]">
      {{ page }}
    </button>

    <!-- Next button -->
    <button @click="changePage(modelValue + 1)" :disabled="modelValue === totalPages" class="px-2 py-1 rounded-md text-xs md:text-sm bg-gray-200 dark:bg-gray-700
             text-gray-700 dark:text-gray-200 disabled:opacity-50
             hover:bg-primary/20 disabled:cursor-not-allowed cursor-pointer">
      Next
    </button>
  </div>
</template>
