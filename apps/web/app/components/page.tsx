"use client";

import Link from "next/link";
import * as React from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  allComponents,
  allCategories,
  searchComponents,
  type ComponentSummary,
} from "@/lib/registry";
import { useBuildora } from "@/lib/store";
import { cn } from "@buildora/utils";

const spring = { type: "spring", stiffness: 100, damping: 20, mass: 0.8 } as const;
const easeOut = [0.22, 1, 0.36, 1] as const;

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05, delayChildren: 0.05 } },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: easeOut } },
};

function useTopTags(limit = 12) {
  return React.useMemo(() => {
    const freq = new Map<string, number>();
    for (const c of allComponents) for (const t of c.tags) freq.set(t, (freq.get(t) ?? 0) + 1);
    return [...freq.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([label, count]) => ({ label, count }));
  }, []);
}

function useCategoryCounts() {
  return React.useMemo(() => {
    const counts: Record<string, number> = {};
    for (const cat of allCategories) counts[cat] = 0;
    for (const c of allComponents) for (const cat of c.categories) counts[cat] = (counts[cat] ?? 0) + 1;
    return counts;
  }, []);
}

function SearchField({
  value,
  onChange,
  id = "catalog-search",
}: {
  value: string;
  onChange: (v: string) => void;
  id?: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="font-mono text-[11px] uppercase tracking-[0.14em] text-[--b-muted]">
        Search
      </label>
      <div className="relative">
        <input
          id={id}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Filter components"
          className="w-full rounded-[10px] border border-[--b-border] bg-[--b-panel] py-2.5 pl-10 pr-9 text-sm text-[--b-text] outline-none transition-colors placeholder:text-[--b-muted] focus:border-[--b-accent]"
        />
        <svg
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[--b-muted]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
        <AnimatePresence>
          {value && (
            <motion.button
              key="clear"
              type="button"
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.6, opacity: 0 }}
              whileTap={{ scale: 0.9 }}
              transition={spring}
              onClick={() => onChange("")}
              aria-label="Clear search"
              className="absolute right-2 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full text-[--b-muted] transition-colors hover:bg-[--b-surface] hover:text-[--b-text]"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
              </svg>
            </motion.button>
          )}
        </AnimatePresence>
      </div>
      <p className="text-xs leading-relaxed text-[--b-muted]">Filters combine. {allComponents.length} components total.</p>
    </div>
  );
}

function CategoryNav({
  value,
  onChange,
  counts,
}: {
  value: string;
  onChange: (v: string) => void;
  counts: Record<string, number>;
}) {
  const items = ["all", ...allCategories];
  return (
    <nav aria-label="Catalog categories">
      <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.14em] text-[--b-muted]">Category</p>
      <motion.ul
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        className="flex flex-col gap-1"
      >
        {items.map((cat) => {
          const active = value === cat;
          const count = cat === "all" ? allComponents.length : (counts[cat] ?? 0);
          return (
            <motion.li key={cat} variants={item}>
              <button
                type="button"
                onClick={() => onChange(cat)}
                aria-current={active ? "true" : undefined}
                aria-pressed={active}
                className={cn(
                  "relative flex w-full items-center justify-between rounded-[10px] px-3 py-2 text-left text-sm transition-colors",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--b-accent]",
                  active
                    ? "text-[--b-text]"
                    : "text-[--b-text-secondary] hover:bg-[--b-surface] hover:text-[--b-text]"
                )}
              >
                {active && (
                  <motion.span
                    layoutId="cat-pill"
                    transition={spring}
                    className="absolute inset-0 rounded-[10px] border border-[--b-border] bg-[--b-surface]"
                    aria-hidden="true"
                  />
                )}
                <span className="relative truncate font-medium">
                  {cat === "all" ? "All components" : cat}
                </span>
                <span className="relative font-mono text-[11px] tabular-nums text-[--b-muted]">{count}</span>
              </button>
            </motion.li>
          );
        })}
      </motion.ul>
    </nav>
  );
}

