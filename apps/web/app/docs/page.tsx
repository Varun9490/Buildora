"use client";

import Link from "next/link";
import * as React from "react";
import { motion } from "framer-motion";

const docs = [
  { slug: "overview", icon: "book", title: "Overview", body: "Buildora is a registry-driven creative component ecosystem. One definition powers website, docs, playground, search, and install." },
  { slug: "installation", icon: "package", title: "Installation", body: "pnpm dlx shadcn@latest add @buildora/{component}. No custom domain required — GitHub-hosted registry + /r/{component}.json endpoint." },
  { slug: "usage", icon: "terminal", title: "Usage", body: "Import from @buildora/{component}. Tune props in the playground, copy the framework tab, keep semantic behavior intact." },
  { slug: "props-api", icon: "gear", title: "Props API", body: "Clean, minimal props: strength, radius, intensity, spring, glow, scale. Every prop is documented on its component page with live controls." },
  { slug: "frameworks", icon: "code", title: "Framework Implementations", body: "React is Full — the source of truth. JS/HTML/Tailwind get snippet-level starters. Native targets (RN, Flutter, SwiftUI, Compose) are experimental snippets that remap hover/cursor to press and gestures. We label snippets honestly; we never ship a fake port." },
  { slug: "accessibility", icon: "access", title: "Accessibility", body: "Keyboard + focus + SR + reduced-motion on every component. Creative layers never remove semantic behavior (e.g. Slingshot OTP keeps real inputs)." },
  { slug: "responsive", icon: "device", title: "Responsive Behavior", body: "Desktop pointer physics → touch drag/press equivalents → simplified small-screen controls. Larger targets, no hover-only flows." },
  { slug: "customization", icon: "palette", title: "Customization", body: "CSS vars (--b-accent, --b-iris), Tailwind variants, and tree-shakeable exports. Tokens live in @buildora/tokens." },
  { slug: "registry", icon: "grid", title: "Registry", body: "Source: registry/components/*.json. Build: pnpm registry:build. Validate: pnpm registry:validate. shadcn items: registry/generated/*.json." }
];

function DocIcon({ name, className }: { name: string; className?: string }) {
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
  switch (name) {
    case "book":
      return (
        <svg {...common}>
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V4a1 1 0 0 0-1-1H6.5A2.5 2.5 0 0 0 4 5.5v14z" />
          <path d="M4 19.5A2.5 2.5 0 0 0 6.5 22H20v-5" />
        </svg>
      );
    case "package":
      return (
        <svg {...common}>
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
          <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
          <line x1="12" y1="22.08" x2="12" y2="12" />
        </svg>
      );
    case "terminal":
      return (
        <svg {...common}>
          <polyline points="4 17 10 11 4 5" />
          <line x1="12" y1="19" x2="20" y2="19" />
        </svg>
      );
    case "gear":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h.01a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h.01a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v.01a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      );
    case "code":
      return (
        <svg {...common}>
          <polyline points="16 18 22 12 16 6" />
          <polyline points="8 6 2 12 8 18" />
        </svg>
      );
    case "access":
      return (
        <svg {...common}>
          <circle cx="12" cy="4.5" r="2" />
          <path d="M4 8.5h16" />
          <path d="M12 8.5v6" />
          <path d="M12 14.5 8 21" />
          <path d="M12 14.5 16 21" />
        </svg>
      );
    case "device":
      return (
        <svg {...common}>
          <rect x="5" y="2" width="14" height="20" rx="2" />
          <line x1="10" y1="18.5" x2="14" y2="18.5" />
        </svg>
      );
    case "palette":
      return (
        <svg {...common}>
          <path d="M12 21a9 9 0 1 1 9-9c0 2.5-2 3.5-3.5 3.5H15a2 2 0 0 0-1.5 3.3c.4.5.5 1.2.1 1.7-.4.4-.9.5-1.6.5z" />
          <circle cx="7.5" cy="11.5" r="0.75" fill="currentColor" stroke="none" />
          <circle cx="10.5" cy="7" r="0.75" fill="currentColor" stroke="none" />
          <circle cx="15.5" cy="7.5" r="0.75" fill="currentColor" stroke="none" />
        </svg>
      );
    case "grid":
      return (
        <svg {...common}>
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
        </svg>
      );
    default:
      return null;
  }
}

export default function DocsPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="font-display text-3xl font-black md:text-4xl">Docs</h1>
        <p className="mt-2 text-sm text-[--b-text-secondary]">
          Concise, technically accurate, focused on shipping. Everything you need to get productive.
        </p>
      </motion.div>

      {/* Quick nav */}
      <motion.nav
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="mt-6 flex flex-wrap gap-2"
        aria-label="Quick navigation"
      >
        {docs.map((d) => (
          <a
            key={d.slug}
            href={`#${d.slug}`}
            className="rounded-lg border border-[--b-border] bg-[--b-panel] px-3 py-1.5 font-mono text-xs text-[--b-text-secondary] transition-colors hover:border-accent-soft hover:text-[--b-accent]"
          >
            {d.title}
          </a>
        ))}
      </motion.nav>

      {/* Doc cards grid */}
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {docs.map((d, i) => (
          <motion.article
            key={d.slug}
            id={d.slug}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.04, duration: 0.4 }}
            className="group b-card p-5 scroll-mt-20"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[--b-surface] text-[--b-text-secondary]">
                <DocIcon name={d.icon} className="h-4 w-4" />
              </span>
              <h2 className="font-display text-lg font-black">{d.title}</h2>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-[--b-text-secondary]">{d.body}</p>
          </motion.article>
        ))}
      </div>

      {/* How it works — learning mode */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-8 rounded-2xl border border-accent-soft bg-accent-wash p-6"
      >
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[--b-accent] text-[--b-accent-foreground]">
            <DocIcon name="book" className="h-4 w-4" />
          </span>
          <h2 className="font-display text-lg font-black">How it works (learning mode)</h2>
        </div>
        <ul className="mt-4 space-y-3 text-sm text-[--b-text-secondary]">
          <li className="flex gap-3">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[--b-accent]" />
            <span><strong className="text-[--b-text]">Interaction logic:</strong> pointer proximity → eased target → spring steps → transform. Reduced-motion short-circuits to final state.</span>
          </li>
          <li className="flex gap-3">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[--b-iris]" />
            <span><strong className="text-[--b-text]">Design principles:</strong> usefulness first, one memorable interaction per component, tactile feedback, no meaningless motion.</span>
          </li>
          <li className="flex gap-3">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[--b-warning]" />
            <span><strong className="text-[--b-text]">Performance:</strong> rAF + DPR-aware canvas, lazy 3D (no Three.js unless the route needs it), code-split playgrounds.</span>
          </li>
          <li className="flex gap-3">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[--b-success]" />
            <span><strong className="text-[--b-text]">Framework differences:</strong> web hover/blur become press/haptics on native; canvas becomes Skia/CustomPainter/Canvas equivalents. Snippets are labeled — never a silent stand-in for a port.</span>
          </li>
        </ul>
        <Link href="/components/slingshot-otp" className="mt-4 inline-block text-sm text-[--b-accent] transition-colors hover:underline">
          Study Slingshot OTP — our signature component →
        </Link>
      </motion.div>
    </div>
  );
}
