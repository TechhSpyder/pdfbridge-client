import Title from "@/modules/app/title";
import { Users } from "lucide-react";
import { Metadata } from "next";
import { TeamSettingsClient } from "@/modules/dashboard/team/team-settings-client";

export const metadata: Metadata = {
  title: "Team Settings | PDFBridge",
  description: "Manage your organization members and invites.",
};

export default function TeamPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <Title
        title="Team Settings"
        description="Manage your organization members, pending invites, and seat limits."
        icon={<Users className="h-8 w-8 text-slate-400" />}
      />
      <TeamSettingsClient />
    </div>
  );
}
