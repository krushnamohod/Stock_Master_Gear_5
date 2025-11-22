import prisma from "../config/prisma.js";

// ------------------ CREATE RECEIPT ------------------
export const createReceipt = async (req, res) => {
  try {
    const { supplier, referenceNo, items } = req.body;

    const receipt = await prisma.receipt.create({
      data: {
        supplier,
        referenceNo,
        createdById: req.user?.id || null,
        items: {
          create: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            locationId: item.locationId || null
          }))
        }
      },
      include: { items: true }
    });

    res.status(201).json({ message: "Receipt created", receipt });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ------------------ GET ALL RECEIPTS ------------------
export const getAllReceipts = async (req, res) => {
  try {
    const receipts = await prisma.receipt.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        items: {
          include: {
            product: true,
            location: true
          }
        }
      }
    });

    res.json(receipts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ------------------ GET ONE RECEIPT ------------------
export const getReceipt = async (req, res) => {
  try {
    const { id } = req.params;

    const receipt = await prisma.receipt.findUnique({
      where: { id },
      include: {
        items: { include: { product: true, location: true } }
      }
    });

    if (!receipt) return res.status(404).json({ message: "Receipt not found" });

    res.json(receipt);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ------------------ UPDATE RECEIPT STATUS ------------------
export const updateReceiptStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const receipt = await prisma.receipt.update({
      where: { id },
      data: { status }
    });

    res.json({ message: "Status updated", receipt });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ------------------ VALIDATE RECEIPT (STOCK + LEDGER) ------------------
export const validateReceipt = async (req, res) => {
  try {
    const { id } = req.params;

    const receipt = await prisma.receipt.findUnique({
      where: { id },
      include: { items: true }
    });

    if (!receipt) return res.status(404).json({ message: "Receipt not found" });

    if (receipt.status === "DONE")
      return res.status(400).json({ message: "Receipt already validated" });

    // Loop through items and add to stock
    for (const item of receipt.items) {
      const locationId = item.locationId;

      // Upsert stock
      await prisma.stock.upsert({
        where: {
          productId_locationId: {
            productId: item.productId,
            locationId: locationId
          }
        },
        update: {
          quantity: { increment: item.quantity }
        },
        create: {
          productId: item.productId,
          locationId: locationId,
          quantity: item.quantity
        }
      });

      // Add ledger entry
      await prisma.ledger.create({
        data: {
          productId: item.productId,
          change: item.quantity,
          type: "RECEIPT",
          reference: receipt.id,
          note: `Receipt from supplier: ${receipt.supplier || ""}`
        }
      });
    }

    // Set status to DONE
    await prisma.receipt.update({
      where: { id },
      data: { status: "DONE" }
    });

    res.json({ message: "Receipt validated successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
