// src/controllers/auth.controller.js
import prisma from "../config/prisma.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/jwt.js";
import dotenv from "dotenv";

// Load ENV
dotenv.config();

const sanitizeUser = (user) => {
  if (!user) return null;
  const { password: _pwd, ...safe } = user;
  return safe;
};

export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ message: "name, email and password are required" });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(400).json({ message: "Email already exists" });

    const hashed = await bcrypt.hash(password, 10);

    // Normalize role to match enum values (MANAGER / STAFF)
    const normalizedRole = (role && String(role).toUpperCase()) || "MANAGER";

    const user = await prisma.user.create({
      data: { name, email, password: hashed, role: normalizedRole },
    });

    const token = generateToken({ id: user.id, role: user.role });

    res.status(201).json({
      message: "User registered",
      user: sanitizeUser(user),
      token,
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Server error during registration", error: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "email and password required" });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ message: "Invalid credentials" });

    const token = generateToken({ id: user.id, role: user.role });

    res.json({
      message: "Login successful",
      user: sanitizeUser(user),
      token,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error during login", error: err.message });
  }
};

export const getProfile = async (req, res) => {
  try {
    if (!req.user?.id) return res.status(401).json({ message: "Unauthorized" });

    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(sanitizeUser(user));
  } catch (err) {
    console.error("GetProfile error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
