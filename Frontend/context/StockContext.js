"use client";

import { createContext, useContext, useState } from "react";

const StockContext = createContext();

export function StockProvider({ children }) {
    /**
     * ⚠️ SAFE DEFAULTS
     * Everything starts as EMPTY ARRAYS to prevent:
     * - map of undefined
     * - filter of undefined
     * - length of undefined
     * - reduce of undefined
     */
    const [products, setProducts] = useState([]);
    const [warehouses, setWarehouses] = useState([]);
    const [categories, setCategories] = useState([]);
    const [movements, setMovements] = useState([]);
    const [operations, setOperations] = useState([]);

    const [currentView, setCurrentView] = useState("dashboard");
    const [activeOperationTab, setActiveOperationTab] = useState("receipts");
    const [theme, setTheme] = useState("light");

    /** Helper to enforce arrays */
    const safeArray = (value) => (Array.isArray(value) ? value : []);

    /** Safe total stock calculation */
    const getTotalStock = (stockByLocation) => {
        if (!stockByLocation || typeof stockByLocation !== "object") return 0;

        return Object.values(stockByLocation).reduce((sum, qty) => {
            const n = parseInt(qty);
            return sum + (isNaN(n) ? 0 : n);
        }, 0);
    };

    /* ================================
       SAFE DERIVED STATES
    ================================= */

    const productsList = safeArray(products);

    const productsWithTotalStock = productsList.map((p) => ({
        ...p,
        totalStock: getTotalStock(p.stockByLocation),
    }));

    const lowStockItems = productsWithTotalStock.filter(
        (p) => p.totalStock <= p.reorderPoint
    );

    const totalInventoryValue = productsWithTotalStock.reduce((sum, p) => {
        return sum + (p.totalStock * (p.price || 0));
    }, 0);

    const stats = {
        totalProducts: productsList.length,
        lowStockCount: lowStockItems.length,
        totalValue: totalInventoryValue,
        lowStockItems,
    };

    /* ================================
       ACTIONS
    ================================= */

    const addProduct = (product) => {
        setProducts((prev) => [...prev, product]);
    };

    const updateProduct = (id, updates) => {
        setProducts((prev) =>
            prev.map((p) =>
                p.id === id ? { ...p, ...updates } : p
            )
        );
    };

    const deleteProduct = (id) => {
        setProducts((prev) => prev.filter((p) => p.id !== id));
    };

    const addCategory = (category) => {
        setCategories((prev) => [...prev, category]);
    };

    const addMovement = (movement) => {
        setMovements((prev) => [movement, ...prev]);
    };

    const addOperation = (op) => {
        setOperations((prev) => [...prev, op]);
    };

    const updateOperation = (id, updates) => {
        setOperations((prev) =>
            prev.map((op) =>
                op.id === id ? { ...op, ...updates } : op
            )
        );
    };

    const toggleTheme = () => {
        setTheme((prev) => (prev === "light" ? "dark" : "dark"));
    };

    /* ================================
       PROVIDER RETURN
    ================================= */

    return (
        <StockContext.Provider
            value={{
                // SAFE ARRAYS
                products: productsWithTotalStock,
                warehouses: safeArray(warehouses),
                categories: safeArray(categories),
                movements: safeArray(movements),
                operations: safeArray(operations),

                // UI state
                currentView,
                setCurrentView,
                activeOperationTab,
                setActiveOperationTab,
                theme,
                toggleTheme,

                // Actions
                addProduct,
                updateProduct,
                deleteProduct,
                addCategory,
                addMovement,
                addOperation,
                updateOperation,

                // Stats
                stats,
                getTotalStock,
            }}
        >
            {children}
        </StockContext.Provider>
    );
}

export const useStock = () => useContext(StockContext);
