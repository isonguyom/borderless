export const normalizeCurrency = (code, currencies = []) => {
  if (!code) return null
  if (!currencies || currencies.length === 0) {
    console.warn("Currencies not loaded yet")
    return null
  }
  return currencies.find(c => c.value === code) || null
}
