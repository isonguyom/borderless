// stores/wallets.js
import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/utils/api'

export const useWalletsStore = defineStore('wallets', () => {
  const wallets = ref([])
  const localCurrency = ref('NGN')

  // Loading and error states
  const loading = ref(true)
  const error = ref('')

  // --- Fetch wallets
  const fetchWallets = async () => {
    loading.value = true
    error.value = ''
    try {
      const res = await api.get('/wallets')
      wallets.value = res.data

      // Provision defaults if user has no wallets
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
    const walletId = wallet
    const walletObj = wallets.value.find(w => w.id === walletId)

    if (!walletObj) throw new Error(`Wallet not found: ${walletId}`)

    walletObj.balance += Number(amount)

    try {
      await api.patch(`/wallets?id=${walletId}`, walletObj)
    } catch (err) {
      error.value = err.message || 'Failed to update wallet'
      throw err
    }

    return walletObj
  }

  // --- Send funds
  const sendFunds = async ({ wallet, amount, recipient }) => {
    const walletId = wallet
    const walletObj = wallets.value.find(w => w.id === walletId)

    if (!walletObj) throw new Error(`Wallet not found: ${walletId}`)
    if (walletObj.balance < amount) throw new Error('Insufficient balance')

    walletObj.balance -= Number(amount)

    try {
      await api.patch(`/wallets?id=${walletId}`, walletObj)
    } catch (err) {
      error.value = err.message || 'Failed to update wallet after send'
      throw err
    }

    return { ...walletObj, recipient }
  }

  // --- Swap funds
  const swapFunds = async ({ fromWallet, toWallet, amount, convertedAmount }) => {
    const fromWalletObj = wallets.value.find(w => w.id === fromWallet)
    const toWalletObj = wallets.value.find(w => w.id === toWallet)

    if (!fromWalletObj) throw new Error(`Wallet not found: ${fromWallet}`)
    if (!toWalletObj) throw new Error(`Wallet not found: ${toWallet}`)
    if (fromWalletObj.balance < amount) throw new Error('Insufficient balance')

    fromWalletObj.balance -= Number(amount)
    toWalletObj.balance += Number(convertedAmount)

    try {
      await Promise.all([
        api.patch(`/wallets?id=${fromWallet}`, fromWalletObj),
        api.patch(`/wallets?id=${toWallet}`, toWalletObj),
      ])
    } catch (err) {
      error.value = err.message || 'Failed to update wallets after swap'
      throw err
    }

    return { from: fromWalletObj, to: toWalletObj }
  }

  // --- Setters
  const setWallets = (data) => {
    wallets.value = data
  }
  const setLocalCurrency = (currency) => {
    localCurrency.value = currency
  }

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
