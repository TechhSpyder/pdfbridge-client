import { PrismaClient as BlogPrismaClient } from "@prisma/client-blog";

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
  // No DB URL configured (e.g. in CI or Vercel preview without blog env vars).
  // Return a no-op proxy so imports don't crash. Queries will return undefined.
  if (!url) {
    return new Proxy({} as any, { get: () => () => Promise.resolve(null) });
  }

  const { Pool } = require("pg");
  const { PrismaPg } = require("@prisma/adapter-pg");
  const pool = new Pool({ connectionString: url });
  const adapter = new PrismaPg(pool);
  
  return new BlogPrismaClient({ adapter });
};

// --- Singleton Pattern ---

declare const globalThis: {
  prismaBlogGlobal: any;
} & typeof global;

export const blogPrisma = globalThis.prismaBlogGlobal ?? getBlogPrisma();

if (process.env.NODE_ENV !== "production") {
  globalThis.prismaBlogGlobal = blogPrisma;
}
