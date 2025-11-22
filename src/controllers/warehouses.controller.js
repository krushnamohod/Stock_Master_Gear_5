// src/controllers/warehouses.controller.js
import prisma from "../config/prisma.js";

/**
 * Create a warehouse
 * body: { name, address? }
 */
export const createWarehouse = async (req, res) => {
  try {
    const { name, address } = req.body;
    if (!name) return res.status(400).json({ message: "Name required" });

    const existing = await prisma.warehouse.findUnique({ where: { name } });
    if (existing) return res.status(400).json({ message: "Warehouse already exists" });

    const warehouse = await prisma.warehouse.create({
      data: { name, address },
    });

    res.status(201).json({ message: "Warehouse created", warehouse });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * List all warehouses (with their locations)
 * query params:
 *  - includeLocations=true to include locations in the response
 */
export const listWarehouses = async (req, res) => {
  try {
    const includeLocations = req.query.includeLocations === "true";

    const warehouses = await prisma.warehouse.findMany({
      include: includeLocations ? { locations: true } : false,
      orderBy: { name: "asc" }
    });

    res.json(warehouses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * Get single warehouse with optional locations
 */
export const getWarehouse = async (req, res) => {
  try {
    const { id } = req.params;
    const includeLocations = req.query.includeLocations === "true";

    const warehouse = await prisma.warehouse.findUnique({
      where: { id },
      include: includeLocations ? { locations: true } : false
    });

    if (!warehouse) return res.status(404).json({ message: "Warehouse not found" });

    res.json(warehouse);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
