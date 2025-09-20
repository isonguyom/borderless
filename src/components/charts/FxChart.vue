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
const compareTo = ref('NGN')
const compareResult = ref(null)
const isLoadingCompare = ref(false)

const chartData = ref({ labels: [], datasets: [] })

// color palette for multiple currencies
const colors = ['#7F3DFF', '#0C325B', '#26A17B', '#F7931A', '#990000', '#FF69B4']


const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top',
      labels: {
        boxWidth: 15,   // custom box size
        padding: 10,    // space between legend items
        font: {
          size: 12,     // legend font size
          weight: '500'
        }
      }
    },
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



const handleCompare = async () => {
  const from = props.currencies.find(c => c.value === compareFrom.value)
  const to = props.currencies.find(c => c.value === compareTo.value)
  if (!from || !to) return

  isLoadingCompare.value = true
  compareResult.value = null

  // simulate network / heavy calculation delay
  await new Promise(resolve => setTimeout(resolve, 1500))

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
  isLoadingCompare.value = false
}



// Reset compare mode when switching pair or tab
watch([selectedTab, selectedPair], () => {
  isCompareMode.value = false
  updateChartData()
}, { immediate: true })
</script>


<template>
  <div class="w-full bg-gray-200 dark:bg-gray-900 rounded-2xl shadow p-4 lg:p-6">
    <!-- Currency Selector -->
    <div class="flex gap-1 mb-4">
      <button v-for="pair in Object.keys(props.data)" :key="pair" @click="selectedPair = pair"
        :class="['px-3 py-1 rounded-md uppercase cursor-pointer font-medium text-xs md:text-sm', { 'bg-primary text-white': selectedPair === pair, 'bg-white dark:bg-gray-800 hover:bg-primary/50': selectedPair !== pair }]">
        {{ pair }}
      </button>
    </div>

    <!-- Currency Comparison -->
    <section class="bg-white dark:bg-gray-800 rounded-2xl shadow p-4 mb-6 md:mb-8">
      <h2 class="text-sm md:text-base font-medium mb-4">Compare Currencies</h2>
      <div class="flex flex-row md:gap-4 gap-2 items-end">
        <BaseSelect v-model="compareFrom" :options="currencies ?? []" label="From" size="sm"
          :disabled="isLoadingCompare" />
        <BaseSelect v-model="compareTo" :options="currencies ?? []" label="To" size="sm" :disabled="isLoadingCompare" />
        <BaseButton :loading="isLoadingCompare" @click="handleCompare" size="sm" loading-text="Comparing...">
          Compare
        </BaseButton>
      </div>
      <p v-if="compareResult" class="mt-3 text-gray-700 dark:text-gray-200 font-medium">
        {{ compareResult }}
      </p>
    </section>


    <!-- Line Chart -->
    <div class="relative w-full h-55 md:h-70">
      <Line :data="chartData" :options="chartOptions" />
      <div v-if="isLoadingCompare"
        class="absolute inset-0 bg-white/70 dark:bg-gray-900/70 flex items-center justify-center text-sm font-medium">
        Comparing...
      </div>
    </div>

    <!-- Timeframe Tabs -->
    <div class="flex justify-center gap-1 md:gap-2 mt-4">
      <button v-for="tab in timeTabs" :key="tab.value" @click="selectedTab = tab.value"
        :class="['p-1 rounded font-medium text-xs md:text-sm cursor-pointer', { 'bg-primary text-white': selectedTab === tab.value, 'bg-white dark:bg-gray-800 hover:bg-primary/50': selectedTab !== tab.value }]">
        {{ tab.label }}
      </button>
    </div>
  </div>
</template>
