import { getDb } from './_data.js'

export default function handler(req, res) {
  const db = getDb()

  if (req.method === 'GET') {
    return res.status(200).json(db.tokens)
  }

  if (req.method === 'POST') {
    const token = { id: Date.now().toString(), ...req.body }
    db.tokens.push(token)
    return res.status(201).json(token)
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
