"use client"

import { useStock } from "@/context/StockContext"
import { cn } from "@/lib/utils"
import { AlertCircle, Calendar, CheckCircle, Clock, MapPin, PackagePlus, User, XCircle } from "lucide-react"

export function ReceiptsListView({ searchTerm, onOperationClick }) {
    const { operations, theme } = useStock()

    // Filter receipts only
    const receipts = operations.filter(op => op.type === 'RECEIPT')
        .filter(op =>
            op.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
            op.contact.toLowerCase().includes(searchTerm.toLowerCase())
        )

    const getStatusBadge = (status) => {
        const styles = {
            'Draft': 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400',
            'Ready': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
            'Done': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
            'Cancelled': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
        }

        const Icon = status === 'Done' ? CheckCircle : status === 'Ready' ? Clock : status === 'Cancelled' ? XCircle : AlertCircle

        return (
            <span className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium", styles[status])}>
                <Icon className="h-3 w-3" />
                {status}
            </span>
        )
    }

    return (
        <div className={cn("rounded-lg border overflow-hidden", theme === 'dark' ? "border-slate-800" : "border-slate-200")}>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className={cn(
                        "text-xs uppercase",
                        theme === 'dark' ? "bg-slate-900 text-slate-400" : "bg-slate-50 text-slate-600"
                    )}>
                        <tr>
                            <th className="px-6 py-3 text-left font-medium">Reference</th>
                            <th className="px-6 py-3 text-left font-medium">From</th>
                            <th className="px-6 py-3 text-left font-medium">To</th>
                            <th className="px-6 py-3 text-left font-medium">Contact</th>
                            <th className="px-6 py-3 text-left font-medium">Scheduled Date</th>
                            <th className="px-6 py-3 text-left font-medium">Status</th>
                        </tr>
                    </thead>
                    <tbody className={cn("divide-y", theme === 'dark' ? "divide-slate-800" : "divide-slate-200")}>
                        {receipts.map((receipt) => (
                            <tr
                                key={receipt.id}
                                onClick={() => onOperationClick(receipt)}
                                className={cn(
                                    "cursor-pointer transition-colors",
                                    theme === 'dark' ? "bg-slate-900 hover:bg-slate-800" : "bg-white hover:bg-slate-50"
                                )}
                            >
                                <td className={cn("px-6 py-4 font-mono text-xs font-medium", theme === 'dark' ? "text-blue-400" : "text-blue-600")}>
                                    {receipt.reference}
                                </td>
                                <td className={cn("px-6 py-4", theme === 'dark' ? "text-slate-400" : "text-slate-600")}>
                                    {receipt.sourceLocation}
                                </td>
                                <td className={cn("px-6 py-4", theme === 'dark' ? "text-slate-400" : "text-slate-600")}>
                                    <div className="flex items-center gap-2">
                                        <MapPin className="h-4 w-4" />
                                        {receipt.destLocation}
                                    </div>
                                </td>
                                <td className={cn("px-6 py-4", theme === 'dark' ? "text-slate-300" : "text-slate-900")}>
                                    <div className="flex items-center gap-2">
                                        <User className="h-4 w-4 text-slate-400" />
                                        {receipt.contact}
                                    </div>
                                </td>
                                <td className={cn("px-6 py-4", theme === 'dark' ? "text-slate-400" : "text-slate-600")}>
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4" />
                                        {new Date(receipt.scheduledDate).toLocaleDateString()}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    {getStatusBadge(receipt.status)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {receipts.length === 0 && (
                <div className="text-center py-12">
                    <PackagePlus className={cn("h-12 w-12 mx-auto mb-4", theme === 'dark' ? 'text-slate-600' : 'text-slate-400')} />
                    <p className={cn("text-sm", theme === 'dark' ? 'text-slate-400' : 'text-slate-500')}>
                        No receipts found
                    </p>
                </div>
            )}
        </div>
    )
}
