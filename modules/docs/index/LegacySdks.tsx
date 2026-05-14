import { Terminal } from "lucide-react";
import { CodeBlock } from "./CodeBlock";

export function LegacySdks() {
  return (
    <>
      {/* Node.js SDK */}
      <section id="node-sdk" className="scroll-mt-24 space-y-6">
        <h2 className="text-3xl font-bold text-white flex items-center gap-4">
          <Terminal className="text-blue-400" /> Node.js SDK
        </h2>
        <p className="text-slate-400 leading-relaxed">
          The official PDFBridge SDK for Node.js and TypeScript. Built with
          Zod runtime type-safety and performance in mind.
        </p>
        <CodeBlock
          code={`npm install @techhspyder/pdfbridge-node`}
          language="bash"
        />
        <div className="space-y-4">
          <h4 className="font-bold text-white text-sm">Quick Start</h4>
          <CodeBlock
            code={`import { PDFBridge } from '@techhspyder/pdfbridge-node';

// Automatically loads PDFBRIDGE_API_KEY from environment 
// or pass it explicitly: new PDFBridge({ apiKey: "..." })
const pdf = new PDFBridge();

async function run() {
  // Option 1: Generate & Wait for completion
  const result = await pdf.generateAndWait({
    url: 'https://example.com'
  });
  console.log('PDF URL:', result.pdfUrl);

  // Option 2: Ghost Mode (Renders as raw ArrayBuffer)
  const buffer = await pdf.generate({
    html: '<h1>Strictly Confidential</h1>',
    ghostMode: true
  });
}`}
            language="typescript"
          />
        </div>
      </section>

      {/* Python SDK */}
      <section id="python-sdk" className="scroll-mt-24 space-y-6">
        <h2 className="text-3xl font-bold text-white flex items-center gap-4">
          <Terminal className="text-emerald-400" /> Python SDK
        </h2>
        <p className="text-slate-400 leading-relaxed">
          Integrate PDFBridge into your Python applications with ease.
        </p>
        <CodeBlock code={`pip install pdfbridge-python`} language="bash" />
        <div className="space-y-4">
          <h4 className="font-bold text-white text-sm">Example Usage</h4>
          <CodeBlock
            code={`from pdfbridge import PDFBridge

# Automatically loads PDFBRIDGE_API_KEY from environment
client = PDFBridge()

# Generate and wait for completion
status = client.generate_and_wait(
    url="https://yourapp.com/invoice/123",
    options={"format": "A4", "printBackground": True}
)

print(f"PDF ready: {status.pdfUrl}")`}
            language="python"
          />
        </div>
      </section>
    </>
  );
}
