"use client";

import Link from "next/link";
import * as React from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { cn, copyToClipboard } from "@buildora/utils";
import { useBuildora } from "@/lib/store";
import { allComponents, frameworkLabels, frameworks } from "@/lib/registry";
import type { RegistryItem } from "@/lib/registry";
import { frameworkExample } from "@/lib/framework-code";
import { DEFAULT_RENDER_CONTROLS, type Controls } from "@/lib/render-controls";
import { CodeViewer } from "@/components/CodeViewer";
import { controlsFor, type ControlDef } from "@/lib/controls";
import { perfFor, relatedFor, a11yFor } from "@/lib/component-meta";
import { FrameworkSelect, type FrameworkStatus } from "@/components/FrameworkSelect";

// Code-split: the full component library barrel loads only when the preview mounts.
const ComponentRenderer = dynamic(() => import("@/components/ComponentRenderer"), {
  ssr: false,
  loading: () => <PreviewSkeleton />,
});

function PreviewSkeleton() {
  return (
    <div className="flex w-full max-w-md flex-col items-center gap-4">
      <div className="skeleton h-10 w-40 rounded-[10px]" />
      <div className="skeleton h-4 w-56 rounded" />
      <div className="skeleton h-4 w-40 rounded" />
    </div>
  );
}

