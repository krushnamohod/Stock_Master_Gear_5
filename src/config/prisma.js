// src/config/prisma.js
import pkg from '@prisma/client';
const { PrismaClient } = pkg;

const prisma = new PrismaClient({
  log: ["query", "info", "warn", "error"],
});

export default prisma;
