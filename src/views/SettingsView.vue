<script setup>
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useWalletsStore } from '@/stores/wallets'
import { useCurrenciesStore } from '@/stores/currencies'
import { useAuthStore } from '@/stores/auth'
import { useDepositAccountsStore } from '@/stores/depositAccounts'

// Base Components
import AppLayout from '@/layouts/AppLayout.vue'
import BaseSelect from '@/components/base/BaseSelect.vue'
import BaseInput from '@/components/base/BaseInput.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseSwitch from '@/components/base/BaseSwitch.vue'
import BaseToast from '@/components/base/BaseToast.vue'
import DepositAccounts from '@/components/DepositAccounts.vue'

// --- Stores ---
const walletStore = useWalletsStore()
const { setLocalCurrency } = walletStore

const currenciesStore = useCurrenciesStore()
const { currencies, loading: currenciesLoading } = storeToRefs(currenciesStore)
const { fetchCurrencies } = currenciesStore

const depositAccountsStore = useDepositAccountsStore()
const { accounts, loading: depositAccountsLoading } = storeToRefs(depositAccountsStore)
const { fetchAccounts, addAccount, removeAccount } = depositAccountsStore

const authStore = useAuthStore()
const { fetchUser, updateProfile } = authStore

// --- Profile form state ---
const profileForm = ref({
  currency: '',
  username: '',
  emailOrPhone: '',
  notifications: {
    email: true,
    push: false,
    inApp: true
  }
})

// --- Toast state ---
const toast = ref({ message: '', type: 'success', duration: 3000 })
let toastTimeout
const showToast = (message, type = 'success', duration = 3000) => {
  clearTimeout(toastTimeout)
  toast.value = { message, type, duration }
  toastTimeout = setTimeout(() => {
    toast.value = { message: '', type: 'success', duration: 3000 }
  }, duration)
}

// --- Lifecycle ---
onMounted(async () => {
  await fetchCurrencies()
  await fetchAccounts()

  const latestUser = await fetchUser()
  if (latestUser) {
    profileForm.value = {
      ...profileForm.value,
      ...latestUser,
      notifications: latestUser.notifications ?? profileForm.value.notifications
    }
  }
})

// --- Handlers ---
const handleSaveProfileSettings = async () => {
  try {
    if (!profileForm.value.currency) throw new Error('Preferred currency is required')

    await updateProfile(profileForm.value)
    setLocalCurrency(profileForm.value.currency)

    showToast('Settings saved successfully!')
  } catch (err) {
    showToast(err.message || 'Failed to save settings', 'error')
  }
}

const handleAddAccount = async (account) => {
  try {
    await addAccount(account)
    showToast('Account added successfully!')
  } catch (err) {
    showToast(err.message || 'Failed to add account', 'error')
  }
}

const handleRemoveAccount = async (id) => {
  try {
    await removeAccount(id) // updates store + backend
    showToast('Account removed successfully!')
  } catch (err) {
    showToast(err.message || 'Failed to remove account', 'error')
  }
}

</script>

<template>
  <AppLayout>
    <div class="w-full mx-auto pb-8 space-y-8">
      <!-- Page Title -->
      <h2 class="text-lg md:text-xl font-semibold">Settings</h2>

      <!-- Profile Settings -->
      <form @submit.prevent="handleSaveProfileSettings" class="space-y-3" novalidate>
        <section class="bg-white dark:bg-gray-800 rounded-2xl shadow p-4 sm:p-6 space-y-4">
          <h2 class="text-sm md:text-base font-medium">Profile</h2>

          <div class="space-y-3">
            <BaseInput v-model="profileForm.emailOrPhone" type="text" label="Email or Phone"
              placeholder="Enter email or phone" />
            <BaseInput v-model="profileForm.username" type="text" label="Username" placeholder="Enter username" />
            <BaseSelect v-model="profileForm.currency" :options="currencies ?? []" :disabled="currenciesLoading"
              label="Preferred Currency" />
          </div>
        </section>

        <!-- Notification Preferences -->
        <section class="bg-white dark:bg-gray-800 rounded-2xl shadow p-4 sm:p-6 space-y-4">
          <h2 class="text-sm md:text-base font-medium">Notifications</h2>
          <div class="space-y-3">
            <BaseSwitch v-model="profileForm.notifications.email" label="Email Notifications" />
            <BaseSwitch v-model="profileForm.notifications.push" label="Push Notifications" />
            <BaseSwitch v-model="profileForm.notifications.inApp" label="In-App Notifications" />
          </div>
        </section>

        <!-- Save -->
        <div class="flex justify-end">
          <BaseButton type="submit">Save Settings</BaseButton>
        </div>
      </form>

      <!-- Deposit Accounts -->
      <DepositAccounts :accounts="accounts" :loading="depositAccountsLoading" @add-account="handleAddAccount"
        @remove-account="handleRemoveAccount" />

      <!-- Toast -->
      <BaseToast v-if="toast.message" :message="toast.message" :type="toast.type" :duration="toast.duration" />
    </div>
  </AppLayout>
</template>
