"use client";

import { CheckCircle2, ChevronRight, Key, Terminal, Users } from "lucide-react";
import Link from "next/link";
import { Button } from "../../app/button";
import { useClipboard } from "../../hooks/use-copy-to-clipboard";
import { cn } from "@/utils";
import { toast } from "sonner";
import { useState } from "react";

interface QuickStartPipelineProps {
  testKeyFull: string;
  hasKeys?: boolean;
}

export function QuickStartPipeline({
  testKeyFull,
  hasKeys = false,
}: QuickStartPipelineProps) {
  const clipboard = useClipboard();
  const [keyCopied, setKeyCopied] = useState(false);

  const sessionKey = typeof window !== 'undefined' ? sessionStorage.getItem("last_secret") : null;
  const activeKey = sessionKey || testKeyFull;

  const handleCopyKey = () => {
    if (!sessionKey && hasKeys) {
        toast.info("Key already created and hidden. Manage or roll keys in settings.");
        return;
    }
    clipboard.copy(activeKey, "API Key copied to clipboard.");
    setKeyCopied(true);
    toast.success("Key copied! You're ready to make your first request.");
  };

  const steps = [
    {
      id: "copy-key",
      icon: <Key className="h-5 w-5" />,
      title: !hasKeys 
        ? "Generate your API Key" 
        : sessionKey 
          ? "Copy your new API Key" 
          : "API Key Active",
      description: !hasKeys
        ? "Create your first set of keys to start building today."
        : sessionKey
          ? "You'll need this to authenticate your first request. Copy it now."
          : "You have active keys. Check the Playground or manage them in Settings.",
      isComplete: hasKeys,
      action: !hasKeys ? (
        <Link href="/dashboard/api-keys">
          <Button
            variant="primary"
            className="text-xs h-8 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
          >
            Generate Key
          </Button>
        </Link>
      ) : sessionKey ? (
        <Button
          onClick={handleCopyKey}
          variant={keyCopied ? "outline" : "primary"}
          className={cn(
            "text-xs h-8 px-4",
            !keyCopied && "bg-blue-600 hover:bg-blue-500 text-white font-bold",
          )}
        >
          {keyCopied ? "Copied!" : "Copy New Key"}
        </Button>
      ) : (
        <Link href="/dashboard/api-keys">
            <Button
              variant="outline"
              className="text-xs h-8 px-4 border-slate-700 hover:bg-white/5"
            >
              Manage Keys
            </Button>
        </Link>
      ),
    },
    {
      id: "test-api",
      icon: <Terminal className="h-5 w-5" />,
      title: "Run your first PDF conversion",
      description: "Use the interactive Playground below to test our rendering engine.",
      isComplete: false, // Could be bound to a global state later
      action: (
        <Button
          onClick={() => {
            const playgroundEl = document.getElementById("api-playground-section");
            if (playgroundEl) {
              playgroundEl.scrollIntoView({ behavior: "smooth" });
              // Small visual cue logic if desired
            } else {
                toast.info("Scroll down to the Interactive API Playground")
            }
          }}
          variant="outline"
          className="text-xs h-8 px-4 border-slate-700 hover:bg-white/5"
        >
          Go to Playground
        </Button>
      ),
    },
    {
      id: "invite-team",
      icon: <Users className="h-5 w-5" />,
      title: "Invite your team members",
      description: "Collaborate on templates and share workspace usage.",
      isComplete: false,
      action: (
        <Link href="/dashboard/team">
          <Button variant="outline" className="text-xs h-8 px-4 border-slate-700 hover:bg-white/5">
            Manage Team
          </Button>
        </Link>
      ),
    },
  ];

  return (
    <div className="w-full space-y-6">
      <div className="space-y-2">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <span className="bg-blue-600/20 text-blue-500 text-xs px-2 py-1 rounded-md uppercase tracking-widest">
            Step 1
          </span>
          Quick Start Guide
        </h2>
        <p className="text-sm text-slate-400">
          Welcome to PDFBridge! Complete these steps to get your integration running in under 5 minutes.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {steps.map((step, idx) => (
          <div
            key={step.id}
            className={cn(
              "relative flex flex-col p-5 rounded-2xl border transition-all duration-500",
              step.isComplete
                ? "bg-emerald-900/10 border-emerald-500/20"
                : "bg-slate-900/40 border-white/10 hover:border-white/20 hover:bg-slate-900/60",
              idx === 0 && !step.isComplete ? "ring-1 ring-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.1)]" : ""
            )}
          >
            {/* Completion Status Icon */}
            <div className="absolute top-4 right-4">
              {step.isComplete ? (
                <CheckCircle2 className="h-6 w-6 text-emerald-500 animate-in zoom-in duration-300" />
              ) : (
                <div className="h-6 w-6 rounded-full border-2 border-slate-700 flex items-center justify-center text-[10px] font-bold text-slate-500 bg-slate-900">
                  {idx + 1}
                </div>
              )}
            </div>

            <div
              className={cn(
                "p-2.5 w-fit rounded-lg mb-4",
                step.isComplete
                  ? "bg-emerald-500/10 text-emerald-500"
                  : idx === 0 && !step.isComplete 
                    ? "bg-blue-500/20 text-blue-400"
                    : "bg-slate-800 text-slate-400"
              )}
            >
              {step.icon}
            </div>

            <h3 className="text-base font-bold text-white mb-2 leading-tight">
              {step.title}
            </h3>
            <p className="text-xs text-slate-400 mb-6 flex-1 pr-4">
              {step.description}
            </p>

            <div className="mt-auto">
              {step.action}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
