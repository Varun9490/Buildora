"use client";

import Link from "next/link";
import * as React from "react";
import { allComponents, allCategories, frameworkLabels } from "@/lib/registry";

export default function CategoriesPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="font-display text-3xl font-black">Categories</h1>
      <div className="mt-5 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {allCategories.map((cat) => {
          const items = allComponents.filter((c) => c.categories.includes(cat));
          return (
            <div key={cat} className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
              <div className="flex items-baseline justify-between">
                <h2 className="font-display text-xl font-black">{cat}</h2>
                <span className="font-mono text-xs text-white/40">{items.length}</span>
              </div>
              <ul className="mt-2 space-y-1">
                {items.slice(0, 6).map((c) => (
                  <li key={c.slug}><Link href={`/components/${c.slug}`} className="text-sm text-white/70 hover:text-[#d4ff4f]">{c.name}</Link></li>
                ))}
              </ul>
              <Link href={`/components`} className="mt-2 inline-block text-xs text-white/40 hover:text-white">Browse all →</Link>
            </div>
          );
        })}
      </div>
      <div className="mt-6 rounded-2xl border border-white/10 p-4">
        <h2 className="font-display font-black">Framework coverage</h2>
        <div className="mt-2 flex flex-wrap gap-2">{Object.entries(frameworkLabels).map(([k, v]) => <span key={k} className="rounded-full border border-white/10 px-3 py-1 font-mono text-xs text-white/60">{v}</span>)}</div>
      </div>
    </div>
  );
}
