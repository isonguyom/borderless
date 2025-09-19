<script setup>
import { ref, toRef } from 'vue'
import { useTotalBalance } from '@/composables/totalBalance'
import { formatAmount } from '@/composables/formatAmount'

const props = defineProps({
  wallets: {
    type: Array,
    default: () => []
  },
  preferredCurrency: {
    type: String,
    default: 'USD'
  }
})

const emit = defineEmits(['create-wallet'])

// Keep props reactive
const wallets = toRef(props, 'wallets')
const preferredCurrency = toRef(props, 'preferredCurrency')

// Composables
const { totalInUSD, totalInPreferred, loading: amountComputing } = useTotalBalance(wallets, preferredCurrency)

// State for toggling balance visibility
const isVisible = ref(true)
</script>

<template>
  <div class="bg-primary/10 shadow rounded-xl p-6 relative">
    <div class="flex items-center gap-x-3">
      <h2 class="text-lg font-medium text-gray-600 dark:text-gray-400">Total Balance</h2>

      <!-- Toggle button -->
      <button @click="isVisible = !isVisible" class="text-gray-500 hover:text-primary transition cursor-pointer"
        :aria-label="isVisible ? 'Hide balances' : 'Show balances'">
        <i :class="`bi ${isVisible ? 'bi-eye-slash' : 'bi-eye'} text-lg`"></i>
      </button>
    </div>

    <!-- Preferred currency display -->
    <div class="text-xl md:text-3xl font-bold mt-2 truncate w-full">
      <p v-if="amountComputing">Computing...</p>
      <p v-else-if="isVisible">
        {{ formatAmount(totalInPreferred, preferredCurrency) }}
      </p>
      <p v-else>****</p>
    </div>

    <!-- USD equivalent -->
    <div class="text-gray-500 dark:text-gray-400 w-full truncate">
      <p v-if="amountComputing">≈</p>
      <p v-if="isVisible">
        ≈ {{ formatAmount(totalInUSD, 'USD') }}
      </p>
      <p v-else>≈ ••••</p>
    </div>

    <!--Create wallet action -->
    <button @click="emit('create-wallet')" class="text-sm font-semibold text-primary mt-3 hover:text-primary-dark
             dark:hover:text-primary-light hover:underline transition-colors cursor-pointer">
      + Create Wallet
    </button>
  </div>
</template>
