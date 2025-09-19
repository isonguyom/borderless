let currencies = [
  { value: "USD", label: "US Dollar", symbol: "$", type: "fiat", color: "#0c325b", rate: 1 },
  { value: "NGN", label: "Nigerian Naira", symbol: "₦", type: "fiat", color: "#008000", rate: 1500 },
  { value: "EUR", label: "Euro", symbol: "€", type: "fiat", color: "#003399", rate: 0.92 },
  { value: "GBP", label: "British Pound", symbol: "£", type: "fiat", color: "#990000", rate: 0.8 },
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

