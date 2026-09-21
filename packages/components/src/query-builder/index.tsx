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
    <div className={cn("rounded-2xl border border-[color-mix(in_oklab,var(--b-border)_10%,transparent)] bg-[var(--b-bg)] p-3", className)}>
      <ul className="space-y-2" aria-label="Query filters">
        {filters.map((f) => (
          <li key={f.id} className="flex flex-wrap items-center gap-2 rounded-xl border border-[color-mix(in_oklab,var(--b-border)_10%,transparent)] bg-[color-mix(in_oklab,var(--b-text)_3%,transparent)] p-2">
            <label className="sr-only" htmlFor={`${f.id}-field`}>Field</label>
            <select
              id={`${f.id}-field`}
              value={f.field}
              onChange={(e) => setFilters((fs) => fs.map((x) => (x.id === f.id ? { ...x, field: e.target.value } : x)))}
              className="rounded-lg border border-[color-mix(in_oklab,var(--b-border)_10%,transparent)] bg-black/40 px-2 py-1 font-mono text-xs"
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
              className="rounded-lg border border-[color-mix(in_oklab,var(--b-border)_10%,transparent)] bg-black/40 px-2 py-1 font-mono text-xs"
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
              className="min-w-24 flex-1 rounded-lg border border-[color-mix(in_oklab,var(--b-border)_10%,transparent)] bg-[color-mix(in_oklab,var(--b-text)_4%,transparent)] px-2 py-1 font-mono text-xs outline-none"
            />
            <button
              onClick={() => setFilters((fs) => fs.filter((x) => x.id !== f.id))}
              aria-label={`Remove filter ${f.field} ${f.op} ${f.value}`}
              className="rounded px-1.5 text-[color-mix(in_oklab,var(--b-text)_40%,transparent)] hover:bg-[color-mix(in_oklab,var(--b-text)_10%,transparent)] hover:text-[color:var(--b-text)]"
            >
              ×
            </button>
          </li>
        ))}
      </ul>
      <div className="mt-2 flex items-center gap-2">
        <button onClick={add} className="rounded-lg border border-[color-mix(in_oklab,var(--b-border)_10%,transparent)] px-3 py-1.5 text-xs text-[color-mix(in_oklab,var(--b-text)_70%,transparent)] hover:bg-[color-mix(in_oklab,var(--b-text)_5%,transparent)]">
          + Add filter
        </button>
        <span className="font-mono text-[11px] text-[color-mix(in_oklab,var(--b-text)_40%,transparent)]" role="status">
          {filters.length} filter{filters.length === 1 ? "" : "s"}
        </span>
      </div>
    </div>
  );
}

export default QueryBuilder;
