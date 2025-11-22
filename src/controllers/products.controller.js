import prisma from "../config/prisma.js";

// ======================= CREATE PRODUCT =======================
export const createProduct = async (req, res) => {
  try {
    const { name, sku, uom, categoryId } = req.body;

    const existing = await prisma.product.findUnique({ where: { sku } });
    if (existing) return res.status(400).json({ message: "SKU already exists" });

    const product = await prisma.product.create({
      data: {
        name,
        sku,
        uom,
        categoryId,
      },
    });

    res.status(201).json({
      message: "Product created",
      product,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ======================= GET ALL PRODUCTS =======================
export const getAllProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true,
        stock: {
          include: { location: true }
        }
      }
    });

    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ======================= GET ONE PRODUCT =======================
export const getProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        stock: { include: { location: true } }
      },
    });

    if (!product) return res.status(404).json({ message: "Not found" });

    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ======================= UPDATE PRODUCT =======================
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await prisma.product.update({
      where: { id },
      data: req.body,
    });

    res.json({
      message: "Product updated",
      product,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ======================= DELETE PRODUCT =======================
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.product.delete({ where: { id } });

    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
