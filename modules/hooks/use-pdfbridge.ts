import { PDFBridge } from "@techhspyder/pdfbridge-node";
import { useMemo } from "react";

/**
 * Custom hook to get a stabilized, authenticated instance of the PDFBridge SDK.
 * This version uses Better-Auth (cookie-based).
 */
export const usePDFBridge = (organizationId?: string) => {
  const envUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3003";
  const baseUrl = envUrl.endsWith("/api/v1") ? envUrl : `${envUrl.replace(/\/$/, "")}/api/v1`;

  return useMemo(() => {
    // Note: Better-Auth is cookie-based. The SDK must support 'credentials: include' 
    // in its internal fetch requests. If the SDK is techhspyder/pdfbridge-node,
    // it typically allows passing a custom fetch or configuration.
    
    const client = new Proxy({} as any, {
      get: (target, prop) => {
        return async (...args: any[]) => {
          const sdk = new PDFBridge({
            // No Bearer token needed as we rely on session cookies
            organizationId,
            baseUrl,
            useCookies: true,
          });

          // Smart Path Normalization for rawRequest
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
  }, [organizationId, baseUrl]);
};
