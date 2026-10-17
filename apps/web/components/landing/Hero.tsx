"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { totalComponents } from "@/lib/registry";
import { PhysicsWorkbench } from "./PhysicsWorkbench";
import { InstallBar } from "./InstallBar";

/* ─────────────────────────────────────────────────────
   HERO — claim, proof, command. The console below the
   fold line is not a mock: it's three live primitives.
   ───────────────────────────────────────────────────── */

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* ambient background */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div
          className="absolute left-1/2 top-[-260px] h-[560px] w-[900px] -translate-x-1/2 rounded-full blur-[130px]"
          style={{
            background:
              "radial-gradient(closest-side, color-mix(in oklab, var(--b-accent) 14%, transparent), color-mix(in oklab, var(--b-iris) 10%, transparent), transparent)",
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage:
              "linear-gradient(color-mix(in oklab, var(--b-text) 4%, transparent) 1px, transparent 1px), linear-gradient(90deg, color-mix(in oklab, var(--b-text) 4%, transparent) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
            maskImage: "radial-gradient(ellipse 80% 60% at 50% 0%, black 30%, transparent 75%)",
            WebkitMaskImage: "radial-gradient(ellipse 80% 60% at 50% 0%, black 30%, transparent 75%)",
          }}
        />
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-4 pb-20 pt-16 sm:px-6 sm:pt-24 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          {/* status pill */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 220, damping: 26 }}
            className="inline-flex flex-wrap items-center justify-center gap-x-3 gap-y-1 rounded-full border border-[color:var(--b-border)] bg-[color:var(--b-glass)] px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-[color:var(--b-text-secondary)] backdrop-blur-md"
          >
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--b-accent)] fx-pulse-soft" />
              v0.1 · {totalComponents} primitives
            </span>
            <span className="text-[color:var(--b-border-hover)]" aria-hidden="true">|</span>
            <span>MIT</span>
            <span className="text-[color:var(--b-border-hover)]" aria-hidden="true">|</span>
            <span>WCAG AAA</span>
            <span className="text-[color:var(--b-border-hover)]" aria-hidden="true">|</span>
            <span>SSR-safe</span>
          </motion.div>

          {/* headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 180, damping: 26, delay: 0.05 }}
            className="mt-7 font-display text-4xl font-bold leading-[1.04] tracking-[-0.035em] text-[color:var(--b-text)] sm:text-6xl lg:text-7xl text-balance"
          >
            Tactile UI primitives engineered with{" "}
            <span className="relative inline-block text-[color:var(--b-accent)]">
              real mass
              <motion.span
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ type: "spring", stiffness: 140, damping: 24, delay: 0.55 }}
                className="absolute -bottom-1 left-0 right-0 h-[3px] origin-left rounded-full bg-[color:var(--b-accent)] opacity-60"
                aria-hidden="true"
              />
            </span>{" "}
            and motion.
          </motion.h1>

          {/* subhead */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 180, damping: 26, delay: 0.12 }}
            className="mx-auto mt-6 max-w-2xl text-sm leading-relaxed text-[color:var(--b-text-secondary)] sm:text-lg text-balance"
          >
            Copy-paste kinetic primitives for React — springs with honest numbers,
            canvases that pause off-screen, and a token engine you can rewire live.
            No screenshots. No dead demos.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 180, damping: 26, delay: 0.18 }}
            className="mt-9 flex flex-wrap items-center justify-center gap-3"
          >
            <a
              href="#showcase"
              className="group inline-flex items-center gap-2 rounded-full bg-[color:var(--b-accent)] px-6 py-3 font-mono text-xs font-bold text-[color:var(--b-accent-foreground)] shadow-[0_0_32px_var(--b-accent-glow)] transition-transform hover:scale-[1.03] active:scale-[0.97] sm:text-sm"
            >
              Explore the showcase
              <span className="transition-transform group-hover:translate-y-0.5" aria-hidden="true">↓</span>
            </a>
            <Link
              href="/docs"
              className="inline-flex items-center gap-2 rounded-full border border-[color:var(--b-border)] bg-[color:var(--b-glass)] px-6 py-3 font-mono text-xs font-medium text-[color:var(--b-text-secondary)] backdrop-blur-md transition-colors hover:border-[color:var(--b-border-hover)] hover:text-[color:var(--b-text)] sm:text-sm"
            >
              Read the docs
            </Link>
            <span className="hidden items-center gap-2 px-1 font-mono text-[10px] uppercase tracking-[0.14em] text-[color:var(--b-muted)] md:inline-flex">
              or press{" "}
              <kbd className="rounded-md border border-[color:var(--b-border)] bg-[color:var(--b-surface)] px-1.5 py-0.5 text-[10px]">
                ⌘K
              </kbd>
            </span>
          </motion.div>

          {/* install bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 180, damping: 26, delay: 0.24 }}
            className="mt-9 flex justify-center"
          >
            <InstallBar slug="magnetic-button" />
          </motion.div>
        </div>

        {/* live console */}
        <motion.div
          initial={{ opacity: 0, y: 34 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 140, damping: 26, delay: 0.32 }}
          className="relative mx-auto mt-16 max-w-5xl"
        >
          <div
            className="pointer-events-none absolute -inset-10 rounded-[3rem] opacity-60 blur-3xl"
            style={{
              background:
                "linear-gradient(120deg, color-mix(in oklab, var(--b-accent) 12%, transparent), transparent 40%, color-mix(in oklab, var(--b-iris) 12%, transparent))",
            }}
            aria-hidden="true"
          />
          <div className="relative rounded-[2rem] border border-[color:var(--b-border)] bg-[color:color-mix(in oklab, var(--b-panel) 88%, transparent)] p-2 backdrop-blur-2xl">
            <PhysicsWorkbench />
          </div>
          <p className="mt-4 text-center font-mono text-[10px] uppercase tracking-[0.18em] text-[color:var(--b-muted)]">
            ↑ this console is live — drag the orb, flick the magnet, tune the sliders
          </p>
        </motion.div>
      </div>
    </section>
  );
}
