let transactions = []

export default function handler(req, res) {
  const { id } = req.query || {}

  if (req.method === 'GET') return res.status(200).json(transactions)

  if (req.method === 'POST') {
    const newTx = { id: Date.now().toString(), date: new Date().toISOString(), ...req.body }
    transactions.push(newTx)
    return res.status(201).json(newTx)
  }

  if (req.method === 'PUT') {
    if (!id) return res.status(400).json({ message: 'ID is required' })
    const index = transactions.findIndex(t => t.id === id)
    if (index === -1) return res.status(404).json({ message: 'Transaction not found' })
    transactions[index] = { ...transactions[index], ...req.body }
    return res.status(200).json(transactions[index])
  }

  if (req.method === 'DELETE') {
    if (!id) return res.status(400).json({ message: 'ID is required' })
    transactions = transactions.filter(t => t.id !== id)
    return res.status(204).end()
  }

  return res.status(405).json({ message: 'Method not allowed' })
}
