"use client";

import * as React from "react";
import { cn } from "@buildora/utils";

export function LogoCloud({
  label = "Powering component teams",
  brands,
  className,
}: {
  label?: string;
  brands?: string[];
  className?: string;
}) {
  const seed = brands ?? ["Acme", "Globex", "Initech", "Umbrella", "Hooli", "Stark"];
  return (
    <section aria-label={label} className={cn("rounded-2xl border border-[color-mix(in_oklab,var(--b-border)_10%,transparent)] bg-[color-mix(in_oklab,var(--b-text)_1%,transparent)] px-6 py-8 text-center", className)}>
      <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[color-mix(in_oklab,var(--b-text)_40%,transparent)]">{label}</p>
      <ul className="mt-5 flex flex-wrap items-center justify-center gap-x-8 gap-y-3" aria-label="Customer logos">
        {seed.map((b) => (
          <li key={b} className="font-display text-lg font-black tracking-tight text-[color-mix(in_oklab,var(--b-text)_35%,transparent)] transition-colors hover:text-[color-mix(in_oklab,var(--b-text)_70%,transparent)]">
            {b}
          </li>
        ))}
      </ul>
    </section>
  );
}

export default LogoCloud;
