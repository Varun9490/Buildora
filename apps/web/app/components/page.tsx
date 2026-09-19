"use client";

import Link from "next/link";
import * as React from "react";
import { allComponents, searchComponents, allCategories, allTags } from "@/lib/registry";
import { useBuildora } from "@/lib/store";

export default function ComponentsPage() {
  const [query, setQuery] = React.useState("");
  const [category, setCategory] = React.useState("all");
  const [difficulty, setDifficulty] = React.useState("all");
  const [tag, setTag] = React.useState("all");
  const [sort, setSort] = React.useState<"popular" | "newest" | "az">("popular");
  const { pushRecent } = useBuildora();

  const results = React.useMemo(
    () => searchComponents(allComponents, { query, category, framework: "all", tag, difficulty, sort }),
    [query, category, tag, difficulty, sort]
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="font-display text-3xl font-black">Components <span className="text-white/40">({results.length})</span></h1>
      <p className="mt-1 text-sm text-white/55">Try “futuristic glass card”, “interactive OTP”, “developer terminal”, “mobile onboarding”.</p>

      <div className="mt-4 flex flex-wrap gap-2">
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search components…" aria-label="Search components" className="min-w-52 flex-1 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm outline-none focus:border-[#d4ff4f]" />
        <select value={category} onChange={(e) => setCategory(e.target.value)} aria-label="Category" className="rounded-xl border border-white/10 bg-[#12141d] px-2 py-2 text-sm">
          <option value="all">All categories</option>{allCategories.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} aria-label="Difficulty" className="rounded-xl border border-white/10 bg-[#12141d] px-2 py-2 text-sm">
          <option value="all">All levels</option><option value="beginner">Beginner</option><option value="intermediate">Intermediate</option><option value="advanced">Advanced</option>
        </select>
        <select value={tag} onChange={(e) => setTag(e.target.value)} aria-label="Tag" className="rounded-xl border border-white/10 bg-[#12141d] px-2 py-2 text-sm">
          <option value="all">All tags</option>{allTags.slice(0, 40).map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
        <select value={sort} onChange={(e) => setSort(e.target.value as typeof sort)} aria-label="Sort" className="rounded-xl border border-white/10 bg-[#12141d] px-2 py-2 text-sm">
          <option value="popular">Popular</option><option value="newest">Newest</option><option value="az">A–Z</option>
        </select>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {results.map((c) => (
          <Link key={c.slug} href={`/components/${c.slug}`} onClick={() => pushRecent(c.slug)} className="group rounded-2xl border border-white/10 bg-white/[0.02] p-4 transition-all hover:-translate-y-0.5 hover:border-[#d4ff4f]/40">
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-white/10 px-2 py-0.5 font-mono text-[10px] text-white/60">{c.categories[0]}</span>
              <span className="rounded-full bg-white/5 px-2 py-0.5 font-mono text-[10px] text-white/40">{c.difficulty}</span>
              <span className="ml-auto font-mono text-[10px] text-white/30">v{c.version}</span>
            </div>
            <p className="mt-2 font-display text-lg font-black group-hover:text-[#d4ff4f]">{c.name}</p>
            <p className="line-clamp-2 text-sm text-white/55">{c.description}</p>
            <p className="mt-2 font-mono text-[11px] text-white/35">{c.slug} · {c.tags.slice(0, 3).join(" · ")}</p>
          </Link>
        ))}
      </div>
      {results.length === 0 && <p className="mt-8 text-center text-white/50">No components match. Try clearing filters.</p>}
    </div>
  );
}
