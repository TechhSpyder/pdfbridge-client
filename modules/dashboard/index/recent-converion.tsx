import { useConversions } from "@/modules/hooks/queries";
import { cn } from "@/utils";
import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "framer-motion";
import {
  Activity,
  Brain,
  Copy,
  Download,
  Loader2,
  X,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { Highlight, themes } from "prism-react-renderer";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

export function RecentConversionsList() {
  const [pollInterval, setPollInterval] = useState<number | undefined>(30000);
  const { data, isLoading, error } = useConversions(1, 5, pollInterval);
  const conversions = data?.conversions || [];

  const hasPending = conversions.some((c: any) => c.status === "PENDING");

  useEffect(() => {
    if (hasPending) {
      setPollInterval(3000); // Fast poll when things are happening
    } else {
      setPollInterval(30000); // Slow poll otherwise
    }
  }, [hasPending]);

  const [selectedConversion, setSelectedConversion] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewAiData = (conv: any) => {
    if (!conv.aiMetadata) return;
    setSelectedConversion(conv);
    setIsModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="h-40 flex items-center justify-center border border-dashed border-white/10 rounded-2xl">
        <Loader2 className="h-5 w-5 animate-spin text-slate-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-500/10 bg-red-500/5 p-6 text-center">
        <AlertCircle className="h-6 w-6 text-red-500 mx-auto mb-2" />
        <p className="text-slate-400 text-xs">
          Failed to load recent activity.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="text-blue-400 text-[10px] mt-2 font-bold hover:underline"
        >
          Retry
        </button>
      </div>
    );
  }

  if (conversions.length === 0) {
    return (
      <div className="rounded-2xl border border-white/5 bg-slate-900/50 backdrop-blur-sm p-6 text-center min-h-[300px] flex flex-col items-center justify-center">
        <div className="h-16 w-16 bg-white/5 rounded-full flex items-center justify-center mb-4 text-slate-600">
          <Activity className="h-8 w-8" />
        </div>
        <p className="text-slate-500 text-sm max-w-[200px] mx-auto leading-relaxed">
          No conversion attempts recorded in this billing cycle.
        </p>
      </div>
    );
  }

  return (
    <div
      data-lenis-prevent
      className="space-y-3 max-h-72 overflow-y-auto scrollbar-hide"
    >
      {conversions.map((conv: any) => (
        <div
          key={conv.id}
          onClick={() => handleViewAiData(conv)}
          className={cn(
            "p-4 rounded-xl bg-black/20 border border-white/5 flex items-center justify-between group transition-all duration-300 active:scale-[0.98] select-none",
            conv.aiMetadata
              ? "cursor-pointer hover:bg-white/5 hover:border-blue-500/30 hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)]"
              : "cursor-default",
          )}
        >
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-bold text-white truncate max-w-[150px]">
              {conv.isGhostMode
                ? "Ghost Mode (Private)"
                : conv.url && conv.url.startsWith("http")
                  ? new URL(conv.url).hostname
                  : "HTML Payload"}
            </span>
            <span className="text-[10px] text-slate-500">
              {new Date(conv.createdAt).toLocaleString()}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {conv.status === "PENDING" ? (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-yellow-500/10 text-yellow-500 border border-yellow-500/20">
                Pending
              </span>
            ) : conv.status === "EXPIRED" ? (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-500/10 text-orange-500 border border-orange-500/20">
                Expired
              </span>
            ) : conv.status === "FAILED" || !conv.success ? (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-500/10 text-red-500">
                Failed
              </span>
            ) : (
              <div className="flex items-center gap-2">
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                    conv.isTestMode
                      ? "bg-orange-500/10 text-orange-500 border-orange-500/20"
                      : "bg-blue-500/10 text-blue-500 border-blue-500/20"
                  }`}
                >
                  {conv.isTestMode ? "TEST" : "LIVE"}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Ready
                </span>
                {conv.isGhostMode && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20">
                    Ghost
                  </span>
                )}
              </div>
            )}

            {conv.success && conv.status !== "EXPIRED" && (
              <div className="flex items-center gap-1">
                {conv.aiMetadata && (
                  <button
                    onClick={() => handleViewAiData(conv)}
                    title="View AI Insights"
                    className="p-1.5 hover:bg-blue-500/10 rounded-md transition text-blue-400 hover:text-blue-200 cursor-pointer"
                  >
                    <Brain className="h-3.5 w-3.5" />
                  </button>
                )}
                <Link
                  href={conv.url}
                  target="_blank"
                  download
                  title="Download PDF"
                  className="p-1.5 hover:bg-white/10 rounded-md transition text-slate-400 hover:text-white cursor-pointer"
                >
                  <Download className="h-3.5 w-3.5" />
                </Link>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(conv.url);
                    toast.success("URL copied to clipboard");
                  }}
                  title="Copy URL"
                  className="p-1.5 hover:bg-white/10 rounded-md transition text-slate-400 hover:text-white cursor-pointer"
                >
                  <Copy className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      ))}
      <AnimatePresence>
        {isModalOpen && selectedConversion && (
          <Dialog.Root open={isModalOpen} onOpenChange={setIsModalOpen}>
            <Dialog.Portal forceMount>
              <Dialog.Overlay asChild>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                />
              </Dialog.Overlay>
              <Dialog.Content aria-describedby={"AI Metadata"} asChild>
                <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50">
                  <motion.div
                    initial={{ scale: 0.95, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 20 }}
                    className="w-full max-w-3xl bg-slate-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden pointer-events-auto"
                  >
                    <div className="p-6 border-b border-white/5 flex items-center justify-between bg-black/20">
                      <Dialog.Title>
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 bg-blue-500/10 rounded-lg flex items-center justify-center text-blue-400 border border-blue-500/20">
                            <Brain className="h-4 w-4" />
                          </div>
                          <div>
                            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                              AI Extraction Insights
                            </h2>
                            <p className="text-[10px] text-slate-500">
                              Extracted via Gemini 1.5 Flash (BETA)
                            </p>
                          </div>
                        </div>
                      </Dialog.Title>
                      <Dialog.Close asChild>
                        <button className="p-2 hover:bg-white/5 rounded-full transition-colors text-slate-400 hover:text-white cursor-pointer">
                          <X className="h-4 w-4" />
                        </button>
                      </Dialog.Close>
                    </div>

                    <div
                      className="p-1 bg-black/40 max-h-[400px] overflow-y-auto custom-scrollbar font-mono"
                      data-lenis-prevent
                    >
                      <Highlight
                        theme={themes.vsDark}
                        code={JSON.stringify(
                          selectedConversion.aiMetadata,
                          null,
                          2,
                        )}
                        language="json"
                      >
                        {({
                          className,
                          style,
                          tokens,
                          getLineProps,
                          getTokenProps,
                        }) => (
                          <pre
                            className={cn(
                              className,
                              "p-6 m-0 bg-transparent whitespace-pre-wrap wrap-break-words",
                            )}
                            style={style}
                            data-lenis-prevent
                          >
                            {tokens.map((line, i) => {
                              const lineProps = getLineProps({ line, key: i });
                              return (
                                <div key={i} {...lineProps}>
                                  <span className="inline-block w-8 text-slate-600 select-none text-[10px]">
                                    {i + 1}
                                  </span>
                                  {line.map((token, key) => {
                                    const tokenProps = getTokenProps({ token });
                                    return <span key={key} {...tokenProps} />;
                                  })}
                                </div>
                              );
                            })}
                          </pre>
                        )}
                      </Highlight>
                    </div>

                    <div className="p-4 bg-slate-950/50 border-t border-white/5 flex justify-end">
                      <Dialog.Close asChild>
                        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition-all shadow-lg shadow-blue-500/20 cursor-pointer">
                          Done
                        </button>
                      </Dialog.Close>
                    </div>
                  </motion.div>
                </div>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        )}
      </AnimatePresence>
    </div>
  );
}
