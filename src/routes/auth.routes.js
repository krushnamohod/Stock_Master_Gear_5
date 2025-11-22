// src/routes/auth.routes.js
import { Router } from "express";
import { register, login, me, seedDefault, verify } from "../controllers/auth.controller.js";
import { authenticate, authorize } from "../middleware/auth.middleware.js";

const router = Router();

// Protected: only MANAGER can create new users
router.post("/register", authenticate, authorize("MANAGER"), register);

// Public
router.post("/login", login);

// Protected endpoints
router.get("/me", authenticate, me);
router.post("/verify", verify);

// DEV ONLY: seed default manager+staff if DB empty. Remove/protect for production.
router.get("/seed-default", seedDefault);

export default router;
