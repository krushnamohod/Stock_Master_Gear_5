"use client"

import { createContext, useContext, useState, useEffect } from "react"

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api/v1"

  // ---------------------------
  // Client-side validation helpers (kept from your original)
  // ---------------------------
  const validateLoginId = (loginId) => {
    if (!loginId) return "Login ID required"
    if (loginId.length < 6 || loginId.length > 12) {
      return "Login ID must be 6-12 characters"
    }
    return null
  }

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email) return "Email required"
    if (!emailRegex.test(email)) {
      return "Invalid email format"
    }
    return null
  }

  const validatePassword = (password) => {
    if (!password) return "Password required"
    if (password.length <= 8) {
      return "Password must be greater than 8 characters"
    }
    if (!/[a-z]/.test(password)) {
      return "Password must contain at least one lowercase letter"
    }
    if (!/[A-Z]/.test(password)) {
      return "Password must contain at least one uppercase letter"
    }
    if (!/[!@#$%^&*(),.?\":{}|<>]/.test(password)) {
      return "Password must contain at least one special character"
    }
    return null
  }

  // NOTE: Backend currently has no /auth/check endpoints.
  // These functions are optimistic (client-side). To make them authoritative,
  // add endpoints like GET /api/v1/auth/check-email?email=... and /auth/check-login?loginId=...
  const isLoginIdUnique = async (loginId) => {
    // optimistic client-side check (format only)
    const err = validateLoginId(loginId)
    if (err) return false
    return true
  }

  const isEmailUnique = async (email) => {
    // optimistic client-side check (format only)
    const err = validateEmail(email)
    if (err) return false
    return true
  }

  // ---------------------------
  // Load user if token exists
  // ---------------------------
  useEffect(() => {
    const load = async () => {
      const token = localStorage.getItem("token")
      if (!token) {
        setLoading(false)
        return
      }

      try {
        const res = await fetch(`${API_BASE}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (!res.ok) {
          localStorage.removeItem("token")
          setLoading(false)
          return
        }
        const data = await res.json()
        setCurrentUser(data)
        setIsAuthenticated(true)
      } catch (err) {
        localStorage.removeItem("token")
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  // ---------------------------
  // LOGIN (expects email)
  // ---------------------------
  const login = async (email, password) => {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      })

      const data = await res.json()

      if (!res.ok) {
        return { success: false, error: data.message || "Login failed" }
      }

      localStorage.setItem("token", data.token)
      setCurrentUser(data.user)
      setIsAuthenticated(true)

      return { success: true }
    } catch (err) {
      return { success: false, error: "Network error. Try again." }
    }
  }

  // ---------------------------
  // SIGNUP -> call backend register
  // We map `loginId` -> `name` when calling backend (backend expects name,email,password)
  // ---------------------------
const signup = async (loginId, email, password) => {
  try {
    const loginErr = validateLoginId(loginId)
    if (loginErr) return { success: false, error: loginErr }

    const emailErr = validateEmail(email)
    if (emailErr) return { success: false, error: emailErr }

    const passErr = validatePassword(password)
    if (passErr) return { success: false, error: passErr }

    const res = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: loginId, email, password })
    })

    const data = await res.json()

    if (!res.ok) {
      return { success: false, error: data.message || "Signup failed" }
    }

    // DO NOT auto-login
    return { success: true }

  } catch (err) {
    return { success: false, error: "Network error. Try again." }
  }
}


  // ---------------------------
  // LOGOUT
  // ---------------------------
  const logout = () => {
    localStorage.removeItem("token")
    setCurrentUser(null)
    setIsAuthenticated(false)
  }

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated,
        login,
        signup,
        logout,
        loading,
        // validation helpers for SignUpScreen
        validateLoginId,
        validateEmail,
        validatePassword,
        isLoginIdUnique, // currently optimistic
        isEmailUnique    // currently optimistic
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
