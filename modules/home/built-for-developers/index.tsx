"use client";

import { useState } from "react";

import { Highlight, themes } from "prism-react-renderer";
import { useScrollAnimation } from "@/modules/hooks/use-scroll-animation";

type CodeSnippet = {
  lang: string;
  label: string;
  code: string;
};

const snippets: CodeSnippet[] = [
  {
    label: "Node.js",
    lang: "typescript",
    code: `import fs from "node:fs";
import FormData from "form-data";

const form = new FormData();
form.append("file", fs.createReadStream("./invoice.pdf"));

const res = await fetch("https://api.pdfbridge.xyz/api/v1/compiler/compile-intent", {
  method: "POST",
  headers: {
    "x-api-key": process.env.PDFBRIDGE_API_KEY!,
  },
  body: form as any,
});

const intent = await res.json();
console.log(intent);`,
  },
  {
    label: "Python",
    lang: "python",
    code: `import requests

with open("invoice.pdf", "rb") as f:
  r = requests.post(
    "https://api.pdfbridge.xyz/api/v1/compiler/compile-intent",
    headers={"x-api-key": "pk_test_your_key_here"},
    files={"file": f},
  )

print(r.json())`,
  },
  {
    label: "Go",
    lang: "go",
    code: `package main

import (
  "bytes"
  "mime/multipart"
  "net/http"
  "os"
)

func main() {
  f, _ := os.Open("invoice.pdf")
  defer f.Close()

  var buf bytes.Buffer
  w := multipart.NewWriter(&buf)
  fw, _ := w.CreateFormFile("file", "invoice.pdf")
  _, _ = fw.ReadFrom(f)
  w.Close()

  req, _ := http.NewRequest("POST", "https://api.pdfbridge.xyz/api/v1/compiler/compile-intent", &buf)
  req.Header.Set("x-api-key", "pk_test_your_key_here")
  req.Header.Set("Content-Type", w.FormDataContentType())

  http.DefaultClient.Do(req)
}`,
  },
  {
    label: "PHP",
    lang: "php",
    code: `<?php
$ch = curl_init('https://api.pdfbridge.xyz/api/v1/compiler/compile-intent');
curl_setopt($ch, CURLOPT_HTTPHEADER, [
  'x-api-key: pk_test_your_key_here',
]);

curl_setopt($ch, CURLOPT_POSTFIELDS, [
  'file' => new CURLFile('invoice.pdf', 'application/pdf', 'invoice.pdf'),
]);

curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$response = curl_exec($ch);
curl_close($ch);

echo $response;`,
  },
];

export function BuiltForDevelopers() {
  const { ref, isVisible } = useScrollAnimation();
  const [activeTab, setActiveTab] = useState(0);

  return (
    <section
      ref={ref}
      className="py-24 bg-background border-t border-border hidden md:block"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div
          className={`mx-auto max-w-2xl text-center transition-all duration-700 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          }`}
        >
          <h2 className="text-3xl font-semibold tracking-tight">
            Stripe-grade invoice settlement infrastructure
          </h2>
          <p className="mt-4 text-muted-foreground">
            Compile invoices into deterministic execution plans. Verify math and
            counterparty signals, then broadcast and reconcile settlement on
            Solana.
          </p>
        </div>

        {/* Tabs */}
        <div className="mt-12">
          <div className="flex justify-center space-x-4 border-b border-border">
            {snippets.map((tab, idx) => (
              <button
                key={tab.label}
                onClick={() => setActiveTab(idx)}
                className={`px-4 py-2 font-medium transition-colors duration-200 cursor-pointer ${
                  activeTab === idx
                    ? "border-b-2 border-primary text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Code Block */}
          {/* <div
            className={`mt-6 rounded-xl overflow-auto border border-border bg-muted transition-all duration-700 ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-8 opacity-0"
            }`}
          >
            <Highlight
              theme={themes.vsDark}
              code={snippets[activeTab].code}
              language={snippets[activeTab].lang}
            >
              {({ className, style, tokens, getLineProps, getTokenProps }) => (
                <pre className={`${className} p-6`} style={style}>
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
          </div> */}
          {/* Code Block */}
          <div
            className={`relative mt-6 max-w-3xl rounded-xl border border-border bg-muted overflow-hidden transition-all duration-700 ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-8 opacity-0"
            }`}
          >
            <Highlight
              theme={themes.vsDark}
              code={snippets[activeTab].code}
              language={snippets[activeTab].lang}
            >
              {({ className, style, tokens, getLineProps, getTokenProps }) => (
                <pre
                  className={`${className} max-w-full overflow-x-auto whitespace-pre text-xs sm:text-base p-4 sm:p-6`}
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
          <p
            className={`mt-4 text-sm text-center text-muted-foreground transition-all duration-700 ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-4 opacity-0"
            }`}
          >
            That&apos;s it. No infrastructure to manage.
          </p>
        </div>
      </div>
    </section>
  );
}
