import { authClient, useSession } from "@/lib/auth-client";
import { Button, UserAvatar } from "@/modules/app";
import { useMe } from "@/modules/hooks/queries";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function ProfileForm() {
  const { data: session } = useSession();
  const userData = useMe();
  const [name, setName] = useState(session?.user?.name || "");
  const [email, setEmail] = useState(session?.user?.email || "");
  const [isSaving, setIsSaving] = useState(false);

  const isDummyEmail = session?.user?.email?.endsWith("@solana.pdfbridge.xyz");

  useEffect(() => {
    if (session?.user) {
      setName(session.user.name || "");
      setEmail(session.user.email || "");
    }
  }, [session]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Proactive: Use the direct profile update endpoint and refresh user data
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || ""}/api/v1/user/me/profile`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ name, email }),
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update profile");
      }

      await authClient.getSession();
      await userData.refetch();

      toast.success("Profile updated successfully!");
    } catch (e: any) {
      toast.error("Failed to update profile", {
        description: e.message || "An unexpected error occurred.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="mt-6 space-y-6 pt-2 border-t border-white/5">
      <div className="flex items-center gap-6">
        <UserAvatar
          name={session?.user?.name}
          image={session?.user?.image}
          size="lg"
        />
        <div>
          <h4 className="text-lg font-bold text-white flex items-center gap-2">
            {session?.user?.name || "Unknown User"}
          </h4>
          <p className="text-sm text-slate-400">{session?.user?.email}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-slate-500 uppercase">
            Full Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-black/40 border border-white/5 text-slate-300 rounded-lg p-3 text-sm focus:outline-none focus:border-blue-500/50 transition-colors"
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-slate-500 uppercase flex items-center justify-between">
            Email Address
            {isDummyEmail && <span className="text-amber-500 font-bold ml-2">Update Required for Receipts</span>}
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={!isDummyEmail}
            className={`w-full border rounded-lg p-3 text-sm focus:outline-none transition-colors ${
              isDummyEmail 
                ? "bg-black/40 border-amber-500/30 text-slate-300 focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50" 
                : "bg-slate-900/50 border-white/5 text-slate-500 cursor-not-allowed"
            }`}
            placeholder={isDummyEmail ? "Enter your real email address..." : ""}
          />
          {isDummyEmail && (
            <p className="text-[10px] text-amber-500/70 italic mt-1">
              Your account currently uses a generated wallet identifier. Please provide a real email to receive Paddle invoice receipts and platform notifications.
            </p>
          )}
        </div>
      </div>

      <div className="pt-4 flex justify-end border-t border-white/5">
        <Button
          onClick={handleSave}
          disabled={isSaving || (name === session?.user?.name && email === session?.user?.email)}
          className="bg-blue-600 hover:bg-blue-500 text-white font-bold h-10 px-6 shadow-xl shadow-blue-500/10 transition-all disabled:opacity-50"
        >
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}

export function WorkspaceForm() {
  const { data: userData, refetch } = useMe();
  const [name, setName] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (userData?.organizationName) {
      setName(userData.organizationName);
    }
  }, [userData]);

  const handleSave = async () => {
    if (!userData?.organizationId) return;
    setIsSaving(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || ""}/api/v1/organizations/${userData.organizationId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ name }),
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update workspace");
      }

      await refetch();
      toast.success("Workspace renamed successfully!");
    } catch (e: any) {
      toast.error("Failed to update workspace", {
        description: e.message || "An unexpected error occurred.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="mt-6 space-y-6 pt-2 border-t border-white/5">
      <div className="grid grid-cols-1 gap-4">
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-slate-500 uppercase">
            Workspace Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-black/40 border border-white/5 text-slate-300 rounded-lg p-3 text-sm focus:outline-none focus:border-blue-500/50 transition-colors"
            placeholder="My Workspace"
          />
          <p className="text-[10px] text-slate-500 italic">
            This name will appear on all your processed invoices and reports.
          </p>
        </div>
      </div>

      <div className="pt-4 flex justify-end border-t border-white/5">
        <Button
          onClick={handleSave}
          disabled={isSaving || name === userData?.organizationName}
          className="bg-purple-600 hover:bg-purple-500 text-white font-bold h-10 px-6 shadow-xl shadow-purple-500/10 transition-all disabled:opacity-50"
        >
          {isSaving ? "Updating..." : "Save Workspace"}
        </Button>
      </div>
    </div>
  );
}
