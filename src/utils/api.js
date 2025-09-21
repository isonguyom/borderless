import axios from 'axios'

const api = axios.create({
  baseURL: '/api', // always use relative path
  headers: { 'Content-Type': 'application/json' }
})

export default api
