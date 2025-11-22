"use client"

import { useStock } from "@/context/StockContext"
import { cn } from "@/lib/utils"
import { ArrowRightLeft, ClipboardCheck, Kanban, LayoutList, PackageMinus, PackagePlus, Plus, Search } from "lucide-react"
import { useState } from "react"
import { AdjustmentsListView } from "./AdjustmentsListView"
import { DeliveriesKanbanView } from "./DeliveriesKanbanView"
import { DeliveriesListView } from "./DeliveriesListView"
import { OperationFormModal } from "./OperationFormModal"
import { ReceiptsKanbanView } from "./ReceiptsKanbanView"
import { ReceiptsListView } from "./ReceiptsListView"
import { TransfersListView } from "./TransfersListView"

export function OperationsView() {
    const { theme, activeOperationTab, setActiveOperationTab } = useStock()
    const [viewMode, setViewMode] = useState('list')
    const [searchTerm, setSearchTerm] = useState("")

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedOperation, setSelectedOperation] = useState(null)
    const [modalType, setModalType] = useState('RECEIPT')

    const handleNewOperation = () => {
        setSelectedOperation(null)
        let type = 'RECEIPT'
        if (activeOperationTab === 'deliveries') type = 'DELIVERY'
        else if (activeOperationTab === 'transfers') type = 'TRANSFER'
        else if (activeOperationTab === 'adjustments') type = 'ADJUSTMENT'

        setModalType(type)
        setIsModalOpen(true)
    }

    const handleOperationClick = (operation) => {
        setSelectedOperation(operation)
        setModalType(operation.type)
        setIsModalOpen(true)
    }

    const tabs = [
        { id: 'receipts', label: 'Receipts', icon: PackagePlus, description: 'Incoming stock' },
        { id: 'deliveries', label: 'Deliveries', icon: PackageMinus, description: 'Outgoing stock' },
        { id: 'transfers', label: 'Internal Transfers', icon: ArrowRightLeft, description: 'Move stock' },
        { id: 'adjustments', label: 'Stock Adjustments', icon: ClipboardCheck, description: 'Stock corrections' }
    ]

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className={cn("text-2xl font-bold tracking-tight", theme === 'dark' ? "text-white" : "text-slate-900")}>
                    Operations
                </h1>
                <p className={cn("text-sm mt-1", theme === 'dark' ? "text-slate-400" : "text-slate-500")}>
                    Manage inventory movements and transactions
                </p>
            </div>

            {/* Tab Navigation */}
            <div className={cn(
                "border-b",
                theme === 'dark' ? 'border-slate-800' : 'border-slate-200'
            )}>
                <div className="flex gap-8 overflow-x-auto">
                    {tabs.map(tab => {
                        const Icon = tab.icon
                        const isActive = activeOperationTab === tab.id
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveOperationTab(tab.id)}
                                className={cn(
                                    "flex items-center gap-2 pb-4 border-b-2 transition-colors group whitespace-nowrap",
                                    isActive
                                        ? "border-blue-600 text-blue-600 dark:text-blue-400"
                                        : "border-transparent hover:border-slate-300 dark:hover:border-slate-600",
                                    theme === 'dark' ? 'text-slate-400 hover:text-slate-300' : 'text-slate-600 hover:text-slate-900'
                                )}
                            >
                                <Icon className={cn(
                                    "h-5 w-5",
                                    isActive && "text-blue-600 dark:text-blue-400"
                                )} />
                                <div className="text-left">
                                    <div className={cn(
                                        "font-semibold text-sm",
                                        isActive && "text-blue-600 dark:text-blue-400"
                                    )}>
                                        {tab.label}
                                    </div>
                                    <div className={cn(
                                        "text-xs",
                                        theme === 'dark' ? 'text-slate-500' : 'text-slate-400'
                                    )}>
                                        {tab.description}
                                    </div>
                                </div>
                            </button>
                        )
                    })}
                </div>
            </div>

            {/* Search & Actions Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                {/* Search */}
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search by reference..."
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

                {/* View Switcher */}
                {activeOperationTab !== 'adjustments' && activeOperationTab !== 'transfers' && (
                    <div className={cn(
                        "flex items-center p-1 rounded-lg border",
                        theme === 'dark' ? "bg-slate-900 border-slate-700" : "bg-white border-slate-200"
                    )}>
                        <button
                            onClick={() => setViewMode('list')}
                            className={cn(
                                "p-1.5 rounded-md transition-colors",
                                viewMode === 'list'
                                    ? (theme === 'dark' ? "bg-slate-800 text-white" : "bg-slate-100 text-slate-900")
                                    : "text-slate-400 hover:text-slate-600"
                            )}
                        >
                            <LayoutList className="h-4 w-4" />
                        </button>
                        <button
                            onClick={() => setViewMode('kanban')}
                            className={cn(
                                "p-1.5 rounded-md transition-colors",
                                viewMode === 'kanban'
                                    ? (theme === 'dark' ? "bg-slate-800 text-white" : "bg-slate-100 text-slate-900")
                                    : "text-slate-400 hover:text-slate-600"
                            )}
                        >
                            <Kanban className="h-4 w-4" />
                        </button>
                    </div>
                )}

                {/* New Operation Button */}
                <button
                    onClick={handleNewOperation}
                    className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 shadow-sm transition-colors"
                >
                    <Plus className="h-4 w-4" />
                    New {tabs.find(t => t.id === activeOperationTab)?.label.replace('Internal ', '').replace('Stock ', '')}
                </button>
            </div>

            {/* Tab Content */}
            {activeOperationTab === 'receipts' && (
                viewMode === 'list'
                    ? <ReceiptsListView searchTerm={searchTerm} onOperationClick={handleOperationClick} />
                    : <ReceiptsKanbanView searchTerm={searchTerm} onOperationClick={handleOperationClick} />
            )}
            {activeOperationTab === 'deliveries' && (
                viewMode === 'list'
                    ? <DeliveriesListView searchTerm={searchTerm} onOperationClick={handleOperationClick} />
                    : <DeliveriesKanbanView searchTerm={searchTerm} onOperationClick={handleOperationClick} />
            )}
            {activeOperationTab === 'transfers' && (
                <TransfersListView searchTerm={searchTerm} onOperationClick={handleOperationClick} />
            )}
            {activeOperationTab === 'adjustments' && (
                <AdjustmentsListView searchTerm={searchTerm} onOperationClick={handleOperationClick} />
            )}

            {/* Modal */}
            <OperationFormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                operation={selectedOperation}
                type={modalType}
            />
        </div>
    )
}
