"use client"

import { useStock } from "@/context/StockContext"
import { cn } from "@/lib/utils"
import { AlertCircle, ArrowRight, Calendar, CheckCircle, Clock, MapPin, Package, XCircle } from "lucide-react"

export function TransfersListView({ searchTerm, onOperationClick }) {
    const { operations, theme } = useStock()

    // Filter transfers only
    const transfers = operations.filter(op => op.type === 'TRANSFER')
        .filter(op =>
            op.reference.toLowerCase().includes(searchTerm.toLowerCase())
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
                            <th className="px-6 py-3 text-left font-medium">Scheduled Date</th>
                            <th className="px-6 py-3 text-left font-medium">Source</th>
                            <th className="px-6 py-3 text-left font-medium">Destination</th>
                            <th className="px-6 py-3 text-left font-medium">Products</th>
                            <th className="px-6 py-3 text-left font-medium">Status</th>
                        </tr>
                    </thead>
                    <tbody className={cn("divide-y", theme === 'dark' ? "divide-slate-800" : "divide-slate-200")}>
                        {transfers.map((transfer) => (
                            <tr
                                key={transfer.id}
                                onClick={() => onOperationClick(transfer)}
                                className={cn(
                                    "cursor-pointer transition-colors",
                                    theme === 'dark' ? "bg-slate-900 hover:bg-slate-800" : "bg-white hover:bg-slate-50"
                                )}
                            >
                                <td className={cn("px-6 py-4 font-mono text-xs font-medium", theme === 'dark' ? "text-blue-400" : "text-blue-600")}>
                                    {transfer.reference}
                                </td>
                                <td className={cn("px-6 py-4", theme === 'dark' ? "text-slate-400" : "text-slate-600")}>
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4" />
                                        {new Date(transfer.scheduledDate).toLocaleDateString()}
                                    </div>
                                </td>
                                <td className={cn("px-6 py-4", theme === 'dark' ? "text-slate-400" : "text-slate-600")}>
                                    <div className="flex items-center gap-2">
                                        <MapPin className="h-4 w-4" />
                                        {transfer.sourceLocation}
                                    </div>
                                </td>
                                <td className={cn("px-6 py-4", theme === 'dark' ? "text-slate-400" : "text-slate-600")}>
                                    <div className="flex items-center gap-2">
                                        <ArrowRight className="h-4 w-4 text-slate-400" />
                                        {transfer.destLocation}
                                    </div>
                                </td>
                                <td className={cn("px-6 py-4", theme === 'dark' ? "text-slate-400" : "text-slate-600")}>
                                    {transfer.productLines.length} item{transfer.productLines.length !== 1 ? 's' : ''}
                                </td>
                                <td className="px-6 py-4">
                                    {getStatusBadge(transfer.status)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {transfers.length === 0 && (
                <div className="text-center py-12">
                    <Package className={cn("h-12 w-12 mx-auto mb-4", theme === 'dark' ? 'text-slate-600' : 'text-slate-400')} />
                    <p className={cn("text-sm", theme === 'dark' ? 'text-slate-400' : 'text-slate-500')}>
                        No internal transfers found
                    </p>
                </div>
            )}
        </div>
    )
}
