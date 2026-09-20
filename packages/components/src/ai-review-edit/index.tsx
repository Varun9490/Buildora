"use client";

import * as React from "react";
import { cn } from "@buildora/utils";

export function AIReviewEdit({
  before = "radius={80}",
  after = "radius={120}",
  onAccept,
  onReject,
  className,
}: {
  before?: string;
  after?: string;
  onAccept?: () => void;
  onReject?: () => void;
  className?: string;
}) {
  const [state, setState] = React.useState<"pending" | "accepted" | "rejected" | "edited">("pending");
  const [edit, setEdit] = React.useState(after);
  return (
    <div className={cn("overflow-hidden rounded-2xl border border-white/10 bg-[#0d0f16]", className)}>
      <div className="flex items-center justify-between border-b border-white/10 px-3 py-2">
        <p className="font-mono text-xs text-white/50">AI suggestion</p>
        <span
          className={cn(
            "rounded px-2 py-0.5 font-mono text-[11px]",
            state === "pending" && "bg-white/10 text-white/60",
            state === "accepted" && "bg-[#4fe08a]/20 text-[#4fe08a]",
            state === "rejected" && "bg-red-500/20 text-red-300",
            state === "edited" && "bg-[#9d8cff]/20 text-[#9d8cff]"
          )}
          role="status"
        >
          {state}
        </span>
      </div>
      <div className="grid md:grid-cols-2">
        <div className="border-b border-white/10 p-3 md:border-b-0 md:border-r" aria-label="Before">
          <p className="mb-1 font-mono text-[11px] uppercase tracking-wider text-red-300/70">Before</p>
          <pre className="rounded-lg bg-red-500/10 p-2 font-mono text-xs text-red-200">− {before}</pre>
        </div>
        <div className="p-3" aria-label="After">
          <p className="mb-1 font-mono text-[11px] uppercase tracking-wider text-[#4fe08a]/80">After</p>
          <label htmlFor="ai-review-edit-field" className="sr-only">
            Edit suggestion
          </label>
          <textarea
            id="ai-review-edit-field"
            value={edit}
            onChange={(e) => {
              setEdit(e.target.value);
              setState("edited");
            }}
            rows={2}
            className="w-full rounded-lg bg-[#4fe08a]/10 p-2 font-mono text-xs text-emerald-100 outline-none"
          />
        </div>
      </div>
      <div className="flex gap-2 border-t border-white/10 p-2">
        <button
          onClick={() => {
            setState("accepted");
            onAccept?.();
          }}
          className="flex-1 rounded-lg bg-[#4fe08a] px-3 py-1.5 text-xs font-bold text-black"
        >
          Accept
        </button>
        <button
          onClick={() => {
            setState("edited");
          }}
          className="flex-1 rounded-lg border border-white/15 px-3 py-1.5 text-xs text-white/80 hover:bg-white/5"
        >
          Edit
        </button>
        <button
          onClick={() => {
            setState("rejected");
            onReject?.();
          }}
          className="flex-1 rounded-lg border border-red-400/30 px-3 py-1.5 text-xs text-red-300 hover:bg-red-500/10"
        >
          Reject
        </button>
      </div>
    </div>
  );
}

export default AIReviewEdit;
