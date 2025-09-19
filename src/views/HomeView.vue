<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

import api from '@/utils/api'
import AppLayout from '@/layouts/AppLayout.vue'
import WalletsList from '@/components/WalletsList.vue'
import BalanceCard from '@/components/BalanceCard.vue'
import TransactionCard from '@/components/TransactionCard.vue'
import ActionButton from '@/components/ActionButton.vue'
import BaseModal from '@/components/base/BaseModal.vue'
import BaseSelect from '@/components/base/BaseSelect.vue'
import BaseButton from '@/components/base/BaseButton.vue'

const router = useRouter()

// User’s preferred display currency
const preferredCurrency = ref('NGN')

// Wallets data
const wallets = ref([])

const transactions = ref([
  { id: 1, type: 'Deposit', currency: 'USDT', amount: 500, date: '2025-09-15T10:00:00Z', status: 'Completed' },
  { id: 2, type: 'Swap', currency: 'USDT → USDC', amount: 200, date: '2025-09-14T14:20:00Z', status: 'Pending' },
  { id: 3, type: 'Send', currency: 'USDC', amount: 100, date: '2025-09-12T18:45:00Z', status: 'Failed' }
])

const showCreateWallet = ref(false)
const newWallet = ref({ currency: '' })
const loading = ref(false)
const error = ref('')
// Set your local currency here
const localCurrency = ref('NGN')

// ✅ Supported currencies
const supportedCurrencies = [
  { value: 'USD', label: 'US Dollar (USD)' },
  { value: 'NGN', label: 'Nigerian Naira (NGN)' },
  { value: 'EUR', label: 'Euro (EUR)' },
  { value: 'USDT', label: 'Tether (USDT)' },
  { value: 'USDC', label: 'USD Coin (USDC)' },
]

onMounted(async () => {
  const res = await api.get('/wallet')
  wallets.value = res.data

  // If user has no wallets, provision defaults
  if (wallets.value.length === 0) {
    const defaults = [
      { currency: 'USD', balance: 0, createdAt: new Date().toISOString() },
      { currency: localCurrency.value, balance: 0, createdAt: new Date().toISOString() } // local currency
    ]

    for (const wallet of defaults) {
      const created = await api.post('/wallet', wallet)
      wallets.value.push(created.data)
    }
  }
})



async function handleCreateWallet() {
  error.value = ''
  if (!newWallet.value.currency) {
    error.value = 'Please select a currency'
    return
  }

  loading.value = true
  try {
    const res = await api.post('/wallet', {
      ...newWallet.value,
      balance: 0, // 👈 enforce 0 starting balance
      createdAt: new Date().toISOString()
    })
    wallets.value.push(res.data)
    showCreateWallet.value = false
    newWallet.value = { currency: '' }
  } catch (e) {
    error.value = e.message || 'Failed to create wallet'
  } finally {
    loading.value = false
  }
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
    <div class="space-y-8">
      <div class="w-full space-y-4">
        <!-- Balance Card -->
        <BalanceCard :wallets="wallets" :preferred-currency="preferredCurrency"
          @create-wallet="showCreateWallet = true" />

        <!-- Actions -->
        <div class="grid grid-cols-3 gap-4">
          <ActionButton label="Deposit" icon="bi-arrow-down-circle" @click="handleDeposit" />
          <ActionButton label="Send" icon="bi-send" color="bg-green-600" @click="handleSend" />
          <ActionButton label="Swap" icon="bi-arrow-left-right" color="bg-accent" @click="handleSwap" />
        </div>
      </div>

      <!-- Wallet Cards -->
      <WalletsList :wallets="wallets" />

      <!-- Transactions List -->
      <div class="space-y-4 pb-8">
        <TransactionCard v-for="tx in transactions" :key="tx.id" :type="tx.type" :currency="tx.currency"
          :amount="tx.amount" :date="tx.date" :status="tx.status" />
      </div>

      <!-- Modal -->
      <BaseModal v-model="showCreateWallet" title="Create New Wallet">
        <form @submit.prevent="handleCreateWallet" class="space-y-4">
          <BaseSelect v-model="newWallet.currency" label="Currency" :options="supportedCurrencies"
            :disabled-options="wallets.map(w => w.currency)" :error="error" />

          <!-- 🚫 Removed Starting Balance input -->

          <BaseButton type="submit" class="w-full" :loading="loading" loading-text="Creating...">
            Create Wallet
          </BaseButton>
        </form>
      </BaseModal>

    </div>
  </AppLayout>
</template>
