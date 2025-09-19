let wallets = []

export default function handler(req, res) {
  const { id } = req.query || {}

  if (req.method === 'GET') return res.status(200).json(wallets)

  if (req.method === 'POST') {
    const newWallet = { id: Date.now().toString(), balance: 0, createdAt: new Date().toISOString(), ...req.body }
    wallets.push(newWallet)
    return res.status(201).json(newWallet)
  }

  if (req.method === 'PUT') {
    if (!id) return res.status(400).json({ message: 'ID is required' })
    const index = wallets.findIndex(w => w.id === id)
    if (index === -1) return res.status(404).json({ message: 'Wallet not found' })
    wallets[index] = { ...wallets[index], ...req.body }
    return res.status(200).json(wallets[index])
  }

  if (req.method === 'DELETE') {
    if (!id) return res.status(400).json({ message: 'ID is required' })
    wallets = wallets.filter(w => w.id !== id)
    return res.status(204).end()
  }

  return res.status(405).json({ message: 'Method not allowed' })
}
