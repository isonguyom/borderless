// In-memory "database"
let currencies = [
  { value: "USD", label: "US Dollar", symbol: "$", color: "#0071BC", type: "fiat" },
  { value: "EUR", label: "Euro", symbol: "€", color: "#003399", type: "fiat" },
  { value: "NGN", label: "Nigerian Naira", symbol: "₦", color: "#008000", type: "fiat" },
  { value: "USDT", label: "Tether", symbol: "₮", color: "#26A17B", type: "stablecoin" },
  { value: "USDC", label: "USD Coin", symbol: "Ⓢ", color: "#2775CA", type: "stablecoin" },
  { value: "BTC", label: "Bitcoin", symbol: "₿", color: "#F7931A", type: "crypto" },
  { value: "ETH", label: "Ethereum", symbol: "Ξ", color: "#3C3C3D", type: "crypto" }
]
export default function handler(req, res) {
  if (req.method === 'GET') return res.status(200).json(currencies)

  if (req.method === 'POST') {
    const newCurrency = { ...req.body }
    currencies.push(newCurrency)
    return res.status(201).json(newCurrency)
  }

  return res.status(405).json({ message: 'Method not allowed' })
}
