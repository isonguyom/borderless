import { getDb } from '../_data.js'

export default function handler(req, res) {
  const db = getDb()
  const { id } = req.query

  if (req.method === 'GET') {
    const currency = db.currencies.find(c => c.id === id)
    return currency ? res.status(200).json(currency) : res.status(404).json({ error: 'Currency not found' })
  }

  if (req.method === 'PATCH') {
    const idx = db.currencies.findIndex(c => c.id === id)
    if (idx === -1) return res.status(404).json({ error: 'Currency not found' })

    db.currencies[idx] = { ...db.currencies[idx], ...req.body }
    return res.status(200).json(db.currencies[idx])
  }

  if (req.method === 'DELETE') {
    const idx = db.currencies.findIndex(c => c.id === id)
    if (idx === -1) return res.status(404).json({ error: 'Currency not found' })

    const removed = db.currencies.splice(idx, 1)
    return res.status(200).json(removed[0])
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
