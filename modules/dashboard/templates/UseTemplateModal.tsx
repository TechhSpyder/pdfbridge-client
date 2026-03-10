"use client";

import { useState } from "react";
import { Dialog } from "@/modules/app/dialog";
import { Button } from "@/modules/app/button";
import { Loader2, FileText, Send, X } from "lucide-react";
import { useApiClient } from "@/app/api/api-client";
import { toast } from "sonner";

interface UseTemplateModalProps {
  template: any;
  isOpen: boolean;
  onClose: () => void;
}

export function UseTemplateModal({
  template,
  isOpen,
  onClose,
}: UseTemplateModalProps) {
  const [variables, setVariables] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const api = useApiClient();

  const handleInputChange = (key: string, value: string) => {
    setVariables((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const tId = toast.loading("Starting conversion...");

    try {
      const response = await api.post("/api/v1/convert", {
        templateId: template.id,
        variables,
        testMode: true, // Default to test mode for safety in development
      });

      toast.success("Conversion job started!", { id: tId });
      onClose();
      // Potentially redirect to the job status page
      if (response.jobId) {
        toast.info("Check conversion status in the dashboard.");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to start conversion", { id: tId });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!template) return null;

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Content className="max-w-md">
        <Dialog.Header className="border-white/5">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-indigo-500/10">
              <FileText className="h-5 w-5 text-indigo-400" />
            </div>
            <Dialog.Title className="text-white font-bold">
              Use Template
            </Dialog.Title>
          </div>
          <Dialog.Close className="text-slate-500 hover:text-white transition-colors">
            <X className="h-5 w-5" />
          </Dialog.Close>
        </Dialog.Header>

        <form onSubmit={handleSubmit}>
          <Dialog.Body className="py-6 gap-6">
            <div className="w-full space-y-1">
              <h3 className="text-sm font-semibold text-slate-300">
                {template.name}
              </h3>
              <p className="text-xs text-slate-500">
                Provide values for the template variables below.
              </p>
            </div>

            <div className="w-full space-y-4">
              {template.variables && template.variables.length > 0 ? (
                template.variables.map((variable: string) => (
                  <div key={variable} className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      {variable.replace(/_/g, " ")}
                    </label>
                    <input
                      placeholder={`Enter ${variable.replace(/_/g, " ")}`}
                      value={variables[variable] || ""}
                      onChange={(e) =>
                        handleInputChange(variable, e.target.value)
                      }
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                      required
                    />
                  </div>
                ))
              ) : (
                <div className="text-center py-4 bg-white/5 rounded-xl border border-white/5">
                  <p className="text-xs text-slate-500 italic">
                    No variables detected in this template.
                  </p>
                </div>
              )}
            </div>
          </Dialog.Body>

          <Dialog.Footer className="border-white/5 bg-slate-900/40">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-white/5 hover:bg-white/5 text-slate-400"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold gap-2 min-w-[120px]"
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              {isSubmitting ? "Processing..." : "Generate PDF"}
            </Button>
          </Dialog.Footer>
        </form>
      </Dialog.Content>
    </Dialog.Root>
  );
}
