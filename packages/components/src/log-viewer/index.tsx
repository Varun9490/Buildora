"use client";

import * as React from "react";
import { cn } from "@buildora/utils";

export function LogViewer({ lines, className }: { lines?: string[]; className?: string }) {
  const seed = lines ?? ["[00:01] registry validated — 32 components", "[00:02] playground mounted (reduced-motion: no)", "[00:03] install @buildora/magnetic-button … ok", "[00:04] WARN large prop table virtualized", "[00:05] a11y audit passed"];
  const [filter, setFilter] = React.useState("");
  const view = seed.filter((l) => l.toLowerCase().includes(filter.toLowerCase()));
  return (
    <div className={cn("rounded-2xl border border-[color-mix(in_oklab,var(--b-border)_10%,transparent)] bg-black/50", className)} role="log" aria-label="Logs">
      <div className="border-b border-[color-mix(in_oklab,var(--b-border)_10%,transparent)] p-2"><input value={filter} onChange={(e) => setFilter(e.target.value)} placeholder="Filter logs…" aria-label="Filter logs" className="w-full rounded-lg border border-[color-mix(in_oklab,var(--b-border)_10%,transparent)] bg-[color-mix(in_oklab,var(--b-text)_4%,transparent)] px-2 py-1 font-mono text-xs outline-none" /></div>
      <div className="code-scroll max-h-44 overflow-auto p-3 font-mono text-xs">
        {view.map((l, i) => <p key={i} className={cn(l.includes("WARN") ? "text-[color:var(--b-warning)]" : l.includes("passed") || l.includes("ok") ? "text-[color:var(--b-success)]" : "text-[color-mix(in_oklab,var(--b-text)_70%,transparent)]")}>{l}</p>)}
        {view.length === 0 && <p className="text-[color-mix(in_oklab,var(--b-text)_40%,transparent)]">No lines.</p>}
      </div>
    </div>
  );
}

export default LogViewer;
