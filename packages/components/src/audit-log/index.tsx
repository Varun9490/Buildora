"use client";

import * as React from "react";
import { cn } from "../utils";

export type AuditEvent = { id: string; at: string; actor: string; action: string; severity: "info" | "warn" | "critical" };

export function AuditLog({
  events,
  className,
}: {
  events?: AuditEvent[];
  className?: string;
}) {
  const seed: AuditEvent[] = events ?? [
    { id: "e1", at: "12:01", actor: "you", action: "installed @buildora/magnetic-button", severity: "info" },
    { id: "e2", at: "12:03", actor: "ci", action: "registry validation passed (54)", severity: "info" },
    { id: "e3", at: "12:05", actor: "ada", action: "flagged framework claim on particle-field", severity: "warn" },
    { id: "e4", at: "12:07", actor: "system", action: "blocked unsigned registry publish", severity: "critical" },
  ];
  const [q, setQ] = React.useState("");
  const view = seed.filter((e) => `${e.actor} ${e.action}`.toLowerCase().includes(q.toLowerCase()));
  return (
    <div className={cn("overflow-hidden rounded-2xl border border-white/10 bg-[#0d0f16]", className)}>
      <div className="border-b border-white/10 p-2">
        <label htmlFor="audit-filter" className="sr-only">Filter audit log</label>
        <input
          id="audit-filter"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Filter events…"
          className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 font-mono text-xs outline-none"
        />
      </div>
      <ol className="max-h-56 overflow-auto" aria-label="Audit events">
        {view.map((e) => (
          <li key={e.id} className="flex items-center gap-3 border-b border-white/5 px-4 py-2 font-mono text-xs last:border-0">
            <span className="text-white/35">{e.at}</span>
            <span
              className={cn(
                "rounded px-1.5 py-0.5 uppercase",
                e.severity === "info" && "bg-white/10 text-white/60",
                e.severity === "warn" && "bg-[#ff8a3d]/20 text-[#ff8a3d]",
                e.severity === "critical" && "bg-red-500/20 text-red-300"
              )}
            >
              {e.severity}
            </span>
            <span className="truncate text-white/80">
              <span className="text-[--b-iris]">{e.actor}</span> — {e.action}
            </span>
          </li>
        ))}
        {view.length === 0 && <li className="px-4 py-6 text-center font-mono text-xs text-white/40">No events.</li>}
      </ol>
    </div>
  );
}

export default AuditLog;
