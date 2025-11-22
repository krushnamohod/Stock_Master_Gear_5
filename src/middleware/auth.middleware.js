// src/middleware/auth.middleware.js
import { verifyToken } from "../utils/jwt.js";
import dotenv from "dotenv";
// Load ENV
dotenv.config();

/**
 * Attach decoded token payload to req.user
 * Expect Authorization: Bearer <token>
 * This middleware does NOT query DB (keeps it lightweight). If you want fresh role info
 * on every request, change it to fetch user from prisma (see comment below).
 */
export const authenticate = (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Authorization header missing or malformed" });
  }

  const token = auth.split(" ")[1];
  const payload = verifyToken(token);
  if (!payload) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }

  // attach user info (from token) to request
  req.user = { id: payload.id, email: payload.email, role: payload.role };
  next();
};

/**
 * Role guard factory
 * usage: authorize("MANAGER") or authorize("STAFF","MANAGER")
 */
export const authorize = (...allowedRoles) => (req, res, next) => {
  const user = req.user;
  if (!user) return res.status(401).json({ message: "Unauthorized" });
  if (!allowedRoles.includes(user.role)) {
    return res.status(403).json({ message: "Forbidden - insufficient permissions" });
  }
  next();
};

/*
 // If you prefer to re-load the user from DB in the middleware (to reflect role changes),
 // replace verifyToken usage with something like:

 import prisma from "../config/prisma.js";
 const payload = verifyToken(token);
 const dbUser = await prisma.user.findUnique({ where: { id: payload.id }});
 if (!dbUser) return res.status(401).json({ message: "User not found" });
 req.user = { id: dbUser.id, email: dbUser.email, role: dbUser.role };

 // That makes middleware dependent on Prisma.
*/
