// stores/transactions.js
import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/utils/api'

export const useTransactionsStore = defineStore('transactions', () => {
  const transactions = ref([])
  const loading = ref(false)
  const error = ref('')

  // Fetch all transactions for the authenticated user
const fetchTransactions = async () => {
  loading.value = true
  error.value = ''
  try {
    const res = await api.get('/transactions')
    // reverse so newest comes first
    transactions.value = res.data.sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    )
  } catch (err) {
    error.value = err.message || 'Failed to fetch transactions'
  } finally {
    loading.value = false
  }
}


  // Persist new transaction + update store
  const addTransaction = async (tx) => {
    try {
      const res = await api.post('/transactions', tx)
      transactions.value.unshift(res.data) // API should return the created transaction
      return res.data
    } catch (err) {
      error.value = err.message || 'Failed to add transaction'
      throw err
    }
  }

  return {
    transactions,
    loading,
    error,
    fetchTransactions,
    addTransaction,
  }
})
