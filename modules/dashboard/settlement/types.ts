export interface LineItem {
  description: string;
  quantity: number | string | null;
  unitPrice: number | string | null;
  totalPrice: number | string | null;
}

export type SettlementStatus = "UNSETTLED" | "SETTLING" | "SETTLED" | "REJECTED_AUDIT" | "PENDING_APPROVAL";

export interface LedgerDocument {
  id: string;
  organizationId: string;
  vendorName: string | null;
  invoiceNumber: string | null;
  totalAmount: number | string | null;
  taxAmount: number | string | null;
  currency: string;
  isReconciled: boolean;
  requiresHumanReview: boolean;
  status: SettlementStatus;
  settlementStatus?: SettlementStatus;
  intentId: string | null;
  category: string;
  resolutions?: Record<string, any>;
  signatures?: string[];
  lineItems: LineItem[];
  metadata: Record<string, any>;
  createdAt: string;
  updatedAt: string;
  // CFO Layer 2: Governance
  governanceStatus?: "EXECUTION_READY" | "EXECUTION_LOCKED" | "EXECUTION_REJECTED";
  approvalId?: string | null;
}

export interface LedgerResponse {
  documents: LedgerDocument[];
  pagination: {
    total: number;
    pages: number;
    current: number;
    limit: number;
  };
}