function ComponentCard({ c, reduce }: { c: ComponentSummary; reduce: boolean }) {
  return (
    <motion.div
      variants={reduce ? undefined : item}
      layout={reduce ? false : true}
      initial={reduce ? { opacity: 1 } : undefined}
      animate={reduce ? { opacity: 1 } : undefined}
      exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.96, transition: { duration: 0.2 } }}
      transition={spring}
    >
      <motion.div whileHover={reduce ? undefined : { y: -2 }} whileTap={reduce ? undefined : { scale: 0.98 }} transition={spring}>
        <Link
          href={`/components/${c.slug}`}
          className="group flex h-full flex-col overflow-hidden rounded-[14px] border border-[--b-border] bg-[--b-panel] transition-colors hover:border-[--b-accent]"
          aria-label={`${c.name}, ${c.categories[0]}`}
        >
          <div className="border-b border-[--b-border] bg-[--b-surface] px-5 py-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[--b-muted]">{c.categories[0]}</p>
          </div>
          <div className="flex flex-1 flex-col p-5">
            <div className="flex items-start justify-between gap-3">
              <h2 className="text-balance font-display text-lg font-bold tracking-tight text-[--b-text]">{c.name}</h2>
              <span className="shrink-0 rounded-full border border-[--b-border] px-2 py-0.5 font-mono text-[10px] text-[--b-muted]">
                v{c.version}
              </span>
            </div>
            <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-[--b-text-secondary]">{c.description}</p>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {c.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-[--b-border] px-2.5 py-1 font-mono text-[10px] text-[--b-muted]"
                >
                  {tag}
                </span>
              ))}
            </div>
            <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-[--b-accent]">
              Open component
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
          </div>
        </Link>
      </motion.div>
    </motion.div>
  );
}

