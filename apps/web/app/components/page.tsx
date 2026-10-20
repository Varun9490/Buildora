"use client";

import Link from "next/link";
import * as React from "react";
import { motion, type Variants } from "motion/react";
import { cn } from "@buildora/utils";
import {
  allComponents,
  searchComponents,
  collectionCounts,
  totalComponents,
  COLLECTION_META,
} from "@/lib/registry";
import { LazyPreview } from "@/components/LazyPreview";

const stagger: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.045, delayChildren: 0.08 } },
};
const rise: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.52, ease: [0.16, 1, 0.3, 1] as const } },
};

export default function ComponentsPage() {
  const [query, setQuery] = React.useState("");
  const [collection, setCollection] = React.useState<"all" | "creative" | "kit">("all");
  const results = React.useMemo(
    () => searchComponents(allComponents, { query, category: "all", framework: "all", tag: "all", difficulty: "all", status: "all", collection, sort: "featured" }),
    [query, collection]
  );

  return (
    <div className="min-h-screen bg-[color:var(--b-bg)] text-[color:var(--b-text)] selection:bg-[color:var(--b-accent)] selection:text-[color:var(--b-accent-foreground)]">
      {/* Hero — token-driven, not hardcoded #050505 */}
      <section className="relative overflow-hidden border-b border-[color:var(--b-border)]">
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <div className="absolute left-1/2 top-[-180px] h-[520px] w-[880px] -translate-x-1/2 rounded-full blur-[120px] opacity-60" style={{ background: "radial-gradient(closest-side, var(--b-accent-glow), transparent 72%)" }} />
          <div className="absolute inset-0 opacity-[0.32]" style={{ backgroundImage: "linear-gradient(color-mix(in oklab, var(--b-text) 4%, transparent) 1px, transparent 1px), linear-gradient(90deg, color-mix(in oklab, var(--b-text) 4%, transparent) 1px, transparent 1px)", backgroundSize: "56px 56px", maskImage: "radial-gradient(ellipse 80% 52% at 50% 0%, black 28%, transparent 74%)" }} />
        </div>
        <div className="relative mx-auto max-w-7xl px-6 py-16 sm:py-20 text-center">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }} className="inline-flex items-center gap-2 rounded-full border border-[color:var(--b-border)] bg-[color:var(--b-glass)] px-3.5 py-1.5 text-[11px] font-medium tracking-wide text-[color:var(--b-text-secondary)] backdrop-blur-md">
            <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--b-accent)] animate-pulse" /> {results.length} components · fluid by default
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.62, delay: 0.06, ease: [0.16, 1, 0.3, 1] }} className="mx-auto mt-6 max-w-3xl font-display text-4xl font-bold tracking-[-0.032em] leading-[1.02] sm:text-5xl lg:text-6xl">
            The component registry <span className="bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(100deg, var(--b-accent), var(--b-iris))" }}>that moves.</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.12, ease: [0.16, 1, 0.3, 1] }} className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-[color:var(--b-text-secondary)] sm:text-base">
            Every preview is live. Every component springs. Copy a command, feel the physics — then ship it.
          </motion.p>
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.45, delay: 0.18 }} className="mx-auto mt-8 flex max-w-lg items-center gap-3 rounded-2xl border border-[color:var(--b-border)] bg-[color:var(--b-panel)] p-2 shadow-sm">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[color:var(--b-surface)] border border-[color:var(--b-border)] text-[color:var(--b-muted)]">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7}><circle cx="11" cy="11" r="7" /><path d="M20 20L16.5 16.5" /></svg>
            </div>
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search primitives, effects, tokens…" className="min-w-0 flex-1 bg-transparent text-sm text-[color:var(--b-text)] placeholder:text-[color:var(--b-muted)] outline-none" aria-label="Search components" />
            {query && (
              <button onClick={() => setQuery("")} className="shrink-0 rounded-lg px-2.5 py-1.5 text-xs font-medium text-[color:var(--b-muted)] hover:text-[color:var(--b-text)] hover:bg-[color:var(--b-surface)]">Clear</button>
            )}
          </motion.div>
        </div>
      </section>

      {/* Filter strip */}
      <div className="sticky top-0 z-10 border-b border-[color:var(--b-border)] bg-[color:color-mix(in_oklab,var(--b-bg)_88%,transparent)] backdrop-blur-xl">
        <div className="mx-auto max-w-[1400px] px-6 py-3 flex flex-wrap items-center justify-between gap-4">
          <span className="font-mono text-[11px] tracking-widest uppercase text-[color:var(--b-muted)]">{results.length} results{query ? ` for “${query}”` : ""}</span>
          <div className="flex items-center gap-1 rounded-full border border-[color:var(--b-border)] bg-[color:var(--b-surface)] p-0.5" role="group" aria-label="Collection">
            {(["all", "creative", "kit"] as const).map((id) => {
              const label = id === "all" ? "All" : COLLECTION_META[id].label;
              const count = id === "all" ? totalComponents : collectionCounts[id];
              const active = collection === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setCollection(id)}
                  aria-pressed={active}
                  className={cn(
                    "rounded-full px-3 py-1 text-[11px] transition-colors",
                    active
                      ? "bg-[color:var(--b-accent)] font-semibold text-[color:var(--b-accent-foreground)]"
                      : "text-[color:var(--b-muted)] hover:text-[color:var(--b-text)]"
                  )}
                >
                  {label}
                  <span className="ml-1.5 opacity-60">{count}</span>
                </button>
              );
            })}
          </div>
          <span className="hidden sm:inline-flex items-center gap-2 text-xs text-[color:var(--b-muted)]">Each card is a live preview — hover to feel the spring <span className="h-1 w-1 rounded-full bg-[color:var(--b-accent)]" /></span>
        </div>
      </div>

      {/* Grid */}
      <section className="mx-auto max-w-[1400px] px-6 py-10 sm:py-12">
        <motion.div variants={stagger} initial="hidden" animate="visible" className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {results.map((c) => (
            <motion.div key={c.slug} variants={rise}>
              <Link href={`/components/${c.slug}`} className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[color:var(--b-border)] bg-[color:var(--b-panel)] b-fluid-card">
                <div className="relative flex h-44 items-center justify-center overflow-hidden border-b border-[color:var(--b-border)] bg-[color:var(--b-surface)]">
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: "radial-gradient(420px circle at 50% 0%, var(--b-accent-muted), transparent 62%)" }} aria-hidden />
                  <LazyPreview slug={c.slug} category={c.categories[0]} />
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <div className="flex items-start justify-between gap-3">
                    <h2 className="font-display text-[15px] font-semibold tracking-tight text-[color:var(--b-text)] group-hover:text-[color:var(--b-accent)] transition-colors">{c.name}</h2>
                    <span className="shrink-0 rounded-full border border-[color:var(--b-border)] bg-[color:var(--b-surface)] px-2 py-0.5 font-mono text-[10px] text-[color:var(--b-muted)]">v{c.version}</span>
                  </div>
                  <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-[color:var(--b-text-secondary)] flex-1">{c.description}</p>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {c.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="rounded-full border border-[color:var(--b-border)] bg-[color:var(--b-surface)] px-2.5 py-1 font-mono text-[10px] text-[color:var(--b-muted)] group-hover:border-[color:var(--b-border-hover)] transition-colors">{tag}</span>
                    ))}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
        {results.length === 0 && (
          <div className="py-20 text-center">
            <p className="font-mono text-xs uppercase tracking-widest text-[color:var(--b-muted)]">No matches</p>
            <button onClick={() => setQuery("")} className="mt-3 text-sm font-medium text-[color:var(--b-accent)] hover:underline">Clear search</button>
          </div>
        )}
      </section>
    </div>
  );
}
