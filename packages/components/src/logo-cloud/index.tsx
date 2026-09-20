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
    <section aria-label={label} className={cn("rounded-2xl border border-white/10 bg-white/[0.01] px-6 py-8 text-center", className)}>
      <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/40">{label}</p>
      <ul className="mt-5 flex flex-wrap items-center justify-center gap-x-8 gap-y-3" aria-label="Customer logos">
        {seed.map((b) => (
          <li key={b} className="font-display text-lg font-black tracking-tight text-white/35 transition-colors hover:text-white/70">
            {b}
          </li>
        ))}
      </ul>
    </section>
  );
}

export default LogoCloud;
