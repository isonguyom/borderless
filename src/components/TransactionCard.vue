<script setup>
defineProps({
  type: { type: String, required: true },       // e.g. Deposit, Send, Swap
  currency: { type: String, required: true },   // e.g. USDT, NGN, USDT → USDC
  amount: { type: Number, required: true },     // e.g. 500
  date: { type: String, required: true },       // ISO date string
  status: { type: String, default: 'Completed' } // Completed | Pending | Failed
})

// Map transaction type to icon
const typeIcons = {
  Deposit: 'bi-arrow-down-circle',
  Send: 'bi-send',
  Swap: 'bi-arrow-left-right'
}

function formatDate(date) {
  return new Date(date).toLocaleString()
}
</script>

<template>
  <div
    class="p-4 bg-white shadow rounded-xl flex justify-between items-center border hover:shadow-md transition"
  >
    <!-- Left: Icon + Info -->
    <div class="flex items-center gap-4">
      <div class="w-12 h-12 flex items-center justify-center rounded-full bg-gray-100">
        <i :class="`bi ${typeIcons[type] || 'bi-receipt'} text-xl text-primary`"></i>
      </div>
      <div>
        <p class="font-semibold">{{ type }}</p>
        <p class="text-sm text-gray-500">{{ currency }}</p>
        <p class="text-xs text-gray-400">{{ formatDate(date) }}</p>
      </div>
    </div>

    <!-- Right: Amount + Status -->
    <div class="text-right">
      <p class="font-bold">{{ amount }}</p>
      <p
        class="text-xs mt-1"
        :class="{
          'text-green-600': status === 'Completed',
          'text-yellow-600': status === 'Pending',
          'text-red-600': status === 'Failed'
        }"
      >
        {{ status }}
      </p>
    </div>
  </div>
</template>
