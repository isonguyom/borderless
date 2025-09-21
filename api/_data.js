// api/_data.js
let db = {
  currencies: [
    { value: "USD", label: "US Dollar", symbol: "$", type: "fiat", color: "#0c325b", rate: 1 },
    { value: "NGN", label: "Nigerian Naira", symbol: "₦", type: "fiat", color: "#008000", rate: 1500 },
    { value: "EUR", label: "Euro", symbol: "€", type: "fiat", color: "#003399", rate: 0.92 },
    { value: "GBP", label: "British Pound", symbol: "£", type: "fiat", color: "#990000", rate: 0.8 },
  ],
  users: [],
  tokens: [],
  wallets: [],
  transactions: [],
  depositAccounts: []
}

export function getDb() {
  return db
}

export function setDb(newDb) {
  db = newDb
}
