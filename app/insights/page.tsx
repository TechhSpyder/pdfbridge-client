import { getPublishedPosts } from "./actions";
import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { BookOpen, Calendar, User, ArrowRight, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Insights & Engineering Journal",
  description:
    "Technical deep dives, product updates, and architecture insights from the team building PDFBridge.",
  openGraph: {
    title: "Insights & Engineering Journal | PDFBridge",
    description:
      "Technical deep dives, product updates, and architecture insights from the team building PDFBridge.",
    images: [
      "https://res.cloudinary.com/duv0exsir/image/upload/v1769535362/branded_og_image_pdfbridge_1769534994459_qn8iyg.jpg",
    ],
  },
};

export const revalidate = 3600;

export default async function InsightsPage() {
  const dynamicPosts = await getPublishedPosts();
  
  // Hardcoded SEO Pillar pages to inject into the blog feed
  const staticSeoPosts = [
    {
      id: "seo-wkhtmltopdf",
      slug: "wkhtmltopdf-alternative",
      title: "wkhtmltopdf Alternative built for Modern Frontends.",
      description: "wkhtmltopdf officially ceased maintenance in early 2023. It fails to render modern CSS grids, flexbox, and heavily relies on archaic float layouts. It’s time for a modern API alternative.",
      content: "wkhtmltopdf officially ceased maintenance in early 2023...", // For the excerpt
      createdAt: new Date("2026-03-02T10:00:00Z"),
      updatedAt: new Date("2026-03-02T10:00:00Z"),
      published: true,
      coverImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80",
      authorId: "francis",
      categoryId: "seo",
      author: {
        id: "francis",
        name: "Francis Bello",
        email: "hello@techhspyder.com"
      },
      category: {
        id: "seo",
        name: "Migration Guides",
        slug: "migration-guides"
      },
      tags: ["wkhtmltopdf alternative", "legacy migration"]
    },
    {
      id: "seo-puppeteer",
      slug: "puppeteer-pdf-alternative",
      title: "The Hidden Cost of Scaling Puppeteer for PDFs.",
      description: "A technical breakdown of the infrastructure costs and memory leaks associated with managing Puppeteer for PDF generation, and why managed APIs are the 2026 standard.",
      content: "Every senior engineer eventually learns the hard way...", // For the excerpt
      createdAt: new Date("2026-03-01T10:00:00Z"),
      updatedAt: new Date("2026-03-01T10:00:00Z"),
      published: true,
      coverImage: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80",
      authorId: "francis",
      categoryId: "seo",
      author: {
        id: "francis",
        name: "Francis Bello",
        email: "hello@techhspyder.com"
      },
      category: {
        id: "seo",
        name: "Infrastructure",
        slug: "infrastructure"
      },
      tags: ["puppeteer alternative", "memory leaks"]
    },
    {
      id: "seo-docraptor",
      slug: "docraptor-alternative",
      title: "A Modern, Cost-Effective DocRaptor Alternative.",
      description: "DocRaptor charges up to $15 per 1,000 PDFs generated. In 2026, paying enterprise premiums for a legacy PrinceXML rendering engine no longer makes structural or financial sense.",
      content: "DocRaptor is built entirely around PrinceXML—a proprietary HTML-to-PDF tool originally built over a decade ago...",
      createdAt: new Date("2026-03-03T10:00:00Z"),
      updatedAt: new Date("2026-03-03T10:00:00Z"),
      published: true,
      coverImage: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80",
      authorId: "francis",
      categoryId: "seo",
      author: {
        id: "francis",
        name: "Francis Bello",
        email: "hello@techhspyder.com"
      },
      category: {
        id: "seo",
        name: "Pricing Analysis",
        slug: "pricing-analysis"
      },
      tags: ["docraptor alternative", "princexml"]
    },
    {
      id: "seo-api2pdf",
      slug: "api2pdf-alternative",
      title: "The Modern Api2PDF Alternative.",
      description: "Api2PDF was an early player in the space. But as frontend architectures shifted to Tailwind, React, and Next.js, modern developers expect intelligent routing, CSS JIT evaluations, and enterprise-grade Zero Retention modes.",
      content: "If you're generating simple HTML logs or basic textual receipts, legacy wrappers like Api2PDF work fine...",
      createdAt: new Date("2026-03-03T09:00:00Z"),
      updatedAt: new Date("2026-03-03T09:00:00Z"),
      published: true,
      coverImage: "https://images.unsplash.com/photo-1607706189992-bf5f236ce311?auto=format&fit=crop&q=80",
      authorId: "francis",
      categoryId: "seo",
      author: {
        id: "francis",
        name: "Francis Bello",
        email: "hello@techhspyder.com"
      },
      category: {
        id: "seo",
        name: "Technology Upgrade",
        slug: "technology-upgrade"
      },
      tags: ["api2pdf alternative", "gotenberg"]
    },
    {
      id: "seo-open-source",
      slug: "open-source-pdf-architecture",
      title: "Open Source PDF Architecture vs Managed APIs (2026)",
      description: "A deep dive into managing Gotenberg, Puppeteer, and Chromium for PDF generation at scale, and when it makes sense to switch to a managed API.",
      content: "Open-source tools like Gotenberg and Puppeteer are phenomenal feats of engineering. But orchestrating them in a high-availability, low-latency production environment is a completely different beast...",
      createdAt: new Date("2026-03-03T11:00:00Z"),
      updatedAt: new Date("2026-03-03T11:00:00Z"),
      published: true,
      coverImage: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80",
      authorId: "francis",
      categoryId: "seo",
      author: {
        id: "francis",
        name: "Francis Bello",
        email: "hello@techhspyder.com"
      },
      category: {
        id: "seo",
        name: "Architecture & Scaling",
        slug: "architecture"
      },
      tags: ["open source pdf generation", "gotenberg architecture"]
    }
  ];

  // Merge and sort
  const posts = [...staticSeoPosts, ...dynamicPosts].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-blue-500/30">
      {/* Hero Section */}
      <section className="relative pt-20 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-b from-blue-600/10 via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] bg-blue-600/5 blur-[120px] rounded-full" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-600/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <Sparkles size={14} />
              PDFBridge Insights
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 bg-linear-to-r from-white via-white to-slate-500 bg-clip-text text-transparent animate-in fade-in slide-in-from-bottom-6 duration-1000">
              The Engineering <br />
              Journal.
            </h1>
            <p className="text-xl text-slate-400 font-medium leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
              Technical deep dives, product updates, and architecture insights
              from the team building the world&apos;s most reliable PDF engine.
            </p>
          </div>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="max-w-7xl mx-auto px-6 pb-32">
        {posts.length === 0 ? (
          <div className="py-20 text-center border border-white/5 bg-white/2 rounded-3xl backdrop-blur-sm">
            <div className="h-16 w-16 bg-slate-900 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/5">
              <BookOpen className="text-slate-700" size={32} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              No articles yet.
            </h3>
            <p className="text-slate-500">
              Check back soon for technical insights.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post, index) => (
              <Link
                key={post.id}
                href={`/insights/${post.slug}`}
                className="group relative flex flex-col bg-slate-900/30 border border-white/15 rounded-3xl overflow-hidden hover:border-blue-500/30 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-900/10 hover:-translate-y-2"
              >
                {/* Image Container */}
                <div className="aspect-video relative overflow-hidden">
                  <Image
                    src={
                      post.coverImage ||
                      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80"
                    }
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-transparent to-transparent opacity-60" />

                  {post.category && (
                    <div className="absolute top-4 left-4 px-3 py-1 rounded-lg bg-black/50 backdrop-blur-md border border-white/10 text-[10px] font-black uppercase tracking-widest text-white">
                      {post.category.name}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-8 flex flex-col flex-1">
                  <div className="flex items-center gap-4 text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">
                    <span className="flex items-center gap-1.5 focus:outline-none">
                      <Calendar size={13} className="text-blue-500" />
                      {new Date(post.createdAt).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1.5 focus:outline-none">
                      <User size={13} className="text-blue-500" />
                      {post.author?.name || "Admin"}
                    </span>
                  </div>

                  <h3 className="text-2xl font-black text-white group-hover:text-blue-400 transition-colors mb-4 line-clamp-2 leading-tight">
                    {post.title}
                  </h3>

                  <p className="text-slate-400 leading-relaxed mb-8 line-clamp-3 text-sm font-medium">
                    {post.description ||
                      (post.content.length > 150
                        ? post.content.substring(0, 150) + "..."
                        : post.content)}
                  </p>

                  <div className="mt-auto flex items-center text-xs font-black uppercase tracking-widest text-blue-500 group-hover:text-blue-400 transition-all">
                    Read Article
                    <ArrowRight
                      size={16}
                      className="ml-2 transform group-hover:translate-x-1 transition-transform"
                    />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
