"use client"

import { createContext, useContext, useState } from 'react'

const AuthContext = createContext()

// Mock user database
const INITIAL_USERS = [
    {
        loginId: "admin123",
        email: "admin@example.com",
        password: "Password@123"
    }
]

export function AuthProvider({ children }) {
    const [users, setUsers] = useState(INITIAL_USERS)
    const [currentUser, setCurrentUser] = useState(null)
    const [isAuthenticated, setIsAuthenticated] = useState(false)

    // Validation utilities
    const validateLoginId = (loginId) => {
        if (loginId.length < 6 || loginId.length > 12) {
            return "Login ID must be 6-12 characters"
        }
        return null
    }

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            return "Invalid email format"
        }
        return null
    }

    const validatePassword = (password) => {
        if (password.length <= 8) {
            return "Password must be greater than 8 characters"
        }
        if (!/[a-z]/.test(password)) {
            return "Password must contain at least one lowercase letter"
        }
        if (!/[A-Z]/.test(password)) {
            return "Password must contain at least one uppercase letter"
        }
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
            return "Password must contain at least one special character"
        }
        return null
    }

    const isLoginIdUnique = (loginId) => {
        return !users.some(user => user.loginId === loginId)
    }

    const isEmailUnique = (email) => {
        return !users.some(user => user.email === email)
    }

    // Authentication functions
    const login = (loginId, password) => {
        const user = users.find(u => u.loginId === loginId && u.password === password)
        if (user) {
            setCurrentUser(user)
            setIsAuthenticated(true)
            return { success: true }
        }
        return { success: false, error: "Invalid Login Id or Password" }
    }

    const signup = (loginId, email, password, confirmPassword) => {
        // Validate all fields
        const loginIdError = validateLoginId(loginId)
        if (loginIdError) return { success: false, error: loginIdError }

        if (!isLoginIdUnique(loginId)) {
            return { success: false, error: "Login ID already exists" }
        }

        const emailError = validateEmail(email)
        if (emailError) return { success: false, error: emailError }

        if (!isEmailUnique(email)) {
            return { success: false, error: "Email already exists" }
        }

        const passwordError = validatePassword(password)
        if (passwordError) return { success: false, error: passwordError }

        if (password !== confirmPassword) {
            return { success: false, error: "Passwords do not match" }
        }

        // Add new user
        const newUser = { loginId, email, password }
        setUsers([...users, newUser])

        // Auto-login after signup
        setCurrentUser(newUser)
        setIsAuthenticated(true)

        return { success: true }
    }

    const logout = () => {
        setCurrentUser(null)
        setIsAuthenticated(false)
    }

    return (
        <AuthContext.Provider value={{
            currentUser,
            isAuthenticated,
            login,
            signup,
            logout,
            validateLoginId,
            validateEmail,
            validatePassword,
            isLoginIdUnique,
            isEmailUnique
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)
