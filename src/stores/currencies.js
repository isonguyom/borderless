// stores/currencies.js
import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/utils/api'

export const useCurrenciesStore = defineStore('currencies', () => {
  const currencies = ref([])      // Array of { value, label }
  const loading = ref(false)
  const error = ref(null)

  // Fetch currencies from API
  const fetchCurrencies = async () => {
    if (currencies.value.length > 0) return currencies.value // avoid refetch
    loading.value = true
    error.value = null
    try {
      const res = await api.get('/currencies') // your endpoint
      currencies.value = res.data
    } catch (err) {
      console.error('Failed to fetch currencies:', err)
      error.value = err.message || 'Failed to fetch currencies'
      currencies.value = [
        { value: 'USD', label: 'US Dollar (USD)' },
        { value: 'NGN', label: 'Nigerian Naira (NGN)' }
      ] // fallback
    } finally {
      loading.value = false
    }
  }

  return { currencies, loading, error, fetchCurrencies }
})
