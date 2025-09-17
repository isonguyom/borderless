<script setup>
import WalletCard from '@/components/WalletCard.vue'

defineProps({
  wallets: { type: Array, required: true }
})

defineEmits(['create-wallet'])
</script>

<template>
  <div>
    <!-- Header -->
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-lg font-semibold text-gray-700">Wallets</h2>
      <button
        @click="$emit('create-wallet')"
        class="text-sm text-primary underline"
      >
        + Create Wallet
      </button>
    </div>

    <!-- Wallets Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <WalletCard
        v-for="(wallet, index) in wallets"
        :key="index"
        :type="wallet.type"
        :batch="wallet.batch"
        :balance="wallet.balance"
        :equivalent="wallet.equivalent"
        :highlight="index === 0"
      />
    </div>
  </div>
</template>
