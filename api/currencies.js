import { getDb, setDb } from './_data.js'

export default function handler(req, res) {
  const { method, query, body } = req
  const id = query.id
  const db = getDb()
  let currencies = db.currencies || []

  if (method === 'GET') {
    if (id) {
      const currency = currencies.find((c) => c.id === id)
      if (!currency) return res.status(404).json({ error: 'Currency not found' })
      return res.status(200).json(currency)
    }
    return res.status(200).json(currencies)
  }

  if (method === 'POST') {
    const currency = { id: Date.now().toString(36), ...body }
    currencies.push(currency)
    setDb({ ...db, currencies })
    return res.status(201).json(currency)
  }

  if (method === 'PATCH') {
    if (!id) return res.status(400).json({ error: 'Missing id' })
    currencies = currencies.map((c) => (c.id === id ? { ...c, ...body } : c))
    setDb({ ...db, currencies })
    const updated = currencies.find((c) => c.id === id)
    return res.status(200).json(updated)
  }

  if (method === 'DELETE') {
    if (!id) return res.status(400).json({ error: 'Missing id' })
    currencies = currencies.filter((c) => c.id !== id)
    setDb({ ...db, currencies })
    return res.status(200).json({ success: true })
  }

  return res.status(405).json({ error: `Method ${method} Not Allowed` })
}
