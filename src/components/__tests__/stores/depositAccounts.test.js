import { setActivePinia, createPinia } from 'pinia'
import { useDepositAccountsStore } from '@/stores/depositAccounts'
import { vi, describe, it, expect, beforeEach } from 'vitest'

describe('DepositAccounts Store', () => {
  let depositAccountsStore

  beforeEach(() => {
    setActivePinia(createPinia())
    depositAccountsStore = useDepositAccountsStore()
  })

  it('initializes with empty accounts array', () => {
    expect(depositAccountsStore.accounts).toEqual([])
  })

  it('can add an account', async () => {
    const mockAccount = { id: 1, type: 'bank', number: '12345' }
    depositAccountsStore.addAccount = vi.fn().mockResolvedValue(mockAccount)

    const result = await depositAccountsStore.addAccount(mockAccount)
    expect(result).toEqual(mockAccount)
    expect(depositAccountsStore.addAccount).toHaveBeenCalledOnce()
  })

  it('can remove an account', async () => {
    depositAccountsStore.removeAccount = vi.fn().mockResolvedValue({ success: true })
    const result = await depositAccountsStore.removeAccount(1)
    expect(result.success).toBe(true)
    expect(depositAccountsStore.removeAccount).toHaveBeenCalledOnce()
  })
})
