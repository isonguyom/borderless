import { getDb, setDb } from './_data.js'

export default function handler(req, res) {
  const { method, query, body } = req
  const id = query.id
  const db = getDb()
  let accounts = db.depositAccounts || []

  if (method === 'GET') {
    if (id) {
      const account = accounts.find((a) => a.id === id)
      if (!account) return res.status(404).json({ error: 'Account not found' })
      return res.status(200).json(account)
    }
    return res.status(200).json(accounts)
  }

  if (method === 'POST') {
    const account = { id: Date.now().toString(36), ...body }
    accounts.push(account)
    setDb({ ...db, depositAccounts: accounts })
    return res.status(201).json(account)
  }

  if (method === 'PATCH') {
    if (!id) return res.status(400).json({ error: 'Missing id' })
    accounts = accounts.map((a) => (a.id === id ? { ...a, ...body } : a))
    setDb({ ...db, depositAccounts: accounts })
    const updated = accounts.find((a) => a.id === id)
    return res.status(200).json(updated)
  }

  if (req.method === 'DELETE') {
    const { id } = req.query
    db.depositAccounts = db.depositAccounts.filter(acc => acc.id !== id)
    setDb(db)
    return res.status(200).json({ success: true })
  }

  return res.status(405).json({ error: `Method ${method} Not Allowed` })
}
