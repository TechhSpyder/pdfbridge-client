"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useApiClient } from "@/app/api/api-client";

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
    mutationFn: () => api.post("/api/v1/keys/rotate", {}),
  });
};

export const useConversions = (page = 1, limit = 10) => {
  const api = useApiClient();
  return useQuery({
    queryKey: ["conversions", page, limit],
    queryFn: () => api.get(`/api/v1/conversions?page=${page}&limit=${limit}`),
  });
};

export const useCheckout = () => {
  const api = useApiClient();
  return useMutation({
    mutationFn: (data: {
      planId: string;
      provider: string;
      redirectUrl?: string;
      callbackUrl?: string;
    }) => api.post("/api/v1/billing/checkout", data),
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
