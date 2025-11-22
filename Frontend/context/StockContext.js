"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

const StockContext = createContext();
const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api/v1";

export function StockProvider({ children }) {
  const { token, isAuthenticated, loading: authLoading } = useAuth();

  // UI state
  const [currentView, setCurrentView] = useState("dashboard");
  const [activeOperationTab, setActiveOperationTab] = useState("receipts");

  // Data
  const [warehouses, setWarehouses] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [movements, setMovements] = useState([]);
  const [operations, setOperations] = useState([]);

  // Loading
  const [loading, setLoading] = useState(true);

  // ------------- API HELPER (NO success wrapper required) ------------
  const api = async (endpoint, method = "GET", body = null) => {
    const options = {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
    };

    if (body) options.body = JSON.stringify(body);

    const res = await fetch(`${API}${endpoint}`, options);

    // If 404 → return empty array/object
    if (res.status === 404) return [];

    let data;
    try {
      data = await res.json();
    } catch {
      data = [];
    }

    return data; // backend returns raw arrays
  };

  // ---------------------- LOAD DATA ------------------------
  const fetchAll = async () => {
    setLoading(true);

    if (!isAuthenticated || !token) {
      setWarehouses([]);
      setCategories([]);
      setProducts([]);
      setMovements([]);
      setOperations([]);
      setLoading(false);
      return;
    }

    try {
      const [wh, cat, prod] = await Promise.all([
        api("/warehouses"),
        api("/categories"),
        api("/products"),
      ]);

      setWarehouses(Array.isArray(wh) ? wh : []);
      setCategories(Array.isArray(cat) ? cat : []);
      setProducts(Array.isArray(prod) ? prod : []);
      setMovements([]); // no backend yet
      setOperations([]); // no backend yet
    } catch (error) {
      console.error("Stock fetch error:", error);
    }

    setLoading(false);
  };

  useEffect(() => {
    if (!authLoading) fetchAll();
  }, [authLoading, isAuthenticated, token]);

  // ---------------------- STATS ------------------------
  const stats = {
    totalProducts: products.length,
    lowStockCount: products.filter((p) => (p.totalStock || 0) <= (p.reorderPoint || 0)).length,
    totalValue: products.reduce(
      (sum, p) => sum + (p.totalStock || 0) * (p.price || 0),
      0
    ),
  };

  // ---------------------- PROVIDER VALUE ------------------------
  return (
    <StockContext.Provider
      value={{
        loading,
        warehouses,
        products,
        categories,
        movements,
        operations,

        stats,

        currentView,
        setCurrentView,
        activeOperationTab,
        setActiveOperationTab,

        reload: fetchAll,
      }}
    >
      {children}
    </StockContext.Provider>
  );
}

export const useStock = () => useContext(StockContext);
