import express from "express";
import {
  createAdjustment,
  getAllAdjustments,
  getAdjustment
} from "../controllers/adjustments.controller.js";
import { verifyAuth } from "../middleware/auth.js";

const router = express.Router();

router.post("/", verifyAuth, createAdjustment);
router.get("/", verifyAuth, getAllAdjustments);
router.get("/:id", verifyAuth, getAdjustment);

export default router;
