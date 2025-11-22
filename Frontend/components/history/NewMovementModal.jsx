"use client"

import { useStock } from '@/context/StockContext'
import { cn } from '@/lib/utils'
import { Plus, Save, Trash2, X } from 'lucide-react'
import { useState } from 'react'

export function NewMovementModal({ onClose, onSave }) {
    const { theme, products, warehouses } = useStock()

    const [formData, setFormData] = useState({
        reference: `REF-${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        type: 'IN',
        contact: '',
        fromWarehouse: '',
        toWarehouse: '',
        status: 'Draft',
        notes: ''
    })

    const [productEntries, setProductEntries] = useState([
        { productId: '', quantity: '' }
    ])

    const [errors, setErrors] = useState({})

    const validateForm = () => {
        const newErrors = {}

        if (!formData.reference.trim()) newErrors.reference = 'Reference is required'
        if (!formData.contact.trim()) newErrors.contact = 'Contact name is required'

        if (formData.type === 'OUT' && !formData.fromWarehouse) {
            newErrors.fromWarehouse = 'From warehouse is required for outgoing movements'
        }
        if (formData.type === 'IN' && !formData.toWarehouse) {
            newErrors.toWarehouse = 'To warehouse is required for incoming movements'
        }

        productEntries.forEach((entry, index) => {
            if (!entry.productId) {
                newErrors[`product_${index}`] = 'Product is required'
            }
            if (!entry.quantity || parseInt(entry.quantity) <= 0) {
                newErrors[`quantity_${index}`] = 'Valid quantity is required'
            }
        })

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        if (!validateForm()) return

        // Create movements for each product
        const movements = productEntries.map(entry => {
            const product = products.find(p => p.id === parseInt(entry.productId))
            return {
                ...formData,
                productId: parseInt(entry.productId),
                productName: product?.name || '',
                quantity: parseInt(entry.quantity)
            }
        })

        movements.forEach(movement => onSave(movement))
        onClose()
    }

    const addProductEntry = () => {
        setProductEntries([...productEntries, { productId: '', quantity: '' }])
    }

    const removeProductEntry = (index) => {
        if (productEntries.length > 1) {
            setProductEntries(productEntries.filter((_, i) => i !== index))
        }
    }

    const updateProductEntry = (index, field, value) => {
        const updated = [...productEntries]
        updated[index][field] = value
        setProductEntries(updated)
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
            <div
                className={cn(
                    "w-full max-w-2xl rounded-lg shadow-xl overflow-hidden",
                    theme === 'dark' ? 'bg-slate-900 border border-slate-800' : 'bg-white'
                )}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className={cn(
                    "flex items-center justify-between p-6 border-b",
                    theme === 'dark' ? 'border-slate-800' : 'border-slate-200'
                )}>
                    <h2 className={cn("text-xl font-bold", theme === 'dark' ? 'text-white' : 'text-slate-900')}>
                        New Stock Movement
                    </h2>
                    <button
                        onClick={onClose}
                        className={cn(
                            "p-2 rounded-lg transition-colors",
                            theme === 'dark' ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-600'
                        )}
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 max-h-[70vh] overflow-y-auto">
                    <div className="space-y-4">
                        {/* Reference & Date */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className={cn("block text-sm font-medium mb-1.5", theme === 'dark' ? 'text-slate-300' : 'text-slate-700')}>
                                    Reference Number *
                                </label>
                                <input
                                    type="text"
                                    value={formData.reference}
                                    onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
                                    className={cn(
                                        "w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 font-mono uppercase",
                                        theme === 'dark' ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-300',
                                        errors.reference && 'border-red-500'
                                    )}
                                    placeholder="REF-001"
                                />
                                {errors.reference && <p className="mt-1 text-xs text-red-500">{errors.reference}</p>}
                            </div>

                            <div>
                                <label className={cn("block text-sm font-medium mb-1.5", theme === 'dark' ? 'text-slate-300' : 'text-slate-700')}>
                                    Date *
                                </label>
                                <input
                                    type="date"
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    className={cn(
                                        "w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500",
                                        theme === 'dark' ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-300'
                                    )}
                                />
                            </div>
                        </div>

                        {/* Type & Status */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className={cn("block text-sm font-medium mb-1.5", theme === 'dark' ? 'text-slate-300' : 'text-slate-700')}>
                                    Movement Type *
                                </label>
                                <select
                                    value={formData.type}
                                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                    className={cn(
                                        "w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500",
                                        theme === 'dark' ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-300'
                                    )}
                                >
                                    <option value="IN">Incoming (Receipt)</option>
                                    <option value="OUT">Outgoing (Delivery)</option>
                                    <option value="ADJ">Adjustment</option>
                                </select>
                            </div>

                            <div>
                                <label className={cn("block text-sm font-medium mb-1.5", theme === 'dark' ? 'text-slate-300' : 'text-slate-700')}>
                                    Status *
                                </label>
                                <select
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                    className={cn(
                                        "w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500",
                                        theme === 'dark' ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-300'
                                    )}
                                >
                                    <option value="Draft">Draft</option>
                                    <option value="Ready">Ready</option>
                                    <option value="Done">Done</option>
                                </select>
                            </div>
                        </div>

                        {/* Contact */}
                        <div>
                            <label className={cn("block text-sm font-medium mb-1.5", theme === 'dark' ? 'text-slate-300' : 'text-slate-700')}>
                                Contact Name *
                            </label>
                            <input
                                type="text"
                                value={formData.contact}
                                onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                                className={cn(
                                    "w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500",
                                    theme === 'dark' ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-300',
                                    errors.contact && 'border-red-500'
                                )}
                                placeholder="Supplier/Customer name"
                            />
                            {errors.contact && <p className="mt-1 text-xs text-red-500">{errors.contact}</p>}
                        </div>

                        {/* From / To Warehouses */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className={cn("block text-sm font-medium mb-1.5", theme === 'dark' ? 'text-slate-300' : 'text-slate-700')}>
                                    From Warehouse {formData.type === 'OUT' && '*'}
                                </label>
                                <select
                                    value={formData.fromWarehouse}
                                    onChange={(e) => setFormData({ ...formData, fromWarehouse: e.target.value })}
                                    disabled={formData.type === 'IN'}
                                    className={cn(
                                        "w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500",
                                        theme === 'dark' ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-300',
                                        formData.type === 'IN' && 'opacity-50 cursor-not-allowed',
                                        errors.fromWarehouse && 'border-red-500'
                                    )}
                                >
                                    <option value="">Select warehouse</option>
                                    {warehouses.map(w => (
                                        <option key={w.id} value={w.name}>{w.name}</option>
                                    ))}
                                </select>
                                {errors.fromWarehouse && <p className="mt-1 text-xs text-red-500">{errors.fromWarehouse}</p>}
                            </div>

                            <div>
                                <label className={cn("block text-sm font-medium mb-1.5", theme === 'dark' ? 'text-slate-300' : 'text-slate-700')}>
                                    To Warehouse {formData.type === 'IN' && '*'}
                                </label>
                                <select
                                    value={formData.toWarehouse}
                                    onChange={(e) => setFormData({ ...formData, toWarehouse: e.target.value })}
                                    disabled={formData.type === 'OUT'}
                                    className={cn(
                                        "w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500",
                                        theme === 'dark' ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-300',
                                        formData.type === 'OUT' && 'opacity-50 cursor-not-allowed',
                                        errors.toWarehouse && 'border-red-500'
                                    )}
                                >
                                    <option value="">Select warehouse</option>
                                    {warehouses.map(w => (
                                        <option key={w.id} value={w.name}>{w.name}</option>
                                    ))}
                                </select>
                                {errors.toWarehouse && <p className="mt-1 text-xs text-red-500">{errors.toWarehouse}</p>}
                            </div>
                        </div>

                        {/* Products */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className={cn("text-sm font-medium", theme === 'dark' ? 'text-slate-300' : 'text-slate-700')}>
                                    Products *
                                </label>
                                <button
                                    type="button"
                                    onClick={addProductEntry}
                                    className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                                >
                                    <Plus className="h-3 w-3" />
                                    Add Product
                                </button>
                            </div>

                            <div className="space-y-2">
                                {productEntries.map((entry, index) => (
                                    <div key={index} className="flex items-start gap-2">
                                        <div className="flex-1">
                                            <select
                                                value={entry.productId}
                                                onChange={(e) => updateProductEntry(index, 'productId', e.target.value)}
                                                className={cn(
                                                    "w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500",
                                                    theme === 'dark' ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-300',
                                                    errors[`product_${index}`] && 'border-red-500'
                                                )}
                                            >
                                                <option value="">Select product</option>
                                                {products.map(p => (
                                                    <option key={p.id} value={p.id}>{p.name} ({p.sku})</option>
                                                ))}
                                            </select>
                                            {errors[`product_${index}`] && <p className="mt-1 text-xs text-red-500">{errors[`product_${index}`]}</p>}
                                        </div>

                                        <div className="w-32">
                                            <input
                                                type="number"
                                                min="1"
                                                value={entry.quantity}
                                                onChange={(e) => updateProductEntry(index, 'quantity', e.target.value)}
                                                placeholder="Qty"
                                                className={cn(
                                                    "w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500",
                                                    theme === 'dark' ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-300',
                                                    errors[`quantity_${index}`] && 'border-red-500'
                                                )}
                                            />
                                            {errors[`quantity_${index}`] && <p className="mt-1 text-xs text-red-500">{errors[`quantity_${index}`]}</p>}
                                        </div>

                                        {productEntries.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeProductEntry(index)}
                                                className={cn(
                                                    "p-2 rounded-lg transition-colors mt-0.5",
                                                    theme === 'dark' ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-600'
                                                )}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Notes */}
                        <div>
                            <label className={cn("block text-sm font-medium mb-1.5", theme === 'dark' ? 'text-slate-300' : 'text-slate-700')}>
                                Notes
                            </label>
                            <textarea
                                value={formData.notes}
                                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                rows={3}
                                className={cn(
                                    "w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500",
                                    theme === 'dark' ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-300'
                                )}
                                placeholder="Additional notes or comments..."
                            />
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t border-slate-200 dark:border-slate-800">
                        <button
                            type="button"
                            onClick={onClose}
                            className={cn(
                                "px-4 py-2 text-sm font-medium rounded-lg transition-colors",
                                theme === 'dark' ? 'text-slate-300 hover:bg-slate-800' : 'text-slate-700 hover:bg-slate-100'
                            )}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                        >
                            <Save className="h-4 w-4" />
                            Save Movement
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
