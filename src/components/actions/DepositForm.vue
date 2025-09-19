<script setup>
import { ref } from 'vue'
import { useWalletStore } from '@/stores/wallets'

const walletStore = useWalletStore()
const walletId = ref(null)
const amount = ref(0)

function handleDeposit() {
  if (!walletId.value || amount.value <= 0) return
  walletStore.deposit(walletId.value, Number(amount.value))
  alert('Deposit successful 💰')
}
</script>

<template>
  <div class="space-y-4">
    <h2 class="text-lg font-bold">Deposit Funds</h2>
    <select v-model="walletId" class="w-full border rounded p-2">
      <option disabled value="">Select Wallet</option>
      <option v-for="w in walletStore.wallets" :key="w.id" :value="w.id">
        {{ w.type }} · {{ w.batch }}
      </option>
    </select>
    <input
      v-model="amount"
      type="number"
      placeholder="Amount"
      class="w-full border rounded p-2"
    />
    <button
      @click="handleDeposit"
      class="w-full bg-primary text-white py-2 rounded"
    >
      Deposit
    </button>
  </div>
</template>
