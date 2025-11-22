"use client"

import { DashboardView } from "@/components/dashboard/DashboardView"
import { MoveHistoryView } from "@/components/history/MoveHistoryView"
import { Header } from "@/components/layout/Header"
import { Sidebar } from "@/components/layout/Sidebar"
import { OperationsView } from "@/components/operations/OperationsView"
import { ProductsView } from "@/components/products/ProductsView"
import { SettingsView } from "@/components/settings/SettingsView"
import { StockProvider, useStock } from "@/context/StockContext"

function MainLayout() {
    const { currentView, theme } = useStock()

    const renderView = () => {
        switch (currentView) {
            case 'dashboard': return <DashboardView />
            case 'products': return <ProductsView />
            case 'operations': return <OperationsView />
            case 'history': return <MoveHistoryView />
            case 'settings': return <SettingsView />
            default: return <DashboardView />
        }
    }

    return (
        <div className={`flex h-screen w-full overflow-hidden ${theme === 'dark' ? 'bg-slate-950' : 'bg-slate-50'}`}>
            <Sidebar />
            <div className="flex flex-1 flex-col overflow-hidden">
                <Header />
                <main className={`flex-1 overflow-y-auto p-6 transition-colors ${theme === 'dark' ? 'bg-slate-950' : 'bg-slate-50'}`}>
                    {renderView()}
                </main>
            </div>
        </div>
    )
}

export default function Home() {
    return (
        <StockProvider>
            <MainLayout />
        </StockProvider>
    )
}
