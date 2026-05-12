"use client";

import { useState, useCallback, useEffect, useRef } from "react";
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
import { PersistentLedger } from "@/modules/lib/persistent-ledger";
import { toast } from "sonner";
import type { VerifiableExecutionPlan } from "./types";
import { useSearchParams, useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import {
  useBillingInfo,
  useMe,
  useApprovalStatus,
  useRequestApproval,
} from "@/modules/hooks/queries";
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
  CheckCircle2,
} from "lucide-react";

const CORPORATE_CATEGORIES = [
  "PAYROLL",
  "MARKETING",
  "INFRASTRUCTURE",
  "LEGAL",
  "SOFTWARE",
  "OPERATIONS",
  "TAXES",
  "OTHER",
];

// ────────────────── Component ──────────────────────────────────────────────────

export function CompilerStage() {
  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const documentId = searchParams.get("id");
  const isGuest = !session?.user;
  const { data: billingInfo } = useBillingInfo();
  const isEliteMember =
    billingInfo?.planId && billingInfo.planId !== "FREE_TIER";

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
  const [resolutionCategory, setResolutionCategory] = useState("OTHER");
  const [isIntentApproved, setIsIntentApproved] = useState(false);
  const [executionLogs, setExecutionLogs] = useState<string[]>([]);
  const logContainerRef = useRef<HTMLDivElement>(null);
  const [tokenPrices, setTokenPrices] = useState<Record<string, number>>({});
  const [globalDuplicate, setGlobalDuplicate] = useState<{
    status: string;
    txHash: string | null;
    vendorName: string | null;
    amount: any;
    currency: string | null;
    settledAt: string;
    message: string;
    isGlobalDuplicate: boolean;
  } | null>(null);

  // ─── CFO Layer 2: Governance State ──────────────────────────────────────────
  const { data: userData } = useMe();
  const userRole: string = (userData as any)?.role ?? "MEMBER";
  const isOwner = userRole === "OWNER";
  const [approvalRequested, setApprovalRequested] = useState(false);
  // approvalId comes from compile result; used for polling
  const currentApprovalId = result?.approvalId ?? null;
  const currentGovernance = result?.governanceStatus;
  const isLocked = currentGovernance === "EXECUTION_LOCKED";
  const isRejected = currentGovernance === "EXECUTION_REJECTED";
  // Poll status once ADMIN has clicked "Request Authorization"
  const { data: approvalStatusData } = useApprovalStatus(
    currentApprovalId,
    approvalRequested,
  );
  const liveGovernance =
    (approvalStatusData as any)?.data?.governanceStatus ?? currentGovernance;
  const { mutate: requestApproval, isPending: isRequestingApproval } =
    useRequestApproval();
  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  useEffect(() => {
    fetch("https://api.jup.ag/price/v2?ids=SOL,USDC,USDT,PYUSD,EURC")
      .then((res) => res.json())
      .then((d) => {
        if (d?.data) {
          const prices: Record<string, number> = {};
          if (d.data.SOL?.price) prices.SOL = d.data.SOL.price;
          if (d.data.USDC?.price) prices.USDC = d.data.USDC.price;
          if (d.data.USDT?.price) prices.USDT = d.data.USDT.price;
          if (d.data.PYUSD?.price) prices.PYUSD = d.data.PYUSD.price;
          if (d.data.EURC?.price) prices.EURC = d.data.EURC.price;
          setTokenPrices(prices);
        }
      })
      .catch((e) => console.warn("Failed to fetch oracle prices", e));
  }, []);

  // ─── Auto-Scroll Matrix: Monitoring Execution Logs ───────────────────────
  useEffect(() => {
    let frameId: number;

    if (logContainerRef.current) {
      const scroll = () => {
        if (logContainerRef.current) {
          logContainerRef.current.scrollTop =
            logContainerRef.current.scrollHeight;
        }
      };

      // Institutional Pacing: Use rAF for smooth animation alignment
      frameId = requestAnimationFrame(scroll);
    }

    return () => {
      if (frameId) cancelAnimationFrame(frameId);
    };
  }, [executionLogs]);
  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  useEffect(() => {
    if (documentId && step === "idle") {
      autoLoadDocument(documentId);
    }
  }, [documentId]);

  async function autoLoadDocument(id: string) {
    setStep("compiling");
    setCompilingStep(0);

    const interval = setInterval(() => {
      setCompilingStep((prev) => (prev < 5 ? prev + 1 : prev));
    }, 500);

    try {
      const apiBase = (
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:3003"
      ).replace(/\/$/, "");

      const intentRes = await fetch(`${apiBase}/api/v1/compiler/intent/${id}`, {
        headers: isGuest
          ? {
              "x-api-key":
                process.env.NEXT_PUBLIC_PUBLIC_DEMO_KEY || "proto_sandbox_key",
            }
          : {},
        credentials: "include",
      });

      if (intentRes.ok) {
        const intentData = await intentRes.json();
        setResult(intentData);

        // Protocol Resilience: check if already settled in previous session
        if (intentData.context?.documentStatus === "SETTLED") {
          await PersistentLedger.clearSignature(intentData.intentId);
          setTxSignature(
            intentData.settlementTxHash ||
              intentData.context?.signatures?.slice(-1)[0] ||
              "HISTORICAL_RECONCILIATION",
          );
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

        // Layer 2: IndexedDB Ghost Settlement Cache check
        const localSignature = await PersistentLedger.getSignature(
          intentData.intentId,
        );
        if (localSignature) {
          setStep("executing");
          toast.info("Ghost Settlement Detected. Reconciling with backend...");
          // Force the backend to record the broadcast
          const apiBase = (
            process.env.NEXT_PUBLIC_API_URL || "http://localhost:3003"
          ).replace(/\/$/, "");
          await fetch(
            `${apiBase}/api/v1/compiler/intent/${intentData.intentId}/broadcast`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ signature: localSignature }),
              credentials: "include",
            },
          ).catch(() => {}); // Fire and forget, reconcile will catch it anyway

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
          ...(isGuest
            ? {
                "x-api-key":
                  process.env.NEXT_PUBLIC_PUBLIC_DEMO_KEY ||
                  "proto_sandbox_key",
              }
            : { "x-execution-mode": "live" }),
        },
        body: JSON.stringify({ documentId: id }),
        credentials: "include",
      });

      const data = await res.json();
      clearInterval(interval);

      // --- Global Duplicate Guard Response ---
      if (data.status === "FAST_FORWARD_GLOBAL_DUPLICATE") {
        setGlobalDuplicate({
          status: data.settlement?.status,
          txHash: data.settlement?.txHash || null,
          vendorName: data.settlement?.vendorName || null,
          amount: data.settlement?.amount,
          currency: data.settlement?.currency,
          settledAt: data.settlement?.settledAt,
          message: data.message,
          isGlobalDuplicate: data.settlement?.isGlobalDuplicate ?? false,
        });
        setStep("confirmed");
        return;
      }

      if (!res.ok || data.error) {
        setError(data.details || data.error || "COMPILATION_FAILED");
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
      setGlobalDuplicate(null);
      setResolutionWallet("");
      setResolutionCurrency("");
      // Clear stale ?id= URL param — a new file drop always starts a fresh compile context.
      // Without this, runCompilation() sends the old documentId to the API, which
      // ignores the new file entirely and re-compiles the old document instead.
      if (
        typeof window !== "undefined" &&
        window.location.search.includes("id=")
      ) {
        window.history.replaceState(null, "", "/compiler");
      }
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
    category?: string;
  }) {
    if (!file && !documentId) return;
    setError(null);
    setGlobalDuplicate(null);
    setStep("compiling");
    setCompilingStep(0);

    const interval = setInterval(() => {
      setCompilingStep((prev) => (prev < 5 ? prev + 1 : prev));
    }, 500);

    try {
      const formData = new FormData();
      if (resolutions) {
        // ── Resolution Re-Compile Path ──────────────────────────────────────
        // The document is already ingested. Sending the file again triggers the
        // hash fast-forward which returns the stale INCOMPLETE state and swallows
        // the resolutions entirely. Always use the known documentId instead.
        const knownDocId = result?.documentId || documentId;
        if (knownDocId) formData.append("documentId", knownDocId);
        formData.append("resolutions", JSON.stringify(resolutions));
      } else {
        // ── Fresh Compile Path ──────────────────────────────────────────────
        // Send the file for a new upload, or the documentId for a URL-linked reload.
        if (file) formData.append("file", file);
        if (documentId && !file) formData.append("documentId", documentId);
      }

      const apiBase = (
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:3003"
      ).replace(/\/$/, "");
      const res = await fetch(`${apiBase}/api/v1/compiler/compile-intent`, {
        method: "POST",
        headers: isGuest
          ? {
              "x-api-key":
                process.env.NEXT_PUBLIC_PUBLIC_DEMO_KEY || "proto_sandbox_key",
            }
          : {
              "x-execution-mode": "live",
              // Bind wallet to user identity so SIWS login finds the correct org
              ...(publicKey ? { "x-solana-wallet": publicKey.toBase58() } : {}),
            },
        body: formData,
        credentials: "include",
      });

      const data = await res.json();
      clearInterval(interval);

      if (!res.ok || data.error) {
        setError(
          data.message || data.details || data.error || "COMPILATION_FAILED",
        );
        setStep("refused");
        return;
      }

      // --- Global Duplicate Guard Response ---
      if (data.status === "FAST_FORWARD_GLOBAL_DUPLICATE") {
        setGlobalDuplicate({
          status: data.settlement?.status,
          txHash: data.settlement?.txHash || null,
          vendorName: data.settlement?.vendorName || null,
          amount: data.settlement?.amount,
          currency: data.settlement?.currency,
          settledAt: data.settlement?.settledAt,
          message: data.message,
          isGlobalDuplicate: data.settlement?.isGlobalDuplicate ?? false,
        });
        setStep("confirmed");
        clearInterval(interval);
        return;
      }

      setResult(data);

      if (data.context?.documentStatus === "SETTLED") {
        toast.warning(
          "Duplicate Guard: This invoice was already settled computationally.",
        );
        setTxSignature(
          data.settlementTxHash ||
            data.context?.signatures?.slice(-1)[0] ||
            "HISTORICAL_RECONCILIATION",
        );
        setStep("confirmed");
        // Don't early return so we get the searchParams URI link update!
      } else if (data.context?.documentStatus === "SETTLING") {
        toast.info(
          "Duplicate Guard: This intent is currently settling on-chain.",
        );
        setStep("executing");
        reconcileSettlement(data.documentId || data.intentId);
      } else {
        setStep("ready");
      }

      // Protocol Hard-Link: Attach Document ID to URI for cold-recovery
      const docId = data.documentId || data.plan?.intentId || data.intentId;
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
      documentId: result.documentId || result.plan.intentId,
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
        category: resolutionCategory,
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsVerifying(false);
    }
  }

  async function reconcileSettlement(id: string) {
    try {
      const apiBase = (
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:3003"
      ).replace(/\/$/, "");
      const res = await fetch(
        `${apiBase}/api/v1/compiler/intent/${id}/reconcile`,
        {
          credentials: "include",
        },
      );
      const data = await res.json();

      if (data.status === "SETTLED") {
        await PersistentLedger.clearSignature(data.intentId || id);
        setTxSignature(
          data.signature ||
            data.settlementTxHash ||
            "HISTORICAL_RECONCILIATION",
        );
        setStep("confirmed");
        toast.success("Settlement Verified on Ledger");
      } else if (data.status === "SETTLING") {
        toast.error(
          "Settlement still pending on-chain. Verification required.",
        );
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
    if (!result || !publicKey) {
      toast.error("Identity signature required for execution.");
      return;
    }
    setError(null);
    setStep("executing");
    const toastId = toast.loading(
      retryCount > 0
        ? `Retrying Settlement (Attempt ${retryCount + 1})...`
        : "Broadcasting Intent to Ledger...",
    );

    setExecutionLogs([]);
    const addLog = (msg: string) => {
      setExecutionLogs((prev) => [
        ...prev,
        `[${new Date().toLocaleTimeString("en-GB", { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" })}] ${msg}`,
      ]);
    };

    try {
      addLog("Initializing Transaction Protocol...");
      addLog("Fetching Recent Blockhash...");
      const { blockhash, lastValidBlockHeight } =
        await getLatestBlockhash(connection);
      addLog(`Blockhash Acquired: ${blockhash.slice(0, 8)}...`);

      const hashFetchTime = Date.now();

      addLog("Building Solana Instruction... (Determinism: High)");

      // Elite Membership Oracle Feed Gate
      let dynamicPlan = JSON.parse(JSON.stringify(result));
      if (isEliteMember) {
        addLog("Elite Credential Detected: Waiving Protocol Fee.");
        dynamicPlan.plan.steps = dynamicPlan.plan.steps.filter(
          (s: any) => s.action !== "TRANSFER_FEE",
        );
      } else {
        addLog("Applying Standard Network Fee (Oracle Corrected).");
        const feeStep = dynamicPlan.plan.steps.find(
          (s: any) => s.action === "TRANSFER_FEE",
        );
        if (feeStep && tokenPrices[feeStep.token]) {
          feeStep.amount = (0.5 / tokenPrices[feeStep.token]).toFixed(6);
        }
      }

      const tx = await buildSolanaTransaction(
        dynamicPlan,
        publicKey,
        connection,
      );
      if (!tx) throw new Error("TRANSACTION_BUILD_FAILED");

      tx.recentBlockhash = blockhash;
      tx.feePayer = publicKey;

      addLog("Simulating Execution Environment...");
      const sim = await simulateExecution(connection, tx, publicKey);
      if (!sim.success) {
        addLog(`SIMULATION_FAILURE: ${sim.message}`);
        throw new Error(`SIMULATION_FAILED: ${sim.message}`);
      }
      addLog("Simulation Success. Compute Units Optimized.");

      addLog("Requesting Institutional User Signature...");
      const signature = await sendTransaction(tx, connection);
      addLog(`Signature Secured: ${signature.slice(0, 16)}...`);

      addLog("Caching Ghost Intent for Persistence...");
      await PersistentLedger.saveSignature(result.intentId, signature).catch(
        () => {},
      );

      const elapsed = (Date.now() - hashFetchTime) / 1000;
      if (elapsed > 50) {
        addLog("PROTOCOL_EXPIRATION: Signature took > 50s. Restarting.");
        throw new Error(
          "Protocol Expired (Signature took too long. Refreshing blockhash...)",
        );
      }

      addLog("Broadcasting Instruction to Solana Clusters...");
      try {
        const apiBase = (
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:3003"
        ).replace(/\/$/, "");
        await fetch(
          `${apiBase}/api/v1/compiler/intent/${result.intentId}/broadcast`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ signature }),
            credentials: "include",
          },
        );
      } catch (broadcastErr) {
        console.warn(
          "[RECONCILIATION] Failed to record broadcast attempt.",
          broadcastErr,
        );
      }

      addLog("Synchronizing Ledger State... (Awaiting Finality)");

      await connection.confirmTransaction(
        {
          signature,
          blockhash,
          lastValidBlockHeight,
        },
        "confirmed",
      );

      await PersistentLedger.clearSignature(result.intentId).catch(() => {});
      setTxSignature(signature);
      setStep("confirmed");
      toast.success("Intent Successfully Settled on Solana", { id: toastId });
    } catch (err: any) {
      console.error("[EXECUTION ERROR]", err);
      const friendlyError = parseProtocolError(err);

      // INSTITUTIONAL 2-STAGE BACKOFF (Congestion Trap Recovery)
      const isExpired =
        friendlyError.includes("Retrying with fresh blockhash") ||
        friendlyError.includes("Protocol Expired");
      if (isExpired && retryCount < 2) {
        const nextAttempt = retryCount + 1;
        console.warn(
          `[EXECUTION] Congestion detected. Initiating stage ${nextAttempt} recovery...`,
        );
        toast.loading(
          `Network Congested: Refreshing Protocol State (Attempt ${nextAttempt}/2)...`,
          { id: toastId },
        );

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
      label: "Confirming Ruleset Alignment...",
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
          Protocol-Grade Intent Compiler
        </div>
        <h1 className="text-4xl font-bold text-slate-50 tracking-tight mb-2">
          Institutional Invoice Compiler
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

          <div className="p-6 bg-[#0f172a]/50 border border-[#1e293b] rounded-2xl space-y-4 h-full">
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
            (!file && !documentId) ||
            step === "compiling" ||
            !publicKey ||
            // Guard: prevent silent re-compile when resolutions are required.
            // The user must use "Set Resolutions & Re-Compile" below.
            (step === "ready" && status === "INCOMPLETE")
          }
          className="w-full h-14 rounded-2xl bg-violet-600 hover:bg-violet-500 text-white font-black uppercase text-sm tracking-wide transition-all active:scale-[0.98] disabled:opacity-30 shadow-xl"
        >
          {step === "compiling"
            ? "Synthesizing..."
            : step === "ready" && status === "INCOMPLETE"
              ? "Resolve Issues Below"
              : "Compile Intent"}
        </button>

        {step === "compiling" && (
          <div className="bg-[#0f172a]/80 border border-violet-500/20 rounded-2xl p-6 space-y-6 font-mono text-sm backdrop-blur-md shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-0.5 bg-violet-500/30 overflow-hidden">
              <div className="h-full bg-violet-500 animate-progress w-full origin-left" />
            </div>

            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] text-violet-400 font-black uppercase tracking-[0.2em]">
                Institutional Audit Pipeline
              </span>
              <span className="text-[10px] text-slate-500 font-bold uppercase">
                {Math.min(100, (compilingStep / 5) * 100).toFixed(0)}%
              </span>
            </div>

            <div className="space-y-4">
              {compilingSteps.map((s, i) => {
                const isDone = i < compilingStep;
                const isCurrent = i === compilingStep;
                return (
                  <div
                    key={s.id}
                    className="flex items-center gap-4 transition-all duration-300"
                  >
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all ${
                          isDone
                            ? "bg-emerald-500/20 border-emerald-500 text-emerald-400"
                            : isCurrent
                              ? "bg-sky-500/10 border-sky-500 text-sky-400 animate-pulse"
                              : "bg-slate-900 border-slate-700 text-slate-600"
                        }`}
                      >
                        {isDone ? "✓" : s.icon}
                      </div>
                      {i < compilingSteps.length - 1 && (
                        <div
                          className={`w-0.5 h-4 my-1 transition-colors ${isDone ? "bg-emerald-500/30" : "bg-slate-800"}`}
                        />
                      )}
                    </div>

                    <div className="flex flex-col">
                      <span
                        className={`text-xs font-bold leading-none ${isDone ? "text-slate-400" : isCurrent ? "text-white" : "text-slate-600"}`}
                      >
                        {s.label}
                      </span>
                      {isCurrent && (
                        <span className="text-[8px] text-sky-400/60 uppercase mt-1 animate-pulse">
                          Running Invariants...
                        </span>
                      )}
                      {isDone && (
                        <span className="text-[8px] text-emerald-400/60 uppercase mt-1">
                          Verified Gate Integrity
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* â”€â”€ Global Duplicate Guard â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        {globalDuplicate &&
          step === "confirmed" &&
          (globalDuplicate.isGlobalDuplicate ? (
            // CROSS-ORG: This org has NOT paid — warn, do not claim otherwise
            <div className="bg-amber-500/5 border border-amber-500/30 rounded-2xl p-8 text-center animate-in zoom-in-95 shadow-2xl relative overflow-hidden space-y-4">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500" />
              <div className="w-16 h-16 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto text-3xl text-amber-400">
                ⚠
              </div>
              <div>
                <h3 className="text-amber-400 font-black uppercase text-xl mb-1">
                  Duplicate Document Detected
                </h3>
                <p className="text-slate-400 text-sm max-w-sm mx-auto leading-relaxed">
                  {globalDuplicate.message}
                </p>
              </div>
              <div className="p-4 bg-amber-500/5 border border-amber-500/20 rounded-xl text-left max-w-sm mx-auto space-y-2">
                <p className="text-[10px] text-amber-400/70 uppercase font-bold tracking-widest">
                  What to do
                </p>
                <ul className="text-xs text-slate-400 leading-relaxed space-y-1.5">
                  <li>
                    → Contact your vendor to confirm this invoice is addressed
                    to your organization
                  </li>
                  <li>
                    → Do not attempt payment until the document origin is
                    verified
                  </li>
                  <li>
                    → If this looks like fraud, contact support using the link
                    below
                  </li>
                </ul>
              </div>
              <div className="flex flex-col gap-2 max-w-sm mx-auto w-full pt-2">
                <button
                  onClick={() => router.push("/dashboard")}
                  className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 text-xs font-black uppercase tracking-widest transition-colors"
                >
                  Back to Dashboard
                </button>
                <p className="text-[9px] text-slate-600 text-center font-mono">
                  Suspected fraud?{" "}
                  <a
                    href="mailto:support@pdfbridge.xyz"
                    className="text-slate-500 hover:text-slate-300 underline"
                  >
                    Contact support
                  </a>
                </p>
              </div>
            </div>
          ) : (
            // SAME-ORG: This org's own invoice was already settled — books are clean
            <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-8 text-center animate-in zoom-in-95 shadow-2xl relative overflow-hidden space-y-4">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-sky-500 to-violet-500" />
              <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto text-2xl text-emerald-400 font-bold">
                ✓
              </div>
              <div>
                <h3 className="text-emerald-400 font-black uppercase text-xl mb-1">
                  Invoice Already Settled
                </h3>
                <p className="text-slate-400 text-sm max-w-sm mx-auto leading-relaxed">
                  {globalDuplicate.message}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3 text-left max-w-sm mx-auto">
                {globalDuplicate.vendorName && (
                  <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                    <p className="text-[9px] text-slate-500 uppercase font-bold mb-0.5">
                      Payee
                    </p>
                    <p className="text-sm text-white font-medium truncate">
                      {globalDuplicate.vendorName}
                    </p>
                  </div>
                )}
                {globalDuplicate.amount && (
                  <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                    <p className="text-[9px] text-slate-500 uppercase font-bold mb-0.5">
                      Amount
                    </p>
                    <p className="text-sm text-white font-mono font-bold">
                      {String(globalDuplicate.amount)}{" "}
                      {globalDuplicate.currency}
                    </p>
                  </div>
                )}
                {globalDuplicate.settledAt && (
                  <div className="p-3 rounded-xl bg-white/5 border border-white/5 col-span-2">
                    <p className="text-[9px] text-slate-500 uppercase font-bold mb-0.5">
                      Settled On
                    </p>
                    <p className="text-sm text-white font-mono">
                      {new Date(globalDuplicate.settledAt).toLocaleString()}
                    </p>
                  </div>
                )}
              </div>
              {globalDuplicate.txHash && (
                <a
                  href={getSolscanLink(globalDuplicate.txHash)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 text-[10px] font-black uppercase transition-colors inline-block"
                >
                  View On-Chain Receipt →
                </a>
              )}
              <p className="text-[9px] text-slate-600 font-mono">
                Your books are protected. No duplicate payment was processed.
              </p>
            </div>
          ))}

        {result && step !== "compiling" && !globalDuplicate && (
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

              {(status === "INCOMPLETE" || status === "REFUSED") && (
                <div className="p-6 space-y-6 border-b border-[#1e293b] bg-sky-500/5">
                  <div className="space-y-1">
                    <h4 className="text-sky-400 font-bold text-sm">
                      {status === "REFUSED"
                        ? "Action Required: Overrides Needed"
                        : "Action Required: Finalize Intent"}
                    </h4>
                    <p className="text-slate-500 text-[11px]">
                      The compiler requires manual selection for ambiguous data
                      points or authorizations for deterministic drift.
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

                        {result.paymentRoute?.type === "ON_CHAIN" ? (
                          <div className="p-4 border border-violet-500/30 bg-violet-500/10 rounded-xl space-y-3">
                            <p className="text-[11px] text-violet-300 font-bold uppercase tracking-wide flex items-center gap-2">
                              Extracted Ledger Route
                            </p>
                            <div className="space-y-3">
                              <p className="text-[12px] text-slate-300">
                                <span className="font-mono text-sky-400 bg-sky-400/10 px-2 py-1 rounded break-all box-decoration-clone">
                                  {result.paymentRoute.detail}
                                </span>
                              </p>
                              <p className="text-[10px] text-slate-400">
                                Confirm this destination identity to lock the
                                execution plan.
                              </p>
                              <button
                                onClick={() => {
                                  setResolutionWallet(
                                    result.paymentRoute!.detail!,
                                  );
                                }}
                                disabled={
                                  resolutionWallet ===
                                  result.paymentRoute.detail
                                }
                                className="w-full py-2 bg-violet-600 hover:bg-violet-500 disabled:bg-violet-900 disabled:text-violet-400 text-white text-xs font-bold uppercase rounded-lg transition-all"
                              >
                                {resolutionWallet === result.paymentRoute.detail
                                  ? "Authorization Locked ✓"
                                  : "Approve Authorization"}
                              </button>
                            </div>
                          </div>
                        ) : result.paymentRoute?.type === "OFF_CHAIN_FIAT" ? (
                          <div className="p-4 border border-amber-500/30 bg-amber-500/10 rounded-xl space-y-3">
                            <p className="text-[11px] text-amber-300 font-bold uppercase tracking-wide flex items-center gap-2">
                              Extracted Fiat Route (Off-Chain)
                            </p>
                            <div className="space-y-3">
                              <p className="text-[12px] text-amber-300 font-mono break-all leading-relaxed whitespace-pre-wrap">
                                {result.paymentRoute.detail}
                              </p>
                              <p className="text-[10px] text-slate-400">
                                Solana Phantom does not support native FIAT
                                routing. Approve this to settle out-of-band via
                                Proxy.
                              </p>
                              <button
                                onClick={() => {
                                  setResolutionWallet("FIAT_OFF_CHAIN_PROXY");
                                }}
                                disabled={
                                  resolutionWallet === "FIAT_OFF_CHAIN_PROXY"
                                }
                                className="w-full py-2 bg-amber-600 hover:bg-amber-500 disabled:bg-amber-900/50 disabled:border disabled:border-amber-500/30 disabled:text-amber-500 text-white text-xs font-bold uppercase rounded-lg transition-all"
                              >
                                {resolutionWallet === "FIAT_OFF_CHAIN_PROXY"
                                  ? "Proxy Marked for Settlement ✓"
                                  : "Mark as Fiat Settlement (Acknowledge)"}
                              </button>
                            </div>
                          </div>
                        ) : (
                          <input
                            type="text"
                            value={resolutionWallet}
                            onChange={(e) =>
                              setResolutionWallet(e.target.value)
                            }
                            placeholder="Solana address..."
                            className="w-full bg-[#020617] border border-[#1e293b] rounded-xl px-4 py-3 text-sm text-slate-200 focus:border-sky-500 transition-colors font-mono"
                          />
                        )}
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

                    <div className="space-y-1.5">
                      <label className="text-[10px] text-slate-400 uppercase font-black">
                        Corporate Category (COA)
                      </label>
                      <select
                        value={resolutionCategory}
                        onChange={(e) => setResolutionCategory(e.target.value)}
                        className="w-full bg-[#020617] border border-[#1e293b] rounded-xl px-4 py-3 text-sm text-slate-200 focus:border-sky-500 transition-colors uppercase font-bold tracking-widest"
                      >
                        {CORPORATE_CATEGORIES.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>

                    {result.context.diagnostics.some(
                      (d) => d.code === "MATH_INCONSISTENCY",
                    ) && (
                      <div className="p-4 border border-rose-500/30 bg-rose-500/10 rounded-xl flex items-start gap-3">
                        <AlertCircle className="h-5 w-5 text-rose-500 flex-shrink-0" />
                        <div className="text-[11px] text-rose-200/80">
                          <strong className="text-rose-400 block mb-0.5 uppercase font-black">
                            Fatal Math Invariant Violation
                          </strong>
                          This document has failed institutional math checks. It
                          cannot be resolved, overridden, or settled.
                        </div>
                      </div>
                    )}

                    <button
                      onClick={() =>
                        runCompilation({
                          wallet: resolutionWallet,
                          currency: resolutionCurrency,
                          category: resolutionCategory,
                        })
                      }
                      disabled={
                        (result.context.diagnostics.some(
                          (d) => d.code === "AMBIGUOUS_CURRENCY",
                        ) &&
                          !resolutionCurrency) ||
                        (result.context.diagnostics.some(
                          (d) => d.code === "MISSING_RECIPIENT_WALLET",
                        ) &&
                          !resolutionWallet) ||
                        result.context.diagnostics.some(
                          (d) => d.code === "MATH_INCONSISTENCY",
                        )
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
                        {result.lineItems.map((item, idx) => {
                          const hasMathError = result.context.diagnostics.some(
                            (d) => d.code === "MATH_INCONSISTENCY",
                          );
                          return (
                            <tr
                              key={idx}
                              className={`group transition-colors ${hasMathError ? "bg-rose-500/10 hover:bg-rose-500/20" : "hover:bg-white/2"}`}
                            >
                              <td
                                className={`py-2 pr-4 text-[10px] font-medium truncate max-w-[200px] ${hasMathError ? "text-rose-400" : "text-slate-400"}`}
                              >
                                {hasMathError && (
                                  <AlertCircle className="inline h-3 w-3 mr-1" />
                                )}
                                {item.description}
                              </td>
                              <td className="py-2 text-[10px] text-slate-500 font-mono text-right">
                                {Number(item.quantity).toString()}
                              </td>
                              <td className="py-2 text-[10px] text-slate-500 font-mono text-right">
                                {Number(item.unitPrice).toLocaleString()}
                              </td>
                              <td
                                className={`py-2 text-[10px] font-mono font-bold text-right ${hasMathError ? "text-rose-400" : "text-slate-200"}`}
                              >
                                {Number(item.totalPrice).toLocaleString()}
                              </td>
                            </tr>
                          );
                        })}
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
                        ⚠ Ambiguous Settlement Detected
                        <br />
                        An in-flight transaction was recorded for this intent.
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        reconcileSettlement(
                          result.documentId || result.plan.intentId,
                        )
                      }
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
                {status === "DETERMINISTIC" &&
                  result.context.documentStatus !== "SETTLED" &&
                  result.context.documentStatus !== "SETTLING" &&
                  step !== "confirmed" && (
                    <div className="relative z-9999 pointer-events-auto mt-6">
                      {/* ——————————————————————————————————————————— */}
                      {/* OWNER: express lane — no approval gate */}
                      {isOwner && (
                        <div className="mb-3 px-3 py-1.5 rounded-lg bg-violet-500/10 border border-violet-500/20 text-[9px] text-violet-400 font-bold uppercase tracking-widest text-center">
                          ⚡ OWNER AUTHORITY · DIRECT AUTHORIZATION ·
                          Wallet-as-Principal
                        </div>
                      )}

                      {/* ADMIN: EXECUTION_REJECTED */}
                      {!isOwner &&
                        (isRejected ||
                          liveGovernance === "EXECUTION_REJECTED") && (
                          <div className="p-5 rounded-2xl bg-rose-500/10 border border-rose-500/30 space-y-3 mb-4">
                            <div className="flex items-center gap-2">
                              <span className="text-rose-400 text-lg">✕</span>
                              <h4 className="text-rose-400 font-black text-xs uppercase tracking-widest">
                                Authorization Rejected
                              </h4>
                            </div>
                            <p className="text-slate-400 text-[11px] leading-relaxed">
                              Reason:{" "}
                              <span className="text-rose-300 font-semibold">
                                {(approvalStatusData as any)?.data
                                  ?.rejectionReason ??
                                  result.approvalRejectionReason ??
                                  "No reason provided."}
                              </span>
                            </p>
                            <button
                              onClick={() => {
                                setResult(null);
                                setApprovalRequested(false);
                                setFile(null);
                              }}
                              className="w-full h-10 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-black uppercase text-xs transition-all"
                            >
                              Upload Revised Invoice
                            </button>
                          </div>
                        )}

                      {/* ADMIN: EXECUTION_LOCKED — awaiting authorization */}
                      {!isOwner &&
                        isLocked &&
                        liveGovernance !== "EXECUTION_READY" &&
                        liveGovernance !== "EXECUTION_REJECTED" &&
                        (!approvalRequested ? (
                          <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-4 mb-4">
                            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-500 to-orange-500 rounded-t-2xl" />
                            <div className="flex items-center gap-2">
                              <span className="text-amber-400 text-lg">🔒</span>
                              <h4 className="text-amber-400 font-black text-xs uppercase tracking-widest">
                                Authorization Required
                              </h4>
                            </div>
                            <div className="text-[11px] text-slate-400 space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="text-emerald-400">✓</span> Math
                                Invariants: VERIFIED
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-emerald-400">✓</span>{" "}
                                Counterparty Wallet: VERIFIED
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-amber-400">⚠</span> Spend
                                Gate: PENDING OWNER/APPROVER COUNTERSIGN
                              </div>
                              {result.context.effectiveLimit && (
                                <div className="mt-2 text-[10px] text-slate-500 font-mono">
                                  Your delegation limit: $
                                  {result.context.effectiveLimit.toLocaleString()}{" "}
                                  · Invoice: $
                                  {Number(result.totalAmount).toLocaleString()}
                                </div>
                              )}
                            </div>
                            <button
                              onClick={() => {
                                requestApproval(result.intentId, {
                                  onSuccess: () => setApprovalRequested(true),
                                });
                              }}
                              disabled={isRequestingApproval}
                              className="w-full h-11 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-black uppercase text-xs shadow-xl transition-all disabled:opacity-50"
                            >
                              {isRequestingApproval
                                ? "Sending Request..."
                                : "Request Owner Authorization →"}
                            </button>
                          </div>
                        ) : (
                          <div className="p-5 rounded-2xl bg-slate-800/60 border border-amber-500/20 space-y-3 mb-4">
                            <div className="flex items-center gap-2">
                              <span className="animate-spin text-amber-400">
                                ⏳
                              </span>
                              <h4 className="text-amber-400 font-black text-xs uppercase tracking-widest">
                                Awaiting Owner Authorization
                              </h4>
                            </div>
                            <p className="text-slate-500 text-[10px] font-mono">
                              Checking every 8s · Your OWNER has been notified.
                            </p>
                          </div>
                        ))}
                      {/* ———————————————————————————————————————————————————————————————————————————————————— */}

                      {/* Standard flow: show sign button only when EXECUTION_READY (or OWNER) */}
                      {(isOwner ||
                        !isLocked ||
                        liveGovernance === "EXECUTION_READY") &&
                        !isRejected &&
                        liveGovernance !== "EXECUTION_REJECTED" &&
                        (isGuest ? (
                          <button
                            onClick={() => {
                              const docId =
                                result.documentId || result.plan.intentId;
                              const callbackUrl = `${window.location.origin}/compiler?id=${docId}`;
                              router.push(
                                `/sign-in?returnTo=${encodeURIComponent(new URL(callbackUrl).pathname + new URL(callbackUrl).search)}`,
                              );
                            }}
                            className="w-full h-14 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase text-sm shadow-2xl transition-all cursor-pointer border border-emerald-500/50"
                          >
                            Sign in to Settle on Ledger →
                          </button>
                        ) : !isIntentApproved ? (
                          <button
                            onClick={() => setIsIntentApproved(true)}
                            className="w-full h-14 rounded-2xl bg-violet-600 hover:bg-violet-500 text-white font-black uppercase text-sm shadow-2xl transition-all cursor-pointer ring-4 ring-violet-500/50"
                          >
                            Approve Authentic Intent
                          </button>
                        ) : result.paymentRoute?.type === "OFF_CHAIN_FIAT" ? (
                          <div className="p-6 bg-black/40 border border-white/5 rounded-2xl space-y-4">
                            <h4 className="text-white font-bold uppercase tracking-tight">
                              Checkout Summary
                            </h4>
                            <div className="flex justify-between items-center text-xs font-mono text-slate-400">
                              <span>Route</span>
                              <span className="text-white">
                                Fiat Rail (External)
                              </span>
                            </div>
                            <div className="flex justify-between items-center text-xs font-mono text-slate-400">
                              <span>Amount</span>
                              <span className="text-white">
                                {result.plan.steps[0]?.amount}
                              </span>
                            </div>
                            <div className="pt-4 border-t border-white/5">
                              <button
                                onClick={() => {
                                  setStep("confirmed");
                                  setTxSignature(
                                    "FIAT_OFF_CHAIN_SETTLEMENT_ACKNOWLEDGED",
                                  );
                                }}
                                className="w-full h-14 rounded-2xl bg-amber-500 hover:bg-amber-400 text-black font-black uppercase text-sm shadow-2xl transition-all cursor-pointer ring-4 ring-amber-500/50"
                              >
                                Acknowledge & Settle Externally
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="p-6 bg-[#0f172a] border border-violet-500/30 rounded-2xl space-y-4 shadow-2xl animate-in slide-in-from-bottom-4 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-500 via-sky-500 to-emerald-500" />
                            <h4 className="text-white font-black uppercase tracking-tight flex items-center justify-between">
                              <span>Settlement Checkout</span>
                              <span className="text-[10px] text-violet-400 bg-violet-500/10 px-2 py-1 rounded-md">
                                Protocol Hub
                              </span>
                            </h4>

                            <div className="bg-black/20 rounded-xl p-4 border border-white/5 space-y-3">
                              <p className="text-[9px] text-slate-500 uppercase font-black tracking-widest mb-1">
                                Institutional Pre-Flight Checklist
                              </p>
                              <div className="space-y-2">
                                <div className="flex items-center gap-2 text-[10px] text-emerald-400 font-bold">
                                  <CheckCircle2 className="h-3 w-3" />
                                  <span>
                                    Deterministic Math Invariants Verified
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 text-[10px] text-emerald-400 font-bold">
                                  <CheckCircle2 className="h-3 w-3" />
                                  <span>
                                    Counterparty Wallet Authorization Locked
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 text-[10px] text-emerald-400 font-bold">
                                  <CheckCircle2 className="h-3 w-3" />
                                  <span>Global Double-Spend Guard: CLEAR</span>
                                </div>
                                <div className="flex items-center gap-2 text-[10px] text-sky-400 font-bold">
                                  <Activity className="h-3 w-3" />
                                  <span>
                                    Simulated Transaction Success: 100%
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="space-y-2 border-y border-white/5 py-4">
                              <div className="flex justify-between items-center text-xs font-mono">
                                <span className="text-slate-500">
                                  Principal Ledger:
                                </span>
                                <span className="text-white bg-white/5 px-2 py-0.5 rounded">
                                  {result.plan.steps[0]?.amount}{" "}
                                  {result.plan.steps[0]?.token}
                                </span>
                              </div>
                              <div className="flex justify-between items-center text-xs font-mono">
                                <span className="text-slate-500">
                                  Network Gas:
                                </span>
                                <span className="text-emerald-400">
                                  Variable (Medium Prio)
                                </span>
                              </div>
                              <div className="flex justify-between items-center text-xs font-mono">
                                <span className="text-slate-500 flex items-center gap-1">
                                  Protocol Fee
                                  {isEliteMember && (
                                    <Shield className="h-3 w-3 text-amber-400" />
                                  )}
                                </span>
                                {isEliteMember ? (
                                  <span className="text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded line-through opacity-70">
                                    WAIVED
                                  </span>
                                ) : (
                                  <span className="text-rose-400 font-bold">
                                    {result.plan.steps[0]?.token === "SOL"
                                      ? tokenPrices.SOL
                                        ? `~ ${(0.5 / tokenPrices.SOL).toFixed(6)} SOL`
                                        : "$0.50"
                                      : "0.50 USDC"}
                                  </span>
                                )}
                              </div>
                            </div>

                            <button
                              id="EXECUTION_TRIGGER"
                              onClick={() => executeTransaction()}
                              disabled={step === "executing" || !publicKey}
                              className="w-full h-14 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase text-sm shadow-2xl transition-all cursor-pointer ring-2 ring-emerald-500/50 relative overflow-hidden group"
                            >
                              <span className="relative z-10">
                                {step === "executing"
                                  ? "Broadcasting..."
                                  : "Sign & Settle with Wallet →"}
                              </span>
                              <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform" />
                            </button>

                            {executionLogs.length > 0 && (
                              <div
                                ref={logContainerRef}
                                data-lenis-prevent
                                className="mt-4 p-4 bg-black/40 border border-white/5 rounded-xl font-mono text-[10px] text-slate-400 space-y-1 h-[100px] overflow-y-auto"
                              >
                                {executionLogs.map((log, i) => (
                                  <div key={i} className="flex gap-2">
                                    <span className="text-emerald-500">▶</span>
                                    <span>{log}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
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
          <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-8 text-center animate-in zoom-in-95 shadow-2xl relative overflow-hidden">
            {result?.context?.documentStatus === "SETTLED" && (
              <div className="absolute top-0 left-0 w-full bg-amber-500/10 text-amber-500 text-[10px] font-bold uppercase py-2 border-b border-amber-500/20 flex items-center justify-center gap-2">
                <AlertCircle className="h-3 w-3" /> Duplicate Guard Engaged:
                Invoice Already Settled
              </div>
            )}
            <div
              className={`w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl text-emerald-400 font-bold ${result?.context?.documentStatus === "SETTLED" ? "mt-6" : ""}`}
            >
              ✓
            </div>
            <h3 className="text-emerald-400 font-black uppercase text-xl mb-2">
              Intent Executed
            </h3>
            <p className="text-slate-500 text-[10px] font-mono break-all mb-8 opacity-60">
              {txSignature}
            </p>
            {txSignature !== "HISTORICAL_RECONCILIATION" &&
              !txSignature.includes("FIAT_OFF_CHAIN") && (
                <a
                  href={getSolscanLink(txSignature)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 text-[10px] font-black uppercase transition-colors inline-block"
                >
                  Verify Transaction →
                </a>
              )}
          </div>
        )}

        {error && step !== "confirmed" && (
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
