"use client";

import * as React from "react";
import { cn } from "../utils";

export function SpreadsheetGrid({
  rows = 5,
  cols = 4,
  initial,
  className,
}: {
  rows?: number;
  cols?: number;
  initial?: string[][];
  className?: string;
}) {
  const seed = React.useMemo(() => {
    if (initial) return initial;
    const base = ["Component", "Category", "React", "Difficulty"];
    return Array.from({ length: rows }, (_, r) =>
      Array.from({ length: cols }, (_, c) =>
        r === 0 ? base[c] ?? `C${c + 1}` : `R${r}C${c + 1}`
      )
    );
  }, [rows, cols, initial]);
  const [data, setData] = React.useState<string[][]>(seed);
  const colLabel = (i: number) => String.fromCharCode(65 + i);
  return (
    <div className={cn("overflow-auto rounded-2xl border border-white/10 bg-[#0d0f16]", className)}>
      <table className="w-full border-collapse text-sm" aria-label="Spreadsheet grid">
        <thead>
          <tr>
            <th scope="col" className="w-10 border border-white/10 bg-white/[0.04] px-2 py-1 font-mono text-xs text-white/40" />
            {Array.from({ length: data[0]?.length ?? 0 }, (_, c) => (
              <th
                key={c}
                scope="col"
                className="border border-white/10 bg-white/[0.04] px-2 py-1 font-mono text-xs text-white/50"
              >
                {colLabel(c)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, r) => (
            <tr key={r}>
              <th
                scope="row"
                className="border border-white/10 bg-white/[0.04] px-2 py-1 font-mono text-xs text-white/40"
              >
                {r + 1}
              </th>
              {row.map((cell, c) => (
                <td key={c} className="border border-white/10 p-0">
                  <label className="sr-only" htmlFor={`sheet-${r}-${c}`}>
                    Cell {colLabel(c)}{r + 1}
                  </label>
                  <input
                    id={`sheet-${r}-${c}`}
                    value={cell}
                    onChange={(e) =>
                      setData((d) => d.map((rr, ri) => (ri === r ? rr.map((cc, ci) => (ci === c ? e.target.value : cc)) : rr)))
                    }
                    className={cn(
                      "w-full bg-transparent px-2 py-1.5 text-xs outline-none focus:bg-[#d4ff4f]/10",
                      r === 0 ? "font-bold text-white" : "text-white/80"
                    )}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default SpreadsheetGrid;
