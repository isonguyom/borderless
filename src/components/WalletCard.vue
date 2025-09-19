<script setup>
import { computed } from 'vue'
import { formatAmount } from '@/composables/formatAmount'
import { useCurrencyConverter } from '@/composables/currencyConverter'

const props = defineProps({
  wallet: {
    type: Object,
    required: true,
    default: () => ({
      type: '',
      balance: 0,
      currency: '',
      equivalentUSD: null
    })
  },
  highlight: { type: Boolean, default: false }
})

// Composable
const { convert } = useCurrencyConverter()

// Always ensure we have a USD equivalent
const usdEquivalent = computed(() => {
  if (props.wallet.equivalentUSD != null) {
    return props.wallet.equivalentUSD
  }
  return convert(props.wallet.balance, props.wallet.currency, 'USD')
})
</script>

<template>
  <div
    class="bg-gray-200 dark:bg-gray-800 border border-gray-100 dark:border-gray-800 shadow-md rounded-xl p-5 flex flex-col gap-2 transition hover:shadow-lg"
    :class="highlight ? '' : ''">
    <!-- Wallet Type -->
    <div class="flex items-center justify-between">
      <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200">
        {{ wallet.currency }}
      </h3>
      <i class="bi bi-wallet2 text-primary text-xl"></i>
    </div>

    <!-- Balance -->
    <p class="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100">
      {{ formatAmount(wallet.balance, wallet.currency) }}
    </p>

    <!-- Equivalent in USD -->
    <p class="text-sm text-gray-500 dark:text-gray-400">
      ≈ {{ formatAmount(usdEquivalent, 'USD') }}
    </p>
  </div>
</template>
