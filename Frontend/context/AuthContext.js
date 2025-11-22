"use client"

import { createContext, useContext, useEffect, useState } from 'react'

const AuthContext = createContext()

// Mock user database
const INITIAL_USERS = [
  {
    id: '1',
    loginId: 'admin123',
    password: 'Password@123',
    name: 'Admin User',
    role: 'admin',
    email: 'admin@stockmaster.com',
    isActive: true
  }
]

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [users, setUsers] = useState(INITIAL_USERS)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Check for stored user on mount - only on client side
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('stockmaster_user')
      const storedUsers = localStorage.getItem('stockmaster_users')

      if (storedUser) {
        try {
          setCurrentUser(JSON.parse(storedUser))
        } catch (e) {
          console.error("Failed to parse stored user", e)
          localStorage.removeItem('stockmaster_user')
        }
      }

      if (storedUsers) {
        try {
          setUsers(JSON.parse(storedUsers))
        } catch (e) {
          console.error("Failed to parse stored users", e)
          localStorage.setItem('stockmaster_users', JSON.stringify(INITIAL_USERS))
        }
      } else {
        localStorage.setItem('stockmaster_users', JSON.stringify(INITIAL_USERS))
      }
    }

    setLoading(false)
  }, [])

  const login = async (loginId, password) => {
    // Check against mock database
    await new Promise(resolve => setTimeout(resolve, 500))

    const user = users.find(u =>
      u.loginId === loginId &&
      u.password === password &&
      u.isActive
    )

    if (user) {
      const { password: _, ...userWithoutPassword } = user
      setCurrentUser(userWithoutPassword)
      if (typeof window !== 'undefined') {
        localStorage.setItem('stockmaster_user', JSON.stringify(userWithoutPassword))
      }
      return { success: true }
    }

    return { success: false, error: 'Invalid credentials or account is inactive' }
  }

  const logout = () => {
    setCurrentUser(null)
    if (typeof window !== 'undefined') {
      localStorage.removeItem('stockmaster_user')
    }
  }

  const signup = async (userData) => {
    // Mock signup
    await new Promise(resolve => setTimeout(resolve, 500))

    const user = {
      id: Date.now().toString(),
      ...userData,
      role: 'user',
      isActive: true
    }

    setCurrentUser(user)
    if (typeof window !== 'undefined') {
      localStorage.setItem('stockmaster_user', JSON.stringify(user))
    }
    return { success: true }
  }

  const resetPassword = async (email) => {
    await new Promise(resolve => setTimeout(resolve, 500))
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
      addStaff,
      toggleStaffStatus,
      getStaffList,
      loading
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
