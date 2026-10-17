"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { cn } from "@buildora/utils";
import { allComponents, searchComponents, type ComponentSummary, type SearchFilters } from "@/lib/registry";
import { CopyButton } from "./CodeBlock";
import { installCommand } from "@/lib/design";

/* ─────────────────────────────────────────────────────
   COMPONENT EXPLORER — real registry, real search.
   Fuzzy query · category facets · density toggle ·
   progressive disclosure. Every card links to a real
   /components/{slug} page. Zero fabricated entries.
   ───────────────────────────────────────────────────── */

const PAGE_SIZE = 12;

const DIFFICULTY_DOT: Record<string, string> = {
  beginner: "bg-emerald-400",
  intermediate: "bg-amber-400",
  advanced: "bg-rose-400",
};

function ExplorerCard({ c, compact }: { c: ComponentSummary; compact: boolean }) {
  const cli = installCommand("pnpm", c.slug);
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 28 }}
    >
      <Link
        href={`/components/${c.slug}`}
        className={cn(
          "group relative block rounded-2xl border border-[color:var(--b-border)] bg-[color:color-mix(in_oklab,var(--b-panel)_88%,transparent)] transition-all hover:-translate-y-0.5 hover:border-[color:var(--b-accent)]",
          compact ? "px-4 py-3" : "p-5"
        )}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span
                className={cn("h-1.5 w-1.5 shrink-0 rounded-full", DIFFICULTY_DOT[c.difficulty] ?? "bg-zinc-400")}
                title={`Difficulty: ${c.difficulty}`}
              />
              <h4 className={cn("truncate font-display font-bold tracking-tight text-[color:var(--b-text)]", compact ? "text-sm" : "text-base")}>
                {c.name}
              </h4>
            </div>
            <code className="mt-0.5 block truncate font-mono text-[10px] text-[color:var(--b-muted)]">
              @buildora/{c.slug}
            </code>
          </div>
          <span className="shrink-0 font-mono text-[9px] uppercase tracking-wider text-[color:var(--b-muted)]">
            v{c.version}
          </span>
        </div>

        {!compact && (
          <p className="mt-2.5 line-clamp-2 text-xs leading-relaxed text-[color:var(--b-text-secondary)]">
            {c.description}
          </p>
        )}

        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          {c.categories.slice(0, 2).map((cat) => (
            <span
              key={cat}
              className="rounded-full border border-[color:var(--b-border)] bg-[color:var(--b-surface)] px-2 py-0.5 font-mono text-[9px] uppercase tracking-wide text-[color:var(--b-text-secondary)]"
            >
              {cat}
            </span>
          ))}
          {!compact &&
            c.tags.slice(0, 2).map((tag) => (
              <span key={tag} className="font-mono text-[9px] text-[color:var(--b-muted)]">
                #{tag}
              </span>
            ))}
          <span className="ml-auto hidden font-mono text-[9px] uppercase tracking-wider text-[color:var(--b-muted)] opacity-0 transition-opacity group-hover:opacity-100 sm:inline">
            open ↗
          </span>
        </div>

        <div
          className="absolute right-3 top-3 hidden sm:block"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          <CopyButton text={cli} label="CLI" copiedLabel="Copied" className="opacity-0 transition-opacity group-hover:opacity-100" />
        </div>
      </Link>
    </motion.div>
  );
}

