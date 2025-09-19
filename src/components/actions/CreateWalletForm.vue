<script setup>
import { ref } from 'vue'
import { useWalletStore } from '@/stores/wallets'

const walletStore = useWalletStore()
const type = ref('USDT')
const batch = ref('Batch A')

function handleCreate() {
  walletStore.createWallet(type.value, batch.value)
  alert('Wallet created ✅')
}
</script>

<template>
  <div class="space-y-4">
    <h2 class="text-lg font-bold">Create Wallet</h2>
    <select v-model="type" class="w-full border rounded p-2">
      <option>USDT</option>
      <option>USDC</option>
      <option>NGN</option>
    </select>
    <input
      v-model="batch"
      placeholder="Batch"
      class="w-full border rounded p-2"
    />
    <button
      @click="handleCreate"
      class="w-full bg-primary text-white py-2 rounded"
    >
      Create
    </button>
  </div>
</template>
