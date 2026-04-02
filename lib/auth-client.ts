import { createAuthClient } from "better-auth/react";
import { organizationClient, emailOTPClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  // Use the local frontend origin to force all auth through our Proxy Shield.
  // This resolves the 'Passport Conflict' and satisfies Better-Auth's requirement for an absolute URL.
  baseURL: typeof window !== "undefined" 
    ? window.location.origin 
    : (process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  plugins: [organizationClient(), emailOTPClient()],
});

export const { signIn, signUp, useSession, signOut } = authClient;
