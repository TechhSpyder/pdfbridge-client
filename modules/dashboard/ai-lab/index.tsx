"use client";

import { useState, useEffect, useRef } from "react";
import {
  useGenerateTemplate,
  useMe,
  useSaveTemplate,
} from "@/modules/hooks/queries";
import { Button } from "@/modules/app/button";
import {
  Sparkles,
  Send,
  Code2,
  Eye,
  Copy,
  Check,
  RotateCcw,
  Zap,
  Info,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/utils";
import Title from "@/modules/app/title";
import { Dialog } from "@/modules/app";

export function AiLabPage() {
  const [prompt, setPrompt] = useState("");
  const [html, setHtml] = useState("");
  const [css, setCss] = useState("");
  const [view, setView] = useState<"preview" | "code">("preview");
  const [isCopied, setIsCopied] = useState(false);
  const [panelOpen, setPanelOpen] = useState(true);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { data: userData } = useMe();
  const generateMutation = useGenerateTemplate();
  const saveMutation = useSaveTemplate();

  // Auto-collapse panel after generation
  useEffect(() => {
    if (html && !generateMutation.isPending) {
      setPanelOpen(false);
    }
  }, [html, generateMutation.isPending]);

  const [saveName, setSaveName] = useState("My AI Template");
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);

  const handleSave = async () => {
    if (!html) return;
    setIsSaveDialogOpen(true);
  };

  const confirmSave = async () => {
    if (!saveName) return;
    setIsSaveDialogOpen(false);
    const tId = toast.loading("Saving template...");
    try {
      await saveMutation.mutateAsync({
        name: saveName,
        html,
        css,
        prompt,
      });
      toast.success("Template saved to your library!", { id: tId });
    } catch (error: any) {
      toast.error(error.message || "Failed to save template", { id: tId });
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a description for your template");
      return;
    }

    const tId = toast.loading("AI is crafting your PDF layout...");
    try {
      const response: any = await generateMutation.mutateAsync({ prompt });
      if (response.success && response.data) {
        setHtml(response.data.html);
        setCss(response.data.css);
        toast.success("Template generated!", { id: tId });
      } else {
        throw new Error(response.message || "Failed to generate template");
      }
    } catch (error: any) {
      toast.error(error.message || "Something went wrong", { id: tId });
    }
  };

  const handleCopy = () => {
    const fullHtml = `
<!DOCTYPE html>
<html>
<head>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>${css}</style>
</head>
<body>
  ${html}
</body>
</html>`;
    navigator.clipboard.writeText(fullHtml);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
    toast.success("HTML copied to clipboard");
  };

  useEffect(() => {
    if (iframeRef.current && html) {
      const doc = iframeRef.current.contentDocument;
      if (doc) {
        doc.open();
        doc.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <script src="https://cdn.tailwindcss.com"></script>
              <style>
                body { margin: 0; padding: 20px; background: white; }
                ${css}
              </style>
            </head>
            <body>
              ${html}
            </body>
          </html>
        `);
        doc.close();
      }
    }
  }, [html, css, view]);

  const aiTemplateLimit = userData?.plan?.aiTemplateLimit || 0;
  const aiTemplateCount = userData?.usage?.aiTemplateCount || 0;
  const remaining = Math.max(0, aiTemplateLimit - aiTemplateCount);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <Title
          title="AI Template Lab"
          description="Design high-conversion PDF layouts using natural language."
          icon={<Sparkles className="h-8 w-8 text-indigo-500" />}
        />

        <div className="flex items-center gap-3">
          {/* Toggle Panel Button */}
          {html && (
            <button
              onClick={() => setPanelOpen(!panelOpen)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-slate-400 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all duration-300"
            >
              {panelOpen ? (
                <PanelLeftClose className="h-4 w-4" />
              ) : (
                <PanelLeftOpen className="h-4 w-4" />
              )}
              {panelOpen ? "Collapse" : "Prompt"}
            </button>
          )}
          <div className="flex items-center gap-3 bg-indigo-500/10 border border-indigo-500/20 px-4 py-2 rounded-2xl">
            <Zap className="h-4 w-4 text-indigo-500" />
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-slate-500 uppercase leading-none mb-0.5">
                Credits Remaining
              </span>
              <span className="text-sm font-bold text-white leading-none">
                {remaining} / {aiTemplateLimit}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-8 items-start">
        {/* Left Pane: Controls — collapsible */}
        <div
          className={cn(
            "shrink-0 space-y-6 transition-all duration-500 ease-in-out overflow-hidden",
            panelOpen
              ? "w-[340px] opacity-100 translate-x-0"
              : "w-0 opacity-0 -translate-x-4 pointer-events-none",
          )}
        >
          <div className="w-[340px]">
            <div className="p-6 rounded-3xl border border-white/15 bg-slate-900/40 backdrop-blur-md space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  Prompt
                  <Info className="h-3 w-3" />
                </label>
                <textarea
                  ref={textareaRef}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g. A sleek modern invoice for a tech startup, using purple accents and Inter font. Include a table for items and a nice footer."
                  className="w-full h-40 bg-black/40 border border-white/5 rounded-2xl p-4 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all resize-none"
                />
              </div>

              <Button
                onClick={handleGenerate}
                disabled={generateMutation.isPending || remaining === 0}
                className="w-full h-12 bg-indigo-600 hover:bg-indigo-500 text-white font-bold gap-2 shadow-lg shadow-indigo-600/20"
              >
                {generateMutation.isPending ? (
                  <RotateCcw className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                {generateMutation.isPending
                  ? "Generating..."
                  : "Generate Layout"}
              </Button>

              {remaining === 0 && (
                <p className="text-[10px] text-center text-orange-400 font-medium">
                  You've reached your monthly AI Template limit. Upgrade to
                  generate more.
                </p>
              )}
            </div>

            <div className="p-6 mt-6 rounded-3xl border border-white/15 bg-slate-900/20 space-y-4">
              <h4 className="text-xs font-bold text-white">Sample Prompts</h4>
              <div className="space-y-2">
                {[
                  "Modern real estate property listing with a grid of features.",
                  "E-commerce order confirmation with a bold header.",
                  "Professional certificate with a signature line and gold border.",
                ].map((s) => (
                  <button
                    key={s}
                    onClick={() => {
                      setPrompt(s);
                      textareaRef.current?.focus();
                    }}
                    className="w-full text-left p-3 rounded-xl bg-white/10 hover:bg-white/15 text-[11px] text-slate-400 transition-colors duration-200"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Pane: Preview/Code — expands to full width when panel is collapsed */}
        <div
          className={cn(
            "flex flex-col h-[700px] border border-white/10 rounded-3xl bg-[#09090b] overflow-hidden shadow-2xl transition-all duration-500 ease-in-out",
            panelOpen ? "flex-1" : "w-full",
          )}
        >
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-black/40">
            <div className="flex p-1 bg-white/5 rounded-xl border border-white/5">
              <button
                onClick={() => setView("preview")}
                className={cn(
                  "flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all duration-300",
                  {
                    "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20":
                      view === "preview",
                    "text-slate-500 hover:text-slate-300": view !== "preview",
                  },
                )}
              >
                <Eye className="h-3.5 w-3.5" />
                Live Preview
              </button>
              <button
                onClick={() => setView("code")}
                className={cn(
                  "flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all duration-300",
                  {
                    "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20":
                      view === "code",
                    "text-slate-500 hover:text-slate-300": view !== "code",
                  },
                )}
              >
                <Code2 className="h-3.5 w-3.5" />
                Inspect Code
              </button>
            </div>

            <div className="flex gap-2">
              {html && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleSave}
                  disabled={saveMutation.isPending}
                  className="h-9 px-4 border-indigo-500/20 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 font-bold gap-2"
                >
                  {saveMutation.isPending ? (
                    <RotateCcw className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Sparkles className="h-3.5 w-3.5" />
                  )}
                  Save Template
                </Button>
              )}
              <Button
                variant="secondary"
                size="sm"
                onClick={handleCopy}
                disabled={!html}
                className="h-9 px-3 border-white/5 bg-white/5 hover:bg-white/10"
              >
                {isCopied ? (
                  <Check className="h-3.5 w-3.5 text-emerald-500" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
              </Button>
            </div>
          </div>

          <div
            className="flex-1 relative overflow-hidden bg-slate-900/20"
            data-lenis-prevent
          >
            {!html && !generateMutation.isPending && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
                <div className="h-20 w-20 bg-indigo-500/10 rounded-full flex items-center justify-center mb-6 border border-indigo-500/20 shadow-inner">
                  <Sparkles className="h-10 w-10 text-indigo-500" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">
                  Ready to Design?
                </h3>
                <p className="text-sm text-slate-500 max-w-sm">
                  Enter a description on the left and our AI will build you a
                  production-ready PDF template in seconds.
                </p>
              </div>
            )}

            {generateMutation.isPending && (
              <div className="absolute inset-0 z-10 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center gap-4">
                <RotateCcw className="h-10 w-10 animate-spin text-indigo-500" />
                <div className="text-sm font-bold text-white animate-pulse uppercase tracking-widest">
                  AI is thinking...
                </div>
              </div>
            )}

            {view === "preview" ? (
              <iframe
                ref={iframeRef}
                className={cn(
                  "w-full h-full transition-opacity duration-500",
                  html ? "opacity-100" : "opacity-0",
                )}
                title="Template Preview"
              />
            ) : (
              <div
                className="w-full h-full p-6 overflow-y-auto overflow-x-hidden font-mono text-[11px]"
                data-lenis-prevent
              >
                <textarea
                  value={html}
                  onChange={(e) => setHtml(e.target.value)}
                  className="w-full h-full min-h-[600px] bg-black/40 border border-white/5 rounded-xl p-4 text-slate-300 focus:outline-none focus:ring-1 ring-indigo-500/50 resize-none transition-all duration-300"
                  spellCheck={false}
                  data-lenis-prevent
                />
              </div>
            )}
          </div>
        </div>
      </div>
      <SaveTemplateDialog
        open={isSaveDialogOpen}
        onOpenChange={setIsSaveDialogOpen}
        name={saveName}
        setName={setSaveName}
        onConfirm={confirmSave}
        isPending={saveMutation.isPending}
      />
    </div>
  );
}

function SaveTemplateDialog({
  open,
  onOpenChange,
  name,
  setName,
  onConfirm,
  isPending,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  name: string;
  setName: (name: string) => void;
  onConfirm: () => void;
  isPending: boolean;
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content className="max-w-md">
        <Dialog.Header>
          <Dialog.Title>Save AI Template</Dialog.Title>
        </Dialog.Header>
        <Dialog.Body className="items-start gap-4">
          <p className="text-sm text-slate-400">
            Give your template a name to save it to your library.
          </p>
          <div className="w-full space-y-2">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              Template Name
            </label>
            <input
              autoFocus
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && onConfirm()}
              className="w-full bg-black/40 border border-white/5 text-slate-300 rounded-xl p-4 text-sm focus:outline-none focus:border-blue-500/50 transition-colors"
              placeholder="e.g. Modern Invoice"
            />
          </div>
        </Dialog.Body>
        <Dialog.Footer className="gap-3">
          <Dialog.Close>
            <Button variant="secondary" className="h-11 px-6">
              Cancel
            </Button>
          </Dialog.Close>
          <Button
            onClick={onConfirm}
            disabled={!name || isPending}
            className="h-11 px-8 bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-xl shadow-blue-600/20"
          >
            {isPending ? "Saving..." : "Save Template"}
          </Button>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>
  );
}
