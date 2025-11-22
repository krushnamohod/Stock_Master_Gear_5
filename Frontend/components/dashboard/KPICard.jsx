import { useStock } from "@/context/StockContext"
import { cn } from "@/lib/utils"

export function KPICard({
    title,
    value,
    icon: Icon,
    trend,
    trendUp,
    alert,
    description,
}) {
    const { theme } = useStock()

    return (
        <div
            className={cn(
                "rounded-xl border p-6 shadow-sm transition-all hover:shadow-md",
                theme === 'dark'
                    ? (alert ? "bg-red-900/20 border-red-800" : "bg-slate-900 border-slate-800")
                    : (alert ? "bg-red-50 border-red-200" : "bg-white border-slate-200")
            )}
        >
            <div className="flex items-center justify-between space-y-0 pb-2">
                <h3 className={cn("text-sm font-medium tracking-tight", theme === 'dark' ? "text-slate-400" : "text-slate-500")}>
                    {title}
                </h3>
                <Icon className={cn("h-4 w-4", alert ? "text-red-500" : (theme === 'dark' ? "text-slate-400" : "text-slate-500"))} />
            </div>
            <div className="flex items-baseline space-x-2">
                <div className={cn("text-2xl font-bold", alert ? "text-red-600" : (theme === 'dark' ? "text-white" : "text-slate-900"))}>
                    {value}
                </div>
                {trend && (
                    <span
                        className={cn(
                            "text-xs font-medium",
                            trendUp ? "text-green-600" : "text-red-600"
                        )}
                    >
                        {trendUp ? "↑" : "↓"} {trend}
                    </span>
                )}
            </div>
            {description && (
                <p className={cn("mt-1 text-xs", theme === 'dark' ? "text-slate-500" : "text-slate-500")}>{description}</p>
            )}
        </div>
    )
}
