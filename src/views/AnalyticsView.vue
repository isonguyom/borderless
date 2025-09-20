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
      <h2 class="text-lg md:text-xl font-semibold">FX Analytics</h2>

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
