import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";

// Load ENV
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// ------------------- PARSERS -------------------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ------------------- CORS -------------------
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:5173",
  "http://localhost:5174",
  "https://app.stockmaster.in",
  "https://admin.stockmaster.in",
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) callback(null, true);
    else callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
};

app.use(cors(corsOptions));

// ------------------- SECURITY -------------------
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    crossOriginEmbedderPolicy: false,
  })
);

// ------------------- LOGGING -------------------
app.use(morgan("dev"));

// ------------------- RATE LIMIT -------------------
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 500,
    message: "Too many requests — slow down.",
  })
);

// ------------------- HEALTH CHECK -------------------
app.get("/", (req, res) => {
  res.send("🔥 Stock Master Gear 5 Backend Running...");
});

// =====================================================
//                   IMPORT ROUTES
// =====================================================
import authRoutes from "./routes/auth.routes.js";
import productRoutes from "./routes/products.routes.js";
import categoryRoutes from "./routes/categories.routes.js";
import receiptRoutes from "./routes/receipts.routes.js";
import deliveryRoutes from "./routes/deliveries.routes.js";
import transferRoutes from "./routes/transfers.routes.js";
import adjustmentRoutes from "./routes/adjustments.routes.js";
import ledgerRoutes from "./routes/ledger.routes.js";
import warehouseRoutes from "./routes/warehouses.routes.js";
import locationRoutes from "./routes/locations.routes.js";

app.use("/api/v1/warehouses", warehouseRoutes);
app.use("/api/v1/locations", locationRoutes);


app.use("/api/v1/ledger", ledgerRoutes);

app.use("/api/v1/adjustments", adjustmentRoutes);

// (Next parts will add: adjustments, warehouses, locations, ledger)

// =====================================================
//                   REGISTER ROUTES
// =====================================================
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/categories", categoryRoutes);
app.use("/api/v1/receipts", receiptRoutes);
app.use("/api/v1/deliveries", deliveryRoutes);
app.use("/api/v1/transfers", transferRoutes);

// =====================================================
//                   START SERVER
// =====================================================
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

export default app;
