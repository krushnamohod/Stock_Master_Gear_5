"use client";

import { createContext, useContext, useEffect, useState, useMemo } from "react";
import { useAuth } from "./AuthContext";

const StockContext = createContext();

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api/v1";

export function StockProvider({ children }) {
  const { token, isAuthenticated, loading: authLoading } = useAuth();

  // UI State
  const [currentView, setCurrentView] = useState("dashboard");
  const [activeOperationTab, setActiveOperationTab] = useState("receipts");
  const [theme, setTheme] = useState("light");

  // API Data
  const [warehouses, setWarehouses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [movements, setMovements] = useState([]); // audit trail
  const [operations, setOperations] = useState([]); // receipts + deliveries + transfers + adjustments

  const [loading, setLoading] = useState(true);

  // API Caller Helper
  const api = async (endpoint, options = {}) => {
    const headers = {
      "Content-Type": "application/json",
      ...(options.headers || {})
    };

    if (token) headers["Authorization"] = `Bearer ${token}`;

    const res = await fetch(`${API}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await res.json().catch(() => ({}));

    return data; // always returns { success, data, ... }
  };

  // Load All Data
  const fetchAll = async () => {
    if (!isAuthenticated || !token) {
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const [
        wh, cat, prod,
        receipts, deliveries,
        transfers, adjustments,
        ledger
      ] = await Promise.all([
        api("/warehouses"),
        api("/categories"),
        api("/products"),
        api("/receipts"),
        api("/deliveries"),
        api("/transfers"),
        api("/adjustments"),
        api("/ledger")
      ]);

      setWarehouses(wh.data || []);
      setCategories(cat.data || []);

      // ensure products have stockByLocation
      const normalizedProducts = (prod.data || []).map(p => ({
        ...p,
        stockByLocation: p.stockByLocation || {},
      }));

      setProducts(normalizedProducts);

      // merge all operations
      const mergedOps = [
        ...(receipts.data || []).map(op => ({ ...op, type: "RECEIPT" })),
        ...(deliveries.data || []).map(op => ({ ...op, type: "DELIVERY" })),
        ...(transfers.data || []).map(op => ({ ...op, type: "TRANSFER" })),
        ...(adjustments.data || []).map(op => ({ ...op, type: "ADJUSTMENT" })),
      ];

      setOperations(mergedOps);

      // movement history
      setMovements(ledger.data || []);

    } catch (e) {
      console.error("Stock load error", e);
    }

    setLoading(false);
  };

  useEffect(() => {
    if (!authLoading) fetchAll();
  }, [authLoading, isAuthenticated, token]);

  // Derived Product Stats
  const productsWithTotals = useMemo(() => {
    return products.map(p => {
      const totalStock = Object.values(p.stockByLocation || {})
        .reduce((s, q) => s + Number(q || 0), 0);

      return { ...p, totalStock };
    });
  }, [products]);

  const stats = useMemo(() => {
    const totalProducts = productsWithTotals.length;

    const lowStockItems = productsWithTotals.filter(
      p => Number(p.totalStock) <= Number(p.reorderPoint || 0)
    );

    const totalValue = productsWithTotals.reduce(
      (sum, p) => sum + (p.totalStock * (p.price || 0)),
      0
    );

    return {
      totalProducts,
      lowStockCount: lowStockItems.length,
      totalValue,
      lowStockItems,
    };
  }, [productsWithTotals]);

  // CRUD Functions
  const addProduct = async (payload) => {
    const res = await api("/products", {
      method: "POST",
      body: JSON.stringify(payload)
    });
    if (res.success) {
      setProducts(prev => [...prev, res.data]);
    }
    return res;
  };

  const updateProduct = async (id, payload) => {
    const res = await api(`/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
    if (res.success) {
      setProducts(prev => prev.map(p => p.id === id ? res.data : p));
    }
    return res;
  };

  const deleteProduct = async (id) => {
    const res = await api(`/products/${id}`, { method: "DELETE" });
    if (res.success) {
      setProducts(prev => prev.filter(p => p.id !== id));
    }
    return res;
  };

  const addWarehouse = async (payload) => {
    const res = await api("/warehouses", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    if (res.success) {
      setWarehouses(prev => [...prev, res.data]);
    }
    return res;
  };

  const addCategory = async (payload) => {
    const res = await api("/categories", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    if (res.success) {
      setCategories(prev => [...prev, res.data]);
    }
    return res;
  };

  const addOperation = async (payload) => {
    const res = await api(`/${payload.type.toLowerCase()}s`, {
      method: "POST",
      body: JSON.stringify(payload),
    });

    if (res.success) {
      setOperations(prev => [res.data, ...prev]);
    }

    return res;
  };

  const toggleTheme = () => setTheme(t => t === "dark" ? "light" : "dark");

  // Final Value
  return (
    <StockContext.Provider
      value={{
        loading,
        theme,
        toggleTheme,

        currentView,
        setCurrentView,
        activeOperationTab,
        setActiveOperationTab,

        warehouses,
        products: productsWithTotals,
        rawProducts: products,
        categories,
        operations,
        movements,

        stats,

        addProduct,
        updateProduct,
        deleteProduct,
        addCategory,
        addWarehouse,
        addOperation,
        reload: fetchAll,
      }}
    >
      {children}
    </StockContext.Provider>
  );
}

export const useStock = () => useContext(StockContext);
