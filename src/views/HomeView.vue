<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useWalletsStore } from '@/stores/wallets'
import { useCurrenciesStore } from '@/stores/currencies'

import AppLayout from '@/layouts/AppLayout.vue'
import WalletsList from '@/components/WalletsList.vue'
import BalanceCard from '@/components/BalanceCard.vue'
import TransactionCard from '@/components/TransactionCard.vue'
import ActionButton from '@/components/ActionButton.vue'
import BaseModal from '@/components/base/BaseModal.vue'
import BaseSelect from '@/components/base/BaseSelect.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseToast from '@/components/base/BaseToast.vue'

const router = useRouter()

// Stores
const walletStore = useWalletsStore()
const { wallets, localCurrency, loading: walletLoading, error: walletError } = storeToRefs(walletStore)
const { fetchWallets, createWallet } = walletStore

const currenciesStore = useCurrenciesStore()
const { currencies, loading: currenciesLoading } = storeToRefs(currenciesStore)
const { fetchCurrencies } = currenciesStore

// Transactions (example data)
const transactions = ref([
  { id: 1, type: 'Deposit', currency: 'USDT', amount: 500, date: '2025-09-15T10:00:00Z', status: 'Completed' },
  { id: 2, type: 'Swap', currency: 'USDT → USDC', amount: 200, date: '2025-09-14T14:20:00Z', status: 'Pending' },
  { id: 3, type: 'Send', currency: 'USDC', amount: 100, date: '2025-09-12T18:45:00Z', status: 'Failed' }
])

// Modal & form state
const showCreateWallet = ref(false)
const newWallet = ref({ currency: '' })
const formLoading = ref(false)
const formError = ref('')

// Toast state
const toast = ref({ message: '', type: 'success' })
const showToast = (message, type = 'success', duration = 3000) => {
  toast.value = { message, type, duration }
  setTimeout(() => {
    toast.value = { message: '', type: 'success' }
  }, duration)
}

// Fetch wallets & currencies on mount
onMounted(async () => {
  try {
    await fetchWallets()
    await fetchCurrencies()
  } catch (err) {
    showToast(err.message || 'Failed to fetch data', 'error')
  }
})

// Handle wallet creation
const handleCreateWallet = async () => {
  formError.value = ''
  if (!newWallet.value.currency) {
    formError.value = 'Please select a currency'
    return
  }

  formLoading.value = true
  try {
    await createWallet(newWallet.value.currency)
    showCreateWallet.value = false
    newWallet.value = { currency: '' }
    showToast('Wallet created successfully!', 'success')
  } catch (err) {
    formError.value = err.message || 'Failed to create wallet'
    showToast(formError.value, 'error')
  } finally {
    formLoading.value = false
  }
}

// Navigation actions
const handleDeposit = () => router.push('/deposit')
const handleSend = () => router.push('/send')
const handleSwap = () => router.push('/swap')

// Computed for safe BalanceCard rendering
const safeWallets = computed(() => wallets.value?.map(w => ({
  currency: w.currency ?? 'N/A',
  balance: w.balance ?? 0
})) ?? [])
</script>

<template>
  <AppLayout>
    <div class="space-y-8">

      <!-- Balance Card -->
      <div class="w-full space-y-4">
        <BalanceCard
          :wallets="safeWallets"
          :preferred-currency="localCurrency ?? 'NGN'"
          @create-wallet="showCreateWallet = true"
        />

        <!-- Actions -->
        <div class="grid grid-cols-3 gap-4">
          <ActionButton label="Deposit" icon="bi-arrow-down-circle" @click="handleDeposit" />
          <ActionButton label="Send" icon="bi-send" color="bg-green-600" @click="handleSend" />
          <ActionButton label="Swap" icon="bi-arrow-left-right" color="bg-accent" @click="handleSwap" />
        </div>
      </div>

      <!-- Wallet Cards -->
      <WalletsList :wallets="wallets ?? []" />

      <!-- Transactions List -->
      <div class="space-y-4 pb-8">
        <TransactionCard
          v-for="tx in transactions"
          :key="tx.id"
          :type="tx.type"
          :currency="tx.currency"
          :amount="tx.amount"
          :date="tx.date"
          :status="tx.status"
        />
      </div>

      <!-- Modal for creating wallet -->
      <BaseModal v-model="showCreateWallet" title="Create New Wallet">
        <form @submit.prevent="handleCreateWallet" class="space-y-4">
          <BaseSelect
            v-model="newWallet.currency"
            label="Currency"
            :options="currencies ?? []"
            :disabled="currenciesLoading || formLoading"
            :disabled-options="wallets.map(w => w.currency)"
            :error="formError"
          />
          <BaseButton type="submit" class="w-full" :loading="formLoading" loading-text="Creating...">
            Create Wallet
          </BaseButton>
        </form>
      </BaseModal>

      <!-- Toast -->
      <BaseToast
        v-if="toast.message"
        :message="toast.message"
        :type="toast.type"
        :duration="toast.duration"
      />
    </div>
  </AppLayout>
</template>

<style scoped>
/* optional styling for the page */
</style>
