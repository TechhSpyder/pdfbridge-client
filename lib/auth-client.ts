import { createAuthClient } from "better-auth/react";
import {
  emailOTPClient,
  inferAdditionalFields,
  organizationClient,
} from "better-auth/client/plugins";

export const authClient = createAuthClient({
  // Use the local frontend origin to force all auth through our Proxy Shield.
  // This resolves the 'Passport Conflict' and satisfies Better-Auth's requirement for an absolute URL.
  baseURL: typeof window !== "undefined" 
    ? window.location.origin 
    : (process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  plugins: [
    organizationClient(),
    emailOTPClient(),
    // Platform-level role (e.g. "platform-owner") returned in `session.user.role`
    // from the API's Better-Auth session endpoint. This does NOT represent org
    // membership roles (OWNER/ADMIN/MEMBER) and is used only for internal UI gating.
    inferAdditionalFields({
      user: {
        role: {
          type: "string",
          required: false,
          returned: true,
          input: false,
        },
      },
    }),
  ],
});

export const { signIn, signUp, useSession, signOut } = authClient;
