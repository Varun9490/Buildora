"use client";

import * as React from "react";
import { cn } from "@buildora/utils";

export type CtaStat = { value: string; label: string };

export function CtaBlock({
  eyebrow = "Registry-driven",
  title = "Ship your next interface with Buildora",
  body = "One component definition powers docs, playground, search, and install. Copy it, remix it, ship it.",
  primaryLabel = "Browse components",
  secondaryLabel = "Read the docs",
  onPrimary,
  onSecondary,
  stats,
  className,
}: {
  eyebrow?: string;
  title?: string;
  body?: string;
  primaryLabel?: string;
  secondaryLabel?: string;
  onPrimary?: () => void;
  onSecondary?: () => void;
  stats?: CtaStat[];
  className?: string;
}) {
  return (
    <section
      aria-labelledby="cta-block-title"
      className={cn("overflow-hidden rounded-2xl border border-[color-mix(in_oklab,var(--b-border)_10%,transparent)] bg-[var(--b-bg)] p-8 text-center md:p-12", className)}
    >
      <span className="inline-block rounded-full bg-[color-mix(in_oklab,var(--b-text)_10%,transparent)] px-2.5 py-1 font-mono text-[11px] uppercase tracking-wider text-[color-mix(in_oklab,var(--b-text)_70%,transparent)]">{eyebrow}</span>
      <h2 id="cta-block-title" className="mx-auto mt-4 max-w-2xl font-display text-3xl font-black tracking-tight md:text-4xl">
        {title}
      </h2>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-[color-mix(in_oklab,var(--b-text)_60%,transparent)]">{body}</p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <button onClick={onPrimary} className="rounded-[10px] bg-[color:var(--b-accent)] px-5 py-2.5 text-sm font-semibold text-[color:var(--b-accent-foreground)] transition-transform active:scale-95">
          {primaryLabel}
        </button>
        <button onClick={onSecondary} className="rounded-[10px] border border-[color-mix(in_oklab,var(--b-border)_15%,transparent)] px-5 py-2.5 text-sm font-semibold text-[color-mix(in_oklab,var(--b-text)_80%,transparent)] transition-colors hover:bg-[color-mix(in_oklab,var(--b-text)_5%,transparent)]">
          {secondaryLabel}
        </button>
      </div>
      {stats && stats.length > 0 && (
        <dl className="mx-auto mt-8 grid max-w-lg grid-cols-3 gap-4 border-t border-[color-mix(in_oklab,var(--b-border)_10%,transparent)] pt-6">
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col">
              <dt className="order-2 mt-1 font-mono text-[11px] uppercase tracking-wider text-[color-mix(in_oklab,var(--b-text)_40%,transparent)]">{s.label}</dt>
              <dd className="order-1 font-display text-2xl font-black">{s.value}</dd>
            </div>
          ))}
        </dl>
      )}
    </section>
  );
}

export default CtaBlock;
