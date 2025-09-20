<script setup>
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useCurrenciesStore } from '@/stores/currencies'

// Components
import AppLayout from '@/layouts/AppLayout.vue'
import BaseSelect from '@/components/base/BaseSelect.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseToast from '@/components/base/BaseToast.vue'
import FxChart from '@/components/charts/FxChart.vue'
import BestCurrenciesTable from '@/components/BestCurrenciesTable.vue'

const currenciesStore = useCurrenciesStore()
const { currencies, loading: currenciesLoading } = storeToRefs(currenciesStore)
const { fetchCurrencies } = currenciesStore

// FX Performance state
const selectedCurrencies = ref(['USD', 'EUR', 'GBP'])
const fxData = ref({ dates: [], data: {} })

// Comparison state
const compareFrom = ref('USD')
const compareTo = ref('EUR')
const compareResult = ref(null)

function generateFXData(basePrice = 100, points = 24) {
  const data = []
  let price = basePrice

  for (let i = 0; i < points; i++) {
    // Random small change in price
    const change = (Math.random() - 0.5) * 2
    price = Math.max(0, +(price + change).toFixed(2))

    // Generate timestamp (can be hourly/daily etc.)
    const time = new Date(Date.now() - (points - i) * 60 * 60 * 1000) // 1-hour steps
    const label = `${time.getHours()}:${time.getMinutes().toString().padStart(2, '0')}`

    data.push({ time: label, price })
  }

  return data
}

// --- Mock FX Data ---
// --- Generate Mock FX Data ---
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

// Toast
const toast = ref({ message: '', type: 'success' })
const showToast = (message, type = 'success', duration = 3000) => {
  toast.value = { message, type, duration }
  setTimeout(() => (toast.value = { message: '', type: 'success' }), duration)
}

// Mock FX performance fetching
const fetchFXData = async () => {
  const dates = Array.from({ length: 10 }, (_, i) => `Day ${i + 1}`)
  const data = {}
  selectedCurrencies.value.forEach((c) => {
    data[c] = Array.from({ length: 10 }, () =>
      Math.round((Math.random() * 0.5 + 0.5) * (c === 'USD' ? 1 : c === 'EUR' ? 0.92 : 0.8) * 100) / 100
    )
  })
  fxData.value = { dates, data }
}

// Compare two currencies
const handleCompare = () => {
  const from = currencies.value.find((c) => c.value === compareFrom.value)
  const to = currencies.value.find((c) => c.value === compareTo.value)
  if (!from || !to) return showToast('Select valid currencies', 'error')
  const rate = to.rate / from.rate
  compareResult.value = `1 ${from.value} = ${rate.toFixed(4)} ${to.value}`
}

// Lifecycle
onMounted(async () => {
  await fetchCurrencies()
  await fetchFXData()
})

