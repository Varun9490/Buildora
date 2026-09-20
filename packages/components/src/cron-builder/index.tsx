"use client";

import * as React from "react";
import { cn } from "../utils";

const PRESETS: Record<string, string> = {
  "Every 5 min": "*/5 * * * *",
  Hourly: "0 * * * *",
  "Daily 09:00": "0 9 * * *",
  "Weekly Mon": "0 9 * * 1",
};

export function CronBuilder({
  initial = "0 9 * * *",
  onChange,
  className,
}: {
  initial?: string;
  onChange?: (expr: string) => void;
  className?: string;
}) {
  const [expr, setExpr] = React.useState(initial);
  const parts = expr.trim().split(/\s+/);
  const human =
    expr === "*/5 * * * *" ? "Every 5 minutes" :
    expr === "0 * * * *" ? "Every hour" :
    expr === "0 9 * * *" ? "Daily at 09:00" :
    expr === "0 9 * * 1" ? "Weekly on Monday at 09:00" :
    parts.length === 5 ? `Custom schedule (${parts.join(" ")})` : "Invalid cron — need 5 fields";
  return (
    <div className={cn("rounded-2xl border border-white/10 bg-[#0d0f16] p-4", className)}>
      <div className="flex flex-wrap gap-1.5" aria-label="Presets">
        {Object.entries(PRESETS).map(([label, e]) => (
          <button
            key={label}
            onClick={() => {
              setExpr(e);
              onChange?.(e);
            }}
            aria-pressed={expr === e}
            className={cn(
              "rounded-lg border px-2.5 py-1 font-mono text-[11px]",
              expr === e ? "border-[--b-accent] bg-[#d4ff4f]/10 text-[--b-accent]" : "border-white/10 text-white/60 hover:bg-white/5"
            )}
          >
            {label}
          </button>
        ))}
      </div>
      <label htmlFor="cron-expr" className="mb-1 mt-3 block font-mono text-[11px] text-white/40">Cron expression</label>
      <input
        id="cron-expr"
        value={expr}
        onChange={(e) => {
          setExpr(e.target.value);
          onChange?.(e.target.value);
        }}
        spellCheck={false}
        placeholder="0 9 * * *"
        className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 font-mono text-sm outline-none focus:border-[#d4ff4f]/60"
      />
      <p className="mt-2 font-mono text-xs text-[--b-success]" role="status">{human}</p>
    </div>
  );
}

export default CronBuilder;
