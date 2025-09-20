<script setup>
import { ref, computed } from 'vue'
import BaseSelect from '@/components/base/BaseSelect.vue'

// Props: data (FX data), default timeframe options
const props = defineProps({
  data: { type: Object, required: true },
  timeframes: { type: Array, default: () => ['1h', '1d', '3d', '1w', '1m', '3m', '1y'] }
})

const selectedTimeframe = ref(props.timeframes[0] || '1h')

// Compute performance for all currencies
const performanceData = computed(() => {
  if (!props.data?.all) return []

  const result = []

  Object.keys(props.data.all).forEach(currency => {
    const dataset = props.data.all[currency][selectedTimeframe.value] || []
    if (dataset.length < 2) return

    const firstPrice = dataset[0].price
    const lastPrice = dataset[dataset.length - 1].price
    const change = lastPrice - firstPrice
    const changePct = (change / firstPrice) * 100

    result.push({
      currency,
      startPrice: firstPrice,
      endPrice: lastPrice,
      change: +change.toFixed(2),
      changePct: +changePct.toFixed(2)
    })
  })

  // Sort descending by changePct (best-performing first)
  return result.sort((a, b) => b.changePct - a.changePct)
})
</script>

<template>
  <div class="w-full bg-gray-200 dark:bg-gray-900 rounded-2xl shadow p-4 lg:p-6">
    <div class="flex justify-between mb-6 gap-4">
      <h2 class="text-sm md:text-base font-medium">Top Performing</h2>
      <div class="flex justify-end">
        <BaseSelect v-model="selectedTimeframe" title="Select timeframe"
          :options="timeframes.map(tf => ({ label: tf.toUpperCase(), value: tf }))" size="sm" />
      </div>
    </div>

    <div class="overflow-x-auto">
      <table class="w-full min-w-max text-left table-auto border-collapse text-sm">
        <thead>
          <tr class="bg-gray-300 dark:bg-gray-800 font-medium">
            <th class="px-4 py-2">Currency</th>
            <th class="px-4 py-2">Start Price</th>
            <th class="px-4 py-2">End Price</th>
            <th class="px-4 py-2">Change</th>
            <th class="px-4 py-2">Change %</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in performanceData" :key="item.currency"
            class="border-b border-gray-300 dark:border-gray-800 hover:bg-gray-300/30 dark:hover:bg-gray-800/30">
            <td class="px-4 py-2 font-medium text-gray-500 dark:text-gray-400">{{ item.currency }}</td>
            <td class="px-4 py-2 text-gray-500 dark:text-gray-400">{{ item.startPrice }}</td>
            <td class="px-4 py-2 text-gray-500 dark:text-gray-400">{{ item.endPrice }}</td>
            <td :class="item.change >= 0 ? 'text-success' : 'text-danger'" class="px-4 py-2">
              {{ item.change }}
            </td>
            <td :class="item.changePct >= 0 ? 'text-success' : 'text-danger'" class="px-4 py-2">
              {{ item.changePct }}%
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
