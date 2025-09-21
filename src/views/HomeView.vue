<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useWalletsStore } from '@/stores/wallets'
import { useCurrenciesStore } from '@/stores/currencies'
import { useDepositAccountsStore } from '@/stores/depositAccounts'
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
import BaseContentWrapper from '@/components/base/BaseContentWrapper.vue'

// --- Stores ---
const walletStore = useWalletsStore()
const { wallets, localCurrency, loading: walletLoading, error: walletError } = storeToRefs(walletStore)
const { fetchWallets, createWallet, depositFunds, sendFunds, swapFunds } = walletStore

const currenciesStore = useCurrenciesStore()
const { currencies, loading: currenciesLoading } = storeToRefs(currenciesStore)
const { fetchCurrencies } = currenciesStore

const transactionsStore = useTransactionsStore()
const { transactions, loading: txLoading, error: txError } = storeToRefs(transactionsStore)
const { fetchTransactions, addTransaction } = transactionsStore

const depositAccountsStore = useDepositAccountsStore()
const { accounts: depositAccounts } = storeToRefs(depositAccountsStore)
const { fetchAccounts: fetchDepositAccounts } = depositAccountsStore

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
  deposit: { wallet: '', amount: '', account: '' },
  send: { wallet: '', amount: '', recipient: '' },
  swap: { fromWallet: '', toWallet: '', amount: '' }
})

