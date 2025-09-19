// In-memory "database"
let users = []

export default function handler(req, res) {
  if (req.method === 'POST') {
    // Create user (signup)
    const { emailOrPhone } = req.body

    // Check if user exists
    const exists = users.find(u => u.emailOrPhone === emailOrPhone)
    if (exists) {
      return res.status(409).json({ code: 'USER_EXISTS', message: 'User already exists' })
    }

    const newUser = {
      id: Date.now(),
      emailOrPhone,
      createdAt: new Date().toISOString()
    }

    users.push(newUser)
    return res.status(201).json(newUser)
  }

  if (req.method === 'GET') {
    // Query user by email/phone
    const { emailOrPhone } = req.query
    const found = users.filter(u => u.emailOrPhone === emailOrPhone)
    return res.status(200).json(found)
  }

  return res.status(405).json({ message: 'Method not allowed' })
}
