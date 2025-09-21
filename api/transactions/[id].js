import { getDb } from '../_data.js'

export default function handler(req, res) {
  const db = getDb()
  const { id } = req.query

  if (req.method === 'GET') {
    const tx = db.transactions.find(t => t.id === id)
    return tx ? res.status(200).json(tx) : res.status(404).json({ error: 'Transaction not found' })
  }

  if (req.method === 'PATCH') {
    const idx = db.transactions.findIndex(t => t.id === id)
    if (idx === -1) return res.status(404).json({ error: 'Transaction not found' })

    db.transactions[idx] = { ...db.transactions[idx], ...req.body }
    return res.status(200).json(db.transactions[idx])
  }

  if (req.method === 'DELETE') {
    const idx = db.transactions.findIndex(t => t.id === id)
    if (idx === -1) return res.status(404).json({ error: 'Transaction not found' })

    const removed = db.transactions.splice(idx, 1)
    return res.status(200).json(removed[0])
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
