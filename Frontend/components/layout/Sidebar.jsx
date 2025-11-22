"use client"

import { useAuth } from "@/context/AuthContext"
import { useStock } from "@/context/StockContext"
import { cn } from "@/lib/utils"
import {
    ArrowRightLeft,
    Box,
    ChevronLeft,
    ChevronRight,
    FileText,
    LayoutDashboard,
    LogOut,
    Moon,
    Package,
    Settings,
    Sun,
    Users
} from "lucide-react"
import { useState } from "react"

const navItems = [
    {
        title: "Dashboard",
        id: "dashboard",
        icon: LayoutDashboard,
    },
    {
        title: "Products",
        id: "products",
        icon: Package,
    },
    {
        title: "Operations",
        id: "operations",
        icon: ArrowRightLeft,
    },
    {
        title: "Move History",
        id: "history",
        icon: FileText,
    },
    {
        title: "Staff Management",
        id: "staff",
        icon: Users,
        adminOnly: true,
    },
    {
        title: "Settings",
        id: "settings",
        icon: Settings,
    },
]

export function Sidebar() {
    const [isCollapsed, setIsCollapsed] = useState(false)
    const { currentView, setCurrentView, theme, toggleTheme } = useStock()
    const { currentUser, logout } = useAuth()

    // Filter nav items based on user role
    const filteredNavItems = navItems.filter(item => {
        if (item.adminOnly) {
            return currentUser?.role === 'admin'
        }
        return true
    })

    return (
        <aside
            className={cn(
                "relative flex flex-col border-r transition-all duration-300",
                theme === 'dark' ? "bg-slate-900 border-slate-800 text-slate-50" : "bg-white border-slate-200 text-slate-900",
                isCollapsed ? "w-16" : "w-64"
            )}
        >
            <div className="flex h-16 items-center justify-between px-4 py-4">
                {!isCollapsed && (
                    <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
                        <Box className="h-6 w-6 text-blue-500" />
                        <span>StockMaster</span>
                    </div>
                )}
                {isCollapsed && (
                    <div className="mx-auto">
                        <Box className="h-6 w-6 text-blue-500" />
                    </div>
                )}
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className={cn(
                        "absolute -right-3 top-6 flex h-6 w-6 items-center justify-center rounded-full border shadow-sm hover:bg-slate-100 transition-colors",
                        theme === 'dark' ? "bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700" : "bg-white border-slate-200 text-slate-900"
                    )}
                >
                    {isCollapsed ? (
                        <ChevronRight className="h-3 w-3" />
                    ) : (
                        <ChevronLeft className="h-3 w-3" />
                    )}
                </button>
            </div>

            <nav className="flex-1 space-y-1 px-2 py-4">
                {filteredNavItems.map((item) => {
                    const isActive = currentView === item.id
                    return (
                        <button
                            key={item.id}
                            onClick={() => setCurrentView(item.id)}
                            className={cn(
                                "flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                                isActive
                                    ? "bg-blue-600 text-white"
                                    : theme === 'dark'
                                        ? "text-slate-400 hover:bg-slate-800 hover:text-slate-50"
                                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
                                isCollapsed && "justify-center px-2"
                            )}
                            title={isCollapsed ? item.title : undefined}
                        >
                            <item.icon className="h-5 w-5" />
                            {!isCollapsed && <span>{item.title}</span>}
                        </button>
                    )
                })}
            </nav>

            <div className={cn("border-t p-4", theme === 'dark' ? "border-slate-800" : "border-slate-200")}>
                <div className="flex flex-col gap-4">
                    {/* Theme Toggle */}
                    <button
                        onClick={toggleTheme}
                        className={cn(
                            "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors w-full",
                            theme === 'dark'
                                ? "text-slate-400 hover:bg-slate-800 hover:text-slate-50"
                                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
                            isCollapsed && "justify-center px-2"
                        )}
                    >
                        {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                        {!isCollapsed && <span>{theme === 'dark' ? "Light Mode" : "Dark Mode"}</span>}
                    </button>

                    {/* Profile / Logout */}
                    {!isCollapsed ? (
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-500 font-bold text-xs">
                                    {currentUser?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
                                </div>
                                <div className="flex flex-col text-left">
                                    <span className="text-sm font-medium">{currentUser?.name || 'User'}</span>
                                    <span className="text-xs opacity-70 capitalize">{currentUser?.role || 'Staff'}</span>
                                </div>
                            </div>
                            <button
                                onClick={logout}
                                className="text-slate-400 hover:text-red-500"
                                title="Logout"
                            >
                                <LogOut className="h-4 w-4" />
                            </button>
                        </div>
                    ) : (
                        <div className="mx-auto h-8 w-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-500 font-bold text-xs">
                            {currentUser?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
                        </div>
                    )}
                </div>
            </div>
        </aside>
    )
}
