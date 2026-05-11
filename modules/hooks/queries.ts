import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useApiClient } from "@/app/api/api-client";
import { usePDFBridge } from "./use-pdfbridge";
export { usePDFBridge };
import { toast } from "sonner";
import type { ApiError, JobStatus } from "../types";

export const useMe = () => {
  const api = useApiClient();
  return useQuery({
    queryKey: ["me"],
    queryFn: () => api.get("/api/v1/user/me"),
  });
};

export const useApiKeys = () => {
  const api = useApiClient();
  return useQuery({
    queryKey: ["api-keys"],
    queryFn: () => api.get("/api/v1/keys"),
  });
};

export const useCreateKey = () => {
  const api = useApiClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { name: string; type: "test" | "live" }) =>
      api.post("/api/v1/keys", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["api-keys"] });
    },
  });
};

export const useDeleteKey = () => {
  const api = useApiClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/api/v1/keys/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["api-keys"] });
    },
  });
};

export const useRevealKey = () => {
  const api = useApiClient();
  return useMutation({
    mutationFn: (keyId: string) => api.post("/api/v1/keys/reveal", { keyId }),
  });
};


export const useActivity = (
  page = 1,
  limit = 10,
  refetchInterval?: number,
) => {
  const api = useApiClient();
  return useQuery({
    queryKey: ["executions", page, limit],
    queryFn: () => api.get(`/api/v1/activity?page=${page}&limit=${limit}`),
    refetchInterval,
  });
};

export const useJobStatus = (jobId: string, pollInterval?: number) => {
  const sdk = usePDFBridge();
  return useQuery({
    queryKey: ["job-status", jobId],
    queryFn: () => sdk.getJob(jobId),
    enabled: !!jobId,
    refetchInterval: (query) => {
      const data = query.state.data as JobStatus | undefined;
      if (data?.status === "COMPLETED" || data?.status === "FAILED")
        return false;
      return pollInterval || 2000;
    },
  });
};

export const useWebhookLogs = (documentId: string) => {
  const api = useApiClient();
  return useQuery({
    queryKey: ["webhook-logs", documentId],
    queryFn: () => api.get(`/api/v1/webhook-logs?executionId=${documentId}`),
    enabled: !!documentId,
  });
};

export const useWebhookEndpoints = () => {
  const api = useApiClient();
  return useQuery({
    queryKey: ["webhook-endpoints"],
    queryFn: () => api.get("/api/v1/webhook-endpoints"),
  });
};

export const useCreateWebhookEndpoint = () => {
  const api = useApiClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { url: string; events: string[] }) =>
      api.post("/api/v1/webhook-endpoints", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["webhook-endpoints"] });
      toast.success("Webhook endpoint created");
    },
    onError: (err: ApiError) => {
      toast.error("Failed to create webhook", {
        description: err.response?.data?.error || err.message,
      });
    },
  });
};

export const useDeleteWebhookEndpoint = () => {
  const api = useApiClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/api/v1/webhook-endpoints/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["webhook-endpoints"] });
      toast.success("Webhook endpoint deleted");
    },
    onError: (err: ApiError) => {
      toast.error("Failed to delete webhook", {
        description: err.response?.data?.error || err.message,
      });
    },
  });
};

export const useProcessingStats = (refetchInterval?: number) => {
  const api = useApiClient();
  return useQuery({
    queryKey: ["processing-stats"],
    queryFn: () => api.get("/api/v1/processing/stats"),
    refetchInterval,
  });
};

export const useCheckout = () => {
  const queryClient = useQueryClient();
  const api = useApiClient();
  return useMutation({
    mutationFn: (data: {
      planId: string;
      provider: string;
      interval?: string;
      redirectUrl?: string;
      callbackUrl?: string;
    }) => api.post("/api/v1/billing/checkout", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["billing-info"] });
    },
  });
};

export const useVerifyPayment = () => {
  const api = useApiClient();
  return useMutation({
    mutationFn: (reference: string) =>
      api.get(`/api/v1/billing/verify/${reference}`),
  });
};

export const useVerifyPaddle = () => {
  const api = useApiClient();
  return useMutation({
    mutationFn: (transactionId: string) =>
      api.get(`/api/v1/billing/verify-paddle/${transactionId}`),
  });
};

export const useBillingInfo = () => {
  const api = useApiClient();
  return useQuery({
    queryKey: ["billing-info"],
    queryFn: () => api.get("/api/v1/billing/info"),
  });
};

export const useCancelSubscription = () => {
  const api = useApiClient();
  return useMutation({
    mutationFn: () => api.post("/api/v1/billing/cancel", {}),
  });
};

export const usePlans = () => {
  const api = useApiClient();
  return useQuery({
    queryKey: ["plans"],
    queryFn: () => api.get("/api/v1/billing/plans"),
  });
};

