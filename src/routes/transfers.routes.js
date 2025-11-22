import express from "express";
import {
  createTransfer,
  getAllTransfers,
  getTransfer,
  updateTransferStatus,
  validateTransfer
} from "../controllers/transfers.controller.js";
import { verifyAuth } from "../middleware/auth.js";

const router = express.Router();

router.post("/", verifyAuth, createTransfer);
router.get("/", verifyAuth, getAllTransfers);
router.get("/:id", verifyAuth, getTransfer);
router.patch("/:id/status", verifyAuth, updateTransferStatus);
router.post("/:id/validate", verifyAuth, validateTransfer);

export default router;
