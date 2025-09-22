// stores/wallets.js
import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/utils/api'


export const useWalletsStore = defineStore('wallets', () => {
  const wallets = ref([])
  const localCurrency = ref('NGN')

  const loading = ref(true)
  const error = ref('')

  // Determine if backend expects query param (local) or path param (prod)
  const isLocal = import.meta.env.VITE_API_BASE_URL.includes('localhost')

  const patchWallet = async (walletId, data) => {
    if (isLocal) {
      // Local backend expects /wallets/:id/
      return api.patch(`/wallets/${walletId}/`, data)
    } else {
      // Deployed backend accepts query param
      return api.patch(`/wallets?id=${walletId}`, data)
    }
  }

  // --- Fetch wallets
  const fetchWallets = async () => {
    loading.value = true
    error.value = ''
    try {
      const res = await api.get('/wallets')
      wallets.value = res.data

      if (wallets.value.length === 0) {
        const defaults = [
          { currency: 'USD', balance: 0, createdAt: new Date().toISOString() },
          { currency: localCurrency.value, balance: 0, createdAt: new Date().toISOString() }
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
    loading.value = true
    error.value = ''
    try {
      const res = await api.post('/wallets', {
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
    const walletObj = wallets.value.find(w => w.id === wallet)
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
    const walletObj = wallets.value.find(w => w.id === wallet)
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
    const fromWalletObj = wallets.value.find(w => w.id === fromWallet)
    const toWalletObj = wallets.value.find(w => w.id === toWallet)

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
