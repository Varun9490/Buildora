"use client";

import * as React from "react";
import { cn } from "../utils";

export type WFStep = { id: string; label: string };

export function WorkflowBuilder({
  steps: ss,
  className,
}: {
  steps?: WFStep[];
  className?: string;
}) {
  const [steps, setSteps] = React.useState<WFStep[]>(
    ss ?? [
      { id: "s1", label: "audit" },
      { id: "s2", label: "implement" },
      { id: "s3", label: "test" },
    ]
  );
  const [active, setActive] = React.useState(0);
  return (
    <div className={cn("rounded-2xl border border-white/10 bg-[#0d0f16] p-4", className)}>
      <ol className="flex flex-wrap items-center gap-2" aria-label="Workflow steps">
        {steps.map((s, i) => (
          <li key={s.id} className="flex items-center gap-2">
            <button
              onClick={() => setActive(i)}
              aria-current={i === active ? "step" : undefined}
              className={cn(
                "flex h-8 items-center gap-2 rounded-full border px-3 font-mono text-xs",
                i === active
                  ? "border-[--b-accent] bg-[--b-accent] font-bold text-[--b-accent-foreground]"
                  : i < active
                    ? "border-[#4fe08a]/40 bg-[#4fe08a]/10 text-[--b-success]"
                    : "border-white/15 text-white/60 hover:bg-white/5"
              )}
            >
              <span>{i + 1}</span> {s.label}
            </button>
            {i < steps.length - 1 && <span aria-hidden className="text-white/25">→</span>}
          </li>
        ))}
      </ol>
      <div className="mt-3 flex gap-2">
        <button
          onClick={() => setSteps((s) => [...s, { id: `s-${Date.now()}`, label: `step-${s.length + 1}` }])}
          className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-white/70 hover:bg-white/5"
        >
          + Add step
        </button>
        <button
          onClick={() => setActive((a) => Math.min(steps.length - 1, a + 1))}
          disabled={active >= steps.length - 1}
          className="rounded-lg bg-[--b-accent] px-3 py-1.5 text-xs font-bold text-[--b-accent-foreground] disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default WorkflowBuilder;
