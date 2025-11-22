"use client"

import { useStock } from "@/context/StockContext"
import { cn } from "@/lib/utils"
import { AlertTriangle, ArrowUpDown, Filter, Grid3X3, List, Plus, Search } from "lucide-react"
import { useState } from "react"
import { ProductDetailModal } from "./ProductDetailModal"
import { ProductFormModal } from "./ProductFormModal"

export function ProductsView() {
    const { products, categories, addProduct, updateProduct, deleteProduct, theme } = useStock()
    const [viewMode, setViewMode] = useState('table') // 'table' or 'grid'
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedCategory, setSelectedCategory] = useState('all')
    const [stockFilter, setStockFilter] = useState('all') // 'all', 'low', 'in-stock'
    const [showFilters, setShowFilters] = useState(false)
    const [sortBy, setSortBy] = useState('name') // 'name', 'sku', 'price', 'stock', 'dateAdded'
    const [sortOrder, setSortOrder] = useState('asc')

    const [showFormModal, setShowFormModal] = useState(false)
    const [showDetailModal, setShowDetailModal] = useState(false)
    const [selectedProduct, setSelectedProduct] = useState(null)

    // Filter products
    const filteredProducts = products
        .filter(p => {
            const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.sku.toLowerCase().includes(searchTerm.toLowerCase())
            const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory
            const matchesStock = stockFilter === 'all' ||
                (stockFilter === 'low' && p.totalStock <= p.reorderPoint) ||
                (stockFilter === 'in-stock' && p.totalStock > p.reorderPoint)

            return matchesSearch && matchesCategory && matchesStock
        })
        .sort((a, b) => {
            let aVal, bVal
            switch (sortBy) {
                case 'name':
                    aVal = a.name.toLowerCase()
                    bVal = b.name.toLowerCase()
                    break
                case 'sku':
                    aVal = a.sku
                    bVal = b.sku
                    break
                case 'price':
                    aVal = a.price
                    bVal = b.price
                    break
                case 'stock':
                    aVal = a.totalStock
                    bVal = b.totalStock
                    break
                case 'dateAdded':
                    aVal = new Date(a.dateAdded)
                    bVal = new Date(b.dateAdded)
                    break
                default:
                    return 0
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
            setSortOrder('asc')
        }
    }

    const handleAddProduct = () => {
        setSelectedProduct(null)
        setShowFormModal(true)
    }

    const handleEditProduct = (product) => {
        setSelectedProduct(product)
        setShowFormModal(true)
        setShowDetailModal(false)
    }

    const handleSaveProduct = (productData) => {
        if (selectedProduct) {
            updateProduct(selectedProduct.id, productData)
        } else {
            addProduct(productData)
        }
        setShowFormModal(false)
        setSelectedProduct(null)
    }

    const handleViewDetails = (product) => {
        setSelectedProduct(product)
        setShowDetailModal(true)
    }

    const handleDeleteProduct = (id) => {
        deleteProduct(id)
        setShowDetailModal(false)
        setSelectedProduct(null)
    }

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        })
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className={cn("text-2xl font-bold tracking-tight", theme === 'dark' ? "text-white" : "text-slate-900")}>
                        Products
                    </h1>
                    <p className={cn("text-sm mt-1", theme === 'dark' ? "text-slate-400" : "text-slate-500")}>
                        Manage your product catalog and stock levels
                    </p>
                </div>
                <button
                    onClick={handleAddProduct}
                    className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 shadow-sm transition-colors"
                >
                    <Plus className="h-4 w-4" />
                    Add Product
                </button>
            </div>

            {/* Search & Filters Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                {/* Search */}
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search by name or SKU..."
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

                {/* Filter Toggle */}
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={cn(
                        "flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium transition-colors",
                        theme === 'dark' ? "border-slate-700 text-slate-300 hover:bg-slate-800" : "border-slate-200 text-slate-700 hover:bg-slate-50",
                        showFilters && "bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-400"
                    )}
                >
                    <Filter className="h-4 w-4" />
                    Filters
                </button>

                {/* View Mode Toggle */}
                <div className={cn(
                    "flex items-center rounded-md border",
                    theme === 'dark' ? 'border-slate-700 bg-slate-900' : 'border-slate-200 bg-white'
                )}>
                    <button
                        onClick={() => setViewMode('table')}
                        className={cn(
                            "p-2 transition-colors rounded-l-md",
                            viewMode === 'table'
                                ? 'bg-blue-600 text-white'
                                : theme === 'dark' ? 'text-slate-400 hover:bg-slate-800' : 'text-slate-600 hover:bg-slate-50'
                        )}
                    >
                        <List className="h-4 w-4" />
                    </button>
                    <button
                        onClick={() => setViewMode('grid')}
                        className={cn(
                            "p-2 transition-colors rounded-r-md",
                            viewMode === 'grid'
                                ? 'bg-blue-600 text-white'
                                : theme === 'dark' ? 'text-slate-400 hover:bg-slate-800' : 'text-slate-600 hover:bg-slate-50'
                        )}
                    >
                        <Grid3X3 className="h-4 w-4" />
                    </button>
                </div>
            </div>

            {/* Filters Panel */}
            {showFilters && (
                <div className={cn(
                    "p-4 rounded-lg border",
                    theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'
                )}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Category Filter */}
                        <div>
                            <label className={cn("block text-sm font-medium mb-2", theme === 'dark' ? 'text-slate-300' : 'text-slate-700')}>
                                Category
                            </label>
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className={cn(
                                    "w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500",
                                    theme === 'dark' ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-300'
                                )}
                            >
                                <option value="all">All Categories</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                                ))}
                            </select>
                        </div>

                        {/* Stock Filter */}
                        <div>
                            <label className={cn("block text-sm font-medium mb-2", theme === 'dark' ? 'text-slate-300' : 'text-slate-700')}>
                                Stock Status
                            </label>
                            <select
                                value={stockFilter}
                                onChange={(e) => setStockFilter(e.target.value)}
                                className={cn(
                                    "w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500",
                                    theme === 'dark' ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-300'
                                )}
                            >
                                <option value="all">All Products</option>
                                <option value="low">Low Stock Only</option>
                                <option value="in-stock">In Stock</option>
                            </select>
                        </div>
                    </div>
                </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className={cn(
                    "p-4 rounded-lg border",
                    theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                )}>
                    <p className={cn("text-sm font-medium", theme === 'dark' ? 'text-slate-400' : 'text-slate-600')}>
                        Total Products
                    </p>
                    <p className={cn("text-2xl font-bold mt-1", theme === 'dark' ? 'text-white' : 'text-slate-900')}>
                        {filteredProducts.length}
                    </p>
                </div>
                <div className={cn(
                    "p-4 rounded-lg border",
                    theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                )}>
                    <p className={cn("text-sm font-medium", theme === 'dark' ? 'text-slate-400' : 'text-slate-600')}>
                        Low Stock Items
                    </p>
                    <p className="text-2xl font-bold mt-1 text-red-600 dark:text-red-400">
                        {filteredProducts.filter(p => p.totalStock <= p.reorderPoint).length}
                    </p>
                </div>
                <div className={cn(
                    "p-4 rounded-lg border",
                    theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                )}>
                    <p className={cn("text-sm font-medium", theme === 'dark' ? 'text-slate-400' : 'text-slate-600')}>
                        Total Value
                    </p>
                    <p className="text-2xl font-bold mt-1 text-green-600 dark:text-green-400">
                        ${filteredProducts.reduce((sum, p) => sum + (p.totalStock * p.price), 0).toLocaleString()}
                    </p>
                </div>
            </div>

            {/* Table View */}
            {viewMode === 'table' && (
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
                                            onClick={() => handleSort('name')}
                                            className="flex items-center gap-1 font-medium hover:text-blue-600"
                                        >
                                            Name
                                            <ArrowUpDown className="h-3 w-3" />
                                        </button>
                                    </th>
                                    <th className="px-6 py-3 text-left">
                                        <button
                                            onClick={() => handleSort('sku')}
                                            className="flex items-center gap-1 font-medium hover:text-blue-600"
                                        >
                                            SKU
                                            <ArrowUpDown className="h-3 w-3" />
                                        </button>
                                    </th>
                                    <th className="px-6 py-3 text-left font-medium">Category</th>
                                    <th className="px-6 py-3 text-right">
                                        <button
                                            onClick={() => handleSort('price')}
                                            className="flex items-center gap-1 font-medium hover:text-blue-600 ml-auto"
                                        >
                                            Price
                                            <ArrowUpDown className="h-3 w-3" />
                                        </button>
                                    </th>
                                    <th className="px-6 py-3 text-right">
                                        <button
                                            onClick={() => handleSort('stock')}
                                            className="flex items-center gap-1 font-medium hover:text-blue-600 ml-auto"
                                        >
                                            Stock
                                            <ArrowUpDown className="h-3 w-3" />
                                        </button>
                                    </th>
                                    <th className="px-6 py-3 text-left font-medium">Status</th>
                                    <th className="px-6 py-3 text-left">
                                        <button
                                            onClick={() => handleSort('dateAdded')}
                                            className="flex items-center gap-1 font-medium hover:text-blue-600"
                                        >
                                            Date Added
                                            <ArrowUpDown className="h-3 w-3" />
                                        </button>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className={cn("divide-y", theme === 'dark' ? "divide-slate-800" : "divide-slate-200")}>
                                {filteredProducts.map((product) => (
                                    <tr
                                        key={product.id}
                                        onClick={() => handleViewDetails(product)}
                                        className={cn(
                                            "cursor-pointer transition-colors",
                                            theme === 'dark' ? "bg-slate-900 hover:bg-slate-800" : "bg-white hover:bg-slate-50"
                                        )}
                                    >
                                        <td className={cn("px-6 py-4 font-medium", theme === 'dark' ? "text-slate-200" : "text-slate-900")}>
                                            {product.name}
                                        </td>
                                        <td className={cn("px-6 py-4 font-mono text-xs", theme === 'dark' ? "text-slate-400" : "text-slate-500")}>
                                            {product.sku}
                                        </td>
                                        <td className={cn("px-6 py-4", theme === 'dark' ? "text-slate-400" : "text-slate-600")}>
                                            {product.category}
                                        </td>
                                        <td className={cn("px-6 py-4 text-right font-medium", theme === 'dark' ? "text-slate-200" : "text-slate-900")}>
                                            ${product.price}
                                        </td>
                                        <td className={cn("px-6 py-4 text-right font-medium", theme === 'dark' ? "text-slate-200" : "text-slate-900")}>
                                            {product.totalStock}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={cn(
                                                "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium",
                                                product.totalStock <= product.reorderPoint
                                                    ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                                                    : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                            )}>
                                                {product.totalStock <= product.reorderPoint && <AlertTriangle className="h-3 w-3" />}
                                                {product.totalStock <= product.reorderPoint ? "Low Stock" : "In Stock"}
                                            </span>
                                        </td>
                                        <td className={cn("px-6 py-4", theme === 'dark' ? "text-slate-400" : "text-slate-600")}>
                                            {formatDate(product.dateAdded)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Grid View */}
            {viewMode === 'grid' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filteredProducts.map((product) => (
                        <div
                            key={product.id}
                            onClick={() => handleViewDetails(product)}
                            className={cn(
                                "p-4 rounded-lg border cursor-pointer transition-all hover:shadow-lg",
                                theme === 'dark' ? 'bg-slate-900 border-slate-800 hover:border-blue-600' : 'bg-white border-slate-200 hover:border-blue-500'
                            )}
                        >
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex-1">
                                    <h3 className={cn("font-semibold mb-1", theme === 'dark' ? 'text-white' : 'text-slate-900')}>
                                        {product.name}
                                    </h3>
                                    <p className={cn("text-xs font-mono", theme === 'dark' ? 'text-slate-500' : 'text-slate-400')}>
                                        {product.sku}
                                    </p>
                                </div>
                                <span className={cn(
                                    "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
                                    product.totalStock <= product.reorderPoint
                                        ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                                        : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                )}>
                                    {product.totalStock <= product.reorderPoint && <AlertTriangle className="h-3 w-3" />}
                                </span>
                            </div>

                            <div className="space-y-2 mb-3">
                                <div className="flex items-center justify-between text-sm">
                                    <span className={cn(theme === 'dark' ? 'text-slate-400' : 'text-slate-600')}>
                                        Category
                                    </span>
                                    <span className={cn("font-medium", theme === 'dark' ? 'text-slate-200' : 'text-slate-900')}>
                                        {product.category}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className={cn(theme === 'dark' ? 'text-slate-400' : 'text-slate-600')}>
                                        Stock
                                    </span>
                                    <span className={cn("font-bold", theme === 'dark' ? 'text-white' : 'text-slate-900')}>
                                        {product.totalStock} units
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className={cn(theme === 'dark' ? 'text-slate-400' : 'text-slate-600')}>
                                        Price
                                    </span>
                                    <span className="font-bold text-green-600 dark:text-green-400">
                                        ${product.price}
                                    </span>
                                </div>
                            </div>

                            <div className={cn(
                                "pt-3 border-t text-xs",
                                theme === 'dark' ? 'border-slate-800 text-slate-500' : 'border-slate-200 text-slate-400'
                            )}>
                                Added {formatDate(product.dateAdded)}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Empty State */}
            {filteredProducts.length === 0 && (
                <div className={cn(
                    "text-center py-12 rounded-lg border",
                    theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'
                )}>
                    <p className={cn("text-sm", theme === 'dark' ? 'text-slate-400' : 'text-slate-500')}>
                        No products found matching your filters
                    </p>
                </div>
            )}

            {/* Modals */}
            {showFormModal && (
                <ProductFormModal
                    product={selectedProduct}
                    onClose={() => {
                        setShowFormModal(false)
                        setSelectedProduct(null)
                    }}
                    onSave={handleSaveProduct}
                />
            )}

            {showDetailModal && selectedProduct && (
                <ProductDetailModal
                    product={selectedProduct}
                    onClose={() => {
                        setShowDetailModal(false)
                        setSelectedProduct(null)
                    }}
                    onEdit={handleEditProduct}
                    onDelete={handleDeleteProduct}
                />
            )}
        </div>
    )
}
