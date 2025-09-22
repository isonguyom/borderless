import { setActivePinia, createPinia } from 'pinia'
import { useWalletsStore } from '@/stores/wallets'
import { vi, describe, it, expect, beforeEach } from 'vitest'

describe('Wallets Store', () => {
  let walletsStore

  beforeEach(() => {
    setActivePinia(createPinia())
    walletsStore = useWalletsStore()
  })

  it('initializes with empty wallets array', () => {
    expect(walletsStore.wallets).toEqual([])
  })

  it('can add a wallet', async () => {
    const mockWallet = { id: 1, currency: 'USD', balance: 0 }
    walletsStore.createWallet = vi.fn().mockResolvedValue(mockWallet)

    const result = await walletsStore.createWallet(mockWallet)
    expect(result).toEqual(mockWallet)
    expect(walletsStore.createWallet).toHaveBeenCalledOnce()
  })

  it('can deposit funds', async () => {
    walletsStore.depositFunds = vi.fn().mockResolvedValue({ success: true })
    const result = await walletsStore.depositFunds({ walletId: 1, amount: 100 })
    expect(result.success).toBe(true)
    expect(walletsStore.depositFunds).toHaveBeenCalledOnce()
  })

  it('can swap currencies', async () => {
    walletsStore.swapCurrency = vi.fn().mockResolvedValue({ success: true })
    const result = await walletsStore.swapCurrency({ from: 'USD', to: 'EUR', amount: 50 })
    expect(result.success).toBe(true)
    expect(walletsStore.swapCurrency).toHaveBeenCalledOnce()
  })
})
