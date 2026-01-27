import { AuthCard } from "@/modules/auth/auth-card";
import { Metadata } from "next";

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
      <div className="absolute bottom-8 text-slate-500 text-xs text-center w-full">
        By continuing, you agree to our Terms of Service and Privacy Policy.
      </div>
    </div>
  );
}
