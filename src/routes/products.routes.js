import express from "express";
import {
  createProduct,
  getAllProducts,
  getProduct,
  updateProduct,
  deleteProduct
} from "../controllers/products.controller.js";
import { verifyAuth } from "../middleware/auth.js";

const router = express.Router();

router.post("/", verifyAuth, createProduct);
router.get("/", verifyAuth, getAllProducts);
router.get("/:id", verifyAuth, getProduct);
router.put("/:id", verifyAuth, updateProduct);
router.delete("/:id", verifyAuth, deleteProduct);

export default router;
