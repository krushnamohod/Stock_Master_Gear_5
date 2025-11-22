"use client"

import { InventoryChart } from "@/components/dashboard/InventoryChart"
import { KPICard } from "@/components/dashboard/KPICard"
import { OperationSummaryCard } from "@/components/dashboard/OperationSummaryCard"
import { QuickActions } from "@/components/dashboard/QuickActions"
import { RecentActivity } from "@/components/dashboard/RecentActivity"
import { useStock } from "@/context/StockContext"
import { cn } from "@/lib/utils"
import { AlertTriangle, ArrowDownLeft, ArrowUpRight, Package } from "lucide-react"

export function DashboardView() {
    const {
        stats,
        theme,
        operations = [],     // 🛡️ Safe default
        loading = false,     // 🛡️ Safe default
        setCurrentView,
        setActiveOperationTab
    } = useStock()

    // 🛡️ Do not calculate anything until StockContext has finished loading
    if (loading) {
        return (
            <div className="p-8 text-center text-slate-500">
                Loading dashboard...
            </div>
        )
    }

    // 🛡️ If operations is empty, prevent crashes
    const safeOperations = Array.isArray(operations) ? operations : []

    const getOperationStats = (type) => {
        const typeOps = safeOperations.filter(
            op => op.type === type && op.status !== "Cancelled"
        )

        const today = new Date().toISOString().split("T")[0]

        const readyCount = typeOps.filter(op => op.status === "Ready").length
        const waitingCount = typeOps.filter(op => op.status === "Waiting").length

        const activeOps = typeOps.filter(op => op.status !== "Done")

        const lateCount = activeOps.filter(op => op.scheduledDate < today).length
        const upcomingCount = activeOps.filter(op => op.scheduledDate > today).length

        return { readyCount, waitingCount, lateCount, upcomingCount }
    }

    const receiptStats = getOperationStats("RECEIPT")
    const deliveryStats = getOperationStats("DELIVERY")

    const handleNavigate = (tab) => {
        setActiveOperationTab(tab)
        setCurrentView("operations")
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className={cn("text-2xl font-bold tracking-tight", theme === "dark" ? "text-white" : "text-slate-900")}>
                        Dashboard
                    </h1>
                    <p className={cn("text-sm", theme === "dark" ? "text-slate-400" : "text-slate-500")}>
                        Overview of your inventory performance.
                    </p>
                </div>
                <QuickActions />
            </div>

            {/* Operation Summary */}
            <div className="grid gap-6 md:grid-cols-2">
                <OperationSummaryCard
                    title="Receipts"
                    count={receiptStats.readyCount}
                    label="To Receive"
                    stats={[
                        { label: "Late", count: receiptStats.lateCount, isLate: true },
                        { label: "Operations", count: receiptStats.upcomingCount }
                    ]}
                    onClick={() => handleNavigate("receipts")}
                />
                <OperationSummaryCard
                    title="Delivery Orders"
                    count={deliveryStats.readyCount}
                    label="To Deliver"
                    stats={[
                        { label: "Late", count: deliveryStats.lateCount, isLate: true },
                        { label: "Waiting", count: deliveryStats.waitingCount },
                        { label: "Operations", count: deliveryStats.upcomingCount }
                    ]}
                    onClick={() => handleNavigate("deliveries")}
                />
            </div>

            {/* KPI Cards */}
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
                    value={deliveryStats.readyCount + deliveryStats.waitingCount}
                    icon={ArrowUpRight}
                    description={`${deliveryStats.lateCount} late`}
                />
            </div>

            {/* Charts & Recent Activity */}
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
