import { BillingPage } from "@/modules/dashboard";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="h-screen grid place-items-center">
          Loading billing...
        </div>
      }
    >
      <BillingPage />
    </Suspense>
  );
}
