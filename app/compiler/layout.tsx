import { getServerSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { SolanaProvider } from "@/modules/compiler/SolanaProvider";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Compiler — PDFBridge",
  description:
    "Financial Intent Compiler. Documents become programs that move money.",
};

export default async function CompilerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();
  if (!session) redirect("/sign-in?returnTo=/compiler");

  return (
    <div className="relative min-h-screen bg-[#020617] text-white overflow-hidden">
      {/* Floating Escape Hatch */}
      <div className="w-full h-11 fixed top-6 left-6 z-50">
        <Link
          href="/dashboard"
          className="group flex items-center gap-2 rounded-full border border-white/10 bg-[#020617]/50 px-4 py-2 text-xs font-semibold text-slate-400 backdrop-blur-md transition-all hover:bg-white/5 hover:text-white w-fit"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
          Back to Dashboard
        </Link>
      </div>

      {children}
    </div>
  );
}
