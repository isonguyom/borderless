import { getDb } from '../_data.js'

export default function handler(req, res) {
  const db = getDb()
  const { id } = req.query

  if (req.method === 'GET') {
    const token = db.tokens.find(t => t.id === id)
    return token ? res.status(200).json(token) : res.status(404).json({ error: 'Token not found' })
  }

  if (req.method === 'PATCH') {
    const idx = db.tokens.findIndex(t => t.id === id)
    if (idx === -1) return res.status(404).json({ error: 'Token not found' })

    db.tokens[idx] = { ...db.tokens[idx], ...req.body }
    return res.status(200).json(db.tokens[idx])
  }

  if (req.method === 'DELETE') {
    const idx = db.tokens.findIndex(t => t.id === id)
    if (idx === -1) return res.status(404).json({ error: 'Token not found' })

    const removed = db.tokens.splice(idx, 1)
    return res.status(200).json(removed[0])
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
