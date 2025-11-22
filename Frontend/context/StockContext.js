"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useAuth } from "./AuthContext";

const StockContext = createContext();

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api/v1";

export function StockProvider({ children }) {
  const { isAuthenticated, loading: authLoading } = useAuth();

  // UI Navigation (Dashboard → Products → Operations)
  const [currentView, setCurrentView] = useState("dashboard");
  const [activeOperationTab, setActiveOperationTab] = useState("receipts");

  // DATA STATES
  const [warehouses, setWarehouses] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [movements, setMovements] = useState([]);
  const [operations, setOperations] = useState([]);

  // UI STATE
  const [theme, setTheme] = useState("light");
  const [loading, setLoading] = useState(true);

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // BASIC FETCH HELPER (with token)
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

    return {
      success: res.ok,
      status: res.status,
      data: data.data || [],
      message: data.message,
    };
  };

  // LOAD ALL (WAREHOUSE / CATEGORIES / PRODUCTS / MOVEMENTS / OPERATIONS)
  const fetchAll = async () => {
    setLoading(true);

    if (!isAuthenticated || !token) {
      setLoading(false);
      return;
    }

    const [w, c, p, m, o] = await Promise.all([
      api("/warehouses"),
      api("/categories"),
      api("/products"),
      api("/movements"),
      api("/operations"),
    ]);

    setWarehouses(w.data || []);
    setCategories(c.data || []);
    setProducts(p.data || []);
    setMovements(m.data || []);
    setOperations(o.data || []);

    setLoading(false);
  };

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      fetchAll();
    }
  }, [authLoading, isAuthenticated]);

  // DERIVED: Add totalStock + stockByLocation normalization
  const productsWithTotals = useMemo(() => {
    return products.map((p) => {
      const stockByLocation = p.stockByLocation || {};
      const totalStock = Object.values(stockByLocation).reduce(
        (sum, q) => sum + Number(q || 0),
        0
      );

      return { ...p, totalStock };
    });
  }, [products]);

  // DASHBOARD SUMMARY STATS
  const stats = useMemo(() => {
    const totalProducts = productsWithTotals.length;

    const lowStockItems =
      productsWithTotals.filter(
        (p) => Number(p.totalStock) <= Number(p.reorderPoint)
      ) || [];

    const totalValue = productsWithTotals.reduce(
      (sum, p) => sum + p.totalStock * Number(p.price || 0),
      0
    );

    return {
      totalProducts,
      lowStockCount: lowStockItems.length,
      totalValue,
      lowStockItems,
    };
  }, [productsWithTotals]);

  // CRUD: WAREHOUSE
  const addWarehouse = async (data) => {
    const res = await api("/warehouses", {
      method: "POST",
      body: JSON.stringify(data),
    });

    if (res.success) setWarehouses([...warehouses, res.data]);
    return res;
  };

  // CRUD: CATEGORY
  const addCategory = async (data) => {
    const res = await api("/categories", {
      method: "POST",
      body: JSON.stringify(data),
    });

    if (res.success) setCategories([...categories, res.data]);
    return res;
  };

  // CRUD: PRODUCT
  const addProduct = async (data) => {
    const res = await api("/products", {
      method: "POST",
      body: JSON.stringify(data),
    });

    if (res.success) setProducts([...products, res.data]);
    return res;
  };

  const updateProduct = async (id, updates) => {
    const res = await api(`/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(updates),
    });

    if (res.success) {
      setProducts(products.map((p) => (p.id === id ? res.data : p)));
    }

    return res;
  };

  const deleteProduct = async (id) => {
    const res = await api(`/products/${id}`, { method: "DELETE" });

    if (res.success) {
      setProducts(products.filter((p) => p.id !== id));
    }

    return res;
  };

  // OPERATIONS (Receipts, Deliveries, Adjustments)
  const addOperation = async (data) => {
    const res = await api("/operations", {
      method: "POST",
      body: JSON.stringify(data),
    });

    if (res.success) setOperations([res.data, ...operations]);

    return res;
  };

  const validateOperation = async (operationId) => {
    const res = await api(`/operations/${operationId}/validate`, {
      method: "POST",
    });

    if (res.success) fetchAll(); // refresh all stock & movement

    return res;
  };

  // MOVEMENTS (simple stock history)
  const addMovement = async (data) => {
    const res = await api("/movements", {
      method: "POST",
      body: JSON.stringify(data),
    });

    if (res.success) setMovements([res.data, ...movements]);

    return res;
  };

  const toggleTheme = () =>
    setTheme((t) => (t === "dark" ? "light" : "dark"));

  return (
    <StockContext.Provider
      value={{
        // UI
        loading,
        theme,
        toggleTheme,
        currentView,
        setCurrentView,
        activeOperationTab,
        setActiveOperationTab,

        // Data
        warehouses,
        categories,
        products: productsWithTotals,
        rawProducts: products,
        movements,
        operations,
        stats,

        // CRUD
        addWarehouse,
        addCategory,
        addProduct,
        updateProduct,
        deleteProduct,
        addOperation,
        validateOperation,
        addMovement,

        reload: fetchAll,
      }}
    >
      {children}
    </StockContext.Provider>
  );
}

export const useStock = () => useContext(StockContext);
