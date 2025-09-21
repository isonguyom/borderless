import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/utils/api'
import { useRouter } from 'vue-router'

export const useAuthStore = defineStore('auth', () => {
  const router = useRouter()
  const user = ref(null)
  const token = ref(null)
  const localCurrency = ref('NGN')
  const isAuthenticated = computed(() => !!user.value && !!token.value)

  function generateRandomUsername() {
    const adjectives = ['Swift', 'Brave', 'Clever', 'Mighty', 'Silent', 'Golden', 'Quick']
    const nouns = ['Lion', 'Falcon', 'Tiger', 'Panther', 'Eagle', 'Shark', 'Wolf']
    const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)]
    const randomNoun = nouns[Math.floor(Math.random() * nouns.length)]
    const randomNumber = Math.floor(100 + Math.random() * 900) // 3-digit number
    return `${randomAdjective}${randomNoun}${randomNumber}`
  }


  // 🔑 Sign up
  async function signup(emailOrPhone) {
    // check if user exists first
    const existing = await api.get(`/users?emailOrPhone=${emailOrPhone}`)
    if (existing.data.length > 0) {
      const err = new Error('User already exists')
      err.code = 'USER_EXISTS'
      throw err
    }

    const payload = {
      emailOrPhone, currency: localCurrency.value, username: generateRandomUsername(), notifications: {
        email: true,
        push: false,
        inApp: true

      }, createdAt: new Date().toISOString()
    }
    const res = await api.post('/users', payload)
    user.value = res.data
    await issueToken(res.data.id)
    saveSession()
  }

  // 🔑 Login
  async function login(emailOrPhone) {
    const res = await api.get(`/users?emailOrPhone=${emailOrPhone}`)
    if (res.data.length === 0) {
      const err = new Error('User not found')
      err.code = 'USER_NOT_FOUND'
      throw err
    }

    user.value = res.data[0]
    await issueToken(user.value.id)
    saveSession()
  }

  // 🎫 Issue fake token
  async function issueToken(userId) {
    const mockToken = `mock_${Date.now()}_${Math.random().toString(36).substring(2)}`
    const tokenRes = await api.post('/tokens', { userId, token: mockToken })
    token.value = tokenRes.data.token
  }

  // 📦 Persistence
  function saveSession() {
    localStorage.setItem(
      'auth_session',
      JSON.stringify({ user: user.value, token: token.value })
    )
  }

  function loadSession() {
    const saved = localStorage.getItem('auth_session')
    if (saved) {
      const parsed = JSON.parse(saved)
      user.value = parsed.user
      token.value = parsed.token
    }
  }

  function logout() {
    user.value = null
    token.value = null
    localStorage.removeItem('auth_session')
    router.push('/onboard')
  }

  async function fetchUser() {
    if (!user.value) return null

    const res = await api.get(`/users/${user.value.id}`)
    user.value = res.data
    saveSession()
    return res.data
  }

  async function updateProfile(payload) {
    if (!user.value) throw new Error('No user is logged in')

    const res = await api.put(`/users/${user.value.id}`, {
      ...user.value,
      ...payload
    })

    user.value = res.data
    saveSession() // persist updated user
    return res.data
  }

  return { user, token, isAuthenticated, signup, login, loadSession, logout, fetchUser, updateProfile }
})
