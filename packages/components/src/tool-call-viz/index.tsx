"use client";

import * as React from "react";
import { cn } from "@buildora/utils";
import { useReducedMotion } from "@buildora/hooks";

export function ToolCallViz({ calls = [{ name: "search_registry", args: "{ query: 'magnetic' }", status: "done" }, { name: "read_file", args: "magnetic-button/index.tsx", status: "running" }], className }: { calls?: { name: string; args: string; status: string }[]; className?: string }) {
  return (
    <ol className={cn("space-y-2", className)} aria-label="Tool calls">
      {calls.map((c) => (
        <li key={c.name} className="flex items-center gap-3 rounded-xl border border-[color-mix(in_oklab,var(--b-border)_10%,transparent)] bg-[color-mix(in_oklab,var(--b-bg)_30%,transparent)] px-3 py-2 font-mono text-xs">
          <span className={cn("h-2 w-2 rounded-full", c.status === "done" ? "bg-[color:var(--b-success)]" : "motion-safe:animate-pulse bg-[color:var(--b-warning)]")} aria-hidden />
          <span className="font-bold text-[color:var(--b-iris)]">{c.name}</span>
          <span className="truncate text-[color-mix(in_oklab,var(--b-text)_50%,transparent)]">{c.args}</span>
          <span className="ml-auto text-[color-mix(in_oklab,var(--b-text)_40%,transparent)]">{c.status}</span>
        </li>
      ))}
    </ol>
  );
}

export default ToolCallViz;
