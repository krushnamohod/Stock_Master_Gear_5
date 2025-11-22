import { useStock } from "@/context/StockContext"
import { cn } from "@/lib/utils"
import { FileInput, PackagePlus, Truck } from "lucide-react"

export function QuickActions() {
    const { setCurrentView, theme } = useStock()

    return (
        <div className="flex flex-wrap gap-4">
            <button
                onClick={() => setCurrentView('operations')}
                className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 shadow-sm transition-colors"
            >
                <FileInput className="h-4 w-4" />
                New Receipt
            </button>
            <button
                onClick={() => setCurrentView('operations')}
                className={cn(
                    "flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium shadow-sm transition-colors",
                    theme === 'dark'
                        ? "bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800"
                        : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                )}
            >
                <Truck className="h-4 w-4" />
                New Delivery
            </button>
            <button
                onClick={() => setCurrentView('products')}
                className={cn(
                    "flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium shadow-sm transition-colors",
                    theme === 'dark'
                        ? "bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800"
                        : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                )}
            >
                <PackagePlus className="h-4 w-4" />
                New Product
            </button>
        </div>
    )
}
