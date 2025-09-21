import { getDb, setDb } from './_data.js'

export default function handler(req, res) {
  const { method, query, body } = req
  const id = query.id
  const db = getDb()
  let transactions = db.transactions || []

  if (method === 'GET') {
    if (id) {
      const tx = transactions.find((t) => t.id === id)
      if (!tx) return res.status(404).json({ error: 'Transaction not found' })
      return res.status(200).json(tx)
    }
    return res.status(200).json(transactions)
  }

  if (method === 'POST') {
    const tx = { id: Date.now().toString(36), ...body }
    transactions.push(tx)
    setDb({ ...db, transactions })
    return res.status(201).json(tx)
  }

  if (method === 'PATCH') {
    if (!id) return res.status(400).json({ error: 'Missing id' })
    transactions = transactions.map((t) => (t.id === id ? { ...t, ...body } : t))
    setDb({ ...db, transactions })
    const updated = transactions.find((t) => t.id === id)
    return res.status(200).json(updated)
  }

  if (method === 'DELETE') {
    if (!id) return res.status(400).json({ error: 'Missing id' })
    transactions = transactions.filter((t) => t.id !== id)
    setDb({ ...db, transactions })
    return res.status(200).json({ success: true })
  }

  return res.status(405).json({ error: `Method ${method} Not Allowed` })
}
