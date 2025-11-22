// src/config/prisma.js
import pkg from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import dotenv from 'dotenv';

// Load env variables
dotenv.config();
const { PrismaClient } = pkg;

if (!process.env.DATABASE_URL || process.env.DATABASE_URL.trim() === '') {
  throw new Error(
    'DATABASE_URL is not set. Create a .env with DATABASE_URL="postgresql://USER:PASS@HOST:PORT/DBNAME?schema=public" and restart.'
  );
}

// create adapter instance using your DATABASE_URL
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });

// instantiate Prisma with adapter (adapter and accelerateUrl are mutually exclusive)
global.__prisma ??= new PrismaClient({
  adapter,
  log: process.env.NODE_ENV === 'development'
    ? ['query', 'info', 'warn', 'error']
    : ['warn', 'error'],
});

// graceful shutdown
process.on('beforeExit', async () => {
  try { await global.__prisma?.$disconnect(); } catch (e) {}
});

export default global.__prisma;
