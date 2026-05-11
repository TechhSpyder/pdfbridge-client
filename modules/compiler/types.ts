export type IntentStatus = "DETERMINISTIC" | "ESCALATED" | "REFUSED" | "INCOMPLETE";

/**
 * GovernanceStatus — orthogonal to IntentStatus.
 * IntentStatus = "Is the invoice mathematically sound?"
 * GovernanceStatus = "Is this person authorized to move money?"
 */
export type GovernanceStatus = "EXECUTION_READY" | "EXECUTION_LOCKED" | "EXECUTION_REJECTED";

export type SpendTier = "ROUTINE" | "SIGNIFICANT" | "MATERIAL";

export type DiagnosticSeverity = "INFO" | "WARN" | "CRITICAL";

export type Diagnostic = {
  code: string;
  severity: DiagnosticSeverity;
  message: string;
  metadata?: Record<string, any>;
};

export type SimulationResult = {
  success: boolean;
  type?: "INSUFFICIENT_FUNDS" | "SLIPPAGE" | "ACCOUNT_NOT_FOUND" | "NETWORK";
  message?: string;
  recoverable: boolean;
};

export type ExecutionPlan = {
  intentId: string;
  steps: {
    action: "TRANSFER" | "TRANSFER_FEE";
    token: "SOL" | "USDC";
    amount: string;
    destination: string;
  }[];
  constraints: {
    exactAmount: boolean;
    exactDestination: boolean;
    validUntil: number;
  };
};

export type VerificationContext = {
  status: IntentStatus;
  recipientStatus: "VERIFIED" | "UNVERIFIED" | "SUSPICIOUS";
  diagnostics: Diagnostic[];
  priorTxCount: number;
  simulation?: SimulationResult;
  documentStatus?: string;
  // CFO Layer 2: Spend governance (frozen at compile time)
  spendTier?: SpendTier;
  effectiveLimit?: number;    // The actual limit used (member override ?? plan default)
  governanceStatus?: GovernanceStatus;
};

export type LineItem = {
  description: string;
  quantity: number | string | null;
  unitPrice: number | string | null;
  totalPrice: number | string | null;
};

export type PaymentRoute = {
  type: "ON_CHAIN" | "OFF_CHAIN_FIAT" | "UNKNOWN";
  detail: string | null;
  raw?: any;
};

export type VerifiableExecutionPlan = {
  intentId: string;
  documentId?: string;
  plan: ExecutionPlan;
  context: VerificationContext;
  proofHash: string;
  rulesetHash: string;
  iterationCount: number;
  lineItems?: LineItem[];
  paymentRoute?: PaymentRoute;
  extractedWallet?: string | null; // Kept for backwards compatibility just in case
  invoiceNumber?: string | null;
  totalAmount?: string | null;
  // CFO Layer 2: Governance fields
  governanceStatus?: GovernanceStatus;
  approvalId?: string | null;              // Links to ApprovalWorkflow record
  approvalRejectionReason?: string | null; // Set when EXECUTION_REJECTED
  approvalCount?: number;                  // How many OWNERs have approved so far
  requiredApprovals?: number;              // 1 (single-OWNER org) or 2 (multi-OWNER org)
};
