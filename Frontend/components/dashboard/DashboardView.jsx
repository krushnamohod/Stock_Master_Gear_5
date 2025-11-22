"use client"

import { InventoryChart } from "@/components/dashboard/InventoryChart"
import { KPICard } from "@/components/dashboard/KPICard"
import { QuickActions } from "@/components/dashboard/QuickActions"
import { RecentActivity } from "@/components/dashboard/RecentActivity"
import { useStock } from "@/context/StockContext"
import { cn } from "@/lib/utils"
import { AlertTriangle, ArrowDownLeft, ArrowUpRight, Package } from "lucide-react"

export function DashboardView() {
    const { stats, theme } = useStock()

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className={cn("text-2xl font-bold tracking-tight", theme === 'dark' ? "text-white" : "text-slate-900")}>
                        Dashboard
                    </h1>
                    <p className={cn("text-sm", theme === 'dark' ? "text-slate-400" : "text-slate-500")}>
                        Overview of your inventory performance.
                    </p>
                </div>
                <QuickActions />
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <KPICard
                    title="Total Products"
                    value={stats.totalProducts}
                    icon={Package}
                    trend="+12%"
                    trendUp={true}
                    description="vs. last month"
                />
                <KPICard
                    title="Low Stock Items"
                    value={stats.lowStockCount}
                    icon={AlertTriangle}
                    alert={stats.lowStockCount > 0}
                    description="Requires attention"
                />
                <KPICard
                    title="Total Value"
                    value={`$${stats.totalValue.toLocaleString()}`}
                    icon={ArrowDownLeft}
                    description="Inventory Asset"
                />
                <KPICard
                    title="Pending Deliveries"
                    value="8"
                    icon={ArrowUpRight}
                    description="2 urgent"
                />
            </div>

            <div className="grid gap-6 md:grid-cols-7">
                <div className="md:col-span-4 lg:col-span-5 space-y-6">
                    <InventoryChart />
                </div>
                <div className="md:col-span-3 lg:col-span-2">
                    <RecentActivity />
                </div>
            </div>
        </div>
    )
}
