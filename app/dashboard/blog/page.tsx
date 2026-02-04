"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  FileText,
  Calendar,
  MessageSquare,
  ThumbsUp,
  Eye,
  Edit3,
  Trash2,
  Loader2,
  AlertCircle,
  Layers,
  Users,
  ChevronRight,
  Sparkles,
  Send,
} from "lucide-react";
import { Button } from "@/modules/app/button";
import { getPosts, deletePost } from "./actions";
import BlogEditor from "./Editor";
import Link from "next/link";

export default function BlogCMSPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      const data = await getPosts();
      setPosts(data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch journals");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this journal?")) return;
    try {
      await deletePost(id);
      fetchPosts();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-white flex items-center gap-3 uppercase tracking-tight">
            <Sparkles className="text-blue-500" size={32} />
            Journal CMS
          </h1>
          <p className="text-slate-400 font-medium">
            Manage engineering deep-dives and product updates.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/dashboard/blog/categories">
            <Button
              variant="outline"
              className="border-white/5 bg-white/5 hover:bg-white/10 text-white"
            >
              <Layers size={18} className="mr-2" /> Topics
            </Button>
          </Link>
          <Link href="/dashboard/blog/authors">
            <Button
              variant="outline"
              className="border-white/5 bg-white/5 hover:bg-white/10 text-white"
            >
              <Users size={18} className="mr-2" /> Authors
            </Button>
          </Link>
          <Button
            onClick={() => {
              setSelectedPost(null);
              setIsEditorOpen(true);
            }}
            className="bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-600/20 text-white font-bold"
          >
            <Plus size={18} className="mr-2" /> New Journal
          </Button>
        </div>
      </div>

      {/* Stats / Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="p-6 rounded-3xl bg-blue-600/10 border border-blue-500/20 group hover:bg-blue-600/15 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="h-10 w-10 rounded-xl bg-blue-600/20 flex items-center justify-center">
              <FileText className="text-blue-500" size={20} />
            </div>
            <span className="text-2xl font-black text-white">
              {posts.length}
            </span>
          </div>
          <p className="text-xs font-black text-blue-400 uppercase tracking-widest">
            Total Journals
          </p>
        </div>
        <div className="p-6 rounded-3xl bg-emerald-600/10 border border-emerald-500/20 group hover:bg-emerald-600/15 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="h-10 w-10 rounded-xl bg-emerald-600/20 flex items-center justify-center">
              <Send className="text-emerald-500" size={20} />
            </div>
            <span className="text-2xl font-black text-white">
              {posts.filter((p) => p.published).length}
            </span>
          </div>
          <p className="text-xs font-black text-emerald-400 uppercase tracking-widest">
            Published
          </p>
        </div>
        <div className="md:col-span-2 p-6 rounded-3xl bg-slate-900/40 border border-white/5 flex items-center gap-6">
          <div className="flex-1 space-y-2">
            <p className="text-sm font-bold text-white">
              Ready for a new insight?
            </p>
            <p className="text-xs text-slate-500">
              Every piece of content helps our community scale.
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => {
              setSelectedPost(null);
              setIsEditorOpen(true);
            }}
            className="border-white/10 hover:bg-white/5 text-white"
          >
            Start Writing
          </Button>
        </div>
      </div>

      {/* Search & Listing */}
      <div className="space-y-6">
        <div className="relative group">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors"
            size={20}
          />
          <input
            type="text"
            placeholder="Search journals by title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900/50 border border-white/5 rounded-2xl pl-12 pr-4 py-4 text-white focus:outline-hidden focus:border-blue-500/50 transition-all font-medium placeholder:text-slate-700"
          />
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="animate-spin text-blue-500" size={40} />
            <p className="text-slate-500 font-bold tracking-widest uppercase text-xs">
              Accessing Neural Database...
            </p>
          </div>
        ) : error ? (
          <div className="p-8 rounded-3xl bg-red-500/5 border border-red-500/10 text-center space-y-4">
            <AlertCircle className="mx-auto text-red-500" size={40} />
            <p className="text-red-400 font-medium">{error}</p>
            <Button
              onClick={fetchPosts}
              variant="outline"
              className="border-red-500/20 text-red-400 hover:bg-red-500/10"
            >
              Retry
            </Button>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="py-20 text-center border-2 border-dashed border-white/5 rounded-3xl space-y-4">
            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">
              No journals found
            </p>
            <Button
              onClick={() => {
                setSelectedPost(null);
                setIsEditorOpen(true);
              }}
              variant="outline"
              className="border-white/10 text-white"
            >
              Create First Journal
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredPosts.map((post) => (
              <div
                key={post.id}
                className="group p-6 bg-slate-900/30 border border-white/5 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:border-blue-500/30 transition-all duration-300"
              >
                <div className="flex items-center gap-6 flex-1">
                  <div className="h-16 w-16 rounded-xl overflow-hidden border border-white/10 shrink-0 bg-slate-950">
                    {post.coverImage ? (
                      <img
                        src={post.coverImage}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-700">
                        <FileText size={20} />
                      </div>
                    )}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors uppercase tracking-tight">
                        {post.title}
                      </h3>
                      {post.description && (
                        <p className="text-xs text-slate-500 line-clamp-1 max-w-md">
                          {post.description}
                        </p>
                      )}
                      {post.published ? (
                        <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-black uppercase tracking-widest">
                          Live
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-md bg-orange-500/10 border border-orange-500/20 text-orange-500 text-[10px] font-black uppercase tracking-widest">
                          Draft
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                      <span className="flex items-center gap-1.5">
                        <Calendar size={12} className="text-blue-500" />{" "}
                        {new Date(post.createdAt).toLocaleDateString()}
                      </span>
                      {post.category && (
                        <span className="flex items-center gap-1.5">
                          <Layers size={12} className="text-blue-500" />{" "}
                          {post.category.name}
                        </span>
                      )}
                      <span className="flex items-center gap-1.5">
                        <ThumbsUp size={12} className="text-blue-500" />{" "}
                        {post._count.likes}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedPost(post);
                      setIsEditorOpen(true);
                    }}
                    className="flex-1 md:flex-none border-white/5 bg-white/5 hover:bg-white/10 text-white h-10 px-4"
                  >
                    <Edit3 size={16} className="mr-2" /> Edit
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleDelete(post.id)}
                    className="flex-1 md:flex-none border-red-500/10 bg-red-500/5 hover:bg-red-500/10 text-red-400 h-10 px-4 transition-all"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {isEditorOpen && (
        <BlogEditor
          post={selectedPost}
          onClose={() => {
            setIsEditorOpen(false);
            fetchPosts();
          }}
        />
      )}
    </div>
  );
}
