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

  return res.status(405).json({ error: 'Method not allowed' })
}
