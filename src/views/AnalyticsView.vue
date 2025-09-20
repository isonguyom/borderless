<script setup>
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useFxStore } from '@/stores/fx'

// Components
import AppLayout from '@/layouts/AppLayout.vue'
import FxChart from '@/components/charts/FxChart.vue'
import BestCurrenciesTable from '@/components/PerformanceTable.vue'
import BaseContentWrapper from '@/components/base/BaseContentWrapper.vue'



const fxStore = useFxStore()
const { fxData, fxLoading, fxError, performanceData, performanceLoading, performanceError, currencies } = storeToRefs(fxStore)
const { fetchFXData, fetchCurrencies, fetchPerformanceData } = fxStore

// function generateFXData(basePrice = 100, points = 24) {
//   const data = []
//   let price = basePrice

//   for (let i = 0; i < points; i++) {
//     // Random small change in price
//     const change = (Math.random() - 0.5) * 2
//     price = Math.max(0, +(price + change).toFixed(2))

//     // Generate timestamp (can be hourly/daily etc.)
//     const time = new Date(Date.now() - (points - i) * 60 * 60 * 1000) // 1-hour steps
//     const label = `${time.getHours()}:${time.getMinutes().toString().padStart(2, '0')}`

//     data.push({ time: label, price })
//   }

//   return data
// }

// // --- Mock FX Data ---
// // --- Generate Mock FX Data ---
// const mockFXData = {
//   all: ['USD', 'NGN', 'GBP', 'EUR'].reduce((acc, currency) => {
//     acc[currency] = {
//       '1h': generateFXData(500, 24),
//       '1d': generateFXData(505, 24),
//       '3d': generateFXData(500, 72),
//       '1w': generateFXData(510, 7),
//       '1m': generateFXData(500, 30),
//       '3m': generateFXData(520, 90),
//       '1y': generateFXData(500, 12)
//     }
//     return acc
//   }, {}),

//   'USD/NGN': {
//     '1h': generateFXData(500, 60),
//     '1d': generateFXData(505, 24),
//     '3d': generateFXData(500, 72),
//     '1w': generateFXData(510, 7),
//     '1m': generateFXData(500, 30),
//     '3m': generateFXData(520, 90),
//     '1y': generateFXData(500, 12)
//   },

//   'USD/EUR': {
//     '1h': generateFXData(0.92, 24),
//     '1d': generateFXData(0.92, 24),
//     '3d': generateFXData(0.91, 72),
//     '1w': generateFXData(0.92, 7),
//     '1m': generateFXData(0.93, 30),
//     '3m': generateFXData(0.94, 90),
//     '1y': generateFXData(0.92, 12)
//   }
// }



// Lifecycle
onMounted(async () => {
  await fetchCurrencies()
  await fetchFXData()
  await fetchPerformanceData()
})


</script>

<template>
  <AppLayout>
    <div class="w-full space-y-8 pb-8">
      <h1 class="text-lg md:text-xl font-semibold">FX Analytics</h1>

      <BaseContentWrapper :loading="fxLoading" :error="fxError"
        :items="fxData ? Object.keys(fxData).length ? [1] : [] : []">
        <FxChart :data="fxData" :currencies="currencies" />
      </BaseContentWrapper>

      <BaseContentWrapper :loading="performanceLoading" :error="performanceError"
        :items="performanceData ? Object.keys(performanceData).length ? [1] : [] : []">
        <BestCurrenciesTable :data="performanceData" />
      </BaseContentWrapper>


    </div>
  </AppLayout>
</template>
