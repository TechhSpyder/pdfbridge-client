import Title from "@/modules/app/title";
import { Users } from "lucide-react";
import { Metadata } from "next";
import { InviteClient } from "@/modules/invite/invite-client";

export const metadata: Metadata = {
  title: "Organization Invite | PDFBridge",
  description: "You have been invited to join an organization on PDFBridge.",
};

export default async function InvitePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black/95 bg-grid-white/[0.02]">
      <div className="w-full max-w-md p-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <InviteClient token={token} />
      </div>
    </div>
  );
}
