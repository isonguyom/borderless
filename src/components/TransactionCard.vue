<script setup>
import { computed } from 'vue'

const props = defineProps({
  type: { type: String, required: true }, // Deposit, Send, Swap
  currency: { type: String, required: true },
  amount: { type: [Number, String], required: true },
  date: { type: String, required: true },
  status: { type: String, default: 'Completed' }
})



// Format date nicely
const formattedDate = computed(() => {
  const d = new Date(props.date)
  return d.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
})

// Map transaction type to icon
const typeIcons = {
  Deposit: 'bi-arrow-down-circle',
  Send: 'bi-send',
  Swap: 'bi-arrow-left-right'
}

// Status badge styles
const statusClass = computed(() => {
  switch (props.status) {
    case 'Completed':
      return 'bg-green-100 text-green-700'
    case 'Pending':
      return 'bg-yellow-100 text-yellow-700'
    case 'Failed':
      return 'bg-red-100 text-red-700'
    default:
      return 'bg-gray-100 text-gray-700'
  }
})
</script>

<template>
  <div
    class="flex items-center justify-between rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 shadow-sm hover:shadow-md transition">
    <!-- Left: Icon + details -->
    <div class="flex items-center gap-3">
      <div class="w-12 h-12 flex items-center justify-center rounded-full bg-gray-100">
        <i :class="`bi ${typeIcons[type] || 'bi-receipt'} text-xl text-primary`"></i>
      </div>
      <div>
        <p class="font-medium text-gray-900 dark:text-gray-100">
          {{ type }} • {{ currency }}
        </p>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          {{ formattedDate }}
        </p>
      </div>
    </div>

    <!-- Right: Amount + status -->
    <div class="flex flex-col items-end">
      <p class="font-semibold text-gray-900 dark:text-gray-100">
        {{ amount }}
      </p>
      <span class="mt-1 px-2 py-0.5 rounded-full text-xs font-medium" :class="statusClass">
        {{ status }}
      </span>
    </div>
  </div>
</template>
