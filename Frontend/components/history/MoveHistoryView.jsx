"use client"

import { useStock } from "@/context/StockContext"
import { cn } from "@/lib/utils"
import { ArrowDownUp, LayoutGrid, List, Search } from "lucide-react"
import { useState } from "react"

export function MoveHistoryView() {
    const { movements, theme } = useStock()
    const [viewMode, setViewMode] = useState('list') // 'list' or 'kanban'
    const [searchTerm, setSearchTerm] = useState("")
    const [sortBy, setSortBy] = useState('date')
    const [sortOrder, setSortOrder] = useState('desc')

    // Filter movements by search term
    const filteredMovements = movements.filter(m =>
        m.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.contact.toLowerCase().includes(searchTerm.toLowerCase())
    ).sort((a, b) => {
        let aVal, bVal
        if (sortBy === 'date') {
            aVal = new Date(a.date)
            bVal = new Date(b.date)
        } else if (sortBy === 'reference') {
            aVal = a.reference
            bVal = b.reference
        }

        if (sortOrder === 'asc') {
            return aVal > bVal ? 1 : -1
        } else {
            return aVal < bVal ? 1 : -1
        }
    })

    const handleSort = (field) => {
        if (sortBy === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
        } else {
            setSortBy(field)
            setSortOrder('desc')
        }
    }

    // Group movements by status for Kanban view
    const draftMovements = filteredMovements.filter(m => m.status === 'Draft')
    const readyMovements = filteredMovements.filter(m => m.status === 'Ready')
    const doneMovements = filteredMovements.filter(m => m.status === 'Done')

    const MovementCard = ({ movement }) => (
        <div className={cn(
            "p-3 rounded-lg border mb-2",
            theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
        )}>
            <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                    <p className={cn("font-mono text-xs font-medium", theme === 'dark' ? 'text-slate-300' : 'text-slate-700')}>
                        {movement.reference}
                    </p>
                    <p className={cn("text-sm mt-0.5", theme === 'dark' ? 'text-slate-400' : 'text-slate-600')}>
                        {movement.contact}
                    </p>
                </div>
                <span className={cn(
                    "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
                    movement.type === 'IN'
                        ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                        : movement.type === 'OUT'
                            ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                            : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                )}>
                    {movement.type}
                </span>
            </div>
            <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                    <span className={cn(theme === 'dark' ? 'text-slate-500' : 'text-slate-400')}>Product:</span>
                    <span className={cn("font-medium", theme === 'dark' ? 'text-slate-300' : 'text-slate-700')}>
                        {movement.productName}
                    </span>
                </div>
                <div className="flex justify-between">
                    <span className={cn(theme === 'dark' ? 'text-slate-500' : 'text-slate-400')}>Quantity:</span>
                    <span className={cn("font-bold", movement.type === 'OUT' ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400')}>
                        {movement.type === 'OUT' ? '-' : '+'}{movement.quantity}
                    </span>
                </div>
                {movement.fromWarehouse && (
                    <div className="flex justify-between">
                        <span className={cn(theme === 'dark' ? 'text-slate-500' : 'text-slate-400')}>From:</span>
                        <span className={cn(theme === 'dark' ? 'text-slate-300' : 'text-slate-700')}>{movement.fromWarehouse}</span>
                    </div>
                )}
                {movement.toWarehouse && (
                    <div className="flex justify-between">
                        <span className={cn(theme === 'dark' ? 'text-slate-500' : 'text-slate-400')}>To:</span>
                        <span className={cn(theme === 'dark' ? 'text-slate-300' : 'text-slate-700')}>{movement.toWarehouse}</span>
                    </div>
                )}
                <div className="flex justify-between pt-1 mt-1 border-t border-slate-200 dark:border-slate-700">
                    <span className={cn(theme === 'dark' ? 'text-slate-500' : 'text-slate-400')}>{movement.date}</span>
                </div>
            </div>
        </div>
    )

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className={cn("text-2xl font-bold tracking-tight", theme === 'dark' ? "text-white" : "text-slate-900")}>
                    Move History
                </h1>
                <p className={cn("text-sm mt-1", theme === 'dark' ? "text-slate-400" : "text-slate-500")}>
                    Track all stock movements and transactions
                </p>
            </div>

            {/* Search & View Toggle */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                {/* Search */}
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search by reference or contact..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={cn(
                            "h-9 w-full rounded-md border pl-9 pr-4 text-sm outline-none focus:ring-2 focus:ring-blue-500",
                            theme === 'dark'
                                ? "bg-slate-900 border-slate-700 text-slate-200"
                                : "bg-white border-slate-200 text-slate-900"
                        )}
                    />
                </div>

                {/* View Mode Toggle */}
                <div className={cn(
                    "flex items-center rounded-md border",
                    theme === 'dark' ? 'border-slate-700 bg-slate-900' : 'border-slate-200 bg-white'
                )}>
                    <button
                        onClick={() => setViewMode('list')}
                        className={cn(
                            "p-2 transition-colors rounded-l-md flex items-center gap-2 px-3",
                            viewMode === 'list'
                                ? 'bg-blue-600 text-white'
                                : theme === 'dark' ? 'text-slate-400 hover:bg-slate-800' : 'text-slate-600 hover:bg-slate-50'
                        )}
                    >
                        <List className="h-4 w-4" />
                        <span className="text-xs font-medium">List</span>
                    </button>
                    <button
                        onClick={() => setViewMode('kanban')}
                        className={cn(
                            "p-2 transition-colors rounded-r-md flex items-center gap-2 px-3",
                            viewMode === 'kanban'
                                ? 'bg-blue-600 text-white'
                                : theme === 'dark' ? 'text-slate-400 hover:bg-slate-800' : 'text-slate-600 hover:bg-slate-50'
                        )}
                    >
                        <LayoutGrid className="h-4 w-4" />
                        <span className="text-xs font-medium">Kanban</span>
                    </button>
                </div>
            </div>

            {/* List View */}
            {viewMode === 'list' && (
                <div className={cn("rounded-lg border overflow-hidden", theme === 'dark' ? "border-slate-800" : "border-slate-200")}>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className={cn(
                                "text-xs uppercase",
                                theme === 'dark' ? "bg-slate-900 text-slate-400" : "bg-slate-50 text-slate-600"
                            )}>
                                <tr>
                                    <th className="px-6 py-3 text-left">
                                        <button
                                            onClick={() => handleSort('reference')}
                                            className="flex items-center gap-1 font-medium hover:text-blue-600"
                                        >
                                            Reference
                                            <ArrowDownUp className="h-3 w-3" />
                                        </button>
                                    </th>
                                    <th className="px-6 py-3 text-left">
                                        <button
                                            onClick={() => handleSort('date')}
                                            className="flex items-center gap-1 font-medium hover:text-blue-600"
                                        >
                                            Date
                                            <ArrowDownUp className="h-3 w-3" />
                                        </button>
                                    </th>
                                    <th className="px-6 py-3 text-left font-medium">Contact</th>
                                    <th className="px-6 py-3 text-left font-medium">From</th>
                                    <th className="px-6 py-3 text-left font-medium">To</th>
                                    <th className="px-6 py-3 text-left font-medium">Product</th>
                                    <th className="px-6 py-3 text-right font-medium">Quantity</th>
                                    <th className="px-6 py-3 text-left font-medium">Status</th>
                                </tr>
                            </thead>
                            <tbody className={cn("divide-y", theme === 'dark' ? "divide-slate-800" : "divide-slate-200")}>
                                {filteredMovements.map((movement) => (
                                    <tr
                                        key={movement.id}
                                        className={cn(
                                            "transition-colors",
                                            theme === 'dark' ? "bg-slate-900 hover:bg-slate-800" : "bg-white hover:bg-slate-50",
                                            movement.type === 'IN' ? 'border-l-4 border-l-green-500' : movement.type === 'OUT' ? 'border-l-4 border-l-red-500' : 'border-l-4 border-l-yellow-500'
                                        )}
                                    >
                                        <td className={cn("px-6 py-4 font-mono text-xs", theme === 'dark' ? "text-slate-300" : "text-slate-700")}>
                                            {movement.reference}
                                        </td>
                                        <td className={cn("px-6 py-4", theme === 'dark' ? "text-slate-400" : "text-slate-600")}>
                                            {movement.date}
                                        </td>
                                        <td className={cn("px-6 py-4 font-medium", theme === 'dark' ? "text-slate-200" : "text-slate-900")}>
                                            {movement.contact}
                                        </td>
                                        <td className={cn("px-6 py-4", theme === 'dark' ? "text-slate-400" : "text-slate-600")}>
                                            {movement.fromWarehouse || '-'}
                                        </td>
                                        <td className={cn("px-6 py-4", theme === 'dark' ? "text-slate-400" : "text-slate-600")}>
                                            {movement.toWarehouse || '-'}
                                        </td>
                                        <td className={cn("px-6 py-4", theme === 'dark' ? "text-slate-300" : "text-slate-700")}>
                                            {movement.productName}
                                        </td>
                                        <td className={cn(
                                            "px-6 py-4 text-right font-bold",
                                            movement.type === 'IN' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                                        )}>
                                            {movement.type === 'OUT' ? '-' : '+'}{movement.quantity}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={cn(
                                                "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                                                movement.status === 'Draft'
                                                    ? "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
                                                    : movement.status === 'Ready'
                                                        ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                                                        : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                            )}>
                                                {movement.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Kanban View */}
            {viewMode === 'kanban' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Draft Column */}
                    <div>
                        <div className={cn(
                            "p-4 rounded-t-lg border-b-2 border-gray-400",
                            theme === 'dark' ? 'bg-slate-800' : 'bg-slate-100'
                        )}>
                            <h3 className={cn("font-semibold text-sm", theme === 'dark' ? 'text-white' : 'text-slate-900')}>
                                Draft
                            </h3>
                            <p className={cn("text-xs mt-0.5", theme === 'dark' ? 'text-slate-400' : 'text-slate-500')}>
                                {draftMovements.length} items
                            </p>
                        </div>
                        <div className={cn("p-4 min-h-[200px]", theme === 'dark' ? 'bg-slate-900/50' : 'bg-slate-50')}>
                            {draftMovements.map(movement => (
                                <MovementCard key={movement.id} movement={movement} />
                            ))}
                            {draftMovements.length === 0 && (
                                <p className={cn("text-center text-sm py-8", theme === 'dark' ? 'text-slate-500' : 'text-slate-400')}>
                                    No draft movements
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Ready Column */}
                    <div>
                        <div className={cn(
                            "p-4 rounded-t-lg border-b-2 border-blue-500",
                            theme === 'dark' ? 'bg-slate-800' : 'bg-slate-100'
                        )}>
                            <h3 className={cn("font-semibold text-sm", theme === 'dark' ? 'text-white' : 'text-slate-900')}>
                                Ready
                            </h3>
                            <p className={cn("text-xs mt-0.5", theme === 'dark' ? 'text-slate-400' : 'text-slate-500')}>
                                {readyMovements.length} items
                            </p>
                        </div>
                        <div className={cn("p-4 min-h-[200px]", theme === 'dark' ? 'bg-slate-900/50' : 'bg-slate-50')}>
                            {readyMovements.map(movement => (
                                <MovementCard key={movement.id} movement={movement} />
                            ))}
                            {readyMovements.length === 0 && (
                                <p className={cn("text-center text-sm py-8", theme === 'dark' ? 'text-slate-500' : 'text-slate-400')}>
                                    No ready movements
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Done Column */}
                    <div>
                        <div className={cn(
                            "p-4 rounded-t-lg border-b-2 border-green-500",
                            theme === 'dark' ? 'bg-slate-800' : 'bg-slate-100'
                        )}>
                            <h3 className={cn("font-semibold text-sm", theme === 'dark' ? 'text-white' : 'text-slate-900')}>
                                Done
                            </h3>
                            <p className={cn("text-xs mt-0.5", theme === 'dark' ? 'text-slate-400' : 'text-slate-500')}>
                                {doneMovements.length} items
                            </p>
                        </div>
                        <div className={cn("p-4 min-h-[200px]", theme === 'dark' ? 'bg-slate-900/50' : 'bg-slate-50')}>
                            {doneMovements.map(movement => (
                                <MovementCard key={movement.id} movement={movement} />
                            ))}
                            {doneMovements.length === 0 && (
                                <p className={cn("text-center text-sm py-8", theme === 'dark' ? 'text-slate-500' : 'text-slate-400')}>
                                    No completed movements
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Empty State */}
            {filteredMovements.length === 0 && (
                <div className={cn(
                    "text-center py-12 rounded-lg border",
                    theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'
                )}>
                    <p className={cn("text-sm", theme === 'dark' ? 'text-slate-400' : 'text-slate-500')}>
                        No movements found
                    </p>
                </div>
            )}


        </div>
    )
}
