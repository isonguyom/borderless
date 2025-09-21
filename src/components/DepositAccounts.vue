<template>
  <div class="space-y-6">
    <h2 class="md:text-lg font-medium mb-4">Deposit Accounts</h2>

    <!-- Existing Accounts -->
    <BaseContentWrapper :items="accounts" :loading="loading" :error="false"
      :empty-state="{ title: 'No accounts found', description: 'Add an account to get started.' }">

      <div class="space-y-3">
        <div v-for="acc in accounts" :key="acc.id"
          class="relative border border-gray-300 dark:border-gray-700 hover:bg-gray-200/50 dark:hover:bg-gray-700/50 p-3 rounded-lg text-sm md:text-base">
          <div>
            <p class="font-medium">{{ acc.type }}</p>
            <p class="text-sm text-gray-500">
              <span v-if="acc.type === 'Crypto Wallet'">
                {{ acc.walletName }} - {{ acc.address }}
              </span>
              <span v-else-if="acc.type === 'Bank Account'" class="flex flex-col">
                {{ acc.bankName }} - {{ acc.accountNumber }}
                <span class="text-xs font-medium text-gray-600 dark:text-gray-400">{{ acc.accountName }}</span>
              </span>
              <span v-else-if="acc.type === 'Card'" class="flex flex-col">
                {{ acc.cardType }} - ****{{ acc.last4 }}
                <span v-if="acc.cardName" class="text-xs font-medium text-gray-600 dark:text-gray-400">{{ acc.cardName
                  }}</span>
              </span>
            </p>
          </div>
          <button class="text-danger hover:text-red-600 text-2xl absolute right-3 top-3 cursor-pointer"
            @click="$emit('remove-account', acc.id)">
            <i class="bi bi-x"></i>
          </button>
        </div>
      </div>
    </BaseContentWrapper>


    <!-- Add New Account -->
    <form @submit.prevent="submitForm" class="space-y-3" novalidate>
      <!-- Type selector -->
      <BaseSelect v-model="newAccount.type" :options="typeOptions" label="Select Deposit Type" :error="errors.type"
        @blur="validateField('type', 'Please select an account type.')" required />

      <!-- Crypto Wallet -->
      <div v-if="newAccount.type === 'Crypto Wallet'" class="space-y-2 relative">
        <BaseSelect v-model="newAccount.walletName" :options="cryptoOptions" label="Coin" :error="errors.walletName"
          @blur="validateField('walletName', 'Please select a wallet provider.')" required />

        <div class="relative">
          <BaseInput v-model="newAccount.address" type="text" label="Wallet Address" placeholder="Enter wallet address"
            :error="errors.address" @blur="validateCryptoAddress()" required />
          <BaseButton @click="pasteWalletAddress" size="sm" :loading="pastingAddress" loading-text="Pasting..."
            :disabled="pastingAddress" aria-busy="loading" class="absolute right-2 top-7.5">
            Paste
          </BaseButton>
        </div>
      </div>


      <!-- Bank Account -->
      <div v-else-if="newAccount.type === 'Bank Account'" class="space-y-2">
        <BaseSelect v-model="newAccount.bankName" :options="bankOptions" label="Bank" :error="errors.bankName"
          @blur="validateField('bankName', 'Please select a bank.')" required />
        <BaseInput v-model="newAccount.accountNumber" type="text" label="Account Number"
          placeholder="Enter account number" maxlength="10" :error="errors.accountNumber"
          @input="numbersOnly('accountNumber')" @blur="validateField('accountNumber', 'Enter a valid account number.')"
          required />
        <BaseInput v-model="newAccount.accountName" type="text" label="Account Name"
          placeholder="Account name will be auto-filled" disabled />
      </div>


      <!-- Card -->
      <div v-else-if="newAccount.type === 'Card'" class="space-y-2">
        <BaseInput v-model="newAccount.cardNumber" type="text" label="Card Number" placeholder="Enter card number"
          maxlength="16" :error="errors.cardNumber" @input="handleCardInput"
          @blur="validateField('cardNumber', 'Enter a valid card number.')" required />
        <BaseInput v-model="newAccount.cardType" type="text" label="Card Type" placeholder="Detected from card number"
          disabled />
        <BaseInput v-model="newAccount.cardName" type="text" label="Card Name"
          placeholder="Auto-filled from card number" disabled />
        <BaseInput v-model="newAccount.CVV" type="password" label="CVV" placeholder="123" maxlength="3"
          :error="errors.CVV" @input="numbersOnly('CVV')" @blur="validateField('CVV', 'Enter CVV.')" required />
      </div>

      <div class="flex justify-end">
        <BaseButton v-if="newAccount.type" type="submit" :loading="loading" loading-text="Adding..." :disabled="loading"
          aria-busy="loading">
          Add Account
        </BaseButton>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive, watch } from "vue"
import BaseInput from "./base/BaseInput.vue"
import BaseSelect from "./base/BaseSelect.vue"
import BaseButton from "./base/BaseButton.vue"
import BaseContentWrapper from "./base/BaseContentWrapper.vue"

defineProps({
  accounts: { type: Array, required: true },
  accountLoading: { type: Boolean, default: false }
})
const emits = defineEmits(["add-account", "remove-account"])

const newAccount = ref({ type: "" })
const loading = ref(false)
const errors = reactive({})
const pastingAddress = ref(false)

// Account types
const typeOptions = [
  { label: "Bank Account", value: "Bank Account" },
  { label: "Crypto Wallet", value: "Crypto Wallet" },
  { label: "Card", value: "Card" }
]

