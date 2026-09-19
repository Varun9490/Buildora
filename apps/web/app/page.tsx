"use client";

import Link from "next/link";
import * as React from "react";
import { motion } from "framer-motion";
import {
  MagneticButton, LiquidButton, MagneticCard, SlingshotOTP,
  AuroraBackground, ParticleField, CursorSpotlight, MorphingTypography,
  HolographicCard, Interactive3DCard, TactileLoader, StreamingChat, Kanban, AdvancedTable, Terminal
} from "@buildora/components";
import { allComponents, totalComponents } from "@/lib/registry";

export default function Home() {
  return (
    <div>
      {/* HERO */}
      <section className="b-grid-bg relative overflow-hidden">
        <AuroraBackground className="border-0 bg-transparent">
          <div className="mx-auto max-w-7xl px-4 pb-10 pt-14 md:pt-20">
            <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <p className="font-mono text-xs tracking-[0.25em] text-[#d4ff4f]">BUILDORA · BUILD · REMIX · SHIP</p>
              <h1 className="mt-2 font-display text-6xl font-black leading-[0.95] tracking-tight md:text-8xl">BUILDORA</h1>
              <p className="mt-3 max-w-2xl font-display text-xl font-bold md:text-2xl">Creative components for serious developers.</p>
              <p className="mt-2 max-w-2xl text-sm text-white/60 md:text-base">Production-ready components with expressive interactions, multiple framework implementations, and an open-source developer-first workflow. {totalComponents} components in the registry.</p>
              <div className="mt-5 flex flex-wrap gap-2">
                <Link href="/components"><MagneticButton>Explore Components</MagneticButton></Link>
                <a href="https://github.com/buildora/buildora" target="_blank" rel="noreferrer"><LiquidButton>View GitHub ↗</LiquidButton></a>
              </div>
              <p className="mt-3 font-mono text-xs text-white/40">pnpm dlx shadcn@latest add @buildora/magnetic-button</p>
            </motion.div>

            {/* interactive demo strip */}
            <div className="mt-8 grid gap-3 md:grid-cols-4">
              <CursorSpotlight>
                <p className="text-xs uppercase tracking-wider text-white/40">Magnetic</p>
                <div className="mt-2"><MagneticButton strength={0.4}>Hover me</MagneticButton></div>
              </CursorSpotlight>
              <MagneticCard>
                <p className="text-xs uppercase tracking-wider text-white/40">Tilt card</p>
                <p className="mt-1 font-display font-bold">Move your cursor — light follows.</p>
              </MagneticCard>
              <HolographicCard>
                <p className="text-xs uppercase tracking-wider text-white/40">Holographic</p>
                <MorphingTypography words={["Build", "Remix", "Ship"]} className="text-2xl" />
              </HolographicCard>
              <Interactive3DCard>
                <p className="text-xs uppercase tracking-wider text-white/40">3D flip</p>
                <p className="mt-1 text-sm font-bold">Click to flip for specs</p>
              </Interactive3DCard>
            </div>
          </div>
        </AuroraBackground>
      </section>

      {/* SHOWCASE */}
      <section className="mx-auto max-w-7xl px-4 py-12">
        <div className="flex items-end justify-between">
          <h2 className="font-display text-2xl font-black">Interactive component showcase</h2>
          <Link href="/components" className="text-sm text-[#d4ff4f] hover:underline">All {totalComponents} →</Link>
        </div>
        <div className="mt-4 grid gap-3 lg:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
            <p className="mb-2 font-mono text-[11px] text-white/40">SIGNATURE · slingshot-otp</p>
            <SlingshotOTP length={4} />
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
            <p className="mb-2 font-mono text-[11px] text-white/40">AI · streaming-chat</p>
            <StreamingChat seed="Buttons pull. Cards tilt. Tables sort. Everything stays keyboard-accessible." />
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
            <p className="mb-2 font-mono text-[11px] text-white/40">COMPLEX · kanban</p>
            <Kanban />
          </div>
        </div>
        <div className="mt-3 grid gap-3 lg:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4"><p className="mb-2 font-mono text-[11px] text-white/40">DATA · advanced-table</p><AdvancedTable /></div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4"><p className="mb-2 font-mono text-[11px] text-white/40">DEV · terminal</p><Terminal /></div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
            <p className="mb-2 font-mono text-[11px] text-white/40">ATMOSPHERE · particle-field</p>
            <ParticleField />
            <p className="mt-2 flex items-center gap-2 text-xs text-white/50"><TactileLoader /> lazy-safe, canvas only</p>
          </div>
        </div>
      </section>

      {/* FRAMEWORK ECOSYSTEM */}
      <section className="border-y border-white/10 bg-[#0b0d13]">
        <div className="mx-auto max-w-7xl px-4 py-12">
          <h2 className="font-display text-2xl font-black">One intent, eleven idioms</h2>
          <p className="mt-1 max-w-2xl text-sm text-white/55">React is the source of truth. Every other framework gets an idiomatic port — never naive syntax conversion, never faked support.</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {["React", "JavaScript", "Vue", "Svelte", "Angular", "HTML/CSS/JS", "Tailwind", "React Native", "Flutter", "SwiftUI", "Jetpack Compose"].map((f) => (
              <span key={f} className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 font-mono text-xs text-white/70">{f}</span>
            ))}
          </div>
          <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {allComponents.slice(0, 8).map((c) => (
              <Link key={c.slug} href={`/components/${c.slug}`} className="rounded-xl border border-white/10 bg-white/[0.02] p-3 hover:border-[#d4ff4f]/40">
                <p className="font-mono text-[11px] text-[#d4ff4f]">{c.slug}</p>
                <p className="text-sm font-bold">{c.name}</p>
                <p className="line-clamp-2 text-xs text-white/50">{c.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* OPEN SOURCE + REGISTRY */}
      <section className="mx-auto max-w-7xl grid gap-3 px-4 py-12 md:grid-cols-3">
        <div className="rounded-2xl border border-white/10 p-5">
          <h3 className="font-display font-black">Open source</h3>
          <p className="mt-1 text-sm text-white/55">MIT components, hooks, tokens, tests. GitHub is the source of truth; this site is the polished playground.</p>
          <a href="https://github.com/buildora/buildora" className="mt-3 inline-block rounded-xl border border-white/15 px-3 py-1.5 text-sm hover:bg-white/10">Contribute ↗</a>
        </div>
        <div className="rounded-2xl border border-[#d4ff4f]/25 bg-[#d4ff4f]/[0.05] p-5">
          <h3 className="font-display font-black">shadcn registry</h3>
          <p className="mt-1 font-mono text-xs text-white/60">pnpm dlx shadcn@latest add @buildora/magnetic-button</p>
          <Link href="/registry" className="mt-3 inline-block rounded-xl bg-[#d4ff4f] px-3 py-1.5 text-sm font-bold text-black">Open registry →</Link>
        </div>
        <div className="rounded-2xl border border-white/10 p-5">
          <h3 className="font-display font-black">Creative lab</h3>
          <p className="mt-1 text-sm text-white/55">Tune springs, magnetism, glow in the playground — then copy the exact code.</p>
          <Link href="/playground" className="mt-3 inline-block rounded-xl border border-white/15 px-3 py-1.5 text-sm hover:bg-white/10">Open playground →</Link>
        </div>
      </section>
    </div>
  );
}
