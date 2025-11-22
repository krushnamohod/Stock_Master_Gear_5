"use client"

import { useStock } from '@/context/StockContext'
import { cn } from '@/lib/utils'
import { Save, X } from 'lucide-react'
import { useEffect, useState } from 'react'

export function ProductFormModal({ product, onClose, onSave }) {
    const { theme, categories, warehouses } = useStock()
    const isEdit = Boolean(product)

    const [formData, setFormData] = useState({
        name: '',
        sku: '',
        category: categories[0]?.name || '',
        barcode: '',
        cost: '',
        price: '',
        reorderPoint: '',
        reorderQuantity: '',
        stockByLocation: {}
    })

    const [errors, setErrors] = useState({})

    // Initialize form data when editing
    useEffect(() => {
        if (product) {
            setFormData({
                name: product.name || '',
                sku: product.sku || '',
                category: product.category || '',
                barcode: product.barcode || '',
                cost: product.cost || '',
                price: product.price || '',
                reorderPoint: product.reorderPoint || '',
                reorderQuantity: product.reorderQuantity || '',
                stockByLocation: product.stockByLocation || {}
            })
        }
    }, [product])

    const validateForm = () => {
        const newErrors = {}

        if (!formData.name.trim()) newErrors.name = 'Product name is required'
        if (!formData.sku.trim()) newErrors.sku = 'SKU is required'
        if (!formData.cost || parseFloat(formData.cost) < 0) newErrors.cost = 'Valid cost is required'
        if (!formData.price || parseFloat(formData.price) < 0) newErrors.price = 'Valid price is required'
        if (parseFloat(formData.price) < parseFloat(formData.cost)) {
            newErrors.price = 'Price must be greater than or equal to cost'
        }
        if (!formData.reorderPoint || parseInt(formData.reorderPoint) < 0) {
            newErrors.reorderPoint = 'Valid reorder point is required'
        }
        if (!formData.reorderQuantity || parseInt(formData.reorderQuantity) < 0) {
            newErrors.reorderQuantity = 'Valid reorder quantity is required'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        if (!validateForm()) return

        const productData = {
            ...formData,
            cost: parseFloat(formData.cost),
            price: parseFloat(formData.price),
            reorderPoint: parseInt(formData.reorderPoint),
            reorderQuantity: parseInt(formData.reorderQuantity)
        }

        onSave(productData)
    }

    const handleStockChange = (warehouseId, value) => {
        setFormData(prev => ({
            ...prev,
            stockByLocation: {
                ...prev.stockByLocation,
                [warehouseId]: parseInt(value) || 0
            }
        }))
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
                        {isEdit ? 'Edit Product' : 'Add New Product'}
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
                        {/* Product Name */}
                        <div>
                            <label className={cn("block text-sm font-medium mb-1.5", theme === 'dark' ? 'text-slate-300' : 'text-slate-700')}>
                                Product Name *
                            </label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className={cn(
                                    "w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500",
                                    theme === 'dark' ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-300',
                                    errors.name && 'border-red-500'
                                )}
                                placeholder="Enter product name"
                            />
                            {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
                        </div>

                        {/* SKU & Category */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className={cn("block text-sm font-medium mb-1.5", theme === 'dark' ? 'text-slate-300' : 'text-slate-700')}>
                                    SKU *
                                </label>
                                <input
                                    type="text"
                                    value={formData.sku}
                                    onChange={(e) => setFormData({ ...formData, sku: e.target.value.toUpperCase() })}
                                    className={cn(
                                        "w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 font-mono uppercase",
                                        theme === 'dark' ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-300',
                                        errors.sku && 'border-red-500'
                                    )}
                                    placeholder="PROD-001"
                                />
                                {errors.sku && <p className="mt-1 text-xs text-red-500">{errors.sku}</p>}
                            </div>

                            <div>
                                <label className={cn("block text-sm font-medium mb-1.5", theme === 'dark' ? 'text-slate-300' : 'text-slate-700')}>
                                    Category
                                </label>
                                <select
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    className={cn(
                                        "w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500",
                                        theme === 'dark' ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-300'
                                    )}
                                >
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.name}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Barcode */}
                        <div>
                            <label className={cn("block text-sm font-medium mb-1.5", theme === 'dark' ? 'text-slate-300' : 'text-slate-700')}>
                                Barcode
                            </label>
                            <input
                                type="text"
                                value={formData.barcode}
                                onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                                className={cn(
                                    "w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 font-mono",
                                    theme === 'dark' ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-300'
                                )}
                                placeholder="1234567890123"
                                maxLength={13}
                            />
                        </div>

                        {/* Cost & Price */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className={cn("block text-sm font-medium mb-1.5", theme === 'dark' ? 'text-slate-300' : 'text-slate-700')}>
                                    Cost Price ($) *
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={formData.cost}
                                    onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                                    className={cn(
                                        "w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500",
                                        theme === 'dark' ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-300',
                                        errors.cost && 'border-red-500'
                                    )}
                                    placeholder="0.00"
                                />
                                {errors.cost && <p className="mt-1 text-xs text-red-500">{errors.cost}</p>}
                            </div>

                            <div>
                                <label className={cn("block text-sm font-medium mb-1.5", theme === 'dark' ? 'text-slate-300' : 'text-slate-700')}>
                                    Selling Price ($) *
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    className={cn(
                                        "w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500",
                                        theme === 'dark' ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-300',
                                        errors.price && 'border-red-500'
                                    )}
                                    placeholder="0.00"
                                />
                                {errors.price && <p className="mt-1 text-xs text-red-500">{errors.price}</p>}
                                {formData.cost && formData.price && parseFloat(formData.price) > parseFloat(formData.cost) && (
                                    <p className="mt-1 text-xs text-green-600 dark:text-green-400">
                                        Margin: {((parseFloat(formData.price) - parseFloat(formData.cost)) / parseFloat(formData.price) * 100).toFixed(1)}%
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Reorder Settings */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className={cn("block text-sm font-medium mb-1.5", theme === 'dark' ? 'text-slate-300' : 'text-slate-700')}>
                                    Reorder Point *
                                </label>
                                <input
                                    type="number"
                                    value={formData.reorderPoint}
                                    onChange={(e) => setFormData({ ...formData, reorderPoint: e.target.value })}
                                    className={cn(
                                        "w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500",
                                        theme === 'dark' ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-300',
                                        errors.reorderPoint && 'border-red-500'
                                    )}
                                    placeholder="10"
                                />
                                {errors.reorderPoint && <p className="mt-1 text-xs text-red-500">{errors.reorderPoint}</p>}
                                <p className={cn("mt-1 text-xs", theme === 'dark' ? 'text-slate-400' : 'text-slate-500')}>
                                    Minimum stock before alert
                                </p>
                            </div>

                            <div>
                                <label className={cn("block text-sm font-medium mb-1.5", theme === 'dark' ? 'text-slate-300' : 'text-slate-700')}>
                                    Reorder Quantity *
                                </label>
                                <input
                                    type="number"
                                    value={formData.reorderQuantity}
                                    onChange={(e) => setFormData({ ...formData, reorderQuantity: e.target.value })}
                                    className={cn(
                                        "w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500",
                                        theme === 'dark' ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-300',
                                        errors.reorderQuantity && 'border-red-500'
                                    )}
                                    placeholder="20"
                                />
                                {errors.reorderQuantity && <p className="mt-1 text-xs text-red-500">{errors.reorderQuantity}</p>}
                                <p className={cn("mt-1 text-xs", theme === 'dark' ? 'text-slate-400' : 'text-slate-500')}>
                                    Suggested reorder amount
                                </p>
                            </div>
                        </div>

                        {/* Stock by Location */}
                        <div>
                            <label className={cn("block text-sm font-medium mb-2", theme === 'dark' ? 'text-slate-300' : 'text-slate-700')}>
                                Initial Stock by Location
                            </label>
                            <div className="space-y-2">
                                {warehouses.map((warehouse) => (
                                    <div key={warehouse.id} className="flex items-center gap-3">
                                        <label className={cn(
                                            "flex-1 text-sm",
                                            theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                                        )}>
                                            {warehouse.name}
                                        </label>
                                        <input
                                            type="number"
                                            min="0"
                                            value={formData.stockByLocation[warehouse.id] || 0}
                                            onChange={(e) => handleStockChange(warehouse.id, e.target.value)}
                                            className={cn(
                                                "w-24 rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 text-right",
                                                theme === 'dark' ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-300'
                                            )}
                                            placeholder="0"
                                        />
                                    </div>
                                ))}
                            </div>
                            <p className={cn("mt-2 text-xs", theme === 'dark' ? 'text-slate-400' : 'text-slate-500')}>
                                Total Stock: {Object.values(formData.stockByLocation).reduce((sum, qty) => sum + (qty || 0), 0)} units
                            </p>
                        </div>

                        {/* Date Added (Read-only for edit) */}
                        {isEdit && product.dateAdded && (
                            <div>
                                <label className={cn("block text-sm font-medium mb-1.5", theme === 'dark' ? 'text-slate-300' : 'text-slate-700')}>
                                    Date Added
                                </label>
                                <input
                                    type="text"
                                    value={new Date(product.dateAdded).toLocaleString()}
                                    disabled
                                    className={cn(
                                        "w-full rounded-lg border px-3 py-2 text-sm",
                                        theme === 'dark' ? 'bg-slate-800/50 border-slate-700 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-500'
                                    )}
                                />
                                <p className={cn("mt-1 text-xs", theme === 'dark' ? 'text-slate-500' : 'text-slate-400')}>
                                    This field cannot be edited
                                </p>
                            </div>
                        )}
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
                            {isEdit ? 'Update Product' : 'Save Product'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
