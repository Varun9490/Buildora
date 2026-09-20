"use client";

import * as React from "react";
import { cn } from "../utils";

export type DiffLine = { n: number; text: string; kind: "same" | "add" | "del" };

function diffLines(before: string, after: string): { left: DiffLine[]; right: DiffLine[] } {
  const b = before.split("\n");
  const a = after.split("\n");
  const max = Math.max(b.length, a.length);
  const left: DiffLine[] = [];
  const right: DiffLine[] = [];
  for (let i = 0; i < max; i++) {
    const bl = b[i] ?? "";
    const al = a[i] ?? "";
    if (bl === al) {
      left.push({ n: i + 1, text: bl, kind: "same" });
      right.push({ n: i + 1, text: al, kind: "same" });
    } else {
      if (bl) left.push({ n: i + 1, text: bl, kind: "del" });
      if (al) right.push({ n: i + 1, text: al, kind: "add" });
    }
  }
  return { left, right };
}

export function DiffViewer({
  before = "strength={0.2}\nradius={80}",
  after = "strength={0.35}\nradius={120}",
  className,
}: {
  before?: string;
  after?: string;
  className?: string;
}) {
  const { left, right } = React.useMemo(() => diffLines(before, after), [before, after]);
  const col = (lines: DiffLine[], label: string) => (
    <div aria-label={label}>
      {lines.map((l, i) => (
        <div
          key={i}
          className={cn(
            "flex gap-2 px-2 py-0.5 font-mono text-xs",
            l.kind === "add" && "bg-[#4fe08a]/10 text-emerald-100",
            l.kind === "del" && "bg-red-500/10 text-red-200",
            l.kind === "same" && "text-white/60"
          )}
        >
          <span className="w-6 shrink-0 text-right text-white/25">{l.n}</span>
          <span className="whitespace-pre-wrap break-all">
            {l.kind === "add" ? `+ ${l.text}` : l.kind === "del" ? `− ${l.text}` : `  ${l.text}`}
          </span>
        </div>
      ))}
    </div>
  );
  return (
    <div className={cn("overflow-hidden rounded-2xl border border-white/10 bg-[#0a0c11]", className)}>
      <div className="grid md:grid-cols-2">
        <div className="border-b border-white/10 md:border-b-0 md:border-r">
          <p className="border-b border-white/10 px-3 py-1.5 font-mono text-[11px] text-white/40">before</p>
          {col(left, "Before")}
        </div>
        <div>
          <p className="border-b border-white/10 px-3 py-1.5 font-mono text-[11px] text-white/40">after</p>
          {col(right, "After")}
        </div>
      </div>
    </div>
  );
}

export default DiffViewer;
