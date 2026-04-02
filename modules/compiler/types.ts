export type IntentStatus = "DETERMINISTIC" | "ESCALATED" | "REFUSED" | "INCOMPLETE";

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
    action: "TRANSFER";
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
};

export type VerifiableExecutionPlan = {
  intentId: string;
  plan: ExecutionPlan;
  context: VerificationContext;
  proofHash: string;
  rulesetHash: string;
  iterationCount: number;
  lineItems?: any[];
};
