// In-memory transactions
let transactions = []

export default function handler(req, res) {
  if (req.method === 'POST') {
    const { userId, type, currency, amount } = req.body

    const tx = {
      id: Date.now(),
      userId,
      type,
      currency,
      amount,
      date: new Date().toISOString()
    }

    transactions.push(tx)
    return res.status(201).json(tx)
  }

  if (req.method === 'GET') {
    const { userId } = req.query
    const userTxs = transactions.filter(tx => tx.userId == userId)
    return res.status(200).json(userTxs)
  }

  return res.status(405).json({ message: 'Method not allowed' })
}
