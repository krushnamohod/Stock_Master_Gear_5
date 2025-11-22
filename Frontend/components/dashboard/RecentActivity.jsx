"use client"

import { useStock } from "@/context/StockContext"
import { cn } from "@/lib/utils"
import { Clock } from "lucide-react"

export function RecentActivity() {
    const { operations, theme, loading } = useStock()

    // While loading → show placeholder
    if (loading) {
        return (
            <div className={cn(
                "rounded-xl p-6 border shadow-sm min-h-[200px] flex items-center justify-center",
                theme === "dark" ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
            )}>
                <p className={theme === "dark" ? "text-slate-400" : "text-slate-600"}>
                    Loading activity...
                </p>
            </div>
        )
    }

    // Fail-safe: if operations is missing or empty
    const recent = Array.isArray(operations)
        ? operations.slice(0, 10)
        : []

    return (
        <div className={cn(
            "rounded-xl border p-6 shadow-sm",
            theme === "dark" ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900"
        )}>
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Clock className="h-5 w-5" /> Recent Activity
            </h2>

            {recent.length === 0 ? (
                <p className={theme === "dark" ? "text-slate-400" : "text-slate-500"}>
                    No recent movements recorded.
                </p>
            ) : (
                <ul className="space-y-4">
                    {recent.map((item) => (
                        <li key={item.id} className="flex justify-between items-center">
                            <div>
                                <p className="font-medium">{item.type}</p>
                                <p className="text-sm opacity-70">{item.reference}</p>
                                <p className="text-xs opacity-50">{item.createdAt?.slice(0, 10)}</p>
                            </div>
                            <span className={cn(
                                "px-3 py-1 rounded-full text-xs font-medium",
                                item.status === "Done"
                                    ? "bg-green-100 text-green-700"
                                    : item.status === "Ready"
                                        ? "bg-yellow-100 text-yellow-700"
                                        : "bg-slate-200 text-slate-700"
                            )}>
                                {item.status}
                            </span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}
