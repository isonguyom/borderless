// In-memory users store
let users = [
]

export default function handler(req, res) {
  const { id } = req.query || {}

  if (req.method === 'GET') {
    if (id) {
      const user = users.find(u => u.id === id)
      return user ? res.status(200).json(user) : res.status(404).json({ message: 'User not found' })
    }
    return res.status(200).json(users)
  }

  if (req.method === 'POST') {
    const newUser = { id: Date.now().toString(), createdAt: new Date().toISOString(), ...req.body }
    users.push(newUser)
    return res.status(201).json(newUser)
  }

  if (req.method === 'PUT') {
    if (!id) return res.status(400).json({ message: 'ID is required' })
    const index = users.findIndex(u => u.id === id)
    if (index === -1) return res.status(404).json({ message: 'User not found' })
    users[index] = { ...users[index], ...req.body }
    return res.status(200).json(users[index])
  }

  if (req.method === 'DELETE') {
    if (!id) return res.status(400).json({ message: 'ID is required' })
    users = users.filter(u => u.id !== id)
    return res.status(204).end()
  }

  return res.status(405).json({ message: 'Method not allowed' })
}
