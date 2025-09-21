// stores/depositAccounts.js
import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/utils/api'

export const useDepositAccountsStore = defineStore('depositAccounts', () => {
  const accounts = ref([])
  const loading = ref(false)
  const error = ref('')

  // Fetch accounts from API
  const fetchAccounts = async () => {
    loading.value = true
    error.value = ''
    try {
      const res = await api.get('/depositAccounts')
      accounts.value = res.data
    } catch (err) {
      error.value = err.message || 'Failed to fetch deposit accounts'
    } finally {
      loading.value = false
    }
  }

  // Add new account
  const addAccount = async (account) => {
    try {
      const res = await api.post('/depositAccounts', account)
      accounts.value.push(res.data)
      return res.data
    } catch (err) {
      error.value = err.message || 'Failed to add account'
      throw err
    }
  }


  // Remove account
  const removeAccount = async (id) => {
    try {
      console.log(id)
      await api.delete(`/depositAccounts/${id}`)
      accounts.value = accounts.value.filter(acc => acc.id !== id)
    } catch (err) {
      error.value = err.message || 'Failed to remove account'
      throw err
    }
  }



  return {
    accounts,
    loading,
    error,
    fetchAccounts,
    addAccount,
    removeAccount,
  }
})
