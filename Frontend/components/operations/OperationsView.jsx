"use client"

import { useStock } from "@/context/StockContext"
import { cn } from "@/lib/utils"
import { ArrowDownLeft, ArrowUpRight, CheckCircle, RefreshCw } from "lucide-react"
import { useState } from "react"

export function OperationsView() {
    const { products, addMovement, theme } = useStock()
    const [activeTab, setActiveTab] = useState('receipts')
    const [formData, setFormData] = useState({
        productId: "",
        quantity: "",
        reference: ""
    })
    const [successMsg, setSuccessMsg] = useState("")

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!formData.productId || !formData.quantity) return

        const type = activeTab === 'receipts' ? 'IN' : activeTab === 'deliveries' ? 'OUT' : 'ADJ'

        addMovement({
            type,
            productId: formData.productId,
            quantity: parseInt(formData.quantity),
            reference: formData.reference || `AUTO-${Date.now().toString().slice(-6)}`
        })

        setSuccessMsg(`${type === 'IN' ? 'Receipt' : type === 'OUT' ? 'Delivery' : 'Adjustment'} processed successfully!`)
        setFormData({ productId: "", quantity: "", reference: "" })

        setTimeout(() => setSuccessMsg(""), 3000)
    }

    return (
        <div className="space-y-6 max-w-2xl mx-auto">
            <div className="text-center">
                <h1 className={cn("text-2xl font-bold tracking-tight", theme === 'dark' ? "text-white" : "text-slate-900")}>Operations Center</h1>
                <p className={cn("text-sm", theme === 'dark' ? "text-slate-400" : "text-slate-500")}>Manage incoming and outgoing stock movements.</p>
            </div>

            {/* Tabs */}
            <div className="flex rounded-lg bg-slate-100 p-1 dark:bg-slate-800">
                <button
                    onClick={() => setActiveTab('receipts')}
                    className={cn(
                        "flex-1 flex items-center justify-center gap-2 rounded-md py-2 text-sm font-medium transition-all",
                        activeTab === 'receipts'
                            ? "bg-white text-blue-600 shadow-sm dark:bg-slate-700 dark:text-blue-400"
                            : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
                    )}
                >
                    <ArrowDownLeft className="h-4 w-4" />
                    Receipts (In)
                </button>
                <button
                    onClick={() => setActiveTab('deliveries')}
                    className={cn(
                        "flex-1 flex items-center justify-center gap-2 rounded-md py-2 text-sm font-medium transition-all",
                        activeTab === 'deliveries'
                            ? "bg-white text-blue-600 shadow-sm dark:bg-slate-700 dark:text-blue-400"
                            : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
                    )}
                >
                    <ArrowUpRight className="h-4 w-4" />
                    Deliveries (Out)
                </button>
                <button
                    onClick={() => setActiveTab('adjustments')}
                    className={cn(
                        "flex-1 flex items-center justify-center gap-2 rounded-md py-2 text-sm font-medium transition-all",
                        activeTab === 'adjustments'
                            ? "bg-white text-blue-600 shadow-sm dark:bg-slate-700 dark:text-blue-400"
                            : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
                    )}
                >
                    <RefreshCw className="h-4 w-4" />
                    Adjustments
                </button>
            </div>

            {/* Form */}
            <div className={cn(
                "rounded-xl border p-6 shadow-sm",
                theme === 'dark' ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
            )}>
                <h2 className={cn("text-lg font-semibold mb-4", theme === 'dark' ? "text-white" : "text-slate-900")}>
                    {activeTab === 'receipts' ? "New Stock Receipt" : activeTab === 'deliveries' ? "New Delivery Order" : "Inventory Adjustment"}
                </h2>

                {successMsg && (
                    <div className="mb-4 p-3 rounded-md bg-green-50 text-green-700 flex items-center gap-2 text-sm dark:bg-green-900/30 dark:text-green-400">
                        <CheckCircle className="h-4 w-4" />
                        {successMsg}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className={cn("block text-sm font-medium mb-1", theme === 'dark' ? "text-slate-300" : "text-slate-700")}>Select Product</label>
                        <select
                            required
                            className={cn("w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-1", theme === 'dark' ? "bg-slate-800 border-slate-700 text-white focus:ring-blue-500" : "border-slate-300 focus:ring-blue-500")}
                            value={formData.productId}
                            onChange={e => setFormData({ ...formData, productId: e.target.value })}
                        >
                            <option value="">-- Choose Product --</option>
                            {products.map(p => (
                                <option key={p.id} value={p.id}>{p.name} (Current: {p.stock})</option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className={cn("block text-sm font-medium mb-1", theme === 'dark' ? "text-slate-300" : "text-slate-700")}>Quantity</label>
                            <input
                                required
                                type="number"
                                min="1"
                                className={cn("w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-1", theme === 'dark' ? "bg-slate-800 border-slate-700 text-white focus:ring-blue-500" : "border-slate-300 focus:ring-blue-500")}
                                value={formData.quantity}
                                onChange={e => setFormData({ ...formData, quantity: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className={cn("block text-sm font-medium mb-1", theme === 'dark' ? "text-slate-300" : "text-slate-700")}>Reference #</label>
                            <input
                                type="text"
                                placeholder="Optional (PO/Order ID)"
                                className={cn("w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-1", theme === 'dark' ? "bg-slate-800 border-slate-700 text-white focus:ring-blue-500" : "border-slate-300 focus:ring-blue-500")}
                                value={formData.reference}
                                onChange={e => setFormData({ ...formData, reference: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            className="w-full py-2.5 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors shadow-sm"
                        >
                            {activeTab === 'receipts' ? "Receive Stock" : activeTab === 'deliveries' ? "Process Delivery" : "Update Stock Level"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
