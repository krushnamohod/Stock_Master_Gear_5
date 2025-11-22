"use client"

import { useAuth } from "@/context/AuthContext"
import { useStock } from "@/context/StockContext"
import { cn } from "@/lib/utils"
import { AlertTriangle, Calendar, Check, ChevronRight, MapPin, Plus, Printer, Trash2, User, X } from "lucide-react"
import { useEffect, useState } from "react"

export function OperationFormModal({ isOpen, onClose, operation, type = 'RECEIPT' }) {
    const { currentUser } = useAuth()
    const {
        products,
        warehouses,
        addOperation,
        updateOperation,
        validateOperation,
        cancelOperation,
        checkAvailability,
        generateReference,
        theme
    } = useStock()

    const [formData, setFormData] = useState({
        reference: '',
        contact: '',
        customerName: '',
        scheduledDate: new Date().toISOString().split('T')[0],
        responsible: '',
        sourceLocation: '',
        destLocation: '',
        status: 'Draft',
        productLines: []
    })

    const [errors, setErrors] = useState({})

    // Initialize form
    useEffect(() => {
        if (isOpen) {
            if (operation) {
                setFormData({
                    ...operation,
                    scheduledDate: operation.scheduledDate.split('T')[0],
                    customerName: operation.customerName || ''
                })
            } else {
                // New Operation Defaults
                const isReceipt = type === 'RECEIPT'
                const isTransfer = type === 'TRANSFER'
                const isAdjustment = type === 'ADJUSTMENT'

                setFormData({
                    reference: generateReference(type),
                    contact: '',
                    customerName: '',
                    scheduledDate: new Date().toISOString().split('T')[0],
                    responsible: currentUser?.loginId || 'Unknown',
                    sourceLocation: isReceipt ? 'Vendor' : 'Warehouse A',
                    destLocation: isReceipt ? 'Warehouse A' : isTransfer ? 'Store B' : isAdjustment ? '' : 'Customer',
                    status: 'Draft',
                    productLines: [],
                    type: type
                })
            }
            setErrors({})
        }
    }, [isOpen, operation, type, currentUser, generateReference])

    if (!isOpen) return null

    const isReadOnly = formData.status === 'Done' || formData.status === 'Cancelled'

    // Helper to get theoretical qty
    const getTheoreticalQty = (productId, locationName) => {
        const warehouse = warehouses.find(w => w.name === locationName)
        if (!warehouse) return 0
        const product = products.find(p => p.id === productId)
        return product?.stockByLocation[warehouse.id] || 0
    }

    const handleAddLine = () => {
        setFormData(prev => ({
            ...prev,
            productLines: [
                ...prev.productLines,
                { productId: '', productName: '', demandQty: 1, doneQty: 0, theoreticalQty: 0, countedQty: 0 }
            ]
        }))
    }

    const handleRemoveLine = (index) => {
        setFormData(prev => ({
            ...prev,
            productLines: prev.productLines.filter((_, i) => i !== index)
        }))
    }

    const handleLineChange = (index, field, value) => {
        setFormData(prev => {
            const newLines = [...prev.productLines]
            if (field === 'productId') {
                const product = products.find(p => p.id === parseInt(value))
                const theoretical = type === 'ADJUSTMENT' ? getTheoreticalQty(parseInt(value), prev.sourceLocation) : 0

                newLines[index] = {
                    ...newLines[index],
                    productId: parseInt(value),
                    productName: product ? product.name : '',
                    theoreticalQty: theoretical,
                    countedQty: theoretical // Default to theoretical
                }
            } else {
                newLines[index] = { ...newLines[index], [field]: value }
            }
            return { ...prev, productLines: newLines }
        })
    }

    const handleSourceLocationChange = (e) => {
        const newLocation = e.target.value
        setFormData(prev => {
            const newLines = prev.productLines.map(line => {
                if (type === 'ADJUSTMENT' && line.productId) {
                    const theoretical = getTheoreticalQty(line.productId, newLocation)
                    return { ...line, theoreticalQty: theoretical, countedQty: theoretical }
                }
                return line
            })
            return { ...prev, sourceLocation: newLocation, productLines: newLines }
        })
    }

    const handleMarkAsTodo = () => {
        // Check availability for Delivery and Transfer
        let newStatus = 'Ready'
        if (type === 'DELIVERY' || type === 'TRANSFER') {
            const { isAvailable } = checkAvailability(formData)
            if (!isAvailable) {
                newStatus = 'Waiting'
            }
        }

        if (operation) {
            updateOperation(operation.id, { ...formData, status: newStatus })
            setFormData(prev => ({ ...prev, status: newStatus }))
        } else {
            const newOp = { ...formData, status: newStatus }
            addOperation(newOp)
            onClose()
        }
    }

    const handleValidate = () => {
        if (operation) {
            const updatedLines = formData.productLines.map(line => ({
                ...line,
                doneQty: line.doneQty || line.demandQty
            }))
            const updatedOp = { ...formData, productLines: updatedLines }

            // Check availability before validating
            if (type === 'DELIVERY' || type === 'TRANSFER') {
                const { isAvailable, missingLines } = checkAvailability(updatedOp)
                if (!isAvailable) {
                    alert(`Insufficient stock for: ${missingLines.map(l => l.productName).join(', ')}`)
                    return
                }
            }

            validateOperation(operation.id, updatedOp)
            setFormData(prev => ({ ...prev, status: 'Done', productLines: updatedLines }))
            onClose()
        }
    }

    const handlePrint = () => {
        window.print()
    }

    const StatusBreadcrumb = () => (
        <div className="flex items-center gap-2 text-sm">
            {['Draft', 'Waiting', 'Ready', 'Done'].map((step, i, arr) => {
                // Skip 'Waiting' if not relevant
                if ((type !== 'DELIVERY' && type !== 'TRANSFER') && step === 'Waiting') return null

                return (
                    <div key={step} className="flex items-center">
                        <span className={cn(
                            "px-3 py-1 rounded-full font-medium border",
                            formData.status === step
                                ? "bg-blue-600 text-white border-blue-600"
                                : (['Draft', 'Waiting', 'Ready', 'Done'].indexOf(formData.status) > ['Draft', 'Waiting', 'Ready', 'Done'].indexOf(step))
                                    ? "bg-green-50 text-green-600 border-green-200"
                                    : "bg-slate-100 text-slate-500 border-slate-200 dark:bg-slate-800 dark:border-slate-700"
                        )}>
                            {step}
                        </span>
                        {i < arr.length - 1 && (
                            ((type === 'DELIVERY' || type === 'TRANSFER') || step !== 'Draft') &&
                            <ChevronRight className="h-4 w-4 text-slate-400 mx-1" />
                        )}
                    </div>
                )
            })}
        </div>
    )

    const getLineStockStatus = (line) => {
        if (type !== 'DELIVERY' && type !== 'TRANSFER') return { isInsufficient: false, stock: 0 }
        const warehouse = warehouses.find(w => w.name === formData.sourceLocation)
        if (!warehouse) return { isInsufficient: false, stock: 0 }

        const product = products.find(p => p.id === line.productId)
        const stock = product?.stockByLocation[warehouse.id] || 0

        return {
            isInsufficient: stock < line.demandQty,
            stock
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className={cn(
                "w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-xl shadow-2xl flex flex-col",
                theme === 'dark' ? "bg-slate-950 border border-slate-800" : "bg-white"
            )}>
                {/* Header */}
                <div className={cn(
                    "flex items-center justify-between px-6 py-4 border-b",
                    theme === 'dark' ? "border-slate-800" : "border-slate-100"
                )}>
                    <div className="flex items-center gap-4">
                        <h2 className={cn("text-xl font-bold font-mono", theme === 'dark' ? "text-blue-400" : "text-blue-600")}>
                            {formData.reference}
                        </h2>
                        <StatusBreadcrumb />
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-500">
                        <X className="h-6 w-6" />
                    </button>
                </div>

                {/* Toolbar */}
                <div className={cn(
                    "px-6 py-3 border-b flex gap-3",
                    theme === 'dark' ? "bg-slate-900/50 border-slate-800" : "bg-slate-50 border-slate-100"
                )}>
                    {formData.status === 'Draft' && (
                        <>
                            <button
                                onClick={handleMarkAsTodo}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
                            >
                                {type === 'ADJUSTMENT' ? 'Start Inventory' : 'Mark as Todo'}
                            </button>
                            <button
                                onClick={onClose}
                                className="px-4 py-2 text-slate-600 hover:bg-slate-200 rounded-lg text-sm font-medium dark:text-slate-300 dark:hover:bg-slate-800"
                            >
                                Cancel
                            </button>
                        </>
                    )}
                    {(formData.status === 'Ready' || formData.status === 'Waiting') && (
                        <>
                            <button
                                onClick={handleValidate}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 flex items-center gap-2"
                            >
                                <Check className="h-4 w-4" /> {type === 'ADJUSTMENT' ? 'Apply Adjustment' : 'Validate'}
                            </button>
                            <button
                                onClick={() => cancelOperation(operation.id)}
                                className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg text-sm font-medium dark:hover:bg-red-900/20"
                            >
                                Cancel
                            </button>
                            {formData.status === 'Waiting' && (
                                <div className="flex items-center gap-2 text-amber-600 text-sm font-medium ml-auto">
                                    <AlertTriangle className="h-4 w-4" />
                                    Waiting for stock
                                </div>
                            )}
                        </>
                    )}
                    {formData.status === 'Done' && (
                        <button
                            onClick={handlePrint}
                            className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 flex items-center gap-2 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                        >
                            <Printer className="h-4 w-4" /> Print
                        </button>
                    )}
                </div>

                {/* Form Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-8">
                    {/* Top Grid */}
                    <div className="grid grid-cols-2 gap-8">
                        <div className="space-y-4">
                            {type !== 'ADJUSTMENT' && (
                                <div>
                                    <label className="block text-sm font-medium text-slate-500 mb-1">
                                        {type === 'RECEIPT' ? 'Receive From' : type === 'DELIVERY' ? 'Customer' : 'Contact'}
                                    </label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                        {type === 'DELIVERY' ? (
                                            <input
                                                type="text"
                                                value={formData.customerName}
                                                onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                                                disabled={isReadOnly}
                                                className={cn(
                                                    "w-full pl-9 pr-4 py-2 rounded-lg border bg-transparent outline-none focus:ring-2 focus:ring-blue-500",
                                                    errors.contact ? "border-red-500" : (theme === 'dark' ? "border-slate-700" : "border-slate-200")
                                                )}
                                                placeholder="e.g. Acme Corporation"
                                            />
                                        ) : (
                                            <input
                                                type="text"
                                                value={formData.contact}
                                                onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                                                disabled={isReadOnly}
                                                className={cn(
                                                    "w-full pl-9 pr-4 py-2 rounded-lg border bg-transparent outline-none focus:ring-2 focus:ring-blue-500",
                                                    errors.contact ? "border-red-500" : (theme === 'dark' ? "border-slate-700" : "border-slate-200")
                                                )}
                                                placeholder="e.g. Tech Supplies Inc."
                                            />
                                        )}
                                    </div>
                                </div>
                            )}

                            {type === 'DELIVERY' && (
                                <div>
                                    <label className="block text-sm font-medium text-slate-500 mb-1">
                                        Delivery Person
                                    </label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                        <input
                                            type="text"
                                            value={formData.contact}
                                            onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                                            disabled={isReadOnly}
                                            className={cn(
                                                "w-full pl-9 pr-4 py-2 rounded-lg border bg-transparent outline-none focus:ring-2 focus:ring-blue-500",
                                                theme === 'dark' ? "border-slate-700" : "border-slate-200"
                                            )}
                                            placeholder="e.g. John Driver"
                                        />
                                    </div>
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-slate-500 mb-1">
                                    {type === 'RECEIPT' ? 'Destination Warehouse' : type === 'ADJUSTMENT' ? 'Location' : 'Source Warehouse'}
                                </label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                    <select
                                        value={type === 'RECEIPT' ? formData.destLocation : formData.sourceLocation}
                                        onChange={type === 'ADJUSTMENT' ? handleSourceLocationChange : (e) => setFormData({
                                            ...formData,
                                            [type === 'RECEIPT' ? 'destLocation' : 'sourceLocation']: e.target.value
                                        })}
                                        disabled={isReadOnly}
                                        className={cn(
                                            "w-full pl-9 pr-4 py-2 rounded-lg border bg-transparent outline-none focus:ring-2 focus:ring-blue-500 appearance-none",
                                            theme === 'dark' ? "border-slate-700 bg-slate-900 text-slate-200" : "border-slate-200 bg-slate-50 text-slate-900"
                                        )}
                                    >
                                        {warehouses.map(w => (
                                            <option key={w.id} value={w.name}>{w.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {(type === 'TRANSFER') && (
                                <div>
                                    <label className="block text-sm font-medium text-slate-500 mb-1">
                                        Destination Warehouse
                                    </label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                        <select
                                            value={formData.destLocation}
                                            onChange={(e) => setFormData({ ...formData, destLocation: e.target.value })}
                                            disabled={isReadOnly}
                                            className={cn(
                                                "w-full pl-9 pr-4 py-2 rounded-lg border bg-transparent outline-none focus:ring-2 focus:ring-blue-500 appearance-none",
                                                theme === 'dark' ? "border-slate-700 bg-slate-900 text-slate-200" : "border-slate-200 bg-slate-50 text-slate-900"
                                            )}
                                        >
                                            {warehouses.map(w => (
                                                <option key={w.id} value={w.name}>{w.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-500 mb-1">
                                    Scheduled Date
                                </label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                    <input
                                        type="date"
                                        value={formData.scheduledDate}
                                        onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                                        disabled={isReadOnly}
                                        className={cn(
                                            "w-full pl-9 pr-4 py-2 rounded-lg border bg-transparent outline-none focus:ring-2 focus:ring-blue-500",
                                            theme === 'dark' ? "border-slate-700" : "border-slate-200"
                                        )}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-500 mb-1">
                                    {type === 'DELIVERY' ? 'Created By' : 'Responsible'}
                                </label>
                                <input
                                    type="text"
                                    value={formData.responsible}
                                    readOnly
                                    className={cn(
                                        "w-full px-4 py-2 rounded-lg border bg-slate-50 text-slate-600 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-400"
                                    )}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Product Lines */}
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className={cn("font-semibold", theme === 'dark' ? "text-slate-200" : "text-slate-900")}>
                                Product Lines
                            </h3>
                            {!isReadOnly && (
                                <button
                                    onClick={handleAddLine}
                                    className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                                >
                                    <Plus className="h-4 w-4" /> Add Line
                                </button>
                            )}
                        </div>

                        <div className={cn(
                            "rounded-lg border overflow-hidden",
                            theme === 'dark' ? "border-slate-800" : "border-slate-200"
                        )}>
                            <table className="w-full text-sm text-left">
                                <thead className={cn(
                                    "text-xs uppercase font-medium",
                                    theme === 'dark' ? "bg-slate-900 text-slate-400" : "bg-slate-50 text-slate-500"
                                )}>
                                    <tr>
                                        <th className="px-4 py-3">Product</th>
                                        {type === 'ADJUSTMENT' ? (
                                            <>
                                                <th className="px-4 py-3 w-32">Theoretical</th>
                                                <th className="px-4 py-3 w-32">Counted</th>
                                            </>
                                        ) : (
                                            <>
                                                <th className="px-4 py-3 w-32">Demand</th>
                                                {formData.status === 'Done' && <th className="px-4 py-3 w-32">Done</th>}
                                            </>
                                        )}
                                        {!isReadOnly && <th className="px-4 py-3 w-16"></th>}
                                    </tr>
                                </thead>
                                <tbody className={cn("divide-y", theme === 'dark' ? "divide-slate-800" : "divide-slate-200")}>
                                    {formData.productLines.map((line, index) => {
                                        const { isInsufficient, stock } = getLineStockStatus(line)
                                        return (
                                            <tr key={index} className={cn(
                                                theme === 'dark' ? "bg-slate-950" : "bg-white",
                                                isInsufficient && "bg-red-50 dark:bg-red-900/20"
                                            )}>
                                                <td className="px-4 py-2">
                                                    {isReadOnly ? (
                                                        <span className={theme === 'dark' ? "text-slate-300" : "text-slate-900"}>
                                                            {line.productName}
                                                        </span>
                                                    ) : (
                                                        <div className="flex flex-col">
                                                            <select
                                                                value={line.productId}
                                                                onChange={(e) => handleLineChange(index, 'productId', e.target.value)}
                                                                className={cn(
                                                                    "w-full p-2 rounded border bg-transparent outline-none",
                                                                    theme === 'dark' ? "border-slate-700" : "border-slate-200"
                                                                )}
                                                            >
                                                                <option value="">Select Product</option>
                                                                {products.map(p => (
                                                                    <option key={p.id} value={p.id}>
                                                                        [{p.sku}] {p.name}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                            {(type === 'DELIVERY' || type === 'TRANSFER') && line.productId && (
                                                                <span className={cn(
                                                                    "text-xs mt-1",
                                                                    isInsufficient ? "text-red-600" : "text-slate-400"
                                                                )}>
                                                                    Available: {stock}
                                                                </span>
                                                            )}
                                                        </div>
                                                    )}
                                                </td>

                                                {type === 'ADJUSTMENT' ? (
                                                    <>
                                                        <td className="px-4 py-2">
                                                            <input
                                                                type="number"
                                                                value={line.theoreticalQty}
                                                                readOnly
                                                                className={cn(
                                                                    "w-full p-2 rounded border bg-slate-50 text-slate-500 outline-none",
                                                                    theme === 'dark' ? "border-slate-700 bg-slate-900" : "border-slate-200"
                                                                )}
                                                            />
                                                        </td>
                                                        <td className="px-4 py-2">
                                                            <input
                                                                type="number"
                                                                value={line.countedQty}
                                                                onChange={(e) => handleLineChange(index, 'countedQty', parseInt(e.target.value) || 0)}
                                                                disabled={isReadOnly}
                                                                className={cn(
                                                                    "w-full p-2 rounded border bg-transparent outline-none focus:ring-2 focus:ring-blue-500",
                                                                    theme === 'dark' ? "border-slate-700" : "border-slate-200"
                                                                )}
                                                            />
                                                        </td>
                                                    </>
                                                ) : (
                                                    <>
                                                        <td className="px-4 py-2">
                                                            <input
                                                                type="number"
                                                                value={line.demandQty}
                                                                onChange={(e) => handleLineChange(index, 'demandQty', parseInt(e.target.value) || 0)}
                                                                disabled={isReadOnly}
                                                                className={cn(
                                                                    "w-full p-2 rounded border bg-transparent outline-none",
                                                                    theme === 'dark' ? "border-slate-700" : "border-slate-200",
                                                                    isInsufficient && "border-red-300 focus:ring-red-500"
                                                                )}
                                                            />
                                                        </td>
                                                        {formData.status === 'Done' && (
                                                            <td className="px-4 py-2">
                                                                <span className="font-medium text-green-600">{line.doneQty}</span>
                                                            </td>
                                                        )}
                                                    </>
                                                )}

                                                {!isReadOnly && (
                                                    <td className="px-4 py-2 text-center">
                                                        <button
                                                            onClick={() => handleRemoveLine(index)}
                                                            className="text-slate-400 hover:text-red-500"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </button>
                                                    </td>
                                                )}
                                            </tr>
                                        )
                                    })}
                                    {formData.productLines.length === 0 && (
                                        <tr>
                                            <td colSpan={type === 'ADJUSTMENT' ? 4 : 4} className="px-4 py-8 text-center text-slate-500">
                                                No products added. Click "Add Line" to start.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        {errors.lines && <p className="text-red-500 text-sm mt-2">{errors.lines}</p>}
                    </div>
                </div>
            </div>
        </div>
    )
}
