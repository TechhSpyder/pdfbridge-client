import { Sidebar } from "@/modules/dashboard";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#020617] text-white flex">
      {/* Dashboard Sidebar */}

      <Sidebar />

      <main className="w-full px-4 py-8 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
}
