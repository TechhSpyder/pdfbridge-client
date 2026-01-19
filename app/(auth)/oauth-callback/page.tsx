"use client";

import { useEffect } from "react";
import { useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function OAuthCallbackPage() {
  const { client } = useClerk();
  const router = useRouter();

  useEffect(() => {
    const signIn = client?.signIn;
    const error = signIn?.firstFactorVerification?.error;

    if (error?.code === "external_account_not_found") {
      toast.error("No account found. Please sign up first.");
      router.replace("/sign-up");
      return;
    }

    if (signIn?.status === "complete") {
      router.replace("/dashboard");
      return;
    }
  }, [client, router]);

  return (
    <div className="flex h-screen items-center justify-center text-slate-400">
      Completing authentication…
    </div>
  );
}
// "use client";

// import { useEffect } from "react";
// import { useClerk } from "@clerk/nextjs";
// import { useRouter, useSearchParams } from "next/navigation";
// import { toast } from "sonner";

// export default function OAuthCallbackPage() {
//   const { client } = useClerk();
//   const router = useRouter();
//   const params = useSearchParams();

//   const intent = params.get("intent");

//   useEffect(() => {
//     if (!client) return;

//     // 🔐 SIGN IN FLOW
//     if (intent === "sign-in") {
//       const signIn = client.signIn;
//       const error = signIn?.firstFactorVerification?.error;

//       if (error?.code === "external_account_not_found") {
//         toast.info(
//           "We couldn’t find an account for this Google email. Let’s create one.",
//         );
//         router.replace("/sign-up?reason=google_no_account");
//         return;
//       }

//       if (signIn?.status === "complete") {
//         router.replace("/dashboard");
//         return;
//       }
//     }

//     // 🆕 SIGN UP FLOW
//     if (intent === "sign-up") {
//       const signUp = client.signUp;
//       const error = signUp?.verifications?.externalAccount?.error;

//       if (error) {
//         toast.error(error.message ?? "Could not complete sign up");
//         router.replace("/sign-up");
//         return;
//       }

//       if (signUp?.status === "complete") {
//         router.replace("/dashboard");
//         return;
//       }
//     }
//   }, [client, intent, router]);

//   return (
//     <div className="flex h-screen items-center justify-center text-slate-400">
//       Completing authentication…
//     </div>
//   );
// }
