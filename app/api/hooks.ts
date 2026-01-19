"use client";

import { useQuery } from "@tanstack/react-query";
import { useApiClient } from "@/app/api/api-client";

export const useMe = () => {
  const api = useApiClient();
  return useQuery({
    queryKey: ["me"],
    queryFn: () => api.get("/api/v1/me"),
  });
};
