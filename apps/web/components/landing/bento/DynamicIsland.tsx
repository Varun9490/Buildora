"use client";

import * as React from "react";
import { DynamicIsland as Island, type DynamicIslandStatus } from "@buildora/components";
import { cn } from "@buildora/utils";

/**
 * The homepage showcase now renders the shipped component, so the demo on the
 * site is exactly what you install. This file only adds the state switcher.
 */
const STATES: Array<{ id: DynamicIslandStatus; label: string }> = [
  { id: "idle", label: "Idle" },
  { id: "timer", label: "Timer" },
  { id: "music", label: "Music" },
  { id: "faceid", label: "Face ID" },
  { id: "record", label: "Recording" },
  { id: "think", label: "AI thinking" },
];

export function DynamicIslandStage() {
  const [status, setStatus] = React.useState<DynamicIslandStatus>("idle");
  const [seconds, setSeconds] = React.useState(8);

  React.useEffect(() => {
    if (status !== "timer") return;
    setSeconds(8);
    const id = setInterval(() => setSeconds((s) => (s <= 1 ? 8 : s - 1)), 1000);
    return () => clearInterval(id);
  }, [status]);

  return (
    <div className="flex h-[340px] w-full flex-col items-center pt-12">
      <Island status={status} seconds={seconds} totalSeconds={8} />

      <div className="mt-10" role="tablist" aria-label="Dynamic island state">
        <div className="flex flex-wrap justify-center gap-1 rounded-full border border-[color:var(--b-border)] p-0.5">
          {STATES.map((s) => {
            const selected = status === s.id;
            return (
              <button
                key={s.id}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => setStatus(s.id)}
                className={cn(
                  "relative rounded-full px-3 py-1.5 text-[11px] transition-colors",
                  selected
                    ? "font-medium text-[color:var(--b-text)]"
                    : "text-[color:var(--b-muted)] hover:text-[color:var(--b-text-secondary)]"
                )}
              >
                {selected && (
                  <span className="absolute inset-0 rounded-full bg-[color:color-mix(in_oklab,var(--b-text)_8%,transparent)]" />
                )}
                <span className="relative z-10">{s.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default DynamicIslandStage;
