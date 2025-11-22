"use client"

import { useStock } from '@/context/StockContext'
import { cn } from '@/lib/utils'
import { Barcode, Calendar, DollarSign, Edit, MapPin, Package, Trash2, TrendingUp, X } from 'lucide-react'

export function ProductDetailModal({ product, onClose, onEdit, onDelete }) {
    const { theme, warehouses, movements } = useStock()

    // Get movements for this product
    const productMovements = movements
        .filter(m => m.productId === product.id)
        .slice(0, 5) // Last 5 movements

    // Format date
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const getWarehouseName = (warehouseId) => {
        const warehouse = warehouses.find(w => w.id === warehouseId)
        return warehouse ? warehouse.name : 'Unknown'
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
            <div
                className={cn(
                    "w-full max-w-4xl rounded-lg shadow-xl overflow-hidden",
                    theme === 'dark' ? 'bg-slate-900 border border-slate-800' : 'bg-white'
                )}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className={cn(
                    "flex items-center justify-between p-6 border-b",
                    theme === 'dark' ? 'border-slate-800' : 'border-slate-200'
                )}>
                    <div>
                        <h2 className={cn("text-2xl font-bold", theme === 'dark' ? 'text-white' : 'text-slate-900')}>
                            {product.name}
                        </h2>
                        <p className={cn("text-sm mt-1", theme === 'dark' ? 'text-slate-400' : 'text-slate-500')}>
                            SKU: {product.sku}
                        </p>
                    </div>
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

                {/* Content */}
                <div className="p-6 max-h-[70vh] overflow-y-auto">
                    {/* Product Info Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-6">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <Package className={cn("h-4 w-4", theme === 'dark' ? 'text-slate-400' : 'text-slate-500')} />
                                <p className={cn("text-sm font-medium", theme === 'dark' ? 'text-slate-400' : 'text-slate-600')}>
                                    Category
                                </p>
                            </div>
                            <p className={cn("text-sm font-semibold", theme === 'dark' ? 'text-white' : 'text-slate-900')}>
                                {product.category}
                            </p>
                        </div>

                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <Barcode className={cn("h-4 w-4", theme === 'dark' ? 'text-slate-400' : 'text-slate-500')} />
                                <p className={cn("text-sm font-medium", theme === 'dark' ? 'text-slate-400' : 'text-slate-600')}>
                                    Barcode
                                </p>
                            </div>
                            <p className={cn("text-sm font-mono", theme === 'dark' ? 'text-white' : 'text-slate-900')}>
                                {product.barcode || 'N/A'}
                            </p>
                        </div>

                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <Calendar className={cn("h-4 w-4", theme === 'dark' ? 'text-slate-400' : 'text-slate-500')} />
                                <p className={cn("text-sm font-medium", theme === 'dark' ? 'text-slate-400' : 'text-slate-600')}>
                                    Date Added
                                </p>
                            </div>
                            <p className={cn("text-sm", theme === 'dark' ? 'text-white' : 'text-slate-900')}>
                                {formatDate(product.dateAdded)}
                            </p>
                        </div>

                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <DollarSign className={cn("h-4 w-4", theme === 'dark' ? 'text-slate-400' : 'text-slate-500')} />
                                <p className={cn("text-sm font-medium", theme === 'dark' ? 'text-slate-400' : 'text-slate-600')}>
                                    Cost
                                </p>
                            </div>
                            <p className={cn("text-sm font-semibold", theme === 'dark' ? 'text-white' : 'text-slate-900')}>
                                ${product.cost}
                            </p>
                        </div>

                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <DollarSign className={cn("h-4 w-4", theme === 'dark' ? 'text-slate-400' : 'text-slate-500')} />
                                <p className={cn("text-sm font-medium", theme === 'dark' ? 'text-slate-400' : 'text-slate-600')}>
                                    Price
                                </p>
                            </div>
                            <p className={cn("text-sm font-semibold text-green-600 dark:text-green-400")}>
                                ${product.price}
                            </p>
                        </div>

                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <TrendingUp className={cn("h-4 w-4", theme === 'dark' ? 'text-slate-400' : 'text-slate-500')} />
                                <p className={cn("text-sm font-medium", theme === 'dark' ? 'text-slate-400' : 'text-slate-600')}>
                                    Profit Margin
                                </p>
                            </div>
                            <p className={cn("text-sm font-semibold text-blue-600 dark:text-blue-400")}>
                                {((product.price - product.cost) / product.price * 100).toFixed(1)}%
                            </p>
                        </div>
                    </div>

                    {/* Stock by Location */}
                    <div className="mb-6">
                        <h3 className={cn("text-lg font-semibold mb-3", theme === 'dark' ? 'text-white' : 'text-slate-900')}>
                            Stock by Location
                        </h3>
                        <div className={cn("rounded-lg border overflow-hidden", theme === 'dark' ? 'border-slate-800' : 'border-slate-200')}>
                            <table className="w-full text-sm">
                                <thead className={cn(theme === 'dark' ? 'bg-slate-800' : 'bg-slate-50')}>
                                    <tr>
                                        <th className={cn("px-4 py-2 text-left font-medium", theme === 'dark' ? 'text-slate-300' : 'text-slate-600')}>
                                            Warehouse
                                        </th>
                                        <th className={cn("px-4 py-2 text-right font-medium", theme === 'dark' ? 'text-slate-300' : 'text-slate-600')}>
                                            Quantity
                                        </th>
                                        <th className={cn("px-4 py-2 text-right font-medium", theme === 'dark' ? 'text-slate-300' : 'text-slate-600')}>
                                            Value
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className={cn("divide-y", theme === 'dark' ? 'divide-slate-800' : 'divide-slate-200')}>
                                    {Object.entries(product.stockByLocation || {}).map(([warehouseId, quantity]) => (
                                        <tr key={warehouseId} className={theme === 'dark' ? 'bg-slate-900' : 'bg-white'}>
                                            <td className={cn("px-4 py-3", theme === 'dark' ? 'text-slate-200' : 'text-slate-900')}>
                                                <div className="flex items-center gap-2">
                                                    <MapPin className="h-4 w-4 text-blue-500" />
                                                    {getWarehouseName(parseInt(warehouseId))}
                                                </div>
                                            </td>
                                            <td className={cn("px-4 py-3 text-right font-medium", theme === 'dark' ? 'text-slate-200' : 'text-slate-900')}>
                                                {quantity}
                                            </td>
                                            <td className={cn("px-4 py-3 text-right", theme === 'dark' ? 'text-slate-300' : 'text-slate-600')}>
                                                ${(quantity * product.price).toFixed(2)}
                                            </td>
                                        </tr>
                                    ))}
                                    <tr className={cn("font-semibold", theme === 'dark' ? 'bg-slate-800' : 'bg-slate-50')}>
                                        <td className={cn("px-4 py-3", theme === 'dark' ? 'text-white' : 'text-slate-900')}>
                                            Total
                                        </td>
                                        <td className={cn("px-4 py-3 text-right", theme === 'dark' ? 'text-white' : 'text-slate-900')}>
                                            {product.totalStock}
                                        </td>
                                        <td className={cn("px-4 py-3 text-right text-green-600 dark:text-green-400")}>
                                            ${(product.totalStock * product.price).toFixed(2)}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        {/* Reorder Info */}
                        <div className={cn(
                            "mt-3 p-3 rounded-lg",
                            product.totalStock <= product.reorderPoint
                                ? 'bg-red-50 border border-red-200 dark:bg-red-900/20 dark:border-red-800'
                                : 'bg-blue-50 border border-blue-200 dark:bg-blue-900/20 dark:border-blue-800'
                        )}>
                            <p className={cn(
                                "text-sm font-medium",
                                product.totalStock <= product.reorderPoint
                                    ? 'text-red-700 dark:text-red-400'
                                    : 'text-blue-700 dark:text-blue-400'
                            )}>
                                {product.totalStock <= product.reorderPoint
                                    ? `⚠️ Low Stock Alert: Reorder ${product.reorderQuantity} units (Reorder Point: ${product.reorderPoint})`
                                    : `✓ Stock Level OK (Reorder Point: ${product.reorderPoint})`
                                }
                            </p>
                        </div>
                    </div>

                    {/* Recent Movement History */}
                    {productMovements.length > 0 && (
                        <div>
                            <h3 className={cn("text-lg font-semibold mb-3", theme === 'dark' ? 'text-white' : 'text-slate-900')}>
                                Recent Movements
                            </h3>
                            <div className="space-y-2">
                                {productMovements.map((movement) => (
                                    <div
                                        key={movement.id}
                                        className={cn(
                                            "flex items-center justify-between p-3 rounded-lg border",
                                            theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'
                                        )}
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className={cn(
                                                "px-2 py-1 rounded text-xs font-medium",
                                                movement.type === 'IN' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                                                    movement.type === 'OUT' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                                                        'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                                            )}>
                                                {movement.type}
                                            </span>
                                            <div>
                                                <p className={cn("text-sm font-medium", theme === 'dark' ? 'text-white' : 'text-slate-900')}>
                                                    {movement.type === 'IN' ? '+' : movement.type === 'OUT' ? '-' : ''}{movement.quantity} units
                                                </p>
                                                <p className={cn("text-xs", theme === 'dark' ? 'text-slate-400' : 'text-slate-500')}>
                                                    {movement.reference}
                                                </p>
                                            </div>
                                        </div>
                                        <p className={cn("text-xs", theme === 'dark' ? 'text-slate-400' : 'text-slate-500')}>
                                            {movement.date}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Actions */}
                <div className={cn(
                    "flex items-center justify-end gap-3 p-6 border-t",
                    theme === 'dark' ? 'border-slate-800 bg-slate-900/50' : 'border-slate-200 bg-slate-50'
                )}>
                    <button
                        onClick={() => {
                            if (confirm(`Are you sure you want to delete "${product.name}"?`)) {
                                onDelete(product.id)
                            }
                        }}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                        <Trash2 className="h-4 w-4" />
                        Delete
                    </button>
                    <button
                        onClick={() => onEdit(product)}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                    >
                        <Edit className="h-4 w-4" />
                        Edit Product
                    </button>
                </div>
            </div>
        </div>
    )
}
