import { getDb, setDb } from './_data.js'

export default function handler(req, res) {
  const { method, query, body } = req
  const id = query.id
  const db = getDb()
  let wallets = db.wallets || []

  if (method === 'GET') {
    if (id) {
      const wallet = wallets.find((w) => w.id === id)
      if (!wallet) return res.status(404).json({ error: 'Wallet not found' })
      return res.status(200).json(wallet)
    }
    return res.status(200).json(wallets)
  }

  if (method === 'POST') {
    const wallet = { id: Date.now().toString(36), ...body }
    wallets.push(wallet)
    setDb({ ...db, wallets })
    return res.status(201).json(wallet)
  }

  if (method === 'PATCH') {
    if (!id) return res.status(400).json({ error: 'Missing id' })
    wallets = wallets.map((w) => (w.id === id ? { ...w, ...body } : w))
    setDb({ ...db, wallets })
    const updated = wallets.find((w) => w.id === id)
    return res.status(200).json(updated)
  }

  if (method === 'DELETE') {
    if (!id) return res.status(400).json({ error: 'Missing id' })
    wallets = wallets.filter((w) => w.id !== id)
    setDb({ ...db, wallets })
    return res.status(200).json({ success: true })
  }

  return res.status(405).json({ error: `Method ${method} Not Allowed` })
}
