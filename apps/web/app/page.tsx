"use client";

import Link from "next/link";
import * as React from "react";
import { motion } from "framer-motion";
import {
  MagneticButton,
  SlingshotOTP,
  FxCard,
  FxButton,
  CursorFx,
  TextFx,
} from "@buildora/components";
import { copyToClipboard } from "@buildora/utils";
import { allComponents, totalComponents } from "@/lib/registry";
import { ComponentPreview } from "@/components/ComponentPreview";
import { cn } from "@buildora/utils";

/* ─────────────────────────────────────────────────────
   ANIMATION VARIANTS
   ───────────────────────────────────────────────────── */
const sectionReveal = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.1 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

/* ─────────────────────────────────────────────────────
   SVG ICON PRIMITIVES (replacing emojis)
   ───────────────────────────────────────────────────── */
function IconCube({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  );
}

function IconBolt({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}

function IconGrid({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}

function IconShield({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

function IconCode({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  );
}

function IconBeaker({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M4.5 3h15M6 3v7.5a6 6 0 0 0 12 0V3M9 3v4.5a3 3 0 0 0 6 0V3" />
      <path d="M6 10.5c0 4 2.69 7.5 6 7.5s6-3.5 6-7.5" />
    </svg>
  );
}

/* ─────────────────────────────────────────────────────
   BENTO GRID — Asymmetric showcase
   ───────────────────────────────────────────────────── */
function BentoGrid() {
  const showcaseItems = [
    { title: "Magnetic Button", desc: "Spring physics cursor attraction", component: "magnetic-button" },
    { title: "Slingshot OTP", desc: "Gamified verification with pull-to-place", component: "slingshot-otp" },
    { title: "Particle Field", desc: "Lightweight canvas particle system", component: "particle-field" },
    { title: "Physics Kanban", desc: "Drag with spring-physics snap zones", component: "kanban" },
    { title: "Streaming Chat", desc: "Token-by-token LLM streaming UI", component: "streaming-chat" },
  ];

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3" style={{ gridAutoFlow: "dense" }}>
      {showcaseItems.map((item, i) => (
        <motion.div
          key={item.component}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.06, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className={cn(
            i === 1 && "sm:col-span-2 lg:col-span-1",
          )}
        >
          <Link
            href={`/components/${item.component}`}
            className="group flex h-full flex-col overflow-hidden b-card-interactive"
          >
            {/* Live preview — the component itself demonstrates itself (§8) */}
            <ComponentPreview slug={item.component} />
            <div className="flex flex-1 flex-col p-5">
              <span className="b-badge-accent self-start">
                {item.component}
              </span>
              <h4 className="mt-3 font-display text-base font-bold tracking-tight group-hover:text-[--b-accent] transition-colors">
                {item.title}
              </h4>
              <p className="mt-1.5 text-sm text-[--b-muted] leading-relaxed">
                {item.desc}
              </p>
              <div className="mt-auto pt-4">
                <span className="inline-flex items-center gap-1.5 text-sm font-medium text-[--b-accent] opacity-0 group-hover:opacity-100 transition-opacity">
                  View component
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────────────
   COPY INSTALL — High-contrast command block
   ───────────────────────────────────────────────────── */
function CopyInstall() {
  const [copied, setCopied] = React.useState(false);
  const cmd = "pnpm dlx shadcn@latest add @buildora/magnetic-button";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="max-w-xl"
    >
      <div className="flex items-center gap-3 rounded-[10px] border border-[--b-border] bg-[--b-surface] px-4 py-3">
        <span className="font-mono text-sm text-[--b-muted] select-none">$</span>
        <code className="flex-1 truncate font-mono text-[13px] text-[--b-text]">
          {cmd}
        </code>
        <button
          onClick={async () => {
            await copyToClipboard(cmd);
            setCopied(true);
            setTimeout(() => setCopied(false), 1400);
          }}
          className="shrink-0 rounded-md bg-[--b-accent] px-3 py-1 font-mono text-[11px] font-bold text-[--b-accent-foreground] transition-transform active:scale-95"
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────
   STATS BAR — Clean SVG icons, no emojis
   ───────────────────────────────────────────────────── */
function StatsBar() {
  const stats = [
    { value: String(totalComponents), label: "Components", icon: <IconCube className="h-5 w-5" /> },
    { value: "7", label: "Categories", icon: <IconGrid className="h-5 w-5" /> },
    { value: "MIT", label: "License", icon: <IconShield className="h-5 w-5" /> },
  ];

  return (
    <motion.div
      variants={sectionReveal}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="grid grid-cols-2 gap-3 sm:grid-cols-4"
    >
      {stats.map((stat) => (
        <motion.div
          key={stat.label}
          variants={fadeUp}
          className="group rounded-[10px] border border-[--b-border] bg-[--b-panel] p-5 text-center transition-all duration-300 hover:border-[--b-border-hover]"
        >
          <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-lg bg-[--b-surface] text-[--b-text-secondary]">
            {stat.icon}
          </div>
          <p className="mt-3 font-display text-2xl font-bold tracking-tight text-[--b-text]">
            {stat.value}
          </p>
          <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.12em] text-[--b-muted]">
            {stat.label}
          </p>
        </motion.div>
      ))}
    </motion.div>
  );
}

function FrameworkBadges() {
  return null;
}


/* ─────────────────────────────────────────────────────
   CREATIVE STRIP — Atmospheric effects showcase
   ───────────────────────────────────────────────────── */
function CreativeStrip() {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={sectionReveal}
      className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
    >
      <motion.div variants={fadeUp}>
        <CursorFx mode="spotlight" />
      </motion.div>

      <motion.div variants={fadeUp}>
        <FxCard effect="tilt" className="w-64 aspect-[3/4] p-4"><div className="h-full rounded-lg bg-[--b-surface]/50" /></FxCard>
      </motion.div>

      <motion.div variants={fadeUp}>
        <FxCard effect="holographic" className="w-64 aspect-[3/4] p-4"><div className="h-full rounded-lg bg-[--b-surface]/50" /></FxCard>
      </motion.div>

      <motion.div variants={fadeUp}>
        <FxCard effect="tilt" className="w-64 aspect-[3/4] p-4"><div className="h-full rounded-lg bg-[--b-surface]/50" /></FxCard>
      </motion.div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────
   HOME PAGE — AIDA Structure
   A = Attention (Hero)
   I = Interest (Bento Grid + Creative Strip)
   D = Desire (Framework showcase)
   A = Action (Developer CTA)
   ───────────────────────────────────────────────────── */
export default function Home() {
  return (
    <div className="relative">
      {/* ── ATTENTION: Hero Section ────────────────────── */}
      <section className="relative min-h-[100dvh] flex items-center">
        <div className="absolute inset-0 bg-gradient-radial" />
        <div className="absolute inset-0 bg-grid-scan opacity-40" />

        <div className="relative mx-auto w-full max-w-7xl px-4 py-16 sm:py-24 lg:py-32">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={sectionReveal}
            className="flex flex-col gap-12 lg:flex-row lg:items-center lg:gap-16"
          >
            {/* Left: Copy */}
            <div className="flex-1 space-y-8">
              <motion.div variants={fadeUp}>
                <span className="b-badge-accent">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[--b-accent] opacity-75" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[--b-accent]" />
                  </span>
                  <span>OPEN SOURCE · {totalComponents} COMPONENTS</span>
                </span>
              </motion.div>

              <motion.h1
                variants={fadeUp}
                className="max-w-2xl font-display font-bold tracking-tight leading-[1.05] text-[--b-text]"
                style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)" }}
              >
                One system.
                <br />
                Any product.
              </motion.h1>

              <motion.p
                variants={fadeUp}
                className="max-w-md text-base leading-relaxed text-[--b-text-secondary]"
              >
                Universal, theme-aware components. Light and dark, swappable accent,
                accessible by default.
              </motion.p>

              <motion.div variants={fadeUp} className="flex flex-wrap gap-3">
                <Link href="/components">
                  <MagneticButton>
                    Explore Components
                    <svg
                      className="ml-1.5 h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </MagneticButton>
                </Link>
                <a
                  href="https://github.com/buildora/buildora"
                  target="_blank"
                  rel="noreferrer"
                >
                  <FxButton effect="liquid">Explore</FxButton>
                </a>
              </motion.div>

              <CopyInstall />
            </div>

            {/* Right: Live showcase */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="hidden w-full max-w-md lg:block"
            >
              <div className="space-y-3">
                {/* Preview card 1 */}
                <div className="b-card p-5">
                  <p className="b-section-label mb-3">Live Demo</p>
                  <div className="flex flex-wrap gap-2">
                    <MagneticButton strength={0.4}>Ship it</MagneticButton>
                    <MagneticButton strength={0.4} variant="ghost">Ghost</MagneticButton>
                  </div>
                </div>

                {/* Preview card 2 */}
                <div className="b-card p-5">
                  <p className="b-section-label mb-3">Signature OTP</p>
                  <SlingshotOTP length={4} />
                </div>

                {/* Preview card 3 */}
                <div className="b-card p-5">
                  <p className="b-section-label mb-3">Morphing Text</p>
                  <TextFx kind="morph" text={["Morphing", "Typography"]} />
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── Divider ──────────────────────────────────── */}
      <div className="b-gradient-line" />

      {/* ── Stats Section ─────────────────────────────── */}
      <section className="bg-[--b-panel]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:py-16">
          <StatsBar />
        </div>
      </section>

      <div className="b-gradient-line" />

      {/* ── INTEREST: Interactive Bento ────────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-24 sm:py-32">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={sectionReveal}
          className="mb-12"
        >
          <motion.h2
            variants={fadeUp}
            className="font-display text-2xl font-bold tracking-tight sm:text-3xl"
          >
            Interactive component showcase
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="mt-3 max-w-2xl text-sm text-[--b-muted] sm:text-base leading-relaxed"
          >
            Every component below is a real, live React implementation. Hover, click,
            drag, type — they are all interactive.
          </motion.p>
        </motion.div>

        <BentoGrid />
      </section>

      {/* ── Creative atmosphere effects ────────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-24 sm:py-32">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={sectionReveal}
          className="mb-12"
        >
          <motion.h2
            variants={fadeUp}
            className="font-display text-2xl font-bold tracking-tight sm:text-3xl"
          >
            Creative atmosphere effects
          </motion.h2>
        </motion.div>

        <CreativeStrip />
      </section>

      <div className="b-gradient-line" />

      {/* ── DESIRE: Framework showcase ─────────────────── */}
      <section className="bg-[--b-panel]">
        <div className="mx-auto max-w-7xl px-4 py-24 sm:py-32">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={sectionReveal}
          >
            <motion.h2
              variants={fadeUp}
              className="font-display text-2xl font-bold tracking-tight sm:text-3xl"
            >
              One intent, eleven idioms
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="mt-3 max-w-2xl text-sm text-[--b-muted] sm:text-base leading-relaxed"
            >
              React is the source of truth. Every other framework gets an idiomatic
              port — honest status badges tell you exactly what is production-ready.
            </motion.p>

            <motion.div variants={fadeUp} className="mt-8">
              <FrameworkBadges />
            </motion.div>

            <motion.div
              variants={sectionReveal}
              className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
            >
              {allComponents.slice(0, 8).map((c, i) => (
                <motion.div key={c.slug} variants={fadeUp}>
                  <Link
                    href={`/components/${c.slug}`}
                    className="group block b-card-interactive p-5"
                  >
                    <p className="font-mono text-[10px] text-[--b-accent]">
                      {c.categories[0]}
                    </p>
                    <p className="mt-1.5 font-display text-sm font-bold tracking-tight group-hover:text-[--b-accent] transition-colors">
                      {c.name}
                    </p>
                    <p className="mt-1.5 line-clamp-2 text-[13px] text-[--b-muted] leading-relaxed">
                      {c.description}
                    </p>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      <div className="b-gradient-line" />

      {/* ── ACTION: Developer CTA ─────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-24 sm:py-32">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={sectionReveal}
        >
          <motion.h2
            variants={fadeUp}
            className="mb-12 font-display text-2xl font-bold tracking-tight sm:text-3xl"
          >
            Built for developers
          </motion.h2>

          <motion.div
            variants={sectionReveal}
            className="grid gap-3 md:grid-cols-3"
          >
            {[
              {
                icon: <IconCode className="h-5 w-5 text-[--b-accent]" />,
                title: "Open source",
                desc: "MIT components, hooks, tokens, and tests. GitHub is the source of truth; this site is the polished playground.",
                link: { label: "Contribute", href: "https://github.com/buildora/buildora" },
                featured: false,
              },
              {
                icon: <IconCube className="h-5 w-5 text-[--b-accent]" />,
                title: "shadcn registry",
                desc: "Drop-in components via the shadcn CLI. No custom domain needed — GitHub-hosted registry.",
                link: { label: "Open registry", href: "/registry" },
                featured: true,
              },
              {
                icon: <IconBeaker className="h-5 w-5 text-[--b-accent]" />,
                title: "Creative lab",
                desc: "Tune spring physics, magnetism, glow intensity in the live playground — then copy the exact production code.",
                link: { label: "Open playground", href: "/playground" },
                featured: false,
              },
            ].map((item) => (
              <motion.div
                key={item.title}
                variants={fadeUp}
                className={cn(
                  "group b-card p-6",
                  item.featured && "border-accent-wash bg-accent-wash"
                )}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[--b-surface] transition-transform duration-300 group-hover:scale-105">
                  {item.icon}
                </div>
                <h3 className="mt-5 font-display text-base font-bold tracking-tight">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[--b-muted]">
                  {item.desc}
                </p>
                <Link
                  href={item.link.href}
                  className={cn(
                    "mt-5 inline-flex items-center gap-1.5 rounded-md px-4 py-2 text-sm font-medium transition-all duration-200",
                    item.featured
                      ? "bg-[--b-accent] text-[--b-accent-foreground] active:scale-[0.97]"
                      : "border border-[--b-border] text-[--b-text-secondary] hover:bg-[--b-surface] hover:border-[--b-border-hover]"
                  )}
                >
                  {item.link.label}
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
}
