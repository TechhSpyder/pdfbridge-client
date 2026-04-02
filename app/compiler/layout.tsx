import { getServerSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { SolanaProvider } from "@/modules/compiler/SolanaProvider";

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
  if (!session) redirect("/sign-in");

  return (
    <div className="min-h-screen bg-[#020617] text-white">
      {children}
    </div>
  );
}
