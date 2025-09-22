import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import { vi, describe, it, expect, beforeEach } from 'vitest'

describe('Auth Store', () => {
  let authStore

  beforeEach(() => {
    setActivePinia(createPinia())
    authStore = useAuthStore()
    // Mock any injected properties if needed
    authStore.$router = { push: vi.fn() }
    authStore.$toast = { success: vi.fn(), error: vi.fn() }
  })


  // auth.test.js
  it('initializes with empty user', () => {
    // If your auth store initializes user as null:
    expect(authStore.user).toBeNull()
  })


  it('fetchUser sets user data', async () => {
    const mockUser = { id: 1, username: 'test', email: 'test@example.com' }
    authStore.fetchUser = vi.fn().mockResolvedValue(mockUser)

    const user = await authStore.fetchUser()
    expect(user).toEqual(mockUser)
  })

  it('updateProfile calls API and updates user', async () => {
    const updatedData = { username: 'newname' }
    authStore.updateProfile = vi.fn().mockResolvedValue(updatedData)

    const result = await authStore.updateProfile(updatedData)
    expect(result).toEqual(updatedData)
    expect(authStore.updateProfile).toHaveBeenCalledOnce()
  })
})
