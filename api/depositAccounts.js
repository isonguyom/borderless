import { getDb } from './_data.js'

export default function handler(req, res) {
  const db = getDb()

  if (req.method === 'GET') {
    return res.status(200).json(db.depositAccounts)
  }

  if (req.method === 'POST') {
    const acc = { id: Date.now().toString(), ...req.body }
    db.depositAccounts.push(acc)
    return res.status(201).json(acc)
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
