export interface ChangelogEntry {
  version: string;
  date: string;
  title: string;
  description: string;
  changes: {
    type: "feature" | "fix" | "improvement";
    text: string;
  }[];
}

export const CHANGELOG_DATA: ChangelogEntry[] = [
  {
    version: "1.0.0",
    date: "March 3, 2026",
    title: "The Public Debut",
    description:
      "PDFBridge officially moves out of early access. We are now open for public developers with infrastructure-grade reliability.",
    changes: [
      {
        type: "feature",
        text: "Public API (v1) officially stable and production-ready.",
      },
      {
        type: "improvement",
        text: "Migrated to Railway's high-availability 'Always-On' tier for sub-200ms cold starts.",
      },
      {
        type: "feature",
        text: "Global Status Page launched at status.pdfbridge.xyz.",
      },
    ],
  },
  {
    version: "0.9.8",
    date: "February 24, 2026",
    title: "Branding & Trust",
    description:
      "Preparing the project for its professional rollout under the TechhSpyder studio banner.",
    changes: [
      {
        type: "improvement",
        text: "Migrated legal entity to TechhSpyder Product Studio Ltd.",
      },
      {
        type: "feature",
        text: "Introduced Founder-led onboarding sequence for personalized developer support.",
      },
      {
        type: "improvement",
        text: "Infrastructure masking implemented to ensure backend technical security.",
      },
      {
        type: "fix",
        text: "Resolved various navigation dead links and absolute URL hardcoding.",
      },
    ],
  },
  {
    version: "0.9.5",
    date: "February 20, 2026",
    title: "Safety & AI Intelligence",
    description:
      "Significant enhancements to security and data intelligence layers.",
    changes: [
      {
        type: "feature",
        text: "Full 2FA (TOTP/SMS) support for all developer accounts.",
      },
      {
        type: "feature",
        text: "AI Metadata Extraction: Gemini-powered structured data extraction from PDFs.",
      },
      {
        type: "feature",
        text: "Ghost Mode: Privacy-first rendering where no data is ever stored on disk.",
      },
      {
        type: "improvement",
        text: "Refactored background processing to Redis/Upstash for vertical scalability.",
      },
    ],
  },
];
