"use client";

import Link from "next/link";
import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn, copyToClipboard } from "@buildora/utils";
import { useBuildora } from "@/lib/store";
import { allComponents, frameworkLabels, frameworks } from "@/lib/registry";
import type { RegistryItem } from "@/lib/registry";
import { frameworkExample } from "@/lib/framework-code";
import { CodeViewer } from "@/components/CodeViewer";
import { ComponentRenderer, DEFAULT_RENDER_CONTROLS, type Controls } from "@/components/ComponentRenderer";
import { controlsFor, type ControlDef } from "@/lib/controls";
import { perfFor, relatedFor, a11yFor } from "@/lib/component-meta";

export function ComponentDetail({ slug }: { slug: string }) {
  const [item, setItem] = React.useState<RegistryItem | null>(null);
  const { framework, setFramework, pushRecent } = useBuildora();
  const [activeTab, setActiveTab] = React.useState<"preview" | "code">("preview");
  const [controls, setControls] = React.useState<Controls>({ ...DEFAULT_RENDER_CONTROLS });
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
  
  if (!summary) return <div className="p-16">Loading...</div>;

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
            {isShared && <span className="b-badge">pattern · shares {sourceDir}</span>}
          </div>
          {isShared && primaryPath && (
            <p className="mt-4 max-w-2xl rounded-xl border border-[--b-border] bg-white/[0.02] p-4 font-mono text-[11px] leading-relaxed text-[--b-muted]">
              Pattern preview — this entry shares implementation{" "}
              <span className="text-[--b-text]">{primaryPath}</span>. Dedicated{" "}
              <span className="text-[--b-text]">{slug}</span> implementation planned; install gives
              the shared pattern source today.
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
                     className="flex gap-2"
                   >
                     {frameworks.map((f) => (
                       <button
                         key={f}
                         onClick={() => setFramework(f)}
                          className={cn(
                            "rounded-lg border px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider transition-all",
                            f === framework
                              ? "border-[--b-accent] bg-[--b-accent-muted] text-[--b-accent]"
                              : "border-[--b-border] bg-[--b-surface] text-[--b-muted] hover:border-[--b-border-hover] hover:text-[--b-text-secondary]"
                          )}
                       >
                         {frameworkLabels[f]}
                       </button>
                     ))}
                   </motion.div>
                )}
             </AnimatePresence>
          </div>

          {/* Tab Content — theme-aware preview surface */}
          <div className="relative rounded-2xl border border-[--b-border] bg-[--b-panel] shadow-card overflow-hidden">
              
              {/* Mac OS Header for Window Feel */}
              <div className="flex h-12 items-center gap-2 border-b border-[--b-border] bg-[--b-surface] px-4">
                <div className="h-3 w-3 rounded-full bg-red-500/80"></div>
                <div className="h-3 w-3 rounded-full bg-amber-500/80"></div>
                <div className="h-3 w-3 rounded-full bg-emerald-500/80"></div>
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
                      className="absolute inset-0 h-full w-full overflow-auto bg-[--b-panel]"
                    >
                      <div className="p-4 relative">
                         <motion.button
                           whileTap={{ scale: 0.95 }}
                           transition={{ type: "spring", stiffness: 100, damping: 20 }}
                           onClick={() => copy(ex.files[0]?.code ?? "", "code")}
                           className="absolute right-6 top-6 rounded-md border border-[--b-border] bg-[--b-surface] p-2 text-[--b-text-secondary] transition-colors hover:text-[--b-text] z-10"
                         >
                           {copied === "code" ? (
                             <svg className="h-4 w-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                           ) : (
                             <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9.75a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" /></svg>
                            )}
                         </motion.button>
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
           <div className="rounded-2xl border border-[--b-border] bg-white/[0.01] p-6 shadow-xl">
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
                  <p className="rounded-lg border border-[--b-border] bg-white/[0.02] p-3 font-mono text-[11px] leading-relaxed text-[--b-muted]">
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
                        className="flex cursor-pointer items-center justify-between rounded-lg border border-[--b-border] bg-white/[0.02] p-3 transition-colors hover:bg-white/[0.04]"
                      >
                        <span className="font-mono text-[11px] font-medium text-[--b-text]">
                          {c.label} · {c.prop}
                        </span>
                        <div className={cn("relative h-4 w-8 rounded-full transition-colors", on ? "bg-[--b-accent]" : "bg-white/20")}>
                          <div className={cn("absolute top-0.5 h-3 w-3 rounded-full bg-white transition-transform", on ? "left-0 translate-x-4" : "translate-x-0.5")} />
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
                        className="w-full rounded-lg border border-[--b-border] bg-white/[0.03] px-3 py-2 font-mono text-[12px] text-[--b-text]"
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
              <div className="rounded-xl border border-[--b-border] bg-white/[0.01] p-5">
                <h4 className="font-mono text-[10px] uppercase tracking-widest text-[--b-muted]">Dependencies</h4>
                <div className="mt-3 flex flex-wrap gap-2">
                   {ex.dependencies.length ? (
                     ex.dependencies.map(d => (
                       <span key={d} className="rounded-md bg-white/[0.04] px-2.5 py-1 font-mono text-[11px] text-[--b-text-secondary]">{d}</span>
                     ))
                   ) : (
                     <span className="font-mono text-[11px] text-[--b-muted]">Zero dependencies</span>
                   )}
                </div>
              </div>
              <div className="rounded-xl border border-[--b-border] bg-white/[0.01] p-5">
                <h4 className="font-mono text-[10px] uppercase tracking-widest text-[--b-muted]">Accessibility</h4>
                <p className="mt-3 text-[13px] leading-relaxed text-[--b-text-secondary]">{a11yFor(slug)}</p>
                {item && (
                  <p className="mt-2 font-mono text-[11px] text-[--b-muted]">
                    keyboard · screen-reader · reduced-motion documented in registry
                  </p>
                )}
              </div>
              <div className="rounded-xl border border-[--b-border] bg-white/[0.01] p-5">
                <h4 className="font-mono text-[10px] uppercase tracking-widest text-[--b-muted]">
                  Performance · {perfFor(slug).level}
                </h4>
                <p className="mt-3 text-[13px] leading-relaxed text-[--b-text-secondary]">{perfFor(slug).note}</p>
              </div>
              {relatedFor(slug).length > 0 && (
                <div className="rounded-xl border border-[--b-border] bg-white/[0.01] p-5">
                  <h4 className="font-mono text-[10px] uppercase tracking-widest text-[--b-muted]">Related</h4>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {relatedFor(slug).map((r) => (
                      <Link
                        key={r}
                        href={`/components/${r}`}
                        className="rounded-md bg-white/[0.04] px-2.5 py-1 font-mono text-[11px] text-[--b-text-secondary] transition-colors hover:text-[--b-accent]"
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
        className="h-1.5 w-full appearance-none rounded-full bg-white/10 accent-[--b-accent] hover:accent-[--b-accent]"
      />
    </label>
  );
}
