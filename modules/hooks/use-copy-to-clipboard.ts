import { useState, useCallback } from "react";
import { toast } from "sonner";

export const useClipboard = (timeout = 2000) => {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(
    (text: string, message = "Copied to clipboard!") => {
      if (!navigator?.clipboard) return;

      navigator.clipboard.writeText(text).then(() => {
        setCopied(true);

        toast.success(message);

        setTimeout(() => setCopied(false), timeout);
      });
    },
    [timeout],
  );

  return { copied, copy };
};
