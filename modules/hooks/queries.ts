"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useApiClient } from "@/app/api/api-client";
import { toast } from "sonner";

export const useMe = () => {
  const api = useApiClient();
  return useQuery({
    queryKey: ["me"],
    queryFn: () => api.get("/api/v1/me"),
  });
};

export const useRotateKey = () => {
  const api = useApiClient();
  return useMutation({
    mutationFn: (type: "test" | "live" = "live") =>
      api.post("/api/v1/keys/rotate", { type }),
  });
};

export const useConversions = (
  page = 1,
  limit = 10,
  refetchInterval?: number,
) => {
  const api = useApiClient();
  return useQuery({
    queryKey: ["conversions", page, limit],
    queryFn: () => api.get(`/api/v1/conversions?page=${page}&limit=${limit}`),
    refetchInterval,
  });
};

export const useWebhookLogs = (conversionId: string) => {
  const api = useApiClient();
  return useQuery({
    queryKey: ["webhook-logs", conversionId],
    queryFn: () => api.get(`/api/v1/conversions/${conversionId}/webhooks`),
    enabled: !!conversionId,
  });
};

export const useConversionStats = (refetchInterval?: number) => {
  const api = useApiClient();
  return useQuery({
    queryKey: ["conversion-stats"],
    queryFn: () => api.get("/api/v1/me/stats"),
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
    onError: (err: any) => {
      toast.error("Failed to update IP Whitelist", {
        description: err.response?.data?.error || err.message,
      });
    },
  });
};
