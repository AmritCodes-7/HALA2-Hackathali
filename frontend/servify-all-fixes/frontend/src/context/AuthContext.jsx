import { createContext, useContext, useState, useEffect } from 'react'
import { logoutSession } from '../api/users'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('sf_token'))
  const [user, setUser]   = useState(() => {
    const u = localStorage.getItem('sf_user')
    return u ? JSON.parse(u) : null
  })

  const login = (tok, userData) => {
    localStorage.setItem('sf_token', tok)
    localStorage.setItem('sf_user', JSON.stringify(userData))
    setToken(tok)
    setUser(userData)
  }

  const logout = async () => {
    // FIX: notify backend to mark session offline immediately
    try { await logoutSession() } catch {}
    localStorage.removeItem('sf_token')
    localStorage.removeItem('sf_user')
    setToken(null)
    setUser(null)
  }

  const isAuthenticated = !!token

  // Parse role from JWT payload
  const getRole = () => {
    if (!user) return null
    return user.role || null
  }

  return (
    <AuthContext.Provider value={{ token, user, login, logout, isAuthenticated, getRole }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
