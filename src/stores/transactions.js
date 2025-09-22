// stores/transactions.js
import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/utils/api'
import { useAuthStore } from './auth'

export const useTransactionsStore = defineStore('transactions', () => {
  const transactions = ref([])
  const loading = ref(true)
  const error = ref('')

  const authStore = useAuthStore()
  const userId = () => authStore.user?.id

  // --- Normalize transaction
  const normalizeTx = (tx) => ({
    id: tx.id,
    type: tx.type,
    currency: tx.currency,
    amount: tx.amount,
    date: tx.date,
    status: tx.status || 'Pending',
    account: tx.account || null,
    recipient: tx.recipient || null,
    convertedAmount: tx.convertedAmount || null,
    userId: tx.userId,
  })

  // --- Fetch transactions (scoped by userId)
  const fetchTransactions = async () => {
    loading.value = true
    error.value = ''
    try {
      const res = await api.get(`/transactions?userId=${userId()}`)
      const data = Array.isArray(res.data) ? res.data : []
      transactions.value = data
        .map(normalizeTx)
        .sort((a, b) => new Date(b.date) - new Date(a.date))
    } catch (err) {
      error.value = err.message || 'Failed to fetch transactions'
    } finally {
      loading.value = false
    }
  }

  // --- Add new transaction (auto attach userId)
  const addTransaction = async (tx) => {
    try {
      const payload = { ...tx, userId: userId() }
      const res = await api.post('/transactions', payload)
      transactions.value.unshift(normalizeTx(res.data))
      return res.data
    } catch (err) {
      error.value = err.message || 'Failed to add transaction'
      throw err
    }
  }

  // --- Reset local state
  const resetTransactions = () => {
    transactions.value = []
    error.value = ''
  }

  return {
    transactions,
    loading,
    error,
    fetchTransactions,
    addTransaction,
    resetTransactions,
  }
})
