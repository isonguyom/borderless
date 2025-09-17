<script setup>
import AppLayout from '@/layouts/AppLayout.vue'
import { onMounted } from 'vue'
import { useTransactionsStore } from '@/stores/transactions'

import TransactionCard from '@/components/TransactionCard.vue'

const txStore = useTransactionsStore()

onMounted(() => {
  txStore.fetchTransactions()
})
</script>

<template>
  <AppLayout>
    <h1 class="text-2xl font-bold mb-6">Transaction History</h1>

    <div v-if="txStore.loading" class="text-gray-500">Loading transactions...</div>
    <div v-else-if="txStore.error" class="text-red-500">{{ txStore.error }}</div>
    <div v-else>
      <div class="space-y-4">
      <TransactionCard v-for="tx in txStore.transactions" :key="tx.id" :type="tx.type" :currency="tx.currency"
        :amount="tx.amount" :date="tx.date" :status="tx.status" />
    </div>
    </div>
  </AppLayout>
</template>
