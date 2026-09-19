"use client";

import Link from "next/link";
import * as React from "react";
import { motion } from "framer-motion";

const docs = [
  { slug: "overview", icon: "📖", title: "Overview", body: "Buildora is a registry-driven creative component ecosystem. One definition powers website, docs, playground, search, and install." },
  { slug: "installation", icon: "📦", title: "Installation", body: "pnpm dlx shadcn@latest add @buildora/{component}. No custom domain required — GitHub-hosted registry + /r/{component}.json endpoint." },
  { slug: "usage", icon: "🚀", title: "Usage", body: "Import from @buildora/{component}. Tune props in the playground, copy the framework tab, keep semantic behavior intact." },
  { slug: "props-api", icon: "⚙️", title: "Props API", body: "Clean, minimal props: strength, radius, intensity, spring, glow, scale. Every prop is documented on its component page with live controls." },
  { slug: "frameworks", icon: "🔧", title: "Framework Implementations", body: "React is Full. JS/HTML/Tailwind are Full. Vue/Svelte/Angular are Partial ports. Native targets document hover/cursor alternatives or mark Unsupported honestly." },
  { slug: "accessibility", icon: "♿", title: "Accessibility", body: "Keyboard + focus + SR + reduced-motion on every component. Creative layers never remove semantic behavior (e.g. Slingshot OTP keeps real inputs)." },
  { slug: "responsive", icon: "📱", title: "Responsive Behavior", body: "Desktop pointer physics → touch drag/press equivalents → simplified small-screen controls. Larger targets, no hover-only flows." },
  { slug: "customization", icon: "🎨", title: "Customization", body: "CSS vars (--b-accent, --b-iris), Tailwind variants, and tree-shakeable exports. Tokens live in @buildora/tokens." },
  { slug: "registry", icon: "🗂️", title: "Registry", body: "Source: registry/components/*.json. Build: pnpm registry:build. Validate: pnpm registry:validate. shadcn items: registry/generated/*.json." }
];

export default function DocsPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="font-display text-3xl font-black md:text-4xl">Docs</h1>
        <p className="mt-2 text-sm text-white/50">
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
            className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 font-mono text-xs text-white/55 transition-colors hover:border-[#d4ff4f]/30 hover:text-[#d4ff4f]"
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
            className="group b-glass b-border-glow rounded-2xl p-5 scroll-mt-20"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/[0.06] text-base">{d.icon}</span>
              <h2 className="font-display text-lg font-black">{d.title}</h2>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-white/55">{d.body}</p>
          </motion.article>
        ))}
      </div>

      {/* How it works — learning mode */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-8 rounded-2xl border border-[#d4ff4f]/20 bg-[#d4ff4f]/[0.04] p-6"
      >
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#d4ff4f]/20 text-base">🧠</span>
          <h2 className="font-display text-lg font-black">How it works (learning mode)</h2>
        </div>
        <ul className="mt-4 space-y-3 text-sm text-white/55">
          <li className="flex gap-3">
            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#d4ff4f]" />
            <span><strong className="text-white/80">Interaction logic:</strong> pointer proximity → eased target → spring steps → transform. Reduced-motion short-circuits to final state.</span>
          </li>
          <li className="flex gap-3">
            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#9d8cff]" />
            <span><strong className="text-white/80">Design principles:</strong> usefulness first, one memorable interaction per component, tactile feedback, no meaningless motion.</span>
          </li>
          <li className="flex gap-3">
            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#ffb86b]" />
            <span><strong className="text-white/80">Performance:</strong> rAF + DPR-aware canvas, lazy 3D (no Three.js unless the route needs it), code-split playgrounds.</span>
          </li>
          <li className="flex gap-3">
            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#4fe08a]" />
            <span><strong className="text-white/80">Framework differences:</strong> web hover/blur become press/haptics on native; canvas becomes Skia/CustomPainter/Canvas equivalents.</span>
          </li>
        </ul>
        <Link href="/components/slingshot-otp" className="mt-4 inline-block text-sm text-[#d4ff4f] transition-colors hover:underline">
          Study Slingshot OTP — our signature component →
        </Link>
      </motion.div>
    </div>
  );
}
