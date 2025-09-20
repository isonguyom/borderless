// /src/stores/fxStore.js
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useCurrenciesStore } from '@/stores/currencies'

function generateFXData(basePrice = 100, points = 24) {
  const data = []
  let price = basePrice

  for (let i = 0; i < points; i++) {
    const change = (Math.random() - 0.5) * 2
    price = Math.max(0, +(price + change).toFixed(2))

    const time = new Date(Date.now() - (points - i) * 60 * 60 * 1000)
    const label = `${time.getHours()}:${time.getMinutes().toString().padStart(2, '0')}`

    data.push({ time: label, price })
  }
  return data
}

export const useFxStore = defineStore('fx', () => {
  const currenciesStore = useCurrenciesStore()
  const { currencies, loading: currenciesLoading, error: currenciesError } = storeToRefs(currenciesStore)
  const { fetchCurrencies } = currenciesStore

  const fxLoading = ref(true)
  const performanceLoading = ref(true)
  const fxError = ref(null)
  const performanceError = ref(null)
  const fxData = ref({})
  const performanceData = ref({})

  // --- Mock data (your existing definitions) ---
  const mockFXData = {
    all: ['USD', 'NGN', 'GBP', 'EUR'].reduce((acc, currency) => {
      acc[currency] = {
        '1h': generateFXData(500, 24),
        '1d': generateFXData(505, 24),
        '3d': generateFXData(500, 72),
        '1w': generateFXData(510, 7),
        '1m': generateFXData(500, 30),
        '3m': generateFXData(520, 90),
        '1y': generateFXData(500, 12)
      }
      return acc
    }, {}),

    'USD/NGN': {
      '1h': generateFXData(500, 60),
      '1d': generateFXData(505, 24),
      '3d': generateFXData(500, 72),
      '1w': generateFXData(510, 7),
      '1m': generateFXData(500, 30),
      '3m': generateFXData(520, 90),
      '1y': generateFXData(500, 12)
    },

    'USD/EUR': {
      '1h': generateFXData(0.92, 24),
      '1d': generateFXData(0.92, 24),
      '3d': generateFXData(0.91, 72),
      '1w': generateFXData(0.92, 7),
      '1m': generateFXData(0.93, 30),
      '3m': generateFXData(0.94, 90),
      '1y': generateFXData(0.92, 12)
    }
  }

  const mockPerformanceData = {
    all: {
      USD: {
        '1h': Array.from({ length: 24 }, (_, i) => ({ time: `${i}:00`, price: +(500 + Math.random() * 5).toFixed(2) })),
        '1d': Array.from({ length: 24 }, (_, i) => ({ time: `Hour ${i}`, price: +(502 + Math.random() * 8).toFixed(2) })),
        '3d': Array.from({ length: 72 }, (_, i) => ({ time: `H${i}`, price: +(500 + Math.random() * 15).toFixed(2) })),
        '1w': Array.from({ length: 7 }, (_, i) => ({ time: `Day ${i + 1}`, price: +(505 + Math.random() * 10).toFixed(2) })),
        '1m': Array.from({ length: 30 }, (_, i) => ({ time: `Day ${i + 1}`, price: +(500 + Math.random() * 25).toFixed(2) })),
        '3m': Array.from({ length: 90 }, (_, i) => ({ time: `Day ${i + 1}`, price: +(520 + Math.random() * 30).toFixed(2) })),
        '1y': Array.from({ length: 12 }, (_, i) => ({ time: `Month ${i + 1}`, price: +(500 + Math.random() * 50).toFixed(2) }))
      },
      NGN: {
        '1h': Array.from({ length: 24 }, (_, i) => ({ time: `${i}:00`, price: +(460 + Math.random() * 5).toFixed(2) })),
        '1d': Array.from({ length: 24 }, (_, i) => ({ time: `Hour ${i}`, price: +(462 + Math.random() * 8).toFixed(2) })),
        '3d': Array.from({ length: 72 }, (_, i) => ({ time: `H${i}`, price: +(460 + Math.random() * 15).toFixed(2) })),
        '1w': Array.from({ length: 7 }, (_, i) => ({ time: `Day ${i + 1}`, price: +(465 + Math.random() * 10).toFixed(2) })),
        '1m': Array.from({ length: 30 }, (_, i) => ({ time: `Day ${i + 1}`, price: +(460 + Math.random() * 25).toFixed(2) })),
        '3m': Array.from({ length: 90 }, (_, i) => ({ time: `Day ${i + 1}`, price: +(480 + Math.random() * 30).toFixed(2) })),
        '1y': Array.from({ length: 12 }, (_, i) => ({ time: `Month ${i + 1}`, price: +(460 + Math.random() * 50).toFixed(2) }))
      },
      GBP: {
        '1h': Array.from({ length: 24 }, (_, i) => ({ time: `${i}:00`, price: +(0.75 + Math.random() * 0.02).toFixed(4) })),
        '1d': Array.from({ length: 24 }, (_, i) => ({ time: `Hour ${i}`, price: +(0.76 + Math.random() * 0.03).toFixed(4) })),
        '3d': Array.from({ length: 72 }, (_, i) => ({ time: `H${i}`, price: +(0.75 + Math.random() * 0.05).toFixed(4) })),
        '1w': Array.from({ length: 7 }, (_, i) => ({ time: `Day ${i + 1}`, price: +(0.76 + Math.random() * 0.03).toFixed(4) })),
        '1m': Array.from({ length: 30 }, (_, i) => ({ time: `Day ${i + 1}`, price: +(0.75 + Math.random() * 0.05).toFixed(4) })),
        '3m': Array.from({ length: 90 }, (_, i) => ({ time: `Day ${i + 1}`, price: +(0.77 + Math.random() * 0.05).toFixed(4) })),
        '1y': Array.from({ length: 12 }, (_, i) => ({ time: `Month ${i + 1}`, price: +(0.75 + Math.random() * 0.1).toFixed(4) }))
      },
      EUR: {
        '1h': Array.from({ length: 24 }, (_, i) => ({ time: `${i}:00`, price: +(0.88 + Math.random() * 0.02).toFixed(4) })),
        '1d': Array.from({ length: 24 }, (_, i) => ({ time: `Hour ${i}`, price: +(0.89 + Math.random() * 0.03).toFixed(4) })),
        '3d': Array.from({ length: 72 }, (_, i) => ({ time: `H${i}`, price: +(0.88 + Math.random() * 0.05).toFixed(4) })),
        '1w': Array.from({ length: 7 }, (_, i) => ({ time: `Day ${i + 1}`, price: +(0.89 + Math.random() * 0.03).toFixed(4) })),
        '1m': Array.from({ length: 30 }, (_, i) => ({ time: `Day ${i + 1}`, price: +(0.88 + Math.random() * 0.05).toFixed(4) })),
        '3m': Array.from({ length: 90 }, (_, i) => ({ time: `Day ${i + 1}`, price: +(0.90 + Math.random() * 0.05).toFixed(4) })),
        '1y': Array.from({ length: 12 }, (_, i) => ({ time: `Month ${i + 1}`, price: +(0.88 + Math.random() * 0.1).toFixed(4) }))
      }
    }
  }

  // --- Mocked "API calls" ---
  const fetchFXData = async () => {
    fxLoading.value = true
    fxError.value = null
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)) // simulate API delay
      fxData.value = mockFXData
    } catch {
      fxError.value = "Failed to load FX data"
    } finally {
      fxLoading.value = false
    }
  }

  const fetchPerformanceData = async () => {
    performanceLoading.value = true
    performanceError.value = null
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)) // simulate API delay
      performanceData.value = mockPerformanceData
    } catch {
      performanceError.value = "Failed to load Performance data"
    } finally {
      performanceLoading.value = false
    }
  }


  return {
    fxLoading,
    fxError,
    fxData,
    mockFXData,
    performanceLoading,
    performanceError,
    performanceData,
    mockPerformanceData,
    currencies,
    currenciesLoading,
    currenciesError,
    fetchFXData,
    fetchCurrencies,
    fetchPerformanceData
  }
})
