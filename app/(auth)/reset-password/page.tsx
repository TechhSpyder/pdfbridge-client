import { Suspense } from "react";
import { ResetPasswordPage } from "@/modules/auth/reset-password";

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="h-screen grid place-items-center">Loading...</div>
      }
    >
      <ResetPasswordPage />
    </Suspense>
  );
}
