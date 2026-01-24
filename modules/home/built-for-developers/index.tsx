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
    label: "JavaScript",
    lang: "javascript",
    code: `const res = await fetch('https://api.pdfbridge.io/v1/convert', {
  method: 'POST',
  headers: { 'x-api-key': 'your_key', 'Content-Type': 'application/json' },
  body: JSON.stringify({
    url: 'https://example.com',
    options: { format: 'A4', printBackground: true }
  })
});
const { statusUrl } = await res.json();`,
  },
  {
    label: "Python",
    lang: "python",
    code: `import requests
import json

headers = {'x-api-key': 'your_key', 'Content-Type': 'application/json'}
data = {
    "url": "https://example.com",
    "options": {"format": "A4", "printBackground": True}
}
res = requests.post('https://api.pdfbridge.io/v1/convert', headers=headers, json=data)
status_url = res.json()['statusUrl']`,
  },
  {
    label: "Go",
    lang: "go",
    code: `package main

import (
  "bytes"
  "encoding/json"
  "net/http"
  "io/ioutil"
  "log"
)

func main() {
  payload := map[string]interface{}{
    "url": "https://example.com",
    "options": map[string]interface{}{"format": "A4", "printBackground": true},
  }
  body, _ := json.Marshal(payload)
  req, _ := http.NewRequest("POST", "https://api.pdfbridge.io/v1/convert", bytes.NewBuffer(body))
  req.Header.Set("x-api-key", "your_key")
  req.Header.Set("Content-Type", "application/json")
  client := &http.Client{}
  res, _ := client.Do(req)
  defer res.Body.Close()
  content, _ := ioutil.ReadAll(res.Body)
  log.Println(string(content))
}`,
  },
  {
    label: "PHP",
    lang: "php",
    code: `<?php
$ch = curl_init('https://api.pdfbridge.io/v1/convert');
curl_setopt($ch, CURLOPT_HTTPHEADER, [
  'x-api-key: your_key',
  'Content-Type: application/json'
]);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
  'url' => 'https://example.com',
  'options' => ['format' => 'A4', 'printBackground' => true]
]));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$response = curl_exec($ch);
curl_close($ch);
$data = json_decode($response, true);
$statusUrl = $data['statusUrl'];`,
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
            Integrate in minutes, not days
          </h2>
          <p className="mt-4 text-muted-foreground">
            Simple API calls in the language you already use.
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
            className={`relative mt-6 max-w-full rounded-xl border border-border bg-muted overflow-hidden transition-all duration-700 ${
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
                  className={`${className} max-w-full overflow-x-auto whitespace-pre text-sm sm:text-base p-4 sm:p-6`}
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
        </div>
      </div>
    </section>
  );
}
