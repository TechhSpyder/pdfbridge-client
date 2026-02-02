"use client";

import { useState, useEffect } from "react";
import {
  Layers,
  Plus,
  Trash2,
  Loader2,
  AlertCircle,
  ChevronLeft,
} from "lucide-react";
import { Button } from "@/modules/app/button";
import { getCategories, createCategory } from "../actions";
import Link from "next/link";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newCategory, setNewCategory] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch topics");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.trim()) return;

    setIsCreating(true);
    try {
      await createCategory(newCategory);
      setNewCategory("");
      fetchCategories();
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
            <Layers className="text-blue-500" size={32} />
            Journal Topics
          </h1>
          <p className="text-slate-400 font-medium">
            Categorize your engineering insights.
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
              Add New Topic
            </h3>
            <div className="space-y-2">
              <input
                type="text"
                placeholder="e.g. Infrastructure"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="w-full bg-slate-950 border border-white/5 rounded-xl px-4 py-3 text-sm text-white focus:outline-hidden focus:border-blue-500/50 transition-all font-medium"
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
                  <Plus size={18} className="mr-2" /> Add Topic
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
                Loading Library...
              </p>
            </div>
          ) : error ? (
            <div className="p-8 rounded-3xl bg-red-500/5 border border-red-500/10 text-center space-y-4">
              <AlertCircle className="mx-auto text-red-500" size={32} />
              <p className="text-red-400 text-sm font-medium">{error}</p>
            </div>
          ) : categories.length === 0 ? (
            <div className="py-20 text-center border-2 border-dashed border-white/5 rounded-3xl">
              <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">
                No topics defined yet
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  className="group p-4 bg-slate-900/30 border border-white/5 rounded-2xl flex items-center justify-between hover:border-blue-500/30 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-xl bg-blue-600/10 flex items-center justify-center">
                      <Layers className="text-blue-500" size={18} />
                    </div>
                    <div>
                      <h4 className="font-bold text-white uppercase tracking-tight">
                        {cat.name}
                      </h4>
                      <p className="text-[10px] text-slate-500 font-mono">
                        /{cat.slug}
                      </p>
                    </div>
                  </div>
                  <button className="p-2 text-slate-700 hover:text-red-400 transition-colors">
                    <Trash2 size={16} />
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
