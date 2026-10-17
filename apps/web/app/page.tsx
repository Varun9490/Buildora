import Link from "next/link";
import { Hero } from "@/components/landing/Hero";
import { BentoShowcase } from "@/components/landing/BentoShowcase";
import { ComponentExplorer } from "@/components/landing/ComponentExplorer";
import { PhysicsLab } from "@/components/landing/PhysicsLab";
import { FrameworkStudio } from "@/components/landing/FrameworkStudio";
import { CraftPrinciples } from "@/components/landing/CraftPrinciples";
import { InstallBar } from "@/components/landing/InstallBar";
import { totalComponents } from "@/lib/registry";

/* ─────────────────────────────────────────────────────
   LANDING — assembled from live sections only.
   Every anchor is real, every number is derived.
   ───────────────────────────────────────────────────── */

export default function HomePage() {
  return (
    <>
      <Hero />
      <BentoShowcase />
      <ComponentExplorer />
      <PhysicsLab />
      <FrameworkStudio />
      <CraftPrinciples />

      {/* ── Final CTA ── */}
      <section className="relative mx-auto w-full max-w-7xl px-4 pb-28 sm:px-6 lg:px-8">
        <div
          className="pointer-events-none absolute -inset-x-8 top-1/2 h-72 -translate-y-1/2 rounded-[4rem] opacity-50 blur-3xl"
          style={{
            background:
              "linear-gradient(90deg, color-mix(in oklab, var(--b-accent) 14%, transparent), color-mix(in oklab, var(--b-iris) 14%, transparent))",
          }}
          aria-hidden="true"
        />
        <div className="relative overflow-hidden rounded-[2.5rem] border border-[color:var(--b-border)] bg-[color:color-mix(in_oklab,var(--b-panel)_92%,transparent)] px-6 py-14 text-center backdrop-blur-2xl sm:px-14">
          <h2 className="mx-auto max-w-2xl font-display text-3xl font-bold tracking-tight text-[color:var(--b-text)] sm:text-4xl lg:text-5xl text-balance">
            Start with the primitive that sells it.
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-[color:var(--b-text-secondary)] sm:text-base text-balance">
            {totalComponents} primitives, one command, nothing else touched.
            The magnetic button is the fastest way to feel the difference.
          </p>

          <div className="mt-8 flex justify-center">
            <InstallBar slug="magnetic-button" />
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/components"
              className="inline-flex items-center gap-2 rounded-full bg-[color:var(--b-accent)] px-6 py-3 font-mono text-xs font-bold text-[color:var(--b-accent-foreground)] shadow-[0_0_32px_var(--b-accent-glow)] transition-transform hover:scale-[1.03] active:scale-[0.97] sm:text-sm"
            >
              Browse all components
            </Link>
            <Link
              href="/templates"
              className="inline-flex items-center gap-2 rounded-full border border-[color:var(--b-border)] px-6 py-3 font-mono text-xs font-medium text-[color:var(--b-text-secondary)] transition-colors hover:border-[color:var(--b-border-hover)] hover:text-[color:var(--b-text)] sm:text-sm"
            >
              See templates
            </Link>
            <a
              href="https://github.com/Varun9490/Buildora"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-[color:var(--b-border)] px-6 py-3 font-mono text-xs font-medium text-[color:var(--b-text-secondary)] transition-colors hover:border-[color:var(--b-border-hover)] hover:text-[color:var(--b-text)] sm:text-sm"
            >
              Star on GitHub
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
