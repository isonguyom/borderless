import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/utils/api'

export const useTransactionsStore = defineStore('transactions', () => {
  const transactions = ref([])
  const loading = ref(false)
  const error = ref(null)

  async function fetchTransactions() {
    loading.value = true
    error.value = null
    try {
      const res = await api.get('/transactions')
      transactions.value = res.data
    } catch (err) {
      error.value = 'Failed to load transactions'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  async function addTransaction(payload) {
    try {
      const res = await api.post('/transactions', payload)
      transactions.value.push(res.data)
    } catch (err) {
      console.error('Failed to add transaction', err)
    }
  }

  return { transactions, loading, error, fetchTransactions, addTransaction }
})