// Option lists
const cryptoOptions = [
  { label: "Bitcoin", value: "BTC" },
  { label: "Ethereum", value: "ETH" },
  { label: "USDT", value: "USDT" }
]
const bankOptions = [
  { label: "First Bank", value: "First Bank" },
  { label: "GTBank", value: "GTBank" },
  { label: "Access Bank", value: "Access Bank" }
]

// Numbers-only input
const numbersOnly = (field) => {
  if (newAccount.value[field]) {
    newAccount.value[field] = newAccount.value[field].replace(/\D/g, "")
  }
}


const pasteWalletAddress = async () => {
  pastingAddress.value = true
  try {
    // Optional delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Read text from clipboard
    const text = await navigator.clipboard.readText()
    if (text) {
      newAccount.value.address = text.trim()
      validateCryptoAddress()
    } else {
      errors.address = "Clipboard is empty."
    }
  } catch (err) {
    console.error("Failed to read clipboard:", err)
    errors.address = "Cannot access clipboard. Please paste manually."
  } finally {
    pastingAddress.value = false
  }
}



// Crypto wallet validation
const validateCryptoAddress = () => {
  const wallet = newAccount.value.walletName
  const address = newAccount.value.address
  if (!address) {
    errors.address = "Enter a wallet address."
    return false
  }

  let isValid = false

  switch (wallet) {
    case "BTC":
      isValid = /^([13][a-km-zA-HJ-NP-Z1-9]{25,34})$/.test(address)
      break
    case "ETH":
      isValid = /^0x[a-fA-F0-9]{40}$/.test(address)
      break
    case "USDT":
      // USDT on Ethereum (ERC20) same as ETH address
      isValid = /^0x[a-fA-F0-9]{40}$/.test(address)
      break
    default:
      isValid = false
  }

  errors.address = isValid ? "" : "Invalid wallet address."
  return isValid
}


// Validate single field
const validateField = (field, message) => {
  errors[field] = !newAccount.value[field] ? message : ""
}

// Detect card brand & name automatically
const handleCardInput = () => {
  numbersOnly("cardNumber")
  const number = newAccount.value.cardNumber

  // Reset if input is empty
  if (!number) {
    newAccount.value.cardType = ""
    newAccount.value.cardName = ""
    return
  }

  // Card type detection via BIN
  if (/^4/.test(number)) newAccount.value.cardType = "Visa"
  else if (/^5[1-5]/.test(number)) newAccount.value.cardType = "MasterCard"
  else if (/^506/.test(number)) newAccount.value.cardType = "Verve"
  else newAccount.value.cardType = "Unknown"

  // Auto-fill card name once the number reaches minimum valid length
  if (number.length >= 12) {
    newAccount.value.cardName = `Account ****${number.slice(-4)}`
  } else {
    newAccount.value.cardName = ""
  }
}


// Form validation
const validateForm = () => {
  let valid = true
  Object.keys(errors).forEach(k => (errors[k] = ""))

  if (!newAccount.value.type) {
    errors.type = "Please select an account type."
    valid = false
  }

  if (newAccount.value.type === "Crypto Wallet") {
    if (!newAccount.value.walletName) {
      errors.walletName = "Select wallet."
      valid = false
    }
    if (!newAccount.value.address) {
      errors.address = "Invalid wallet address."
      valid = false
    }
  }



  if (newAccount.value.type === "Bank Account") {
    if (!newAccount.value.bankName) { errors.bankName = "Select bank."; valid = false }
    if (!newAccount.value.accountNumber) { errors.accountNumber = "Enter account number."; valid = false }
    if (!newAccount.value.accountName) { errors.accountName = "Account name missing."; valid = false }
  }

  if (newAccount.value.type === "Card") {
    if (!newAccount.value.cardType) { errors.cardType = "Select card type."; valid = false }
    if (!newAccount.value.cardNumber) { errors.cardNumber = "Enter card number."; valid = false }
    if (!newAccount.value.CVV) { errors.CVV = "Enter CVV."; valid = false }
  }

  return valid
}

// Submit
const submitForm = () => {
  if (!validateForm()) return

  loading.value = true   // start loading
  errors.value = {} // clear previous errors

  // Simulate API call
  setTimeout(() => {
    const account = {
      ...newAccount.value,
      id: String(Date.now()), // force ID to be a string
    };


    // For card: only keep last4
    if (account.type === "Card" && account.cardNumber) {
      account.last4 = account.cardNumber.slice(-4)
      delete account.cardNumber
      delete account.CVV
    }

    // Emit the new account
    emits("add-account", account)

    // Reset form
    newAccount.value = { type: "" }
    Object.keys(errors).forEach(k => (errors[k] = ""))

    loading.value = false // stop loading
  }, 1500) // simulate 1.5s network delay
}



// Watch all fields in newAccount and clear errors on change
watch(newAccount, (newVal) => {
  Object.keys(newVal).forEach((key) => {
    if (newVal[key] && errors[key]) {
      errors[key] = ""
    }
  })
}, { deep: true })

// Watch bankName and accountNumber to auto-fill account name
watch(
  () => [newAccount.value.bankName, newAccount.value.accountNumber],
  ([bank, number]) => {
    if (bank && number && number.length === 10) {
      loading.value = true
      setTimeout(() => {
        newAccount.value.accountName = `Account ${number.slice(-4)}`
        loading.value = false
      }, 1000)
    } else {
      newAccount.value.accountName = ""
    }
  }
)


</script>
