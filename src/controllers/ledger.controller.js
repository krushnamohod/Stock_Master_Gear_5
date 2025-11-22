import prisma from "../config/prisma.js";

// GET LEDGER WITH FILTERS
export const getLedger = async (req, res) => {
  try {
    const {
      productId,
      type,
      dateFrom,
      dateTo,
      page = 1,
      pageSize = 20
    } = req.query;

    const filters = {};

    // Filter by product
    if (productId) {
      filters.productId = productId;
    }

    // Filter by ledger type
    if (type) {
      filters.type = type;
    }

    // Date range filters
    if (dateFrom || dateTo) {
      filters.createdAt = {};
      if (dateFrom) filters.createdAt.gte = new Date(dateFrom);
      if (dateTo) filters.createdAt.lte = new Date(dateTo);
    }

    const skip = (page - 1) * pageSize;
    const take = parseInt(pageSize);

    const [ledger, total] = await Promise.all([
      prisma.ledger.findMany({
        where: filters,
        orderBy: { createdAt: "desc" },
        skip,
        take,
        include: {
          product: true
        }
      }),
      prisma.ledger.count({ where: filters })
    ]);

    res.json({
      pagination: {
        total,
        page: Number(page),
        pageSize: Number(pageSize),
        totalPages: Math.ceil(total / pageSize)
      },
      data: ledger
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



// GET SINGLE LEDGER ENTRY
export const getLedgerById = async (req, res) => {
  try {
    const { id } = req.params;

    const entry = await prisma.ledger.findUnique({
      where: { id },
      include: { product: true }
    });

    if (!entry) return res.status(404).json({ message: "Ledger entry not found" });

    res.json(entry);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
