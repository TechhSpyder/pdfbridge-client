// lib/prisma.ts
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL!;

// Create a connection pool (recommended for serverless/Next.js)
const pool = new Pool({
  connectionString,
  // Optional: tune these based on your needs / Supabase limits
  max: 10, // max connections in pool
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

const adapter = new PrismaPg(pool);

const globalForPrisma = global as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ["query"],
    adapter,
  });

// Cache the client in dev to avoid hot-reload issues
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
