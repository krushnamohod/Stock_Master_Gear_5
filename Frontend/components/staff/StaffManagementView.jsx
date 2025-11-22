"use client"

import { useAuth } from "@/context/AuthContext"
import { useStock } from "@/context/StockContext"
import { cn } from "@/lib/utils"
import { Check, Copy, Plus, User, X } from "lucide-react"
import { useState } from "react"

export function StaffManagementView() {
    const { theme } = useStock()
    const { getStaffList, addStaff, toggleStaffStatus } = useAuth()
    const [showAddModal, setShowAddModal] = useState(false)
    const [showCredentialsModal, setShowCredentialsModal] = useState(false)
    const [generatedCredentials, setGeneratedCredentials] = useState(null)
    const [formData, setFormData] = useState({
        name: '',
        loginId: '',
        password: ''
    })
    const [error, setError] = useState('')
    const [copiedField, setCopiedField] = useState(null)

    const staffList = getStaffList()

    const handleAddStaff = async (e) => {
        e.preventDefault()
        setError('')

        if (!formData.name || !formData.loginId || !formData.password) {
            setError('All fields are required')
            return
        }

        const result = await addStaff(formData)

        if (result.success) {
            setGeneratedCredentials(result.credentials)
            setShowAddModal(false)
            setShowCredentialsModal(true)
            setFormData({ name: '', loginId: '', password: '' })
        } else {
            setError(result.error)
        }
    }

    const handleCopy = (text, field) => {
        navigator.clipboard.writeText(text)
        setCopiedField(field)
        setTimeout(() => setCopiedField(null), 2000)
    }

    const generatePassword = () => {
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789'
        let password = ''
        for (let i = 0; i < 10; i++) {
            password += chars.charAt(Math.floor(Math.random() * chars.length))
        }
        setFormData({ ...formData, password })
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className={cn("text-3xl font-bold", theme === 'dark' ? "text-white" : "text-slate-900")}>
                        Staff Management
                    </h1>
                    <p className={cn("mt-1 text-sm", theme === 'dark' ? "text-slate-400" : "text-slate-500")}>
                        Manage staff accounts and credentials
                    </p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <Plus className="h-5 w-5" />
                    Add Staff
                </button>
            </div>

            {/* Staff List */}
            <div className={cn(
                "rounded-lg border overflow-hidden",
                theme === 'dark' ? "border-slate-800" : "border-slate-200"
            )}>
                <table className="w-full text-sm text-left">
                    <thead className={cn(
                        "text-xs uppercase",
                        theme === 'dark' ? "bg-slate-900 text-slate-400" : "bg-slate-50 text-slate-600"
                    )}>
                        <tr>
                            <th className="px-6 py-3">Name</th>
                            <th className="px-6 py-3">Login ID</th>
                            <th className="px-6 py-3">Status</th>
                            <th className="px-6 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody className={cn("divide-y", theme === 'dark' ? "divide-slate-800" : "divide-slate-200")}>
                        {staffList.map((staff) => (
                            <tr
                                key={staff.id}
                                className={cn(
                                    theme === 'dark' ? "bg-slate-900" : "bg-white"
                                )}
                            >
                                <td className={cn("px-6 py-4 font-medium", theme === 'dark' ? "text-white" : "text-slate-900")}>
                                    <div className="flex items-center gap-2">
                                        <User className="h-4 w-4 text-slate-400" />
                                        {staff.name}
                                    </div>
                                </td>
                                <td className={cn("px-6 py-4", theme === 'dark' ? "text-slate-400" : "text-slate-600")}>
                                    {staff.loginId}
                                </td>
                                <td className="px-6 py-4">
                                    <span className={cn(
                                        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium",
                                        staff.isActive
                                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                            : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                                    )}>
                                        {staff.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <button
                                        onClick={() => toggleStaffStatus(staff.id)}
                                        className={cn(
                                            "text-sm font-medium",
                                            staff.isActive
                                                ? "text-red-600 hover:text-red-700 dark:text-red-400"
                                                : "text-green-600 hover:text-green-700 dark:text-green-400"
                                        )}
                                    >
                                        {staff.isActive ? 'Deactivate' : 'Activate'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {staffList.length === 0 && (
                            <tr>
                                <td colSpan={4} className="px-6 py-12 text-center">
                                    <User className={cn("h-12 w-12 mx-auto mb-4", theme === 'dark' ? 'text-slate-600' : 'text-slate-400')} />
                                    <p className={cn("text-sm", theme === 'dark' ? 'text-slate-400' : 'text-slate-500')}>
                                        No staff members yet. Click "Add Staff" to create one.
                                    </p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Add Staff Modal */}
            {showAddModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className={cn(
                        "w-full max-w-md rounded-xl shadow-2xl p-6",
                        theme === 'dark' ? "bg-slate-900 border border-slate-800" : "bg-white"
                    )}>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className={cn("text-xl font-bold", theme === 'dark' ? "text-white" : "text-slate-900")}>
                                Add New Staff
                            </h2>
                            <button onClick={() => {
                                setShowAddModal(false)
                                setError('')
                                setFormData({ name: '', loginId: '', password: '' })
                            }} className="text-slate-400 hover:text-slate-500">
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        <form onSubmit={handleAddStaff} className="space-y-4">
                            <div>
                                <label className={cn("block text-sm font-medium mb-2", theme === 'dark' ? "text-slate-300" : "text-slate-700")}>
                                    Name
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className={cn(
                                        "w-full px-4 py-2 rounded-lg border outline-none focus:ring-2 focus:ring-blue-500",
                                        theme === 'dark' ? "bg-slate-800 border-slate-700 text-white" : "bg-white border-slate-300"
                                    )}
                                    placeholder="John Doe"
                                />
                            </div>

                            <div>
                                <label className={cn("block text-sm font-medium mb-2", theme === 'dark' ? "text-slate-300" : "text-slate-700")}>
                                    Login ID
                                </label>
                                <input
                                    type="text"
                                    value={formData.loginId}
                                    onChange={(e) => setFormData({ ...formData, loginId: e.target.value })}
                                    className={cn(
                                        "w-full px-4 py-2 rounded-lg border outline-none focus:ring-2 focus:ring-blue-500",
                                        theme === 'dark' ? "bg-slate-800 border-slate-700 text-white" : "bg-white border-slate-300"
                                    )}
                                    placeholder="john.doe@stockmaster.com"
                                />
                            </div>

                            <div>
                                <label className={cn("block text-sm font-medium mb-2", theme === 'dark' ? "text-slate-300" : "text-slate-700")}>
                                    Password
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        className={cn(
                                            "flex-1 px-4 py-2 rounded-lg border outline-none focus:ring-2 focus:ring-blue-500",
                                            theme === 'dark' ? "bg-slate-800 border-slate-700 text-white" : "bg-white border-slate-300"
                                        )}
                                        placeholder="Enter password"
                                    />
                                    <button
                                        type="button"
                                        onClick={generatePassword}
                                        className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 text-sm"
                                    >
                                        Generate
                                    </button>
                                </div>
                            </div>

                            {error && (
                                <div className="p-3 rounded-lg bg-red-50 border border-red-200 dark:bg-red-900/20 dark:border-red-800">
                                    <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                                </div>
                            )}

                            <div className="flex gap-3 pt-2">
                                <button
                                    type="submit"
                                    className="flex-1 py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                                >
                                    Add Staff
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowAddModal(false)
                                        setError('')
                                        setFormData({ name: '', loginId: '', password: '' })
                                    }}
                                    className={cn(
                                        "flex-1 py-2 px-4 rounded-lg font-medium transition-colors",
                                        theme === 'dark' ? "bg-slate-800 text-slate-300 hover:bg-slate-700" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                                    )}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Credentials Modal */}
            {showCredentialsModal && generatedCredentials && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className={cn(
                        "w-full max-w-md rounded-xl shadow-2xl p-6",
                        theme === 'dark' ? "bg-slate-900 border border-slate-800" : "bg-white"
                    )}>
                        <div className="text-center mb-6">
                            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Check className="h-6 w-6 text-green-600 dark:text-green-400" />
                            </div>
                            <h2 className={cn("text-xl font-bold", theme === 'dark' ? "text-white" : "text-slate-900")}>
                                Staff Added Successfully!
                            </h2>
                            <p className={cn("mt-2 text-sm", theme === 'dark' ? "text-slate-400" : "text-slate-500")}>
                                Copy these credentials and share them with the staff member
                            </p>
                        </div>

                        <div className="space-y-3">
                            <div className={cn(
                                "p-4 rounded-lg border",
                                theme === 'dark' ? "bg-slate-800 border-slate-700" : "bg-slate-50 border-slate-200"
                            )}>
                                <div className="flex items-center justify-between mb-1">
                                    <span className={cn("text-xs font-medium", theme === 'dark' ? "text-slate-400" : "text-slate-500")}>
                                        Name
                                    </span>
                                    <button
                                        onClick={() => handleCopy(generatedCredentials.name, 'name')}
                                        className="text-blue-600 hover:text-blue-700 dark:text-blue-400"
                                    >
                                        {copiedField === 'name' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                    </button>
                                </div>
                                <p className={cn("font-mono text-sm", theme === 'dark' ? "text-white" : "text-slate-900")}>
                                    {generatedCredentials.name}
                                </p>
                            </div>

                            <div className={cn(
                                "p-4 rounded-lg border",
                                theme === 'dark' ? "bg-slate-800 border-slate-700" : "bg-slate-50 border-slate-200"
                            )}>
                                <div className="flex items-center justify-between mb-1">
                                    <span className={cn("text-xs font-medium", theme === 'dark' ? "text-slate-400" : "text-slate-500")}>
                                        Login ID
                                    </span>
                                    <button
                                        onClick={() => handleCopy(generatedCredentials.loginId, 'loginId')}
                                        className="text-blue-600 hover:text-blue-700 dark:text-blue-400"
                                    >
                                        {copiedField === 'loginId' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                    </button>
                                </div>
                                <p className={cn("font-mono text-sm", theme === 'dark' ? "text-white" : "text-slate-900")}>
                                    {generatedCredentials.loginId}
                                </p>
                            </div>

                            <div className={cn(
                                "p-4 rounded-lg border",
                                theme === 'dark' ? "bg-slate-800 border-slate-700" : "bg-slate-50 border-slate-200"
                            )}>
                                <div className="flex items-center justify-between mb-1">
                                    <span className={cn("text-xs font-medium", theme === 'dark' ? "text-slate-400" : "text-slate-500")}>
                                        Password
                                    </span>
                                    <button
                                        onClick={() => handleCopy(generatedCredentials.password, 'password')}
                                        className="text-blue-600 hover:text-blue-700 dark:text-blue-400"
                                    >
                                        {copiedField === 'password' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                    </button>
                                </div>
                                <p className={cn("font-mono text-sm", theme === 'dark' ? "text-white" : "text-slate-900")}>
                                    {generatedCredentials.password}
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={() => {
                                setShowCredentialsModal(false)
                                setGeneratedCredentials(null)
                            }}
                            className="w-full mt-6 py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                        >
                            Done
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
