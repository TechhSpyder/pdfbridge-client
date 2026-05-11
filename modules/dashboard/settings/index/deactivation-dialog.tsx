import { authClient } from "@/lib/auth-client";
import { Button, Dialog } from "@/modules/app";
import { useDeactivateAccount } from "@/modules/hooks/queries";
import { AlertTriangle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function DeactivateAccountDialog({
  isOpen,
  onClose,
  userEmail,
}: {
  isOpen: boolean;
  onClose: () => void;
  userEmail: string;
}) {
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const deactivateMutation = useDeactivateAccount();

  const handleDeactivate = async () => {
    try {
      await deactivateMutation.mutateAsync({ password, confirmation });
      toast.success("Account deactivated successfully");
      await authClient.signOut();
      window.location.href = "/";
    } catch (e: any) {
      toast.error("Deactivation failed", {
        description:
          e.response?.data?.error || e.message || "An error occurred",
      });
    }
  };

  const isInvalid =
    confirmation !== userEmail || (password === "" && !!userEmail);

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Content className="max-w-md bg-slate-900 border-white/10">
        <Dialog.Header className="border-white/5">
          <div className="flex items-center gap-3 text-red-500">
            <AlertTriangle className="h-5 w-5" />
            <Dialog.Title className="text-red-500 font-bold">
              Irreversible Account Deactivation
            </Dialog.Title>
          </div>
        </Dialog.Header>
        <Dialog.Body className="items-start gap-4">
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 w-full text-left">
            <p className="text-xs text-red-400 leading-relaxed font-medium">
              This action is{" "}
              <span className="underline uppercase font-bold">
                irreversible
              </span>
              . Upon deactivation, your API keys will be permanently destroyed,
              active processing jobs will be terminated, and your access to the
              Intelligence Engine will be severed.
            </p>
          </div>

          <div className="space-y-4 w-full">
            <div className="space-y-2 text-left">
              <label className="text-[10px] font-bold text-slate-500 uppercase">
                Confirm your password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-black/40 border border-white/5 text-slate-300 rounded-lg p-3 text-sm focus:outline-none focus:border-red-500/50 transition-colors"
              />
            </div>

            <div className="space-y-2 text-left">
              <label className="text-[10px] font-bold text-slate-500 uppercase">
                Type <span className="text-white select-all">{userEmail}</span>{" "}
                to confirm
              </label>
              <input
                type="text"
                value={confirmation}
                onChange={(e) => setConfirmation(e.target.value)}
                placeholder={userEmail}
                className="w-full bg-black/40 border border-white/5 text-slate-300 rounded-lg p-3 text-sm focus:outline-none focus:border-red-500/50 transition-colors"
              />
            </div>
          </div>
        </Dialog.Body>
        <Dialog.Footer className="border-t border-white/5 pt-4">
          <div className="flex gap-3 w-full sm:justify-end">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 sm:flex-none border-white/10 text-slate-400 hover:text-white hover:bg-white/5 bg-transparent"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeactivate}
              disabled={isInvalid || deactivateMutation.isPending}
              className="flex-1 sm:flex-none bg-red-600 hover:bg-red-500 text-white font-bold shadow-xl shadow-red-500/20 transition-all disabled:opacity-50"
            >
              {deactivateMutation.isPending
                ? "Deactivating..."
                : "Deactivate Permanently"}
            </Button>
          </div>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>
  );
}
