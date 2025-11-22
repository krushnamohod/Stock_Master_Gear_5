import express from "express";
import {
  getLedger,
  getLedgerById
} from "../controllers/ledger.controller.js";

import { verifyAuth } from "../middleware/auth.js";

const router = express.Router();

// Query ledger with filters
router.get("/", verifyAuth, getLedger);

// Get a single ledger entry
router.get("/:id", verifyAuth, getLedgerById);

export default router;
