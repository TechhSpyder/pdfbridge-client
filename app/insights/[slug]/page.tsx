import { getPostBySlug, getRecentPosts } from "../actions";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
// import DOMPurify from "isomorphic-dompurify";
import { ChevronLeft } from "lucide-react";
import { Calendar } from "lucide-react";
import { Tag } from "lucide-react";
import { Clock } from "lucide-react";
import { Share2 } from "lucide-react";
import { ArrowRight } from "lucide-react";
import { BookMarked } from "lucide-react";
import sanitizeHtml from "sanitize-html";

export const dynamic = "force-dynamic";

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  const images = post.coverImage
    ? [
        {
          url: post.coverImage,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ]
    : [];

  return {
    title: post.title,
    description: post.description || post.title,
    openGraph: {
      title: post.title,
      description: post.description || post.title,
      type: "article",
      url: `https://pdfbridge.xyz/insights/${slug}`,
      images,
      publishedTime: post.createdAt
        ? new Date(post.createdAt).toISOString()
        : undefined,
      authors: [post.author?.name || "PDFBridge Team"],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description || post.title,
      images: post.coverImage ? [post.coverImage] : [],
    },
  };
}

export default async function InsightArticlePage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  const recentPosts = await getRecentPosts(2);

  if (!post) {
    notFound();
  }

  // Calculate read time
  const wordCount = post.content.split(/\s+/).length;
  const readTime = Math.max(1, Math.ceil(wordCount / 200));

  return (
    <article className="min-h-screen bg-slate-950 text-white selection:bg-blue-500/30 pb-20">
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-600/5 blur-[150px] rounded-full translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-900/5 blur-2xl rounded-full -translate-x-1/2 translate-y-1/2" />
      </div>

      {/* Navigation Header */}
      <div className="fixed top-16 inset-x-0 h-20 bg-slate-950/80 backdrop-blur-xl border-b border-white/5 z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto h-full px-6 flex items-center justify-between">
          <Link
            href="/insights"
            className="group flex items-center gap-2 text-sm font-black uppercase tracking-widest text-slate-400 hover:text-white transition-colors"
          >
            <ChevronLeft
              size={18}
              className="transform group-hover:-translate-x-1 transition-transform"
            />
            Back to Insights
          </Link>
          <div className="hidden md:flex items-center gap-4">
            <button className="p-2.5 cursor-pointer rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-all">
              <Share2 size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Hero Header */}
      <header className="pt-28 pb-12 relative z-10 px-6">
        <div className="max-w-4xl mx-auto">
          {post.category && (
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-600/10 border border-blue-500/20 text-blue-400 text-xs font-black uppercase tracking-widest mb-8">
              <Tag size={12} />
              {post.category.name}
            </div>
          )}

          <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-[1.1] mb-10 bg-linear-to-r from-white via-white to-slate-500 bg-clip-text text-transparent">
            {post.title}
          </h1>

          {post.description && (
            <p className="text-xl md:text-2xl text-slate-400 font-medium mb-10 leading-relaxed max-w-3xl">
              {post.description}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-6 text-[10px] font-black uppercase tracking-widest text-slate-500">
            <div className="flex items-center gap-2 group">
              <div className="h-10 w-10 rounded-full overflow-hidden border border-white/10 group-hover:border-blue-500/50 transition-colors">
                <Image
                  src={
                    post.author?.avatar ||
                    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80"
                  }
                  alt={post.author?.name || "Admin"}
                  width={40}
                  height={40}
                  className="object-cover"
                  sizes="40px"
                />
              </div>
              <div>
                <span className="block text-slate-400 text-[11px] mb-0.5">
                  {post.author?.name || "Admin"}
                </span>
                <span className="block text-slate-600">Product Engineer</span>
              </div>
            </div>

            <div className="h-4 w-px bg-white/10" />

            <div className="flex items-center gap-2">
              <Calendar size={14} className="text-blue-500" />
              {new Date(post.createdAt).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </div>

            <div className="flex items-center gap-2">
              <Clock size={14} className="text-blue-500" />
              {readTime} Min Read
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16 relative z-10">
        <div className="lg:col-span-8">
          {/* Featured Image */}
          <div className="aspect-video relative rounded-3xl overflow-hidden border border-white/10 mb-12 shadow-2xl">
            <Image
              src={
                post.coverImage ||
                "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80"
              }
              alt={post.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
            />
          </div>

          {/* Article Content */}
          <div className="prose prose-invert prose-blue prose-lg max-w-none prose-headings:font-black prose-headings:tracking-tighter prose-p:font-medium prose-p:text-slate-300 prose-p:leading-relaxed prose-strong:text-white prose-a:text-blue-400 prose-code:text-blue-200">
            <div
              dangerouslySetInnerHTML={{
                __html: sanitizeHtml(post.content, {
                  allowedTags: sanitizeHtml.defaults.allowedTags.concat([
                    "img",
                    "table",
                    "thead",
                    "tbody",
                    "tr",
                    "th",
                    "td",
                    "pre",
                    "code",
                    "span",
                    "br",
                    "hr",
                    "u",
                  ]),
                  allowedAttributes: {
                    ...sanitizeHtml.defaults.allowedAttributes,
                    span: ["class", "style"],
                    code: ["class"],
                    p: ["style", "class"],
                    h1: ["style", "class"],
                    h2: ["style", "class"],
                    h3: ["style", "class"],
                    a: ["href", "name", "target", "class"],
                    mark: ["class"],
                  },
                  allowedClasses: {
                    "*": ["text-*", "bg-*", "underline", "prose-*", "hljs-*"],
                  },
                  allowedStyles: {
                    "*": {
                      "text-align": [
                        /^left$/,
                        /^right$/,
                        /^center$/,
                        /^justify$/,
                      ],
                    },
                  },
                }),
              }}
            />
          </div>

          {post.tags && post.tags.length > 0 && (
            <div className="mt-12 flex flex-wrap gap-2">
              {post.tags.map((tag: string) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-lg bg-slate-900 border border-white/5 text-slate-500 text-[10px] font-black uppercase tracking-widest hover:text-blue-400 hover:border-blue-500/20 transition-colors"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          <hr className="my-16 border-white/5" />

          {/* Author Footer Card */}
          <div className="p-8 rounded-3xl bg-slate-900/50 border border-white/5 backdrop-blur-sm flex flex-col md:flex-row gap-8 items-center">
            <div className="h-20 w-20 rounded-2xl overflow-hidden border border-white/10 shrink-0">
              <Image
                src={
                  post.author?.avatar ||
                  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80"
                }
                alt={post.author?.name || "Admin"}
                width={80}
                height={80}
                className="object-cover"
                sizes="80px"
              />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h4 className="text-lg font-black mb-2">
                Written by {post.author?.name || "Admin"}
              </h4>
              <p className="text-slate-500 text-sm font-medium leading-relaxed mb-4">
                {post.author?.bio ||
                  "Exploring the intersection of engineering and design at PDFBridge. Passionate about scalability and reliable document processing."}
              </p>
              <div className="flex items-center justify-center md:justify-start gap-4">
                <Link
                  href="#"
                  className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-white transition-colors"
                >
                  Twitter
                </Link>
                <Link
                  href="#"
                  className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-white transition-colors"
                >
                  GitHub
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="lg:col-span-4 space-y-10">
          <div className="sticky top-32 space-y-10">
            {/* Recent Posts Widget */}
            <div className="p-8 rounded-3xl bg-white/2 border border-white/5 backdrop-blur-sm">
              <h3 className="text-xs font-black uppercase tracking-widest text-blue-500 mb-6 flex items-center gap-2">
                <BookMarked size={14} /> More from Insights
              </h3>
              <div className="space-y-6">
                {recentPosts
                  .filter((p) => p.id !== post.id)
                  .map((p) => (
                    <Link
                      key={p.id}
                      href={`/insights/${p.slug}`}
                      className="group block"
                    >
                      <span className="block text-[10px] font-black uppercase tracking-widest text-slate-600 mb-2 group-hover:text-blue-500 transition-colors">
                        {p.category?.name || "General"}
                      </span>
                      <h4 className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors leading-snug">
                        {p.title}
                      </h4>
                    </Link>
                  ))}
              </div>
              <Link
                href="/insights"
                className="inline-flex items-center gap-2 mt-8 text-xs font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors group"
              >
                Browse All{" "}
                <ArrowRight
                  size={14}
                  className="transform group-hover:translate-x-1 transition-transform"
                />
              </Link>
            </div>

            {/* CTA Widget */}
            <div className="p-8 rounded-3xl bg-linear-to-br from-blue-600 to-indigo-700 shadow-xl shadow-blue-900/20 relative overflow-hidden group">
              <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-40 h-40 bg-white/10 blur-2xl rounded-full group-hover:scale-125 transition-transform duration-700" />
              <h3 className="text-xl font-black mb-4 relative z-10">
                Ready to build?
              </h3>
              <p className="text-blue-100 text-sm font-medium mb-6 relative z-10 leading-relaxed">
                Join 1,000+ developers automating their PDF workflows with
                PDFBridge.
              </p>
              <Link
                href="/dashboard"
                className="w-full inline-flex items-center justify-center px-6 py-3 rounded-2xl bg-white text-blue-700 text-xs font-black uppercase tracking-widest hover:bg-slate-50 transition-colors relative z-10"
              >
                Start for Free
              </Link>
            </div>
          </div>
        </aside>
      </main>
    </article>
  );
}
