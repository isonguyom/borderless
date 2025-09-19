<script setup>
import { ref, onMounted, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useWalletsStore } from '@/stores/wallets'
import { useCurrenciesStore } from '@/stores/currencies'
import { useTransactionsStore } from '@/stores/transactions'
import { useCurrencyConverter } from '@/composables/currencyConverter'

// Components
import AppLayout from '@/layouts/AppLayout.vue'
import WalletsList from '@/components/WalletsList.vue'
import BalanceCard from '@/components/BalanceCard.vue'
import TransactionCard from '@/components/TransactionCard.vue'
import ActionButton from '@/components/ActionButton.vue'
import BaseModal from '@/components/base/BaseModal.vue'
import BaseSelect from '@/components/base/BaseSelect.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseToast from '@/components/base/BaseToast.vue'
import BaseInput from '@/components/base/BaseInput.vue'

// --- Stores ---
const walletStore = useWalletsStore()
const { wallets, localCurrency } = storeToRefs(walletStore)
const { fetchWallets, createWallet, depositFunds, sendFunds, swapFunds } = walletStore

const currenciesStore = useCurrenciesStore()
const { currencies, loading: currenciesLoading } = storeToRefs(currenciesStore)
const { fetchCurrencies } = currenciesStore

const transactionsStore = useTransactionsStore()
const { transactions, loading: txLoading, error: txError } = storeToRefs(transactionsStore)
const { fetchTransactions, addTransaction } = transactionsStore

// --- Composables ---
const { convert } = useCurrencyConverter()

// --- UI State ---
const modals = ref({
  createWallet: false,
  deposit: false,
  send: false,
  swap: false
})

const forms = ref({
  newWallet: { currency: '' },
  deposit: { wallet: '', amount: '', source: '' },
  send: { wallet: '', amount: '', recipient: '' },
  swap: { fromWallet: '', toWallet: '', amount: '' }
})

const errors = ref({
  create: '',
  deposit: '',
  send: '',
  swap: ''
})

const loading = ref({
  create: false,
  deposit: false,
  send: false,
  swap: false
})

// --- Toast ---
const toast = ref({ message: '', type: 'success' })
const showToast = (message, type = 'success', duration = 3000) => {
  toast.value = { message, type, duration }
  setTimeout(() => (toast.value = { message: '', type: 'success' }), duration)
}

// --- Lifecycle ---
onMounted(async () => {
  try {
    await Promise.all([fetchWallets(), fetchCurrencies(), fetchTransactions()])
  } catch (err) {
    showToast(err.message || 'Failed to fetch data', 'error')
  }
})

// --- Helpers ---
const resetForm = (key) => {
  const defaults = {
    newWallet: { currency: '' },
    deposit: { wallet: '', amount: '', source: '' },
    send: { wallet: '', amount: '', recipient: '' },
    swap: { fromWallet: '', toWallet: '', amount: '' }
  }
  forms.value[key] = { ...defaults[key] }
  errors.value[key] = ''
}

const walletOptions = computed(() =>
  wallets.value.map(w => ({ value: w.id, label: `${w.currency} Wallet`, ...w }))
)

const sourceOptions = [
  { value: 'bank', label: 'Bank Transfer' },
  { value: 'card', label: 'Credit/Debit Card' },
  { value: 'crypto', label: 'External Wallet' }
]

const safeWallets = computed(() =>
  wallets.value?.map(w => ({
    currency: w.currency ?? 'N/A',
    balance: w.balance ?? 0
  })) ?? []
)

const sortedTransactions = computed(() =>
  [...transactions.value].sort((a, b) => new Date(b.date) - new Date(a.date))
)

// --- Actions ---
const handleCreateWallet = async () => {
  errors.value.create = ''
  if (!forms.value.newWallet.currency) {
    errors.value.create = 'Please select a currency'
    return
  }

  loading.value.create = true
  try {
    await createWallet(forms.value.newWallet.currency)
    showToast('Wallet created successfully!')
    resetForm('newWallet')
    modals.value.createWallet = false
  } catch (err) {
    errors.value.create = err.message || 'Failed to create wallet'
    showToast(errors.value.create, 'error')
  } finally {
    loading.value.create = false
  }
}

const handleDeposit = async () => {
  const { wallet, amount, source } = forms.value.deposit
  if (!wallet || !amount || !source) {
    errors.value.deposit = 'Please complete all fields'
    return
  }

  loading.value.deposit = true
  try {
    const updatedWallet = await depositFunds({ wallet, amount, source })
    await addTransaction({
      type: 'Deposit',
      currency: updatedWallet.currency,
      amount,
      date: new Date().toISOString(),
      status: 'Completed',
      source
    })
    showToast('Deposit successful!')
    resetForm('deposit')
    modals.value.deposit = false
  } catch (err) {
    showToast(err.message || 'Deposit failed', 'error')
  } finally {
    loading.value.deposit = false
  }
}

const handleSend = async () => {
  const { wallet, amount, recipient } = forms.value.send
  if (!wallet || !amount || !recipient) {
    errors.value.send = 'Please complete all fields'
    return
  }

  loading.value.send = true
  try {
    const updatedWallet = await sendFunds({ wallet, amount, recipient })
    await addTransaction({
      type: 'Send',
      currency: updatedWallet.currency,
      amount,
      date: new Date().toISOString(),
      status: 'Completed',
      recipient
    })
    showToast('Send successful!')
    resetForm('send')
    modals.value.send = false
  } catch (err) {
    showToast(err.message || 'Send failed', 'error')
  } finally {
    loading.value.send = false
  }
}

