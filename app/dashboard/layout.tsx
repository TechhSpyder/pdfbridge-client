import { Breadcrumbs, MobileTopBar, Sidebar } from "@/modules/dashboard";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#020617] text-white flex">
      {/* Dashboard Sidebar */}

      <Sidebar />

      <main className="w-full">
        <MobileTopBar />
        <Breadcrumbs />
        <div className="px-4 sm:px-6 lg:px-8 w-full py-6 z-50">{children}</div>
      </main>
    </div>
  );
}
