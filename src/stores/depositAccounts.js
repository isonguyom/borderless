// stores/depositAccounts.js
import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/utils/api'
import { useAuthStore } from './auth'

export const useDepositAccountsStore = defineStore('depositAccounts', () => {
  const accounts = ref([])
  const loading = ref(false)
  const error = ref('')

  // Detect environment
  const isLocal = import.meta.env.VITE_API_BASE_URL?.includes('localhost')

  const authStore = useAuthStore()
  const userId = () => authStore.user?.id

  // --- PATCH/PUT helper
  const patchAccount = async (id, data) => {
    if (isLocal) {
      // JSON-server expects full object on PUT
      return api.put(`/depositAccounts/${id}`, data)
    } else {
      // Production API prefers partial updates
      return api.patch(`/depositAccounts?id=${id}&userId=${userId()}`, data)
    }
  }

  // --- DELETE helper
  const delAccount = async (id) => {
    if (isLocal) {
      return api.delete(`/depositAccounts/${id}`)
    } else {
      return api.delete(`/depositAccounts?id=${id}&userId=${userId()}`)
    }
  }

  // --- Fetch accounts
  const fetchAccounts = async () => {
    loading.value = true
    error.value = ''
    try {
      let res
      if (isLocal) {
        res = await api.get(`/depositAccounts?userId=${userId()}`)
      } else {
        res = await api.get(`/depositAccounts?userId=${userId()}`)
      }
      accounts.value = res.data
    } catch (err) {
      error.value = err.message || 'Failed to fetch deposit accounts'
    } finally {
      loading.value = false
    }
  }

  // --- Add new account
  const addAccount = async (account) => {
    try {
      const payload = { ...account, userId: userId() }
      const res = await api.post('/depositAccounts', payload)
      accounts.value.push(res.data)
      return res.data
    } catch (err) {
      error.value = err.message || 'Failed to add account'
      throw err
    }
  }

  // --- Update existing account
  const updateAccount = async (id, updates) => {
    try {
      const existing = accounts.value.find(acc => acc.id === id)
      if (!existing) throw new Error(`Account not found: ${id}`)

      // Merge existing with updates (local requires full object)
      const payload = isLocal ? { ...existing, ...updates } : updates

      const res = await patchAccount(id, payload)
      const idx = accounts.value.findIndex(acc => acc.id === id)
      if (idx !== -1) {
        accounts.value[idx] = Array.isArray(res.data) ? res.data[0] : res.data
      }
      return Array.isArray(res.data) ? res.data[0] : res.data
    } catch (err) {
      error.value = err.message || 'Failed to update account'
      throw err
    }
  }

  // --- Remove account
  const removeAccount = async (id) => {
    try {
      await delAccount(id)
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
    updateAccount,
    removeAccount,
  }
})
