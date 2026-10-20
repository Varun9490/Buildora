"use client";

import * as React from "react";
import { cn } from "@buildora/utils";

export type Column = { key: string; label: string; sortable?: boolean; };
export type Row = Record<string, React.ReactNode> & { id: string };

export function AdvancedTable({ columns, rows: initial, className, pageSize = 6 }: { columns?: Column[]; rows?: Row[]; className?: string; pageSize?: number }) {
  const cols: Column[] = columns ?? [
    { key: "component", label: "Component", sortable: true },
    { key: "category", label: "Category", sortable: true },
    { key: "framework", label: "React", sortable: true },
    { key: "difficulty", label: "Difficulty", sortable: true }
  ];
  const seed: Row[] = initial ?? [
    { id: "1", component: "Magnetic Button", category: "Creative", framework: "Full", difficulty: "beginner" },
    { id: "2", component: "Slingshot OTP", category: "Creative", framework: "Full", difficulty: "advanced" },
    { id: "3", component: "Streaming Chat", category: "AI / LLM", framework: "Full", difficulty: "intermediate" },
    { id: "4", component: "Advanced Table", category: "Data", framework: "Full", difficulty: "intermediate" },
    { id: "5", component: "Terminal", category: "Developer", framework: "Full", difficulty: "intermediate" },
    { id: "6", component: "Kanban", category: "Complex", framework: "Full", difficulty: "advanced" },
    { id: "7", component: "Pricing Table", category: "SaaS", framework: "Full", difficulty: "beginner" },
    { id: "8", component: "File Tree", category: "Developer", framework: "Full", difficulty: "beginner" }
  ];
  const [q, setQ] = React.useState("");
  const [sort, setSort] = React.useState<{ key: string; dir: 1 | -1 } | null>(null);
  const [page, setPage] = React.useState(0);

  const filtered = seed.filter((r) => !q || Object.values(r).join(" ").toLowerCase().includes(q.toLowerCase()));
  const sorted = sort ? [...filtered].sort((a, b) => String(a[sort.key] ?? "").localeCompare(String(b[sort.key] ?? "")) * sort.dir) : filtered;
  const pages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const view = sorted.slice(page * pageSize, page * pageSize + pageSize);

  return (
    <div className={cn("overflow-hidden rounded-2xl border border-[color-mix(in_oklab,var(--b-border)_10%,transparent)] bg-[var(--b-bg)]", className)}>
      <div className="flex items-center gap-2 border-b border-[color-mix(in_oklab,var(--b-border)_10%,transparent)] p-3">
        <label htmlFor="tbl-search" className="sr-only">Filter table</label>
        <input id="tbl-search" value={q} onChange={(e) => { setQ(e.target.value); setPage(0); }} placeholder="Filter…" className="w-full max-w-xs rounded-lg border border-[color-mix(in_oklab,var(--b-border)_10%,transparent)] bg-[color-mix(in_oklab,var(--b-text)_4%,transparent)] px-3 py-1.5 text-sm outline-none focus:border-[color:var(--b-accent)]" />
        <span className="ml-auto text-xs text-[color-mix(in_oklab,var(--b-text)_40%,transparent)]">{filtered.length} rows</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-[color-mix(in_oklab,var(--b-border)_10%,transparent)] text-xs uppercase tracking-wider text-[color-mix(in_oklab,var(--b-text)_40%,transparent)]">
              {cols.map((c) => (
                <th key={c.key} scope="col" className="px-4 py-2">
                  {c.sortable ? (
                    <button onClick={() => setSort((s) => (s?.key === c.key ? { key: c.key, dir: s.dir === 1 ? -1 : 1 } : { key: c.key, dir: 1 }))} className="inline-flex items-center gap-1 hover:text-[color:var(--b-text)]" aria-label={`Sort by ${c.label}`}>
                      {c.label}<span aria-hidden>{sort?.key === c.key ? (sort.dir === 1 ? "▲" : "▼") : "·"}</span>
                    </button>
                  ) : c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {view.map((r) => (
              <tr key={r.id} className="border-b border-[color-mix(in_oklab,var(--b-border)_5%,transparent)] last:border-0 hover:bg-[color-mix(in_oklab,var(--b-text)_3%,transparent)]">
                {cols.map((c) => <td key={c.key} className="px-4 py-2 text-[color-mix(in_oklab,var(--b-text)_85%,transparent)]">{r[c.key]}</td>)}
              </tr>
            ))}
            {view.length === 0 && <tr><td colSpan={cols.length} className="px-4 py-6 text-center text-[color-mix(in_oklab,var(--b-text)_40%,transparent)]">No rows match.</td></tr>}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between border-t border-[color-mix(in_oklab,var(--b-border)_10%,transparent)] p-2 text-xs">
        <button disabled={page === 0} onClick={() => setPage((p) => p - 1)} className="rounded-lg border border-[color-mix(in_oklab,var(--b-border)_10%,transparent)] px-2 py-1 disabled:opacity-40">Prev</button>
        <span className="text-[color-mix(in_oklab,var(--b-text)_50%,transparent)]">Page {page + 1} / {pages}</span>
        <button disabled={page >= pages - 1} onClick={() => setPage((p) => p + 1)} className="rounded-lg border border-[color-mix(in_oklab,var(--b-border)_10%,transparent)] px-2 py-1 disabled:opacity-40">Next</button>
      </div>
    </div>
  );
}

export default AdvancedTable;
