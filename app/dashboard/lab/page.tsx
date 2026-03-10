import { AiLabPage } from "@/modules/dashboard/ai-lab";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getSeverApiClient } from "@/lib/api-server";

export default async function Page() {
  const queryClient = new QueryClient();
  const api = await getSeverApiClient();

  try {
    await queryClient.prefetchQuery({
      queryKey: ["me"],
      queryFn: () => api.get("/api/v1/me"),
    });
  } catch (error) {
    console.error("AI Lab prefetch error:", error);
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AiLabPage />
    </HydrationBoundary>
  );
}
