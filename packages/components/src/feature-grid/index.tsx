"use client";

import * as React from "react";
import { cn } from "@buildora/utils";

export type Feature = { title: string; body: string; tag?: string };

export function FeatureGrid({
  heading = "One system, every surface",
  items,
  className,
}: {
  heading?: string;
  items?: Feature[];
  className?: string;
}) {
  const seed: Feature[] = items ?? [
    { title: "Registry-driven", body: "A single definition powers docs, search, and install.", tag: "registry" },
    { title: "Accessible by default", body: "Keyboard paths and live regions ship with every pattern.", tag: "a11y" },
    { title: "Motion with restraint", body: "Springs where they communicate; stillness everywhere else.", tag: "motion" },
  ];
  return (
    <section aria-label={heading} className={cn("rounded-2xl border border-[color-mix(in_oklab,var(--b-border)_10%,transparent)] bg-[var(--b-bg)] p-6 md:p-8", className)}>
      <h2 className="font-display text-2xl font-black tracking-tight">{heading}</h2>
      <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {seed.map((f) => (
          <li key={f.title} className="rounded-xl border border-[color-mix(in_oklab,var(--b-border)_10%,transparent)] bg-[color-mix(in_oklab,var(--b-text)_2%,transparent)] p-5">
            {f.tag && <span className="inline-block rounded-full bg-[color-mix(in_oklab,var(--b-text)_10%,transparent)] px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-[color-mix(in_oklab,var(--b-text)_60%,transparent)]">{f.tag}</span>}
            <p className="mt-3 font-bold">{f.title}</p>
            <p className="mt-1 text-sm leading-relaxed text-[color-mix(in_oklab,var(--b-text)_60%,transparent)]">{f.body}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default FeatureGrid;
