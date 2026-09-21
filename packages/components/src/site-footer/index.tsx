"use client";

import * as React from "react";
import { cn } from "@buildora/utils";

export type FooterColumn = { heading: string; links: { label: string; href: string }[] };

export function SiteFooter({
  brand = "Buildora",
  tagline = "Build. Remix. Ship.",
  columns,
  status = "All systems normal",
  className,
}: {
  brand?: string;
  tagline?: string;
  columns?: FooterColumn[];
  status?: string;
  className?: string;
}) {
  const seed: FooterColumn[] = columns ?? [
    { heading: "Library", links: [{ label: "Components", href: "#" }, { label: "Playground", href: "#" }, { label: "Registry", href: "#" }] },
    { heading: "Resources", links: [{ label: "Docs", href: "#" }, { label: "Templates", href: "#" }, { label: "Changelog", href: "#" }] },
  ];
  return (
    <footer className={cn("rounded-2xl border border-[color-mix(in_oklab,var(--b-border)_10%,transparent)] bg-[var(--b-bg)] p-6 md:p-8", className)}>
      <div className="grid gap-8 md:grid-cols-[1.2fr_2fr]">
        <div>
          <p className="font-display text-xl font-black">{brand}</p>
          <p className="mt-1 font-mono text-xs text-[color-mix(in_oklab,var(--b-text)_40%,transparent)]">{tagline}</p>
          <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-[color-mix(in_oklab,var(--b-border)_10%,transparent)] px-2.5 py-1 font-mono text-[11px] text-[color-mix(in_oklab,var(--b-text)_60%,transparent)]" role="status">
            <span aria-hidden className="h-2 w-2 rounded-full bg-[#4fe08a]" />
            {status}
          </p>
        </div>
        <nav className="grid grid-cols-2 gap-6" aria-label="Footer">
          {seed.map((c) => (
            <div key={c.heading}>
              <p className="font-mono text-[11px] uppercase tracking-wider text-[color-mix(in_oklab,var(--b-text)_40%,transparent)]">{c.heading}</p>
              <ul className="mt-3 space-y-2">
                {c.links.map((l) => (
                  <li key={l.label}>
                    <a href={l.href} className="text-sm text-[color-mix(in_oklab,var(--b-text)_70%,transparent)] transition-colors hover:text-[color:var(--b-text)]">
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>
      <hr className="my-6 border-[color-mix(in_oklab,var(--b-border)_10%,transparent)]" />
      <p className="font-mono text-[11px] text-[color-mix(in_oklab,var(--b-text)_35%,transparent)]">MIT licensed. Registry-driven, always.</p>
    </footer>
  );
}

export default SiteFooter;
