import { getDb } from '../_data.js'

export default function handler(req, res) {
  const db = getDb()
  const { id } = req.query

  if (req.method === 'GET') {
    const account = db.depositAccounts.find(a => a.id === id)
    return account ? res.status(200).json(account) : res.status(404).json({ error: 'Deposit account not found' })
  }

  if (req.method === 'PATCH') {
    const idx = db.depositAccounts.findIndex(a => a.id === id)
    if (idx === -1) return res.status(404).json({ error: 'Deposit account not found' })

    db.depositAccounts[idx] = { ...db.depositAccounts[idx], ...req.body }
    return res.status(200).json(db.depositAccounts[idx])
  }

  if (req.method === 'DELETE') {
    const idx = db.depositAccounts.findIndex(a => a.id === id)
    if (idx === -1) return res.status(404).json({ error: 'Deposit account not found' })

    const removed = db.depositAccounts.splice(idx, 1)
    return res.status(200).json(removed[0])
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
