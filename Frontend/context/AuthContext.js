"use client"

import { createContext, useContext, useState, useEffect } from "react"

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api/v1"

  useEffect(() => {
    const load = async () => {
      const storedToken = localStorage.getItem("token")
      if (!storedToken) {
        setLoading(false)
        return
      }

      try {
        const res = await fetch(`${API_BASE}/auth/me`, {
          headers: { Authorization: `Bearer ${storedToken}` }
        })

        if (!res.ok) {
          localStorage.removeItem("token")
          setLoading(false)
          return
        }

        const data = await res.json()
        setCurrentUser(data)
        setToken(storedToken)
        setIsAuthenticated(true)

      } catch {
        localStorage.removeItem("token")
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  const login = async (email, password) => {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      })

      const data = await res.json()

      if (!res.ok) return { success: false, error: data.message }

      localStorage.setItem("token", data.token)

      setCurrentUser(data.user)
      setToken(data.token)
      setIsAuthenticated(true)

      return { success: true }

    } catch {
      return { success: false, error: "Network error" }
    }
  }

  const signup = async (loginId, email, password) => {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: loginId, email, password })
    })

    const data = await res.json()

    if (!res.ok) return { success: false, error: data.message }
    return { success: true }
  }

  const logout = () => {
    localStorage.removeItem("token")
    setCurrentUser(null)
    setToken(null)
    setIsAuthenticated(false)
  }

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated,
        token,  // <-- REQUIRED
        login,
        signup,
        logout,
        loading
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
