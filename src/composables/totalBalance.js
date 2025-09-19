import { computed } from 'vue'
import { useCurrencyConverter } from '@/composables/currencyConverter'

/**
 * Compute total balance across wallets safely
 * @param {Ref<Array>} wallets - array of wallet objects [{ balance, currency }]
 * @param {Ref<String>} preferredCurrency - user’s selected currency
 */
export function useTotalBalance(wallets, preferredCurrency) {
  const { rates, loading, convert } = useCurrencyConverter()

  // Total in USD with safe fallback
  const totalInUSD = computed(() => {
    return wallets.value.reduce((sum, w) => {
      try {
        if (!w.currency || !rates.value[w.currency]) return sum
        return sum + convert(w.balance, w.currency, 'USD')
      } catch (e) {
        console.warn('Skipping wallet due to conversion error:', e.message)
        return sum
      }
    }, 0)
  })

  // Total in preferred currency, fallback to USD if rate not available
  const totalInPreferred = computed(() => {
    const target = rates.value[preferredCurrency.value] ? preferredCurrency.value : 'USD'
    try {
      return convert(totalInUSD.value, 'USD', target)
    } catch (e) {
      console.warn('Error converting total to preferred currency:', e.message)
      return totalInUSD.value
    }
  })

  return { totalInUSD, totalInPreferred, loading }
}
