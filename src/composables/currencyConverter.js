import { ref } from 'vue'

/**
 * Universal currency converter
 * Uses USD as the bridge currency
 */
export function useCurrencyConverter(initialRates = {}) {
  // Default mock rates (relative to USD)
  const rates = ref({
    USD: 1,
    NGN: 1500,
    EUR: 0.92,
    GBP: 0.8,
    USDT: 1,
    USDC: 1,
    ...initialRates
  })

  /**
   * Convert amount between any two supported currencies
   * @param {number} amount - amount to convert
   * @param {string} from - source currency code (e.g. 'NGN')
   * @param {string} to - target currency code (e.g. 'USDT')
   */
  function convert(amount, from, to) {
    if (!rates.value[from]) throw new Error(`Unsupported source currency: ${from}`)
    if (!rates.value[to]) throw new Error(`Unsupported target currency: ${to}`)
    if (from === to) return amount

    // Convert to USD first, then to target
    const inUSD = amount / rates.value[from]
    return inUSD * rates.value[to]
  }

  /**
   * Update rates (e.g. when fetched from FX API)
   */
  function setRates(newRates) {
    rates.value = { ...rates.value, ...newRates }
  }

  return { rates, convert, setRates }
}
