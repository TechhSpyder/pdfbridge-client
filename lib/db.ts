import { PrismaClient as BlogPrismaClient } from "@prisma/client-blog";
import { PrismaClient as AppPrismaClient } from "@prisma/client-app";

// We use dynamic imports for drivers to ensure they are NEVER pulled into the Edge runtime.
// Next.js middleware (Edge) will NOT follow these into the bundle if handled correctly.

const getAppPrisma = () => {
  // Edge runtime handler (Cloudflare/Vercel Edge)
  if (typeof window === "undefined" && process.env.NEXT_RUNTIME === "edge") {
    const url = process.env.DATABASE_URL;
    if (!url) return new AppPrismaClient();

    const { Pool } = require("@neondatabase/serverless");
    const { PrismaNeon } = require("@prisma/adapter-neon");
    const pool = new Pool({ connectionString: url });
    return new AppPrismaClient({ adapter: new PrismaNeon(pool) });
  }

  // Node.js runtime (Development / Next Server)
  const url = process.env.DATABASE_URL;
  if (!url) return new AppPrismaClient();

  const { Pool } = require("@neondatabase/serverless");
  const { PrismaNeon } = require("@prisma/adapter-neon");
  const pool = new Pool({ connectionString: url });
  return new AppPrismaClient({ adapter: new PrismaNeon(pool) });
};

const getBlogPrisma = () => {
  // The blog uses Supabase. Under Prisma 7.5.0, connection strings are stripped from schema files,
  // so we must seamlessly instantiate the client via a Driver Adapter.
  
  // Edge runtime handler: 'pg' relies on Node's native 'net' library.
  // We don't query the blog from Edge (middleware), so we return null to prevent import crashes.
  if (typeof window === "undefined" && process.env.NEXT_RUNTIME === "edge") {
    return null as any;
  }

  // Node.js runtime
  const url = process.env.BLOG_DATABASE_URL;
  if (!url) return new BlogPrismaClient({} as any);

  const { Pool } = require("pg");
  const { PrismaPg } = require("@prisma/adapter-pg");
  const pool = new Pool({ connectionString: url });
  const adapter = new PrismaPg(pool);
  
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
