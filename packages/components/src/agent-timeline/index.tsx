"use client";

import * as React from "react";
import { cn } from "@buildora/utils";

export type AgentStep = {
  id: string;
  phase: "plan" | "act" | "observe";
  title: string;
  detail?: string;
  status: "done" | "running" | "queued";
};

const PHASE_LABEL: Record<AgentStep["phase"], string> = {
  plan: "Plan",
  act: "Act",
  observe: "Observe",
};

export function AgentTimeline({
  steps,
  className,
}: {
  steps?: AgentStep[];
  className?: string;
}) {
  const seed: AgentStep[] = steps ?? [
    { id: "1", phase: "plan", title: "Decompose request", detail: "3 sub-tasks", status: "done" },
    { id: "2", phase: "act", title: "search_registry", detail: "{ query: 'magnetic' }", status: "done" },
    { id: "3", phase: "act", title: "read_file", detail: "magnetic-button/index.tsx", status: "running" },
    { id: "4", phase: "observe", title: "Await tool result", status: "queued" },
  ];
  return (
    <ol className={cn("space-y-0", className)} aria-label="Agent timeline">
      {seed.map((s, i) => (
        <li key={s.id} className="relative flex gap-3 pb-5 last:pb-0">
          {i < seed.length - 1 && (
            <span aria-hidden className="absolute left-[7px] top-5 h-full w-px bg-[color-mix(in_oklab,var(--b-text)_10%,transparent)]" />
          )}
          <span
            aria-hidden
            className={cn(
              "mt-1.5 h-3.5 w-3.5 shrink-0 rounded-full border-2",
              s.status === "done" && "border-[color:var(--b-success)] bg-[#4fe08a]/30",
              s.status === "running" && "motion-safe:animate-pulse border-[#ff8a3d] bg-[#ff8a3d]/30",
              s.status === "queued" && "border-[color-mix(in_oklab,var(--b-border)_20%,transparent)] bg-transparent"
            )}
          />
          <div className="min-w-0 flex-1 rounded-xl border border-[color-mix(in_oklab,var(--b-border)_10%,transparent)] bg-[color-mix(in_oklab,var(--b-text)_3%,transparent)] px-3 py-2">
            <div className="flex items-center gap-2">
              <span className="rounded bg-[color-mix(in_oklab,var(--b-text)_10%,transparent)] px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-[color-mix(in_oklab,var(--b-text)_60%,transparent)]">
                {PHASE_LABEL[s.phase]}
              </span>
              <p className="truncate text-sm font-medium text-[color-mix(in_oklab,var(--b-text)_90%,transparent)]">{s.title}</p>
              <span className="ml-auto font-mono text-[11px] text-[color-mix(in_oklab,var(--b-text)_40%,transparent)]">{s.status}</span>
            </div>
            {s.detail && (
              <p className="mt-1 truncate font-mono text-xs text-[color-mix(in_oklab,var(--b-text)_50%,transparent)]">{s.detail}</p>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}

export default AgentTimeline;
