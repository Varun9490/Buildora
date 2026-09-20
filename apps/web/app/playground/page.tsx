"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import { allComponents, frameworks, frameworkLabels, getComponentSync } from "@/lib/registry";
import { ComponentRenderer, DEFAULT_RENDER_CONTROLS, type Controls } from "@/components/ComponentRenderer";
import { CodeViewer } from "@/components/CodeViewer";
import { frameworkExample } from "@/lib/framework-code";
import { useBuildora } from "@/lib/store";
import { controlsFor } from "@/lib/controls";
import { cn, copyToClipboard } from "@buildora/utils";

type Preset = { label: string; controls: Partial<Controls> };

const componentPresets: Record<string, Preset[]> = {
  "magnetic-button": [
    { label: "Subtle", controls: { strength: 0.2, radius: 80 } },
    { label: "Strong", controls: { strength: 0.6, radius: 180, variant: "accent" } },
    { label: "Ghost", controls: { strength: 0.35, radius: 120, variant: "ghost" } },
  ],
  "particle-field": [
    { label: "Sparse", controls: { count: 25 } },
    { label: "Dense", controls: { count: 150 } },
    { label: "Default", controls: { count: 70 } },
  ],
  "liquid-button": [
    { label: "Gentle", controls: { intensity: 0.3 } },
    { label: "Aggressive", controls: { intensity: 1 } },
    { label: "Organic", controls: { intensity: 0.7 } },
  ],
  "magnetic-card": [
    { label: "Subtle", controls: { tilt: 4 } },
    { label: "Dramatic", controls: { tilt: 14 } },
  ],
  "slingshot-otp": [
    { label: "4-digit", controls: { length: 4 } },
    { label: "6-digit", controls: { length: 6 } },
  ],
  "advanced-table": [
    { label: "Compact", controls: { pageSize: 4 } },
    { label: "Default", controls: { pageSize: 6 } },
  ],
  default: [{ label: "Default", controls: {} }],
};

function getPresets(slug: string): Preset[] {
  return componentPresets[slug] || componentPresets.default;
}

function SliderControl({ label, value, min, max, step, onChange }: { label: string; value: number; min: number; max: number; step: number; onChange: (v: number) => void }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-white/60">{label}</span>
        <span className="font-mono text-xs text-[#d4ff4f]">{value.toFixed(step < 1 ? 2 : 0)}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-1.5 w-full appearance-none rounded-full bg-white/10 accent-[#d4ff4f] [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#d4ff4f]"
      />
    </div>
  );
}

function ToggleControl({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex cursor-pointer items-center justify-between">
      <span className="text-xs font-medium text-white/60">{label}</span>
      <button
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative h-5 w-9 rounded-full transition-colors",
          checked ? "bg-[#d4ff4f]" : "bg-white/10"
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-black transition-transform",
            checked && "translate-x-4"
          )}
        />
      </button>
    </label>
  );
}

function PlaygroundContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { framework: globalFramework, pushRecent } = useBuildora();

  const initialSlug = searchParams.get("c") || "magnetic-button";
  const initialFramework = searchParams.get("fw") || globalFramework;
  const initialTheme = searchParams.get("theme") === "light" ? "light" : "dark";
  const initialWidth = searchParams.get("w") || "desktop";

  const [slug, setSlug] = React.useState(initialSlug);
  const [framework, setFramework] = React.useState(initialFramework);
  const [theme, setTheme] = React.useState<"dark" | "light">(initialTheme);
  const [previewWidth, setPreviewWidth] = React.useState<"desktop" | "tablet" | "mobile">(
    initialWidth as "desktop" | "tablet" | "mobile"
  );
  const [controls, setControls] = React.useState<Controls>({ ...DEFAULT_RENDER_CONTROLS });
  const [searchQuery, setSearchQuery] = React.useState("");
  const [copiedUrl, setCopiedUrl] = React.useState(false);
  const [copiedInstall, setCopiedInstall] = React.useState(false);
  const [copiedPrompt, setCopiedPrompt] = React.useState(false);

  const component = React.useMemo(() => {
    const found = allComponents.find((c) => c.slug === slug);
    return found || allComponents[0];
  }, [slug]);

  const fullComponent = React.useMemo(() => getComponentSync(slug), [slug]);
  const example = React.useMemo(
    () => frameworkExample(slug, component.name, framework, fullComponent),
    [slug, component.name, framework, fullComponent]
  );

  const presetButtons = getPresets(slug);

  const widthClasses = {
    desktop: "w-full max-w-5xl",
    tablet: "w-full max-w-[768px]",
    mobile: "w-full max-w-[375px]",
  };

  React.useEffect(() => {
    pushRecent(slug);
  }, [slug, pushRecent]);

  const updateUrl = React.useCallback(
    (newSlug: string, newFramework: string, newTheme: string, newWidth: string) => {
      const params = new URLSearchParams();
      params.set("c", newSlug);
      params.set("fw", newFramework);
      params.set("theme", newTheme);
      params.set("w", newWidth);
      router.replace(`/playground?${params.toString()}`, { scroll: false });
    },
    [router]
  );

  const handleSlugChange = (newSlug: string) => {
    setSlug(newSlug);
    setControls({ ...DEFAULT_RENDER_CONTROLS });
    updateUrl(newSlug, framework, theme, previewWidth);
  };

  const handleFrameworkChange = (newFramework: string) => {
    setFramework(newFramework);
    updateUrl(slug, newFramework, theme, previewWidth);
  };

  const handleThemeChange = (newTheme: "dark" | "light") => {
    setTheme(newTheme);
    updateUrl(slug, framework, newTheme, previewWidth);
  };

  const handleWidthChange = (newWidth: "desktop" | "tablet" | "mobile") => {
    setPreviewWidth(newWidth);
    updateUrl(slug, framework, theme, newWidth);
  };

  const getShareUrl = () => {
    if (typeof window === "undefined") return "";
    const params = new URLSearchParams();
    params.set("c", slug);
    params.set("fw", framework);
    params.set("theme", theme);
    params.set("w", previewWidth);
    return `${window.location.origin}/playground?${params.toString()}`;
  };

  const copyShareUrl = async () => {
    await copyToClipboard(getShareUrl());
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 1500);
  };

  const copyInstallCommand = async () => {
    const cmd = `pnpm dlx shadcn@latest add @buildora/${slug}`;
    await copyToClipboard(cmd);
    setCopiedInstall(true);
    setTimeout(() => setCopiedInstall(false), 1500);
  };

  const copyAiPrompt = async () => {
    const defs = controlsFor(slug);
    const propLines =
      defs.length > 0
        ? defs.map((d) => `- ${d.prop}: ${String(controls[d.key as keyof Controls])}`).join("\n")
        : "- default props (no tunable props)";
    const prompt = `Create a ${component.name} component similar to Buildora's ${slug}.\n${propLines}\n- Category: ${component.categories.join(", ")}\n- Framework: ${frameworkLabels[framework]}`;
    await copyToClipboard(prompt);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 1500);
  };

  const applyPreset = (preset: Preset) => {
    setControls((c) => ({ ...c, ...preset.controls }));
  };

  const filteredComponents = allComponents.filter((c) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return c.name.toLowerCase().includes(q) || c.slug.includes(q);
  });

  return (
    <div className="flex h-[calc(100vh-80px)] min-h-[600px] flex-col overflow-hidden">
      <div className="flex flex-1 gap-4 overflow-hidden p-4">
        <aside className="flex w-64 flex-shrink-0 flex-col gap-3 overflow-hidden">
          <div className="flex items-center justify-between">
            <h1 className="font-display text-lg font-black">Lab</h1>
            <Link
              href="/components"
              className="text-xs text-white/50 hover:text-[#d4ff4f]"
            >
              All components
            </Link>
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="Search components..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-sm placeholder:text-white/30 outline-none focus:border-[#d4ff4f]/50"
              aria-label="Search components"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70"
                aria-label="Clear search"
              >
                &times;
              </button>
            )}
          </div>
          <ul className="flex-1 overflow-y-auto rounded-2xl border border-white/[0.06] bg-white/[0.02] p-1">
            {filteredComponents.map((c) => (
              <li key={c.slug}>
                <button
                  onClick={() => handleSlugChange(c.slug)}
                  className={cn(
                    "w-full rounded-xl px-3 py-2 text-left text-sm transition-colors",
                    slug === c.slug
                      ? "bg-[#d4ff4f] font-bold text-black"
                      : "text-white/60 hover:bg-white/5 hover:text-white/90"
                  )}
                >
                  {c.name}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        <main className="flex flex-1 flex-col gap-3 overflow-hidden">
          <div className="flex items-center gap-2 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-2">
            <span className="px-2 text-[11px] font-medium uppercase tracking-wider text-white/40">
              Preview
            </span>
            <div className="ml-auto flex items-center gap-1.5">
              <button
                onClick={() => handleThemeChange("dark")}
                className={cn(
                  "rounded-lg p-1.5 transition-colors",
                  theme === "dark" ? "bg-white/10 text-white" : "text-white/40 hover:text-white/70"
                )}
                aria-label="Dark theme"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              </button>
              <button
                onClick={() => handleThemeChange("light")}
                className={cn(
                  "rounded-lg p-1.5 transition-colors",
                  theme === "light" ? "bg-white/10 text-white" : "text-white/40 hover:text-white/70"
                )}
                aria-label="Light theme"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </button>
              <div className="ml-2 h-4 w-px bg-white/10" />
              {(["desktop", "tablet", "mobile"] as const).map((w) => (
                <button
                  key={w}
                  onClick={() => handleWidthChange(w)}
                  className={cn(
                    "rounded-lg px-2.5 py-1 text-xs font-medium transition-colors",
                    previewWidth === w
                      ? "bg-[#d4ff4f] text-black"
                      : "text-white/50 hover:bg-white/5 hover:text-white/80"
                  )}
                >
                  {w.charAt(0).toUpperCase() + w.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div
            className={cn(
              "flex-1 overflow-auto rounded-2xl border border-white/[0.06] p-6",
              theme === "dark"
                ? "bg-[#08090d]"
                : "bg-gradient-to-b from-neutral-50 to-neutral-100"
            )}
          >
            <div
              className={cn(
                "mx-auto flex min-h-[300px] items-center justify-center transition-all duration-300",
                widthClasses[previewWidth]
              )}
            >
              <ComponentRenderer slug={slug} controls={controls} />
            </div>
          </div>

          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-3">
            <div className="flex items-center gap-2 overflow-x-auto">
              <span className="shrink-0 text-[11px] font-medium uppercase tracking-wider text-white/40">
                Framework
              </span>
              {frameworks.map((fw) => (
                <button
                  key={fw}
                  onClick={() => handleFrameworkChange(fw)}
                  className={cn(
                    "shrink-0 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
                    framework === fw
                      ? "bg-[#d4ff4f] text-black"
                      : "text-white/60 hover:bg-white/5 hover:text-white/90"
                  )}
                >
                  {frameworkLabels[fw] || fw}
                </button>
              ))}
            </div>
          </div>
        </main>

        <aside className="flex w-72 flex-shrink-0 flex-col gap-3 overflow-hidden">
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
            <h2 className="mb-3 text-xs font-bold uppercase tracking-wider text-white/40">
              Controls · {controlsFor(slug).length > 0 ? "component-specific" : "no tunable props"}
            </h2>
            <div className="space-y-4">
              {controlsFor(slug).length === 0 && (
                <p className="rounded-lg border border-white/10 bg-white/[0.02] p-3 text-xs leading-relaxed text-white/50">
                  This component exposes no tunable numeric props. Preview shows the real default.
                </p>
              )}
              {controlsFor(slug).map((d) => {
                if (d.kind === "slider") {
                  return (
                    <SliderControl
                      key={d.key}
                      label={`${d.label} · ${d.prop}`}
                      value={Number(controls[d.key as keyof Controls])}
                      min={d.min}
                      max={d.max}
                      step={d.step}
                      onChange={(v) => setControls((c) => ({ ...c, [d.key]: v }))}
                    />
                  );
                }
                if (d.kind === "toggle") {
                  return (
                    <ToggleControl
                      key={d.key}
                      label={`${d.label} · ${d.prop}`}
                      checked={Boolean(controls[d.key as keyof Controls])}
                      onChange={(v) => setControls((c) => ({ ...c, [d.key]: v }))}
                    />
                  );
                }
                return (
                  <label key={d.key} className="block">
                    <span className="mb-1.5 block text-xs font-medium text-white/60">
                      {d.label} · {d.prop}
                    </span>
                    <select
                      value={String(controls[d.key as keyof Controls])}
                      onChange={(e) => setControls((c) => ({ ...c, [d.key]: e.target.value }))}
                      className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-2 py-1.5 text-xs text-white"
                    >
                      {d.options.map((o) => (
                        <option key={o} value={o} className="bg-black">
                          {o}
                        </option>
                      ))}
                    </select>
                  </label>
                );
              })}
            </div>
          </div>

          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
            <h2 className="mb-3 text-xs font-bold uppercase tracking-wider text-white/40">
              Presets
            </h2>
            <div className="flex flex-wrap gap-2">
              {presetButtons.map((preset) => (
                <button
                  key={preset.label}
                  onClick={() => applyPreset(preset)}
                  className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-white/70 transition-colors hover:border-[#d4ff4f]/40 hover:bg-[#d4ff4f]/10 hover:text-white"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
            <h2 className="mb-3 text-xs font-bold uppercase tracking-wider text-white/40">
              Export
            </h2>
            <div className="space-y-2">
              <button
                onClick={copyInstallCommand}
                className="flex w-full items-center justify-between rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-white/70 transition-colors hover:border-[#d4ff4f]/40 hover:text-white"
              >
                <span>Install command</span>
                <span className="font-mono text-[#d4ff4f]">
                  {copiedInstall ? "Copied!" : "Copy"}
                </span>
              </button>
              <button
                onClick={copyAiPrompt}
                className="flex w-full items-center justify-between rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-white/70 transition-colors hover:border-[#d4ff4f]/40 hover:text-white"
              >
                <span>AI prompt</span>
                <span className="font-mono text-[#d4ff4f]">
                  {copiedPrompt ? "Copied!" : "Copy"}
                </span>
              </button>
              <button
                onClick={copyShareUrl}
                className="flex w-full items-center justify-between rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-white/70 transition-colors hover:border-[#d4ff4f]/40 hover:text-white"
              >
                <span>Share URL</span>
                <span className="font-mono text-[#d4ff4f]">
                  {copiedUrl ? "Copied!" : "Copy"}
                </span>
              </button>
              <Link
                href={`/components/${slug}`}
                className="flex w-full items-center justify-between rounded-lg border border-[#d4ff4f]/30 bg-[#d4ff4f]/10 px-3 py-2 text-xs font-medium text-[#d4ff4f] transition-colors hover:border-[#d4ff4f]/50 hover:bg-[#d4ff4f]/15"
              >
                <span>Full docs</span>
                <span>&rarr;</span>
              </Link>
            </div>
          </div>
        </aside>
      </div>

      <div className="mx-4 mb-4 overflow-hidden rounded-2xl border border-white/[0.06] bg-[#0a0c11]">
        <div className="flex items-center gap-2 border-b border-white/10 px-4 py-2">
          <span className="text-xs font-medium text-white/60">{component.name}</span>
          <span className="font-mono text-[11px] text-white/30">{slug}</span>
          <span
            className={cn(
              "ml-auto rounded px-2 py-0.5 text-[10px] font-bold",
              example.status === "Full"
                ? "bg-[#d4ff4f]/20 text-[#d4ff4f]"
                : example.status === "Partial"
                ? "bg-[#ffb86b]/20 text-[#ffb86b]"
                : "bg-white/10 text-white/50"
            )}
          >
            {example.status}
          </span>
        </div>
        <div className="max-h-[320px] overflow-auto">
          {example.files.length > 0 ? (
            <CodeViewer files={example.files} className="border-0 bg-transparent" />
          ) : (
            <div className="flex h-24 items-center justify-center text-sm text-white/40">
              No code for {frameworkLabels[framework]} — {example.notes}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function PlaygroundPage() {
  return (
    <Suspense fallback={<div className="flex h-[calc(100vh-80px)] items-center justify-center"><div className="text-white/50">Loading...</div></div>}>
      <PlaygroundContent />
    </Suspense>
  );
}
