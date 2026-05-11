import { Breadcrumbs, MobileTopBar, Sidebar } from "@/modules/dashboard";
import { getServerSession } from "@/lib/auth";
import { MailWarning } from "lucide-react";
import { Button } from "@/modules/app/button";
import { redirect } from "next/navigation";
import { VerifyOtpForm } from "@/modules/auth/verify-otp-form";
// import { InactivityHandler } from "@/modules/auth/inactivity-handler";
import Script from "next/script";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();

  if (!session) {
    redirect("/sign-in");
  }

  const isVerified = session.user.emailVerified;

  if (!isVerified) {
    return (
      <div className="min-h-screen bg-[#020617] text-white flex items-center justify-center p-6">
        <VerifyOtpForm email={session.user.email} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-white flex">
      <Script
        src="https://cdn.paddle.com/paddle/v2/paddle.js"
        strategy="lazyOnload"
      />
      {/* <InactivityHandler /> */}
      {/* Dashboard Sidebar */}
      <Sidebar />

      <main className="w-full">
        <MobileTopBar />
        <Breadcrumbs />
        <div className="px-4 sm:px-6 lg:px-8 w-full py-6 z-50 max-lg:pt-24">
          {children}
        </div>
      </main>
    </div>
  );
}
