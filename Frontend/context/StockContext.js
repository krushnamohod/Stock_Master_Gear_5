"use client"

import { createContext, useContext, useState } from 'react'

const StockContext = createContext()

const INITIAL_PRODUCTS = [
    {
        id: 1,
        name: "Laptop Pro X1",
        sku: "TECH-001",
        category: "Electronics",
        barcode: "1234567890123",
        cost: 900,
        price: 1200,
        dateAdded: "2024-01-15T10:30:00.000Z",
        reorderPoint: 10,
        reorderQuantity: 20,
        stockByLocation: { 1: 30, 2: 15 } // warehouseId: quantity
    },
    {
        id: 2,
        name: "Wireless Mouse",
        sku: "TECH-002",
        category: "Electronics",
        barcode: "2345678901234",
        cost: 15,
        price: 25,
        dateAdded: "2024-01-16T09:00:00.000Z",
        reorderPoint: 30,
        reorderQuantity: 50,
        stockByLocation: { 1: 80, 3: 40 }
    },
    {
        id: 3,
        name: "Ergo Chair",
        sku: "FURN-001",
        category: "Furniture",
        barcode: "3456789012345",
        cost: 250,
        price: 350,
        dateAdded: "2024-01-20T14:15:00.000Z",
        reorderPoint: 5,
        reorderQuantity: 10,
        stockByLocation: { 2: 12 }
    },
    {
        id: 4,
        name: "Standing Desk",
        sku: "FURN-002",
        category: "Furniture",
        barcode: "4567890123456",
        cost: 350,
        price: 500,
        dateAdded: "2024-01-22T11:00:00.000Z",
        reorderPoint: 5,
        reorderQuantity: 8,
        stockByLocation: { 2: 8 }
    },
    {
        id: 5,
        name: "Monitor 27\"",
        sku: "TECH-003",
        category: "Electronics",
        barcode: "5678901234567",
        cost: 200,
        price: 300,
        dateAdded: "2024-01-25T08:30:00.000Z",
        reorderPoint: 15,
        reorderQuantity: 25,
        stockByLocation: { 1: 2 } // Low stock!
    },
    {
        id: 6,
        name: "Mechanical Keyboard",
        sku: "TECH-004",
        category: "Electronics",
        barcode: "6789012345678",
        cost: 100,
        price: 150,
        dateAdded: "2024-02-01T13:00:00.000Z",
        reorderPoint: 20,
        reorderQuantity: 30,
        stockByLocation: { 3: 50 }
    },
    {
        id: 7,
        name: "USB-C Hub",
        sku: "ACC-001",
        category: "Accessories",
        barcode: "7890123456789",
        cost: 25,
        price: 45,
        dateAdded: "2024-02-05T10:00:00.000Z",
        reorderPoint: 50,
        reorderQuantity: 100,
        stockByLocation: { 3: 200 }
    },
    {
        id: 8,
        name: "Webcam 4K",
        sku: "TECH-005",
        category: "Electronics",
        barcode: "8901234567890",
        cost: 80,
        price: 120,
        dateAdded: "2024-02-10T15:30:00.000Z",
        reorderPoint: 10,
        reorderQuantity: 15,
        stockByLocation: { 1: 15 }
    },
    {
        id: 9,
        name: "Office Lamp",
        sku: "FURN-003",
        category: "Furniture",
        barcode: "9012345678901",
        cost: 25,
        price: 40,
        dateAdded: "2024-02-12T09:45:00.000Z",
        reorderPoint: 20,
        reorderQuantity: 30,
        stockByLocation: { 2: 60 }
    },
    {
        id: 10,
        name: "Notebook Set",
        sku: "STAT-001",
        category: "Stationery",
        barcode: "0123456789012",
        cost: 8,
        price: 15,
        dateAdded: "2024-02-15T11:20:00.000Z",
        reorderPoint: 100,
        reorderQuantity: 200,
        stockByLocation: { 3: 500 }
    },
]

const INITIAL_WAREHOUSES = [
    { id: 1, name: "Warehouse A", address: "123 Industrial Blvd, Tech City" },
    { id: 2, name: "Warehouse B", address: "456 Logistics Way, Furniton" },
    { id: 3, name: "Store B", address: "789 Retail Row, Commerceville" },
]

const INITIAL_CATEGORIES = [
    { id: 1, name: "Electronics", description: "Electronic devices and gadgets" },
    { id: 2, name: "Furniture", description: "Office and home furniture" },
    { id: 3, name: "Accessories", description: "Computer and office accessories" },
    { id: 4, name: "Stationery", description: "Office supplies and stationery" },
]

