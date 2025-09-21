// utils/api.js
import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
})

// Collections we want to normalize
const collections = [
  'wallets',
  'users',
  'tokens',
  'transactions',
  'depositAccounts',
  'currencies'
]

// 🔥 Interceptor: normalize query-style requests to RESTful style
api.interceptors.request.use((config) => {
  for (const col of collections) {
    const pattern = new RegExp(`^/${col}\\?id=([^&]+)`)
    const match = config.url.match(pattern)

    if (match) {
      const id = match[1]

      if (config.method === 'post') {
        throw new Error(
          `❌ Invalid request: POST with '?id=' is not allowed. Use POST /${col} without id.`
        )
      }

      if (['patch', 'put', 'delete', 'get'].includes(config.method)) {
        config.url = `/${col}/${id}`
      }
      break
    }
  }
  return config
})

export default api
