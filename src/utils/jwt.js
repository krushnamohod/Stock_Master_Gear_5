import jwt from "jsonwebtoken";
import dotenv from "dotenv";

// Load ENV
dotenv.config();

export const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });
};
