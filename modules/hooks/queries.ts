"use client";

import { useQuery, useMutation } from "@tanstack/react-query";
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