const handleSwap = async () => {
  const { fromWallet, toWallet, amount } = forms.value.swap
  if (!fromWallet || !toWallet || !amount) {
    errors.value.swap = 'Please complete all fields'
    return
  }

  loading.value.swap = true
  try {
    const fromWalletObj = wallets.value.find(w => w.id === fromWallet)
    const toWalletObj = wallets.value.find(w => w.id === toWallet)
    if (!fromWalletObj || !toWalletObj) throw new Error('Invalid wallets')

    const convertedAmount = convert(Number(amount), fromWalletObj.currency, toWalletObj.currency)
    const result = await swapFunds({ fromWallet, toWallet, amount, convertedAmount })

    await addTransaction({
      type: 'Swap',
      currency: `${result.from.currency} → ${result.to.currency}`,
      amount,
      convertedAmount,
      date: new Date().toISOString(),
      status: 'Completed'
    })

    showToast('Swap successful!')
    resetForm('swap')
    modals.value.swap = false
  } catch (err) {
    showToast(err.message || 'Swap failed', 'error')
  } finally {
    loading.value.swap = false
  }
}
</script>

<template>
  <AppLayout>
    <div class="space-y-8">
      <!-- Balance -->
      <BalanceCard :wallets="safeWallets" :preferred-currency="localCurrency ?? 'NGN'"
        @create-wallet="modals.createWallet = true" />

      <!-- Actions -->
      <div class="grid grid-cols-3 gap-4">
        <ActionButton label="Deposit" icon="bi-arrow-down-circle" @click="modals.deposit = true" />
        <ActionButton label="Send" icon="bi-send" color="bg-green-600" @click="modals.send = true" />
        <ActionButton label="Swap" icon="bi-arrow-left-right" color="bg-yellow-600" @click="modals.swap = true" />
      </div>

      <!-- Wallets -->
      <WalletsList :wallets="wallets ?? []" />

      <!-- Transactions -->
      <div class="space-y-4 pb-8">
        <p v-if="txLoading">Loading transactions...</p>
        <p v-if="txError" class="text-red-500">{{ txError }}</p>
        <TransactionCard v-for="tx in sortedTransactions" :key="tx.id" v-bind="tx" />
      </div>

      <!-- Create Wallet Modal -->
      <BaseModal v-model="modals.createWallet" title="Create Wallet">
        <form @submit.prevent="handleCreateWallet" class="space-y-4">
          <BaseSelect v-model="forms.newWallet.currency" label="Currency" :options="currencies ?? []"
            :disabled="currenciesLoading || loading.create" :disabled-options="wallets.map(w => w.currency)"
            :error="errors.create" />
          <BaseButton type="submit" class="w-full" :loading="loading.create" loading-text="Creating...">
            Create Wallet
          </BaseButton>
        </form>
      </BaseModal>

      <!-- Deposit Modal -->
      <BaseModal v-model="modals.deposit" title="Deposit Funds">
        <form @submit.prevent="handleDeposit" class="space-y-4">
          <BaseSelect v-model="forms.deposit.wallet" label="Select Wallet" :options="walletOptions"
            :error="errors.deposit" />
          <BaseInput v-model="forms.deposit.amount" type="number" label="Amount" placeholder="Enter amount"
            :disabled="loading.deposit" :error="errors.deposit" />
          <BaseSelect v-model="forms.deposit.source" label="Funding Source" :options="sourceOptions"
            :disabled="loading.deposit" :error="errors.deposit" />
          <BaseButton type="submit" class="w-full" :loading="loading.deposit" loading-text="Depositing...">
            Deposit
          </BaseButton>
        </form>
      </BaseModal>

      <!-- Send Modal -->
      <BaseModal v-model="modals.send" title="Send Funds">
        <form @submit.prevent="handleSend" class="space-y-4">
          <BaseSelect v-model="forms.send.wallet" label="Select Wallet" :options="walletOptions" :error="errors.send" />
          <BaseInput v-model="forms.send.amount" type="number" label="Amount" placeholder="Enter amount"
            :disabled="loading.send" :error="errors.send" />
          <BaseInput v-model="forms.send.recipient" type="text" label="Recipient" placeholder="Wallet address or email"
            :disabled="loading.send" :error="errors.send" />
          <BaseButton type="submit" class="w-full" :loading="loading.send" loading-text="Sending...">
            Send
          </BaseButton>
        </form>
      </BaseModal>

      <!-- Swap Modal -->
      <BaseModal v-model="modals.swap" title="Swap Funds">
        <form @submit.prevent="handleSwap" class="space-y-4">
          <BaseSelect v-model="forms.swap.fromWallet" label="From Wallet" :options="walletOptions"
            :error="errors.swap" />
          <BaseSelect v-model="forms.swap.toWallet" label="To Wallet" :options="walletOptions" :error="errors.swap" />
          <BaseInput v-model="forms.swap.amount" type="number" label="Amount" placeholder="Enter amount"
            :disabled="loading.swap" :error="errors.swap" />
          <BaseButton type="submit" class="w-full" :loading="loading.swap" loading-text="Swapping...">
            Swap
          </BaseButton>
        </form>
      </BaseModal>

      <!-- Toast -->
      <BaseToast v-if="toast.message" :message="toast.message" :type="toast.type" :duration="toast.duration" />
    </div>
  </AppLayout>
</template>
