"use client";

import * as React from "react";
import { cn } from "@buildora/utils";

const METHODS = ["GET", "POST", "PUT", "DELETE"] as const;

export function ApiRequestBuilder({
  method: m = "GET",
  url: u = "/api/registry/magnetic-button",
  className,
}: {
  method?: (typeof METHODS)[number];
  url?: string;
  className?: string;
}) {
  const [method, setMethod] = React.useState(m);
  const [url, setUrl] = React.useState(u);
  const [body, setBody] = React.useState('{\n  "slug": "magnetic-button"\n}');
  const [sent, setSent] = React.useState(false);
  return (
    <div className={cn("overflow-hidden rounded-2xl border border-white/10 bg-[#0d0f16]", className)}>
      <div className="flex flex-wrap gap-2 border-b border-white/10 p-3">
        <label className="sr-only" htmlFor="api-method">Method</label>
        <select
          id="api-method"
          value={method}
          onChange={(e) => setMethod(e.target.value as (typeof METHODS)[number])}
          className="rounded-lg border border-white/10 bg-black/40 px-2 py-1.5 font-mono text-xs font-bold"
        >
          {METHODS.map((x) => (
            <option key={x}>{x}</option>
          ))}
        </select>
        <label className="sr-only" htmlFor="api-url">URL</label>
        <input
          id="api-url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="/api/…"
          className="min-w-40 flex-1 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 font-mono text-xs outline-none focus:border-[#d4ff4f]/60"
        />
        <button
          onClick={() => setSent(true)}
          className="rounded-lg bg-[--b-accent] px-4 py-1.5 font-mono text-xs font-bold text-[--b-accent-foreground]"
        >
          Send
        </button>
      </div>
      <div className="grid md:grid-cols-2">
        <div className="border-b border-white/10 p-3 md:border-b-0 md:border-r">
          <label htmlFor="api-body" className="mb-1 block font-mono text-[11px] text-white/40">Body</label>
          <textarea
            id="api-body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={5}
            spellCheck={false}
            className="w-full rounded-lg bg-black/40 p-2 font-mono text-xs text-white/85 outline-none"
          />
        </div>
        <div className="p-3" role="region" aria-label="Response" aria-live="polite">
          <p className="mb-1 font-mono text-[11px] text-white/40">Response</p>
          {!sent ? (
            <p className="font-mono text-xs text-white/35">Not sent yet.</p>
          ) : (
            <pre className="rounded-lg bg-[#4fe08a]/10 p-2 font-mono text-xs text-emerald-100">
              <code>{`200 OK · ${method} ${url}\n${body}`}</code>
            </pre>
          )}
        </div>
      </div>
    </div>
  );
}

export default ApiRequestBuilder;