export const useTopupCheckout = () => {
  const api = useApiClient();
  return useMutation({
    mutationFn: (quantity: number = 1) =>
      api.post("/api/v1/billing/topup", { quantity }),
  });
};

export const useVerifyTopup = () => {
  const api = useApiClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (transactionId: string) =>
      api.get(`/api/v1/billing/topup/verify/${transactionId}`),
    onSuccess: () => {
      // Immediately refetch usage so progress bar reflects new capacity
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });
};

export const useUpdateSettings = () => {
  const api = useApiClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      notificationUsageAlerts?: boolean;
      notificationBillingUpdates?: boolean;
    }) => api.patch("/api/v1/user/me/settings", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });
};

export const useGenerateTemplate = () => {
  const api = useApiClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { prompt: string }) =>
      api.post("/api/v1/templates/generate", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });
};

export const useTemplates = () => {
  const api = useApiClient();
  return useQuery({
    queryKey: ["templates"],
    queryFn: () => api.get("/api/v1/templates"),
  });
};

export const useTemplate = (id: string) => {
  const api = useApiClient();
  return useQuery({
    queryKey: ["templates", id],
    queryFn: () => api.get(`/api/v1/templates/${id}`),
    enabled: !!id,
  });
};

export const useSaveTemplate = () => {
  const api = useApiClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      name: string;
      html: string;
      css?: string;
      variables?: string[];
      prompt?: string;
    }) => api.post("/api/v1/templates", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["templates"] });
    },
  });
};

