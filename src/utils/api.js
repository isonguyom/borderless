// utils/api.js
import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
})

// 🔥 Interceptor to normalize ID-based requests
api.interceptors.request.use((config) => {
  // If the request is PATCH or DELETE with ?id= in the URL,
  // rewrite it to use /:id path (so it works locally & deployed)
  if ((config.method === 'patch' || config.method === 'delete' || config.method === 'put') && config.url.includes('?id=')) {
    const [base, query] = config.url.split('?id=')
    const id = query.split('&')[0] // just take the first id
    config.url = `${base}/${id}`
  }
  return config
})

export default api
