"use client"

import { useStock } from '@/context/StockContext'
import { ArrowLeft, Box, KeyRound, Mail } from 'lucide-react'
import { useState } from 'react'

export function ForgetPasswordScreen({ onBackToLogin }) {
    const { theme } = useStock()
    const [step, setStep] = useState(1) // 1 = email input, 2 = OTP input
    const [email, setEmail] = useState('')
    const [otp, setOtp] = useState('')
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')
    const [error, setError] = useState('')

    const handleSendOTP = async (e) => {
        e.preventDefault()
        setError('')
        setMessage('')
        setLoading(true)

        // Simulate OTP sending (mock implementation)
        setTimeout(() => {
            setLoading(false)
            setMessage(`OTP sent to ${email}`)
            setStep(2)
            // In a real app, you would call an API here
            // For demo purposes, the OTP is "123456"
            console.log('Demo OTP: 123456')
        }, 1500)
    }

    const handleVerifyOTP = async (e) => {
        e.preventDefault()
        setError('')
        setMessage('')
        setLoading(true)

        // Simulate OTP verification (mock implementation)
        setTimeout(() => {
            setLoading(false)
            // For demo, accept "123456" as valid OTP
            if (otp === '123456') {
                setMessage('OTP verified successfully! You can now reset your password.')
                // In a real app, you would navigate to password reset screen
                setTimeout(() => {
                    onBackToLogin()
                }, 2000)
            } else {
                setError('Invalid OTP. Please try again. (Hint: Use 123456 for demo)')
            }
        }, 1500)
    }

    const handleResendOTP = () => {
        setOtp('')
        setMessage('OTP resent successfully!')
        console.log('Demo OTP: 123456')
    }

    return (
        <div className={`min-h-screen flex items-center justify-center p-6 ${theme === 'dark' ? 'bg-slate-950' : 'bg-slate-50'}`}>
            <div className={`w-full max-w-md rounded-2xl shadow-xl p-8 ${theme === 'dark' ? 'bg-slate-900 border border-slate-800' : 'bg-white'}`}>
                {/* Back Button */}
                <button
                    onClick={onBackToLogin}
                    className={`flex items-center gap-2 mb-6 text-sm ${theme === 'dark' ? 'text-slate-400 hover:text-slate-300' : 'text-slate-600 hover:text-slate-900'}`}
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Login
                </button>

                {/* Logo */}
                <div className="flex flex-col items-center mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <Box className="h-12 w-12 text-blue-500" />
                        <h1 className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                            StockMaster
                        </h1>
                    </div>
                    <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                        {step === 1 ? 'Reset your password' : 'Verify OTP'}
                    </p>
                </div>

                {/* Step 1: Email Input */}
                {step === 1 && (
                    <form onSubmit={handleSendOTP} className="space-y-5">
                        <div>
                            <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`} />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className={`w-full pl-11 pr-4 py-3 rounded-lg border outline-none focus:ring-2 focus:ring-blue-500 transition-all ${theme === 'dark'
                                            ? 'bg-slate-800 border-slate-700 text-white placeholder:text-slate-500'
                                            : 'bg-white border-slate-300 text-slate-900'
                                        }`}
                                    placeholder="Enter your email"
                                    required
                                />
                            </div>
                            <p className={`mt-2 text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                                We'll send a One-Time Password (OTP) to this email
                            </p>
                        </div>

                        {message && (
                            <div className="p-3 rounded-lg bg-green-50 border border-green-200 dark:bg-green-900/20 dark:border-green-800">
                                <p className="text-sm text-green-600 dark:text-green-400">{message}</p>
                            </div>
                        )}

                        {error && (
                            <div className="p-3 rounded-lg bg-red-50 border border-red-200 dark:bg-red-900/20 dark:border-red-800">
                                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <span className="animate-spin">⏳</span>
                                    Sending OTP...
                                </>
                            ) : (
                                <>
                                    <Mail className="h-5 w-5" />
                                    Send OTP
                                </>
                            )}
                        </button>
                    </form>
                )}

                {/* Step 2: OTP Input */}
                {step === 2 && (
                    <form onSubmit={handleVerifyOTP} className="space-y-5">
                        <div>
                            <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                                Enter OTP
                            </label>
                            <div className="relative">
                                <KeyRound className={`absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`} />
                                <input
                                    type="text"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                    className={`w-full pl-11 pr-4 py-3 rounded-lg border outline-none focus:ring-2 focus:ring-blue-500 transition-all text-center text-2xl tracking-widest font-mono ${theme === 'dark'
                                            ? 'bg-slate-800 border-slate-700 text-white placeholder:text-slate-500'
                                            : 'bg-white border-slate-300 text-slate-900'
                                        }`}
                                    placeholder="000000"
                                    maxLength={6}
                                    required
                                />
                            </div>
                            <p className={`mt-2 text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                                OTP sent to <span className="font-medium">{email}</span>
                            </p>
                        </div>

                        {message && (
                            <div className="p-3 rounded-lg bg-green-50 border border-green-200 dark:bg-green-900/20 dark:border-green-800">
                                <p className="text-sm text-green-600 dark:text-green-400">{message}</p>
                            </div>
                        )}

                        {error && (
                            <div className="p-3 rounded-lg bg-red-50 border border-red-200 dark:bg-red-900/20 dark:border-red-800">
                                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading || otp.length !== 6}
                            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Verifying...' : 'Verify OTP'}
                        </button>

                        {/* Resend OTP */}
                        <div className="text-center">
                            <button
                                type="button"
                                onClick={handleResendOTP}
                                className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                            >
                                Didn't receive OTP? Resend
                            </button>
                        </div>

                        {/* Change Email */}
                        <div className="text-center pt-2">
                            <button
                                type="button"
                                onClick={() => {
                                    setStep(1)
                                    setOtp('')
                                    setMessage('')
                                    setError('')
                                }}
                                className={`text-sm ${theme === 'dark' ? 'text-slate-400 hover:text-slate-300' : 'text-slate-600 hover:text-slate-900'}`}
                            >
                                Change email address
                            </button>
                        </div>
                    </form>
                )}

                {/* Demo Info */}
                <div className={`mt-6 p-3 rounded-lg border ${theme === 'dark' ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                    <p className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                        <strong>Demo Mode:</strong> Use OTP <code className="px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 font-mono">123456</code> to verify
                    </p>
                </div>
            </div>
        </div>
    )
}
