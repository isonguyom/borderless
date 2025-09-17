<script setup>
defineProps({
  transactions: { type: Array, required: true }
})
</script>

<template>
  <div class="bg-white shadow rounded-xl p-6">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-lg font-semibold text-gray-700">Recent Transactions</h2>
      <button class="text-sm text-primary underline">View All</button>
    </div>
    <ul>
      <li
        v-for="tx in transactions"
        :key="tx.id"
        class="flex justify-between py-3 border-b last:border-0"
      >
        <div>
          <p class="font-medium">{{ tx.type }}</p>
          <p class="text-sm text-gray-500">{{ new Date(tx.date).toLocaleDateString() }}</p>
        </div>
        <div class="text-right">
          <p class="font-semibold">
            {{ tx.currency.includes('→') ? tx.amount : tx.currency + ' ' + tx.amount }}
          </p>
          <p class="text-sm text-gray-500">{{ tx.currency }}</p>
        </div>
      </li>
    </ul>
  </div>
</template>
