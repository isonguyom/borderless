// In-memory "database"
let wallets = []

export default function handler(req, res) {
  if (req.method === 'POST') {
    const { currency, balance = 0 } = req.body

    // Check if wallet for this currency already exists
    const exists = wallets.find(w => w.currency === currency)
    if (exists) {
      return res.status(409).json({ code: 'WALLET_EXISTS', message: 'Wallet already exists' })
    }

    const newWallet = {
      id: Date.now(),
      currency,
      balance,
      createdAt: new Date().toISOString()
    }

    wallets.push(newWallet)
    return res.status(201).json(newWallet)
  }

  if (req.method === 'GET') {
    return res.status(200).json(wallets)
  }

  return res.status(405).json({ message: 'Method not allowed' })
}
