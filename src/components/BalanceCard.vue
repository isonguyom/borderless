<script setup>
defineProps({
  totalInNGN: { type: [Number, String], required: true },
  totalInUSD: { type: [Number, String], required: true }
})
</script>

<template>
  <div class="bg-white shadow rounded-xl p-6">
    <h2 class="text-lg font-semibold text-gray-700">Total Wallet Balance</h2>
    <p class="text-3xl font-extrabold text-gray-900 mt-2">
      ₦{{ totalInNGN.toLocaleString() }}
    </p>
    <p class="text-gray-500">≈ ${{ totalInUSD }}</p>
    <button class="text-sm text-primary underline mt-3">+ Create Wallet</button>
  </div>
</template>
