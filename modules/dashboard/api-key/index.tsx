"use client";

import { useState } from "react";
import {
  useCreateKey,
  useDeleteKey,
  useMe,
  useApiKeys,
} from "@/modules/hooks/queries";
import { Button } from "@/modules/app/button";
import { GlowCard } from "@/modules/app/glow-card";
import {
  Key,
  Plus,
  Trash2,
  Copy,
  Check,
  AlertTriangle,
  ShieldCheck,
  Info,
  Clock,
} from "lucide-react";
import Title from "@/modules/app/title";
import { toast } from "sonner";
import { ConfirmActionDialog } from "@/modules/app/confirm-action-dialog";

export function ApiKeysPage() {
  const { data: userData } = useMe();
  const { data: apiKeysData } = useApiKeys();
  const createMutation = useCreateKey();
  const deleteMutation = useDeleteKey();
  const [newKeyData, setNewKeyData] = useState<{
    key: string;
    type: string;
    name: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);
  const [isCreating, setIsCreating] = useState<"live" | "test" | null>(null);
  const [keyName, setKeyName] = useState("");
  const [deletingKey, setDeletingKey] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const handleCreate = async () => {
    if (!isCreating || !keyName) return;
    const tId = toast.loading(`Generating ${isCreating} key...`);
    try {
      const response: any = await createMutation.mutateAsync({
        name: keyName,
        type: isCreating,
      });

      setNewKeyData({
        key: response.apiKey,
        type: response.type,
        name: response.name,
      });
      setIsCreating(null);
      setKeyName("");
      toast.success("Key created successfully", { id: tId });
    } catch (error: any) {
      toast.error("Creation failed", {
        id: tId,
        description: error.response?.data?.error || error.message,
      });
    }
  };

  const handleDeleteClick = (key: any) => {
    setDeletingKey({ id: key.id, name: key.name });
  };

  const confirmDelete = async () => {
    if (!deletingKey) return;
    const tId = toast.loading("Revoking key...");
    try {
      await deleteMutation.mutateAsync(deletingKey.id);
      toast.success("Key revoked", { id: tId });
      setDeletingKey(null);
    } catch (error: any) {
      toast.error("Revocation failed", { id: tId });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const liveKeys = apiKeysData?.filter((k: any) => k.type === "live") || [];
  const testKeys = apiKeysData?.filter((k: any) => k.type === "test") || [];

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <Title
          title="API Keys"
          description="Manage your secret keys to access the PDFBridge API."
          icon={<Key className="h-8 w-8 text-emerald-500" />}
        />
      </div>

      {newKeyData ? (
        <div className="p-6 rounded-2xl border-2 border-emerald-500/30 bg-emerald-500/5 backdrop-blur-md relative overflow-hidden shadow-2xl animate-in zoom-in-95">
          <div className="absolute top-0 right-0 p-3">
            <ShieldCheck className="h-12 w-12 text-emerald-500/20" />
          </div>
          <h3 className="text-lg font-bold text-emerald-400 mb-2">
            New Key Created: {newKeyData.name}
          </h3>
          <p className="text-sm text-slate-400 mb-6 font-medium">
            Copy this key now. For security, we cannot show it to you again.
          </p>

          <div className="flex flex-col gap-4">
            <div className="p-4 rounded-xl bg-black/60 border border-emerald-500/20 flex items-center justify-between group/key shadow-2xl">
              <code className="text-sm font-mono text-emerald-400 break-all pr-4 select-all">
                {newKeyData.key}
              </code>
              <Button
                onClick={() => copyToClipboard(newKeyData.key)}
                className="shrink-0 bg-emerald-600 hover:bg-emerald-500 h-10 w-10 min-w-10 p-0 shadow-lg"
              >
                {copied ? <Check /> : <Copy />}
              </Button>
            </div>
            <Button
              variant="outline"
              onClick={() => setNewKeyData(null)}
              className="w-full h-11 border-white/5 text-white hover:bg-white/5"
            >
              I have saved this key safely
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-8">
          {/* Live Keys Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live Keys
              </h3>
              <Button
                onClick={() => setIsCreating("live")}
                variant="outline"
                className="h-8 text-xs border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/10"
              >
                <Plus className="h-3 w-3 mr-1" /> Create Live Key
              </Button>
            </div>

            {liveKeys.length === 0 ? (
              <div className="p-8 rounded-xl border border-dashed border-white/5 text-center space-y-2 bg-slate-900/20">
                <p className="text-sm text-slate-500">No live keys yet</p>
              </div>
            ) : (
              liveKeys.map((key: any) => (
                <div
                  key={key.id}
                  className="p-4 rounded-xl bg-slate-900/40 border border-white/5 group hover:border-emerald-500/20 transition-all"
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-sm font-bold text-white mb-1 block">
                      {key.name}
                    </span>
                    <Button
                      variant="outline"
                      onClick={() => handleDeleteClick(key)}
                      className="h-8 w-8 p-0 text-slate-600 hover:text-red-400 hover:bg-red-500/10 border-none"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-500">
                    <span>{key.hint}</span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {new Date(key.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Test Keys Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-orange-500 animate-pulse" />
                Test Keys
              </h3>
              <Button
                onClick={() => setIsCreating("test")}
                variant="outline"
                className="h-8 text-xs border-orange-500/20 text-orange-400 hover:bg-orange-500/10"
              >
                <Plus className="h-3 w-3 mr-1" /> Create Test Key
              </Button>
            </div>

            {testKeys.length === 0 ? (
              <div className="p-8 rounded-xl border border-dashed border-white/5 text-center space-y-2 bg-slate-900/20">
                <p className="text-sm text-slate-500">No test keys yet</p>
              </div>
            ) : (
              testKeys.map((key: any) => (
                <div
                  key={key.id}
                  className="p-4 rounded-xl bg-slate-900/40 border border-white/5 group hover:border-orange-500/20 transition-all"
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-sm font-bold text-white mb-1 block">
                      {key.name}
                    </span>
                    <Button
                      variant="outline"
                      onClick={() => handleDeleteClick(key)}
                      className="h-8 w-8 p-0 text-slate-600 hover:text-red-400 hover:bg-red-500/10 border-none"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-500">
                    <span>{key.hint}</span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {new Date(key.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Security Tip */}
      <div className="p-6 rounded-2xl border border-blue-500/20 bg-blue-500/5 flex items-start gap-4">
        <Info className="h-6 w-6 text-blue-500 shrink-0" />
        <div className="space-y-1">
          <h4 className="font-bold text-white text-sm">
            Security Best Practices
          </h4>
          <p className="text-xs text-blue-400/80 leading-relaxed">
            API keys provide full access to your organization&apos;s data. Never
            commit them to GitHub or expose them in client-side code. If you
            suspect a key is compromised, revoke it and create a new one
            immediately.
          </p>
        </div>
      </div>

      {/* Creation Modal */}
      {isCreating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-slate-950 p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <h3 className="text-xl font-bold text-white mb-2">
              New {isCreating === "live" ? "Live" : "Test"} Key
            </h3>
            <p className="text-sm text-slate-400 mb-6">
              Give your key a name to help you identify it later.
            </p>

            <input
              type="text"
              placeholder="e.g. My Website"
              value={keyName}
              onChange={(e) => setKeyName(e.target.value)}
              className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500/50 mb-6"
              autoFocus
            />

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setIsCreating(null);
                  setKeyName("");
                }}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreate}
                disabled={!keyName || createMutation.isPending}
                className={`flex-1 ${isCreating === "live" ? "bg-emerald-600" : "bg-orange-600"} shadow-lg`}
              >
                {createMutation.isPending ? "Generating..." : "Generate Key"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Dialog */}
      <ConfirmActionDialog
        isOpen={!!deletingKey}
        onOpenChange={(isOpen) => !isOpen && setDeletingKey(null)}
        onConfirm={confirmDelete}
        title="Revoke API Key"
        description={`Any applications actively using the ${deletingKey?.name} key will immediately stop working.`}
        expectedText={`DELETE ${deletingKey?.name}`}
        confirmButtonText="Revoke Key"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