// --- Per-field errors ---
const errors = ref({
  create: { currency: '' },
  deposit: { wallet: '', amount: '', account: '' },
  send: { wallet: '', amount: '', recipient: '' },
  swap: { fromWallet: '', toWallet: '', amount: '' }
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

// --- Options ---
const depositAccountOptions = computed(() => {
  if (!depositAccounts.value || depositAccounts.value.length === 0) {
    return [
      {
        value: '',
        label: 'No accounts. Add in settings.',
        type: 'empty',
        disabled: true
      }
    ]
  }

  return depositAccounts.value.map(acc => {
    if (acc.type === 'Bank Account') {
      return {
        value: acc.id,
        label: `${acc.bankName} - ${acc.accountNumber} (${acc.accountName})`,
        type: acc.type
      }
    }
    if (acc.type === 'Crypto Wallet') {
      return {
        value: acc.id,
        label: `${acc.walletName} (${acc.address.slice(0, 6)}...${acc.address.slice(-4)})`,
        type: acc.type
      }
    }
    return {
      value: acc.id,
      label: acc.type,
      type: acc.type
    }
  })
})

// --- Helpers ---
const resetForm = (key) => {
  const defaults = {
    newWallet: { currency: '' },
    deposit: { wallet: '', amount: '', account: '' },
    send: { wallet: '', amount: '', recipient: '' },
    swap: { fromWallet: '', toWallet: '', amount: '' }
  }

  const defaultErrors = {
    create: { currency: '' },
    deposit: { wallet: '', amount: '', account: '' },
    send: { wallet: '', amount: '', recipient: '' },
    swap: { fromWallet: '', toWallet: '', amount: '' }
  }

  forms.value[key] = { ...defaults[key] }
  errors.value[key] = { ...defaultErrors[key] }
}

const walletOptions = computed(() =>
  wallets.value.map(w => ({ value: w.id, label: `${w.currency} Wallet`, ...w }))
)

const safeWallets = computed(() =>
  wallets.value?.map(w => ({
    currency: w.currency ?? 'N/A',
    balance: w.balance ?? 0
  })) ?? []
)

// --- Actions ---
const handleCreateWallet = async () => {
  errors.value.create.currency = ''
  if (!forms.value.newWallet.currency) {
    errors.value.create.currency = 'Please select a currency'
    return
  }

  loading.value.create = true
  try {
    await createWallet(forms.value.newWallet.currency)
    showToast('Wallet created successfully!')
    resetForm('newWallet')
    modals.value.createWallet = false
  } catch (err) {
    errors.value.create.currency = err.message || 'Failed to create wallet'
    showToast(errors.value.create.currency, 'error')
  } finally {
    loading.value.create = false
  }
}

const handleDeposit = async () => {
  const { wallet, amount, account } = forms.value.deposit
  errors.value.deposit = { wallet: '', amount: '', account: '' }

  if (!wallet) errors.value.deposit.wallet = 'Select a wallet'
  if (!amount) errors.value.deposit.amount = 'Enter an amount'
  if (!account) errors.value.deposit.account = 'Choose a deposit account'

  if (errors.value.deposit.wallet || errors.value.deposit.amount || errors.value.deposit.account) {
    return
  }

  loading.value.deposit = true
  try {
    const updatedWallet = await depositFunds({ wallet, amount, account })
    await addTransaction({
      type: 'Deposit',
      currency: updatedWallet.currency,
      amount,
      date: new Date().toISOString(),
      status: 'Completed',
      account
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
  errors.value.send = { wallet: '', amount: '', recipient: '' }

  if (!wallet) errors.value.send.wallet = 'Select a wallet'
  if (!amount) errors.value.send.amount = 'Enter an amount'
  if (!recipient) errors.value.send.recipient = 'Enter recipient'

  if (errors.value.send.wallet || errors.value.send.amount || errors.value.send.recipient) {
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
  errors.value.swap = { fromWallet: '', toWallet: '', amount: '' }

  if (!fromWallet) errors.value.swap.fromWallet = 'Select a source wallet'
  if (!toWallet) errors.value.swap.toWallet = 'Select a destination wallet'
  if (!amount) errors.value.swap.amount = 'Enter an amount'

  if (errors.value.swap.fromWallet || errors.value.swap.toWallet || errors.value.swap.amount) {
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


// Clear per-field errors when a field changes
Object.keys(forms.value).forEach((formKey) => {
  Object.keys(forms.value[formKey]).forEach((fieldKey) => {
    watch(
      () => forms.value[formKey][fieldKey],
      (newVal) => {
        if (newVal) {
          errors.value[formKey][fieldKey] = ''
        }
      }
    )
  })
})


// --- Lifecycle ---
onMounted(async () => {
  try {
    await Promise.all([fetchCurrencies(), fetchDepositAccounts(), fetchWallets(), fetchTransactions()])
  } catch (err) {
    showToast(err.message || 'Failed to fetch data', 'error')
  }
})
</script>


<template>
  <AppLayout>
    <div class="space-y-8">
      <section>
        <!-- Balance -->
        <BalanceCard :wallets="safeWallets" :preferred-currency="localCurrency ?? 'NGN'"
          @create-wallet="modals.createWallet = true" />

        <!-- Actions -->
        <div class="grid grid-cols-3 gap-4 mt-2">
          <ActionButton label="Deposit" icon="bi-arrow-down-circle" color="bg-success" @click="modals.deposit = true" />
          <ActionButton label="Send" icon="bi-send" color="bg-warning" @click="modals.send = true" />
          <ActionButton label="Swap" icon="bi-arrow-left-right" color="bg-accent" @click="modals.swap = true" />
        </div>
      </section>

      <!-- Wallets -->
      <section class="w-full">
        <h2 class="md:text-lg font-medium mb-2">Wallets</h2>

        <BaseContentWrapper :items="wallets" :loading="walletLoading" :error="walletError" :empty-state="{
          title: 'No wallets found',
          description: 'You do not have any wallets yet. Create one to get started.'
        }">
          <WalletsList :wallets="wallets ?? []" :currencies="currencies" />
        </BaseContentWrapper>
      </section>


      <!-- Transactions -->
      <section class="pb-8">

        <h2 class="md:text-lg font-medium mb-4">Recent Transactions</h2>

        <BaseContentWrapper :items="transactions.slice(0, 7)" :loading="txLoading" :error="txError" :empty-state="{
          title: 'No transactions found',
          description: 'You do not have any transactions at the moment. Check back soon.'
        }">
          <div class="space-y-2">
            <TransactionCard v-for="tx in transactions.slice(0, 7)" :key="tx.id" :tx="tx" />
          </div>
        </BaseContentWrapper>

        <div class="flex justify-end mt-3">
          <router-link v-if="transactions.length > 7" to="/history"
            class="text-primary hover:underline text-sm font-medium">
            See more
          </router-link>
        </div>

      </section>

      <!-- Create Wallet Modal -->
      <BaseModal v-model="modals.createWallet" title="Create Wallet">
        <form @submit.prevent="handleCreateWallet" class="space-y-4">
          <BaseSelect v-model="forms.newWallet.currency" label="Currency" :options="currencies ?? []"
            :disabled="currenciesLoading || loading.create" :disabled-options="wallets.map(w => w.currency)"
            :error="errors.create.currency" />
          <BaseButton type="submit" class="w-full" :loading="loading.create" loading-text="Creating...">
            Create Wallet
          </BaseButton>
        </form>
      </BaseModal>

      <!-- Deposit Modal -->
      <BaseModal v-model="modals.deposit" title="Deposit Funds">
        <form @submit.prevent="handleDeposit" class="space-y-4">
          <BaseSelect v-model="forms.deposit.wallet" label="Select Wallet" :options="walletOptions"
            :error="errors.deposit.wallet" />
          <BaseInput v-model="forms.deposit.amount" type="number" label="Amount" placeholder="Enter amount"
            :disabled="loading.deposit" :error="errors.deposit.amount" />
          <BaseSelect v-model="forms.deposit.account" label="Deposit Account" :options="depositAccountOptions"
            :disabled="loading.deposit" :error="errors.deposit.account" />
          <BaseButton type="submit" class="w-full" :loading="loading.deposit" loading-text="Depositing...">
            Deposit
          </BaseButton>
        </form>
      </BaseModal>

      <!-- Send Modal -->
      <BaseModal v-model="modals.send" title="Send Funds">
        <form @submit.prevent="handleSend" class="space-y-4">
          <BaseSelect v-model="forms.send.wallet" label="Select Wallet" :options="walletOptions"
            :error="errors.send.wallet" />
          <BaseInput v-model="forms.send.amount" type="number" label="Amount" placeholder="Enter amount"
            :disabled="loading.send" :error="errors.send.amount" />
          <BaseInput v-model="forms.send.recipient" type="text" label="Recipient" placeholder="Wallet address"
            :disabled="loading.send" :error="errors.send.recipient" />
          <BaseButton type="submit" class="w-full" :loading="loading.send" loading-text="Sending...">
            Send
          </BaseButton>
        </form>
      </BaseModal>

      <!-- Swap Modal -->
      <BaseModal v-model="modals.swap" title="Swap Funds">
        <form @submit.prevent="handleSwap" class="space-y-4">
          <BaseSelect v-model="forms.swap.fromWallet" label="From Wallet" :options="walletOptions"
            :error="errors.swap.fromWallet" />
          <BaseSelect v-model="forms.swap.toWallet" label="To Wallet" :options="walletOptions"
            :error="errors.swap.toWallet" />
          <BaseInput v-model="forms.swap.amount" type="number" label="Amount" placeholder="Enter amount"
            :disabled="loading.swap" :error="errors.swap.amount" />
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
