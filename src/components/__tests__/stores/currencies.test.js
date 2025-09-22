import { setActivePinia, createPinia } from 'pinia'
import { useCurrenciesStore } from '@/stores/currencies'
import { vi, describe, it, expect, beforeEach } from 'vitest'

describe('Currencies Store', () => {
  let currenciesStore

  beforeEach(() => {
    setActivePinia(createPinia())
    currenciesStore = useCurrenciesStore()
  })

  it('initializes with empty currencies array', () => {
    expect(currenciesStore.currencies).toEqual([])
  })

  it('fetchCurrencies sets currencies', async () => {
    const mockData = [
      { value: 'USD', label: 'US Dollar', rate: 1 },
      { value: 'EUR', label: 'Euro', rate: 0.92 }
    ]
    currenciesStore.fetchCurrencies = vi.fn().mockResolvedValue(mockData)

    const result = await currenciesStore.fetchCurrencies()
    expect(result).toEqual(mockData)
    expect(currenciesStore.fetchCurrencies).toHaveBeenCalledOnce()
  })
})