const sampleFXData = {
  all: {
    USD: {
      '1h': Array.from({ length: 24 }, (_, i) => ({ time: `${i}:00`, price: +(500 + Math.random() * 5).toFixed(2) })),
      '1d': Array.from({ length: 24 }, (_, i) => ({ time: `Hour ${i}`, price: +(502 + Math.random() * 8).toFixed(2) })),
      '3d': Array.from({ length: 72 }, (_, i) => ({ time: `H${i}`, price: +(500 + Math.random() * 15).toFixed(2) })),
      '1w': Array.from({ length: 7 }, (_, i) => ({ time: `Day ${i+1}`, price: +(505 + Math.random() * 10).toFixed(2) })),
      '1m': Array.from({ length: 30 }, (_, i) => ({ time: `Day ${i+1}`, price: +(500 + Math.random() * 25).toFixed(2) })),
      '3m': Array.from({ length: 90 }, (_, i) => ({ time: `Day ${i+1}`, price: +(520 + Math.random() * 30).toFixed(2) })),
      '1y': Array.from({ length: 12 }, (_, i) => ({ time: `Month ${i+1}`, price: +(500 + Math.random() * 50).toFixed(2) }))
    },
    NGN: {
      '1h': Array.from({ length: 24 }, (_, i) => ({ time: `${i}:00`, price: +(460 + Math.random() * 5).toFixed(2) })),
      '1d': Array.from({ length: 24 }, (_, i) => ({ time: `Hour ${i}`, price: +(462 + Math.random() * 8).toFixed(2) })),
      '3d': Array.from({ length: 72 }, (_, i) => ({ time: `H${i}`, price: +(460 + Math.random() * 15).toFixed(2) })),
      '1w': Array.from({ length: 7 }, (_, i) => ({ time: `Day ${i+1}`, price: +(465 + Math.random() * 10).toFixed(2) })),
      '1m': Array.from({ length: 30 }, (_, i) => ({ time: `Day ${i+1}`, price: +(460 + Math.random() * 25).toFixed(2) })),
      '3m': Array.from({ length: 90 }, (_, i) => ({ time: `Day ${i+1}`, price: +(480 + Math.random() * 30).toFixed(2) })),
      '1y': Array.from({ length: 12 }, (_, i) => ({ time: `Month ${i+1}`, price: +(460 + Math.random() * 50).toFixed(2) }))
    },
    GBP: {
      '1h': Array.from({ length: 24 }, (_, i) => ({ time: `${i}:00`, price: +(0.75 + Math.random() * 0.02).toFixed(4) })),
      '1d': Array.from({ length: 24 }, (_, i) => ({ time: `Hour ${i}`, price: +(0.76 + Math.random() * 0.03).toFixed(4) })),
      '3d': Array.from({ length: 72 }, (_, i) => ({ time: `H${i}`, price: +(0.75 + Math.random() * 0.05).toFixed(4) })),
      '1w': Array.from({ length: 7 }, (_, i) => ({ time: `Day ${i+1}`, price: +(0.76 + Math.random() * 0.03).toFixed(4) })),
      '1m': Array.from({ length: 30 }, (_, i) => ({ time: `Day ${i+1}`, price: +(0.75 + Math.random() * 0.05).toFixed(4) })),
      '3m': Array.from({ length: 90 }, (_, i) => ({ time: `Day ${i+1}`, price: +(0.77 + Math.random() * 0.05).toFixed(4) })),
      '1y': Array.from({ length: 12 }, (_, i) => ({ time: `Month ${i+1}`, price: +(0.75 + Math.random() * 0.1).toFixed(4) }))
    },
    EUR: {
      '1h': Array.from({ length: 24 }, (_, i) => ({ time: `${i}:00`, price: +(0.88 + Math.random() * 0.02).toFixed(4) })),
      '1d': Array.from({ length: 24 }, (_, i) => ({ time: `Hour ${i}`, price: +(0.89 + Math.random() * 0.03).toFixed(4) })),
      '3d': Array.from({ length: 72 }, (_, i) => ({ time: `H${i}`, price: +(0.88 + Math.random() * 0.05).toFixed(4) })),
      '1w': Array.from({ length: 7 }, (_, i) => ({ time: `Day ${i+1}`, price: +(0.89 + Math.random() * 0.03).toFixed(4) })),
      '1m': Array.from({ length: 30 }, (_, i) => ({ time: `Day ${i+1}`, price: +(0.88 + Math.random() * 0.05).toFixed(4) })),
      '3m': Array.from({ length: 90 }, (_, i) => ({ time: `Day ${i+1}`, price: +(0.90 + Math.random() * 0.05).toFixed(4) })),
      '1y': Array.from({ length: 12 }, (_, i) => ({ time: `Month ${i+1}`, price: +(0.88 + Math.random() * 0.1).toFixed(4) }))
    }
  }
}


</script>

<template>
  <AppLayout>
    <div class="max-w-5xl mx-auto py-8 space-y-8">
      <h1 class="text-2xl font-bold">FX Analytics</h1>

      <!-- Currency Performance -->
      <section class="bg-white dark:bg-gray-800 rounded-2xl shadow p-6">
        <h2 class="text-lg font-semibold mb-4">Currency Performance</h2>
        <FxChart :data="mockFXData" :currencies="currencies" />
      </section>

      <BestCurrenciesTable :data="sampleFXData" />

      <!-- Toast -->
      <BaseToast v-if="toast.message" :message="toast.message" :type="toast.type" :duration="toast.duration" />
    </div>
  </AppLayout>
</template>
