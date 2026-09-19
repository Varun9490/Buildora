"use client";

import Link from "next/link";
import * as React from "react";
import { motion } from "framer-motion";
import { allComponents, allCategories, frameworkLabels } from "@/lib/registry";

const categoryMeta: Record<string, { icon: string; color: string }> = {
  creative: { icon: "✨", color: "from-[#d4ff4f]/20 to-transparent" },
  "ai-llm": { icon: "🤖", color: "from-[#9d8cff]/20 to-transparent" },
  data: { icon: "📊", color: "from-[#4fe08a]/20 to-transparent" },
  developer: { icon: "⚡", color: "from-[#ffb86b]/20 to-transparent" },
  saas: { icon: "🏢", color: "from-[#ff8a3d]/20 to-transparent" },
  complex: { icon: "🧩", color: "from-[#9d8cff]/20 to-transparent" },
  content: { icon: "📝", color: "from-[#d4ff4f]/20 to-transparent" },
};

export default function CategoriesPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="font-display text-3xl font-black md:text-4xl">Categories</h1>
        <p className="mt-2 text-sm text-white/50">
          Components organized by purpose. Each category contains idiomatic, production-ready implementations.
        </p>
      </motion.div>

      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {allCategories.map((cat, i) => {
          const items = allComponents.filter((c) => c.categories.includes(cat));
          const meta = categoryMeta[cat] || { icon: "📦", color: "from-white/10 to-transparent" };
          return (
            <motion.div
              key={cat}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06, duration: 0.4 }}
              className="group b-glass b-border-glow rounded-2xl p-5 relative overflow-hidden"
            >
              {/* Gradient accent */}
              <div className={`absolute inset-0 bg-gradient-to-br ${meta.color} opacity-0 transition-opacity group-hover:opacity-100`} />

              <div className="relative">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.06] text-lg">
                    {meta.icon}
                  </span>
                  <div>
                    <h2 className="font-display text-xl font-black capitalize">{cat.replace("-", " / ")}</h2>
                    <span className="font-mono text-[11px] text-white/35">{items.length} components</span>
                  </div>
                </div>

                <ul className="mt-4 space-y-1.5">
                  {items.slice(0, 6).map((c) => (
                    <li key={c.slug}>
                      <Link
                        href={`/components/${c.slug}`}
                        className="flex items-center gap-2 rounded-lg px-2 py-1 text-sm text-white/65 transition-colors hover:bg-white/[0.06] hover:text-[#d4ff4f]"
                      >
                        <span className="h-1 w-1 rounded-full bg-white/25" />
                        {c.name}
                      </Link>
                    </li>
                  ))}
                </ul>
                {items.length > 6 && (
                  <Link
                    href="/components"
                    className="mt-3 inline-block text-xs text-white/35 transition-colors hover:text-[#d4ff4f]"
                  >
                    + {items.length - 6} more →
                  </Link>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Framework coverage */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-8 rounded-2xl border border-white/10 bg-white/[0.02] p-6"
      >
        <h2 className="font-display text-lg font-black">Framework coverage</h2>
        <p className="mt-1 text-sm text-white/45">
          Every component targets 11 frameworks. React is Full status; others range from Full to Experimental.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {Object.entries(frameworkLabels).map(([k, v]) => (
            <span
              key={k}
              className="rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 font-mono text-xs text-white/60 transition-colors hover:border-[#d4ff4f]/30 hover:text-[#d4ff4f]"
            >
              {v}
            </span>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
