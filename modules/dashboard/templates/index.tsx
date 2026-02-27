"use client";

import { useTemplates, useDeleteTemplate } from "@/modules/hooks/queries";
import { GlowCard } from "@/modules/app/glow-card";
import { Button } from "@/modules/app/button";
import {
  FileText,
  Trash2,
  Eye,
  Plus,
  Loader2,
  Clock,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import Title from "@/modules/app/title";
import { useState } from "react";
import { cn } from "@/utils";
import { UseTemplateModal } from "./UseTemplateModal";

export function TemplatesDashboard() {
  const { data: templatesData, isLoading, error } = useTemplates();
  const deleteMutation = useDeleteTemplate();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleUse = (template: any) => {
    setSelectedTemplate(template);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this template?")) return;

    setDeletingId(id);
    try {
      await deleteMutation.mutateAsync(id);
      toast.success("Template deleted successfully");
    } catch (err: any) {
      toast.error(err.message || "Failed to delete template");
    } finally {
      setDeletingId(null);
    }
  };

  const templates = templatesData?.data || [];

  if (error) {
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center text-center">
        <div className="bg-red-500/10 p-4 rounded-full mb-4">
          <FileText className="h-10 w-10 text-red-500" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">
          Error Loading Templates
        </h2>
        <p className="text-slate-400 mb-6">{error.message}</p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <Title
          title="My Templates"
          description="Manage and reuse your custom PDF layouts."
          icon={<FileText className="h-8 w-8 text-indigo-500" />}
        />
        <Link href="/dashboard/lab">
          <Button className="gap-2 font-bold bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/20">
            <Plus className="h-4 w-4" />
            New Template
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-48 rounded-2xl bg-white/5 animate-pulse border border-white/10"
            />
          ))}
        </div>
      ) : templates.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-white/15 rounded-3xl bg-slate-900/20">
          <div className="h-20 w-20 bg-indigo-500/10 rounded-full flex items-center justify-center mb-6 border border-indigo-500/20">
            <Sparkles className="h-10 w-10 text-indigo-500" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">
            No Templates Yet
          </h3>
          <p className="text-sm text-slate-500 max-w-sm mb-8">
            Start by generating template layouts in the AI Lab. Once saved,
            they'll appear here for easy reuse.
          </p>
          <Link href="/dashboard/lab">
            <Button variant="secondary" className="gap-2">
              Go to AI Lab <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template: any) => (
            <GlowCard
              key={template.id}
              title={template.name}
              sub={
                <div className="flex items-center gap-2 mt-1">
                  <Clock className="h-3 w-3" />
                  <span>
                    {new Date(template.createdAt).toLocaleDateString()}
                  </span>
                </div>
              }
              icon={<FileText className="h-5 w-5 text-indigo-400" />}
              content={
                <div className="mt-4 space-y-4">
                  {template.prompt && (
                    <p className="text-xs text-slate-500 line-clamp-2 italic">
                      "{template.prompt}"
                    </p>
                  )}
                  {template.variables && template.variables.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {template.variables.map((v: string) => (
                        <span
                          key={v}
                          className="text-[9px] font-mono font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-1.5 py-0.5 rounded uppercase tracking-tighter"
                        >
                          {v}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="flex items-center gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 h-9 text-[10px] font-bold border-indigo-500/20 bg-indigo-500/5 hover:bg-indigo-500/10 text-indigo-400 gap-2"
                      onClick={() => handleUse(template)}
                    >
                      <Plus className="h-3.5 w-3.5" />
                      Use
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-9 px-3 border-white/5 bg-white/5 hover:bg-white/10 gap-2"
                      onClick={() => toast.info("View flow coming soon!")}
                    >
                      <Eye className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-9 px-3 border-white/5 bg-white/5 hover:bg-red-500/10 hover:text-red-400 transition-colors"
                      onClick={() => handleDelete(template.id)}
                      disabled={deletingId === template.id}
                    >
                      {deletingId === template.id ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="h-3.5 w-3.5" />
                      )}
                    </Button>
                  </div>
                </div>
              }
            />
          ))}
        </div>
      )}

      <UseTemplateModal
        template={selectedTemplate}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
