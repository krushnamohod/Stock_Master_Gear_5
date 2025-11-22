// src/controllers/auth.controller.js
import bcrypt from "bcryptjs";
import prisma from "../config/prisma.js";
import { signAccessToken, verifyToken } from "../utils/jwt.js";

/**
 * POST /api/v1/auth/register
 * Note: in production this endpoint should be protected (MANAGER only).
 */
export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "name, email and password are required" });
    }

    const normalizedRole = role && role.toUpperCase() === "MANAGER" ? "MANAGER" : "STAFF";

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(409).json({ message: "Email already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    const user = await prisma.user.create({
      data: { name, email, password: hashed, role: normalizedRole },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    });

    return res.status(201).json({ success: true, user });
  } catch (err) {
    console.error("auth.register error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * POST /api/v1/auth/login
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "email and password required" });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const payload = { id: user.id, email: user.email, role: user.role };
    const token = signAccessToken(payload);

    const safeUser = { id: user.id, name: user.name, email: user.email, role: user.role };
    return res.json({ success: true, token, user: safeUser });
  } catch (err) {
    console.error("auth.login error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * GET /api/v1/auth/me
 * Requires authenticate middleware
 */
export const me = async (req, res) => {
  try {
    const userFromReq = req.user;
    if (!userFromReq) return res.status(401).json({ message: "Unauthorized" });

    const user = await prisma.user.findUnique({
      where: { id: userFromReq.id },
      select: { id: true, name: true, email: true, role: true, createdAt: true, updatedAt: true },
    });

    if (!user) return res.status(404).json({ message: "User not found" });
    return res.json({ success: true, user });
  } catch (err) {
    console.error("auth.me error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * GET /api/v1/auth/seed-default
 * DEV ONLY - create default manager + staff if DB empty.
 * Remove or protect this route before production.
 */
export const seedDefault = async (req, res) => {
  try {
    const count = await prisma.user.count();
    if (count > 0) return res.status(200).json({ message: "Users exist, skipping seed" });

    const salt = await bcrypt.genSalt(10);
    const managerPass = await bcrypt.hash(process.env.DEFAULT_MANAGER_PASS || "manager123", salt);
    const staffPass = await bcrypt.hash(process.env.DEFAULT_STAFF_PASS || "staff123", salt);

    const manager = await prisma.user.create({
      data: {
        name: process.env.DEFAULT_MANAGER_NAME || "Default Manager",
        email: process.env.DEFAULT_MANAGER_EMAIL || "manager@stockmaster.local",
        password: managerPass,
        role: "MANAGER",
      },
      select: { id: true, name: true, email: true, role: true },
    });

    const staff = await prisma.user.create({
      data: {
        name: process.env.DEFAULT_STAFF_NAME || "Default Staff",
        email: process.env.DEFAULT_STAFF_EMAIL || "staff@stockmaster.local",
        password: staffPass,
        role: "STAFF",
      },
      select: { id: true, name: true, email: true, role: true },
    });

    return res.status(201).json({ success: true, users: { manager, staff } });
  } catch (err) {
    console.error("auth.seedDefault error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * POST /api/v1/auth/verify
 * Body: { token }
 */
export const verify = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) return res.status(400).json({ message: "token required" });

    const payload = verifyToken(token);
    if (!payload) return res.status(401).json({ valid: false, message: "Invalid or expired token" });

    return res.json({ valid: true, payload });
  } catch (err) {
    console.error("auth.verify error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
