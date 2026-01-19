"use client";

import { useState } from "react";
import { useRotateKey, useMe } from "@/modules/hooks/queries";
import { Button } from "@/modules/app/button";
import { GlowCard } from "@/modules/app/glow-card";
import {
  Key,
  RefreshCw,
  Copy,
  Check,
  AlertTriangle,
  ShieldCheck,
  Zap,
  ArrowLeft,
} from "lucide-react";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";

export function ApiKeysPage() {
  const { user } = useUser();
  const rotateMutation = useRotateKey();
  const [newKey, setNewKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleRotate = async () => {
    try {
      const response: any = await rotateMutation.mutateAsync();
      setNewKey(response.apiKey);
      setShowConfirm(false);
    } catch (error) {
      console.error("Rotation failed:", error);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const { data: userData } = useMe();
  const keyHint = userData?.id
    ? `${btoa(userData.id)}.••••••••`
    : "sk_loading_••••••••";

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard"
          className="p-2 hover:bg-white/5 rounded-full transition text-slate-500 hover:text-white"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Key className="h-8 w-8 text-emerald-500" />
            API Key Management
          </h1>
          <p className="mt-1 text-slate-400 text-sm">
            Your secret keys grant access to the PDFBridge API. Keep them secure
            and never share them.
          </p>
        </div>
      </div>

      {!newKey ? (
        <GlowCard
          title="Secret Key"
          sub="Production Environment"
          content={
            <div className="mt-6 space-y-6">
              <div className="flex flex-col gap-4">
                <div className="p-4 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between group/key">
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-1">
                      Current Active Key
                    </span>
                    <code className="text-sm font-mono text-slate-400">
                      {keyHint}
                    </code>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setShowConfirm(true)}
                      className="text-xs h-9 border-red-500/20 text-red-400 hover:bg-red-500/10 hover:border-red-500/40"
                    >
                      <RefreshCw className="h-3.5 w-3.5 mr-2" />
                      Rotate Key
                    </Button>
                  </div>
                </div>

                <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 flex gap-4">
                  <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                  <div className="text-xs text-amber-500/80 leading-relaxed">
                    <p className="font-bold text-amber-500 mb-1">
                      Security Warning
                    </p>
                    Rotating your secret key will immediately invalidate your
                    old key. All applications using the old key will start
                    failing. Use with caution.
                  </div>
                </div>
              </div>
            </div>
          }
        />
      ) : (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl border-2 border-emerald-500/30 bg-emerald-500/5 backdrop-blur-md relative overflow-hidden group shadow-[0_0_30px_rgba(16,185,129,0.1)]">
            <div className="absolute top-0 right-0 p-3">
              <ShieldCheck className="h-12 w-12 text-emerald-500/20" />
            </div>

            <h3 className="text-lg font-bold text-emerald-400 mb-2 flex items-center gap-2">
              <Check className="h-5 w-5" />
              Key Successfully Rotated
            </h3>
            <p className="text-sm text-slate-400 mb-6 font-medium">
              Copy your new secret key now. This is the only time you will see
              it in cleartext.
            </p>

            <div className="flex flex-col gap-4">
              <div className="p-4 rounded-xl bg-black/60 border border-emerald-500/20 flex items-center justify-between group/key shadow-2xl shadow-emerald-500/10">
                <code className="text-sm font-mono text-emerald-400 break-all pr-4 select-all">
                  {newKey}
                </code>
                <Button
                  onClick={() => copyToClipboard(newKey)}
                  className="shrink-0 bg-emerald-600 hover:bg-emerald-500 h-10 w-10 p-0 shadow-lg shadow-emerald-600/20"
                >
                  {copied ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <Copy className="h-5 w-5" />
                  )}
                </Button>
              </div>

              <Button
                variant="outline"
                onClick={() => setNewKey(null)}
                className="w-full h-11 border-white/5 hover:bg-white/5 transition-all"
              >
                I have saved this key safely
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* API Key Best Practices */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl border border-white/5 bg-slate-900/40 space-y-4 hover:border-blue-500/20 transition-colors">
          <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
            <Zap className="h-5 w-5 text-blue-500" />
          </div>
          <h4 className="font-bold text-white">Environment Variables</h4>
          <p className="text-sm text-slate-400 leading-relaxed">
            Always store your API keys in environment variables. Never hardcode
            them directly into your source code or commit them to version
            control.
          </p>
        </div>
        <div className="p-6 rounded-2xl border border-white/5 bg-slate-900/40 space-y-4 hover:border-emerald-500/20 transition-colors">
          <div className="h-10 w-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
            <ShieldCheck className="h-5 w-5 text-emerald-500" />
          </div>
          <h4 className="font-bold text-white">Key Rotation</h4>
          <p className="text-sm text-slate-400 leading-relaxed">
            We recommend rotating your keys every 90 days or immediately if you
            suspect a compromise. Our rotation is instantaneous.
          </p>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-slate-950 p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <h3 className="text-xl font-bold text-white mb-2">
              Rotate API Key?
            </h3>
            <p className="text-sm text-slate-400 mb-6 leading-relaxed">
              This will permanently invalidate your current key. Any active
              services using it will lose access immediately.
            </p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowConfirm(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleRotate}
                disabled={rotateMutation.isPending}
                className="flex-1 bg-red-600 hover:bg-red-500 shadow-lg shadow-red-600/20 border-red-600"
              >
                {rotateMutation.isPending ? "Rotating..." : "Yes, Rotate"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
