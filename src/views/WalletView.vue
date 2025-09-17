<script setup>
import AppLayout from '@/layouts/AppLayout.vue'
import { ref } from 'vue'

const balances = ref([
  { currency: 'USDT', amount: 1500 },
  { currency: 'USDC', amount: 800 },
  { currency: 'NGN', amount: 520000 },
])
</script>

<template>
  <AppLayout>
    <h1 class="text-2xl font-bold mb-6">Wallet Balances</h1>
    <div class="bg-white shadow rounded-lg p-6">
      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="border-b text-gray-600">
            <th class="pb-2">Currency</th>
            <th class="pb-2">Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="bal in balances" :key="bal.currency" class="border-b hover:bg-gray-50">
            <td class="py-3">{{ bal.currency }}</td>
            <td class="py-3 font-medium">{{ bal.amount.toLocaleString() }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </AppLayout>
</template>
