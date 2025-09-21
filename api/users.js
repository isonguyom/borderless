import { getDb } from './_data.js'

export default function handler(req, res) {
  const db = getDb()

  if (req.method === 'GET') {
    return res.status(200).json(db.users)
  }

  if (req.method === 'POST') {
    const user = { id: Date.now().toString(), ...req.body }
    db.users.push(user)
    return res.status(201).json(user)
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