const INITIAL_MOVEMENTS = [
    {
        id: 101,
        reference: "PO-2023-001",
        date: "2024-02-20",
        type: "IN",
        contact: "Tech Supplies Inc.",
        fromWarehouse: "",
        toWarehouse: "Warehouse A",
        productId: 1,
        productName: "Laptop Pro X1",
        quantity: 50,
        status: "Done",
        notes: "Initial stock purchase"
    },
    {
        id: 102,
        reference: "ORD-9921",
        date: "2024-02-21",
        type: "OUT",
        contact: "Acme Corp",
        fromWarehouse: "Warehouse A",
        toWarehouse: "",
        productId: 1,
        productName: "Laptop Pro X1",
        quantity: 5,
        status: "Done",
        notes: "Customer order fulfillment"
    },
    {
        id: 103,
        reference: "PO-2023-002",
        date: "2024-02-22",
        type: "IN",
        contact: "Electronics Wholesale",
        fromWarehouse: "",
        toWarehouse: "Warehouse A",
        productId: 2,
        productName: "Wireless Mouse",
        quantity: 100,
        status: "Done",
        notes: ""
    },
    {
        id: 104,
        reference: "Audit-Q3",
        date: "2024-02-23",
        type: "ADJ",
        contact: "Internal Audit Team",
        fromWarehouse: "Warehouse A",
        toWarehouse: "Warehouse A",
        productId: 5,
        productName: "Monitor 27\"",
        quantity: -1,
        status: "Done",
        notes: "Damage adjustment"
    },
    {
        id: 105,
        reference: "TRF-2024-001",
        date: "2024-02-24",
        type: "OUT",
        contact: "Store B Transfer",
        fromWarehouse: "Warehouse A",
        toWarehouse: "Store B",
        productId: 6,
        productName: "Mechanical Keyboard",
        quantity: 20,
        status: "Ready",
        notes: "Inter-warehouse transfer"
    },
    {
        id: 106,
        reference: "ORD-9925",
        date: "2024-02-25",
        type: "OUT",
        contact: "Beta Solutions",
        fromWarehouse: "Store B",
        toWarehouse: "",
        productId: 7,
        productName: "USB-C Hub",
        quantity: 50,
        status: "Draft",
        notes: "Pending approval"
    },
]

export function StockProvider({ children }) {
    const [products, setProducts] = useState(INITIAL_PRODUCTS)
    const [warehouses, setWarehouses] = useState(INITIAL_WAREHOUSES)
    const [categories, setCategories] = useState(INITIAL_CATEGORIES)
    const [movements, setMovements] = useState(INITIAL_MOVEMENTS)
    const [currentView, setCurrentView] = useState('dashboard')
    const [theme, setTheme] = useState('light')

    // Helper to calculate total stock from stockByLocation
    const getTotalStock = (stockByLocation) => {
        return Object.values(stockByLocation || {}).reduce((sum, qty) => sum + qty, 0)
    }

    // Derived State
    const totalProducts = products.length
    const productsWithTotalStock = products.map(p => ({
        ...p,
        totalStock: getTotalStock(p.stockByLocation)
    }))
    const lowStockItems = productsWithTotalStock.filter(p => p.totalStock <= p.reorderPoint)
    const totalInventoryValue = productsWithTotalStock.reduce((acc, p) => acc + (p.totalStock * p.price), 0)

    // Actions
    const addProduct = (product) => {
        const newProduct = {
            ...product,
            id: Date.now(),
            dateAdded: new Date().toISOString() // Auto-generate timestamp
        }
        setProducts([...products, newProduct])
    }

    const updateProduct = (id, updates) => {
        setProducts(products.map(p =>
            p.id === id ? { ...p, ...updates, dateAdded: p.dateAdded } : p // Preserve dateAdded
        ))
    }

    const deleteProduct = (id) => {
        setProducts(products.filter(p => p.id !== id))
    }

    const addMovement = (movement) => {
        const newMovement = {
            ...movement,
            id: Date.now(),
            date: movement.date || new Date().toISOString().split('T')[0]
        }
        setMovements([newMovement, ...movements])

        // Update stock level only if status is 'Done'
        if (movement.status === 'Done') {
            const product = products.find(p => p.id === parseInt(movement.productId))
            if (product) {
                const updatedStockByLocation = { ...product.stockByLocation }

                // Determine which warehouse to update
                let warehouseId
                if (movement.type === 'IN' && movement.toWarehouse) {
                    const warehouse = warehouses.find(w => w.name === movement.toWarehouse)
                    warehouseId = warehouse?.id
                } else if (movement.type === 'OUT' && movement.fromWarehouse) {
                    const warehouse = warehouses.find(w => w.name === movement.fromWarehouse)
                    warehouseId = warehouse?.id
                } else if (movement.type === 'ADJ' && movement.fromWarehouse) {
                    const warehouse = warehouses.find(w => w.name === movement.fromWarehouse)
                    warehouseId = warehouse?.id
                }

                if (warehouseId) {
                    const currentStock = updatedStockByLocation[warehouseId] || 0

                    if (movement.type === 'IN') {
                        updatedStockByLocation[warehouseId] = currentStock + parseInt(movement.quantity)
                    } else if (movement.type === 'OUT') {
                        updatedStockByLocation[warehouseId] = Math.max(0, currentStock - parseInt(movement.quantity))
                    } else if (movement.type === 'ADJ') {
                        updatedStockByLocation[warehouseId] = currentStock + parseInt(movement.quantity)
                    }

                    updateProduct(product.id, { stockByLocation: updatedStockByLocation })
                }
            }
        }
    }

    const addCategory = (category) => {
        const newCategory = { ...category, id: Date.now() }
        setCategories([...categories, newCategory])
    }

    const toggleTheme = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light')
    }

    return (
        <StockContext.Provider value={{
            products: productsWithTotalStock,
            warehouses,
            categories,
            movements,
            currentView,
            setCurrentView,
            theme,
            toggleTheme,
            addProduct,
            updateProduct,
            deleteProduct,
            addMovement,
            addCategory,
            getTotalStock,
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

