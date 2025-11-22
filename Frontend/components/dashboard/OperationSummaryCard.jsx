"use client"

import { useStock } from "@/context/StockContext"
import { cn } from "@/lib/utils"

export function OperationSummaryCard({ title, count, label, stats, onClick }) {
    const { theme } = useStock()

    return (
        <div
            onClick={onClick}
            className={cn(
                "p-5 rounded-xl border shadow-sm cursor-pointer transition-all hover:shadow-md group",
                theme === 'dark'
                    ? "bg-slate-900 border-slate-800 hover:border-slate-700"
                    : "bg-white border-slate-200 hover:border-blue-300"
            )}
        >
            <h3 className={cn(
                "font-bold text-lg mb-4 group-hover:text-blue-600 transition-colors",
                theme === 'dark' ? "text-slate-100" : "text-slate-900"
            )}>
                {title}
            </h3>

            <div className="flex items-center justify-between mb-6">
                <button className="flex-1 flex items-center justify-between px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
                    <span className="font-bold text-2xl">{count}</span>
                    <span className="font-medium text-sm uppercase tracking-wide opacity-90">{label}</span>
                </button>
            </div>

            <div className="space-y-3">
                {stats.map((stat, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                        <span className={cn(
                            "font-medium",
                            stat.isLate ? "text-red-500" : (theme === 'dark' ? "text-slate-400" : "text-slate-600")
                        )}>
                            {stat.label}
                        </span>
                        <span className={cn(
                            "font-bold px-2.5 py-0.5 rounded-full text-xs",
                            stat.isLate
                                ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                                : (theme === 'dark' ? "bg-slate-800 text-slate-300" : "bg-slate-100 text-slate-700")
                        )}>
                            {stat.count}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    )
}
