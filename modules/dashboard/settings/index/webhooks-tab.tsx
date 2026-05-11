import { Button, GlowCard } from "@/modules/app";
import { useWebhookEndpoints, useCreateWebhookEndpoint, useDeleteWebhookEndpoint } from "@/modules/hooks/queries";
import { Loader2, Webhook, Trash2, Plus, AlertTriangle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function WebhooksTab({ organizationId, planName }: { organizationId?: string; planName?: string }) {
  const { data, isLoading } = useWebhookEndpoints();
  const endpoints = (data as any)?.data || [];
  
  const createMutation = useCreateWebhookEndpoint();
  const deleteMutation = useDeleteWebhookEndpoint();
  
  const [url, setUrl] = useState("");
  const [events, setEvents] = useState<string[]>(["invoice.settled"]);
  
  // Gate check based on plan tier (e.g. Starter/Pro might not have it)
  // Let's assume Webhooks are gated to Growth+ or available for all for now.
  // The API will block it if it's not allowed, but we can also hide it.
  
  const handleCreate = async () => {
    if (!url.trim()) return toast.error("URL is required");
    if (!url.startsWith("https://")) return toast.error("HTTPS URL is required for security");
    
    await createMutation.mutateAsync({ url, events });
    setUrl("");
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this endpoint?")) {
      await deleteMutation.mutateAsync(id);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="prose prose-invert max-w-none mb-8">
        <p className="text-slate-400 text-sm">
          Listen for programmatic events on your account to automate workflows and trigger programmatic settlements. Webhooks must use HTTPS.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <GlowCard
            title="Registered Endpoints"
            sub="Active webhook URLs receiving events."
            icon={<Webhook className="h-5 w-5 text-purple-400" />}
            content={
              <div className="mt-6 space-y-4">
                {isLoading ? (
                  <div className="flex items-center justify-center p-8 text-slate-400">
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    Loading endpoints...
                  </div>
                ) : endpoints.length === 0 ? (
                  <div className="text-center p-8 border border-white/5 rounded-xl bg-slate-900/50">
                    <Webhook className="w-8 h-8 text-slate-500 mx-auto mb-3" />
                    <p className="text-sm text-slate-400">No webhooks registered.</p>
                  </div>
                ) : (
                  endpoints.map((ep: any) => (
                    <div key={ep.id} className="p-4 rounded-xl border border-white/10 bg-slate-800/30 flex items-start justify-between group hover:border-purple-500/30 transition-colors">
                      <div>
                        <h4 className="font-bold text-white text-sm break-all">{ep.url}</h4>
                        <div className="flex items-center gap-2 mt-2 flex-wrap">
                          {ep.events.map((ev: string) => (
                            <span key={ev} className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20">
                              {ev}
                            </span>
                          ))}
                        </div>
                        <div className="mt-3 text-xs text-slate-500 font-mono">
                          Secret: {ep.secret}
                        </div>
                      </div>
                      <button
                        onClick={() => handleDelete(ep.id)}
                        disabled={deleteMutation.isPending}
                        className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            }
          />
        </div>

        <div className="space-y-6">
          <GlowCard
            title="Add Endpoint"
            sub="Register a new listener URL."
            icon={<Plus className="h-5 w-5 text-blue-400" />}
            content={
              <div className="mt-6 space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Payload URL</label>
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://webhook.site/..."
                    className="w-full bg-slate-900/50 border border-white/10 rounded-lg px-4 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Events</label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer p-2 rounded hover:bg-white/5">
                      <input 
                        type="checkbox" 
                        checked={events.includes("invoice.settled")}
                        onChange={(e) => {
                          if (e.target.checked) setEvents([...events, "invoice.settled"]);
                          else setEvents(events.filter(ev => ev !== "invoice.settled"));
                        }}
                        className="rounded border-slate-700 bg-slate-900 text-purple-500 focus:ring-purple-500/50"
                      />
                      <span className="text-sm text-slate-300">invoice.settled</span>
                    </label>
                  </div>
                </div>

                <Button 
                  onClick={handleCreate}
                  disabled={createMutation.isPending || !url.trim()}
                  className="w-full bg-purple-600 hover:bg-purple-500 shadow-xl shadow-purple-600/20"
                >
                  {createMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Webhook className="w-4 h-4 mr-2" />}
                  Register Webhook
                </Button>
              </div>
            }
          />
          
          <div className="p-4 rounded-xl border border-amber-500/10 bg-amber-500/5 space-y-2">
            <h4 className="flex items-center gap-2 text-xs font-bold text-amber-400">
              <AlertTriangle className="w-4 h-4" />
              Security First
            </h4>
            <p className="text-[10px] text-amber-400/70 leading-relaxed">
              We sign all webhook payloads with an HMAC-SHA256 signature using the endpoint secret. Verify the `x-pdfbridge-signature` header in your server.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
