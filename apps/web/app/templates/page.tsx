"use client";

import Link from "next/link";
import * as React from "react";
import { motion } from "motion/react";
import { totalComponents } from "@/lib/registry";
import { TemplateIframePreview } from "@/components/TemplateIframePreview";

const templates = [
  {
    slug: "ai-agent",
    name: "AI Agent Console",
    icon: "bot",
    image: "/previews/ai-agent.png",
    gradient: "from-[color-mix(in_oklab,var(--b-accent)_15%,transparent)] via-transparent to-[color-mix(in_oklab,var(--b-accent)_5%,transparent)]",
    uses: ["streaming-chat", "spatial-command-palette"],
    blurb: "Token-by-token streaming, tool call transparency, and spatial commands — all frontend-only.",
  },
  {
    slug: "creative-portfolio",
    name: "Creative Portfolio",
    icon: "spark",
    image: "/previews/creative-portfolio.png",
    gradient: "from-[color-mix(in_oklab,var(--b-accent)_15%,transparent)] via-transparent to-[color-mix(in_oklab,var(--b-accent)_5%,transparent)]",
    uses: ["magnetic-button", "morphing-typography"],
    blurb: "Premium editorial layouts, magnetic CTAs, smooth scrolling. Visually stunning and minimal.",
  },
  {
    slug: "developer-tui",
    name: "Developer TUI Console",
    icon: "terminal",
    image: "/previews/developer-tui.jpg",
    gradient: "from-[color-mix(in_oklab,var(--b-accent)_10%,transparent)] via-transparent to-[color-mix(in_oklab,var(--b-accent)_5%,transparent)]",
    uses: ["terminal", "file-tree", "log-viewer", "command-palette"],
    blurb: "Build rich browser-based CLI interfaces and developer tools with authentic typography and layouts.",
  },
  {
    slug: "saas-dashboard",
    name: "SaaS Admin Dashboard",
    icon: "layout",
    image: "/previews/saas-dashboard.jpg",
    gradient: "from-[color-mix(in_oklab,var(--b-accent)_15%,transparent)] via-transparent to-[color-mix(in_oklab,var(--b-accent)_5%,transparent)]",
    uses: ["expandable-sidebar", "advanced-table", "kanban", "dialog"],
    blurb: "High-density data views, collapsible sidebars, and dense metric cards for professional SaaS apps.",
  },
  {
    slug: "interactive-docs",
    name: "Interactive Documentation",
    icon: "book",
    image: "/previews/interactive-docs.jpg",
    gradient: "from-[color-mix(in_oklab,var(--b-accent)_15%,transparent)] via-transparent to-[color-mix(in_oklab,var(--b-accent)_10%,transparent)]",
    uses: ["rich-text-editor", "version-history", "step-nav", "diff-viewer"],
    blurb: "Beautiful documentation scaffolding with diff viewers, version history, and step-by-step guides.",
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
  if (name === "terminal") {
    return (
      <svg {...common}>
        <polyline points="4 17 10 11 4 5"></polyline>
        <line x1="12" y1="19" x2="20" y2="19"></line>
      </svg>
    );
  }
  if (name === "layout") {
    return (
      <svg {...common}>
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
        <line x1="3" y1="9" x2="21" y2="9"></line>
        <line x1="9" y1="21" x2="9" y2="9"></line>
      </svg>
    );
  }
  if (name === "book") {
    return (
      <svg {...common}>
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
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
        <p className="mt-2 max-w-lg text-sm text-[color:var(--b-text-secondary)]">
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
            className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-[color:var(--b-border)] bg-[color:var(--b-panel)] p-6 transition-colors hover:border-accent-soft"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${t.gradient} opacity-0 transition-opacity group-hover:opacity-100`} />

            <div className="relative flex h-full flex-col">
              <Link href={`/templates/${t.slug}`} className="relative mb-6 block aspect-video w-full overflow-hidden rounded-xl border border-[color:var(--b-border)] transition-colors group-hover:border-accent-wash">
                <TemplateIframePreview slug={t.slug} category={t.name} />
              </Link>
              <div className="flex items-start gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[color:var(--b-surface)] text-[color:var(--b-text-secondary)]">
                  <TemplateIcon name={t.icon} className="h-5 w-5" />
                </span>
                <div>
                  <Link href={`/templates/${t.slug}`} className="hover:underline">
                    <h2 className="font-display text-xl font-black">{t.name}</h2>
                  </Link>
                  <p className="mt-1 text-sm leading-relaxed text-[color:var(--b-text-secondary)]">{t.blurb}</p>
                </div>
              </div>

              <div className="mt-auto flex flex-wrap gap-1.5 pt-6">
                {t.uses.map((u) => (
                  <Link
                    key={u}
                    href={`/components/${u}`}
                    className="rounded-full border border-[color:var(--b-border)] bg-[color:var(--b-surface)] px-2.5 py-1 font-mono text-[11px] text-[color:var(--b-text-secondary)] transition-colors hover:border-accent-soft hover:text-[color:var(--b-accent)]"
                  >
                    {u}
                  </Link>
                ))}
              </div>

              <div className="mt-4 b-code-block text-[11px]">
                <span className="text-[color:var(--b-muted)]">$</span>{" "}
                <code className="text-[color:var(--b-accent)]">
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
        <p className="mt-1 text-sm text-[color:var(--b-text-secondary)]">
          Compose any combination from {totalComponents} installable components. Every one is independently installable.
        </p>
        <Link
          href="/components"
          className="mt-4 inline-block rounded-xl bg-[color:var(--b-accent)] px-5 py-2.5 text-sm font-bold text-[color:var(--b-accent-foreground)] transition-transform active:scale-[0.98]"
        >
          Browse all components →
        </Link>
      </motion.div>
    </div>
  );
}
