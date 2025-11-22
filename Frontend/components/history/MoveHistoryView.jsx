"use client"

import { useStock } from "@/context/StockContext"
import { cn } from "@/lib/utils"
import { FileText } from "lucide-react"

export function MoveHistoryView() {
    const { movements, products, theme } = useStock()

    const getProductName = (id) => {
        const p = products.find(prod => prod.id === parseInt(id))
        return p ? p.name : `Product #${id}`
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className={cn("text-2xl font-bold tracking-tight", theme === 'dark' ? "text-white" : "text-slate-900")}>Move History</h1>
                    <p className={cn("text-sm", theme === 'dark' ? "text-slate-400" : "text-slate-500")}>Audit log of all stock transactions.</p>
                </div>
                <button className={cn(
                    "flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium",
                    theme === 'dark' ? "border-slate-700 text-slate-300 hover:bg-slate-800" : "border-slate-200 text-slate-700 hover:bg-slate-50"
                )}>
                    <FileText className="h-4 w-4" />
                    Export Log
                </button>
            </div>

            <div className={cn("rounded-md border", theme === 'dark' ? "border-slate-800" : "border-slate-200")}>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className={cn(
                            "text-xs uppercase",
                            theme === 'dark' ? "bg-slate-900 text-slate-400" : "bg-slate-50 text-slate-500"
                        )}>
                            <tr>
                                <th className="px-6 py-3 font-medium">Date</th>
                                <th className="px-6 py-3 font-medium">Reference</th>
                                <th className="px-6 py-3 font-medium">Product</th>
                                <th className="px-6 py-3 font-medium">Type</th>
                                <th className="px-6 py-3 font-medium">Quantity</th>
                            </tr>
                        </thead>
                        <tbody className={cn("divide-y", theme === 'dark' ? "divide-slate-800" : "divide-slate-200")}>
                            {movements.map((move) => (
                                <tr key={move.id} className={cn(theme === 'dark' ? "bg-slate-900 hover:bg-slate-800" : "bg-white hover:bg-slate-50")}>
                                    <td className={cn("px-6 py-4", theme === 'dark' ? "text-slate-300" : "text-slate-900")}>{move.date}</td>
                                    <td className="px-6 py-4 text-slate-500 font-mono text-xs">{move.reference}</td>
                                    <td className={cn("px-6 py-4 font-medium", theme === 'dark' ? "text-slate-200" : "text-slate-900")}>{getProductName(move.productId)}</td>
                                    <td className="px-6 py-4">
                                        <span className={cn(
                                            "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                                            move.type === 'IN'
                                                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                                : move.type === 'OUT'
                                                    ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                                                    : "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
                                        )}>
                                            {move.type === 'IN' ? 'RECEIPT' : move.type === 'OUT' ? 'DELIVERY' : 'ADJUSTMENT'}
                                        </span>
                                    </td>
                                    <td className={cn("px-6 py-4 font-medium", theme === 'dark' ? "text-slate-200" : "text-slate-900")}>
                                        {move.type === 'OUT' ? '-' : '+'}{move.quantity}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
