"use client";

import * as React from "react";
import { cn } from "@buildora/utils";

export type Flag = { id: string; name: string; on: boolean; rollout: string };

export function FeatureFlags({
  initial = [
    { id: "f1", name: "magnetic-v2", on: true, rollout: "50%" },
    { id: "f2", name: "otp-slingshot", on: false, rollout: "0%" },
    { id: "f3", name: "pattern-notices", on: true, rollout: "100%" },
  ],
  className,
}: {
  initial?: Flag[];
  className?: string;
}) {
  const [flags, setFlags] = React.useState(initial);
  return (
    <ul className={cn("space-y-1.5", className)} aria-label="Feature flags">
      {flags.map((f) => (
        <li key={f.id} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.02] px-3 py-2">
          <button
            role="switch"
            aria-checked={f.on}
            aria-label={f.name}
            onClick={() => setFlags((fs) => fs.map((x) => (x.id === f.id ? { ...x, on: !x.on } : x)))}
            className={cn("relative h-6 w-11 shrink-0 rounded-full transition-colors", f.on ? "bg-[#d4ff4f]" : "bg-white/15")}
          >
            <span className={cn("absolute top-0.5 h-5 w-5 rounded-full transition-all", f.on ? "left-[22px] bg-black" : "left-0.5 bg-white")} />
          </button>
          <span className="min-w-0 flex-1 truncate font-mono text-sm text-white/85">{f.name}</span>
          <span className="font-mono text-[11px] text-white/40">{f.rollout}</span>
        </li>
      ))}
    </ul>
  );
}

export default FeatureFlags;
