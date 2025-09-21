import { getDb } from './_data.js'

export default function handler(req, res) {
  const db = getDb()

  if (req.method === 'GET') {
    return res.status(200).json(db.transactions)
  }

  if (req.method === 'POST') {
    const tx = { id: Date.now().toString(), ...req.body }
    db.transactions.push(tx)
    return res.status(201).json(tx)
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
