import { BillingPage } from "@/modules/dashboard";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getSeverApiClient } from "@/lib/api-server";
import { Suspense } from "react";

export default async function Page() {
  const queryClient = new QueryClient();
  const api = await getSeverApiClient();

  try {
    await Promise.all([
      queryClient.prefetchQuery({
        queryKey: ["me"],
        queryFn: () => api.get("/api/v1/me"),
      }),
      queryClient.prefetchQuery({
        queryKey: ["plans"],
        queryFn: () => api.get("/api/v1/billing/plans"),
      }),
      queryClient.prefetchQuery({
        queryKey: ["billing-info"],
        queryFn: () => api.get("/api/v1/billing/info"),
      }),
    ]);
  } catch (error) {
    console.error("Billing prefetch error:", error);
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense
        fallback={
          <div className="h-screen grid place-items-center">
            Loading billing...
          </div>
        }
      >
        <BillingPage />
      </Suspense>
    </HydrationBoundary>
  );
}