export function ComponentExplorer() {
  const [query, setQuery] = React.useState("");
  const [category, setCategory] = React.useState("all");
  const [compact, setCompact] = React.useState(false);
  const [visible, setVisible] = React.useState(PAGE_SIZE);

  const categories = React.useMemo(() => {
    const counts = new Map<string, number>();
    for (const c of allComponents) {
      for (const cat of c.categories) counts.set(cat, (counts.get(cat) ?? 0) + 1);
    }
    return [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 9);
  }, []);

  const results = React.useMemo(() => {
    const filters: SearchFilters = {
      query,
      category,
      framework: "all",
      tag: "all",
      difficulty: "all",
      status: "all",
      sort: "featured",
    };
    return searchComponents(allComponents, filters);
  }, [query, category]);

  React.useEffect(() => setVisible(PAGE_SIZE), [query, category]);

  const shown = results.slice(0, visible);
  const hasMore = visible < results.length;

  return (
    <section id="explorer" className="relative mx-auto w-full max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-3xl text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-[color:var(--b-border)] bg-[color:var(--b-surface)] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-[color:var(--b-iris)]">
          Component Explorer
        </span>
        <h2 className="mt-5 font-display text-3xl font-bold tracking-tight text-[color:var(--b-text)] sm:text-4xl lg:text-5xl text-balance">
          {allComponents.length} primitives. Search them like a pro.
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-[color:var(--b-text-secondary)] sm:text-base">
          The same fuzzy index that powers the CLI — query it live, facet by category,
          and inspect any primitive&apos;s source without leaving the page.
        </p>
      </div>

      {/* controls */}
      <div className="mx-auto mt-10 flex max-w-4xl flex-col gap-3">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <svg
              className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[color:var(--b-muted)]"
              viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder='Try "otp", "spring", or "streaming"…'
              className="w-full rounded-2xl border border-[color:var(--b-border)] bg-[color:var(--b-glass)] py-3 pl-10 pr-24 text-sm text-[color:var(--b-text)] outline-none backdrop-blur-md transition-colors placeholder:text-[color:var(--b-muted)] focus:border-[color:var(--b-accent)]"
              aria-label="Search components"
            />
            <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 font-mono text-[10px] text-[color:var(--b-muted)]">
              {results.length} match{results.length === 1 ? "" : "es"}
            </span>
          </div>
          <div className="hidden rounded-xl border border-[color:var(--b-border)] bg-[color:var(--b-surface)] p-0.5 sm:flex" role="group" aria-label="Density">
            {([false, true] as const).map((c) => (
              <button
                key={String(c)}
                onClick={() => setCompact(c)}
                aria-pressed={compact === c}
                className={cn(
                  "rounded-lg px-2.5 py-2 font-mono text-[10px] uppercase tracking-wide transition-colors",
                  compact === c
                    ? "bg-[color:var(--b-panel)] font-semibold text-[color:var(--b-text)] shadow-sm"
                    : "text-[color:var(--b-muted)] hover:text-[color:var(--b-text-secondary)]"
                )}
              >
                {c ? "▪ Compact" : "▤ Cards"}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5" role="group" aria-label="Category filter">
          <button
            onClick={() => setCategory("all")}
            aria-pressed={category === "all"}
            className={cn(
              "rounded-full border px-3 py-1.5 font-mono text-[10px] uppercase tracking-wide transition-colors",
              category === "all"
                ? "border-[color:var(--b-accent)] bg-[color:var(--b-accent-muted)] font-semibold text-[color:var(--b-accent)]"
                : "border-[color:var(--b-border)] text-[color:var(--b-muted)] hover:border-[color:var(--b-border-hover)] hover:text-[color:var(--b-text-secondary)]"
            )}
          >
            All · {allComponents.length}
          </button>
          {categories.map(([cat, count]) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              aria-pressed={category === cat}
              className={cn(
                "rounded-full border px-3 py-1.5 font-mono text-[10px] uppercase tracking-wide transition-colors",
                category === cat
                  ? "border-[color:var(--b-accent)] bg-[color:var(--b-accent-muted)] font-semibold text-[color:var(--b-accent)]"
                  : "border-[color:var(--b-border)] text-[color:var(--b-muted)] hover:border-[color:var(--b-border-hover)] hover:text-[color:var(--b-text-secondary)]"
              )}
            >
              {cat} · {count}
            </button>
          ))}
        </div>
      </div>

      {/* results */}
      {shown.length > 0 ? (
        <div
          className={cn(
            "mx-auto mt-8 grid max-w-6xl gap-3",
            compact ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          )}
        >
          {shown.map((c) => (
            <ExplorerCard key={c.slug} c={c} compact={compact} />
          ))}
        </div>
      ) : (
        <div className="mx-auto mt-10 max-w-md rounded-2xl border border-dashed border-[color:var(--b-border)] p-8 text-center">
          <p className="font-mono text-sm text-[color:var(--b-text-secondary)]">
            No primitives match &ldquo;{query}&rdquo;.
          </p>
          <button
            onClick={() => {
              setQuery("");
              setCategory("all");
            }}
            className="mt-3 rounded-lg border border-[color:var(--b-border)] px-3 py-1.5 font-mono text-[11px] text-[color:var(--b-accent)] transition-colors hover:border-[color:var(--b-accent)]"
          >
            Clear filters
          </button>
        </div>
      )}

      {hasMore && (
        <div className="mt-8 text-center">
          <button
            onClick={() => setVisible((v) => v + PAGE_SIZE)}
            className="rounded-full border border-[color:var(--b-border)] bg-[color:var(--b-surface)] px-6 py-2.5 font-mono text-[11px] font-medium text-[color:var(--b-text-secondary)] transition-colors hover:border-[color:var(--b-accent)] hover:text-[color:var(--b-accent)]"
          >
            Show {Math.min(PAGE_SIZE, results.length - visible)} more · {visible}/{results.length}
          </button>
        </div>
      )}
    </section>
  );
}
