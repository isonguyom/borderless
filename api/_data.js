let db = {
  currencies: [
    { value: "USD", label: "US Dollar", symbol: "$", type: "fiat", color: "#0c325b", rate: 1 },
    { value: "NGN", label: "Nigerian Naira", symbol: "₦", type: "fiat", color: "#008000", rate: 1500 },
    { value: "EUR", label: "Euro", symbol: "€", type: "fiat", color: "#003399", rate: 0.92 },
    { value: "GBP", label: "British Pound", symbol: "£", type: "fiat", color: "#990000", rate: 0.8 },

    // Stablecoins
    { value: "USDT", label: "Tether", symbol: "₮", type: "stablecoin", color: "#26A17B", rate: 1 },
    { value: "USDC", label: "USD Coin", symbol: "Ⓢ", type: "stablecoin", color: "#2775CA", rate: 1 },
    { value: "BUSD", label: "Binance USD", symbol: "Ⓑ", type: "stablecoin", color: "#F3BA2F", rate: 1 },
    { value: "DAI", label: "Dai", symbol: "Đ", type: "stablecoin", color: "#F5AC37", rate: 1 }
  ],

  users: [],
  tokens: [],
  wallets: [],
  transactions: [],
  depositAccounts: [],
}

// Getter
export function getDb() {
  return db
}

// Mutator
export function setDb(newDb) {
  db = newDb
}
