"use client";

import { useState, useEffect } from "react";
import {
  User,
  Plus,
  Trash2,
  Loader2,
  AlertCircle,
  ChevronLeft,
  Camera,
  AtSign,
} from "lucide-react";
import { Button } from "@/modules/app/button";
import { getAuthors, createAuthor } from "../actions";
import Link from "next/link";

export default function AuthorsPage() {
  const [authors, setAuthors] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    avatar: "",
    bio: "",
  });

  const fetchAuthors = async () => {
    setIsLoading(true);
    try {
      const data = await getAuthors();
      setAuthors(data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch authors");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAuthors();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    setIsCreating(true);
    try {
      await createAuthor(formData);
      setFormData({ name: "", avatar: "", bio: "" });
      fetchAuthors();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/blog"
          className="p-2 hover:bg-white/5 rounded-xl transition-colors text-slate-500"
        >
          <ChevronLeft size={24} />
        </Link>
        <div>
          <h1 className="text-3xl font-black text-white flex items-center gap-3 uppercase tracking-tight">
            <User className="text-blue-500" size={32} />
            Editor Profiles
          </h1>
          <p className="text-slate-400 font-medium">
            Manage the voices behind PDFBridge Journals.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        <div className="md:col-span-1 space-y-6">
          <form
            onSubmit={handleCreate}
            className="p-6 rounded-3xl bg-slate-900/40 border border-white/5 space-y-4"
          >
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">
              Add New Author
            </h3>

            <div className="space-y-3">
              <label className="text-[10px] font-bold uppercase text-slate-500 ml-1">
                Full Name
              </label>
              <input
                type="text"
                placeholder="e.g. Francis Bello"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full bg-slate-950 border border-white/5 rounded-xl px-4 py-3 text-sm text-white focus:outline-hidden focus:border-blue-500/50 transition-all font-medium"
              />
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-bold uppercase text-slate-500 ml-1">
                Avatar URL
              </label>
              <div className="relative">
                <Camera
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600"
                  size={14}
                />
                <input
                  type="text"
                  placeholder="https://..."
                  value={formData.avatar}
                  onChange={(e) =>
                    setFormData({ ...formData, avatar: e.target.value })
                  }
                  className="w-full bg-slate-950 border border-white/5 rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-400 focus:outline-hidden focus:border-blue-500/50"
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-bold uppercase text-slate-500 ml-1">
                Short Bio
              </label>
              <textarea
                placeholder="Tell us about the author..."
                value={formData.bio}
                onChange={(e) =>
                  setFormData({ ...formData, bio: e.target.value })
                }
                className="w-full h-24 bg-slate-950 border border-white/5 rounded-xl px-4 py-3 text-xs text-slate-400 focus:outline-hidden focus:border-blue-500/50 resize-none"
              />
            </div>

            <Button
              type="submit"
              disabled={isCreating}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold h-11"
            >
              {isCreating ? (
                "Adding..."
              ) : (
                <>
                  <Plus size={18} className="mr-2" /> Add Author
                </>
              )}
            </Button>
          </form>
        </div>

        <div className="md:col-span-2">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader2 className="animate-spin text-blue-500" size={32} />
              <p className="text-slate-500 font-black uppercase text-[10px] tracking-widest">
                Scanning Registry...
              </p>
            </div>
          ) : error ? (
            <div className="p-8 rounded-3xl bg-red-500/5 border border-red-500/10 text-center space-y-4">
              <AlertCircle className="mx-auto text-red-500" size={32} />
              <p className="text-red-400 text-sm font-medium">{error}</p>
            </div>
          ) : authors.length === 0 ? (
            <div className="py-20 text-center border-2 border-dashed border-white/5 rounded-3xl">
              <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">
                No authors registered yet
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {authors.map((author) => (
                <div
                  key={author.id}
                  className="group p-6 bg-slate-900/30 border border-white/5 rounded-2xl flex items-center justify-between hover:border-blue-500/30 transition-all"
                >
                  <div className="flex items-center gap-6">
                    <div className="h-14 w-14 rounded-full overflow-hidden border border-white/10 bg-slate-950">
                      {author.avatar ? (
                        <img
                          src={author.avatar}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-700">
                          <User size={24} />
                        </div>
                      )}
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-bold text-white uppercase tracking-tight">
                        {author.name}
                      </h4>
                      <p className="text-xs text-slate-500 line-clamp-1 max-w-sm">
                        {author.bio || "No bio provided"}
                      </p>
                    </div>
                  </div>
                  <button className="p-2 text-slate-800 hover:text-red-400 transition-colors">
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
