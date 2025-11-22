"use client"

import { useStock } from "@/context/StockContext"
import { cn } from "@/lib/utils"
import { MapPin } from "lucide-react"

export function SettingsView() {
    const { warehouses, theme } = useStock()

    return (
        <div className="space-y-6 max-w-4xl">
            <div>
                <h1 className={cn("text-2xl font-bold tracking-tight", theme === 'dark' ? "text-white" : "text-slate-900")}>Settings</h1>
                <p className={cn("text-sm", theme === 'dark' ? "text-slate-400" : "text-slate-500")}>Configure your warehouse locations and system preferences.</p>
            </div>

            <div className={cn("rounded-xl border shadow-sm", theme === 'dark' ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200")}>
                <div className={cn("border-b px-6 py-4", theme === 'dark' ? "border-slate-800" : "border-slate-200")}>
                    <h2 className={cn("text-lg font-semibold", theme === 'dark' ? "text-white" : "text-slate-900")}>Warehouse Locations</h2>
                </div>
                <div className="p-6">
                    <div className="grid gap-4 md:grid-cols-2">
                        {warehouses.map(wh => (
                            <div key={wh.id} className={cn(
                                "flex items-start gap-4 rounded-lg border p-4",
                                theme === 'dark' ? "border-slate-700 bg-slate-800/50" : "border-slate-200 bg-slate-50"
                            )}>
                                <div className="mt-1 rounded-full bg-blue-100 p-2 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                                    <MapPin className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className={cn("font-medium", theme === 'dark' ? "text-slate-200" : "text-slate-900")}>{wh.name}</h3>
                                    <p className="text-sm text-slate-500">{wh.address}</p>
                                    <div className="mt-2 flex gap-2">
                                        <button className="text-xs font-medium text-blue-600 hover:underline dark:text-blue-400">Edit</button>
                                        <button className="text-xs font-medium text-red-600 hover:underline dark:text-red-400">Remove</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                        <button className={cn(
                            "flex items-center justify-center rounded-lg border-2 border-dashed p-4 transition-colors",
                            theme === 'dark'
                                ? "border-slate-700 hover:border-slate-500 hover:bg-slate-800/50 text-slate-400"
                                : "border-slate-300 hover:border-slate-400 hover:bg-slate-50 text-slate-500"
                        )}>
                            <span className="text-sm font-medium">+ Add New Location</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
