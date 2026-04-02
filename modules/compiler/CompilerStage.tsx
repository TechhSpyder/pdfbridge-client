"use client";

import { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import {
  buildSolanaTransaction,
  simulateExecution,
  getSolscanLink,
  getLatestBlockhash,
  parseProtocolError,
} from "@/modules/lib/solana-interpreter";
import { toast } from "sonner";
import type {
  VerifiableExecutionPlan,
  Diagnostic,
  IntentStatus,
} from "./types";
import { useSearchParams, useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import {
  Terminal,
  Key,
  Loader2,
  Link as LinkIcon,
  Sparkles,
  Brain,
  Activity,
  Shield,
  AlertCircle,
} from "lucide-react";

// ─── Component ────────────────────────────────────────────────────────────────

export function CompilerStage() {
  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const documentId = searchParams.get("id");
  const isGuest = !session?.user;

  const [step, setStep] = useState<
    "idle" | "compiling" | "ready" | "executing" | "confirmed" | "refused"
  >("idle");
  const [compilingStep, setCompilingStep] = useState<number>(0);
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<VerifiableExecutionPlan | null>(null);
  const [txSignature, setTxSignature] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isLinesExpanded, setIsLinesExpanded] = useState(false);
  const [resolutionWallet, setResolutionWallet] = useState("");
  const [resolutionCurrency, setResolutionCurrency] = useState("");

  useEffect(() => {
    if (documentId && step === "idle") {
      autoLoadDocument(documentId);
    }
  }, [documentId]);

  async function autoLoadDocument(id: string) {
    setStep("compiling");
    setCompilingStep(0);

    const interval = setInterval(() => {
      setCompilingStep((prev) => (prev < 4 ? prev + 1 : prev));
    }, 1000);

    try {
      const apiBase = (
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:3003"
      ).replace(/\/$/, "");

      const intentRes = await fetch(`${apiBase}/api/v1/compiler/intent/${id}`, {
        headers: isGuest ? {
          "x-api-key": process.env.NEXT_PUBLIC_PUBLIC_DEMO_KEY || "proto_sandbox_key_v5"
        } : {},
        credentials: "include",
      });

      if (intentRes.ok) {
        const intentData = await intentRes.json();
        setResult(intentData);
        
        // Protocol Resilience: check if already settled in previous session
        if (intentData.context?.documentStatus === "SETTLED") {
          setStep("confirmed");
          clearInterval(interval);
          return;
        }

        if (intentData.context?.documentStatus === "SETTLING") {
          setStep("executing");
          toast.info("Resuming active settlement tracking...");
          // Trigger automatic reconciliation check
          await reconcileSettlement(id);
          clearInterval(interval);
          return;
        }

        setStep("ready");
        clearInterval(interval);

        // Protocol Recovery: Hydrate resolutions from Ledger memory
        if (intentData.plan && intentData.plan.steps[0]) {
          const dest = intentData.plan.steps[0].destination;
          const token = intentData.plan.steps[0].token;
          if (dest && dest !== "UNKNOWN") setResolutionWallet(dest);
          if (token && token !== "UNKNOWN") setResolutionCurrency(token);
        }
        return;
      }

      // Fallback: Re-compile if intent lost but doc exists
      const res = await fetch(`${apiBase}/api/v1/compiler/compile-intent`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          ...(isGuest ? { "x-api-key": process.env.NEXT_PUBLIC_PUBLIC_DEMO_KEY || "proto_sandbox_key_v5" } : {})
        },
        body: JSON.stringify({ documentId: id }),
        credentials: "include",
      });

      const data = await res.json();
      clearInterval(interval);

      if (!res.ok || data.error) {
        setError(data.error || "COMPILATION_FAILED");
        setStep("refused");
        return;
      }

      setResult(data);
      setStep("ready");
    } catch (err: any) {
      clearInterval(interval);
      setError(err.message);
      setStep("refused");
    }
  }

  const onDrop = useCallback((accepted: File[]) => {
    if (accepted[0]) {
      setFile(accepted[0]);
      setStep("idle");
      setResult(null);
      setError(null);
      setResolutionWallet("");
      setResolutionCurrency("");
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "image/*": [".png", ".jpg", ".jpeg"],
    },
    maxFiles: 1,
  });

  async function runCompilation(resolutions?: {
    wallet?: string;
    currency?: string;
  }) {
    if (!file && !documentId) return;
    setError(null);
    setStep("compiling");
    setCompilingStep(0);

    const interval = setInterval(() => {
      setCompilingStep((prev) => (prev < 4 ? prev + 1 : prev));
    }, 800);

    try {
      const formData = new FormData();
      if (file) formData.append("file", file);
      if (documentId) formData.append("documentId", documentId);
      if (resolutions) {
        formData.append("resolutions", JSON.stringify(resolutions));
      }

      const apiBase = (
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:3003"
      ).replace(/\/$/, "");
      const res = await fetch(`${apiBase}/api/v1/compiler/compile-intent`, {
        method: "POST",
        headers: isGuest ? {
          "x-api-key": process.env.NEXT_PUBLIC_PUBLIC_DEMO_KEY || "proto_sandbox_key_v5"
        } : {},
        body: formData,
        credentials: "include",
      });

      const data = await res.json();
      clearInterval(interval);

      if (!res.ok || data.error) {
        setError(data.error || "COMPILATION_FAILED");
        setStep("refused");
        return;
      }

      setResult(data);
      setStep("ready");

      // Protocol Hard-Link: Attach Document ID to URI for cold-recovery
      const docId = data.intentId;
      if (typeof window !== "undefined" && docId && !searchParams.get("id")) {
        const newUrl = `${window.location.pathname}?id=${docId}`;
        window.history.replaceState(null, "", newUrl);
      }

      // Sync form state with synthesized plan
      if (data.plan && data.plan.steps[0]) {
        const dest = data.plan.steps[0].destination;
        const token = data.plan.steps[0].token;
        if (dest && dest !== "UNKNOWN") setResolutionWallet(dest);
        if (token && token !== "UNKNOWN") setResolutionCurrency(token);
      }
    } catch (err: any) {
      clearInterval(interval);
      setError(err.message);
      setStep("refused");
    }
  }

  async function handleVerifyRecipient() {
    if (!result) return;
    setIsVerifying(true);
    setError(null);

    const payload = {
      documentId: result.intentId,
      wallet: resolutionWallet,
      name: (result.context as any).vendorName || "Verified Vendor",
    };

    try {
      const apiBase = (
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:3003"
      ).replace(/\/$/, "");
      const res = await fetch(`${apiBase}/api/v1/compiler/verify-recipient`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include",
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "VERIFICATION_FAILED");
      }

      // Trigger re-compilation to update the intent with the newly trusted identity
      await runCompilation({
        wallet: resolutionWallet,
        currency: resolutionCurrency,
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsVerifying(false);
    }
  }

  async function reconcileSettlement(id: string) {
    try {
      const apiBase = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:3003").replace(/\/$/, "");
      const res = await fetch(`${apiBase}/api/v1/compiler/intent/${id}/reconcile`, {
        credentials: "include",
      });
      const data = await res.json();
      
      if (data.status === "SETTLED") {
        setTxSignature(data.signature || "Reconciled from Ledger");
        setStep("confirmed");
        toast.success("Settlement Verified on Ledger");
      } else if (data.status === "SETTLING") {
        toast.error("Settlement still pending on-chain. Verification required.");
        setStep("ready");
      } else {
        toast.error("No settled transaction found for this intent.");
        setStep("ready");
      }
    } catch (err: any) {
      toast.error(`Reconciliation failed: ${err.message}`);
      setStep("ready");
    }
  }

  async function executeTransaction(retryCount = 0) {
    console.log("[EXECUTION] Triggered", { result, publicKey: publicKey?.toBase58(), retryCount });
    if (!result || !publicKey) {
      toast.error("Identity signature required for execution.");
      return;
    }
    setError(null);
    setStep("executing");
    const toastId = toast.loading(retryCount > 0 ? `Retrying Settlement (Attempt ${retryCount+1})...` : "Broadcasting Intent to Ledger...");

    try {
      console.log("[EXECUTION] Fetching protocol blockhash...");
      const { blockhash, lastValidBlockHeight } = await getLatestBlockhash(connection);
      const hashFetchTime = Date.now();

      console.log("[EXECUTION] Building transaction...");
      const tx = await buildSolanaTransaction(result, publicKey, connection);
      if (!tx) throw new Error("TRANSACTION_BUILD_FAILED");

      tx.recentBlockhash = blockhash;
      tx.feePayer = publicKey;

      console.log("[EXECUTION] Simulating...");
      const sim = await simulateExecution(connection, tx, publicKey);
      if (!sim.success) {
        throw new Error(`SIMULATION_FAILED: ${sim.message}`);
      }

      // TTL Pre-flight check:
      // If the user has been idle or simulation took too long, and we are close to 50s,
      // we might want to refresh. But usually, we just fetched it above.

      console.log("[EXECUTION] Requesting signature...");
      const signature = await sendTransaction(tx, connection);
      
      // Post-Signature TTL Guard:
      // If the time from hash fetch to signature completion > 50s, the hash is likely expired.
      const elapsed = (Date.now() - hashFetchTime) / 1000;
      if (elapsed > 50) {
        console.warn(`[EXECUTION] Signature took ${elapsed}s. Blockhash likely expired. Pre-empting broadcast failure.`);
        throw new Error("Protocol Expired (Signature took too long. Refreshing blockhash...)");
      }

      // Gate 4: Record Broadcast in Backend
      try {
        const apiBase = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:3003").replace(/\/$/, "");
        await fetch(`${apiBase}/api/v1/compiler/intent/${result.intentId}/broadcast`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ signature }),
          credentials: "include",
        });
      } catch (broadcastErr) {
        console.warn("[RECONCILIATION] Failed to record broadcast attempt.", broadcastErr);
      }

      toast.loading("Synchronizing with Ledger...", { id: toastId });
      
      await connection.confirmTransaction({
        signature,
        blockhash,
        lastValidBlockHeight
      }, "confirmed");

      setTxSignature(signature);
      setStep("confirmed");
      toast.success("Intent Successfully Settled on Solana", { id: toastId });
    } catch (err: any) {
      console.error("[EXECUTION ERROR]", err);
      const friendlyError = parseProtocolError(err);

      // INSTITUTIONAL 2-STAGE BACKOFF (Congestion Trap Recovery)
      const isExpired = friendlyError.includes("Retrying with fresh blockhash") || friendlyError.includes("Protocol Expired");
      if (isExpired && retryCount < 2) {
        const nextAttempt = retryCount + 1;
        console.warn(`[EXECUTION] Congestion detected. Initiating stage ${nextAttempt} recovery...`);
        toast.loading(`Network Congested: Refreshing Protocol State (Attempt ${nextAttempt}/2)...`, { id: toastId });
        
        // Exponential backoff delay
        await new Promise((resolve) => setTimeout(resolve, 1500 * nextAttempt));
        return executeTransaction(nextAttempt);
      }

      setError(friendlyError);
      setStep("ready");
      toast.error(friendlyError, { id: toastId });
    }
  }

  const compilingSteps = [
    {
      id: "ast",
      icon: <Brain className="h-5 w-5" />,
      label: "Synthesizing Invoice AST...",
    },
    {
      id: "gates",
      icon: <Activity className="h-5 w-5" />,
      label: "Executing Convergence Gates...",
    },
    {
      id: "invariants",
      icon: <Shield className="h-5 w-5" />,
      label: "Verifying Identity & Math Invariants...",
    },
    {
      id: "ruleset",
      icon: <Terminal className="h-5 w-5" />,
      label: "Confirming Ruleset Alignment (v5.Elite)...",
    },
    {
      id: "proof",
      icon: <Key className="h-5 w-5" />,
      label: "Generating Deterministic Proof Hash...",
    },
  ];

  const status = result?.context.status;
  const iterationCount = result?.iterationCount || 1;

  return (
    <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-start pt-16 px-4 pb-16 font-sans text-slate-200">
      <div className="mb-12 text-center">
        <div className="inline-flex items-center gap-2 bg-[#0f172a] border border-[#1e293b] px-3 py-1.5 rounded-full text-xs text-[#64748b] mb-4 font-mono shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Protocol-Grade Intent Compiler · v5.Elite
        </div>
        <h1 className="text-4xl font-bold text-slate-50 tracking-tight mb-2">
          Institutional Invoice Compiler V2
        </h1>
        <p className="text-[#64748b] text-sm max-w-md mx-auto">
          Transform unstructured invoices into deterministic settlement intents. 
          Verification as a standard.
        </p>
      </div>

      <div className="w-full max-w-2xl space-y-6">
        <div className="grid lg:grid-cols-2 gap-6 items-start">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300 ${
              isDragActive
                ? "border-violet-500 bg-violet-500/5"
                : file
                  ? "border-[#1e293b] bg-[#0f172a]/50"
                  : "border-[#1e293b] bg-[#0a0f1e] hover:border-slate-700"
            } ${step === "compiling" ? "opacity-50 pointer-events-none" : ""}`}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 bg-violet-500/10 rounded-xl flex items-center justify-center text-violet-400">
                <Sparkles className="h-6 w-6" />
              </div>
              {file ? (
                <div className="space-y-1">
                  <p className="text-slate-100 font-mono text-sm font-medium truncate max-w-[180px]">
                    {file.name}
                  </p>
                  <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest">
                    Invoice Ready
                  </p>
                </div>
              ) : (
                <div className="space-y-1">
                  <p className="text-slate-200 font-medium text-sm">
                    Drop Invoice
                  </p>
                  <p className="text-slate-600 text-[10px]">
                    PDF / Image up to 10MB
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="p-6 bg-[#0f172a]/50 border border-[#1e293b] rounded-2xl space-y-4">
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-sky-400" />
              <span className="text-sm text-slate-200 font-bold uppercase tracking-tight">
                Identity Guard
              </span>
            </div>
            <WalletMultiButton className="bg-violet-600! hover:bg-violet-500! h-11! rounded-xl! w-full! transition-all! font-black! text-[10px]! uppercase! tracking-widest" />
            {!publicKey && (
              <p className="text-[9px] text-amber-400/70 leading-tight">
                Identity signature required for deterministic hashing.
              </p>
            )}
          </div>
        </div>

        <button
          onClick={() => runCompilation()}
          disabled={
            (!file && !documentId) || step === "compiling" || !publicKey
          }
          className="w-full h-14 rounded-2xl bg-violet-600 hover:bg-violet-500 text-white font-black uppercase text-sm tracking-wide transition-all active:scale-[0.98] disabled:opacity-30 shadow-xl"
        >
          {step === "compiling" ? "Synthesizing..." : "Compile Intent →"}
        </button>

        {step === "compiling" && (
          <div className="bg-[#0f172a]/80 border border-violet-500/20 rounded-2xl p-6 space-y-4 font-mono text-sm backdrop-blur-md">
            {compilingSteps.map((s, i) => {
              const isDone = i < compilingStep;
              const isCurrent = i === compilingStep;
              return (
                <div key={s.id} className="flex items-center gap-4">
                  <span className="w-5">
                    {isDone ? (
                      <span className="text-emerald-400 font-bold">✓</span>
                    ) : isCurrent ? (
                      <Loader2 className="h-4 w-4 animate-spin text-sky-400" />
                    ) : (
                      <span className="text-slate-800">○</span>
                    )}
                  </span>
                  <div
                    className={`flex items-center gap-2 ${isDone ? "text-[#64748b]" : isCurrent ? "text-white" : "text-[#334155]"}`}
                  >
                    <span className={isCurrent ? "text-sky-400" : ""}>
                      {s.icon}
                    </span>
                    <span className="text-sm font-bold tracking-tight">
                      {s.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {result && step !== "compiling" && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">
                  Compiler Online: Ledger Verified
                </span>
              </div>
              <div className="text-[9px] text-slate-600 font-mono flex items-center gap-2">
                <LinkIcon className="h-3 w-3 text-slate-600" />
                Intent Iteration: #{iterationCount}
              </div>
            </div>

            <div className="bg-[#0f172a] border border-[#1e293b] rounded-2xl overflow-hidden shadow-2xl">
              <div
                className={`p-6 border-b border-[#1e293b] flex items-center justify-between ${
                  status === "DETERMINISTIC"
                    ? "bg-emerald-500/5"
                    : status === "ESCALATED"
                      ? "bg-amber-500/5"
                      : status === "INCOMPLETE"
                        ? "bg-sky-500/5"
                        : "bg-rose-500/5"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${
                      status === "DETERMINISTIC"
                        ? "bg-emerald-500/20 text-emerald-400"
                        : status === "ESCALATED"
                          ? "bg-amber-500/20 text-amber-400"
                          : status === "INCOMPLETE"
                            ? "bg-sky-500/20 text-sky-400"
                            : "bg-rose-500/20 text-rose-400"
                    }`}
                  >
                    {status === "DETERMINISTIC"
                      ? "✓"
                      : status === "ESCALATED"
                        ? "!"
                        : status === "INCOMPLETE"
                          ? "?"
                          : "✕"}
                  </div>
                  <div>
                    <h3
                      className={`font-mono font-black text-xs tracking-tighter uppercase ${
                        status === "DETERMINISTIC"
                          ? "text-emerald-400"
                          : status === "ESCALATED"
                            ? "text-amber-400"
                            : status === "INCOMPLETE"
                              ? "text-sky-400"
                              : "text-rose-400"
                      }`}
                    >
                      {status} SETTLEMENT{" "}
                      {status === "REFUSED" ? "BLOCKED" : "INTENT"}
                    </h3>
                    <p className="text-slate-500 text-[10px] mt-0.5">
                      Deterministic Protocol State
                    </p>
                  </div>
                </div>
                <div className="text-right font-mono">
                  <p className="text-slate-400 text-[9px] uppercase font-bold">
                    Proof
                  </p>
                  <p className="text-slate-600 text-[8px] break-all max-w-[80px] leading-none mt-1">
                    {result.proofHash.slice(0, 16)}...
                  </p>
                </div>
              </div>

              {status === "INCOMPLETE" && (
                <div className="p-6 space-y-6 border-b border-[#1e293b] bg-sky-500/5">
                  <div className="space-y-1">
                    <h4 className="text-sky-400 font-bold text-sm">
                      Action Required: Finalize Intent
                    </h4>
                    <p className="text-slate-500 text-[11px]">
                      The compiler requires manual selection for ambiguous data
                      points.
                    </p>
                  </div>
                  <div className="space-y-4">
                    {result.context.diagnostics.some(
                      (d) => d.code === "MISSING_RECIPIENT_WALLET",
                    ) && (
                      <div className="space-y-1.5">
                        <label className="text-[10px] text-slate-400 uppercase font-black">
                          Recipient Wallet
                        </label>
                        <input
                          type="text"
                          value={resolutionWallet}
                          onChange={(e) => setResolutionWallet(e.target.value)}
                          placeholder="Solana address..."
                          className="w-full bg-[#020617] border border-[#1e293b] rounded-xl px-4 py-3 text-sm text-slate-200 focus:border-sky-500 transition-colors font-mono"
                        />
                      </div>
                    )}
                    {result.context.diagnostics.some(
                      (d) => d.code === "AMBIGUOUS_CURRENCY",
                    ) && (
                      <div className="space-y-1.5">
                        <label className="text-[10px] text-slate-400 uppercase font-black">
                          Currency Mapping
                        </label>
                        <select
                          value={resolutionCurrency}
                          onChange={(e) =>
                            setResolutionCurrency(e.target.value)
                          }
                          className="w-full bg-[#020617] border border-[#1e293b] rounded-xl px-4 py-3 text-sm text-slate-200 focus:border-sky-500 transition-colors"
                        >
                          <option value="">Select Asset...</option>
                          <option value="USDC">USDC (Solana Bridge)</option>
                          <option value="SOL">Native SOL</option>
                        </select>
                      </div>
                    )}
                    <button
                      onClick={() =>
                        runCompilation({
                          wallet: resolutionWallet,
                          currency: resolutionCurrency,
                        })
                      }
                      disabled={
                        !resolutionCurrency ||
                        (result.context.diagnostics.some(
                          (d) => d.code === "MISSING_RECIPIENT_WALLET",
                        ) &&
                          !resolutionWallet)
                      }
                      className="w-full h-12 rounded-xl bg-sky-500 hover:bg-sky-400 text-black font-black uppercase text-xs transition-all disabled:opacity-50"
                    >
                      Set Resolutions & Re-Compile
                    </button>
                  </div>
                </div>
              )}

              {status !== "INCOMPLETE" && (
                <div className="p-6 space-y-4">
                  <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">
                    Verification Diagnostics
                  </p>
                  <div className="space-y-2">
                    {result.context.diagnostics.length > 0 ? (
                      result.context.diagnostics.map((d, i) => (
                        <div
                          key={i}
                          className="flex gap-3 p-3 rounded-xl border border-[#1e293b] bg-slate-900/50"
                        >
                          <span
                            className={`text-[9px] font-black px-1.5 py-0.5 rounded uppercase h-fit ${
                              d.severity === "CRITICAL"
                                ? "bg-rose-500/20 text-rose-400"
                                : "bg-amber-500/20 text-amber-400"
                            }`}
                          >
                            {d.code.slice(0, 12)}
                          </span>
                          <p className="text-[11px] text-slate-400 leading-tight">
                            {d.message}
                          </p>
                        </div>
                      ))
                    ) : (
                      <div className="p-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-[11px] text-slate-400">
                        All deterministic gates cleared. Math is perfect.
                        Recipient verified.
                      </div>
                    )}
                  </div>
                </div>
              )}

              {result.lineItems && result.lineItems.length > 0 && (
                <div className="border-y border-[#1e293b] bg-slate-900/20 overflow-hidden transition-all duration-300">
                  <button
                    onClick={() => setIsLinesExpanded(!isLinesExpanded)}
                    className="w-full px-6 py-4 flex items-center justify-between hover:bg-white/5 transition-colors group"
                  >
                    <div className="flex items-center gap-2">
                      <Terminal className="h-4 w-4 text-slate-500 group-hover:text-sky-400 transition-colors" />
                      <span className="text-[10px] text-slate-400 uppercase font-black tracking-widest">
                        Extracted Line Items ({result.lineItems.length})
                      </span>
                    </div>
                    <span className="text-slate-600 text-[10px] font-bold">
                      {isLinesExpanded ? "Collapse ▲" : "Review Line Items ▼"}
                    </span>
                  </button>

                  <div
                    className={`px-6 transition-all duration-300 ease-in-out ${
                      isLinesExpanded ? "max-h-[400px] pb-6" : "max-h-0"
                    } overflow-y-auto overflow-x-hidden`}
                  >
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-[#1e293b]">
                          <th className="py-2 text-[8px] text-slate-600 uppercase font-black">
                            Description
                          </th>
                          <th className="py-2 text-[8px] text-slate-600 uppercase font-black text-right">
                            Qty
                          </th>
                          <th className="py-2 text-[8px] text-slate-600 uppercase font-black text-right">
                            Unit
                          </th>
                          <th className="py-2 text-[8px] text-slate-600 uppercase font-black text-right">
                            Total
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#1e293b]/50">
                        {result.lineItems.map((item, idx) => (
                          <tr key={idx} className="group hover:bg-white/[0.02]">
                            <td className="py-2 pr-4 text-[10px] text-slate-400 font-medium truncate max-w-[200px]">
                              {item.description}
                            </td>
                            <td className="py-2 text-[10px] text-slate-500 font-mono text-right">
                              {Number(item.quantity).toString()}
                            </td>
                            <td className="py-2 text-[10px] text-slate-500 font-mono text-right">
                              {Number(item.unitPrice).toLocaleString()}
                            </td>
                            <td className="py-2 text-[10px] text-slate-200 font-mono font-bold text-right">
                              {Number(item.totalPrice).toLocaleString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              <div className="px-6 py-4 bg-slate-900/30 grid grid-cols-2 gap-8 border-b border-[#1e293b]">
                <div className="space-y-1">
                  <p className="text-[10px] text-slate-600 uppercase font-bold">
                    Destination
                  </p>
                  <p className="text-[11px] font-mono text-slate-300 truncate">
                    {result.plan.steps[0].destination || "UNRESOLVED"}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] text-slate-600 uppercase font-bold">
                    Instruction
                  </p>
                  <p className="text-[11px] text-slate-100 font-bold font-mono uppercase">
                    {result.plan.steps[0].amount} {result.plan.steps[0].token}
                  </p>
                </div>
              </div>

              <div className="p-6 bg-black/40 border-b border-[#1e293b] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">
                    Protocol Proof
                  </span>
                  <span className="text-[8px] text-sky-400 font-black px-1.5 py-0.5 rounded border border-sky-400/20 uppercase">
                    v5.Elite Infra
                  </span>
                </div>
                <div className="p-3 bg-white/5 rounded-xl border border-white/5 space-y-2">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[8px] text-slate-600 uppercase font-bold">
                      SHA-256 Intent Hash
                    </span>
                    <code className="text-[10px] text-slate-400 break-all leading-tight select-all">
                      {result.proofHash}
                    </code>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-slate-900/10">
                {status === "ESCALATED" && (
                  <button
                    onClick={handleVerifyRecipient}
                    disabled={isVerifying}
                    className="w-full h-14 rounded-2xl bg-amber-500 hover:bg-amber-400 text-black font-black uppercase text-sm shadow-xl transition-all"
                  >
                    {isVerifying
                      ? "Updating Ledger..."
                      : "Verify Recipient & Assert Trust"}
                  </button>
                )}
                {result.context.documentStatus === "SETTLING" && (
                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
                      <p className="text-amber-400 text-center font-mono text-[10px] uppercase font-bold leading-relaxed">
                        ⚠️ Ambiguous Settlement Detected<br />
                        An in-flight transaction was recorded for this intent.
                      </p>
                    </div>
                    <button
                      onClick={() => reconcileSettlement(result.intentId)}
                      className="w-full h-14 rounded-2xl bg-sky-500 hover:bg-sky-400 text-black font-black uppercase text-sm shadow-2xl transition-all"
                    >
                      Verify Ledger Finality
                    </button>
                    <button
                      onClick={() => {
                        // Force retry by allowing "Sign & Execute" again
                        // But we should ideally reset the status or allow it
                        executeTransaction();
                      }}
                      className="w-full py-2 text-[10px] text-slate-500 uppercase font-bold hover:text-slate-400 transition-colors"
                    >
                      Ignore & Process New Transaction
                    </button>
                  </div>
                )}
                {status === "DETERMINISTIC" && result.context.documentStatus !== "SETTLING" && step !== "confirmed" && (
                  <div className="relative z-9999 pointer-events-auto">
                    {isGuest ? (
                      <button
                        onClick={() => {
                          const callbackUrl = `${window.location.origin}/compiler?id=${result.intentId}`;
                          router.push(`/sign-in?callbackURL=${encodeURIComponent(callbackUrl)}`);
                        }}
                        className="w-full h-14 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase text-sm shadow-2xl transition-all cursor-pointer border border-emerald-500/50"
                      >
                        Sign in to Settle on Ledger →
                      </button>
                    ) : (
                      <button
                        id="EXECUTION_TRIGGER"
                        onClick={() => {
                          executeTransaction();
                        }}
                        disabled={step === "executing" || !publicKey}
                        className="w-full h-14 rounded-2xl bg-rose-500 hover:bg-rose-400 text-black font-black uppercase text-sm shadow-2xl transition-all cursor-pointer ring-4 ring-rose-500/50"
                      >
                        {step === "executing"
                          ? "Broadcasting..."
                          : "Finalize Settlement →"}
                      </button>
                    )}
                  </div>
                )}
                {status === "REFUSED" && (
                  <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-center font-mono text-[10px] uppercase font-bold">
                    Execution Blocked: Security Refusal
                  </div>
                )}
                {!publicKey && status === "DETERMINISTIC" && (
                  <p className="text-center text-slate-600 text-[10px] uppercase font-bold mt-4 tracking-widest">
                    Identity Required to Execute
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {step === "confirmed" && txSignature && (
          <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-8 text-center animate-in zoom-in-95 shadow-2xl">
            <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl text-emerald-400 font-bold">
              ✓
            </div>
            <h3 className="text-emerald-400 font-black uppercase text-xl mb-2">
              Intent Executed
            </h3>
            <p className="text-slate-500 text-[10px] font-mono break-all mb-8 opacity-60">
              {txSignature}
            </p>
            <a
              href={getSolscanLink(txSignature)}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 text-[10px] font-black uppercase transition-colors"
            >
              Verify Transaction →
            </a>
          </div>
        )}

        {error && step !== "refused" && step !== "confirmed" && (
          <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-3 text-center">
            <p className="text-rose-400 text-[10px] font-mono font-bold uppercase tracking-widest">
              {error}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
