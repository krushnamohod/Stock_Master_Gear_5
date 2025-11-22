"use client"

import { useStock } from "@/context/StockContext"
import { cn } from "@/lib/utils"
import { AlertCircle, CheckCircle, Clock, MapPin, MoreHorizontal, User, XCircle } from "lucide-react"

export function ReceiptsKanbanView({ searchTerm, onOperationClick }) {
    const { operations, theme } = useStock()

    // Filter receipts only
    const receipts = operations.filter(op => op.type === 'RECEIPT')
        .filter(op =>
            op.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
            op.contact.toLowerCase().includes(searchTerm.toLowerCase())
        )

    const columns = [
        { id: 'Draft', label: 'Draft', color: 'bg-gray-100 dark:bg-gray-800', border: 'border-gray-200 dark:border-gray-700' },
        { id: 'Ready', label: 'Ready', color: 'bg-blue-50 dark:bg-blue-900/20', border: 'border-blue-200 dark:border-blue-800' },
        { id: 'Done', label: 'Done', color: 'bg-green-50 dark:bg-green-900/20', border: 'border-green-200 dark:border-green-800' },
        { id: 'Cancelled', label: 'Cancelled', color: 'bg-red-50 dark:bg-red-900/20', border: 'border-red-200 dark:border-red-800' }
    ]

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Done': return <CheckCircle className="h-4 w-4 text-green-600" />
            case 'Ready': return <Clock className="h-4 w-4 text-blue-600" />
            case 'Cancelled': return <XCircle className="h-4 w-4 text-red-600" />
            default: return <AlertCircle className="h-4 w-4 text-gray-500" />
        }
    }

    return (
        <div className="flex gap-4 overflow-x-auto pb-4 h-[calc(100vh-250px)]">
            {columns.map(col => {
                const colReceipts = receipts.filter(r => r.status === col.id)

                return (
                    <div key={col.id} className="flex-1 min-w-[300px] flex flex-col">
                        {/* Column Header */}
                        <div className={cn(
                            "flex items-center justify-between p-3 rounded-t-lg border-b-2 mb-2",
                            theme === 'dark' ? 'bg-slate-900' : 'bg-white',
                            col.border
                        )}>
                            <div className="flex items-center gap-2">
                                {getStatusIcon(col.id)}
                                <span className={cn("font-semibold text-sm", theme === 'dark' ? 'text-slate-200' : 'text-slate-700')}>
                                    {col.label}
                                </span>
                                <span className={cn(
                                    "px-2 py-0.5 rounded-full text-xs font-medium",
                                    theme === 'dark' ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-600'
                                )}>
                                    {colReceipts.length}
                                </span>
                            </div>
                            <button className="text-slate-400 hover:text-slate-600">
                                <MoreHorizontal className="h-4 w-4" />
                            </button>
                        </div>

                        {/* Cards Container */}
                        <div className={cn(
                            "flex-1 overflow-y-auto p-2 space-y-3 rounded-lg",
                            col.color
                        )}>
                            {colReceipts.map(receipt => (
                                <div
                                    key={receipt.id}
                                    onClick={() => onOperationClick(receipt)}
                                    className={cn(
                                        "p-4 rounded-lg border shadow-sm cursor-pointer transition-all hover:shadow-md",
                                        theme === 'dark'
                                            ? "bg-slate-900 border-slate-700 hover:border-slate-600"
                                            : "bg-white border-slate-200 hover:border-blue-300"
                                    )}
                                >
                                    <div className="flex justify-between items-start mb-3">
                                        <span className="font-mono text-xs font-medium text-blue-600 dark:text-blue-400">
                                            {receipt.reference}
                                        </span>
                                        <span className={cn("text-xs text-slate-500", theme === 'dark' && "text-slate-400")}>
                                            {new Date(receipt.scheduledDate).toLocaleDateString()}
                                        </span>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-sm font-medium">
                                            <User className="h-4 w-4 text-slate-400" />
                                            <span className={theme === 'dark' ? 'text-slate-200' : 'text-slate-900'}>
                                                {receipt.contact}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                                            <MapPin className="h-3 w-3" />
                                            <span>To: {receipt.destLocation}</span>
                                        </div>

                                        <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                                            <span className="text-xs text-slate-500">
                                                {receipt.productLines.length} items
                                            </span>
                                            <span className={cn(
                                                "text-xs font-medium",
                                                receipt.status === 'Done' ? "text-green-600" : "text-slate-400"
                                            )}>
                                                {receipt.status}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
