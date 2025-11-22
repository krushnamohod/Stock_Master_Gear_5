import prisma from "../config/prisma.js";

/**
 * Create Stock Adjustment
 * body: {
 *   productId,
 *   locationId,
 *   newQuantity,
 *   reason
 * }
 */
export const createAdjustment = async (req, res) => {
  try {
    const { productId, locationId, newQuantity, reason } = req.body;

    // Get current stock (might not exist)
    const existingStock = await prisma.stock.findUnique({
      where: {
        productId_locationId: {
          productId,
          locationId,
        }
      }
    });

    const oldQuantity = existingStock ? existingStock.quantity : 0;
    const difference = newQuantity - oldQuantity;

    await prisma.$transaction(async (tx) => {
      // Update or create stock
      if (existingStock) {
        await tx.stock.update({
          where: {
            productId_locationId: {
              productId,
              locationId
            }
          },
          data: {
            quantity: newQuantity
          }
        });
      } else {
        await tx.stock.create({
          data: {
            productId,
            locationId,
            quantity: newQuantity
          }
        });
      }

      // Create adjustment record
      await tx.adjustment.create({
        data: {
          productId,
          locationId,
          oldQuantity,
          newQuantity,
          reason,
          createdById: req.user?.id || null
        }
      });

      // Create ledger entry
      await tx.ledger.create({
        data: {
          productId,
          change: difference,
          type: "ADJUSTMENT",
          reference: null,
          note: reason || `Stock adjusted from ${oldQuantity} to ${newQuantity}`
        }
      });
    });

    res.status(201).json({
      message: "Stock adjustment completed successfully",
      difference
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * Get all adjustments
 */
export const getAllAdjustments = async (req, res) => {
  try {
    const list = await prisma.adjustment.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        product: true,
        location: true
      }
    });
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * Get one adjustment
 */
export const getAdjustment = async (req, res) => {
  try {
    const { id } = req.params;

    const adj = await prisma.adjustment.findUnique({
      where: { id },
      include: {
        product: true,
        location: true
      }
    });

    if (!adj) return res.status(404).json({ message: "Adjustment not found" });

    res.json(adj);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
