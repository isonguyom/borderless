<script setup>
import { ref, computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useTransactionsStore } from '@/stores/transactions'

import AppLayout from '@/layouts/AppLayout.vue'
import TransactionCard from '@/components/TransactionCard.vue'
import BaseContentWrapper from '@/components/base/BaseContentWrapper.vue'
import BasePagination from '@/components/base/BasePagination.vue'

const txStore = useTransactionsStore()
const { transactions, loading, error } = storeToRefs(txStore)
const { fetchTransactions } = txStore

const currentPage = ref(1)
const pageSize = 10

const paginatedTransactions = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return transactions.value.slice(start, start + pageSize)
})

onMounted(() => {
  fetchTransactions()
})
</script>

<template>
  <AppLayout>
    <div class="w-full space-y-6 pb-8">
      <h2 class="text-lg md:text-xl font-semibold">Transaction History</h2>

      <BaseContentWrapper :items="transactions" :loading="loading" :error="error"
        :empty-state="{ title: 'No transactions found', description: 'You do not have any transactions at the moment. Check back soon.' }">

        <template #default="{ items }">
          <div class="space-y-2">
            <TransactionCard v-for="tx in paginatedTransactions" :key="tx.id" :tx="tx" />
          </div>

          <!-- Pagination -->
          <BasePagination v-model="currentPage" :total-items="items.length" :page-size="pageSize" />
        </template>
      </BaseContentWrapper>
    </div>
  </AppLayout>
</template>
