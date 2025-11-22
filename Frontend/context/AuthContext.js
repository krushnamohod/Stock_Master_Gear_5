"use client"

import { createContext, useContext, useEffect, useState } from 'react'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for stored user on mount
    const storedUser = localStorage.getItem('stockmaster_user')
    if (storedUser) {
      try {
        setCurrentUser(JSON.parse(storedUser))
      } catch (e) {
        console.error("Failed to parse stored user", e)
        localStorage.removeItem('stockmaster_user')
      }
    }
    setLoading(false)
  }, [])

  const login = async (loginId, password) => {
    // Mock login logic
    // In a real app, this would call an API
    // For demo purposes, accept any non-empty credentials
    if (loginId && password) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500))

      const user = {
        id: '1',
        loginId: loginId,
        name: loginId.split('@')[0] || 'Admin User',
        role: 'admin',
        email: loginId.includes('@') ? loginId : `${loginId}@example.com`
      }

      setCurrentUser(user)
      localStorage.setItem('stockmaster_user', JSON.stringify(user))
      return { success: true }
    }
    return { success: false, error: 'Invalid credentials' }
  }

  const logout = () => {
    setCurrentUser(null)
    localStorage.removeItem('stockmaster_user')
  }

  const signup = async (userData) => {
    // Mock signup
    await new Promise(resolve => setTimeout(resolve, 500))

    const user = {
      id: Date.now().toString(),
      ...userData,
      role: 'user'
    }

    setCurrentUser(user)
    localStorage.setItem('stockmaster_user', JSON.stringify(user))
    return { success: true }
  }

  const resetPassword = async (email) => {
    await new Promise(resolve => setTimeout(resolve, 500))
    return { success: true }
  }

  return (
    <AuthContext.Provider value={{
      currentUser,
      isAuthenticated: !!currentUser,
      login,
      logout,
      signup,
      resetPassword,
      loading
    }}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
