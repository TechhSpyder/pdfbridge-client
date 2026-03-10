"use client";

import { usePDFBridge } from "@/modules/hooks/use-pdfbridge";

/**
 * Legacy wrapper refactored to use the new PDFBridge SDK internally.
 * All calls now benefit from automatic retries and health-checked authentication.
 */
export const useApiClient = () => {
  const sdk = usePDFBridge();

  return {
    get: (path: string, options?: RequestInit) =>
      sdk.rawRequest(path, { ...options, method: "GET" }),
    post: (path: string, body: any, options?: RequestInit) =>
      sdk.rawRequest(path, { 
        ...options, 
        method: "POST", 
        body: body instanceof FormData ? body : JSON.stringify(body) 
      }),
    patch: (path: string, body: any, options?: RequestInit) =>
      sdk.rawRequest(path, { ...options, method: "PATCH", body: JSON.stringify(body) }),
    put: (path: string, body: any, options?: RequestInit) =>
      sdk.rawRequest(path, { ...options, method: "PUT", body: JSON.stringify(body) }),
    delete: (path: string, options?: RequestInit) =>
      sdk.rawRequest(path, { ...options, method: "DELETE" }),
  };
};
