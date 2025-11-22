import { useStock } from "@/context/StockContext"
import { cn } from "@/lib/utils"
import { Clock } from "lucide-react"

export function RecentActivity() {
    const { theme, movements } = useStock()

    return (
        <div className={cn(
            "rounded-xl border shadow-sm",
            theme === 'dark' ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
        )}>
            <div className={cn(
                "flex items-center justify-between border-b px-6 py-4",
                theme === 'dark' ? "border-slate-800" : "border-slate-100"
            )}>
                <h3 className={cn("font-semibold", theme === 'dark' ? "text-white" : "text-slate-900")}>Recent Activity</h3>
                <Clock className="h-4 w-4 text-slate-400" />
            </div>
            <div className="p-6">
                <div className="flex flex-col gap-4">
                    {movements.slice(0, 5).map((move) => (
                        <div key={move.id} className={cn(
                            "flex items-start gap-4 border-b pb-4 last:border-0 last:pb-0",
                            theme === 'dark' ? "border-slate-800" : "border-slate-50"
                        )}>
                            <div className={cn(
                                "h-2 w-2 mt-2 rounded-full",
                                move.type === 'IN' ? "bg-green-500" : move.type === 'OUT' ? "bg-blue-500" : "bg-amber-500"
                            )} />
                            <div className="flex flex-col gap-1">
                                <p className={cn("text-sm font-medium", theme === 'dark' ? "text-slate-200" : "text-slate-900")}>
                                    {move.type === 'IN' ? 'Received' : move.type === 'OUT' ? 'Delivered' : 'Adjusted'} {move.quantity} units (Ref: {move.reference})
                                </p>
                                <p className="text-xs text-slate-500">{move.date}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