export function ComponentDetail({ slug, item }: { slug: string; item: RegistryItem }) {
  const { framework, setFramework, pushRecent } = useBuildora();
  const [activeTab, setActiveTab] = React.useState<"preview" | "code">("preview");
  const [controls, setControls] = React.useState<Controls>({ ...DEFAULT_RENDER_CONTROLS });
  const [copied, setCopied] = React.useState<string | null>(null);

  React.useEffect(() => {
    pushRecent(slug);
  }, [slug, pushRecent]);

  const summary = allComponents.find((c) => c.slug === slug);
  const ex = React.useMemo(
    () => frameworkExample(slug, summary?.name ?? slug, framework, item),
    [slug, summary, framework, item]
  );

  if (!summary) return null;

  const copy = async (text: string, key: string) => {
    await copyToClipboard(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 1400);
  };

  const allowed: ControlDef[] = controlsFor(slug);

  // Honest source + pattern transparency. Registry items that share an
  // implementation file (e.g. agent-timeline inside streaming-chat) must
  // link to the real file and say so — never imply a dedicated slug dir.
  const primaryPath = (item as unknown as { files?: { path?: string }[] } | null)?.files?.[0]?.path;
  const sourceDir = (item as unknown as { sourceDir?: string } | null)?.sourceDir;
  const expectedDir = `packages/components/src/${slug}`;
  const isShared = Boolean(primaryPath && !primaryPath.startsWith(expectedDir + "/"));
  const sourceHref = sourceDir
    ? `https://github.com/Varun9490/Buildora/tree/main/packages/components/src/${sourceDir}`
    : `https://github.com/Varun9490/Buildora/tree/main/packages/components/src/${slug}`;

  const setNum = (k: keyof Controls) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setControls((c) => ({ ...c, [k]: Number(e.target.value) }));
  };
  const setToggle = (k: keyof Controls) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setControls((c) => ({ ...c, [k]: e.target.checked }));
  };
  const setSelect = (k: keyof Controls) => (e: React.ChangeEvent<HTMLSelectElement>) => {
    setControls((c) => ({ ...c, [k]: e.target.value }));
  };

  return (
    <div className="relative mx-auto max-w-[1400px] px-4 py-8 sm:py-16 font-sans">
      
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ease: [0.16, 1, 0.3, 1], duration: 0.6 }}
        className="mb-12 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between"
      >
        <div className="flex-1">
          <nav className="mb-4 flex items-center gap-2 font-mono text-[11px] font-medium text-[--b-muted] uppercase tracking-widest">
            <Link href="/components" className="hover:text-[--b-text]">Components</Link>
            <span>/</span>
            <span className="text-[--b-text]">{slug}</span>
          </nav>
          
          <h1 className="font-display text-4xl font-black tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            {summary.name}
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-[--b-muted] leading-relaxed">
            {summary.description}
          </p>
          
          <div className="mt-6 flex flex-wrap gap-2">
            <span className="b-badge-accent">{summary.categories[0]}</span>
            <span className="b-badge">v{summary.version}</span>
            <span className="b-badge">{summary.difficulty}</span>
            <span className="b-badge">{summary.status ?? "beta"}</span>
            {isShared && <span className="b-badge">pattern · shares {sourceDir}</span>}
          </div>            {isShared && primaryPath && (
            <p className="mt-4 max-w-2xl rounded-xl border border-[--b-border] bg-[--b-surface] p-4 font-mono text-[11px] leading-relaxed text-[--b-muted]">
              Pattern preview — this entry shares implementation{" "}
              <span className="text-[--b-text]">{primaryPath}</span>. Dedicated{" "}
              <span className="text-[--b-text]">{slug}</span> implementation planned; install gives
              the shared pattern source today.
            </p>
          )}
          {(summary.status ?? "beta") === "experimental" && (
            <p className="mt-4 max-w-2xl rounded-xl border border-[--b-warning]/40 bg-[--b-surface] p-4 text-[13px] leading-relaxed text-[--b-text-secondary]">
              Experimental — this item fails the bar today and is hidden from the default listing.
              Install by direct URL only; the API may change or the item may be removed or merged.
            </p>
          )}
        </div>

        <div className="flex shrink-0 gap-3">
            <button
              onClick={() => copy(item?.install ?? `pnpm dlx shadcn@latest add @buildora/${slug}`, "install")}
              className="flex h-11 items-center gap-2 rounded-[10px] bg-[--b-accent] px-6 font-mono text-[12px] font-bold text-[--b-accent-foreground] transition-transform active:scale-95"
            >
             {copied === "install" ? "Copied" : "Install Component"}
           </button>
            <a
              href={sourceHref}
              target="_blank"
              rel="noreferrer"
              className="flex h-11 items-center gap-2 rounded-[10px] border border-[--b-border] bg-[--b-surface] px-6 font-mono text-[12px] font-bold text-[--b-text] transition-colors hover:border-[--b-border-hover]"
            >
              Source
            </a>
        </div>
      </motion.div>

      <div className="grid gap-10 lg:grid-cols-[1fr_320px] xl:grid-cols-[1fr_380px]">
        {/* Main Showcase Area */}
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
           className="min-w-0"
        >
          {/* Tabs */}
          <div className="mb-4 flex items-center justify-between border-b border-[--b-border] pb-4">
             <div className="flex gap-6">
                <motion.button
                  onClick={() => setActiveTab("preview")}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: "spring", stiffness: 100, damping: 20 }}
                  className={cn(
                    "relative pb-4 font-mono text-[12px] font-bold uppercase tracking-widest transition-colors",
                    activeTab === "preview" ? "text-[--b-accent]" : "text-[--b-muted] hover:text-[--b-text]"
                  )}
                >
                  Preview
                  {activeTab === "preview" && (
                    <motion.div
                      layoutId="detail-tab-underline"
                      transition={{ type: "spring", stiffness: 100, damping: 20, mass: 0.8 }}
                      className="absolute -bottom-[1px] left-0 right-0 h-[2px] bg-[--b-accent]"
                    />
                  )}
                </motion.button>
                <motion.button
                  onClick={() => setActiveTab("code")}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: "spring", stiffness: 100, damping: 20 }}
                  className={cn(
                    "relative pb-4 font-mono text-[12px] font-bold uppercase tracking-widest transition-colors",
                    activeTab === "code" ? "text-[--b-accent]" : "text-[--b-muted] hover:text-[--b-text]"
                  )}
                >
                  Code
                  {activeTab === "code" && (
                    <motion.div
                      layoutId="detail-tab-underline"
                      transition={{ type: "spring", stiffness: 100, damping: 20, mass: 0.8 }}
                      className="absolute -bottom-[1px] left-0 right-0 h-[2px] bg-[--b-accent]"
                    />
                  )}
                </motion.button>
             </div>
             
              {/* Framework Switcher (only visible in Code tab) */}
              <AnimatePresence>
                {activeTab === "code" && (
                  <motion.div
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="flex items-center gap-3"
                  >
                    <span className="hidden font-mono text-[10px] uppercase tracking-widest text-[--b-muted] sm:inline">
                      {ex.status}
                    </span>
                    <FrameworkSelect
                      value={framework}
                      onChange={setFramework}
                      frameworks={frameworks}
                      labels={frameworkLabels}
                      statuses={Object.fromEntries(frameworks.map((f) => [f, (item?.implementations?.[f]?.status ?? ex.status) as FrameworkStatus]))}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
          </div>

          {/* Tab Content — theme-aware preview surface */}
          <div className="relative rounded-2xl border border-[--b-border] bg-[--b-panel] shadow-card overflow-hidden">
              
              {/* Window header — real metadata, not decorative traffic lights */}
          <div className="flex h-12 items-center justify-between border-b border-[--b-border] bg-[--b-surface] px-4">
            <span className="font-mono text-[11px] text-[--b-muted]">@buildora/{slug}</span>
            <span className="b-badge">{activeTab === "preview" ? "live preview" : frameworkLabels[framework]}</span>
          </div>

              <div className="relative min-h-[500px] w-full">
                <AnimatePresence mode="wait">
                  {activeTab === "preview" ? (
                    <motion.div
                      key="preview"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.25, ease: "easeOut" }}
                      className="absolute inset-0 flex items-center justify-center p-8 bg-[--b-panel]"
                    >
                      <ComponentRenderer slug={slug} controls={controls} />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="code"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.25, ease: "easeOut" }}
                      className="absolute inset-0 h-full w-full overflow-auto scroll-sleek bg-[--b-panel]"
                    >
                      <div className="p-4 relative">
                          {ex.notes && (
                            <p className="mb-3 rounded-lg border border-[--b-border] bg-[--b-surface] px-3 py-2 font-mono text-[11px] leading-relaxed text-[--b-muted]">
                              <span className="font-bold text-[--b-text-secondary]">{frameworkLabels[framework]} · {ex.status}.</span> {ex.notes}
                            </p>
                          )}

                         <CodeViewer files={ex.files} />
                     </div>
                   </motion.div>
                 )}
               </AnimatePresence>
             </div>
          </div>
        </motion.div>

        {/* Sidebar */}
        <motion.aside
           initial={{ opacity: 0, x: 20 }}
           animate={{ opacity: 1, x: 0 }}
           transition={{ delay: 0.2, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
           className="h-fit space-y-8"
        >
           {/* Interactive Controls */}
           <div className="rounded-2xl border border-[--b-border] bg-[--b-panel] p-6 shadow-card">
              <div className="mb-6 flex items-center justify-between">
                <h3 className="font-mono text-[12px] font-bold uppercase tracking-widest text-[--b-text]">Component Controls</h3>
                <button
                  onClick={() => setControls({ ...DEFAULT_RENDER_CONTROLS })}
                  className="font-mono text-[10px] uppercase text-[--b-muted] hover:text-[--b-accent]"
                >
                  Reset
                </button>
              </div>

              <div className="space-y-6">
                {allowed.length === 0 && (
                  <p className="rounded-lg border border-[--b-border] bg-[--b-surface] p-3 font-mono text-[11px] leading-relaxed text-[--b-muted]">
                    No tunable props for this component. The preview shows the real default implementation.
                  </p>
                )}
                {allowed.map((c) => {
                  if (c.kind === "slider") {
                    return (
                      <Knob
                        key={c.key}
                        label={`${c.label} · ${c.prop}`}
                        min={c.min}
                        max={c.max}
                        step={c.step}
                        value={Number(controls[c.key as keyof Controls])}
                        onChange={setNum(c.key as keyof Controls)}
                      />
                    );
                  }
                  if (c.kind === "toggle") {
                    const on = Boolean(controls[c.key as keyof Controls]);
                    return (
                      <label
                        key={c.key}
                        className="flex cursor-pointer items-center justify-between rounded-lg border border-[--b-border] bg-[--b-surface] p-3 transition-colors hover:border-[--b-border-hover]"
                      >
                        <span className="font-mono text-[11px] font-medium text-[--b-text]">
                          {c.label} · {c.prop}
                        </span>
                        <div className={cn("relative h-4 w-8 rounded-full transition-colors", on ? "bg-[--b-accent]" : "bg-[--b-border-hover]")}>
                          <div className={cn("absolute top-0.5 h-3 w-3 rounded-full bg-[--b-elevated] shadow-subtle transition-transform", on ? "left-0 translate-x-4" : "translate-x-0.5")} />
                        </div>
                        <input type="checkbox" className="sr-only" checked={on} onChange={setToggle(c.key as keyof Controls)} />
                      </label>
                    );
                  }
                  return (
                    <label key={c.key} className="block">
                      <span className="mb-2 block font-mono text-[11px] font-medium text-[--b-text-secondary]">
                        {c.label} · {c.prop}
                      </span>
                      <select
                        value={String(controls[c.key as keyof Controls])}
                        onChange={setSelect(c.key as keyof Controls)}
                        className="w-full rounded-lg border border-[--b-border] bg-[--b-surface] px-3 py-2 font-mono text-[12px] text-[--b-text]"
                      >
                        {c.options.map((o) => (
                          <option key={o} value={o}>
                            {o}
                          </option>
                        ))}
                      </select>
                    </label>
                  );
                })}
              </div>
           </div>

            {/* Metadata & Dependencies */}
            <div className="space-y-4">
              <div className="rounded-xl border border-[--b-border] bg-[--b-panel] p-5">
                <h4 className="font-mono text-[10px] uppercase tracking-widest text-[--b-muted]">Dependencies</h4>
                <div className="mt-3 flex flex-wrap gap-2">
                   {ex.dependencies.length ? (
                     ex.dependencies.map(d => (
                       <span key={d} className="rounded-md bg-[--b-surface] px-2.5 py-1 font-mono text-[11px] text-[--b-text-secondary]">{d}</span>
                     ))
                   ) : (
                     <span className="font-mono text-[11px] text-[--b-muted]">Zero dependencies</span>
                   )}
                </div>
              </div>
              <div className="rounded-xl border border-[--b-border] bg-[--b-panel] p-5">
                <h4 className="font-mono text-[10px] uppercase tracking-widest text-[--b-muted]">Accessibility</h4>
                <p className="mt-3 text-[13px] leading-relaxed text-[--b-text-secondary]">{a11yFor(slug)}</p>
                {item && (
                  <p className="mt-2 font-mono text-[11px] text-[--b-muted]">
                    keyboard · screen-reader · reduced-motion documented in registry
                  </p>
                )}
              </div>
              <div className="rounded-xl border border-[--b-border] bg-[--b-panel] p-5">
                <h4 className="font-mono text-[10px] uppercase tracking-widest text-[--b-muted]">
                  Performance · {perfFor(slug).level}
                </h4>
                <p className="mt-3 text-[13px] leading-relaxed text-[--b-text-secondary]">{perfFor(slug).note}</p>
              </div>
              {relatedFor(slug).length > 0 && (
                <div className="rounded-xl border border-[--b-border] bg-[--b-panel] p-5">
                  <h4 className="font-mono text-[10px] uppercase tracking-widest text-[--b-muted]">Related</h4>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {relatedFor(slug).map((r) => (
                      <Link
                        key={r}
                        href={`/components/${r}`}
                        className="rounded-md bg-[--b-surface] px-2.5 py-1 font-mono text-[11px] text-[--b-text-secondary] transition-colors hover:text-[--b-accent]"
                      >
                        {r}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

        </motion.aside>
      </div>
    </div>
  );
}

function Knob({ label, ...rest }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <div className="mb-2 flex items-center justify-between">
         <span className="font-mono text-[11px] font-medium text-[--b-text-secondary]">{label}</span>
         <span className="font-mono text-[10px] text-[--b-muted]">{rest.value}</span>
      </div>
      <input
        type="range"
        {...rest}
        className="h-1.5 w-full appearance-none rounded-full bg-[--b-border] accent-[--b-accent] hover:accent-[--b-accent]"
      />
    </label>
  );
}
