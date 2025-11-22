import prisma from "../config/prisma.js";

// ------------------ CREATE DELIVERY ------------------
export const createDelivery = async (req, res) => {
  try {
    const { customer, referenceNo, items } = req.body;

    const delivery = await prisma.delivery.create({
      data: {
        customer,
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

    res.status(201).json({ message: "Delivery created", delivery });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ------------------ GET ALL DELIVERIES ------------------
export const getAllDeliveries = async (req, res) => {
  try {
    const deliveries = await prisma.delivery.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        items: {
          include: { product: true, location: true }
        }
      }
    });

    res.json(deliveries);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ------------------ GET ONE DELIVERY ------------------
export const getDelivery = async (req, res) => {
  try {
    const { id } = req.params;

    const delivery = await prisma.delivery.findUnique({
      where: { id },
      include: {
        items: { include: { product: true, location: true } }
      }
    });

    if (!delivery) return res.status(404).json({ message: "Delivery not found" });

    res.json(delivery);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ------------------ UPDATE STATUS ------------------
export const updateDeliveryStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const delivery = await prisma.delivery.update({
      where: { id },
      data: { status }
    });

    res.json({ message: "Status updated", delivery });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// =====================================================
// VALIDATE DELIVERY: decrease stock + ledger tracking
// =====================================================
export const validateDelivery = async (req, res) => {
  try {
    const { id } = req.params;

    const delivery = await prisma.delivery.findUnique({
      where: { id },
      include: { items: true }
    });

    if (!delivery)
      return res.status(404).json({ message: "Delivery not found" });

    if (delivery.status === "DONE")
      return res.status(400).json({ message: "Delivery already validated" });

    // Loop through all items
    for (const item of delivery.items) {
      const locationId = item.locationId;

      // Get current stock
      const stock = await prisma.stock.findUnique({
        where: {
          productId_locationId: {
            productId: item.productId,
            locationId: locationId
          }
        }
      });

      // Validate stock availability
      if (!stock || stock.quantity < item.quantity) {
        return res.status(400).json({
          message: `Insufficient stock for product ${item.productId} at location ${locationId}`
        });
      }

      // Decrease stock
      await prisma.stock.update({
        where: {
          productId_locationId: {
            productId: item.productId,
            locationId: locationId
          }
        },
        data: {
          quantity: { decrement: item.quantity }
        }
      });

      // Ledger entry
      await prisma.ledger.create({
        data: {
          productId: item.productId,
          change: -item.quantity,
          type: "DELIVERY",
          reference: delivery.id,
          note: `Delivered to customer: ${delivery.customer || ""}`
        }
      });
    }

    // Update status
    await prisma.delivery.update({
      where: { id },
      data: { status: "DONE" }
    });

    res.json({ message: "Delivery validated successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
