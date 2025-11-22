"use client"

import { createContext, useContext, useEffect, useState } from "react"

const AuthContext = createContext()
const API_BASE = "http://localhost:3000/api/v1"

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)

  // Load session from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem("stockmaster_token")
    const storedUser = localStorage.getItem("stockmaster_user")

    if (storedToken && storedUser) {
      setToken(storedToken)
      setCurrentUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  // ------- LOGIN (REAL BACKEND) -------
  const login = async (email, password) => {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        return { success: false, error: data.message || "Invalid credentials" }
      }

      // Save session
      localStorage.setItem("stockmaster_token", data.token)
      localStorage.setItem("stockmaster_user", JSON.stringify(data.user))

      setToken(data.token)
      setCurrentUser(data.user)

      return { success: true }
    } catch (err) {
      return { success: false, error: "Network error" }
    }
  }

  // ------- SIGNUP (REAL BACKEND) -------
  const signup = async (name, email, password) => {
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        return { success: false, error: data.message || "Signup failed" }
      }

      return { success: true }
    } catch {
      return { success: false, error: "Network error" }
    }
  }

  // ------- LOGOUT -------
  const logout = () => {
    localStorage.removeItem("stockmaster_token")
    localStorage.removeItem("stockmaster_user")
    setCurrentUser(null)
    setToken(null)
  }

  // ------- RESET PASSWORD MOCK -------
  const resetPassword = async (email) => {
    return { success: true }
  }

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        token,
        isAuthenticated: !!token,
        login,
        signup,
        logout,
        resetPassword,
        loading,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
