"use client";

import * as React from "react";
import { cn } from "@buildora/utils";

export type Clip = { id: string; track: string; label: string; start: number; len: number };

export function TimelineEditor({
  clips,
  className,
}: {
  clips?: Clip[];
  className?: string;
}) {
  const seed: Clip[] = clips ?? [
    { id: "k1", track: "hero", label: "enter", start: 0, len: 20 },
    { id: "k2", track: "hero", label: "magnetic", start: 24, len: 30 },
    { id: "k3", track: "cards", label: "reveal", start: 10, len: 40 },
  ];
  const tracks = [...new Set(seed.map((c) => c.track))];
  const [sel, setSel] = React.useState<string | null>(null);
  return (
    <div className={cn("overflow-hidden rounded-2xl border border-white/10 bg-[#0d0f16] p-3", className)}>
      <div className="space-y-2" role="group" aria-label="Timeline tracks">
        {tracks.map((t) => (
          <div key={t}>
            <p className="mb-1 font-mono text-[11px] uppercase tracking-wider text-white/40">{t}</p>
            <div className="relative h-10 rounded-lg bg-white/[0.03]" role="group" aria-label={`${t} clips`}>
              {seed
                .filter((c) => c.track === t)
                .map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setSel((s) => (s === c.id ? null : c.id))}
                    aria-pressed={sel === c.id}
                    className={cn(
                      "absolute top-1.5 h-7 rounded-md border px-2 font-mono text-[11px]",
                      sel === c.id
                        ? "border-[#d4ff4f] bg-[#d4ff4f]/20 text-[#d4ff4f]"
                        : "border-white/15 bg-[#9d8cff]/20 text-white/80 hover:bg-[#9d8cff]/30"
                    )}
                    style={{ left: `${c.start}%`, width: `${c.len}%` }}
                  >
                    {c.label}
                  </button>
                ))}
            </div>
          </div>
        ))}
      </div>
      <p className="mt-2 font-mono text-[11px] text-white/40" role="status">
        {sel ? `selected ${sel}` : "select a clip"}
      </p>
    </div>
  );
}

export default TimelineEditor;
