import { Breadcrumbs, MobileTopBar, Sidebar } from "@/modules/dashboard";
import { currentUser } from "@clerk/nextjs/server";
import { MailWarning } from "lucide-react";
import { Button } from "@/modules/app/button";
import { redirect } from "next/navigation";
import { InactivityHandler } from "@/modules/auth/inactivity-handler";
import Script from "next/script";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const isVerified = user.emailAddresses.some(
    (email) => email.verification?.status === "verified",
  );

  if (!isVerified) {
    return (
      <div className="min-h-screen bg-[#020617] text-white flex items-center justify-center p-6">
        <div className="max-w-md w-full p-8 rounded-3xl bg-slate-900/40 border border-white/5 space-y-6 text-center animate-in fade-in zoom-in-95 duration-500">
          <div className="h-20 w-20 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mx-auto mb-6">
            <MailWarning className="text-orange-500" size={40} />
          </div>
          <h2 className="text-2xl font-black uppercase tracking-tight text-white">
            Verification Required
          </h2>
          <p className="text-slate-400 font-medium leading-relaxed">
            To prevent abuse and ensure platform security, we require email
            verification before you can access the PDFBridge dashboard.
          </p>
          <div className="pt-4">
            <form
              action={async () => {
                "use server";
                // This is a placeholder for a server action if needed,
                // but purely for UI we can just have a button that suggests reload
              }}
            >
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold h-12"
              >
                I've verified my email
              </Button>
            </form>
          </div>
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">
            Check your inbox at{" "}
            <span className="text-blue-500">
              {user.primaryEmailAddress?.emailAddress}
            </span>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-white flex">
      <Script
        src="https://cdn.paddle.com/paddle/v2/paddle.js"
        strategy="lazyOnload"
      />
      <InactivityHandler />
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
