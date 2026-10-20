"use client";

import * as React from "react";
import {
  BentoGrid,
  BentoItem,
  CountUp,
  FxCard,
  MagneticButton,
  SplitText,
} from "@buildora/components";
import { ThemeCustomizer } from "@/components/ThemeCustomizer";

const STATS = [
  { value: 127, label: "installable components", suffix: "" },
  { value: 60, label: "creative effects", suffix: "" },
  { value: 1.45, decimals: 2, label: "KB median, gzipped", suffix: "" },
  { value: 0, label: "axe violations", suffix: "" },
];

const FEATURES = [
  {
    title: "Physics you can read",
    body: "Every motion ships with the constants that produce it. The damping ratio, the overshoot, the settling time — all of it is in the docs.",
    span: "wide",
  },
  {
    title: "Installs that compile",
    body: "Every component declares its dependencies and ships its own utilities. One command, no missing imports.",
    span: "normal",
  },
  {
    title: "Accessible by construction",
    body: "A gate renders every exported component and scans it with axe-core. A new component cannot ship without passing.",
    span: "normal",
  },
];

export default function ProductLandingTemplate() {
  return (
    <div className="min-h-screen bg-[color:var(--b-bg)] text-[color:var(--b-text)] font-sans">
      <nav className="sticky top-0 z-40 border-b border-[color:var(--b-border)] bg-[color:color-mix(in_oklab,var(--b-bg)_90%,transparent)] backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
          <span className="font-mono text-xs font-bold uppercase tracking-widest">
            Northwind
          </span>
          <div className="flex items-center gap-3">
            <a
              href="#features"
              className="hidden text-xs text-[color:var(--b-text-secondary)] transition-colors hover:text-[color:var(--b-text)] sm:inline"
            >
              Features
            </a>
            <a
              href="#start"
              className="hidden text-xs text-[color:var(--b-text-secondary)] transition-colors hover:text-[color:var(--b-text)] sm:inline"
            >
              Pricing
            </a>
            <ThemeCustomizer />
          </div>
        </div>
      </nav>

      <main>
        {/* Hero */}
        <section className="mx-auto max-w-6xl px-6 py-20 text-center sm:py-28">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[color:var(--b-accent)]">
            Now in public beta
          </p>
          <h1 className="mt-6 font-display text-4xl font-black tracking-tight sm:text-6xl">
            <SplitText
              as="span"
              text="Ship interfaces that feel physical"
              by="word"
              variant="fade-up"
              stagger={60}
            />
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-sm leading-relaxed text-[color:var(--b-text-secondary)]">
            A component library for teams who care how a thing moves. Real
            springs, measured contrast, and an install that compiles.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <MagneticButton strength={0.3} radius={140}>
              Start building
            </MagneticButton>
            <a
              href="#features"
              className="rounded-xl border border-[color:var(--b-border)] bg-[color:var(--b-surface)] px-6 py-3 text-sm font-semibold text-[color:var(--b-text-secondary)] transition-colors hover:text-[color:var(--b-text)]"
            >
              See how it works
            </a>
          </div>
        </section>

        {/* Stats */}
        <section className="border-y border-[color:var(--b-border)] bg-[color:var(--b-surface)]">
          <dl className="mx-auto grid max-w-6xl grid-cols-2 gap-px px-6 py-10 md:grid-cols-4">
            {STATS.map((s) => (
              <div key={s.label} className="px-4 py-2">
                <dd className="font-display text-3xl font-black tabular-nums">
                  <CountUp
                    value={s.value}
                    decimals={s.decimals ?? 0}
                    suffix={s.suffix}
                  />
                </dd>
                <dt className="mt-1 text-xs text-[color:var(--b-muted)]">{s.label}</dt>
              </div>
            ))}
          </dl>
        </section>

        {/* Features */}
        <section id="features" className="mx-auto max-w-6xl px-6 py-20">
          <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
            What makes it different
          </h2>
          <BentoGrid columns={3} className="mt-8">
            {FEATURES.map((f) => (
              <BentoItem
                key={f.title}
                colSpan={f.span === "wide" ? 2 : 1}
                className="rounded-2xl border border-[color:var(--b-border)] bg-[color:var(--b-panel)] p-6"
              >
                <FxCard effect="spotlight" className="border-0 p-0 shadow-none">
                  <h3 className="font-display text-lg font-bold">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[color:var(--b-text-secondary)]">
                    {f.body}
                  </p>
                </FxCard>
              </BentoItem>
            ))}
          </BentoGrid>
        </section>

        {/* Closing CTA */}
        <section id="start" className="mx-auto max-w-3xl px-6 pb-24 text-center">
          <h2 className="font-display text-3xl font-black tracking-tight">
            One command. Nothing else.
          </h2>
          <pre className="mt-6 overflow-x-auto rounded-xl border border-[color:var(--b-border)] bg-[color:var(--b-panel)] p-4 text-left font-mono text-xs text-[color:var(--b-text-secondary)]">
            pnpm dlx shadcn@latest add @buildora/magnetic-button
          </pre>
          <div className="mt-8 flex justify-center">
            <MagneticButton strength={0.35} radius={160} variant="iris">
              Install it
            </MagneticButton>
          </div>
        </section>
      </main>

      <footer className="border-t border-[color:var(--b-border)] px-6 py-8 text-center text-xs text-[color:var(--b-muted)]">
        Northwind — a Buildora template
      </footer>
    </div>
  );
}
