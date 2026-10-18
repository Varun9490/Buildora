"use client";

import * as React from "react";
import { cn } from "@buildora/utils";

/* ─────────────────────────────────────────────────────────────
   AI REVIEW + EDIT — the diff card, fully tokenized:

   - every color rides the Buildora tokens (danger for "−",
     success for "+" — honest palette, no hardcoded hexes)
   - the before/after surfaces share the code panel language,
     and the mono panel renders with the site font stack
   - Accept / Edit / Reject map to the three honest outcomes,
     plus undo support via the notification channel of callers
   ───────────────────────────────────────────────────────────── */

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
    <div className={cn("overflow-hidden rounded-2xl border border-[color:var(--b-border)] bg-[color:var(--b-panel)]", className)}>
      <div className="flex items-center justify-between border-b border-[color:var(--b-border)] px-3 py-2">
        <p className="font-mono text-xs text-[color:var(--b-text-secondary)]">AI suggestion</p>
        <span
          className={cn(
            "rounded px-2 py-0.5 font-mono text-[11px]",
            state === "pending" && "bg-[color:color-mix(in_oklab,var(--b-text)_10%,transparent)] text-[color:var(--b-text-secondary)]",
            state === "accepted" && "bg-[color:color-mix(in_oklab,var(--b-success)_18%,transparent)] text-[color:var(--b-success)]",
            state === "rejected" && "bg-[color:color-mix(in_oklab,var(--b-danger)_18%,transparent)] text-[color:var(--b-danger)]",
            state === "edited" && "bg-[color:color-mix(in_oklab,var(--b-iris)_18%,transparent)] text-[color:var(--b-iris)]"
          )}
          role="status"
        >
          {state}
        </span>
      </div>
      <div className="grid md:grid-cols-2">
        <div className="border-b border-[color:var(--b-border)] p-3 md:border-b-0 md:border-r" aria-label="Before">
          <p className="mb-1 font-mono text-[11px] uppercase tracking-wider text-[color:var(--b-danger)]/80">Before</p>
          <pre className="rounded-lg bg-[color:color-mix(in_oklab,var(--b-danger)_9%,transparent)] p-2 font-mono text-xs text-[color:var(--b-danger)]">− {before}</pre>
        </div>
        <div className="p-3" aria-label="After">
          <p className="mb-1 font-mono text-[11px] uppercase tracking-wider text-[color:var(--b-success)]/80">After</p>
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
            className="w-full rounded-lg bg-[color:color-mix(in_oklab,var(--b-success)_9%,transparent)] p-2 font-mono text-xs text-[color:var(--b-text)] outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--b-ring)]"
          />
        </div>
      </div>
      <div className="flex gap-2 border-t border-[color:var(--b-border)] p-2">
        <button
          onClick={() => {
            setState("accepted");
            onAccept?.();
          }}
          className="flex-1 rounded-lg bg-[color:var(--b-success)] px-3 py-1.5 text-xs font-bold text-[color:var(--b-success-foreground,black)] transition-transform active:scale-[0.97]"
        >
          Accept
        </button>
        <button
          onClick={() => {
            setState("edited");
          }}
          className="flex-1 rounded-lg border border-[color:var(--b-border)] px-3 py-1.5 text-xs text-[color:var(--b-text-secondary)] transition-colors hover:border-[color:var(--b-border-hover)] hover:text-[color:var(--b-text)] hover:bg-[color:color-mix(in_oklab,var(--b-text)_5%,transparent)]"
        >
          Edit
        </button>
        <button
          onClick={() => {
            setState("rejected");
            onReject?.();
          }}
          className="flex-1 rounded-lg border border-[color:color-mix(in_oklab,var(--b-danger)_35%,transparent)] px-3 py-1.5 text-xs text-[color:var(--b-danger)] transition-colors hover:bg-[color:color-mix(in_oklab,var(--b-danger)_10%,transparent)]"
        >
          Reject
        </button>
      </div>
    </div>
  );
}

export default AIReviewEdit;