function SidebarBody({
  query,
  setQuery,
  category,
  setCategory,
  difficulty,
  setDifficulty,
  tag,
  setTag,
  onClear,
  hasActive,
}: {
  query: string;
  setQuery: (v: string) => void;
  category: string;
  setCategory: (v: string) => void;
  difficulty: string;
  setDifficulty: (v: string) => void;
  tag: string;
  setTag: (v: string) => void;
  onClear: () => void;
  hasActive: boolean;
}) {
  const counts = useCategoryCounts();
  const topTags = useTopTags();
  const { recent } = useBuildora();
  const recentItems = React.useMemo(
    () =>
      recent
        .map((slug) => allComponents.find((c) => c.slug === slug))
        .filter((x): x is ComponentSummary => Boolean(x))
        .slice(0, 5),
    [recent]
  );

  return (
    <div className="flex flex-col gap-7">
      <SearchField value={query} onChange={setQuery} />
      <CategoryNav value={category} onChange={setCategory} counts={counts} />

      <div>
        <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.14em] text-[--b-muted]">Level</p>
        <div className="flex flex-wrap gap-1.5" role="group" aria-label="Difficulty">
          {["all", "beginner", "intermediate", "advanced"].map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => setDifficulty(d)}
              aria-pressed={difficulty === d}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--b-accent] active:scale-[0.98]",
                difficulty === d
                  ? "border-[--b-accent] bg-[--b-accent] text-[--b-accent-foreground]"
                  : "border-[--b-border] text-[--b-text-secondary] hover:border-[--b-border-hover] hover:text-[--b-text]"
              )}
            >
              {d === "all" ? "Any" : d}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.14em] text-[--b-muted]">Tags</p>
        <div className="flex flex-wrap gap-1.5">
          {topTags.map((t) => {
            const active = tag === t.label;
            return (
              <button
                key={t.label}
                type="button"
                onClick={() => setTag(active ? "all" : t.label)}
                aria-pressed={active}
                className={cn(
                  "rounded-full border px-2.5 py-1 font-mono text-[11px] transition-colors active:scale-[0.98]",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--b-accent]",
                  active
                    ? "border-[--b-accent] bg-[--b-accent] text-[--b-accent-foreground]"
                    : "border-[--b-border] text-[--b-muted] hover:text-[--b-text-secondary]"
                )}
              >
                {t.label} · {t.count}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.14em] text-[--b-muted]">Recent</p>
        {recentItems.length === 0 ? (
          <p className="text-sm text-[--b-muted]">No recent views yet.</p>
        ) : (
          <ul className="flex flex-col gap-1">
            {recentItems.map((r) => (
              <li key={r.slug}>
                <Link
                  href={`/components/${r.slug}`}
                  className="flex items-center justify-between rounded-[10px] px-3 py-2 text-sm text-[--b-text-secondary] transition-colors hover:bg-[--b-surface] hover:text-[--b-text]"
                >
                  <span className="truncate">{r.name}</span>
                  <span className="font-mono text-[10px] text-[--b-muted]">{r.categories[0]}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      <button
        type="button"
        onClick={onClear}
        disabled={!hasActive}
        className="self-start text-sm font-medium text-[--b-text-secondary] underline-offset-4 transition-colors hover:text-[--b-text] hover:underline disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:no-underline"
      >
        Clear all filters
      </button>
    </div>
  );
}

export default function ComponentsPage() {
  const reduce = useReducedMotion();
  const [query, setQuery] = React.useState("");
  const [category, setCategory] = React.useState("all");
  const [difficulty, setDifficulty] = React.useState("all");
  const [tag, setTag] = React.useState("all");
  const [sort, setSort] = React.useState<"popular" | "az">("popular");
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const results = React.useMemo(
    () =>
      searchComponents(allComponents, {
        query,
        category,
        framework: "all",
        tag,
        difficulty,
        sort,
      }),
    [query, category, difficulty, tag, sort]
  );

  const hasActive = query !== "" || category !== "all" || difficulty !== "all" || tag !== "all";
  const onClear = React.useCallback(() => {
    setQuery("");
    setCategory("all");
    setDifficulty("all");
    setTag("all");
  }, []);

  React.useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileOpen]);

  const sidebarProps = { query, setQuery, category, setCategory, difficulty, setDifficulty, tag, setTag, onClear, hasActive };

  return (
    <div className="min-h-[100dvh] bg-[--b-bg] text-[--b-text]">
      <div className="mx-auto grid max-w-[1400px] gap-8 px-4 py-8 md:px-6 lg:grid-cols-[280px_1fr]">
        <aside className="sticky top-6 hidden max-h-[calc(100dvh-3rem)] self-start overflow-y-auto rounded-[14px] border border-[--b-border] bg-[--b-panel] p-5 lg:block">
          <nav aria-label="Catalog filters">
            <SidebarBody {...sidebarProps} />
          </nav>
        </aside>

        <main aria-label="Component catalog">
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-haspopup="dialog"
              aria-expanded={mobileOpen}
              className="inline-flex items-center gap-2 rounded-[10px] border border-[--b-border] bg-[--b-panel] px-3 py-2 text-sm font-medium text-[--b-text] transition-transform active:scale-[0.98] lg:hidden"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
                <path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h10" />
              </svg>
              Filters
            </button>
            <p role="status" className="font-mono text-xs tabular-nums text-[--b-muted]">
              {results.length} of {allComponents.length} components
            </p>
            <div className="ml-auto flex gap-1 rounded-[10px] border border-[--b-border] bg-[--b-panel] p-1" role="group" aria-label="Sort">
              {(["popular", "az"] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSort(s)}
                  aria-pressed={sort === s}
                  className={cn(
                    "rounded-md px-3 py-1.5 text-xs font-medium transition-colors active:scale-[0.98]",
                    sort === s ? "bg-[--b-surface] text-[--b-text]" : "text-[--b-muted] hover:text-[--b-text-secondary]"
                  )}
                >
                  {s === "popular" ? "Popular" : "A to Z"}
                </button>
              ))}
            </div>
          </div>

          <motion.div
            variants={reduce ? undefined : container}
            initial={reduce ? { opacity: 1 } : "hidden"}
            animate={reduce ? { opacity: 1 } : "show"}
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3"
            id="catalog-grid"
          >
            <AnimatePresence mode="sync">
              {results.map((c) => (
                <ComponentCard key={c.slug} c={c} reduce={Boolean(reduce)} />
              ))}
            </AnimatePresence>
          </motion.div>

          {results.length === 0 && (
            <div className="mt-8 rounded-[14px] border border-[--b-border] bg-[--b-panel] p-10 text-center">
              <h2 className="font-display text-xl font-bold tracking-tight">Nothing matches those filters</h2>
              <p className="mx-auto mt-2 max-w-[40ch] text-sm leading-relaxed text-[--b-text-secondary]">
                Try a shorter search term or clear one filter at a time.
              </p>
              <button
                type="button"
                onClick={onClear}
                className="mt-5 rounded-[10px] bg-[--b-accent] px-4 py-2 text-sm font-semibold text-[--b-accent-foreground] transition-transform active:scale-[0.98]"
              >
                Clear filters
              </button>
            </div>
          )}
        </main>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              key="scrim"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-40 bg-black lg:hidden"
              aria-hidden="true"
            />
            <motion.aside
              key="drawer"
              role="dialog"
              aria-modal="true"
              aria-label="Catalog filters"
              initial={reduce ? { opacity: 0 } : { x: "-100%", opacity: 0 }}
              animate={reduce ? { opacity: 1 } : { x: 0, opacity: 1 }}
              exit={reduce ? { opacity: 0 } : { x: "-100%", opacity: 0 }}
              transition={spring}
              className="fixed inset-y-0 left-0 z-50 w-[300px] overflow-y-auto border-r border-[--b-border] bg-[--b-panel] p-5 lg:hidden"
            >
              <div className="mb-5 flex items-center justify-between">
                <p className="font-display text-base font-bold">Filters</p>
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  aria-label="Close filters"
                  className="flex h-8 w-8 items-center justify-center rounded-[10px] border border-[--b-border] text-[--b-text-secondary] active:scale-[0.98]"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
                  </svg>
                </button>
              </div>
              <SidebarBody {...sidebarProps} />
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="mt-6 w-full rounded-[10px] bg-[--b-accent] py-2.5 text-sm font-semibold text-[--b-accent-foreground] transition-transform active:scale-[0.98]"
              >
                Show {results.length} components
              </button>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
