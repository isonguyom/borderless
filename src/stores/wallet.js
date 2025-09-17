import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useWalletStore = defineStore('wallet', () => {
  const wallets = ref([])
  const activeWallet = ref(null)

  function createWallet(type = 'NGN', batch = 'Batch A') {
    const newWallet = {
      id: Date.now(),
      type,
      batch,
      balance: 0,
      equivalent: '$0.00'
    }
    wallets.value.push(newWallet)
    activeWallet.value = newWallet
  }

  function deposit(walletId, amount) {
    const wallet = wallets.value.find(w => w.id === walletId)
    if (wallet) wallet.balance += amount
  }

  function swap(fromWalletId, toWalletId, amount, rate = 1) {
    const fromWallet = wallets.value.find(w => w.id === fromWalletId)
    const toWallet = wallets.value.find(w => w.id === toWalletId)
    if (fromWallet && toWallet && fromWallet.balance >= amount) {
      fromWallet.balance -= amount
      toWallet.balance += amount * rate
    }
  }

  function send(fromWalletId, toWalletId, amount) {
    const fromWallet = wallets.value.find(w => w.id === fromWalletId)
    const toWallet = wallets.value.find(w => w.id === toWalletId)
    if (fromWallet && toWallet && fromWallet.balance >= amount) {
      fromWallet.balance -= amount
      toWallet.balance += amount
    }
  }

  return { wallets, activeWallet, createWallet, deposit, swap, send }
})
