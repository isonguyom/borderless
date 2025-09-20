<script setup>
import { ref, watch } from 'vue'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  CategoryScale,
  Filler
} from 'chart.js'
import { Line } from 'vue-chartjs'

import BaseSelect from '@/components/base/BaseSelect.vue'
import BaseButton from '@/components/base/BaseButton.vue'

const props = defineProps({
  data: { type: Object, required: true, default: () => { } },
  currencies: { type: Array, default: () => [] }
})

ChartJS.register(Title, Tooltip, Legend, LineElement, LinearScale, PointElement, CategoryScale, Filler)

const timeTabs = [
  { label: '1H', value: '1h' },
  { label: '1D', value: '1d' },
  { label: '3D', value: '3d' },
  { label: '1W', value: '1w' },
  { label: '1M', value: '1m' },
  { label: '3M', value: '3m' },
  { label: '1Y', value: '1y' }

]

const selectedTab = ref('1h')


const selectedPair = ref('all')
const compareFrom = ref('USD')
const compareTo = ref('EUR')
const compareResult = ref(null)

const chartData = ref({ labels: [], datasets: [] })

// color palette for multiple currencies
const colors = ['#7F3DFF', '#0C325B', '#26A17B', '#F7931A', '#990000', '#FF69B4']


const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: 'top' },
    tooltip: { enabled: true }
  },
  scales: {
    x: { grid: { display: false }, ticks: { maxRotation: 0 } },
    y: { grid: { display: false } }
  }
}

const isCompareMode = ref(false)

const updateChartData = () => {
  if (isCompareMode.value) return // comparison chart will override

  if (selectedPair.value === 'all') {
    const datasets = []
    let labels = []

    Object.keys(props.data.all).forEach((currency, idx) => {
      const data = props.data.all[currency][selectedTab.value] || []
      if (!labels.length) labels = data.map(d => d.time)

      datasets.push({
        label: currency,
        data: data.map(d => d.price),
        fill: false,
        borderColor: colors[idx % colors.length],
        tension: 0.3,
        pointRadius: 2,
        borderWidth: 2
      })
    })

    chartData.value = { labels, datasets }
  } else {
    const dataset = props.data[selectedPair.value][selectedTab.value] || []
    chartData.value = {
      labels: dataset.map(d => d.time),
      datasets: [
        {
          label: selectedPair.value,
          data: dataset.map(d => d.price),
          fill: true,
          borderColor: '#7F3DFF',
          backgroundColor: '#7F3DFF22',
          tension: 0.3,
          pointRadius: 2,
          borderWidth: 2
        }
      ]
    }
  }
}

// --- Updated compare handler ---
const handleCompare = () => {
  const from = props.currencies.find(c => c.value === compareFrom.value)
  const to = props.currencies.find(c => c.value === compareTo.value)
  if (!from || !to) return

  const rate = to.rate / from.rate
  compareResult.value = `1 ${from.value} = ${rate.toFixed(4)} ${to.value}`

  // Generate comparison dataset
  const compareData = props.data.all[from.value][selectedTab.value].map(d => ({
    time: d.time,
    price: +(d.price * rate).toFixed(4)
  }))

  chartData.value = {
    labels: compareData.map(d => d.time),
    datasets: [
      {
        label: `${from.value}/${to.value}`,
        data: compareData.map(d => d.price),
        fill: true,
        borderColor: '#FF4500',
        backgroundColor: '#FF450022',
        tension: 0.3,
        pointRadius: 2,
        borderWidth: 2
      }
    ]
  }

  isCompareMode.value = true
}


// Reset compare mode when switching pair or tab
watch([selectedTab, selectedPair], () => {
  isCompareMode.value = false
  updateChartData()
}, { immediate: true })
</script>


<template>
  <div class="w-full h-auto">
    <!-- Currency Selector -->
    <div class="flex gap-2 mb-4">
      <button v-for="pair in Object.keys(props.data)" :key="pair" @click="selectedPair = pair"
        :class="['px-3 py-1 rounded-md uppercase', { 'bg-primary text-white': selectedPair === pair, 'bg-gray-200 hover:bg-primary/50': selectedPair !== pair }]">
        {{ pair }}
      </button>
    </div>

    <!-- Currency Comparison -->
    <!-- Currency Comparison -->
    <section class="bg-white dark:bg-gray-800 rounded-2xl shadow p-6">
      <h2 class="text-lg font-semibold mb-4">Compare Currencies</h2>
      <div class="flex flex-col md:flex-row md:gap-4 gap-2 items-center">
        <BaseSelect v-model="compareFrom" :options="currencies ?? []" label="From" />
        <BaseSelect v-model="compareTo" :options="currencies ?? []" label="To" />
        <BaseButton @click="handleCompare">Compare</BaseButton>
      </div>
      <p v-if="compareResult" class="mt-2 text-gray-700 dark:text-gray-200 font-medium">
        {{ compareResult }}
      </p>
    </section>


    <!-- Line Chart -->
    <div class="w-full h-70">
      <Line :data="chartData" :options="chartOptions" />
    </div>
    <!-- Timeframe Tabs -->
    <div class="flex justify-center gap-2 mt-4">
      <button v-for="tab in timeTabs" :key="tab.value" @click="selectedTab = tab.value"
        :class="['px-3 py-1 rounded-md', { 'bg-indigo-600 text-white': selectedTab === tab.value, 'bg-gray-200': selectedTab !== tab.value }]">
        {{ tab.label }}
      </button>
    </div>
  </div>
</template>
