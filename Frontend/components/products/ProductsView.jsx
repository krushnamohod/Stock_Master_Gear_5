"use client"

import { useStock } from "@/context/StockContext"
import { cn } from "@/lib/utils"
import { Filter, Plus, Search, X } from "lucide-react"
import { useState } from "react"

export function ProductsView() {
    const { products, addProduct, theme } = useStock()
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [searchTerm, setSearchTerm] = useState("")
    const [formData, setFormData] = useState({
        name: "",
        sku: "",
        category: "Electronics",
        stock: 0,
        minStock: 10,
        price: 0,
        location: "Warehouse A"
    })

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const handleSubmit = (e) => {
        e.preventDefault()
        addProduct({
            ...formData,
            stock: parseInt(formData.stock),
            minStock: parseInt(formData.minStock),
            price: parseFloat(formData.price)
        })
        setIsModalOpen(false)
        setFormData({ name: "", sku: "", category: "Electronics", stock: 0, minStock: 10, price: 0, location: "Warehouse A" })
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className={cn("text-2xl font-bold tracking-tight", theme === 'dark' ? "text-white" : "text-slate-900")}>Products</h1>
                    <p className={cn("text-sm", theme === 'dark' ? "text-slate-400" : "text-slate-500")}>Manage your product catalog and stock levels.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 shadow-sm transition-colors"
                >
                    <Plus className="h-4 w-4" />
                    Add Product
                </button>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-4">
                <div className="relative flex-1 md:max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={cn(
                            "h-9 w-full rounded-md border pl-9 pr-4 text-sm outline-none focus:ring-1",
                            theme === 'dark'
                                ? "bg-slate-900 border-slate-700 text-slate-200 focus:border-blue-500 focus:ring-blue-500"
                                : "bg-white border-slate-200 text-slate-900 focus:border-blue-500 focus:ring-blue-500"
                        )}
                    />
                </div>
                <button className={cn(
                    "flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium",
                    theme === 'dark' ? "border-slate-700 text-slate-300 hover:bg-slate-800" : "border-slate-200 text-slate-700 hover:bg-slate-50"
                )}>
                    <Filter className="h-4 w-4" />
                    Filter
                </button>
            </div>

            {/* Table */}
            <div className={cn("rounded-md border", theme === 'dark' ? "border-slate-800" : "border-slate-200")}>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className={cn(
                            "text-xs uppercase",
                            theme === 'dark' ? "bg-slate-900 text-slate-400" : "bg-slate-50 text-slate-500"
                        )}>
                            <tr>
                                <th className="px-6 py-3 font-medium">Name</th>
                                <th className="px-6 py-3 font-medium">SKU</th>
                                <th className="px-6 py-3 font-medium">Category</th>
                                <th className="px-6 py-3 font-medium">Price</th>
                                <th className="px-6 py-3 font-medium">Stock</th>
                                <th className="px-6 py-3 font-medium">Status</th>
                                <th className="px-6 py-3 font-medium">Location</th>
                            </tr>
                        </thead>
                        <tbody className={cn("divide-y", theme === 'dark' ? "divide-slate-800" : "divide-slate-200")}>
                            {filteredProducts.map((product) => (
                                <tr key={product.id} className={cn(theme === 'dark' ? "bg-slate-900 hover:bg-slate-800" : "bg-white hover:bg-slate-50")}>
                                    <td className={cn("px-6 py-4 font-medium", theme === 'dark' ? "text-slate-200" : "text-slate-900")}>{product.name}</td>
                                    <td className="px-6 py-4 text-slate-500">{product.sku}</td>
                                    <td className="px-6 py-4 text-slate-500">{product.category}</td>
                                    <td className={cn("px-6 py-4", theme === 'dark' ? "text-slate-300" : "text-slate-900")}>${product.price}</td>
                                    <td className={cn("px-6 py-4 font-medium", theme === 'dark' ? "text-slate-200" : "text-slate-900")}>{product.stock}</td>
                                    <td className="px-6 py-4">
                                        <span className={cn(
                                            "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                                            product.stock <= product.minStock
                                                ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                                                : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                        )}>
                                            {product.stock <= product.minStock ? "Low Stock" : "In Stock"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-slate-500">{product.location}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add Product Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className={cn(
                        "w-full max-w-md rounded-lg p-6 shadow-lg",
                        theme === 'dark' ? "bg-slate-900 border border-slate-800" : "bg-white"
                    )}>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className={cn("text-lg font-semibold", theme === 'dark' ? "text-white" : "text-slate-900")}>Add New Product</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-500 hover:text-slate-700">
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className={cn("block text-sm font-medium mb-1", theme === 'dark' ? "text-slate-300" : "text-slate-700")}>Product Name</label>
                                <input
                                    required
                                    type="text"
                                    className={cn("w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-1", theme === 'dark' ? "bg-slate-800 border-slate-700 text-white focus:ring-blue-500" : "border-slate-300 focus:ring-blue-500")}
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className={cn("block text-sm font-medium mb-1", theme === 'dark' ? "text-slate-300" : "text-slate-700")}>SKU</label>
                                    <input
                                        required
                                        type="text"
                                        className={cn("w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-1", theme === 'dark' ? "bg-slate-800 border-slate-700 text-white focus:ring-blue-500" : "border-slate-300 focus:ring-blue-500")}
                                        value={formData.sku}
                                        onChange={e => setFormData({ ...formData, sku: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className={cn("block text-sm font-medium mb-1", theme === 'dark' ? "text-slate-300" : "text-slate-700")}>Category</label>
                                    <select
                                        className={cn("w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-1", theme === 'dark' ? "bg-slate-800 border-slate-700 text-white focus:ring-blue-500" : "border-slate-300 focus:ring-blue-500")}
                                        value={formData.category}
                                        onChange={e => setFormData({ ...formData, category: e.target.value })}
                                    >
                                        <option>Electronics</option>
                                        <option>Furniture</option>
                                        <option>Accessories</option>
                                        <option>Stationery</option>
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className={cn("block text-sm font-medium mb-1", theme === 'dark' ? "text-slate-300" : "text-slate-700")}>Initial Stock</label>
                                    <input
                                        type="number"
                                        className={cn("w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-1", theme === 'dark' ? "bg-slate-800 border-slate-700 text-white focus:ring-blue-500" : "border-slate-300 focus:ring-blue-500")}
                                        value={formData.stock}
                                        onChange={e => setFormData({ ...formData, stock: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className={cn("block text-sm font-medium mb-1", theme === 'dark' ? "text-slate-300" : "text-slate-700")}>Min Stock</label>
                                    <input
                                        type="number"
                                        className={cn("w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-1", theme === 'dark' ? "bg-slate-800 border-slate-700 text-white focus:ring-blue-500" : "border-slate-300 focus:ring-blue-500")}
                                        value={formData.minStock}
                                        onChange={e => setFormData({ ...formData, minStock: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className={cn("block text-sm font-medium mb-1", theme === 'dark' ? "text-slate-300" : "text-slate-700")}>Price ($)</label>
                                    <input
                                        type="number"
                                        className={cn("w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-1", theme === 'dark' ? "bg-slate-800 border-slate-700 text-white focus:ring-blue-500" : "border-slate-300 focus:ring-blue-500")}
                                        value={formData.price}
                                        onChange={e => setFormData({ ...formData, price: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className={cn("block text-sm font-medium mb-1", theme === 'dark' ? "text-slate-300" : "text-slate-700")}>Location</label>
                                    <select
                                        className={cn("w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-1", theme === 'dark' ? "bg-slate-800 border-slate-700 text-white focus:ring-blue-500" : "border-slate-300 focus:ring-blue-500")}
                                        value={formData.location}
                                        onChange={e => setFormData({ ...formData, location: e.target.value })}
                                    >
                                        <option>Warehouse A</option>
                                        <option>Warehouse B</option>
                                        <option>Store B</option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className={cn("px-4 py-2 text-sm font-medium rounded-md", theme === 'dark' ? "text-slate-300 hover:bg-slate-800" : "text-slate-700 hover:bg-slate-100")}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                                >
                                    Save Product
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
