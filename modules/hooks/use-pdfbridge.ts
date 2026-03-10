import { PDFBridge } from "@techhspyder/pdfbridge-node";
// If not, we would normally use @techhspyder/pdfbridge-node

import { useAuth } from "@clerk/nextjs";
import { useMemo } from "react";

/**
 * Custom hook to get a stabilized, authenticated instance of the PDFBridge SDK.
 * This is the recommended way to interact with the API from the dashboard.
 */
export const usePDFBridge = (organizationId?: string) => {
  const { getToken } = useAuth();
  const envUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3003";
  const baseUrl = envUrl.endsWith("/api/v1") ? envUrl : `${envUrl.replace(/\/$/, "")}/api/v1`;

  return useMemo(() => {
    const client = new Proxy({} as any, {
      get: (target, prop) => {
        return async (...args: any[]) => {
          const token = await getToken();
          const sdk = new PDFBridge({
            bearerToken: token || undefined,
            organizationId,
            baseUrl,
          });

          // Smart Path Normalization for rawRequest to prevent double-prefixing
          if (prop === "rawRequest" && typeof args[0] === "string") {
            const rawPath = args[0];
            if (rawPath.startsWith("/api/v1")) {
              args[0] = rawPath.replace("/api/v1", "");
            }
          }

          return (sdk as any)[prop](...args);
        };
      }
    });

    return client as PDFBridge;
  }, [getToken, organizationId, baseUrl]);
};
