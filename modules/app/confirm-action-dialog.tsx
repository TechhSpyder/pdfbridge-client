import { useState } from "react";
import { Dialog } from "@/modules/app/dialog";
import { Button } from "@/modules/app/button";
import { AlertTriangle, Loader2 } from "lucide-react";

interface ConfirmActionDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  title: string;
  description: string;
  expectedText: string;
  confirmButtonText?: string;
  isLoading?: boolean;
}

export function ConfirmActionDialog({
  isOpen,
  onOpenChange,
  onConfirm,
  title,
  description,
  expectedText,
  confirmButtonText = "Confirm",
  isLoading = false,
}: ConfirmActionDialogProps) {
  const [inputText, setInputText] = useState("");

  const isMatch = inputText === expectedText;

  const handleConfirm = () => {
    if (isMatch && !isLoading) {
      onConfirm();
      // Keep state until parent closes it, or reset on close
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setTimeout(() => setInputText(""), 200); // Reset after close animation
    }
    onOpenChange(open);
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={handleOpenChange}>
      <Dialog.Content className="max-w-md">
        <Dialog.Header>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-500/10 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-red-500" />
            </div>
            <Dialog.Title className="text-white">{title}</Dialog.Title>
          </div>
        </Dialog.Header>
        
        <Dialog.Body>
          <div className="space-y-4">
            <p className="text-sm text-slate-400">
              {description}
            </p>
            
            <div className="space-y-2 p-4 bg-red-500/5 border border-red-500/10 rounded-xl">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-widest">
                Type <span className="text-red-400 select-none font-mono font-bold bg-red-500/10 px-1 py-0.5 rounded">{expectedText}</span> to confirm
              </label>
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="w-full bg-black/40 border border-red-500/20 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-red-500 transition-colors font-mono"
                placeholder={expectedText}
                autoFocus
              />
            </div>
          </div>
        </Dialog.Body>

        <Dialog.Footer className="border-t border-white/5 bg-slate-900/50">
          <div className="flex justify-end gap-3 w-full">
            <Button
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={isLoading}
              className="border-white/5 hover:bg-white/5"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={!isMatch || isLoading}
              className={`bg-red-600 hover:bg-red-500 text-white font-bold transition-all ${
                !isMatch ? "opacity-50 grayscale cursor-not-allowed" : "shadow-[0_0_15px_rgba(220,38,38,0.4)]"
              }`}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              {isLoading ? "Processing..." : confirmButtonText}
            </Button>
          </div>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>
  );
}
