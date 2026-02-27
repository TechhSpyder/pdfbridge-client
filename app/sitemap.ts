import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://pdfbridge.xyz";

  // Static routes
  const routes = [
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

  return [...routes];
}
