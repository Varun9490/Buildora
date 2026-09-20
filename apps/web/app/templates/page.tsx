"use client";

import Link from "next/link";
import * as React from "react";
import { motion } from "framer-motion";
import { totalComponents } from "@/lib/registry";

const templates = [
  {
    slug: "ai-agent",
    name: "AI Agent Console",
    icon: "bot",
    image: "/previews/ai-agent.png",
    gradient: "from-accent-wash via-transparent to-accent-wash",
    uses: ["streaming-chat", "spatial-command-palette"],
    blurb: "Token-by-token streaming, tool call transparency, and spatial commands — all frontend-only.",
  },
  {
    slug: "creative-portfolio",
    name: "Creative Portfolio",
    icon: "spark",
    image: "/previews/creative-portfolio.png",
    gradient: "from-accent-wash via-transparent to-accent-wash",
    uses: ["magnetic-button", "morphing-typography"],
    blurb: "Premium editorial layouts, magnetic CTAs, smooth scrolling. Visually stunning and minimal.",
  },
];

function TemplateIcon({ name, className }: { name: string; className?: string }) {
  const common = {
    className,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };
  if (name === "bot") {
    return (
      <svg {...common}>
        <rect x="4" y="8" width="16" height="12" rx="2" />
        <circle cx="9" cy="14" r="1.25" fill="currentColor" stroke="none" />
        <circle cx="15" cy="14" r="1.25" fill="currentColor" stroke="none" />
        <path d="M12 8V4" />
        <circle cx="12" cy="3" r="1" />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <path d="M12 3l1.7 4.6L18 9.3l-4.3 1.7L12 15.6l-1.7-4.6L6 9.3l4.3-1.7L12 3z" />
      <path d="M18.5 15l.9 2.1 2.1.9-2.1.9-.9 2.1-.9-2.1-2.1-.9 2.1-.9.9-2.1z" />
    </svg>
  );
}

export default function TemplatesPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="font-display text-3xl font-black md:text-4xl">Templates</h1>
        <p className="mt-2 max-w-lg text-sm text-[--b-text-secondary]">
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
            className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-[--b-border] bg-[--b-panel] p-6 transition-colors hover:border-accent-soft"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${t.gradient} opacity-0 transition-opacity group-hover:opacity-100`} />

            <div className="relative flex h-full flex-col">
              {t.image ? (
                <Link href={`/templates/${t.slug}`} className="mb-6 block aspect-video w-full overflow-hidden rounded-xl border border-[--b-border] transition-colors group-hover:border-accent-wash">
                  <img src={t.image} alt={`${t.name} preview`} className="h-full w-full object-cover opacity-80 transition-all duration-500 group-hover:scale-[1.02] group-hover:opacity-100" />
                </Link>
              ) : null}
              <div className="flex items-start gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[--b-surface] text-[--b-text-secondary]">
                  <TemplateIcon name={t.icon} className="h-5 w-5" />
                </span>
                <div>
                  <Link href={`/templates/${t.slug}`} className="hover:underline">
                    <h2 className="font-display text-xl font-black">{t.name}</h2>
                  </Link>
                  <p className="mt-1 text-sm leading-relaxed text-[--b-text-secondary]">{t.blurb}</p>
                </div>
              </div>

              <div className="mt-auto flex flex-wrap gap-1.5 pt-6">
                {t.uses.map((u) => (
                  <Link
                    key={u}
                    href={`/components/${u}`}
                    className="rounded-full border border-[--b-border] bg-[--b-surface] px-2.5 py-1 font-mono text-[11px] text-[--b-text-secondary] transition-colors hover:border-accent-soft hover:text-[--b-accent]"
                  >
                    {u}
                  </Link>
                ))}
              </div>

              <div className="mt-4 b-code-block text-[11px]">
                <span className="text-[--b-muted]">$</span>{" "}
                <code className="text-[--b-accent]">
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
        className="mt-8 rounded-2xl border border-accent-soft bg-accent-wash p-6 text-center"
      >
        <p className="font-display text-lg font-black">Build your own template</p>
        <p className="mt-1 text-sm text-[--b-text-secondary]">
          Compose any combination from {totalComponents} installable components. Every one is independently installable.
        </p>
        <Link
          href="/components"
          className="mt-4 inline-block rounded-xl bg-[--b-accent] px-5 py-2.5 text-sm font-bold text-[--b-accent-foreground] transition-transform active:scale-[0.98]"
        >
          Browse all components →
        </Link>
      </motion.div>
    </div>
  );
}
