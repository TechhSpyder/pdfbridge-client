"use client";

import { useState, useEffect } from "react";
import {
  Save,
  X,
  Image as ImageIcon,
  Send,
  PenLine,
  Eye,
  Plus,
  Trash2,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/modules/app/button";
import { upsertPost, getCategories, getAuthors } from "./actions";
import RichTextEditor from "@/modules/dashboard/blog/RichTextEditor";
import sanitizeHtml from "sanitize-html";
import Image from "next/image";

interface EditorProps {
  post?: any;
  onClose: () => void;
}

export default function BlogEditor({ post, onClose }: EditorProps) {
  const [formData, setFormData] = useState({
    title: post?.title || "",
    slug: post?.slug || "",
    content: post?.content || "",
    excerpt: post?.excerpt || "",
    description: post?.description || "",
    tags: post?.tags?.join(", ") || "",
    coverImage: post?.coverImage || "",
    published: post?.published || false,
    categoryId: post?.categoryId || "",
    authorId: post?.authorId || "",
  });

  const [categories, setCategories] = useState<any[]>([]);
  const [authors, setAuthors] = useState<any[]>([]);
  const [isPreview, setIsPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([getCategories(), getAuthors()]).then(([cats, auths]) => {
      setCategories(cats);
      setAuthors(auths);
    });
  }, []);

  const handleSave = async () => {
    if (!formData.title || !formData.content) {
      setError("Title and content are required.");
      return;
    }
    setError(null);
    setIsSaving(true);
    try {
      await upsertPost({
        id: post?.id,
        ...formData,
        tags: formData.tags
          .split(",")
          .map((t: string) => t.trim())
          .filter((t: string) => t !== ""),
      });
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to save post");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      data-lenis-prevent
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl p-4 md:p-8 animate-in fade-in duration-300"
    >
      <div className="w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col bg-slate-950 border border-white/10 rounded-3xl shadow-2xl">
        {/* Editor Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-xl bg-blue-600/20 flex items-center justify-center">
              <PenLine className="text-blue-500" size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">
                {post ? "Edit Article" : "Draft New Article"}
              </h2>
              <div className="text-xs text-slate-500 font-medium tracking-wide flex items-center gap-2 mt-0.5 uppercase">
                {formData.published ? (
                  <span className="flex items-center gap-1.5 text-emerald-500">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />{" "}
                    Published
                  </span>
                ) : (
                  <div className="flex items-center gap-1.5 text-orange-500">
                    <div className="h-1.5 w-1.5 rounded-full bg-orange-500 animate-pulse" />{" "}
                    Draft
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => setIsPreview(!isPreview)}
              className="border-white/5 bg-white/5 hover:bg-white/10 text-white"
            >
              {isPreview ? (
                <PenLine size={18} className="mr-2" />
              ) : (
                <Eye size={18} className="mr-2" />
              )}
              {isPreview ? "Edit" : "Preview"}
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-600/20 text-white font-bold"
            >
              {isSaving ? (
                "Saving..."
              ) : (
                <>
                  <Save size={18} className="mr-2" />
                  {formData.published ? "Update Article" : "Save Draft"}
                </>
              )}
            </Button>

            {!formData.published && (
              <Button
                onClick={async () => {
                  setFormData((prev) => ({ ...prev, published: true }));
                  // We need to pass the updated published state immediately
                  setIsSaving(true);
                  try {
                    await upsertPost({
                      id: post?.id,
                      ...formData,
                      published: true,
                      tags: formData.tags
                        .split(",")
                        .map((t: string) => t.trim())
                        .filter((t: string) => t !== ""),
                    });
                    onClose();
                  } catch (err: any) {
                    setError(err.message || "Failed to publish post");
                  } finally {
                    setIsSaving(false);
                  }
                }}
                disabled={isSaving}
                className="bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-600/20 text-white font-bold"
              >
                <Send size={18} className="mr-2" /> Publish Now
              </Button>
            )}
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/5 rounded-xl transition-colors text-slate-500 hover:text-white"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="flex-1 flex flex-col overflow-hidden">
          {error && (
            <div className="mb-8 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center gap-3 text-red-400 animate-in shake-in duration-300">
              <AlertCircle size={20} />
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          {isPreview ? (
            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
              <div className="max-w-3xl mx-auto prose prose-invert prose-blue">
                <h1 className="text-4xl font-black uppercase tracking-tight">
                  {formData.title || "Untitled Article"}
                </h1>
                {formData.coverImage && (
                  <img
                    src={formData.coverImage}
                    className="w-full rounded-2xl my-8 border border-white/10"
                  />
                )}
                <div
                  className="prose prose-invert prose-blue max-w-none"
                  dangerouslySetInnerHTML={{
                    __html: sanitizeHtml(formData.content, {
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
                        "*": [
                          "text-*",
                          "bg-*",
                          "underline",
                          "prose-*",
                          "hljs-*",
                        ],
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
            </div>
          ) : (
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 h-full overflow-hidden">
              <div
                data-lenis-prevent
                className="lg:col-span-2 h-full overflow-y-auto p-8 custom-scrollbar space-y-8"
              >
                {/* Main Content */}
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">
                    Article Title
                  </label>
                  <input
                    type="text"
                    placeholder="Engineering PDFBridge: Scaling beyond limits..."
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="w-full bg-slate-900/50 border border-white/5 rounded-2xl px-6 py-4 text-2xl font-bold text-white focus:outline-hidden focus:border-blue-500/50 transition-all placeholder:text-slate-800"
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">
                    Content
                  </label>
                  <RichTextEditor
                    content={formData.content}
                    onChange={(content) =>
                      setFormData({ ...formData, content })
                    }
                  />
                </div>
              </div>
              <div
                data-lenis-prevent
                className="lg:col-span-1 h-full overflow-y-auto p-8 border-l border-white/5 bg-slate-900/10 space-y-8 custom-scrollbar"
              >
                {/* Sidebar Config */}
                <div className="p-6 rounded-3xl bg-slate-900/30 border border-white/5 space-y-6">
                  <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">
                    Settings
                  </h3>

                  <div className="space-y-3">
                    <label className="text-[10px] font-bold uppercase text-slate-500">
                      URL Slug
                    </label>
                    <input
                      type="text"
                      placeholder="scaling-beyond-limits"
                      value={formData.slug}
                      onChange={(e) =>
                        setFormData({ ...formData, slug: e.target.value })
                      }
                      className="w-full bg-slate-950 border border-white/5 rounded-xl px-4 py-2.5 text-sm text-slate-300 focus:border-blue-500/50 focus:outline-hidden"
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-bold uppercase text-slate-500">
                      Category
                    </label>
                    <select
                      value={formData.categoryId}
                      onChange={(e) =>
                        setFormData({ ...formData, categoryId: e.target.value })
                      }
                      className="w-full bg-slate-950 border border-white/5 rounded-xl px-4 py-2.5 text-sm text-slate-300 focus:border-blue-500/50 focus:outline-hidden appearance-none"
                    >
                      <option value="">Select Topic</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-bold uppercase text-slate-500">
                      Author
                    </label>
                    <select
                      value={formData.authorId}
                      onChange={(e) =>
                        setFormData({ ...formData, authorId: e.target.value })
                      }
                      className="w-full bg-slate-950 border border-white/5 rounded-xl px-4 py-2.5 text-sm text-slate-300 focus:border-blue-500/50 focus:outline-hidden appearance-none"
                    >
                      <option value="">Select Author</option>
                      {authors.map((a) => (
                        <option key={a.id} value={a.id}>
                          {a.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="pt-4 border-t border-white/5">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <div
                        className={`w-12 h-6 rounded-full transition-all flex items-center p-1 ${formData.published ? "bg-emerald-600" : "bg-slate-800"}`}
                      >
                        <div
                          className={`h-4 w-4 bg-white rounded-full transition-all shadow-md ${formData.published ? "translate-x-6" : "translate-x-0"}`}
                        />
                      </div>
                      <span className="text-sm font-bold text-slate-400 group-hover:text-white transition-colors">
                        Visible to Public
                      </span>
                      <input
                        type="checkbox"
                        className="hidden"
                        checked={formData.published}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            published: e.target.checked,
                          })
                        }
                      />
                    </label>
                  </div>
                </div>

                <div className="p-6 rounded-3xl bg-slate-900/30 border border-white/5 space-y-4">
                  <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                    <ImageIcon size={16} /> Featured Image
                  </h3>
                  <input
                    type="text"
                    placeholder="https://images.unsplash.com/..."
                    value={formData.coverImage}
                    onChange={(e) =>
                      setFormData({ ...formData, coverImage: e.target.value })
                    }
                    className="w-full bg-slate-950 border border-white/5 rounded-xl px-4 py-2.5 text-xs text-slate-400 focus:border-blue-500/50 focus:outline-hidden"
                  />
                  {formData.coverImage && (
                    <div className="aspect-video rounded-xl overflow-hidden border border-white/10 group relative">
                      <Image
                        src={formData.coverImage || ""}
                        alt="Cover preview"
                        width={400}
                        height={225}
                        className="w-full h-full object-cover"
                        unoptimized
                      />
                      <button
                        onClick={() =>
                          setFormData({ ...formData, coverImage: "" })
                        }
                        className="absolute top-2 right-2 p-1.5 rounded-lg bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  )}
                </div>
                <div className="p-6 rounded-3xl bg-slate-900/30 border border-white/5 space-y-3">
                  <label className="text-[10px] font-bold uppercase text-slate-500">
                    Short Excerpt
                  </label>
                  <textarea
                    value={formData.excerpt}
                    onChange={(e) =>
                      setFormData({ ...formData, excerpt: e.target.value })
                    }
                    className="w-full h-24 bg-slate-950 border border-white/5 rounded-xl px-4 py-3 text-sm text-slate-400 focus:border-blue-500/50 focus:outline-hidden resize-none"
                    placeholder="A brief summary for listings..."
                  />
                </div>

                <div className="p-6 rounded-3xl bg-slate-900/30 border border-white/5 space-y-3">
                  <label className="text-[10px] font-bold uppercase text-slate-500">
                    SEO Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="w-full h-24 bg-slate-950 border border-white/5 rounded-xl px-4 py-3 text-sm text-slate-400 focus:border-blue-500/50 focus:outline-hidden resize-none"
                    placeholder="Meta description for search engines..."
                  />
                </div>

                <div className="p-6 rounded-3xl bg-slate-900/30 border border-white/5 space-y-3">
                  <label className="text-[10px] font-bold uppercase text-slate-500">
                    Tags (comma separated)
                  </label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) =>
                      setFormData({ ...formData, tags: e.target.value })
                    }
                    className="w-full bg-slate-950 border border-white/5 rounded-xl px-4 py-2.5 text-sm text-slate-400 focus:border-blue-500/50 focus:outline-hidden"
                    placeholder="nextjs, scale, engineering"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <style jsx global>{`
        .prose table {
          width: 100%;
          border-collapse: collapse;
          margin: 2rem 0;
          font-size: 0.9rem;
          line-height: 1.5;
        }
        .prose th {
          background: rgba(255, 255, 255, 0.05);
          font-weight: 700;
          text-align: left;
          padding: 0.75rem 1rem;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .prose td {
          padding: 0.75rem 1rem;
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #cbd5e1;
        }
        .prose pre {
          background: #0d1117 !important;
          border: 1px solid rgba(255, 255, 255, 0.05) !important;
          padding: 1.5rem !important;
          border-radius: 1rem !important;
          margin: 2.5rem 0 !important;
          box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.5);
        }
        .prose code {
          font-family: var(--font-mono), monospace !important;
          font-size: 0.95rem !important;
          background: transparent !important;
          padding: 0 !important;
        }
        .prose p {
          margin-bottom: 2rem !important;
        }
        .prose hr {
          border: none !important;
          border-top: 1px solid rgba(255, 255, 255, 0.1) !important;
          margin: 4rem 0 !important;
        }
        .prose mark {
          background-color: rgba(59, 130, 246, 0.3);
          color: inherit;
          padding: 0 0.2rem;
          border-radius: 0.2rem;
        }
        /* Syntax Highlighting - GitHub Dark Dimmed inspired */
        .hljs-comment,
        .hljs-quote {
          color: #768390;
          font-style: italic;
        }
        .hljs-keyword,
        .hljs-selector-tag {
          color: #f47067;
        }
        .hljs-string,
        .hljs-attr,
        .hljs-variable,
        .hljs-template-variable {
          color: #96d0ff;
        }
        .hljs-type,
        .hljs-selector-id,
        .hljs-selector-class,
        .hljs-quote,
        .hljs-template-tag,
        .hljs-deletion {
          color: #f69d50;
        }
        .hljs-title,
        .hljs-section,
        .hljs-bullet {
          color: #dcbdfb;
        }
        .hljs-addition {
          color: #adbac7;
          background-color: #223d33;
        }
        .hljs-deletion {
          color: #adbac7;
          background-color: #442320;
        }
        .hljs-emphasis {
          font-style: italic;
        }
        .hljs-strong {
          font-weight: bold;
        }
      `}</style>
    </div>
  );
}
