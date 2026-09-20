"use client";

import * as React from "react";
import { cn } from "../utils";

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
    <div className={cn("overflow-hidden rounded-2xl border border-white/10 bg-[#0d0f16]", className)}>
      <div className="flex items-center gap-2 border-b border-white/10 p-3">
        <label htmlFor="tbl-search" className="sr-only">Filter table</label>
        <input id="tbl-search" value={q} onChange={(e) => { setQ(e.target.value); setPage(0); }} placeholder="Filter…" className="w-full max-w-xs rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 text-sm outline-none focus:border-[--b-accent]" />
        <span className="ml-auto text-xs text-white/40">{filtered.length} rows</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-white/10 text-xs uppercase tracking-wider text-white/40">
              {cols.map((c) => (
                <th key={c.key} scope="col" className="px-4 py-2">
                  {c.sortable ? (
                    <button onClick={() => setSort((s) => (s?.key === c.key ? { key: c.key, dir: s.dir === 1 ? -1 : 1 } : { key: c.key, dir: 1 }))} className="inline-flex items-center gap-1 hover:text-white" aria-label={`Sort by ${c.label}`}>
                      {c.label}<span aria-hidden>{sort?.key === c.key ? (sort.dir === 1 ? "▲" : "▼") : "·"}</span>
                    </button>
                  ) : c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {view.map((r) => (
              <tr key={r.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.03]">
                {cols.map((c) => <td key={c.key} className="px-4 py-2 text-white/85">{r[c.key]}</td>)}
              </tr>
            ))}
            {view.length === 0 && <tr><td colSpan={cols.length} className="px-4 py-6 text-center text-white/40">No rows match.</td></tr>}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between border-t border-white/10 p-2 text-xs">
        <button disabled={page === 0} onClick={() => setPage((p) => p - 1)} className="rounded-lg border border-white/10 px-2 py-1 disabled:opacity-40">Prev</button>
        <span className="text-white/50">Page {page + 1} / {pages}</span>
        <button disabled={page >= pages - 1} onClick={() => setPage((p) => p + 1)} className="rounded-lg border border-white/10 px-2 py-1 disabled:opacity-40">Next</button>
      </div>
    </div>
  );
}

export function JSONViewer({ data, className }: { data?: unknown; className?: string }) {
  const obj = data ?? { id: "magnetic-button", category: "creative", props: { strength: 0.35, radius: 120 }, a11y: { keyboard: true, screenReader: true, reducedMotion: true } };
  const [collapsed, setCollapsed] = React.useState(false);
  const text = JSON.stringify(obj, null, 2);
  return (
    <div className={cn("overflow-hidden rounded-2xl border border-white/10 bg-[#0a0c11]", className)}>
      <div className="flex items-center justify-between border-b border-white/10 px-3 py-2 text-xs">
        <span className="font-mono text-white/50">component.json</span>
        <button onClick={() => setCollapsed((c) => !c)} className="rounded border border-white/10 px-2 py-0.5" aria-expanded={!collapsed}>{collapsed ? "Expand" : "Collapse"}</button>
      </div>
      {!collapsed && <pre className="code-scroll max-h-64 overflow-auto p-3 font-mono text-xs leading-relaxed text-[#c9d1ff]"><code>{text}</code></pre>}
    </div>
  );
}

export function LogViewer({ lines, className }: { lines?: string[]; className?: string }) {
  const seed = lines ?? ["[00:01] registry validated — 32 components", "[00:02] playground mounted (reduced-motion: no)", "[00:03] install @buildora/magnetic-button … ok", "[00:04] WARN large prop table virtualized", "[00:05] a11y audit passed"];
  const [filter, setFilter] = React.useState("");
  const view = seed.filter((l) => l.toLowerCase().includes(filter.toLowerCase()));
  return (
    <div className={cn("rounded-2xl border border-white/10 bg-black/50", className)} role="log" aria-label="Logs">
      <div className="border-b border-white/10 p-2"><input value={filter} onChange={(e) => setFilter(e.target.value)} placeholder="Filter logs…" aria-label="Filter logs" className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-2 py-1 font-mono text-xs outline-none" /></div>
      <div className="code-scroll max-h-44 overflow-auto p-3 font-mono text-xs">
        {view.map((l, i) => <p key={i} className={cn(l.includes("WARN") ? "text-[#ff8a3d]" : l.includes("passed") || l.includes("ok") ? "text-[--b-success]" : "text-white/70")}>{l}</p>)}
        {view.length === 0 && <p className="text-white/40">No lines.</p>}
      </div>
    </div>
  );
}

export default AdvancedTable;
