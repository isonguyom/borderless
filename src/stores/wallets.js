import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/utils/api'

export const useWalletsStore = defineStore('wallets', () => {
  const wallets = ref([])
  const localCurrency = ref('NGN')

  // Loading and error states
  const loading = ref(false)
  const error = ref('')

  // Fetch wallets from API
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

  // Create a new wallet
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

  // Set wallets manually
  const setWallets = (data) => {
    wallets.value = data
  }

  // Set local currency
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
    setWallets,
    setLocalCurrency
  }
})
