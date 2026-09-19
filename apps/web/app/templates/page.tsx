"use client";

import Link from "next/link";
import * as React from "react";
import { motion } from "framer-motion";

const templates = [
  {
    slug: "dev-dashboard",
    name: "Developer Dashboard",
    icon: "⚡",
    gradient: "from-[#ffb86b]/15 via-transparent to-[#9d8cff]/10",
    uses: ["advanced-table", "terminal", "log-viewer", "usage-dashboard"],
    blurb: "Internal tools: sortable tables, live terminal, structured logs, usage charts. Everything keyboard-navigable.",
  },
  {
    slug: "ai-support",
    name: "AI Support Console",
    icon: "🤖",
    gradient: "from-[#9d8cff]/15 via-transparent to-[#d4ff4f]/10",
    uses: ["streaming-chat", "tool-call-viz", "token-meter", "comment-thread"],
    blurb: "Token-by-token streaming, tool call transparency, usage metering, and threaded review — all frontend-only.",
  },
  {
    slug: "onboarding",
    name: "Team Onboarding",
    icon: "👋",
    gradient: "from-[#4fe08a]/15 via-transparent to-[#ffb86b]/10",
    uses: ["onboarding-checklist", "team-switcher", "invite-flow", "pricing-table"],
    blurb: "Invite members, switch teams, track setup progress, display pricing. Complete SaaS onboarding flow.",
  },
  {
    slug: "creative-landing",
    name: "Creative Landing",
    icon: "✨",
    gradient: "from-[#d4ff4f]/15 via-transparent to-[#9d8cff]/10",
    uses: ["aurora-background", "morphing-typography", "magnetic-button", "particle-field"],
    blurb: "Aurora gradients, morphing headlines, magnetic CTAs, particle canvas. Visually stunning landing pages.",
  },
];

export default function TemplatesPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="font-display text-3xl font-black md:text-4xl">Templates</h1>
        <p className="mt-2 max-w-lg text-sm text-white/50">
          Composable starters built from registry components. Copy the pattern, remix freely. Everything is MIT.
        </p>
      </motion.div>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {templates.map((t, i) => (
          <motion.div
            key={t.slug}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.4 }}
            className={`group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] p-6 transition-all hover:border-[#d4ff4f]/25`}
          >
            {/* Background gradient */}
            <div className={`absolute inset-0 bg-gradient-to-br ${t.gradient} opacity-0 transition-opacity group-hover:opacity-100`} />

            <div className="relative">
              <div className="flex items-start gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/[0.06] text-xl">{t.icon}</span>
                <div>
                  <h2 className="font-display text-xl font-black">{t.name}</h2>
                  <p className="mt-1 text-sm leading-relaxed text-white/50">{t.blurb}</p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-1.5">
                {t.uses.map((u) => (
                  <Link
                    key={u}
                    href={`/components/${u}`}
                    className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 font-mono text-[11px] text-white/60 transition-colors hover:border-[#d4ff4f]/30 hover:text-[#d4ff4f]"
                  >
                    {u}
                  </Link>
                ))}
              </div>

              <div className="mt-4 b-code-block text-[11px]">
                <span className="text-white/30">$</span>{" "}
                <code className="text-[#d4ff4f]">
                  pnpm dlx shadcn@latest add {t.uses.slice(0, 2).map((u) => `@buildora/${u}`).join(" ")}
                </code>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-8 rounded-2xl border border-[#d4ff4f]/20 bg-[#d4ff4f]/[0.04] p-6 text-center"
      >
        <p className="font-display text-lg font-black">Build your own template</p>
        <p className="mt-1 text-sm text-white/50">
          Compose any combination from {templates.reduce((a, t) => a + t.uses.length, 0)}+ components. Every component is independently installable.
        </p>
        <Link
          href="/components"
          className="mt-4 inline-block rounded-xl bg-[#d4ff4f] px-5 py-2.5 text-sm font-bold text-black transition-transform hover:scale-[1.02] active:scale-[0.98]"
        >
          Browse all components →
        </Link>
      </motion.div>
    </div>
  );
}
