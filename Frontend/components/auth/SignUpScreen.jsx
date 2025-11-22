"use client"

import { useAuth } from '@/context/AuthContext'
import { useStock } from '@/context/StockContext'
import { Box, CheckCircle, Eye, EyeOff, XCircle } from 'lucide-react'
import { useEffect, useState } from 'react'

export function SignUpScreen({ onSwitchToLogin }) {
    const { signup, validateLoginId, validateEmail, validatePassword, isLoginIdUnique, isEmailUnique } = useAuth()
    const { theme } = useStock()

    const [formData, setFormData] = useState({
        loginId: '',
        email: '',
        password: '',
        confirmPassword: ''
    })

    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [errors, setErrors] = useState({})
    const [touched, setTouched] = useState({})
    const [loading, setLoading] = useState(false)

    // Real-time validation
    useEffect(() => {
        const newErrors = {}

        if (touched.loginId && formData.loginId) {
            const loginIdError = validateLoginId(formData.loginId)
            if (loginIdError) {
                newErrors.loginId = loginIdError
            } else if (!isLoginIdUnique(formData.loginId)) {
                newErrors.loginId = "Login ID already exists"
            }
        }

        if (touched.email && formData.email) {
            const emailError = validateEmail(formData.email)
            if (emailError) {
                newErrors.email = emailError
            } else if (!isEmailUnique(formData.email)) {
                newErrors.email = "Email already exists"
            }
        }

        if (touched.password && formData.password) {
            const passwordError = validatePassword(formData.password)
            if (passwordError) {
                newErrors.password = passwordError
            }
        }

        if (touched.confirmPassword && formData.confirmPassword) {
            if (formData.password !== formData.confirmPassword) {
                newErrors.confirmPassword = "Passwords do not match"
            }
        }

        setErrors(newErrors)
    }, [formData, touched])

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    const handleBlur = (field) => {
        setTouched(prev => ({ ...prev, [field]: true }))
    }

const handleSubmit = async (e) => {
    e.preventDefault()

    setTouched({
        loginId: true,
        email: true,
        password: true,
        confirmPassword: true
    })

    if (Object.keys(errors).length > 0) return

    setLoading(true)

    const result = await signup(
        formData.loginId,
        formData.email,
        formData.password
    )

    if (!result.success) {
        setErrors({ general: result.error })
    } else {
        onSwitchToLogin()  // 🔥 redirect to login page
    }

    setLoading(false)
}


    const getPasswordStrength = () => {
        const password = formData.password
        const checks = {
            length: password.length > 8,
            lowercase: /[a-z]/.test(password),
            uppercase: /[A-Z]/.test(password),
            special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
        }
        return checks
    }

    const passwordChecks = getPasswordStrength()

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
                        Create your account
                    </p>
                </div>

                {/* Sign Up Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Login ID */}
                    <div>
                        <label className={`block text-sm font-medium mb-1.5 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                            Login ID
                        </label>
                        <input
                            type="text"
                            value={formData.loginId}
                            onChange={(e) => handleChange('loginId', e.target.value)}
                            onBlur={() => handleBlur('loginId')}
                            className={`w-full px-4 py-2.5 rounded-lg border outline-none focus:ring-2 focus:ring-blue-500 transition-all ${theme === 'dark'
                                    ? 'bg-slate-800 border-slate-700 text-white placeholder:text-slate-500'
                                    : 'bg-white border-slate-300 text-slate-900'
                                } ${errors.loginId && touched.loginId ? 'border-red-500' : ''}`}
                            placeholder="6-12 characters"
                            required
                        />
                        {errors.loginId && touched.loginId && (
                            <p className="mt-1 text-xs text-red-500">{errors.loginId}</p>
                        )}
                        {!errors.loginId && touched.loginId && formData.loginId && (
                            <p className="mt-1 text-xs text-green-500 flex items-center gap-1">
                                <CheckCircle className="h-3 w-3" /> Login ID available
                            </p>
                        )}
                    </div>

                    {/* Email */}
                    <div>
                        <label className={`block text-sm font-medium mb-1.5 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                            Email ID
                        </label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleChange('email', e.target.value)}
                            onBlur={() => handleBlur('email')}
                            className={`w-full px-4 py-2.5 rounded-lg border outline-none focus:ring-2 focus:ring-blue-500 transition-all ${theme === 'dark'
                                    ? 'bg-slate-800 border-slate-700 text-white placeholder:text-slate-500'
                                    : 'bg-white border-slate-300 text-slate-900'
                                } ${errors.email && touched.email ? 'border-red-500' : ''}`}
                            placeholder="your@email.com"
                            required
                        />
                        {errors.email && touched.email && (
                            <p className="mt-1 text-xs text-red-500">{errors.email}</p>
                        )}
                    </div>

                    {/* Password */}
                    <div>
                        <label className={`block text-sm font-medium mb-1.5 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                            Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={formData.password}
                                onChange={(e) => handleChange('password', e.target.value)}
                                onBlur={() => handleBlur('password')}
                                className={`w-full px-4 py-2.5 rounded-lg border outline-none focus:ring-2 focus:ring-blue-500 transition-all pr-12 ${theme === 'dark'
                                        ? 'bg-slate-800 border-slate-700 text-white placeholder:text-slate-500'
                                        : 'bg-white border-slate-300 text-slate-900'
                                    } ${errors.password && touched.password ? 'border-red-500' : ''}`}
                                placeholder="Strong password"
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

                        {/* Password strength indicators */}
                        {formData.password && (
                            <div className="mt-2 space-y-1">
                                <div className="flex items-center gap-2 text-xs">
                                    {passwordChecks.length ? <CheckCircle className="h-3 w-3 text-green-500" /> : <XCircle className="h-3 w-3 text-red-500" />}
                                    <span className={passwordChecks.length ? 'text-green-600' : 'text-red-600'}>
                                        Greater than 8 characters
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 text-xs">
                                    {passwordChecks.lowercase ? <CheckCircle className="h-3 w-3 text-green-500" /> : <XCircle className="h-3 w-3 text-red-500" />}
                                    <span className={passwordChecks.lowercase ? 'text-green-600' : 'text-red-600'}>
                                        One lowercase letter
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 text-xs">
                                    {passwordChecks.uppercase ? <CheckCircle className="h-3 w-3 text-green-500" /> : <XCircle className="h-3 w-3 text-red-500" />}
                                    <span className={passwordChecks.uppercase ? 'text-green-600' : 'text-red-600'}>
                                        One uppercase letter
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 text-xs">
                                    {passwordChecks.special ? <CheckCircle className="h-3 w-3 text-green-500" /> : <XCircle className="h-3 w-3 text-red-500" />}
                                    <span className={passwordChecks.special ? 'text-green-600' : 'text-red-600'}>
                                        One special character
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label className={`block text-sm font-medium mb-1.5 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                            Re-enter Password
                        </label>
                        <div className="relative">
                            <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                value={formData.confirmPassword}
                                onChange={(e) => handleChange('confirmPassword', e.target.value)}
                                onBlur={() => handleBlur('confirmPassword')}
                                className={`w-full px-4 py-2.5 rounded-lg border outline-none focus:ring-2 focus:ring-blue-500 transition-all pr-12 ${theme === 'dark'
                                        ? 'bg-slate-800 border-slate-700 text-white placeholder:text-slate-500'
                                        : 'bg-white border-slate-300 text-slate-900'
                                    } ${errors.confirmPassword && touched.confirmPassword ? 'border-red-500' : ''}`}
                                placeholder="Confirm password"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className={`absolute right-3 top-1/2 -translate-y-1/2 ${theme === 'dark' ? 'text-slate-400 hover:text-slate-300' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                        </div>
                        {errors.confirmPassword && touched.confirmPassword && (
                            <p className="mt-1 text-xs text-red-500">{errors.confirmPassword}</p>
                        )}
                        {!errors.confirmPassword && touched.confirmPassword && formData.confirmPassword && formData.password === formData.confirmPassword && (
                            <p className="mt-1 text-xs text-green-500 flex items-center gap-1">
                                <CheckCircle className="h-3 w-3" /> Passwords match
                            </p>
                        )}
                    </div>

                    {errors.general && (
                        <div className="p-3 rounded-lg bg-red-50 border border-red-200 dark:bg-red-900/20 dark:border-red-800">
                            <p className="text-sm text-red-600 dark:text-red-400">{errors.general}</p>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading || Object.keys(errors).length > 0}
                        className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-6"
                    >
                        {loading ? 'Creating account...' : 'SIGN UP'}
                    </button>
                </form>

                {/* Link to Login */}
                <div className="mt-6 text-center text-sm">
                    <span className={theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}>
                        Already have an account?{' '}
                    </span>
                    <button
                        type="button"
                        onClick={onSwitchToLogin}
                        className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                    >
                        Sign In
                    </button>
                </div>
            </div>
        </div>
    )
}