export const useUpdateTemplate = (id: string) => {
  const api = useApiClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      name?: string;
      html?: string;
      css?: string;
      variables?: string[];
    }) => api.put(`/api/v1/templates/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["templates"] });
      queryClient.invalidateQueries({ queryKey: ["templates", id] });
    },
  });
};

export const useDeleteTemplate = () => {
  const api = useApiClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/api/v1/templates/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["templates"] });
    },
  });
};

export const useUpdateIpWhitelist = () => {
  const api = useApiClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (ips: string[]) =>
      api.patch(`/api/v1/organizations/whitelist`, { ipWhitelist: ips }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
      toast.success("IP Whitelist updated");
    },
    onError: (err: ApiError) => {
      toast.error("Failed to update IP Whitelist", {
        description: err.response?.data?.error || err.message,
      });
    },
  });
};

export const useIntegrations = (organizationId?: string) => {
  const sdk = usePDFBridge(organizationId);
  return useQuery({
    queryKey: ["integrations", organizationId],
    queryFn: () => sdk.getIntegrations(),
  });
};

export const useDisconnectIntegration = (organizationId?: string) => {
  const sdk = usePDFBridge(organizationId);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (provider: string) => sdk.disconnectIntegration(provider),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["integrations"] });
      toast.success("Integration disconnected successfully");
    },
    onError: (err: ApiError) => {
      toast.error("Failed to disconnect integration", {
        description: err.message || "Please check your network and try again.",
      });
    },
  });
};
export const useLedger = (page = 1, limit = 10, refetchInterval?: number) => {
  const api = useApiClient();
  return useQuery({
    queryKey: ["ledger", page, limit],
    queryFn: () => api.get(`/api/v1/ledger?page=${page}&limit=${limit}`),
    refetchInterval,
    refetchIntervalInBackground: true,
  });
};

export const useLedgerDocument = (id: string) => {
  const api = useApiClient();
  return useQuery({
    queryKey: ["ledger", id],
    queryFn: () => api.get(`/api/v1/ledger/${id}`),
    enabled: !!id,
  });
};

export const useIngestDocument = () => {
  const queryClient = useQueryClient();
  const api = useApiClient();
  return useMutation({
    mutationFn: ({
      file,
      testMode = true,
    }: {
      file: File;
      testMode?: boolean;
    }) => {
      const formData = new FormData();
      formData.append("file", file);
      if (testMode) formData.append("testMode", "true");
      return api.post("/api/v1/ingest", formData, {
        headers: {
          "x-execution-mode": testMode ? "test" : "live",
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ledger"] });
      toast.success("Institutional Ingestion Initiated", {
        description: "PDFBridge Engine synthesizing semantic components. Check the ledger for real-time reconciliation.",
      });
    },
    onError: (err: ApiError) => {
      toast.error("Ingestion failed", {
        description: err.response?.data?.message || err.message,
      });
    },
  });
};

export const useSettlements = (page = 1, limit = 10, refetchInterval?: number) => {
  const api = useApiClient();
  return useQuery({
    queryKey: ["settlements", page, limit],
    queryFn: () => api.get(`/api/v1/ledger?page=${page}&limit=${limit}&reconciledOnly=true`),
    refetchInterval,
    refetchIntervalInBackground: true,
  });
};

export const useOverrideReconciliation = () => {
  const api = useApiClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.post(`/api/v1/ledger/${id}/reconcile/override`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ledger"] });
      queryClient.invalidateQueries({ queryKey: ["settlements"] });
      toast.success("Manual Reconciliation Override Successful");
    },
    onError: (err: ApiError) => {
      toast.error("Override failed", {
        description: err.response?.data?.error || err.message,
      });
    },
  });
};

export const useDeactivateAccount = () => {
  const api = useApiClient();
  return useMutation({
    mutationFn: (data: { password?: string; confirmation: string }) =>
      api.delete("/api/v1/user/me", data),
  });
};

// ─── CFO Layer 2: Approval Governance Hooks ────────────────────────────────

/** Fetch all pending approvals for this org (role-scoped by backend). */
export const useApprovals = () => {
  const api = useApiClient();
  return useQuery({
    queryKey: ["approvals"],
    queryFn: () => api.get("/api/v1/approvals"),
  });
};

/** Poll approval status for a specific intent. Used by CompilerStage. */
export const useApprovalStatus = (approvalId: string | null, enabled = false) => {
  const api = useApiClient();
  return useQuery({
    queryKey: ["approval-status", approvalId],
    queryFn: () => api.get(`/api/v1/approvals/${approvalId}/status`),
    enabled: !!approvalId && enabled,
    refetchInterval: (query) => {
      const data = query.state.data as any;
      const status = data?.data?.governanceStatus;
      if (status === "EXECUTION_READY" || status === "EXECUTION_REJECTED") return false;
      return 8000; // poll every 8s while EXECUTION_LOCKED
    },
  });
};

/** Request OWNER/APPROVER authorization for a locked intent. */
export const useRequestApproval = () => {
  const api = useApiClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (intentId: string) =>
      api.post(`/api/v1/compiler/intent/${intentId}/request-approval`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["approvals"] });
      toast.success("Authorization request sent to your organization's OWNER.");
    },
    onError: (err: ApiError) => {
      toast.error("Failed to request authorization", {
        description: err.response?.data?.message || err.message,
      });
    },
  });
};

/** OWNER/APPROVER: authorize a pending payment. */
export const useAuthorizeApproval = () => {
  const api = useApiClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ workflowId, memo }: { workflowId: string; memo?: string }) =>
      api.post(`/api/v1/approvals/${workflowId}/authorize`, { memo }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["approvals"] });
      queryClient.invalidateQueries({ queryKey: ["approval-status"] });
      toast.success("Payment authorized. The requesting ADMIN can now settle.");
    },
    onError: (err: ApiError) => {
      toast.error("Authorization failed", {
        description: err.response?.data?.message || err.message,
      });
    },
  });
};

/** OWNER/APPROVER: reject a pending payment. */
export const useRejectApproval = () => {
  const api = useApiClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ workflowId, reason }: { workflowId: string; reason: string }) =>
      api.post(`/api/v1/approvals/${workflowId}/reject`, { reason }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["approvals"] });
      queryClient.invalidateQueries({ queryKey: ["approval-status"] });
      toast.success("Payment request rejected. Admin has been notified.");
    },
    onError: (err: ApiError) => {
      toast.error("Rejection failed", {
        description: err.response?.data?.message || err.message,
      });
    },
  });
};

/** Read org-level approval policy (role-scoped). */
export const useApprovalPolicy = (orgId: string | undefined) => {
  const api = useApiClient();
  return useQuery({
    queryKey: ["approval-policy", orgId],
    queryFn: () => api.get(`/api/v1/organizations/${orgId}/approval-policy`),
    enabled: !!orgId,
  });
};

/** OWNER: update org-level approval thresholds. */
export const useUpdateApprovalPolicy = (orgId: string | undefined) => {
  const api = useApiClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { significant: number; material: number }) =>
      api.patch(`/api/v1/organizations/${orgId}/approval-policy`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["approval-policy", orgId] });
      toast.success("Governance policy updated.");
    },
    onError: (err: ApiError) => {
      toast.error("Policy update failed", {
        description: err.response?.data?.message || err.message,
      });
    },
  });
};

/** OWNER: update a specific member's spend delegation limit. */
export const useUpdateMemberSpendLimit = (orgId: string | undefined) => {
  const api = useApiClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, spendLimit }: { userId: string; spendLimit: number | null }) =>
      api.patch(`/api/v1/organizations/${orgId}/members/${userId}/spend-limit`, { spendLimit }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["org-members", orgId] });
      toast.success("Spend limit updated.");
    },
    onError: (err: ApiError) => {
      toast.error("Spend limit update failed", {
        description: err.response?.data?.message || err.message,
      });
    },
  });
};

