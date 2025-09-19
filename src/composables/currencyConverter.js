import { ref } from 'vue'
import api from '@/utils/api'

/**
 * Universal currency converter
 * Uses USD as the bridge currency
 */
export function useCurrencyConverter(initialRates = {}) {
  const rates = ref({
    USD: 1, // USD is always the base
    ...initialRates
  })

  const loading = ref(false)
  const error = ref(null)

  /**
   * Convert amount between any two supported currencies
   * Returns 0 if rates are not available yet
   */
  function convert(amount, from, to) {
    if (loading.value) return 0 // still loading
    if (!rates.value[from] || !rates.value[to]) {
      console.warn(`Unsupported currency conversion: ${from} -> ${to}`)
      return 0
    }
    if (from === to) return amount

    const inUSD = amount / rates.value[from]
    return inUSD * rates.value[to]
  }

  /**
   * Update rates manually
   */
  function setRates(newRates) {
    rates.value = { ...rates.value, ...newRates }
  }

  /**
   * Fetch rates from the API endpoint
   */
  async function loadRates() {
    loading.value = true
    error.value = null

    try {
      const res = await api.get('/currencies')
      const newRates = {}
      res.data.forEach(c => {
        if (c.value && typeof c.rate === 'number') {
          newRates[c.value] = c.rate
        }
      })
      setRates(newRates)
    } catch (err) {
      console.error('Failed to fetch currency rates', err)
      error.value = err
    } finally {
      loading.value = false
    }
  }

  // Auto-load rates on composable creation
  loadRates()

  return { rates, convert, setRates, loadRates, loading, error }
}
