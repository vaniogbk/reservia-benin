import { createContext, useContext, useState, useEffect } from 'react'
import { authApi } from '../services/api'

const AuthContext = createContext(null)

const DEMO_USERS = {
  'admin@reservia-benin.com': {
    password: 'password123',
    token: 'mock_token_admin_123',
    user: { id: 999, prenom: 'Admin', nom: 'Reservia', email: 'admin@reservia-benin.com', role: 'admin', company_id: null },
  },
  'superadmin@reservia-benin.com': {
    password: 'superadmin123',
    token: 'mock_token_superadmin_456',
    user: { id: 998, prenom: 'Super', nom: 'Admin', email: 'superadmin@reservia-benin.com', role: 'super_admin', company_id: null },
  },
  'company@reservia-benin.com': {
    password: 'company123',
    token: 'mock_token_company_789',
    user: { id: 997, prenom: 'Directeur', nom: 'Marina', email: 'company@reservia-benin.com', role: 'company_admin', company_id: 1 },
  },
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('reservia_token')
    if (token) {
      // Restaurer les utilisateurs demo depuis le localStorage
      const demoUser = localStorage.getItem('reservia_demo_user')
      if (demoUser) {
        setUser(JSON.parse(demoUser))
        setLoading(false)
        return
      }
      authApi.me()
        .then(r => setUser(r.data))
        .catch(() => localStorage.removeItem('reservia_token'))
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (credentials) => {
    const demo = DEMO_USERS[credentials.email]
    if (demo && credentials.password === demo.password) {
      localStorage.setItem('reservia_token', demo.token)
      localStorage.setItem('reservia_demo_user', JSON.stringify(demo.user))
      setUser(demo.user)
      return { token: demo.token, user: demo.user }
    }

    const { data } = await authApi.login(credentials)
    localStorage.setItem('reservia_token', data.token)
    localStorage.removeItem('reservia_demo_user')
    setUser(data.user)
    return data
  }

  const register = async (formData) => {
    const { data } = await authApi.register(formData)
    localStorage.setItem('reservia_token', data.token)
    localStorage.removeItem('reservia_demo_user')
    setUser(data.user)
    return data
  }

  const logout = async () => {
    await authApi.logout().catch(() => { })
    localStorage.removeItem('reservia_token')
    localStorage.removeItem('reservia_demo_user')
    setUser(null)
  }

  const isSuperAdmin   = user?.role === 'super_admin'
  const isCompanyAdmin = user?.role === 'company_admin'
  const isAdmin        = user?.role === 'admin'
  const hasAdminAccess = isAdmin || isCompanyAdmin || isSuperAdmin

  return (
    <AuthContext.Provider value={{
      user, loading, login, register, logout,
      isAdmin, isSuperAdmin, isCompanyAdmin, hasAdminAccess,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
