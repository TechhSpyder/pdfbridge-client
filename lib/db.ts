import { PrismaClient as BlogPrismaClient } from "@prisma/client";
import { PrismaClient as AppPrismaClient } from "@prisma/client-app";

// We use dynamic imports for drivers to ensure they are NEVER pulled into the Edge runtime.
// Next.js middleware (Edge) will NOT follow these into the bundle if handled correctly.

const getAppPrisma = () => {
  if (typeof window === "undefined" && process.env.NEXT_RUNTIME === "edge") {
    return null as any;
  }
  
  const url = process.env.DATABASE_URL;
  if (!url) return new AppPrismaClient();

  // Load drivers only when in Node.js
  const { Pool } = require("@neondatabase/serverless");
  const { PrismaNeon } = require("@prisma/adapter-neon");

  const pool = new Pool({ connectionString: url });
  const adapter = new PrismaNeon(pool);
  return new AppPrismaClient({ adapter });
};

const getBlogPrisma = () => {
  if (typeof window === "undefined" && process.env.NEXT_RUNTIME === "edge") {
    return null as any;
  }
  const url = process.env.BLOG_DATABASE_URL || process.env.DATABASE_URL;
  if (!url) return new BlogPrismaClient();

  const { Pool } = require("@neondatabase/serverless");
  const { PrismaNeon } = require("@prisma/adapter-neon");

  const pool = new Pool({ connectionString: url });
  const adapter = new PrismaNeon(pool);
  return new BlogPrismaClient({ adapter });
};

// --- Singleton Pattern ---

declare const globalThis: {
  prismaAppGlobal: any;
  prismaBlogGlobal: any;
} & typeof global;

export const prisma = globalThis.prismaAppGlobal ?? getAppPrisma();
export const blogPrisma = globalThis.prismaBlogGlobal ?? getBlogPrisma();

if (process.env.NODE_ENV !== "production") {
  globalThis.prismaAppGlobal = prisma;
  globalThis.prismaBlogGlobal = blogPrisma;
}
