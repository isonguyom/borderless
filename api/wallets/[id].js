import { getDb } from '../_data.js'

export default function handler(req, res) {
  const db = getDb()
  const { id } = req.query

  if (req.method === 'GET') {
    const wallet = db.wallets.find(w => w.id === id)
    return wallet
      ? res.status(200).json(wallet)
      : res.status(404).json({ error: 'Wallet not found' })
  }

  if (req.method === 'PATCH' || req.method === 'PUT') {
    const index = db.wallets.findIndex(w => w.id === id)
    if (index === -1) return res.status(404).json({ error: 'Wallet not found' })

    db.wallets[index] = { ...db.wallets[index], ...req.body }
    return res.status(200).json(db.wallets[index])
  }

  if (req.method === 'DELETE') {
    const index = db.wallets.findIndex(w => w.id === id)
    if (index === -1) return res.status(404).json({ error: 'Wallet not found' })

    const deleted = db.wallets.splice(index, 1)
    return res.status(200).json(deleted[0])
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
