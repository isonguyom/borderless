<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

import AppLayout from '@/layouts/AppLayout.vue'
import WalletsList from '@/components/WalletsList.vue'
import BalanceCard from '@/components/BalanceCard.vue'
import TransactionCard from '@/components/TransactionCard.vue'
import ActionButton from '@/components/ActionButton.vue'


const router = useRouter()
const wallets = ref([
  { type: 'USDT', batch: 'Batch A', balance: 1500, equivalent: '$1,500' },
  { type: 'USDC', batch: 'Batch B', balance: 800, equivalent: '$800' },
  { type: 'NGN', batch: 'Batch C', balance: 520000, equivalent: '$346.67' },
])


const transactions = ref([
  { id: 1, type: 'Deposit', currency: 'USDT', amount: 500, date: '2025-09-15T10:00:00Z', status: 'Completed' },
  { id: 2, type: 'Swap', currency: 'USDT → USDC', amount: 200, date: '2025-09-14T14:20:00Z', status: 'Pending' },
  { id: 3, type: 'Send', currency: 'USDC', amount: 100, date: '2025-09-12T18:45:00Z', status: 'Failed' }
])

// Mock FX rate
const fxRate = 1500

const totalInNGN = computed(() =>
  wallets.value.reduce((sum, w) => (w.type === 'NGN' ? sum + w.balance : sum), 0)
)

const totalInUSD = computed(() => {
  const ngnBalance = wallets.value.find(w => w.type === 'NGN')?.balance || 0
  const usdEquiv = ngnBalance / fxRate
  const stableCoins = wallets.value
    .filter(w => w.type === 'USDT' || w.type === 'USDC')
    .reduce((sum, w) => sum + w.balance, 0)
  return (usdEquiv + stableCoins).toFixed(2)
})

function handleCreateWallet() {
   router.push('/wallet/create')
}

function handleDeposit() {
   router.push('/deposit')
}
function handleSend() {
   router.push('/send')
}
function handleSwap() {
   router.push('/swap')
}
</script>

<template>
  <AppLayout>
    <!-- Balance Card -->
    <div class="mb-8">
      <BalanceCard :totalInNGN="totalInNGN" :totalInUSD="totalInUSD" />
    </div>

    <div class="grid grid-cols-3 gap-4">
      <ActionButton label="Deposit" icon="bi-arrow-down-circle" @click="handleDeposit" />
      <ActionButton label="Send" icon="bi-send" color="bg-green-600" @click="handleSend" />
      <ActionButton label="Swap" icon="bi-arrow-left-right" color="bg-accent" @click="handleSwap" />
    </div>

    <!-- Wallet Cards -->
    <div class="mb-8">
      <WalletsList :wallets="wallets" @create-wallet="handleCreateWallet" />
    </div>


    <!-- Transactions List -->
    <div class="space-y-4">
      <TransactionCard v-for="tx in transactions" :key="tx.id" :type="tx.type" :currency="tx.currency"
        :amount="tx.amount" :date="tx.date" :status="tx.status" />
    </div>
  </AppLayout>
</template>
