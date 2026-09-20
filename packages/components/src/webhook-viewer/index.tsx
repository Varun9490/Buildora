"use client";

import * as React from "react";
import { cn } from "@buildora/utils";

export type WebhookEvent = { id: string; name: string; status: number; at: string; payload: unknown };

export function WebhookViewer({
  events,
  className,
}: {
  events?: WebhookEvent[];
  className?: string;
}) {
  const seed: WebhookEvent[] = events ?? [
    { id: "w1", name: "registry.install", status: 200, at: "12:01:04", payload: { component: "magnetic-button", ok: true } },
    { id: "w2", name: "registry.validate", status: 200, at: "12:02:31", payload: { total: 54, failed: 0 } },
    { id: "w3", name: "deploy.failed", status: 500, at: "12:04:12", payload: { error: "timeout", retryable: true } },
  ];
  const [sel, setSel] = React.useState(seed[0]?.id);
  const cur = seed.find((e) => e.id === sel);
  return (
    <div className={cn("grid gap-2 md:grid-cols-[1fr_1.2fr]", className)}>
      <ul className="space-y-1.5" aria-label="Webhook events">
        {seed.map((e) => (
          <li key={e.id}>
            <button
              onClick={() => setSel(e.id)}
              aria-current={e.id === sel}
              className={cn(
                "flex w-full items-center gap-2 rounded-xl border px-3 py-2 text-left font-mono text-xs",
                e.id === sel ? "border-[#d4ff4f]/50 bg-[#d4ff4f]/[0.06]" : "border-white/10 bg-white/[0.02] hover:bg-white/[0.05]"
              )}
            >
              <span className={cn("rounded px-1.5 py-0.5", e.status < 300 ? "bg-[#4fe08a]/20 text-[#4fe08a]" : "bg-red-500/20 text-red-300")}>
                {e.status}
              </span>
              <span className="truncate text-white/85">{e.name}</span>
              <span className="ml-auto text-white/35">{e.at}</span>
            </button>
          </li>
        ))}
      </ul>
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0a0c11]" aria-label="Payload" role="region">
        <p className="border-b border-white/10 px-3 py-1.5 font-mono text-[11px] text-white/40">
          {cur ? `${cur.name} · ${cur.at}` : "No event"}
        </p>
        <pre className="max-h-48 overflow-auto p-3 font-mono text-xs text-[#c9d1ff]">
          <code>{cur ? JSON.stringify(cur.payload, null, 2) : "{}"}</code>
        </pre>
      </div>
    </div>
  );
}

export default WebhookViewer;
