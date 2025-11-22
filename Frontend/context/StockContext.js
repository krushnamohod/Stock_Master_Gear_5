"use client"

import { createContext, useContext, useState } from 'react'

const StockContext = createContext()

const INITIAL_PRODUCTS = [
    { id: 1, name: "Laptop Pro X1", sku: "TECH-001", category: "Electronics", stock: 45, minStock: 10, price: 1200, location: "Warehouse A" },
    { id: 2, name: "Wireless Mouse", sku: "TECH-002", category: "Electronics", stock: 120, minStock: 30, price: 25, location: "Warehouse A" },
    { id: 3, name: "Ergo Chair", sku: "FURN-001", category: "Furniture", stock: 12, minStock: 5, price: 350, location: "Warehouse B" },
    { id: 4, name: "Standing Desk", sku: "FURN-002", category: "Furniture", stock: 8, minStock: 5, price: 500, location: "Warehouse B" },
    { id: 5, name: "Monitor 27\"", sku: "TECH-003", category: "Electronics", stock: 2, minStock: 15, price: 300, location: "Warehouse A" },
    { id: 6, name: "Mechanical Keyboard", sku: "TECH-004", category: "Electronics", stock: 50, minStock: 20, price: 150, location: "Store B" },
    { id: 7, name: "USB-C Hub", sku: "ACC-001", category: "Accessories", stock: 200, minStock: 50, price: 45, location: "Store B" },
    { id: 8, name: "Webcam 4K", sku: "TECH-005", category: "Electronics", stock: 15, minStock: 10, price: 120, location: "Warehouse A" },
    { id: 9, name: "Office Lamp", sku: "FURN-003", category: "Furniture", stock: 60, minStock: 20, price: 40, location: "Warehouse B" },
    { id: 10, name: "Notebook Set", sku: "STAT-001", category: "Stationery", stock: 500, minStock: 100, price: 15, location: "Store B" },
]

const INITIAL_WAREHOUSES = [
    { id: 1, name: "Warehouse A", address: "123 Industrial Blvd, Tech City" },
    { id: 2, name: "Warehouse B", address: "456 Logistics Way, Furniton" },
    { id: 3, name: "Store B", address: "789 Retail Row, Commerceville" },
]

const INITIAL_MOVEMENTS = [
    { id: 101, date: "2023-10-25", type: "IN", productId: 1, quantity: 50, reference: "PO-2023-001" },
    { id: 102, date: "2023-10-26", type: "OUT", productId: 1, quantity: 5, reference: "ORD-9921" },
    { id: 103, date: "2023-10-27", type: "IN", productId: 2, quantity: 100, reference: "PO-2023-002" },
    { id: 104, date: "2023-10-28", type: "ADJ", productId: 5, quantity: -1, reference: "Audit-Q3" },
]

export function StockProvider({ children }) {
    const [products, setProducts] = useState(INITIAL_PRODUCTS)
    const [warehouses, setWarehouses] = useState(INITIAL_WAREHOUSES)
    const [movements, setMovements] = useState(INITIAL_MOVEMENTS)
    const [currentView, setCurrentView] = useState('dashboard')
    const [theme, setTheme] = useState('light')

    // Derived State
    const totalProducts = products.length
    const lowStockItems = products.filter(p => p.stock <= p.minStock)
    const totalInventoryValue = products.reduce((acc, p) => acc + (p.stock * p.price), 0)

    // Actions
    const addProduct = (product) => {
        const newProduct = { ...product, id: Date.now() }
        setProducts([...products, newProduct])
    }

    const updateProduct = (id, updates) => {
        setProducts(products.map(p => p.id === id ? { ...p, ...updates } : p))
    }

    const addMovement = (movement) => {
        const newMovement = { ...movement, id: Date.now(), date: new Date().toISOString().split('T')[0] }
        setMovements([newMovement, ...movements])

        // Update stock level
        const product = products.find(p => p.id === parseInt(movement.productId))
        if (product) {
            let newStock = product.stock
            if (movement.type === 'IN') newStock += parseInt(movement.quantity)
            if (movement.type === 'OUT') newStock -= parseInt(movement.quantity)
            if (movement.type === 'ADJ') newStock += parseInt(movement.quantity)

            updateProduct(product.id, { stock: newStock })
        }
    }

    const toggleTheme = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light')
    }

    return (
        <StockContext.Provider value={{
            products,
            warehouses,
            movements,
            currentView,
            setCurrentView,
            theme,
            toggleTheme,
            addProduct,
            updateProduct,
            addMovement,
            stats: {
                totalProducts,
                lowStockCount: lowStockItems.length,
                totalValue: totalInventoryValue,
                lowStockItems
            }
        }}>
            {children}
        </StockContext.Provider>
    )
}

export const useStock = () => useContext(StockContext)

