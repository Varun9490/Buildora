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
            <span aria-hidden className="absolute left-[7px] top-5 h-full w-px bg-white/10" />
          )}
          <span
            aria-hidden
            className={cn(
              "mt-1.5 h-3.5 w-3.5 shrink-0 rounded-full border-2",
              s.status === "done" && "border-[--b-success] bg-[#4fe08a]/30",
              s.status === "running" && "motion-safe:animate-pulse border-[#ff8a3d] bg-[#ff8a3d]/30",
              s.status === "queued" && "border-white/20 bg-transparent"
            )}
          />
          <div className="min-w-0 flex-1 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2">
            <div className="flex items-center gap-2">
              <span className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-white/60">
                {PHASE_LABEL[s.phase]}
              </span>
              <p className="truncate text-sm font-medium text-white/90">{s.title}</p>
              <span className="ml-auto font-mono text-[11px] text-white/40">{s.status}</span>
            </div>
            {s.detail && (
              <p className="mt-1 truncate font-mono text-xs text-white/50">{s.detail}</p>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}

export default AgentTimeline;
