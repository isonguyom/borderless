<script setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

import AuthLayout from '@/layouts/AuthLayout.vue'
import BaseInput from '@/components/base/BaseInput.vue'
import BaseButton from '@/components/base/BaseButton.vue'

const router = useRouter()
const auth = useAuthStore()

const input = ref('')
const error = ref('')
const mode = ref('login')
const loading = ref(false)

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const phoneRegex = /^\+?[0-9]{7,15}$/

function validateInput(value) {
  const trimmed = value.trim()
  if (!trimmed) return 'Enter email or phone'
  if (!(emailRegex.test(trimmed) || phoneRegex.test(trimmed))) {
    return 'Enter a valid email or phone number'
  }
  return ''
}

async function handleSubmit() {
  error.value = validateInput(input.value)
  if (error.value) return

  loading.value = true
  try {
    // simulate slow API latency
    await new Promise(resolve => setTimeout(resolve, 1200))

    if (mode.value === 'signup') {
      await auth.signup(input.value.trim())
    } else {
      await auth.login(input.value.trim())
    }

    // redirect after successful auth
    router.push('/')
  } catch (e) {
    // handle known error messages from mock API
    if (e.code === 'USER_EXISTS') {
      error.value = 'Account already exists. Please login.'
    } else if (e.code === 'USER_NOT_FOUND') {
      error.value = 'No account found. Please sign up first.'
    } else {
      error.value = e.message || 'Something went wrong. Try again.'
    }
  } finally {
    loading.value = false
  }
}

// Clear error when switching modes
watch(mode, () => {
  error.value = ''
})

// Clear error when editing
watch(input, () => {
  if (error.value) error.value = ''
})
</script>

<template>
  <AuthLayout :welcome-msg="mode === 'signup' ? 'Welcome' : 'Welcome back'">
    <div class="w-full">
      <!-- Heading -->
      <h1 class="text-xl font-medium text-gray-300 mb-4 uppercase" id="auth-heading">
        {{ mode === 'signup' ? 'Sign Up' : 'Login' }}
      </h1>

      <!-- Auth Form -->
      <form @submit.prevent="handleSubmit" aria-labelledby="auth-heading" class="flex flex-col gap-y-3">

        <BaseInput v-model="input" label="" placeholder="Enter Email or Phone" variant="light" :error="error"
          :loading="loading" />

        <BaseButton type="submit" variant="secondary" :loading="loading" loading-text="Processing">
          {{ mode === 'signup' ? 'Create Account' : 'Continue' }}
        </BaseButton>
      </form>

      <!-- Mode toggle -->
      <p class="mt-4 text-sm text-gray-300 text-center">
        <span v-if="mode === 'login'">
          Don’t have an account?
          <button type="button" @click="mode = 'signup'"
            class="text-gray-200 hover:text-white underline font-semibold cursor-pointer" :disabled="loading">
            Sign up
          </button>
        </span>

        <span v-else>
          Already registered?
          <button type="button" @click="mode = 'login'"
            class="text-gray-200 hover:text-white underline font-semibold cursor-pointer" :disabled="loading">
            Login
          </button>
        </span>
      </p>
    </div>
  </AuthLayout>
</template>
