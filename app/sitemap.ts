import { MetadataRoute } from "next";
import { getPublishedPosts } from "./insights/actions";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://pdfbridge.xyz";

  // 1. Fetch Dynamic Posts
  const dynamicPosts = await getPublishedPosts();
  const dynamicRoutes = dynamicPosts.map((post) => ({
    url: `${baseUrl}/insights/${post.slug}`,
    lastModified: new Date(post.updatedAt || post.createdAt).toISOString(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  // 2. Static Content Pages
  const staticRoutes = [
    "",
    "/docs",
    "/insights",
    "/changelog",
    "/contact",
    "/privacy",
    "/terms",
    "/dpa",
  ].map((route) => ({
    url: `${baseUrl}${route || "/"}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1 : route === "/docs" ? 0.8 : 0.5,
  }));

  // 3. SEO Pillar & Comparison Pages
  const seoPillarRoutes = [
    "/insights/wkhtmltopdf-alternative",
    "/insights/puppeteer-pdf-alternative",
    "/insights/docraptor-alternative",
    "/insights/api2pdf-alternative",
    "/insights/open-source-pdf-architecture",
    "/use-cases/invoice-pdf-api",
    "/use-cases/receipt-pdf-api",
    "/for/nextjs",
    "/frameworks/react-to-pdf",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [...staticRoutes, ...seoPillarRoutes, ...dynamicRoutes];
}
