import express from "express";
import {
  createReceipt,
  getAllReceipts,
  getReceipt,
  updateReceiptStatus,
  validateReceipt
} from "../controllers/receipts.controller.js";

import { verifyAuth } from "../middleware/auth.js";

const router = express.Router();

router.post("/", verifyAuth, createReceipt);
router.get("/", verifyAuth, getAllReceipts);
router.get("/:id", verifyAuth, getReceipt);
router.patch("/:id/status", verifyAuth, updateReceiptStatus);
router.post("/:id/validate", verifyAuth, validateReceipt);

export default router;
