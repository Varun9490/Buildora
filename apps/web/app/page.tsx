"use client";

import Link from "next/link";
import * as React from "react";
import { motion } from "framer-motion";
import {
  MagneticButton,
  SlingshotOTP,
  FxCard,
  FxButton,
  ParticleField,
  RippleButton,
  ShimmerButton,
  HoldButton,
} from "@buildora/components";
import { copyToClipboard } from "@buildora/utils";
import { allComponents, totalComponents } from "@/lib/registry";
import { HeroConsole } from "@/components/HeroConsole";
import { FrameworkMatrix } from "@/components/FrameworkMatrix";

/* ─────────────────────────────────────────────────────
   ANIMATION VARIANTS (Awwwards-tier custom curves)
   ───────────────────────────────────────────────────── */
const sectionReveal = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  },
};

/* ─────────────────────────────────────────────────────
   MULTI-TAB CLI INSTALLER
   ───────────────────────────────────────────────────── */
function MultiTabCLI() {
  const [manager, setManager] = React.useState<"pnpm" | "bun" | "npm" | "yarn">("pnpm");
  const [copied, setCopied] = React.useState(false);

  const getCommand = () => {
    switch (manager) {
      case "pnpm":
        return "pnpm dlx shadcn@latest add @buildora/magnetic-button";
      case "bun":
        return "bunx --bun shadcn@latest add @buildora/magnetic-button";
      case "npm":
        return "npx shadcn@latest add @buildora/magnetic-button";
      case "yarn":
        return "yarn dlx shadcn@latest add @buildora/magnetic-button";
    }
  };

  const command = getCommand();

  return (
    <div className="w-full max-w-xl">
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl shadow-lg">
        {/* Tabs header */}
        <div className="flex items-center justify-between border-b border-white/[0.08] bg-white/[0.02] px-3 py-1.5">
          <div className="flex items-center gap-1">
            {(["pnpm", "bun", "npm", "yarn"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setManager(m)}
                className={`rounded-lg px-2.5 py-1 font-mono text-[11px] transition-colors ${
                  manager === m
                    ? "bg-white/10 text-[--b-text] font-semibold"
                    : "text-[--b-muted] hover:text-[--b-text-secondary]"
                }`}
              >
                {m}
              </button>
            ))}
          </div>

          <span className="font-mono text-[10px] text-[--b-muted]">REGISTRY CLI</span>
        </div>

        {/* Command line */}
        <div className="flex items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="font-mono text-xs text-[--b-accent] select-none">$</span>
            <code className="truncate font-mono text-xs text-[--b-text]">
              {command}
            </code>
          </div>

          <button
            onClick={async () => {
              await copyToClipboard(command);
              setCopied(true);
              setTimeout(() => setCopied(false), 1400);
            }}
            className="shrink-0 rounded-md border border-white/10 bg-white/5 px-3 py-1 font-mono text-[11px] font-medium text-[--b-text] transition-all hover:bg-white/10 hover:border-white/20 active:scale-95"
          >
            {copied ? "Copied ✓" : "Copy"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────
   BALANCED METRICS BAR (4 Machined Doppelrand Tiles)
   ───────────────────────────────────────────────────── */
function MetricsBar() {
  const metrics = [
    {
      value: `${totalComponents}+`,
      label: "Production Primitives",
      detail: "Spring physics, tactile inputs & AI UIs",
      icon: (
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
          <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
          <line x1="12" y1="22.08" x2="12" y2="12" />
        </svg>
      ),
    },
    {
      value: "11",
      label: "Framework Idioms",
      detail: "React, Svelte, Vue, Solid, RN, SwiftUI",
      icon: (
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
        </svg>
      ),
    },
    {
      value: "100%",
      label: "Accessible & Typed",
      detail: "WCAG AAA contrast & keyboard navigation",
      icon: (
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      ),
    },
    {
      value: "< 2kb",
      label: "Zero-Bloat Modular",
      detail: "Tree-shakeable direct code installation",
      icon: (
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
      ),
    },
  ];

  return (
    <motion.div
      variants={sectionReveal}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
    >
      {metrics.map((item) => (
        <motion.div
          key={item.label}
          variants={fadeUp}
          className="group relative rounded-2xl border border-white/10 bg-white/[0.02] p-1.5 transition-all duration-300 hover:border-white/20 hover:bg-white/[0.04]"
        >
          <div className="flex h-full flex-col justify-between rounded-[calc(1rem-0.25rem)] border border-white/[0.06] bg-[--b-panel]/80 p-5 backdrop-blur-md">
            <div className="flex items-center justify-between">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-[--b-border] bg-[--b-surface] text-[--b-accent]">
                {item.icon}
              </div>
              <span className="font-mono text-[10px] text-[--b-muted]">VERIFIED</span>
            </div>

            <div className="mt-4">
              <p className="font-display text-3xl font-bold tracking-tight text-[--b-text]">
                {item.value}
              </p>
              <p className="mt-1 font-mono text-[11px] font-semibold text-[--b-text-secondary] uppercase tracking-wider">
                {item.label}
              </p>
              <p className="mt-1 text-xs text-[--b-muted]">
                {item.detail}
              </p>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────
   LIVE INTERACTIVE BENTO GRID
   ───────────────────────────────────────────────────── */
function LiveInteractiveBento() {
  const [chatInput, setChatInput] = React.useState("");
  const [messages, setMessages] = React.useState([
    { role: "user", text: "Create an adaptive fluid motion button." },
    { role: "assistant", text: "Generated MagneticButton with mass damping 28 and stiffness 320." },
  ]);

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-12">
      {/* Bento Item 1: Slingshot OTP (Span 7) */}
      <motion.div
        variants={fadeUp}
        className="group relative rounded-[2rem] border border-white/10 bg-white/[0.02] p-2 md:col-span-3 lg:col-span-7"
      >
        <div className="flex h-full flex-col justify-between overflow-hidden rounded-[calc(2rem-0.5rem)] border border-white/[0.06] bg-[--b-panel] p-6">
          <div className="flex items-start justify-between">
            <div>
              <span className="rounded-full bg-[--b-accent-muted] px-2.5 py-0.5 font-mono text-[10px] font-medium text-[--b-accent] border border-[--b-accent]/20">
                SIGNATURE INPUT
              </span>
              <h3 className="mt-2 font-display text-xl font-bold text-[--b-text]">
                Slingshot OTP Input
              </h3>
              <p className="mt-1 text-xs text-[--b-muted]">
                Gamified drag-and-snap token verification with spring rebound physics.
              </p>
            </div>

            <Link
              href="/components/slingshot-otp"
              className="font-mono text-xs text-[--b-accent] hover:underline"
            >
              Docs ↗
            </Link>
          </div>

          <div className="my-8 flex items-center justify-center py-4 bg-[--b-surface]/40 rounded-2xl border border-[--b-border]">
            <SlingshotOTP length={4} />
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-[--b-border] font-mono text-[11px] text-[--b-muted]">
            <span>PHYSICS: SPRING REBOUND</span>
            <span className="text-[--b-text-secondary]">ACCESSIBLE KEYBOARD NATIVE</span>
          </div>
        </div>
      </motion.div>

      {/* Bento Item 2: Particle Field (Span 5) */}
      <motion.div
        variants={fadeUp}
        className="group relative rounded-[2rem] border border-white/10 bg-white/[0.02] p-2 md:col-span-3 lg:col-span-5"
      >
        <div className="relative flex h-full min-h-[300px] flex-col justify-between overflow-hidden rounded-[calc(2rem-0.5rem)] border border-white/[0.06] bg-[--b-panel] p-6">
          {/* Canvas particle background */}
          <div className="absolute inset-0 z-0 opacity-80 pointer-events-none">
            <ParticleField count={45} />
          </div>

          <div className="relative z-10 flex items-start justify-between">
            <div>
              <span className="rounded-full bg-[--b-iris]/10 px-2.5 py-0.5 font-mono text-[10px] font-medium text-[--b-iris] border border-[--b-iris]/20">
                GENERATIVE CANVAS
              </span>
              <h3 className="mt-2 font-display text-xl font-bold text-[--b-text]">
                Particle Dynamics
              </h3>
              <p className="mt-1 text-xs text-[--b-muted]">
                60fps interactive HTML5 canvas particle node simulation.
              </p>
            </div>

            <Link
              href="/components/particle-field"
              className="font-mono text-xs text-[--b-iris] hover:underline"
            >
              Docs ↗
            </Link>
          </div>

          <div className="relative z-10 mt-auto pt-6 flex items-center justify-between border-t border-white/10 font-mono text-[11px] text-[--b-muted]">
            <span>RENDER: 2D CONTEXT</span>
            <span className="text-[--b-text]">INTERACTIVE MOUSE ATTRACTION</span>
          </div>
        </div>
      </motion.div>

      {/* Bento Item 3: 3D Holographic Card (Span 4) */}
      <motion.div
        variants={fadeUp}
        className="group relative rounded-[2rem] border border-white/10 bg-white/[0.02] p-2 md:col-span-1 lg:col-span-4"
      >
        <div className="flex h-full flex-col justify-between overflow-hidden rounded-[calc(2rem-0.5rem)] border border-white/[0.06] bg-[--b-panel] p-6">
          <div>
            <span className="rounded-full bg-white/10 px-2.5 py-0.5 font-mono text-[10px] text-white">
              SURFACE FX
            </span>
            <h3 className="mt-2 font-display text-lg font-bold text-[--b-text]">
              Holographic Glare
            </h3>
            <p className="mt-1 text-xs text-[--b-muted]">
              Dynamic 3D gyro tilt with chromatic dispersion sheen.
            </p>
          </div>

          <div className="my-6 flex justify-center">
            <FxCard effect="holographic" className="w-full max-w-[240px] aspect-[4/3] p-4">
              <div className="flex h-full flex-col justify-between">
                <span className="font-mono text-[10px] text-white/70">BUILDORA FX</span>
                <p className="font-display text-sm font-bold text-white">Prism Layer 01</p>
              </div>
            </FxCard>
          </div>

          <Link
            href="/components/fx-card"
            className="flex items-center justify-between border-t border-[--b-border] pt-3 font-mono text-[11px] text-[--b-accent]"
          >
            <span>Explore Card Effects</span>
            <span>↗</span>
          </Link>
        </div>
      </motion.div>

      {/* Bento Item 4: Kinetic Buttons (Span 4) */}
      <motion.div
        variants={fadeUp}
        className="group relative rounded-[2rem] border border-white/10 bg-white/[0.02] p-2 md:col-span-1 lg:col-span-4"
      >
        <div className="flex h-full flex-col justify-between overflow-hidden rounded-[calc(2rem-0.5rem)] border border-white/[0.06] bg-[--b-panel] p-6">
          <div>
            <span className="rounded-full bg-white/10 px-2.5 py-0.5 font-mono text-[10px] text-white">
              KINETIC BUTTONS
            </span>
            <h3 className="mt-2 font-display text-lg font-bold text-[--b-text]">
              Haptic Micro-Actions
            </h3>
            <p className="mt-1 text-xs text-[--b-muted]">
              Liquid morph, ripple waves, shimmer streams, and hold-to-confirm.
            </p>
          </div>

          <div className="my-5 flex flex-col gap-2.5">
            <RippleButton className="w-full text-xs py-2 bg-[--b-accent] text-[--b-accent-foreground]">
              Click for Ripple Wave
            </RippleButton>
            <HoldButton holdDuration={1000} className="w-full text-xs py-2">
              Hold to Authorize (1s)
            </HoldButton>
            <ShimmerButton className="w-full text-xs py-2">
              Shimmer Stream
            </ShimmerButton>
          </div>

          <Link
            href="/components/fx-button"
            className="flex items-center justify-between border-t border-[--b-border] pt-3 font-mono text-[11px] text-[--b-accent]"
          >
            <span>Explore 6 Button Types</span>
            <span>↗</span>
          </Link>
        </div>
      </motion.div>

      {/* Bento Item 5: Magnetic Cursor Attraction (Span 4) */}
      <motion.div
        variants={fadeUp}
        className="group relative rounded-[2rem] border border-white/10 bg-white/[0.02] p-2 md:col-span-1 lg:col-span-4"
      >
        <div className="flex h-full flex-col justify-between overflow-hidden rounded-[calc(2rem-0.5rem)] border border-white/[0.06] bg-[--b-panel] p-6">
          <div>
            <span className="rounded-full bg-[--b-accent-muted] px-2.5 py-0.5 font-mono text-[10px] font-medium text-[--b-accent] border border-[--b-accent]/20">
              SPRING MASS
            </span>
            <h3 className="mt-2 font-display text-lg font-bold text-[--b-text]">
              Magnetic Proximity
            </h3>
            <p className="mt-1 text-xs text-[--b-muted]">
              Cursor attraction field with physical mass interpolation.
            </p>
          </div>

          <div className="my-8 flex flex-col items-center justify-center gap-3">
            <MagneticButton strength={0.6}>
              Feel the Pull
            </MagneticButton>
            <span className="font-mono text-[10px] text-[--b-muted]">
              Hover in proximity circle
            </span>
          </div>

          <Link
            href="/components/magnetic-button"
            className="flex items-center justify-between border-t border-[--b-border] pt-3 font-mono text-[11px] text-[--b-accent]"
          >
            <span>Inspect Magnetic Source</span>
            <span>↗</span>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────
   MAIN HOMEPAGE ARCHITECTURE
   ───────────────────────────────────────────────────── */
export default function Home() {
  return (
    <div className="relative overflow-x-clip">
      {/* Fixed Ambient Glow Orbs */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden opacity-60">
        <div className="absolute -top-40 left-1/2 h-[600px] w-[800px] -translate-x-1/2 rounded-full bg-gradient-to-b from-[--b-accent]/15 via-[--b-iris]/10 to-transparent blur-[120px]" />
      </div>

      {/* ── SECTION 1: HERO & HARDWARE CONSOLE ─────────── */}
      <section className="relative z-10 min-h-[90dvh] flex items-center pt-8 pb-20 sm:pt-14 sm:pb-28 lg:pt-20 lg:pb-36">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={sectionReveal}
            className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-14"
          >
            {/* Left Column: Vision & Narrative */}
            <div className="flex flex-col space-y-7 lg:col-span-6 xl:col-span-7">
              {/* Eyebrow badge */}
              <motion.div variants={fadeUp}>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1.5 backdrop-blur-md">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[--b-accent] opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-[--b-accent]" />
                  </span>
                  <span className="font-mono text-[11px] font-medium tracking-[0.15em] text-[--b-text-secondary] uppercase">
                    OPEN SOURCE REGISTRY · {totalComponents} COMPONENTS
                  </span>
                </span>
              </motion.div>

              {/* Main Headline */}
              <motion.h1
                variants={fadeUp}
                className="font-display font-bold tracking-[-0.035em] leading-[1.04] text-[--b-text] text-balance"
                style={{ fontSize: "clamp(2.4rem, 5.5vw, 4.2rem)" }}
              >
                Tactile UI primitives for production apps.
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                variants={fadeUp}
                className="max-w-xl text-base sm:text-lg leading-relaxed text-[--b-text-secondary] text-balance"
              >
                Engineered with real spring mass physics, fluid motion tokens, and
                cross-framework idioms. Drop-in via the shadcn CLI with zero vendor lock-in.
              </motion.p>

              {/* Button-in-Button Nested CTAs */}
              <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-4 pt-1">
                <Link
                  href="/components"
                  className="group relative inline-flex items-center gap-3 rounded-full bg-[--b-accent] px-6 py-3 font-mono text-xs sm:text-sm font-semibold text-[--b-accent-foreground] shadow-[0_0_30px_var(--b-accent-muted)] transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span>Explore {totalComponents} Components</span>
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-black/15 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                    ↗
                  </span>
                </Link>

                <Link
                  href="/playground"
                  className="inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.03] px-6 py-3 font-mono text-xs sm:text-sm font-medium text-[--b-text] backdrop-blur-md transition-all hover:bg-white/[0.08] hover:border-white/20 active:scale-[0.98]"
                >
                  <span>Creative Lab</span>
                  <kbd className="rounded border border-white/10 bg-white/5 px-1.5 py-0.5 text-[10px] text-[--b-muted]">
                    ⌘P
                  </kbd>
                </Link>
              </motion.div>

              {/* Multi-Tab Package Manager Installer */}
              <motion.div variants={fadeUp} className="pt-2">
                <MultiTabCLI />
              </motion.div>
            </div>

            {/* Right Column: High-End Hardware Console */}
            <motion.div
              variants={fadeUp}
              className="lg:col-span-6 xl:col-span-5"
            >
              <HeroConsole />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── SECTION 2: VERIFIED METRICS BAR ────────────── */}
      <section className="relative z-10 border-y border-white/[0.08] bg-white/[0.01] py-14 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <MetricsBar />
        </div>
      </section>

      {/* ── SECTION 3: LIVE TACTILE BENTO GRID ─────────── */}
      <section className="relative z-10 py-24 sm:py-32 lg:py-40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={sectionReveal}
            className="mb-14 max-w-2xl"
          >
            <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 font-mono text-[10px] font-medium tracking-widest text-[--b-accent] uppercase">
              TACTILE SHOWCASE
            </span>
            <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-[--b-text] sm:text-4xl">
              Components you can feel before installing.
            </h2>
            <p className="mt-3 text-sm sm:text-base leading-relaxed text-[--b-text-secondary]">
              Every demonstration below is a live, reactive component running in real time.
              Test drag gestures, spring damping, and specular lighting in place.
            </p>
          </motion.div>

          <LiveInteractiveBento />
        </div>
      </section>

      {/* ── SECTION 4: CROSS-FRAMEWORK TRANSLATION ─────── */}
      <section className="relative z-10 border-t border-white/[0.08] bg-white/[0.01] py-24 sm:py-32 lg:py-40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={sectionReveal}
            className="mb-14 max-w-2xl"
          >
            <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 font-mono text-[10px] font-medium tracking-widest text-[--b-iris] uppercase">
              UNIVERSAL PORTABILITY
            </span>
            <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-[--b-text] sm:text-4xl">
              One intent. Eleven idiomatic translations.
            </h2>
            <p className="mt-3 text-sm sm:text-base leading-relaxed text-[--b-text-secondary]">
              React is the source of truth. Every other framework receives an authentic native
              port — preserving spring curves, gesture listeners, and token bindings.
            </p>
          </motion.div>

          <FrameworkMatrix />
        </div>
      </section>

      {/* ── SECTION 5: ENGINEERING ARCHITECTURE ────────── */}
      <section className="relative z-10 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-14 text-center">
            <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 font-mono text-[10px] font-medium tracking-widest text-[--b-text-secondary] uppercase">
              CRAFT PRINCIPLES
            </span>
            <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-[--b-text] sm:text-4xl">
              Built for production scale.
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {[
              {
                title: "shadcn CLI Standard",
                desc: "Direct source code installation into your repository. No opaque node_modules lock-in; customize everything.",
                badge: "ZERO LOCK-IN",
              },
              {
                title: "GPU Hardware Transforms",
                desc: "All physical spring simulations run strictly on transform and opacity layers, guaranteeing 60fps with zero layout reflows.",
                badge: "60 FPS GUARANTEE",
              },
              {
                title: "Universal Token Engine",
                desc: "Stone-neutral base with swappable accent palettes (Acid, Iris, Amber, Emerald) and automatic dark/OLED modes.",
                badge: "SWAPPABLE ACCENTS",
              },
            ].map((pillar) => (
              <div
                key={pillar.title}
                className="rounded-[2rem] border border-white/10 bg-white/[0.02] p-2"
              >
                <div className="flex h-full flex-col justify-between rounded-[calc(2rem-0.5rem)] border border-white/[0.06] bg-[--b-panel] p-6">
                  <div>
                    <span className="font-mono text-[10px] font-semibold text-[--b-accent]">
                      {pillar.badge}
                    </span>
                    <h3 className="mt-3 font-display text-lg font-bold text-[--b-text]">
                      {pillar.title}
                    </h3>
                    <p className="mt-2 text-xs sm:text-sm leading-relaxed text-[--b-text-secondary]">
                      {pillar.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 6: ACTION / FINAL LAUNCHPAD ─────────── */}
      <section className="relative z-10 border-t border-white/[0.08] py-28 sm:py-36">
        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6">
          <div className="absolute -inset-8 rounded-[3rem] bg-gradient-to-r from-[--b-accent]/15 to-[--b-iris]/15 blur-3xl opacity-60 pointer-events-none" />

          <div className="relative rounded-[2.5rem] border border-white/10 bg-[--b-panel]/90 p-8 sm:p-14 backdrop-blur-2xl shadow-2xl">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[--b-accent]">
              ELEVATE YOUR INTERFACE
            </span>

            <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-[--b-text] sm:text-5xl text-balance">
              Build interfaces your users will actually feel.
            </h2>

            <p className="mx-auto mt-4 max-w-lg text-sm sm:text-base text-[--b-text-secondary] text-balance">
              Free and open source. Drop into your project in seconds and start shipping
              tactile digital experiences.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/components"
                className="group inline-flex items-center gap-3 rounded-full bg-[--b-accent] px-7 py-3.5 font-mono text-sm font-semibold text-[--b-accent-foreground] shadow-[0_0_30px_var(--b-accent-muted)] transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Browse All Components</span>
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-black/15 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                  ↗
                </span>
              </Link>

              <a
                href="https://github.com/Varun9490/Buildora"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-7 py-3.5 font-mono text-sm font-medium text-[--b-text] transition-all hover:bg-white/[0.08]"
              >
                <span>Star on GitHub</span>
                <span className="text-xs text-[--b-muted]">★</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
