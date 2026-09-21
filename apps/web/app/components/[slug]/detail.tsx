"use client";

import Link from "next/link";
import * as React from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "motion/react";
import { cn, copyToClipboard } from "@buildora/utils";
import { useBuildora } from "@/lib/store";
import { allComponents, frameworkLabels, frameworks } from "@/lib/registry";
import type { RegistryItem } from "@/lib/registry";
import { frameworkExample } from "@/lib/framework-code";
import { DEFAULT_RENDER_CONTROLS, type Controls } from "@/lib/render-controls";
import { CodeViewer } from "@/components/CodeViewer";

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

  const sourceHref = `https://github.com/Varun9490/Buildora/tree/main/packages/components/src/${slug}`;

  return (
    <div className="relative mx-auto max-w-5xl px-4 py-8 sm:py-16 font-sans">
      
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ease: [0.16, 1, 0.3, 1], duration: 0.6 }}
        className="mb-12 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between"
      >
        <div className="flex-1">
          <nav className="mb-4 flex items-center gap-2 font-mono text-[11px] font-medium text-[color:var(--b-muted)] uppercase tracking-widest">
            <Link href="/components" className="hover:text-[color:var(--b-text)]">Components</Link>
            <span>/</span>
            <span className="text-[color:var(--b-text)]">{slug}</span>
          </nav>
          
          <h1 className="font-display text-4xl font-black tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            {summary.name}
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-[color:var(--b-muted)] leading-relaxed">
            {summary.description}
          </p>
          
          <div className="mt-6 flex flex-wrap gap-2">
            <span className="b-badge-accent">{summary.categories[0]}</span>
            <span className="b-badge">v{summary.version}</span>
            <span className="b-badge">{summary.difficulty}</span>
            <span className="b-badge">{summary.status ?? "beta"}</span>
          </div>
        </div>

        <div className="flex shrink-0 gap-3">
            <button
              onClick={() => copy(item?.install ?? `pnpm dlx shadcn@latest add @buildora/${slug}`, "install")}
              className="flex h-11 items-center gap-2 rounded-[10px] bg-[color:var(--b-accent)] px-6 font-mono text-[12px] font-bold text-[color:var(--b-accent-foreground)] transition-transform active:scale-95"
            >
             {copied === "install" ? "Copied" : "Install Component"}
           </button>
            <a
              href={sourceHref}
              target="_blank"
              rel="noreferrer"
              className="flex h-11 items-center gap-2 rounded-[10px] border border-[color:var(--b-border)] bg-[color:var(--b-surface)] px-6 font-mono text-[12px] font-bold text-[color:var(--b-text)] transition-colors hover:border-[color:var(--b-border-hover)]"
            >
              Source
            </a>
        </div>
      </motion.div>

      <div className="grid gap-10 grid-cols-1">
        {/* Main Showcase Area */}
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
           className="min-w-0"
        >
          {/* Tabs */}
          <div className="mb-4 flex items-center justify-between border-b border-[color:var(--b-border)] pb-4">
             <div className="flex gap-6">
                <motion.button
                  onClick={() => setActiveTab("preview")}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: "spring", stiffness: 100, damping: 20 }}
                  className={cn(
                    "relative pb-4 font-mono text-[12px] font-bold uppercase tracking-widest transition-colors",
                    activeTab === "preview" ? "text-[color:var(--b-accent)]" : "text-[color:var(--b-muted)] hover:text-[color:var(--b-text)]"
                  )}
                >
                  Preview
                  {activeTab === "preview" && (
                    <motion.div
                      layoutId="detail-tab-underline"
                      transition={{ type: "spring", stiffness: 100, damping: 20, mass: 0.8 }}
                      className="absolute -bottom-[1px] left-0 right-0 h-[2px] bg-[color:var(--b-accent)]"
                    />
                  )}
                </motion.button>
                <motion.button
                  onClick={() => setActiveTab("code")}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: "spring", stiffness: 100, damping: 20 }}
                  className={cn(
                    "relative pb-4 font-mono text-[12px] font-bold uppercase tracking-widest transition-colors",
                    activeTab === "code" ? "text-[color:var(--b-accent)]" : "text-[color:var(--b-muted)] hover:text-[color:var(--b-text)]"
                  )}
                >
                  Code
                  {activeTab === "code" && (
                    <motion.div
                      layoutId="detail-tab-underline"
                      transition={{ type: "spring", stiffness: 100, damping: 20, mass: 0.8 }}
                      className="absolute -bottom-[1px] left-0 right-0 h-[2px] bg-[color:var(--b-accent)]"
                    />
                  )}
                </motion.button>
             </div>
          </div>

          {/* Tab Content — theme-aware preview surface */}
          <div className="relative rounded-2xl border border-[color:var(--b-border)] bg-[color:var(--b-panel)] shadow-card overflow-hidden">
              
              {/* Window header — real metadata, not decorative traffic lights */}
          <div className="flex h-12 items-center justify-between border-b border-[color:var(--b-border)] bg-[color:var(--b-surface)] px-4">
            <span className="font-mono text-[11px] text-[color:var(--b-muted)]">@buildora/{slug}</span>
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
                      className="absolute inset-0 flex items-center justify-center p-8 bg-[color:var(--b-panel)]"
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
                      className="absolute inset-0 h-full w-full overflow-auto scroll-sleek bg-[color:var(--b-panel)]"
                    >
                      <div className="p-4 relative">
                          {ex.notes && (
                            <p className="mb-3 rounded-lg border border-[color:var(--b-border)] bg-[color:var(--b-surface)] px-3 py-2 font-mono text-[11px] leading-relaxed text-[color:var(--b-muted)]">
                              <span className="font-bold text-[color:var(--b-text-secondary)]">React.</span> {ex.notes}
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
      </div>
    </div>
  );
}
