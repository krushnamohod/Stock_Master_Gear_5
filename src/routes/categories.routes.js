import express from "express";
import {
  createCategory,
  getCategories,
  deleteCategory
} from "../controllers/categories.controller.js";
import { verifyAuth } from "../middleware/auth.js";

const router = express.Router();

router.post("/", verifyAuth, createCategory);
router.get("/", verifyAuth, getCategories);
router.delete("/:id", verifyAuth, deleteCategory);

export default router;
