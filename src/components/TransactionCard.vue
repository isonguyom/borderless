<script setup>
import { computed } from 'vue'

const props = defineProps({
  tx: {
    type: Object,
    default: () => ({})
  }
})

// Format date nicely
const formattedDate = computed(() => {
  if (!props.tx?.date) return "Unknown date"
  const d = new Date(props.tx.date)
  return isNaN(d)
    ? "Invalid date"
    : d.toLocaleString('en-US', {
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

// Format amount
function formatAmount(value) {
  if (value == null || isNaN(value)) return "0.00"
  return Number(value).toFixed(2)
}


// Status badge styles
const statusClass = computed(() => {
  switch (props.tx?.status) {
    case 'Completed':
      return 'bg-green-100 text-success'
    case 'Pending':
      return 'bg-yellow-100 text-warning'
    case 'Failed':
      return 'bg-red-100 text-danger'
    default:
      return 'bg-gray-100 text-gray-700'
  }
})
</script>

<template>
  <div
    class="flex items-center justify-between gap-3 text-sm rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-2 md:p-4 shadow-sm hover:shadow-md transition">

    <!-- Left: Icon + details -->
    <div class="flex items-center gap-1 md:gap-2">
      <div class="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700">
        <i :class="`bi ${typeIcons[tx.type] || 'bi-receipt'} text-xl text-primary`"></i>
      </div>
      <div class="flex-1">
        <p class="font-medium text-gray-900 dark:text-gray-100">
          {{ tx.type || "Unknown" }} • {{ tx.currency || "N/A" }}
        </p>
        <p class="text-xs md:text-sm text-gray-500 dark:text-gray-400">
          {{ formattedDate }}
        </p>
      </div>
    </div>

    <!-- Right: Amount + status -->
    <div class="flex flex-col items-end">
      <p class="font-semibold text-gray-900 dark:text-gray-100">
        {{ formatAmount(tx?.amount) }}
      </p>
      <span class="mt-1 px-2 py-0.5 rounded-full text-xs md:text-sm font-medium" :class="statusClass">
        {{ tx.status || "Unknown" }}
      </span>
    </div>
  </div>
</template>
