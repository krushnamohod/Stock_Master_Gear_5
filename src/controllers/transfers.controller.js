import prisma from "../config/prisma.js";

/**
 * Create a Transfer (Draft by default)
 * body: {
 *   fromLocationId,
 *   toLocationId,
 *   referenceNo,
 *   items: [{ productId, quantity }]
 * }
 */
export const createTransfer = async (req, res) => {
  try {
    const { fromLocationId, toLocationId, referenceNo, items } = req.body;

    if (!fromLocationId || !toLocationId) {
      return res.status(400).json({ message: "fromLocationId and toLocationId required" });
    }
    if (fromLocationId === toLocationId) {
      return res.status(400).json({ message: "fromLocationId and toLocationId cannot be same" });
    }

    const transfer = await prisma.transfer.create({
      data: {
        fromLocationId,
        toLocationId,
        referenceNo,
        createdById: req.user?.id || null,
        items: {
          create: items.map((it) => ({
            productId: it.productId,
            quantity: it.quantity
          }))
        }
      },
      include: { items: true }
    });

    res.status(201).json({ message: "Transfer created", transfer });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getAllTransfers = async (req, res) => {
  try {
    const transfers = await prisma.transfer.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        fromLocation: true,
        toLocation: true,
        items: { include: { product: true } }
      }
    });
    res.json(transfers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getTransfer = async (req, res) => {
  try {
    const { id } = req.params;
    const transfer = await prisma.transfer.findUnique({
      where: { id },
      include: {
        fromLocation: true,
        toLocation: true,
        items: { include: { product: true } }
      }
    });
    if (!transfer) return res.status(404).json({ message: "Transfer not found" });
    res.json(transfer);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateTransferStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updated = await prisma.transfer.update({
      where: { id },
      data: { status }
    });

    res.json({ message: "Status updated", transfer: updated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * Validate / Execute Transfer
 * - Checks availability at fromLocation for each item
 * - Decrements stock at fromLocation
 * - Increments (or creates) stock at toLocation
 * - Creates ledger entries for both sides
 * - Runs inside a transaction
 */
export const validateTransfer = async (req, res) => {
  const { id } = req.params;

  try {
    const transfer = await prisma.transfer.findUnique({
      where: { id },
      include: { items: true }
    });

    if (!transfer) return res.status(404).json({ message: "Transfer not found" });
    if (transfer.status === "DONE") return res.status(400).json({ message: "Transfer already validated" });

    // Run everything in a transaction for atomicity
    await prisma.$transaction(async (tx) => {
      for (const item of transfer.items) {
        const productId = item.productId;
        const qty = item.quantity;
        const fromLoc = transfer.fromLocationId;
        const toLoc = transfer.toLocationId;

        // 1) Check source stock
        const srcStock = await tx.stock.findUnique({
          where: {
            productId_locationId: { productId, locationId: fromLoc }
          }
        });

        if (!srcStock || srcStock.quantity < qty) {
          throw new Error(`Insufficient stock for product ${productId} at location ${fromLoc}`);
        }

        // 2) Decrement source stock
        await tx.stock.update({
          where: {
            productId_locationId: { productId, locationId: fromLoc }
          },
          data: {
            quantity: { decrement: qty }
          }
        });

        // 3) Upsert destination stock (increment or create)
        await tx.stock.upsert({
          where: {
            productId_locationId: { productId, locationId: toLoc }
          },
          update: {
            quantity: { increment: qty }
          },
          create: {
            productId,
            locationId: toLoc,
            quantity: qty
          }
        });

        // 4) Ledger entries: negative for source, positive for dest
        await tx.ledger.create({
          data: {
            productId,
            change: -qty,
            type: "TRANSFER",
            reference: transfer.id,
            note: `Transfer FROM ${fromLoc} -> TO ${toLoc}`
          }
        });

        await tx.ledger.create({
          data: {
            productId,
            change: +qty,
            type: "TRANSFER",
            reference: transfer.id,
            note: `Transfer TO ${toLoc} <- FROM ${fromLoc}`
          }
        });
      }

      // 5) Mark transfer as DONE
      await tx.transfer.update({
        where: { id: transfer.id },
        data: { status: "DONE" }
      });
    });

    res.json({ message: "Transfer validated and executed successfully" });
  } catch (err) {
    // If the error came from the transaction throw above, Prisma wraps it: show the message
    const msg = err?.message || "Unknown error";
    res.status(400).json({ message: msg });
  }
};
