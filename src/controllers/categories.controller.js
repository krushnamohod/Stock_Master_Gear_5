import prisma from "../config/prisma.js";

// ============= CREATE CATEGORY =============
export const createCategory = async (req, res) => {
  try {
    const { name } = req.body;

    const existing = await prisma.category.findUnique({ where: { name } });
    if (existing) return res.status(400).json({ message: "Category already exists" });

    const category = await prisma.category.create({ data: { name } });

    res.status(201).json({
      message: "Category created",
      category,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ============= GET ALL CATEGORIES =============
export const getCategories = async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      include: { products: true }
    });

    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ============= DELETE CATEGORY =============
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.category.delete({ where: { id } });

    res.json({ message: "Category deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
