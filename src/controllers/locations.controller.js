// src/controllers/locations.controller.js
import prisma from "../config/prisma.js";

/**
 * Create a location under a warehouse
 * body: { name, code?, warehouseId }
 */
export const createLocation = async (req, res) => {
  try {
    const { name, code, warehouseId } = req.body;
    if (!name || !warehouseId) {
      return res.status(400).json({ message: "name and warehouseId required" });
    }

    // Check warehouse exists
    const wh = await prisma.warehouse.findUnique({ where: { id: warehouseId } });
    if (!wh) return res.status(404).json({ message: "Warehouse not found" });

    // Optional uniqueness per warehouse (schema has @@unique)
    const existing = await prisma.location.findFirst({
      where: { warehouseId, name }
    });
    if (existing) return res.status(400).json({ message: "Location already exists in this warehouse" });

    const location = await prisma.location.create({
      data: { name, code, warehouseId }
    });

    res.status(201).json({ message: "Location created", location });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * List locations with optional filtering:
 *  - ?warehouseId=xxx
 *  - ?withStock=true to include current stock rows
 */
export const listLocations = async (req, res) => {
  try {
    const { warehouseId, withStock } = req.query;

    const where = {};
    if (warehouseId) where.warehouseId = warehouseId;

    const locations = await prisma.location.findMany({
      where,
      orderBy: { name: "asc" },
      include: withStock === "true"
        ? {
            stock: {
              include: { product: true }
            },
            warehouse: true
          }
        : { warehouse: true }
    });

    res.json(locations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * Get single location with optional stock view
 * query: ?withStock=true
 */
export const getLocation = async (req, res) => {
  try {
    const { id } = req.params;
    const withStock = req.query.withStock === "true";

    const location = await prisma.location.findUnique({
      where: { id },
      include: withStock
        ? {
            warehouse: true,
            stock: {
              include: { product: true },
              orderBy: { updatedAt: "desc" }
            }
          }
        : { warehouse: true }
    });

    if (!location) return res.status(404).json({ message: "Location not found" });

    res.json(location);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * Location stock view endpoint:
 * - returns stock rows for a location with product details
 * - supports pagination & search by SKU or product name
 * query params: page, pageSize, q (search)
 */
export const locationStockView = async (req, res) => {
  try {
    const { id } = req.params; // location id
    const { page = 1, pageSize = 50, q } = req.query;
    const skip = (page - 1) * pageSize;
    const take = Number(pageSize);

    // Ensure location exists
    const loc = await prisma.location.findUnique({ where: { id } });
    if (!loc) return res.status(404).json({ message: "Location not found" });

    // Build search filter (product sku or name)
    const productWhere = q
      ? {
          OR: [
            { sku: { contains: q, mode: "insensitive" } },
            { name: { contains: q, mode: "insensitive" } }
          ]
        }
      : {};

    // Count total matching rows
    const total = await prisma.stock.count({
      where: {
        locationId: id,
        product: productWhere
      }
    });

    const rows = await prisma.stock.findMany({
      where: {
        locationId: id,
        product: productWhere
      },
      include: {
        product: true
      },
      orderBy: [{ quantity: "desc" }, { updatedAt: "desc" }],
      skip,
      take
    });

    res.json({
      pagination: {
        total,
        page: Number(page),
        pageSize: Number(pageSize),
        totalPages: Math.ceil(total / pageSize)
      },
      data: rows
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
