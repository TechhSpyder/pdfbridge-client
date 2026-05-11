export interface ApiKey {
  id: string;
  name: string;
  type: "test" | "live";
  hint: string;
  createdAt: string;
  organizationId: string;
}

export interface ApiError {
  response?: {
    data?: {
      error?: string;
      message?: string;
    };
  };
  message: string;
}

export interface UsageStats {
  executionCount: number;
  intelligenceCount: number;
  intelligenceTemplateCount: number;
  plan: {
    name: string;
    limit: number;
    intelligenceLimit: number;
    intelligenceTemplateLimit: number;
  };
  hasExecutions: boolean;
}

export interface FinancialDocument {
  id: string;
  organizationId: string;
  invoiceNumber?: string;
  vendorName?: string;
  totalAmount?: number | string;
  taxAmount?: number | string;
  currency?: string;
  status: string;
  settlementStatus?: string;
  isReconciled: boolean;
  requiresHumanReview: boolean;
  isTestMode: boolean;
  isGhostMode: boolean;
  createdAt: string;
  quickbooksId?: string;
  xeroId?: string;
  url?: string;
  success?: boolean;
  metadata?: Record<string, any>;
  aiMetadata?: Record<string, any>;
}

export interface JobStatus {
  id: string;
  status: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";
  result?: any; // To be refined if we know the structure
  error?: string;
}
