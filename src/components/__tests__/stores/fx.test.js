// fx.test.js
import { setActivePinia, createPinia } from 'pinia'
import { useFxStore } from '@/stores/fx'
import { describe, it, expect, beforeEach } from 'vitest'

describe('FX Store', () => {
  let fxStore

  beforeEach(() => {
    setActivePinia(createPinia())
    fxStore = useFxStore()
  })

  it('initializes with empty fxData', () => {
    // fxData should be empty object at initialization
    expect(fxStore.fxData).toEqual({})
  })

  it('fetchFXData populates fxData', async () => {
    await fxStore.fetchFXData()
    expect(fxStore.fxData).toEqual(fxStore.mockFXData)
  })

  it('fetchPerformanceData populates performanceData', async () => {
    await fxStore.fetchPerformanceData()
    expect(fxStore.performanceData).toEqual(fxStore.mockPerformanceData)
  })

  it('can return FX rate for a currency pair', async () => {
    await fxStore.fetchFXData()
    // example: get USD/NGN 1h price
    const usdNgn1h = fxStore.fxData['USD/NGN']['1h'][0].price
    expect(typeof usdNgn1h).toBe('number')
  })
})
