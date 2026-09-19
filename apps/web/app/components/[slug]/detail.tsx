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
  const [activeTab, setActiveTab] = React.useState<"preview" | "code" | "props">("preview");

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

  const generateAIPrompt = () => {
    return `# ${summary.name}

${summary.description}

## Category
${summary.categories.join(", ")}

## Tags
${summary.tags.join(", ")}

## Props
${allowed.map(p => `- \`${p}\`: Control for ${p} behavior`).join("\n")}

## Dependencies
${ex.dependencies.length ? ex.dependencies.join(", ") : "none"}

## Usage Example (React)
\`\`\`tsx
import { ${summary.name.replace(/ /g, "") } from "@buildora/${slug}"

<${summary.name.replace(/ /g, "")} ${allowed.includes("strength") ? `strength={${controls.strength}}` : ""} />
\`\`\`

## Accessibility
- Keyboard navigable
- Reduced motion support
- Screen reader friendly`;
  };

  return (
    <div className="relative mx-auto max-w-7xl px-4 py-6 sm:py-10">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <nav className="mb-6 flex items-center gap-2 font-mono text-xs text-white/40">
          <Link href="/components" className="transition-colors hover:text-white">
            Components
          </Link>
          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-white/60">{slug}</span>
        </nav>

        <div className="flex flex-col gap-8 lg:flex-row">
          <div className="flex-1 space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <span className="rounded-lg bg-[#d4ff4f]/10 px-2.5 py-1 font-mono text-[11px] font-medium text-[#d4ff4f]">
                    {summary.categories[0]}
                  </span>
                  <span className="rounded-lg bg-white/5 px-2.5 py-1 font-mono text-[11px] text-white/50">
                    v{summary.version}
                  </span>
                  <span className="rounded-lg bg-white/5 px-2.5 py-1 font-mono text-[11px] text-white/50">
                    {summary.difficulty}
                  </span>
                </div>
                <h1 className="mt-3 font-display text-3xl font-black tracking-tight sm:text-4xl">
                  {summary.name}
                </h1>
                <p className="mt-2 max-w-2xl text-sm text-white/50 sm:text-base">{summary.description}</p>
              </div>

              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => copy(item?.install ?? `pnpm dlx shadcn@latest add @buildora/${slug}`, "install")}
                  className="rounded-lg bg-[#d4ff4f] px-4 py-2 text-sm font-bold text-black transition-colors"
                >
                  {copied === "install" ? "Copied" : "Copy install"}
                </motion.button>
                <button
                  onClick={() => copy(generateAIPrompt(), "ai")}
                  className="rounded-lg border border-white/15 px-4 py-2 text-sm text-white/80 transition-colors hover:bg-white/5"
                >
                  {copied === "ai" ? "Copied" : "Copy for AI"}
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5" aria-label="Framework support">
              {frameworks.slice(0, 6).map((f) => {
                const st = item?.implementations?.[f]?.status ??
                  (["react", "javascript", "html", "tailwind"].includes(f) ? "Full" : "Partial");
                return (
                  <span
                    key={f}
                    className={cn(
                      "rounded-md px-2 py-0.5 font-mono text-[10px]",
                      st === "Full"
                        ? "bg-[#4fe08a]/10 text-[#4fe08a]"
                        : st === "Partial"
                        ? "bg-[#ffb86b]/10 text-[#ffb86b]"
                        : "bg-white/5 text-white/40"
                    )}
                  >
                    {frameworkLabels[f]}
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      </motion.div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="min-w-0 space-y-6">
          <div className="overflow-hidden rounded-xl border border-white/10 bg-[#0b0d13]">
            <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.02] px-4 py-2">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-red-500/80" />
                  <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
                  <div className="h-3 w-3 rounded-full bg-green-500/80" />
                </div>
                <p className="font-mono text-xs text-white/50">{frameworkLabels[framework]}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setControls({ strength: 0.35, radius: 120, intensity: 0.6, speed: 1, glow: true, scale: 1 })}
                  className="rounded-md px-2 py-1 text-xs text-white/50 hover:bg-white/5"
                >
                  Reset
                </button>
                <button className="rounded-md px-2 py-1 text-xs text-white/50 hover:bg-white/5">
                  Fullscreen
                </button>
              </div>
            </div>
            <div className="relative flex min-h-[400px] w-full items-center justify-center bg-[#0b0d13] p-8">
              <ComponentRenderer slug={slug} controls={controls} />
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
            <div className="flex gap-2 overflow-x-auto pb-2">
              {frameworks.map((f) => (
                <button
                  key={f}
                  onClick={() => setFramework(f)}
                  className={cn(
                    "whitespace-nowrap rounded-md px-3 py-1.5 font-mono text-xs transition-all",
                    f === framework
                      ? "bg-[#d4ff4f] text-black"
                      : "text-white/50 hover:bg-white/5 hover:text-white"
                  )}
                >
                  {frameworkLabels[f]}
                </button>
              ))}
            </div>
            <CodeViewer files={ex.files} />
            <div className="mt-3 flex gap-3">
              <button
                onClick={() => copy(ex.files[0]?.code ?? "", "code")}
                className="flex items-center gap-2 rounded-lg bg-white/5 px-3 py-2 text-xs text-white/70 transition-colors hover:bg-white/10"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h12a2 2 0 012 2v8a2 2 0 01-2 2h-2m-4-4v6m0 0l-2-2m2 2l2-2" />
                </svg>
                {copied === "code" ? "Copied" : "Copy code"}
              </button>
              <a
                href={`https://github.com/Varun9490/Buildora/tree/main/packages/components/src/${slug}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-xs text-white/70 transition-colors hover:bg-white/5"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.2 11.38.6.11.82-.26.82-.58v-2.03c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.08-.74.08-.73.08-.73 1.2.08 1.84 1.23 1.84 1.23 1.07 1.84 2.8 1.31 3.49 1 .1-.78.42-1.31.76-1.61-2.66-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.13-.3-.54-1.52.12-3.18 0 0 1-.32 3.3 1.23a11.5 11.5 0 016.02 0c2.28-1.55 3.29-1.23 3.29-1.23.66 1.66.25 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.63-5.48 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.22.7.82.58A12.01 12.01 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
                Source
              </a>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
              <h3 className="font-display font-bold">Installation</h3>
              <code className="mt-3 block rounded-lg bg-black/30 p-3 font-mono text-xs text-[#d4ff4f]">
                {ex.install}
              </code>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
              <h3 className="font-display font-bold">Dependencies</h3>
              <p className="mt-3 font-mono text-xs text-white/70">
                {ex.dependencies.length ? ex.dependencies.join(", ") : item?.dependencies?.length ? item.dependencies.join(", ") : "None"}
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <DocCard title="Usage" icon="→" />
            <DocCard title="Accessibility" icon="♿" />
            <DocCard title="Responsive" icon="📱" />
            <DocCard title="Customize" icon="⚙" />
          </div>
        </div>

        <motion.aside
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="h-fit space-y-4 rounded-xl border border-white/10 bg-white/[0.02] p-4 lg:sticky lg:top-20"
        >
          <div>
            <h3 className="font-display font-bold">Controls</h3>
            <p className="text-xs text-white/40">Adjust and see changes live</p>
          </div>

          <div className="space-y-4">
            {allowed.includes("strength") && (
              <Knob label={`Strength · ${controls.strength.toFixed(2)}`} min={0} max={1} step={0.05} value={controls.strength} onChange={set("strength")} />
            )}
            {allowed.includes("radius") && (
              <Knob label={`Radius · ${controls.radius}px`} min={40} max={260} step={5} value={controls.radius} onChange={set("radius")} />
            )}
            {allowed.includes("intensity") && (
              <Knob label={`Intensity · ${controls.intensity.toFixed(2)}`} min={0} max={1} step={0.05} value={controls.intensity} onChange={set("intensity")} />
            )}
            {allowed.includes("speed") && (
              <Knob label={`Speed · ${controls.speed}×`} min={0.25} max={2.5} step={0.25} value={controls.speed} onChange={set("speed")} />
            )}
            {allowed.includes("scale") && (
              <Knob label={`Scale · ${controls.scale}×`} min={0.5} max={1.5} step={0.05} value={controls.scale} onChange={set("scale")} />
            )}
            {allowed.includes("glow") && (
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={controls.glow} onChange={set("glow")} className="h-4 w-4 accent-[#d4ff4f]" />
                Glow effect
              </label>
            )}
          </div>

          {related.length > 0 && (
            <div className="border-t border-white/10 pt-4">
              <h4 className="text-xs font-medium text-white/60">Related</h4>
              <div className="mt-2 space-y-1">
                {related.map((r) => (
                  <Link
                    key={r.slug}
                    href={`/components/${r.slug}`}
                    className="block text-sm text-white/70 hover:text-[#d4ff4f]"
                  >
                    {r.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </motion.aside>
      </div>
    </div>
  );
}

function DocCard({ title, icon }: { title: string; icon: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 transition-colors hover:border-white/20">
      <span className="text-lg">{icon}</span>
      <h4 className="mt-2 font-display text-sm font-bold">{title}</h4>
    </div>
  );
}

function Knob({ label, ...rest }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs text-white/50">{label}</span>
      <input type="range" {...rest} className="h-1.5 w-full appearance-none rounded-full bg-white/10 accent-[#d4ff4f]" />
    </label>
  );
}
