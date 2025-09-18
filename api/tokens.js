// In-memory tokens store
let tokens = []

export default function handler(req, res) {
  if (req.method === 'POST') {
    const { userId } = req.body

    const token = `mock_${Date.now()}_${Math.random().toString(36).substring(2)}`
    const record = { userId, token }
    tokens.push(record)

    return res.status(201).json(record)
  }

  if (req.method === 'GET') {
    return res.status(200).json(tokens)
  }

  return res.status(405).json({ message: 'Method not allowed' })
}
