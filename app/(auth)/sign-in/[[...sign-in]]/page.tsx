import dynamic from "next/dynamic";
import { Metadata } from "next";

const AuthCard = dynamic(
  () => import("@/modules/auth/auth-card").then((mod) => mod.AuthCard),
  {
    loading: () => (
      <div className="w-full max-w-md h-[400px] flex items-center justify-center rounded-3xl border border-white/5 bg-white/5 backdrop-blur-sm">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 rounded-full border-t-2 border-b-2 border-blue-500 animate-spin" />
          <p className="text-slate-500 text-sm animate-pulse">
            Loading secure portal...
          </p>
        </div>
      </div>
    ),
  },
);

export const metadata: Metadata = {
  title: "Sign In",
  description:
    "Sign in to your PDFBridge account to manage your API keys, view usage, and configure your conversions.",
};

export default function SignInPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#020617] px-4 py-12">
      {/* Background Gradients */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
      <div className="absolute top-0 -right-4 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>

      <div className="relative z-10 w-full max-w-md">
        <AuthCard type="sign-in" />
      </div>

      {/* Footer link for branding */}
      <div className="absolute bottom-8 text-slate-500 text-xs">
        © 2026 PDFBridge. Build reliable documents.
      </div>
    </div>
  );
}
