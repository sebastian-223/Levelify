const MOCK_USERS_KEY = 'levelify-mock-users'

const authService = {
  login: async (email, password) => {
    await new Promise(r => setTimeout(r, 900))
    const users = JSON.parse(localStorage.getItem(MOCK_USERS_KEY) || '[]')
    const user = users.find(u => u.email === email && u.password === password)
    if (!user) throw new Error('Invalid email or password')
    const { password: _, ...safeUser } = user
    return { user: safeUser, token: `mock-jwt-${Date.now()}` }
  },
  register: async (data) => {
    await new Promise(r => setTimeout(r, 900))
    const users = JSON.parse(localStorage.getItem(MOCK_USERS_KEY) || '[]')
    if (users.find(u => u.email === data.email)) throw new Error('Email is already registered')
    const user = { id: Date.now(), ...data, createdAt: new Date().toISOString(), avatar: null }
    localStorage.setItem(MOCK_USERS_KEY, JSON.stringify([...users, user]))
    const { password: _, ...safeUser } = user
    return { user: safeUser, token: `mock-jwt-${Date.now()}` }
  },
  logout: () => {},
}
export default authService
