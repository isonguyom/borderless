// stores/transactions.js
import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/utils/api'

export const useTransactionsStore = defineStore('transactions', () => {
  const transactions = ref([])
  const loading = ref(true)
  const error = ref('')

  const normalizeTx = (tx) => ({
    id: tx.id,
    type: tx.type,
    currency: tx.currency,
    amount: tx.amount,
    date: tx.date,
    status: tx.status || 'Pending',
  })

  const fetchTransactions = async () => {
    loading.value = true
    error.value = ''
    try {
      const res = await api.get('/transactions')
      const data = Array.isArray(res.data) ? res.data : []
      transactions.value = data.map(normalizeTx).sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      )
    } catch (err) {
      error.value = err.message || 'Failed to fetch transactions'
    } finally {
      loading.value = false
    }
  }

  const addTransaction = async (tx) => {
    try {
      const res = await api.post('/transactions', tx)
      transactions.value.unshift(normalizeTx(res.data))
      return res.data
    } catch (err) {
      error.value = err.message || 'Failed to add transaction'
      throw err
    }
  }

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
