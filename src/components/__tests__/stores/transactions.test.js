import { setActivePinia, createPinia } from 'pinia'
import { useTransactionsStore } from '@/stores/transactions'
import { vi, describe, it, expect, beforeEach } from 'vitest'

describe('Transactions Store', () => {
  let transactionsStore

  beforeEach(() => {
    setActivePinia(createPinia())
    transactionsStore = useTransactionsStore()
  })

  it('initializes with empty transactions', () => {
    expect(transactionsStore.transactions).toEqual([])
  })

  it('fetchTransactions populates transactions', async () => {
    const mockTransactions = [{ id: 1, amount: 100 }]
    transactionsStore.fetchTransactions = vi.fn().mockResolvedValue(mockTransactions)

    const result = await transactionsStore.fetchTransactions()
    expect(result).toEqual(mockTransactions)
    expect(transactionsStore.fetchTransactions).toHaveBeenCalledOnce()
  })

  it('sendTransaction calls API and returns success', async () => {
    transactionsStore.sendTransaction = vi.fn().mockResolvedValue({ success: true })
    const result = await transactionsStore.sendTransaction({ to: 'wallet2', amount: 50 })
    expect(result.success).toBe(true)
    expect(transactionsStore.sendTransaction).toHaveBeenCalledOnce()
  })
})
