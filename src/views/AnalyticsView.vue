<script setup>
import AppLayout from '@/layouts/AppLayout.vue'
import { Line } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale)

const chartData = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
  datasets: [
    {
      label: 'USD/NGN',
      data: [1500, 1520, 1480, 1550, 1530],
      borderColor: '#d62b92',
      tension: 0.3,
      fill: false,
    }
  ]
}

const chartOptions = {
  responsive: true,
  plugins: {
    legend: { display: true, labels: { color: '#333' } },
    title: { display: true, text: 'FX Trend (USD → NGN)', color: '#111' }
  },
  scales: {
    x: { ticks: { color: '#555' } },
    y: { ticks: { color: '#555' } }
  }
}
</script>

<template>
  <AppLayout>
    <h1 class="text-2xl font-bold mb-6">FX Analytics</h1>
    <div class="bg-white shadow rounded-lg p-6">
      <Line :data="chartData" :options="chartOptions" />
    </div>
  </AppLayout>
</template>
