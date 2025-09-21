<script setup>
import { ref, computed } from 'vue'
import { formatAmount } from '@/composables/formatAmount'
import { useCurrencyConverter } from '@/composables/currencyConverter'
import { normalizeCurrency } from '@/composables/currencyNormalizer'

const props = defineProps({
  wallet: {
    type: Object,
    required: true,
    default: () => ({
      type: '',
      balance: 0,
      currency: '',
    })
  },
  currencies: { type: Array, default: () => [] },
  highlight: { type: Boolean, default: false }
})

// Composable
const { convert } = useCurrencyConverter()

const isVisible = ref(true)

// Always ensure we have a USD equivalent
const usdEquivalent = computed(() => {
  if (props.wallet.equivalentUSD != null) {
    return props.wallet.equivalentUSD
  }
  return convert(props.wallet.balance, props.wallet.currency, 'USD')
})

const currencyObj = computed(() => {
  // Ensure currencies exist and wallet has a currency
  if (!props.currencies?.length || !props.wallet?.currency) return {}
  return normalizeCurrency(props.wallet.currency, props.currencies) || {}
})


</script>

<template>
  <div
    class="bg-primary/40 border border-gray-100 dark:border-gray-800 shadow-md rounded-xl p-5 flex flex-col gap-2 transition hover:border-primary hover:shadow-lg"
    :class="highlight ? '' : ''">
    <!-- Wallet Type -->
    <div class="flex items-center justify-between">
      <h3 class="text-lg font-semibold text-gray-700 dark:text-gray-300 flex-1">
        {{ wallet.currency }}
      </h3>


      <div class="w-10 h-10 flex justify-center items-center rounded-full"
        :style="{ backgroundColor: currencyObj?.color || '#ccc' }">
        <i class="bi bi-wallet2 text-white text-xl"></i>
      </div>

    </div>

    <div class="flex justify-between items-end gap-3">
      <div>
        <!-- Balance -->
        <div class="text-sm md:text-base font-bold">
          <p v-if="isVisible">
            {{ formatAmount(wallet.balance, '') }}
          </p>
          <p v-else>****</p>
        </div>

        <!-- Equivalent in USD -->
        <div class="text-xs text-gray-500 dark:text-gray-400">
          <p v-if="isVisible">
            ≈ {{ formatAmount(usdEquivalent, 'USD') }}
          </p>
          <p v-else class="font-bold">....</p>
        </div>
      </div>

      <!-- Toggle button -->
      <button @click="isVisible = !isVisible"
        class="text-gray-600 dark:text-gray-400 hover:text-primary transition cursor-pointer"
        :aria-label="isVisible ? 'Hide balances' : 'Show balances'">
        <i :class="`bi ${isVisible ? 'bi-eye-slash' : 'bi-eye'} `"></i>
      </button>
    </div>
  </div>
</template>
