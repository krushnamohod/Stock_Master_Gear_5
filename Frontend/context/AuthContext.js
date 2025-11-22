"use client"

import { createContext, useContext, useEffect, useState } from "react"

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)
  const [users, setUsers] = useState(INITIAL_USERS)
  const [mounted, setMounted] = useState(false)

  // Load session from localStorage
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
    } catch {
      return { success: false, error: "Network error" }
    }
    return { success: false, error: 'Invalid credentials' }
  }

  // ------- LOGOUT -------
  const logout = () => {
    localStorage.removeItem("stockmaster_token")
    localStorage.removeItem("stockmaster_user")
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
    return { success: true }
  }

  const addStaff = async (staffData) => {
    await new Promise(resolve => setTimeout(resolve, 300))

    // Check if loginId already exists
    if (users.find(u => u.loginId === staffData.loginId)) {
      return { success: false, error: 'Login ID already exists' }
    }

    const newStaff = {
      id: Date.now().toString(),
      loginId: staffData.loginId,
      password: staffData.password,
      name: staffData.name,
      role: 'staff',
      email: staffData.loginId.includes('@') ? staffData.loginId : `${staffData.loginId}@stockmaster.com`,
      isActive: true
    }

    const updatedUsers = [...users, newStaff]
    setUsers(updatedUsers)
    if (typeof window !== 'undefined') {
      localStorage.setItem('stockmaster_users', JSON.stringify(updatedUsers))
    }

    return {
      success: true,
      credentials: {
        loginId: newStaff.loginId,
        password: newStaff.password,
        name: newStaff.name
      }
    }
  }

  const toggleStaffStatus = (staffId) => {
    const updatedUsers = users.map(u =>
      u.id === staffId ? { ...u, isActive: !u.isActive } : u
    )
    setUsers(updatedUsers)
    if (typeof window !== 'undefined') {
      localStorage.setItem('stockmaster_users', JSON.stringify(updatedUsers))
    }
  }

  const getStaffList = () => {
    return users.filter(u => u.role === 'staff')
  }

  // Don't render children until mounted to avoid hydration mismatch
  if (!mounted) {
    return null
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
