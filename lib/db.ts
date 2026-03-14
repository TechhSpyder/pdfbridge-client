import { PrismaClient as BlogPrismaClient } from "@prisma/client";
import { PrismaClient as AppPrismaClient } from "@prisma/client-app";
import { Pool } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";

// --- Helpers ---

const getAppPrisma = () => {
  if (process.env.NEXT_RUNTIME === "edge") return null as any;
  const url = process.env.DATABASE_URL;
  if (!url) {
    return new AppPrismaClient();
  }
  const pool = new Pool({ connectionString: url });
  const adapter = new PrismaNeon(pool.options);
  return new AppPrismaClient({ adapter });
};

const getBlogPrisma = () => {
  const url = process.env.BLOG_DATABASE_URL || process.env.DATABASE_URL; // Fallback
  if (!url) {
    return new BlogPrismaClient();
  }
  const pool = new Pool({ connectionString: url });
  const adapter = new PrismaNeon(pool.options);
  return new BlogPrismaClient({ adapter });
};

// --- Singleton Pattern for Next.js ---

declare const globalThis: {
  prismaAppGlobal: ReturnType<typeof getAppPrisma>;
  prismaBlogGlobal: ReturnType<typeof getBlogPrisma>;
} & typeof global;

const prisma = globalThis.prismaAppGlobal ?? getAppPrisma();
const blogPrisma = globalThis.prismaBlogGlobal ?? getBlogPrisma();

if (process.env.NODE_ENV !== "production") {
  globalThis.prismaAppGlobal = prisma;
  globalThis.prismaBlogGlobal = blogPrisma;
}

export { prisma, blogPrisma };
