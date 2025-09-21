import { getDb } from './_data.js'

export default function handler(req, res) {
  const db = getDb()

  if (req.method === 'GET') {
    return res.status(200).json(db.wallets)
  }

  if (req.method === 'POST') {
    const wallet = { id: Date.now().toString(), ...req.body }
    db.wallets.push(wallet)
    return res.status(201).json(wallet)
  }

  if (req.method === 'PATCH' || req.method === 'PUT') {
    const { id } = req.query
    const idx = db.wallets.findIndex(w => w.id === id)

    if (idx === -1) {
      return res.status(404).json({ error: 'Wallet not found' })
    }

    db.wallets[idx] = { ...db.wallets[idx], ...req.body }
    return res.status(200).json(db.wallets[idx])
  }

  if (req.method === 'DELETE') {
    const { id } = req.query
    const idx = db.wallets.findIndex(w => w.id === id)

    if (idx === -1) {
      return res.status(404).json({ error: 'Wallet not found' })
    }

    const removed = db.wallets.splice(idx, 1)[0]
    return res.status(200).json(removed)
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
