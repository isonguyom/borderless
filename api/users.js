import { getDb, setDb } from './_data.js'

export default function handler(req, res) {
  const { method, query, body } = req
  const id = query.id
  const db = getDb()
  let users = db.users || []

  if (method === 'GET') {
    if (id) {
      const user = users.find((u) => u.id === id)
      if (!user) return res.status(404).json({ error: 'User not found' })
      return res.status(200).json(user)
    }
    return res.status(200).json(users)
  }

  if (method === 'POST') {
    const user = { id: Date.now().toString(36), ...body }
    users.push(user)
    setDb({ ...db, users })
    return res.status(201).json(user)
  }

  if (method === 'PATCH') {
    if (!id) return res.status(400).json({ error: 'Missing id' })
    users = users.map((u) => (u.id === id ? { ...u, ...body } : u))
    setDb({ ...db, users })
    const updated = users.find((u) => u.id === id)
    return res.status(200).json(updated)
  }

  if (method === 'DELETE') {
    if (!id) return res.status(400).json({ error: 'Missing id' })
    users = users.filter((u) => u.id !== id)
    setDb({ ...db, users })
    return res.status(200).json({ success: true })
  }

  return res.status(405).json({ error: `Method ${method} Not Allowed` })
}
