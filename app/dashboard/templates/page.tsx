import { TemplatesDashboard } from "@/modules/dashboard/templates";

export const metadata = {
  title: "My Templates | PDFBridge",
  description: "Manage your saved PDF templates.",
};

export default function TemplatesPage() {
  return <TemplatesDashboard />;
}
