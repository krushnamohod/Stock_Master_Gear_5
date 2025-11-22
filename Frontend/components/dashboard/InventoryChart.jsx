"use client"

import { useStock } from "@/context/StockContext"
import { cn } from "@/lib/utils"
import { BarChart3 } from "lucide-react"

export function InventoryChart() {
    const { products, categories, theme } = useStock()

    // Calculate total stock items per category
    const categoryData = categories.map(category => {
        const categoryProducts = products.filter(p => p.category === category.name)
        const totalItems = categoryProducts.reduce((sum, p) => sum + p.totalStock, 0)
        return {
            name: category.name,
            items: totalItems,
            products: categoryProducts.length
        }
    })

    // Find max value for scaling
    const maxItems = Math.max(...categoryData.map(d => d.items), 1)
    const chartHeight = 300 // Height of chart area in pixels

    // Solid colors for bars
    const colors = [
        { bar: 'bg-blue-600', text: 'text-blue-600' },
        { bar: 'bg-green-600', text: 'text-green-600' },
        { bar: 'bg-purple-600', text: 'text-purple-600' },
        { bar: 'bg-orange-600', text: 'text-orange-600' }
    ]

    return (
        <div className={cn(
            "rounded-xl border p-6 shadow-sm",
            theme === 'dark' ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
        )}>
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className={cn(
                        "p-2 rounded-lg",
                        theme === 'dark' ? 'bg-blue-500/20' : 'bg-blue-50'
                    )}>
                        <BarChart3 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                        <h3 className={cn("text-lg font-semibold", theme === 'dark' ? 'text-white' : 'text-slate-900')}>
                            Stock Quantity by Category
                        </h3>
                        <p className={cn("text-sm", theme === 'dark' ? 'text-slate-400' : 'text-slate-500')}>
                            Item distribution histogram
                        </p>
                    </div>
                </div>
            </div>

            {/* Histogram Chart */}
            <div className="relative" style={{ height: `${chartHeight + 60}px` }}>
                {/* Y-axis labels */}
                <div className="absolute left-0 top-0 bottom-12 w-20 flex flex-col justify-between">
                    {[maxItems, maxItems * 0.75, maxItems * 0.5, maxItems * 0.25, 0].map((value, index) => (
                        <div key={index} className="text-right pr-2">
                            <span className={cn("text-xs font-mono", theme === 'dark' ? 'text-slate-400' : 'text-slate-600')}>
                                {Math.round(value).toLocaleString()}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Chart area */}
                <div className="absolute left-20 right-0 top-0 bottom-12">
                    {/* Grid lines */}
                    <div className="absolute inset-0 flex flex-col justify-between">
                        {[0, 1, 2, 3, 4].map((index) => (
                            <div
                                key={index}
                                className={cn(
                                    "border-t",
                                    theme === 'dark' ? 'border-slate-800' : 'border-slate-200'
                                )}
                            />
                        ))}
                    </div>

                    {/* Bars */}
                    <div className="absolute inset-0 flex items-end justify-around gap-4 px-4">
                        {categoryData.map((category, index) => {
                            const barHeight = (category.items / maxItems) * chartHeight
                            const color = colors[index % colors.length]

                            return (
                                <div
                                    key={category.name}
                                    className="flex-1 flex flex-col items-center group"
                                >
                                    {/* Value label on top */}
                                    <div className={cn(
                                        "mb-2 text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity",
                                        color.text
                                    )}>
                                        {category.items.toLocaleString()} items
                                    </div>

                                    {/* Bar */}
                                    <div
                                        className={cn(
                                            "w-full rounded-t-lg transition-all duration-700 ease-out hover:opacity-90 cursor-pointer relative",
                                            color.bar
                                        )}
                                        style={{
                                            height: `${barHeight}px`,
                                            maxHeight: `${chartHeight}px`
                                        }}
                                    >
                                        {/* Hover tooltip */}
                                        <div className={cn(
                                            "absolute -top-20 left-1/2 -translate-x-1/2 w-32 p-2 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10",
                                            theme === 'dark' ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-slate-200'
                                        )}>
                                            <p className={cn("text-xs font-semibold", theme === 'dark' ? 'text-white' : 'text-slate-900')}>
                                                {category.name}
                                            </p>
                                            <p className={cn("text-xs mt-1", theme === 'dark' ? 'text-slate-400' : 'text-slate-600')}>
                                                {category.items} items
                                            </p>
                                            <p className={cn("text-xs", theme === 'dark' ? 'text-slate-400' : 'text-slate-600')}>
                                                {category.products} products
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* X-axis labels */}
                <div className="absolute left-20 right-0 bottom-0 h-12 flex items-start justify-around gap-4 px-4 pt-2">
                    {categoryData.map((category, index) => {
                        const color = colors[index % colors.length]
                        return (
                            <div key={category.name} className="flex-1 text-center">
                                <div className="flex flex-col items-center gap-1">
                                    <div className={cn("w-3 h-3 rounded-sm", color.bar)} />
                                    <span className={cn("text-xs font-medium", theme === 'dark' ? 'text-slate-300' : 'text-slate-700')}>
                                        {category.name}
                                    </span>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Summary Stats */}
            <div className={cn(
                "mt-6 pt-4 border-t grid grid-cols-3 gap-4",
                theme === 'dark' ? 'border-slate-800' : 'border-slate-200'
            )}>
                <div className="text-center">
                    <p className={cn("text-xs uppercase tracking-wide mb-1", theme === 'dark' ? 'text-slate-500' : 'text-slate-500')}>
                        Total Items
                    </p>
                    <p className={cn("text-lg font-bold", theme === 'dark' ? 'text-white' : 'text-slate-900')}>
                        {categoryData.reduce((sum, d) => sum + d.items, 0).toLocaleString()}
                    </p>
                </div>
                <div className="text-center">
                    <p className={cn("text-xs uppercase tracking-wide mb-1", theme === 'dark' ? 'text-slate-500' : 'text-slate-500')}>
                        Total Products
                    </p>
                    <p className={cn("text-lg font-bold", theme === 'dark' ? 'text-white' : 'text-slate-900')}>
                        {categoryData.reduce((sum, d) => sum + d.products, 0).toLocaleString()}
                    </p>
                </div>
                <div className="text-center">
                    <p className={cn("text-xs uppercase tracking-wide mb-1", theme === 'dark' ? 'text-slate-500' : 'text-slate-500')}>
                        Categories
                    </p>
                    <p className={cn("text-lg font-bold", theme === 'dark' ? 'text-white' : 'text-slate-900')}>
                        {categoryData.length}
                    </p>
                </div>
            </div>
        </div>
    )
}
