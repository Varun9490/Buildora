"use client";

import * as React from "react";
import { cn } from "@buildora/utils";

export type Filter = { id: string; field: string; op: string; value: string };

const FIELDS = ["category", "difficulty", "framework", "tag"];
const OPS = ["is", "is not", "contains"];

export function QueryBuilder({
  initial = [{ id: "f1", field: "category", op: "is", value: "creative" }],
  className,
}: {
  initial?: Filter[];
  className?: string;
}) {
  const [filters, setFilters] = React.useState<Filter[]>(initial);
  const add = () =>
    setFilters((f) => [...f, { id: `f-${Date.now()}`, field: FIELDS[0], op: OPS[0], value: "" }]);
  return (
    <div className={cn("rounded-2xl border border-white/10 bg-[#0d0f16] p-3", className)}>
      <ul className="space-y-2" aria-label="Query filters">
        {filters.map((f) => (
          <li key={f.id} className="flex flex-wrap items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] p-2">
            <label className="sr-only" htmlFor={`${f.id}-field`}>Field</label>
            <select
              id={`${f.id}-field`}
              value={f.field}
              onChange={(e) => setFilters((fs) => fs.map((x) => (x.id === f.id ? { ...x, field: e.target.value } : x)))}
              className="rounded-lg border border-white/10 bg-black/40 px-2 py-1 font-mono text-xs"
            >
              {FIELDS.map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>
            <label className="sr-only" htmlFor={`${f.id}-op`}>Operator</label>
            <select
              id={`${f.id}-op`}
              value={f.op}
              onChange={(e) => setFilters((fs) => fs.map((x) => (x.id === f.id ? { ...x, op: e.target.value } : x)))}
              className="rounded-lg border border-white/10 bg-black/40 px-2 py-1 font-mono text-xs"
            >
              {OPS.map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>
            <label className="sr-only" htmlFor={`${f.id}-value`}>Value</label>
            <input
              id={`${f.id}-value`}
              value={f.value}
              onChange={(e) => setFilters((fs) => fs.map((x) => (x.id === f.id ? { ...x, value: e.target.value } : x)))}
              placeholder="value"
              className="min-w-24 flex-1 rounded-lg border border-white/10 bg-white/[0.04] px-2 py-1 font-mono text-xs outline-none"
            />
            <button
              onClick={() => setFilters((fs) => fs.filter((x) => x.id !== f.id))}
              aria-label={`Remove filter ${f.field} ${f.op} ${f.value}`}
              className="rounded px-1.5 text-white/40 hover:bg-white/10 hover:text-white"
            >
              ×
            </button>
          </li>
        ))}
      </ul>
      <div className="mt-2 flex items-center gap-2">
        <button onClick={add} className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-white/70 hover:bg-white/5">
          + Add filter
        </button>
        <span className="font-mono text-[11px] text-white/40" role="status">
          {filters.length} filter{filters.length === 1 ? "" : "s"}
        </span>
      </div>
    </div>
  );
}

export default QueryBuilder;
