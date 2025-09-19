import { computed } from 'vue'
import { useCurrencyConverter } from '@/composables/currencyConverter'

/**
 * Compute total balance across wallets
 * @param {Ref} wallets - array of wallet objects [{ balance, currency }]
 * @param {Ref} preferredCurrency - user’s selected currency
 */
export function useTotalBalance(wallets, preferredCurrency) {
  const { convert } = useCurrencyConverter()

  const totalInUSD = computed(() =>
    wallets.value.reduce((sum, w) => {
      return sum + convert(w.balance, w.currency, 'USD')
    }, 0)
  )

  const totalInPreferred = computed(() =>
    convert(totalInUSD.value, 'USD', preferredCurrency.value)
  )

  return { totalInUSD, totalInPreferred }
}
