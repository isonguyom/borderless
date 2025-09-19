/**
 * Format a number as currency or plain number with locale support
 *
 * @param {number|string} amount - The numeric value to format
 * @param {string} currency - Currency code (e.g. 'USD', 'NGN', 'EUR')
 * @param {Object} options - Optional config
 * @param {string} options.locale - Locale string (default 'en-US')
 * @param {boolean} options.compact - If true, use compact display (e.g. 1.2K, 3.4M)
 * @param {number} options.decimals - Fixed decimal places
 *
 * @returns {string}
 */
export function formatAmount(amount, currency = 'USD', options = {}) {
  const {
    locale = 'en-US',
    compact = false,
    decimals = 2,
  } = options

  // ✅ Ensure safe numeric value
  let value = Number(amount)
  if (isNaN(value) || value === null || value === undefined) {
    value = 0
  }

  try {
    return new Intl.NumberFormat(locale, {
      style: currency ? 'currency' : 'decimal',
      currency: currency || undefined,
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
      notation: compact ? 'compact' : 'standard',
    }).format(value)
  } catch {
    // fallback if currency not supported
    return value.toFixed(decimals)
  }
}
