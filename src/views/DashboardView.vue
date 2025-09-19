<script setup>
import AppLayout from '@/layouts/AppLayout.vue'
import { useAuthStore } from '@/stores/auth'
import { useWalletStore } from '@/stores/wallets'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const auth = useAuthStore()
const walletStore = useWalletStore()
const creating = ref(false)

async function createWallet() {
  creating.value = true
  try {
    await walletStore.createWallet(auth.user.emailOrPhone)
  } finally {
    creating.value = false
  }
}

function handleLogout() {
  auth.logout()
  router.push('/onboard') // go to dashboard
}
</script>

<template>
  <AppLayout>
    <div class="p-6">
      <h1 class="text-2xl font-bold">Dashboard</h1>

      <div class="mt-4">
        <p class="text-muted">Logged in as {{ auth.user?.emailOrPhone }}</p>
        <button @click="handleLogout" class="mt-2 text-sm text-danger underline">Logout</button>
      </div>

      <div v-if="walletStore.activeWallet" class="mt-6">
        <h2 class="text-lg font-semibold">Your Wallet</h2>
        <p>ID: {{ walletStore.activeWallet.address }}</p>
        <p>Balances: {{ walletStore.activeWallet.balances }}</p>
      </div>

      <div v-else class="mt-6">
        <p>No wallet yet.</p>
        <button @click="createWallet" class="mt-4 bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark"
          :disabled="creating">
          <span v-if="!creating">Create Wallet</span>
          <span v-else>Creating...</span>
        </button>
      </div>
    </div>
  </AppLayout>
</template>
