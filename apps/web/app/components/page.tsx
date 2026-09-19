"use client";

import Link from "next/link";
import * as React from "react";
import { motion } from "framer-motion";
import { allComponents, searchComponents, allCategories, allTags } from "@/lib/registry";
import { useBuildora } from "@/lib/store";
import { cn } from "@buildora/utils";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.03 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  },
};

const difficultyColors: Record<string, string> = {
  beginner: "bg-[#4fe08a]/15 text-[#4fe08a] border-[#4fe08a]/30",
  intermediate: "bg-[#ffb86b]/15 text-[#ffb86b] border-[#ffb86b]/30",
  advanced: "bg-[#9d8cff]/15 text-[#9d8cff] border-[#9d8cff]/30",
};

function ComponentCard({
  component,
  index,
}: {
  component: (typeof allComponents)[0];
  index: number;
}) {
  const ref = React.useRef<HTMLAnchorElement | null>(null);
  const [position, setPosition] = React.useState({ x: 50, y: 50 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    setPosition({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  return (
    <motion.div variants={itemVariants}>
      <Link
        ref={ref}
        href={`/components/${component.slug}`}
        onMouseMove={handleMouseMove}
        className="group relative block overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.03] to-transparent p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[#d4ff4f]/30"
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background: `radial-gradient(300px circle at ${position.x}% ${position.y}%, rgba(212, 255, 79, 0.08), transparent 50%)`,
          }}
        />
        
        <div className="relative">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-[#d4ff4f]/10 border border-[#d4ff4f]/20 px-2.5 py-0.5 font-mono text-[10px] font-medium text-[#d4ff4f]">
              {component.categories[0]}
            </span>
            <span
              className={cn(
                "rounded-full px-2 py-0.5 font-mono text-[10px] border",
                difficultyColors[component.difficulty] || "bg-white/5 text-white/40 border-white/10"
              )}
            >
              {component.difficulty}
            </span>
            <span className="ml-auto font-mono text-[10px] text-white/25">v{component.version}</span>
          </div>

          <h3 className="mt-3 font-display text-lg font-bold tracking-tight transition-colors group-hover:text-[#d4ff4f]">
            {component.name}
          </h3>

          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-white/50">
            {component.description}
          </p>

          <div className="mt-4 flex flex-wrap gap-1.5">
            {component.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="rounded-md bg-white/[0.03] px-2 py-0.5 font-mono text-[10px] text-white/40"
              >
                {tag}
              </span>
            ))}
            {component.tags.length > 3 && (
              <span className="rounded-md bg-white/[0.03] px-2 py-0.5 font-mono text-[10px] text-white/30">
                +{component.tags.length - 3}
              </span>
            )}
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#d4ff4f]/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </Link>
    </motion.div>
  );
}

export default function ComponentsPage() {
  const [query, setQuery] = React.useState("");
  const [category, setCategory] = React.useState("all");
  const [difficulty, setDifficulty] = React.useState("all");
  const [tag, setTag] = React.useState("all");
  const [sort, setSort] = React.useState<"popular" | "newest" | "az">("popular");
  const { recent, pushRecent } = useBuildora();

  const results = React.useMemo(
    () => searchComponents(allComponents, { query, category, framework: "all", tag, difficulty, sort }),
    [query, category, tag, difficulty, sort]
  );

  const recentComponents = React.useMemo(
    () =>
      recent
        .map((slug) => allComponents.find((c) => c.slug === slug))
        .filter(Boolean)
        .slice(0, 4) as (typeof allComponents)[0][],
    [recent]
  );

  const activeFiltersCount = [
    category !== "all",
    difficulty !== "all",
    tag !== "all",
    query !== "",
  ].filter(Boolean).length;

  return (
    <div className="relative mx-auto max-w-7xl px-4 py-10 sm:py-14">
      <div className="absolute inset-0 bg-gradient-radial opacity-30" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-display text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
              Components{" "}
              <span className="text-gradient">({results.length})</span>
            </h1>
            <p className="mt-2 max-w-lg text-sm text-white/50 sm:text-base">
              Try "magnetic button", "interactive OTP", "developer terminal", or
              "mobile onboarding".
            </p>
          </div>

          {activeFiltersCount > 0 && (
            <button
              onClick={() => {
                setQuery("");
                setCategory("all");
                setDifficulty("all");
                setTag("all");
              }}
              className="rounded-lg border border-white/10 px-4 py-2 text-xs text-white/60 transition-colors hover:bg-white/5"
            >
              Clear filters ({activeFiltersCount})
            </button>
          )}
        </div>
      </motion.div>

      {recentComponents.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative mt-6"
        >
          <p className="mb-2 font-mono text-[11px] uppercase tracking-wider text-white/30">
            Recently viewed
          </p>
          <div className="flex flex-wrap gap-2">
            {recentComponents.map((c) => (
              <Link
                key={c.slug}
                href={`/components/${c.slug}`}
                onClick={() => pushRecent(c.slug)}
                className="rounded-lg border border-white/10 bg-white/[0.02] px-3 py-1.5 text-sm text-white/60 transition-all hover:border-[#d4ff4f]/30 hover:text-[#d4ff4f]"
              >
                {c.name}
              </Link>
            ))}
          </div>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="relative mt-8 flex flex-wrap gap-2"
      >
        <div className="relative min-w-0 flex-1 sm:min-w-[260px]">
          <svg
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.45 4.38l3.59 3.58a.75.75 0 01-1.06 1.06l-3.58-3.59A7 7 0 012 9z"
              clipRule="evenodd"
            />
          </svg>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search components..."
            aria-label="Search components"
            className="w-full rounded-xl border border-white/10 bg-white/[0.03] py-2.5 pl-10 pr-4 text-sm outline-none transition-all focus:border-[#d4ff4f]/50 focus:bg-white/[0.05] focus:ring-2 focus:ring-[#d4ff4f]/10 placeholder:text-white/30"
          />
        </div>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          aria-label="Category"
          className="rounded-xl border border-white/10 bg-[#12141d] px-3 py-2.5 text-sm outline-none transition-colors focus:border-[#d4ff4f]/30"
        >
          <option value="all">All categories</option>
          {allCategories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          aria-label="Difficulty"
          className="rounded-xl border border-white/10 bg-[#12141d] px-3 py-2.5 text-sm outline-none transition-colors focus:border-[#d4ff4f]/30"
        >
          <option value="all">All levels</option>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>

        <select
          value={tag}
          onChange={(e) => setTag(e.target.value)}
          aria-label="Tag"
          className="hidden rounded-xl border border-white/10 bg-[#12141d] px-3 py-2.5 text-sm outline-none transition-colors focus:border-[#d4ff4f]/30 md:block"
        >
          <option value="all">All tags</option>
          {allTags.slice(0, 40).map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as typeof sort)}
          aria-label="Sort"
          className="rounded-xl border border-white/10 bg-[#12141d] px-3 py-2.5 text-sm outline-none transition-colors focus:border-[#d4ff4f]/30"
        >
          <option value="popular">Popular</option>
          <option value="newest">Newest</option>
          <option value="az">A–Z</option>
        </select>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        {results.map((c, i) => (
          <ComponentCard key={c.slug} component={c} index={i} />
        ))}
      </motion.div>

      {results.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative mt-16 text-center"
        >
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5">
            <svg className="h-8 w-8 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-lg font-medium text-white/60">No components match your filters</p>
          <p className="mt-2 text-sm text-white/40">Try adjusting your search or filters</p>
          <button
            onClick={() => {
              setQuery("");
              setCategory("all");
              setDifficulty("all");
              setTag("all");
            }}
            className="mt-5 rounded-xl border border-[#d4ff4f]/30 bg-[#d4ff4f]/10 px-5 py-2.5 text-sm font-medium text-[#d4ff4f] transition-all hover:bg-[#d4ff4f]/20"
          >
            Clear all filters
          </button>
        </motion.div>
      )}
    </div>
  );
}
