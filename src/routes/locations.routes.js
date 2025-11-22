// src/routes/locations.routes.js
import express from "express";
import {
  createLocation,
  listLocations,
  getLocation,
  locationStockView
} from "../controllers/locations.controller.js";
import { verifyAuth } from "../middleware/auth.js";
import { requireManager } from "../middleware/role.js";

const router = express.Router();

router.post("/", verifyAuth, requireManager, createLocation);
router.get("/", verifyAuth, listLocations);
router.get("/:id", verifyAuth, getLocation);
router.get("/:id/stock", verifyAuth, locationStockView);

export default router;
