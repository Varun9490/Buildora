"use client";

import Link from "next/link";
import * as React from "react";
import { motion } from "framer-motion";
import { cn, copyToClipboard } from "@buildora/utils";
import { useBuildora } from "@/lib/store";
import { allComponents, frameworkLabels, frameworks } from "@/lib/registry";
import type { RegistryItem } from "@/lib/registry";
import { frameworkExample } from "@/lib/framework-code";
import { CodeViewer } from "@/components/CodeViewer";
import { ComponentRenderer } from "@/components/ComponentRenderer";

export function ComponentDetail({ slug }: { slug: string }) {
  const [item, setItem] = React.useState<RegistryItem | null>(null);
  const { framework, setFramework, pushRecent } = useBuildora();
  const [controls, setControls] = React.useState({
    strength: 0.35,
    radius: 120,
    intensity: 0.6,
    speed: 1,
    glow: true,
    scale: 1,
  });
  const [copied, setCopied] = React.useState<string | null>(null);

  React.useEffect(() => {
    fetch(`/api/registry/${slug}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => setItem(j))
      .catch(() => setItem(null));
    pushRecent(slug);
  }, [slug, pushRecent]);

  const summary = allComponents.find((c) => c.slug === slug);
  const ex = React.useMemo(
    () => frameworkExample(slug, summary?.name ?? slug, framework, item),
    [slug, summary, framework, item]
  );
  const related = React.useMemo(() => {
    if (!summary) return [];
    return allComponents
      .filter((c) => c.slug !== slug && c.categories.some((x) => summary.categories.includes(x)))
      .slice(0, 3);
  }, [summary, slug]);

  if (!summary)
    return (
      <div className="mx-auto max-w-5xl px-4 py-16">
        <p>Unknown component.</p>
        <Link href="/components" className="text-[#d4ff4f]">
          ← All components
        </Link>
      </div>
    );

  const copy = async (text: string, key: string) => {
    await copyToClipboard(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 1400);
  };

  const set = (k: keyof typeof controls) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.type === "checkbox" ? (e.target as HTMLInputElement).checked : Number(e.target.value);
    setControls((c) => ({ ...c, [k]: v }));
  };

  const controlMap: Record<string, string[]> = {
    "magnetic-button": ["strength", "radius", "intensity", "scale", "glow"],
    "slingshot-otp": ["strength", "radius", "intensity"],
    "creative-notifications": ["scale", "glow"],
    "streaming-chat": ["scale", "speed"],
    "advanced-table": ["scale"],
    "kanban": ["scale", "glow"],
    "aurora-background": ["speed", "intensity", "glow"],
    "particle-field": ["speed", "radius", "intensity"],
    "cursor-spotlight": ["radius", "intensity", "glow"],
    "terminal": ["scale", "glow"],
    "file-tree": ["scale"],
  };
  const allowed = controlMap[slug] || ["strength", "radius", "intensity", "speed", "scale", "glow"];

  return (
    <div className="relative mx-auto max-w-6xl px-4 py-8 sm:py-10">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <nav className="font-mono text-xs text-white/40" aria-label="Breadcrumb">
          <Link href="/components" className="transition-colors hover:text-white">
            components
          </Link>
          <span className="mx-2">/</span>
          <span className="text-white/60">{slug}</span>
        </nav>

        <div className="mt-4 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex-1">
            <h1 className="font-display text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
              {summary.name}
            </h1>
            <p className="mt-2 max-w-2xl text-base text-white/60 sm:text-lg">{summary.description}</p>

            <div className="mt-4 flex flex-wrap gap-2">
              {summary.categories.map((c) => (
                <span
                  key={c}
                  className="rounded-full bg-[#d4ff4f]/10 border border-[#d4ff4f]/20 px-3 py-0.5 font-mono text-xs font-medium text-[#d4ff4f]"
                >
                  {c}
                </span>
              ))}
              {summary.tags.slice(0, 5).map((t) => (
                <span
                  key={t}
                  className="rounded-full bg-white/[0.03] border border-white/10 px-3 py-0.5 font-mono text-xs text-white/50"
                >
                  {t}
                </span>
              ))}
              <span className="rounded-full bg-white/[0.03] border border-white/10 px-3 py-0.5 font-mono text-xs text-white/50">
                {summary.difficulty}
              </span>
              <span className="rounded-full bg-white/[0.03] border border-white/10 px-3 py-0.5 font-mono text-xs text-white/50">
                v{summary.version} · MIT
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <a
              href={`https://github.com/Varun9490/Buildora/tree/main/packages/components/src/${slug}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 rounded-xl border border-white/15 px-4 py-2 text-sm text-white/80 transition-colors hover:bg-white/10"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.2 11.38.6.11.82-.26.82-.58v-2.03c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.08-.74.08-.73.08-.73 1.2.08 1.84 1.23 1.84 1.23 1.07 1.84 2.8 1.31 3.49 1 .1-.78.42-1.31.76-1.61-2.66-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.13-.3-.54-1.52.12-3.18 0 0 1-.32 3.3 1.23a11.5 11.5 0 016.02 0c2.28-1.55 3.29-1.23 3.29-1.23.66 1.66.25 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.63-5.48 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.22.7.82.58A12.01 12.01 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
              GitHub ↗
            </a>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => copy(item?.install ?? `pnpm dlx shadcn@latest add @buildora/${slug}`, "install")}
              className="rounded-xl bg-gradient-to-r from-[#d4ff4f] to-[#a8e063] px-5 py-2 text-sm font-bold text-black shadow-glow-sm"
            >
              {copied === "install" ? "✓ Copied" : "Copy install"}
            </motion.button>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-1.5" aria-label="Framework support">
          {frameworks.map((f) => {
            const st = item?.implementations?.[f]?.status ??
              (["react", "javascript", "html", "tailwind"].includes(f) ? "Full" : "Partial");
            return (
              <span
                key={f}
                title={item?.implementations?.[f]?.notes ?? st}
                className={cn(
                  "rounded-full border px-2.5 py-0.5 font-mono text-[11px]",
                  st === "Full"
                    ? "border-[#4fe08a]/40 text-[#4fe08a]"
                    : st === "Partial"
                    ? "border-[#ffb86b]/40 text-[#ffb86b]"
                    : st === "Experimental"
                    ? "border-[#9d8cff]/40 text-[#9d8cff]"
                    : "border-white/10 text-white/30"
                )}
              >
                {frameworkLabels[f]} · {st}
              </span>
            );
          })}
        </div>
      </motion.div>

      <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_360px]">
        <div className="min-w-0 space-y-5">
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.03] to-transparent"
            aria-label="Live playground"
          >
            <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.02] px-5 py-3">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#d4ff4f] opacity-75" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#d4ff4f]" />
                </span>
                <p className="font-mono text-xs text-white/50">
                  Live preview — {frameworkLabels[framework]}
                </p>
              </div>
              <button
                onClick={() => setControls({ strength: 0.35, radius: 120, intensity: 0.6, speed: 1, glow: true, scale: 1 })}
                className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-white/60 transition-colors hover:bg-white/10 hover:text-white"
              >
                Reset
              </button>
            </div>
            <div className="b-grid-bg relative flex min-h-[420px] w-full flex-col items-center justify-center overflow-visible bg-[#0b0d13] p-6 sm:p-10 lg:p-12">
              <ComponentRenderer slug={slug} controls={controls} />
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            aria-label="Code"
          >
            <div className="mb-3 flex flex-wrap gap-1.5" role="tablist" aria-label="Framework">
              {frameworks.map((f) => (
                <button
                  key={f}
                  role="tab"
                  aria-selected={f === framework}
                  onClick={() => setFramework(f)}
                  className={cn(
                    "rounded-lg px-3 py-1.5 font-mono text-xs transition-all",
                    f === framework
                      ? "bg-[#d4ff4f] text-black font-bold"
                      : "border border-white/10 text-white/50 hover:bg-white/5 hover:text-white"
                  )}
                >
                  {frameworkLabels[f]}
                </button>
              ))}
            </div>
            {ex.notes && (
              <p className="mb-3 rounded-xl border border-[#ffb86b]/30 bg-[#ffb86b]/10 px-4 py-3 text-xs text-[#ffd9a8]">
                Note ({frameworkLabels[framework]} · {ex.status}): {ex.notes}
              </p>
            )}
            <CodeViewer files={ex.files} />
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
                <p className="font-mono text-[11px] text-white/40">installation</p>
                <code className="mt-2 block break-all font-mono text-xs text-[#d4ff4f]">{ex.install}</code>
                <button
                  onClick={() => copy(ex.install, "i2")}
                  className="mt-3 rounded-lg border border-white/15 px-3 py-1.5 text-xs text-white/70 transition-colors hover:bg-white/10"
                >
                  {copied === "i2" ? "✓ Copied" : "Copy"}
                </button>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
                <p className="font-mono text-[11px] text-white/40">dependencies</p>
                <p className="mt-2 font-mono text-xs text-white/70">
                  {ex.dependencies.length ? ex.dependencies.join(", ") : item?.dependencies?.length ? item.dependencies.join(", ") : "none"}
                </p>
                <p className="mt-2 text-[11px] text-white/40">
                  Source:{" "}
                  <a
                    className="underline hover:text-[#d4ff4f]"
                    href={`https://github.com/Varun9490/Buildora/tree/main/packages/components/src/${slug}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    GitHub ↗
                  </a>
                </p>
              </div>
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid gap-3 sm:grid-cols-2"
          >
            <DocCard title="Usage" body={`Import from @buildora/${slug}. Tune props in the playground, then copy the ${frameworkLabels[framework]} tab. Semantic behavior stays intact under the creative layer.`} />
            <DocCard title="Accessibility" body="Keyboard navigable · visible focus · screen-reader labels + live regions · prefers-reduced-motion fallback that disables pull/tilt/particles without removing function." />
            <DocCard title="Responsive behavior" body="Desktop gets full pointer physics; touch uses drag/press equivalents; small screens simplify controls (fewer knobs, larger targets). Nothing is hover-only." />
            <DocCard title="Customization" body="Tokens via CSS vars (--b-accent, --b-iris) + props (strength, radius, intensity, spring). Tree-shakeable exports; no global CSS required beyond tokens." />
          </motion.section>
        </div>

        <motion.aside
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.25 }}
          className="h-fit rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.03] to-transparent p-5 lg:sticky lg:top-24"
          aria-label="Interactive controls"
        >
          <h3 className="font-display text-lg font-bold">Interactive controls</h3>
          <p className="mt-1 text-xs text-white/45">A creative laboratory, not static docs.</p>

          <div className="mt-5 space-y-4 text-sm">
            {allowed.includes("strength") && (
              <Knob
                label={`Magnetism · ${controls.strength.toFixed(2)}`}
                min={0}
                max={1}
                step={0.05}
                value={controls.strength}
                onChange={set("strength")}
              />
            )}
            {allowed.includes("radius") && (
              <Knob
                label={`Radius · ${controls.radius}px`}
                min={40}
                max={260}
                step={5}
                value={controls.radius}
                onChange={set("radius")}
              />
            )}
            {allowed.includes("intensity") && (
              <Knob
                label={`Intensity · ${controls.intensity.toFixed(2)}`}
                min={0}
                max={1}
                step={0.05}
                value={controls.intensity}
                onChange={set("intensity")}
              />
            )}
            {allowed.includes("speed") && (
              <Knob
                label={`Speed · ${controls.speed}×`}
                min={0.25}
                max={2.5}
                step={0.25}
                value={controls.speed}
                onChange={set("speed")}
              />
            )}
            {allowed.includes("scale") && (
              <Knob
                label={`Scale · ${controls.scale}×`}
                min={0.8}
                max={1.4}
                step={0.05}
                value={controls.scale}
                onChange={set("scale")}
              />
            )}
            {allowed.includes("glow") && (
              <label className="flex items-center gap-2.5 text-sm">
                <input type="checkbox" checked={controls.glow} onChange={set("glow")} className="h-4 w-4 accent-[#d4ff4f]" />
                Glow effect
              </label>
            )}
          </div>

          <div className="mt-6 border-t border-white/10 pt-4">
            <p className="text-xs font-medium text-white/70">Actions</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                onClick={() => copy(ex.files[0]?.code ?? "", "code")}
                className="rounded-lg bg-white/10 px-3 py-1.5 text-xs text-white/80 transition-colors hover:bg-white/20"
              >
                {copied === "code" ? "✓ Copied" : "Copy code"}
              </button>
              <a
                href={`https://github.com/Varun9490/Buildora/tree/main/packages/components/src/${slug}`}
                target="_blank"
                rel="noreferrer"
                className="rounded-lg border border-white/15 px-3 py-1.5 text-xs text-white/80 transition-colors hover:bg-white/10 hover:text-white"
              >
                Open source ↗
              </a>
              <Link
                href="/docs"
                className="rounded-lg border border-white/15 px-3 py-1.5 text-xs text-white/80 transition-colors hover:bg-white/10 hover:text-white"
              >
                Docs
              </Link>
            </div>
          </div>

          {related.length > 0 && (
            <div className="mt-4 border-t border-white/10 pt-4">
              <p className="text-xs font-medium text-white/70">Related components</p>
              <ul className="mt-3 space-y-2">
                {related.map((r) => (
                  <li key={r.slug}>
                    <Link
                      href={`/components/${r.slug}`}
                      className="text-sm text-white/65 transition-colors hover:text-[#d4ff4f]"
                    >
                      {r.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </motion.aside>
      </div>
    </div>
  );
}

function DocCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
      <h2 className="font-display font-bold">{title}</h2>
      <p className="mt-2 text-sm leading-relaxed text-white/55">{body}</p>
    </div>
  );
}

function Knob({ label, ...rest }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs text-white/50">{label}</span>
      <input type="range" {...rest} className="w-full accent-[#d4ff4f]" />
    </label>
  );
}
