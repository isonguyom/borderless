import { getDb, setDb } from './_data.js'

export default function handler(req, res) {
  const { method, query, body } = req
  const id = query.id
  const db = getDb()
  let tokens = db.tokens || []

  if (method === 'GET') {
    if (id) {
      const token = tokens.find((t) => t.id === id)
      if (!token) return res.status(404).json({ error: 'Token not found' })
      return res.status(200).json(token)
    }
    return res.status(200).json(tokens)
  }

  if (method === 'POST') {
    const token = { id: Date.now().toString(36), ...body }
    tokens.push(token)
    setDb({ ...db, tokens })
    return res.status(201).json(token)
  }

  if (method === 'PATCH') {
    if (!id) return res.status(400).json({ error: 'Missing id' })
    tokens = tokens.map((t) => (t.id === id ? { ...t, ...body } : t))
    setDb({ ...db, tokens })
    const updated = tokens.find((t) => t.id === id)
    return res.status(200).json(updated)
  }

  if (method === 'DELETE') {
    if (!id) return res.status(400).json({ error: 'Missing id' })
    tokens = tokens.filter((t) => t.id !== id)
    setDb({ ...db, tokens })
    return res.status(200).json({ success: true })
  }

  return res.status(405).json({ error: `Method ${method} Not Allowed` })
}
