"use client";

import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@buildora/utils";
import { CopyButton, CodeBlock } from "./CodeBlock";
import { installCommand } from "@/lib/design";

/* ─────────────────────────────────────────────────────
   UNIFIED BENTO CARD ANATOMY
   Header  : category badge · title · description · [Preview|Code] · Inspect ↗
   Stage   : live interactive primitive OR syntax-highlighted source
   Footer  : physics telemetry pill · reset · 1-click CLI copy
   ───────────────────────────────────────────────────── */

export function BentoShell({
  span,
  category,
  title,
  description,
  slug,
  demo,
  code,
  physics,
  resetLabel = "Reset",
  stageClassName,
}: {
  span: "lg:col-span-6" | "lg:col-span-4";
  category: string;
  title: string;
  description: string;
  slug: string;
  demo: React.ReactNode;
  code: string;
  physics: string;
  resetLabel?: string;
  stageClassName?: string;
}) {
  const [view, setView] = React.useState<"preview" | "code">("preview");
  const [resetKey, setResetKey] = React.useState(0);
  const cli = installCommand("pnpm", slug);

  return (
    <motion.article
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ type: "spring", stiffness: 160, damping: 26 }}
      className={cn(
        "group relative flex flex-col rounded-[2rem] border border-[color:var(--b-border)] bg-[color:color-mix(in_oklab,var(--b-text)_2.5%,transparent)] p-2 transition-colors hover:border-[color:var(--b-border-hover)]",
        span
      )}
    >
      <div className="flex h-full flex-col overflow-hidden rounded-[calc(2rem-0.5rem)] border border-[color:var(--b-border)] bg-[color:color-mix(in_oklab,var(--b-panel)_92%,transparent)]">
        {/* ── Header ── */}
        <header className="flex flex-wrap items-start justify-between gap-3 border-b border-[color:var(--b-border)] px-5 py-4">
          <div className="min-w-0 flex-1">
            <span className="inline-flex items-center rounded-full border border-[color:color-mix(in_oklab,var(--b-accent)_22%,transparent)] bg-[color:var(--b-accent-muted)] px-2.5 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-[0.12em] text-[color:var(--b-accent)]">
              {category}
            </span>
            <h3 className="mt-2 font-display text-lg font-bold tracking-tight text-[color:var(--b-text)]">
              {title}
            </h3>
            <p className="mt-1 max-w-[46ch] text-xs leading-relaxed text-[color:var(--b-muted)]">
              {description}
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            {/* Preview | Code segmented toggle */}
            <div
              className="flex rounded-lg border border-[color:var(--b-border)] bg-[color:var(--b-surface)] p-0.5"
              role="group"
              aria-label={`${title} view`}
            >
              {(["preview", "code"] as const).map((v) => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  aria-pressed={view === v}
                  className={cn(
                    "rounded-md px-2 py-1 font-mono text-[10px] uppercase tracking-wide transition-colors",
                    view === v
                      ? "bg-[color:var(--b-panel)] font-semibold text-[color:var(--b-text)] shadow-sm"
                      : "text-[color:var(--b-muted)] hover:text-[color:var(--b-text-secondary)]"
                  )}
                >
                  {v}
                </button>
              ))}
            </div>

            <Link
              href={`/components/${slug}`}
              className="inline-flex items-center gap-1 rounded-lg border border-[color:var(--b-border)] px-2 py-1 font-mono text-[10px] text-[color:var(--b-text-secondary)] transition-colors hover:border-[color:var(--b-accent)] hover:text-[color:var(--b-accent)]"
            >
              Inspect <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </header>

        {/* ── Stage ── */}
        <div className={cn("relative flex-1 overflow-hidden", stageClassName ?? "min-h-[300px]")}>
          <AnimatePresence mode="wait" initial={false}>
            {view === "preview" ? (
              <motion.div
                key={`preview-${resetKey}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
                className="flex h-full min-h-[inherit] w-full items-center justify-center px-4 py-6"
              >
                {demo}
              </motion.div>
            ) : (
              <motion.div
                key="code"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
                className="h-full w-full p-3"
              >
                <CodeBlock
                  code={code}
                  file={`${slug}.tsx`}
                  showLineNumbers
                  maxHeight={320}
                  className="h-full"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Telemetry footer ── */}
        <footer className="flex flex-wrap items-center justify-between gap-2 border-t border-[color:var(--b-border)] bg-[color:color-mix(in_oklab,var(--b-surface)_30%,transparent)] px-4 py-2.5">
          <span className="font-mono text-[10px] uppercase tracking-wider text-[color:var(--b-muted)]">
            {physics}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setResetKey((k) => k + 1)}
              className="rounded-lg border border-[color:var(--b-border)] px-2.5 py-1 font-mono text-[10px] text-[color:var(--b-text-secondary)] transition-colors hover:border-[color:var(--b-border-hover)] hover:text-[color:var(--b-text)] active:scale-95"
            >
              ↺ {resetLabel}
            </button>
            <CopyButton text={cli} label="CLI" copiedLabel="Added" />
          </div>
        </footer>
      </div>
    </motion.article>
  );
}
