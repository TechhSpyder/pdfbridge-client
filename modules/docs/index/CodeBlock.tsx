import { useState } from "react";
import { Terminal } from "lucide-react";
import { Highlight, themes } from "prism-react-renderer";

export function CodeBlock({ code, language }: { code: string; language: string }) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group">
      <button
        onClick={copy}
        className="absolute right-4 top-4 z-20 p-2 rounded-lg bg-white/5 border border-white/10 opacity-0 group-hover:opacity-100 transition-all text-slate-400 hover:text-white hover:bg-white/10 cursor-pointer"
      >
        {copied ? "Copied!" : <Terminal className="h-4 w-4" />}
      </button>
      <Highlight theme={themes.vsDark} code={code.trim()} language={language}>
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <pre
            className={`${className} p-4 sm:p-6 rounded-2xl border border-white/5 bg-slate-900/50 backdrop-blur-sm overflow-x-auto max-w-full text-xs sm:text-sm leading-relaxed`}
            style={{ ...style, backgroundColor: "transparent" }}
          >
            {tokens.map((line, i) => (
              <div key={i} {...getLineProps({ line })}>
                {line.map((token, key) => (
                  <span key={key} {...getTokenProps({ token })} />
                ))}
              </div>
            ))}
          </pre>
        )}
      </Highlight>
    </div>
  );
}
