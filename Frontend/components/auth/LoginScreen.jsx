"use client"

import { useAuth } from '@/context/AuthContext'
import { useStock } from '@/context/StockContext'
import { Box, Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'

export function LoginScreen({ onSwitchToSignUp, onForgetPassword }) {
    const { login } = useAuth()
    const { theme } = useStock()
    const [loginId, setLoginId] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        const result = login(loginId, password)

        if (!result.success) {
            setError(result.error)
        }

        setLoading(false)
    }

    return (
        <div className={`min-h-screen flex items-center justify-center p-6 ${theme === 'dark' ? 'bg-slate-950' : 'bg-slate-50'}`}>
            <div className={`w-full max-w-md rounded-2xl shadow-xl p-8 ${theme === 'dark' ? 'bg-slate-900 border border-slate-800' : 'bg-white'}`}>
                {/* Logo */}
                <div className="flex flex-col items-center mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <Box className="h-12 w-12 text-blue-500" />
                        <h1 className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                            StockMaster
                        </h1>
                    </div>
                    <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                        Inventory Management System
                    </p>
                </div>

                {/* Login Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                            Login ID
                        </label>
                        <input
                            type="text"
                            value={loginId}
                            onChange={(e) => setLoginId(e.target.value)}
                            className={`w-full px-4 py-3 rounded-lg border outline-none focus:ring-2 focus:ring-blue-500 transition-all ${theme === 'dark'
                                ? 'bg-slate-800 border-slate-700 text-white placeholder:text-slate-500'
                                : 'bg-white border-slate-300 text-slate-900'
                                }`}
                            placeholder="Enter your login ID"
                            required
                        />
                    </div>

                    <div>
                        <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                            Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className={`w-full px-4 py-3 rounded-lg border outline-none focus:ring-2 focus:ring-blue-500 transition-all pr-12 ${theme === 'dark'
                                    ? 'bg-slate-800 border-slate-700 text-white placeholder:text-slate-500'
                                    : 'bg-white border-slate-300 text-slate-900'
                                    }`}
                                placeholder="Enter your password"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className={`absolute right-3 top-1/2 -translate-y-1/2 ${theme === 'dark' ? 'text-slate-400 hover:text-slate-300' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                        </div>
                    </div>

                    {error && (
                        <div className="p-3 rounded-lg bg-red-50 border border-red-200 dark:bg-red-900/20 dark:border-red-800">
                            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Signing in...' : 'SIGN IN'}
                    </button>
                </form>

                {/* Links */}
                <div className="mt-6 flex items-center justify-between text-sm">
                    <button
                        type="button"
                        onClick={onForgetPassword}
                        className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                    >
                        Forget Password?
                    </button>
                    <button
                        type="button"
                        onClick={onSwitchToSignUp}
                        className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                    >
                        Sign Up
                    </button>
                </div>
            </div>
        </div>
    )
}
