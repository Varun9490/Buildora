"use client";

import * as React from "react";
import { cn } from "../utils";

export type Approver = { id: string; name: string; state: "pending" | "approved" | "rejected" };

export function ApprovalWorkflow({
  initial = [
    { id: "a1", name: "ada", state: "approved" },
    { id: "a2", name: "grace", state: "pending" },
    { id: "a3", name: "you", state: "pending" },
  ] as Approver[],
  className,
}: {
  initial?: Approver[];
  className?: string;
}) {
  const [steps, setSteps] = React.useState(initial);
  const done = steps.filter((s) => s.state === "approved").length;
  return (
    <div className={cn("rounded-2xl border border-white/10 bg-[#0d0f16] p-4", className)}>
      <div className="mb-3 flex items-center justify-between text-sm">
        <span className="font-bold">Approval chain</span>
        <span className="font-mono text-xs text-white/50" role="status">{done}/{steps.length} approved</span>
      </div>
      <ol className="space-y-2" aria-label="Approvers">
        {steps.map((s) => (
          <li key={s.id} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.02] px-3 py-2">
            <span
              aria-hidden
              className={cn(
                "h-2.5 w-2.5 rounded-full",
                s.state === "approved" && "bg-[--b-success]",
                s.state === "rejected" && "bg-red-400",
                s.state === "pending" && "bg-white/20"
              )}
            />
            <span className="flex-1 text-sm text-white/85">{s.name}</span>
            <span className="font-mono text-[11px] text-white/40">{s.state}</span>
            {s.state === "pending" && (
              <span className="flex gap-1.5">
                <button
                  onClick={() => setSteps((xs) => xs.map((x) => (x.id === s.id ? { ...x, state: "approved" } : x)))}
                  className="rounded-lg bg-[--b-success] px-2.5 py-1 font-mono text-[11px] font-bold text-black"
                >
                  Approve
                </button>
                <button
                  onClick={() => setSteps((xs) => xs.map((x) => (x.id === s.id ? { ...x, state: "rejected" } : x)))}
                  className="rounded-lg border border-red-400/30 px-2.5 py-1 font-mono text-[11px] text-red-300"
                >
                  Reject
                </button>
              </span>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}

export default ApprovalWorkflow;
