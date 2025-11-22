import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";

// Load env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// ------------------- MIDDLEWARES -------------------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ------------------- CORS -------------------
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "http://localhost:5174",
  "https://admin.stockmaster.in",
  "https://app.stockmaster.in",
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

// ------------------- SECURITY HEADERS -------------------
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    crossOriginEmbedderPolicy: false,
    crossOriginOpenerPolicy: { policy: "same-origin" },
  })
);

// ------------------- LOGGING -------------------
app.use(morgan("dev"));

// ------------------- RATE LIMIT -------------------
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 500,
    message: "Too many requests. Try again later.",
  })
);

// ------------------- HEALTH CHECK -------------------
app.get("/", (req, res) => {
  res.send("🔥 StockMaster Backend Running (Single-file mode)...");
});

// =====================================================
//               IMPORT ROUTES
// =====================================================
// import authRoutes from "./routes/auth.routes.js";
// import productRoutes from "./routes/products.routes.js";
// import receiptRoutes from "./routes/receipts.routes.js";
// import deliveryRoutes from "./routes/delivery.routes.js";
// import transferRoutes from "./routes/transfers.routes.js";
// import adjustmentRoutes from "./routes/adjustments.routes.js";
// import warehouseRoutes from "./routes/warehouse.routes.js";
// import locationRoutes from "./routes/locations.routes.js";
// import ledgerRoutes from "./routes/ledger.routes.js";

// =====================================================
//               REGISTER ROUTES
// =====================================================
// app.use("/api/v1/auth", authRoutes);
// app.use("/api/v1/products", productRoutes);
// app.use("/api/v1/receipts", receiptRoutes);
// app.use("/api/v1/deliveries", deliveryRoutes);
// app.use("/api/v1/transfers", transferRoutes);
// app.use("/api/v1/adjustments", adjustmentRoutes);
// app.use("/api/v1/warehouses", warehouseRoutes);
// app.use("/api/v1/locations", locationRoutes);
// app.use("/api/v1/ledger", ledgerRoutes);

// =====================================================
//               START SERVER HERE
// =====================================================
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

export default app;
