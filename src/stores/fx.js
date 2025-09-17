import { defineStore } from 'pinia'
import axios from 'axios'

function sleep(ms){return new Promise(r=>setTimeout(r,ms))}

export const useFxStore = defineStore('fx', {
  state: () => ({
    rates: {},            // { "USD_EUR": { rate, ts } }
    loading: false,
    error: null,
    ttl: 30 * 1000       // 30s default TTL
  }),
  actions: {
    async fetchRate(pair, { force=false } = {}) {
      const key = pair.replace('/','_')
      const cached = this.rates[key]
      const now = Date.now()
      if (!force && cached && (now - cached.ts) < this.ttl) return cached.rate

      this.loading = true
      this.error = null

      // Exponential backoff attempts
      let attempt = 0
      const maxAttempt = 3
      while (attempt < maxAttempt) {
        try {
          attempt++
          // example FX API — replace URL with actual provider
          const res = await axios.get(`https://api.exchangerate.host/convert?from=${pair.split('/')[0]}&to=${pair.split('/')[1]}`)
          const rate = res.data?.result ?? null
          if (!rate) throw new Error('NoRate')
          this.rates[key] = { rate, ts: Date.now() }
          this.loading = false
          return rate
        } catch (err) {
          this.error = err.message || 'FX_FETCH_ERROR'
          const backoff = 200 * Math.pow(2, attempt) // 400, 800ms...
          await sleep(backoff)
          // If final attempt, return last-known cached rate (graceful fallback)
          if (attempt === maxAttempt && cached) {
            return cached.rate
          }
          if (attempt === maxAttempt) throw err
        }
      }
    }
  }
})
