<script setup>
import { ref } from 'vue'
import { useWalletStore } from '@/stores/wallets'

const walletStore = useWalletStore()
const fromWalletId = ref(null)
const toWalletId = ref(null)
const amount = ref(0)
const rate = ref(1) // Mock FX rate

function handleSwap() {
  if (!fromWalletId.value || !toWalletId.value || amount.value <= 0) return
  walletStore.swap(fromWalletId.value, toWalletId.value, Number(amount.value), rate.value)
  alert('Swap successful 🔄')
}
</script>

<template>
  <div class="space-y-4">
    <h2 class="text-lg font-bold">Swap Currencies</h2>
    <select v-model="fromWalletId" class="w-full border rounded p-2">
      <option disabled value="">From Wallet</option>
      <option v-for="w in walletStore.wallets" :key="w.id" :value="w.id">
        {{ w.type }} · {{ w.batch }}
      </option>
    </select>
    <select v-model="toWalletId" class="w-full border rounded p-2">
      <option disabled value="">To Wallet</option>
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
      @click="handleSwap"
      class="w-full bg-primary text-white py-2 rounded"
    >
      Swap
    </button>
  </div>
</template>
