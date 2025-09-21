import { getDb } from '../_data.js'

export default function handler(req, res) {
  const db = getDb()
  const { id } = req.query

  if (req.method === 'GET') {
    const user = db.users.find(u => u.id === id)
    return user ? res.status(200).json(user) : res.status(404).json({ error: 'User not found' })
  }

  if (req.method === 'PATCH') {
    const idx = db.users.findIndex(u => u.id === id)
    if (idx === -1) return res.status(404).json({ error: 'User not found' })

    db.users[idx] = { ...db.users[idx], ...req.body }
    return res.status(200).json(db.users[idx])
  }

  if (req.method === 'DELETE') {
    const idx = db.users.findIndex(u => u.id === id)
    if (idx === -1) return res.status(404).json({ error: 'User not found' })

    const removed = db.users.splice(idx, 1)
    return res.status(200).json(removed[0])
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
