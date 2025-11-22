// src/routes/warehouses.routes.js
import express from "express";
import { createWarehouse, listWarehouses, getWarehouse } from "../controllers/warehouses.controller.js";
import { verifyAuth } from "../middleware/auth.js";
import { requireManager } from "../middleware/role.js";

const router = express.Router();

router.post("/", verifyAuth, requireManager, createWarehouse);
router.get("/", verifyAuth, listWarehouses);
router.get("/:id", verifyAuth, getWarehouse);

export default router;
