"use client"

import { createContext, useContext, useEffect, useMemo, useState } from "react"

// --- OPTIONAL: keep your initial mock data as a fallback when backend is unreachable ---
// (copied / adapted from your original data)
const FALLBACK_PRODUCTS = [ /* ...copy INITIAL_PRODUCTS items here if you want fallback... */ ]
const FALLBACK_WAREHOUSES = [ /* ...copy INITIAL_WAREHOUSES items... */ ]
const FALLBACK_CATEGORIES = [ /* ...copy INITIAL_CATEGORIES items... */ ]
const FALLBACK_MOVEMENTS = [ /* ...copy INITIAL_MOVEMENTS items... */ ]

const StockContext = createContext()

export function StockProvider({ children }) {
  const [products, setProducts] = useState([]) // array of product objects from backend
  const [warehouses, setWarehouses] = useState([])
  const [categories, setCategories] = useState([])
  const [movements, setMovements] = useState([])
  const [theme, setTheme] = useState("light")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api/v1"

  // Helper: get token from localStorage (AuthContext stores it there)
  const getAuthHeaders = () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
    return token ? { Authorization: `Bearer ${token}` } : {}
  }

  // ------- Data loaders (backend calls) -------
  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_BASE}/products`, {
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
      })
      if (!res.ok) throw new Error("Failed to fetch products")
      const data = await res.json()
      // normalize: map Prisma product objects to the shape used in the app
      // Example: data = [{ id, name, sku, uom, createdAt, updatedAt, stock: [...] }]
      const normalized = (data || []).map((p) => {
        // build stockByLocation from product.stock rows if present
        const stockByLocation = {}
        if (p.stock && Array.isArray(p.stock)) {
          p.stock.forEach((s) => {
            stockByLocation[s.locationId] = s.quantity
          })
        }
        return {
          id: p.id,
          name: p.name,
          sku: p.sku,
          category: p.category?.name || null,
          barcode: p.barcode || null,
          cost: p.cost || 0,
          price: p.price || 0,
          dateAdded: p.createdAt || p.dateAdded,
          reorderPoint: p.reorderPoint ?? 0,
          reorderQuantity: p.reorderQuantity ?? 0,
          stockByLocation,
          raw: p,
        }
      })
      setProducts(normalized)
      return normalized
    } catch (err) {
      // fallback: if first time load and we have fallback data, use it
      if (products.length === 0 && FALLBACK_PRODUCTS && FALLBACK_PRODUCTS.length) {
        setProducts(FALLBACK_PRODUCTS)
      }
      console.warn("fetchProducts:", err)
      throw err
    }
  }

  const fetchWarehouses = async () => {
    try {
      const res = await fetch(`${API_BASE}/warehouses?includeLocations=true`, {
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
      })
      if (!res.ok) throw new Error("Failed to fetch warehouses")
      const data = await res.json()
      setWarehouses(data)
      return data
    } catch (err) {
      if (warehouses.length === 0 && FALLBACK_WAREHOUSES) setWarehouses(FALLBACK_WAREHOUSES)
      console.warn("fetchWarehouses:", err)
      throw err
    }
  }

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API_BASE}/categories`, {
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
      })
      if (!res.ok) throw new Error("Failed to fetch categories")
      const data = await res.json()
      setCategories(data)
      return data
    } catch (err) {
      if (categories.length === 0 && FALLBACK_CATEGORIES) setCategories(FALLBACK_CATEGORIES)
      console.warn("fetchCategories:", err)
      throw err
    }
  }

  const fetchMovements = async () => {
    try {
      const res = await fetch(`${API_BASE}/ledger?page=1&pageSize=200`, {
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
      })
      if (!res.ok) throw new Error("Failed to fetch movements")
      const payload = await res.json()
      // payload.data expected (pagination wrapper)
      const rows = payload?.data || payload || []
      // map ledger entries to your movement shape
      const mapped = rows.map((r) => ({
        id: r.id,
        reference: r.reference || "",
        date: r.createdAt,
        type: r.type,
        contact: r.note || "",
        fromWarehouse: null,
        toWarehouse: null,
        productId: r.productId,
        productName: r.product?.name || "",
        quantity: r.change,
        status: "Done",
        notes: r.note || ""
      }))
      setMovements(mapped)
      return mapped
    } catch (err) {
      if (movements.length === 0 && FALLBACK_MOVEMENTS) setMovements(FALLBACK_MOVEMENTS)
      console.warn("fetchMovements:", err)
      throw err
    }
  }

  // Combined refresh
  const refresh = async () => {
    setLoading(true)
    setError(null)
    try {
      await Promise.allSettled([fetchProducts(), fetchWarehouses(), fetchCategories(), fetchMovements()])
    } catch (err) {
      setError(err.message || "Failed to load data")
    } finally {
      setLoading(false)
    }
  }

  // Load on mount
  useEffect(() => {
    refresh()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ------- Actions (create/update) using the API (optimistic updates optional) -------
  const addProduct = async (payload) => {
    try {
      const res = await fetch(`${API_BASE}/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.message || "Failed to create product")
      }
      const data = await res.json()
      // Append normalized product
      await refresh() // simple: re-fetch after create
      return { success: true, product: data.product || data }
    } catch (err) {
      return { success: false, error: err.message }
    }
  }

  const updateProduct = async (id, updates) => {
    try {
      const res = await fetch(`${API_BASE}/products/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
        body: JSON.stringify(updates),
      })
      if (!res.ok) throw new Error("Failed to update product")
      await refresh()
      return { success: true }
    } catch (err) {
      return { success: false, error: err.message }
    }
  }

  const deleteProduct = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/products/${id}`, {
        method: "DELETE",
        headers: { ...getAuthHeaders() },
      })
      if (!res.ok) throw new Error("Failed to delete product")
      await refresh()
      return { success: true }
    } catch (err) {
      return { success: false, error: err.message }
    }
  }

  const addMovement = async (movementPayload) => {
    // For receipts/deliveries/transfers/adjustments call the matching endpoint.
    // This helper accepts a movement-like payload and routes to an endpoint:
    // type: "RECEIPT" -> POST /receipts
    // type: "DELIVERY" -> POST /deliveries
    // type: "TRANSFER" -> POST /transfers
    // type: "ADJUSTMENT" -> POST /adjustments
    try {
      let endpoint = null
      const body = movementPayload

      if (movementPayload.type === "RECEIPT") {
        endpoint = "receipts"
      } else if (movementPayload.type === "DELIVERY") {
        endpoint = "deliveries"
      } else if (movementPayload.type === "TRANSFER") {
        endpoint = "transfers"
      } else if (movementPayload.type === "ADJUSTMENT") {
        endpoint = "adjustments"
      } else {
        throw new Error("Unsupported movement type")
      }

      const res = await fetch(`${API_BASE}/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
        body: JSON.stringify(body),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.message || "Failed to create movement")
      }
      const data = await res.json()
      await refresh()
      return { success: true, data }
    } catch (err) {
      return { success: false, error: err.message }
    }
  }

  // Location stock view (use backend /locations/:id/stock or stock endpoint)
  const fetchLocationStock = async (locationId, { page = 1, pageSize = 50, q = "" } = {}) => {
    try {
      const url = new URL(`${API_BASE}/locations/${locationId}/stock`, window?.location?.origin)
      url.searchParams.set("page", page)
      url.searchParams.set("pageSize", pageSize)
      if (q) url.searchParams.set("q", q)

      const res = await fetch(url.toString(), {
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
      })
      if (!res.ok) throw new Error("Failed to fetch location stock")
      const payload = await res.json()
      return { success: true, data: payload }
    } catch (err) {
      return { success: false, error: err.message }
    }
  }

  // ------- Derived stats (memoized) -------
  const stats = useMemo(() => {
    // if backend provided products, compute totals
    const list = products || []
    const totalProducts = list.length
    const productsWithTotalStock = list.map((p) => {
      const totalStock = Object.values(p.stockByLocation || {}).reduce((s, v) => s + (Number(v) || 0), 0)
      return { ...p, totalStock }
    })
    const lowStockItems = productsWithTotalStock.filter((p) => p.totalStock <= (p.reorderPoint || 0))
    const totalInventoryValue = productsWithTotalStock.reduce((acc, p) => acc + (p.totalStock * (p.price || 0)), 0)

    return {
      totalProducts,
      lowStockCount: lowStockItems.length,
      totalValue: totalInventoryValue,
      lowStockItems,
    }
  }, [products])

  // toggle theme
  const toggleTheme = () => setTheme((t) => (t === "light" ? "dark" : "light"))

  return (
    <StockContext.Provider
      value={{
        products,
        warehouses,
        categories,
        movements,
        theme,
        toggleTheme,
        loading,
        error,
        refresh,
        addProduct,
        updateProduct,
        deleteProduct,
        addMovement,
        fetchLocationStock,
        getTotalStock: (stockByLocation) =>
          Object.values(stockByLocation || {}).reduce((s, v) => s + (Number(v) || 0), 0),
        stats,
      }}
    >
      {children}
    </StockContext.Provider>
  )
}

export const useStock = () => useContext(StockContext)
