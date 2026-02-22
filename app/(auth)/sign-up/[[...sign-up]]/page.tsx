import dynamic from "next/dynamic";
import { Metadata } from "next";
import Link from "next/link";

const AuthCard = dynamic(
  () => import("@/modules/auth/auth-card").then((mod) => mod.AuthCard),
  {
    loading: () => (
      <div className="w-full max-w-md h-[500px] flex items-center justify-center rounded-3xl border border-white/5 bg-white/5 backdrop-blur-sm">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 rounded-full border-t-2 border-b-2 border-blue-500 animate-spin" />
          <p className="text-slate-500 text-sm animate-pulse">
            Loading secure portal...
          </p>
        </div>
      </div>
    ),
    ssr: false,
  },
);

export const metadata: Metadata = {
  title: "Create an Account",
  description:
    "Get started with PDFBridge. Create an account to generate high-quality PDFs from HTML and URLs using our modern API.",
};

export default function SignUpPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#020617] px-4 py-12">
      {/* Background Gradients */}
      <div className="absolute top-20 -left-10 w-80 h-80 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
      <div className="absolute bottom-20 -right-10 w-80 h-80 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>

      <div className="relative z-10 w-full max-w-md">
        <AuthCard type="sign-up" />
      </div>

      {/* Footer link for branding */}
      <div className="absolute bottom-8 text-slate-500 text-xs text-center w-full px-4">
        By creating an account, you agree to our{" "}
        <Link
          href="/terms"
          className="text-blue-500 hover:text-blue-400 transition underline underline-offset-4"
        >
          Terms of Service
        </Link>{" "}
        ,{" "}
        <Link
          href="/privacy"
          className="text-blue-500 hover:text-blue-400 transition underline underline-offset-4"
        >
          Privacy Policy
        </Link>
        , and
        <Link
          href="/dpa"
          className="text-blue-500 hover:text-blue-400 transition underline underline-offset-4"
        >
          Data Processing Agreement.
        </Link>
      </div>
    </div>
  );
}
