let depositAccounts = []

export default function handler(req, res) {
  const { id } = req.query || {}

  if (req.method === 'GET') return res.status(200).json(depositAccounts)

  if (req.method === 'POST') {
    const newAccount = { id: Date.now(), ...req.body }
    depositAccounts.push(newAccount)
    return res.status(201).json(newAccount)
  }

  if (req.method === 'PUT') {
    if (!id) return res.status(400).json({ message: 'ID is required' })
    const index = depositAccounts.findIndex(a => a.id == id)
    if (index === -1) return res.status(404).json({ message: 'Account not found' })
    depositAccounts[index] = { ...depositAccounts[index], ...req.body }
    return res.status(200).json(depositAccounts[index])
  }

  if (req.method === 'DELETE') {
    if (!id) return res.status(400).json({ message: 'ID is required' })
    depositAccounts = depositAccounts.filter(a => a.id != id)
    return res.status(204).end()
  }

  return res.status(405).json({ message: 'Method not allowed' })
}
