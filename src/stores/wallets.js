// stores/wallets.js
import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/utils/api'
import { useAuthStore } from '@/stores/auth'

export const useWalletsStore = defineStore('wallets', () => {
  const wallets = ref([])
  const localCurrency = ref('NGN')
  const loading = ref(true)
  const error = ref('')

  // Detect environment
  const isLocal = import.meta.env.VITE_API_BASE_URL.includes('localhost')

  const authStore = useAuthStore()
  const userId = () => authStore.user?.id

  // --- PATCH/PUT helper
  const patchWallet = async (walletId, data) => {
    if (isLocal) {
      return api.patch(`/wallets/${walletId}`, data)
    } else {
      return api.patch(`/wallets?id=${walletId}&userId=${userId()}`, data)
    }
  }

  // --- Fetch wallets
  const fetchWallets = async () => {
    if (!userId()) return
    loading.value = true
    error.value = ''
    try {
      const res = await api.get(`/wallets?userId=${userId()}`)
      wallets.value = Array.isArray(res.data) ? res.data : []

      // Bootstrap default wallets if empty
      if (wallets.value.length === 0) {
        const defaults = [
          { userId: userId(), currency: 'USD', balance: 0, createdAt: new Date().toISOString() },
          { userId: userId(), currency: localCurrency.value, balance: 0, createdAt: new Date().toISOString() }
        ]
        const createdWallets = await Promise.all(
          defaults.map(wallet => api.post('/wallets', wallet))
        )
        wallets.value.push(...createdWallets.map(res => res.data))
      }
    } catch (err) {
      error.value = err.message || 'Failed to fetch wallets'
    } finally {
      loading.value = false
    }
  }

  // --- Create wallet
  const createWallet = async (currency) => {
    if (!userId()) throw new Error('User not authenticated')
    loading.value = true
    error.value = ''
    try {
      const res = await api.post('/wallets', {
        userId: userId(),
        currency,
        balance: 0,
        createdAt: new Date().toISOString()
      })
      wallets.value.push(res.data)
      return res.data
    } catch (err) {
      error.value = err.message || 'Failed to create wallet'
      throw err
    } finally {
      loading.value = false
    }
  }

  // --- Deposit
  const depositFunds = async ({ wallet, amount }) => {
    const walletObj = wallets.value.find(w => w.id === wallet && w.userId === userId())
    if (!walletObj) throw new Error(`Wallet not found: ${wallet}`)

    walletObj.balance += Number(amount)
    try {
      await patchWallet(walletObj.id, walletObj)
    } catch (err) {
      error.value = err.message || 'Failed to update wallet'
      throw err
    }
    return walletObj
  }

  // --- Send
  const sendFunds = async ({ wallet, amount, recipient }) => {
    const walletObj = wallets.value.find(w => w.id === wallet && w.userId === userId())
    if (!walletObj) throw new Error(`Wallet not found: ${wallet}`)
    if (walletObj.balance < amount) throw new Error('Insufficient balance')

    walletObj.balance -= Number(amount)
    try {
      await patchWallet(walletObj.id, walletObj)
    } catch (err) {
      error.value = err.message || 'Failed to update wallet after send'
      throw err
    }
    return { ...walletObj, recipient }
  }

  // --- Swap
  const swapFunds = async ({ fromWallet, toWallet, amount, convertedAmount }) => {
    const fromWalletObj = wallets.value.find(w => w.id === fromWallet && w.userId === userId())
    const toWalletObj = wallets.value.find(w => w.id === toWallet && w.userId === userId())

    if (!fromWalletObj || !toWalletObj) throw new Error('Wallet not found')
    if (fromWalletObj.balance < amount) throw new Error('Insufficient balance')

    fromWalletObj.balance -= Number(amount)
    toWalletObj.balance += Number(convertedAmount)

    try {
      await Promise.all([
        patchWallet(fromWalletObj.id, fromWalletObj),
        patchWallet(toWalletObj.id, toWalletObj)
      ])
    } catch (err) {
      error.value = err.message || 'Failed to update wallets after swap'
      throw err
    }

    return { from: fromWalletObj, to: toWalletObj }
  }

  // --- Mutators
  const setWallets = (data) => (wallets.value = data)
  const setLocalCurrency = (currency) => (localCurrency.value = currency)

  return {
    wallets,
    localCurrency,
    loading,
    error,
    fetchWallets,
    createWallet,
    depositFunds,
    sendFunds,
    swapFunds,
    setWallets,
    setLocalCurrency
  }
})
