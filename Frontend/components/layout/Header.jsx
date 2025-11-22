"use client"

import { useStock } from "@/context/StockContext"
import { cn } from "@/lib/utils"
import { Bell, HelpCircle, Search } from "lucide-react"

export function Header() {
    const { theme } = useStock()

    return (
        <header className={cn(
            "sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b px-6 shadow-sm transition-colors",
            theme === 'dark' ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
        )}>
            <div className="flex items-center gap-4">
                <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                    <input
                        type="search"
                        placeholder="Global Search..."
                        className={cn(
                            "h-9 w-64 rounded-md border pl-9 pr-4 text-sm outline-none focus:ring-1",
                            theme === 'dark'
                                ? "bg-slate-800 border-slate-700 text-slate-200 focus:border-blue-500 focus:ring-blue-500 placeholder:text-slate-500"
                                : "bg-slate-50 border-slate-200 text-slate-900 focus:border-blue-500 focus:ring-blue-500"
                        )}
                    />
                </div>
            </div>

            <div className="flex items-center gap-4">
                <button className={cn("hover:opacity-80", theme === 'dark' ? "text-slate-400" : "text-slate-500")}>
                    <HelpCircle className="h-5 w-5" />
                </button>
                <button className={cn("relative hover:opacity-80", theme === 'dark' ? "text-slate-400" : "text-slate-500")}>
                    <Bell className="h-5 w-5" />
                    <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                        3
                    </span>
                </button>
            </div>
        </header>
    )
}
