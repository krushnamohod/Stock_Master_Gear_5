import express from "express";
import {
  createDelivery,
  getAllDeliveries,
  getDelivery,
  updateDeliveryStatus,
  validateDelivery
} from "../controllers/deliveries.controller.js";
import { verifyAuth } from "../middleware/auth.js";

const router = express.Router();

router.post("/", verifyAuth, createDelivery);
router.get("/", verifyAuth, getAllDeliveries);
router.get("/:id", verifyAuth, getDelivery);
router.patch("/:id/status", verifyAuth, updateDeliveryStatus);
router.post("/:id/validate", verifyAuth, validateDelivery);

export default router;
