"use client";

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@buildora/utils";
import { allComponents, categoryMeta, totalComponents, totalShowcased } from "@/lib/registry";
import { DEFAULT_RENDER_CONTROLS, type Controls } from "@/lib/render-controls";
import { ComponentRenderer } from "@/components/ComponentRenderer";
import { installCommand } from "@/lib/design";
import { onInspect } from "@/lib/inspect";
import { shippedCode } from "@/lib/showcase-code";
import { CodeBlock, CopyButton } from "./CodeBlock";
import { SlingshotOtpStage } from "./bento/SlingshotOtpStage";
import { KineticButtons } from "./bento/KineticButtons";
import { HoloPass } from "./bento/HoloPass";
import { ParticleForceField } from "./bento/ParticleForceField";
import { MagnificationDockStage } from "./bento/MagnificationDock";
import { DynamicIslandStage } from "./bento/DynamicIsland";
import { RubberScrubber } from "./bento/RubberScrubber";
import { AiComposer } from "./bento/AiComposer";
import { ExtraPreview, EXTRA_PREVIEW_SLUGS, EXTRA_CODE } from "./explorer/extra-previews";

type Tab = "preview" | "code" | "cli";

const VIRTUAL = [
  { slug: "magnification-dock", name: "Magnification Dock", category: "Navigation" },
  { slug: "dynamic-island", name: "Dynamic Island", category: "Overlays" },
];

const GROUPS: { id: string; label: string; slugs: string[] }[] = [
  {
    id: "motion",
    label: "Text & Motion",
    slugs: [
      "text-fx", "cursor-fx", "floating-object", "horizontal-scroll", "thread-line",
      "project-showcase", "reveal-on-scroll", "handwritten-annotation", "vertical-timeline",
      "speech-bubble-cursor", "spring", "use-pointer-proximity", "use-reduced-motion",
      "split-text", "scroll-progress", "spring-carousel", "rubber-band", "drag-dismiss",
      "parallax-stack", "scroll-linked-path", "pinned-section", "physics-kanban", "count-up",
    ],
  },
  {
    id: "kinetic",
    label: "Kinetic Type",
    slugs: ["matrix-decode", "rgb-glitch", "number-wheel", "inline-word-roll", "echo-stack", "selection-snap", "period-drop", "type-wall"],
  },
  {
    id: "inputs",
    label: "Tactile Inputs",
    slugs: [
      "magnetic-button", "slingshot-otp", "fx-button", "hold-button", "button", "input",
      "textarea", "switch", "checkbox", "radio-group", "slider", "kbd", "segmented-control",
      "elastic-slider", "morph-select", "detent-dial", "confirm-morph", "gooey-menu",
    ],
  },
  {
    id: "surfaces",
    label: "Surfaces & Cards",
    slugs: [
      "fx-card", "interactive-dropzone", "badge", "avatar", "skeleton", "progress",
      "spinner", "separator", "tokens", "utils", "comet-ring-spinner", "tactile-loader",
      "blueprint-loader", "liquid-gauge", "fresnel-orb", "letter-wave", "focus-blur-list",
      "grab-roller-strip", "unified-login-field", "magnetic-dropzone", "draggable-card-pile",
    ],
  },
  {
    id: "overlays",
    label: "Overlays & Navigation",
    slugs: [
      "toast", "tooltip", "dialog", "alert-dialog", "sheet", "drawer", "popover", "dropdown-menu",
      "context-menu", "hover-card", "modal-stack", "tabs", "accordion", "navbar", "floating-navbar",
      "magnification-dock", "sidebar", "expandable-sidebar", "mobile-nav", "mobile-header",
      "breadcrumb", "step-nav", "pagination", "dynamic-island", "command-palette", "tui-help-overlay",
    ],
  },
  {
    id: "ai",
    label: "AI & Streaming",
    slugs: ["streaming-chat", "model-selector", "token-meter", "tool-call-viz", "agent-timeline", "attachment-prompt", "ai-review-edit"],
  },
  {
    id: "backgrounds",
    label: "Backgrounds & Blocks",
    slugs: [
      "backdrop", "particle-field", "masonry-layout", "bento-grid", "infinite-marquee",
      "cta-block", "feature-grid", "logo-cloud", "site-footer",
    ],
  },
  {
    id: "data",
    label: "Data & Developer",
    slugs: [
      "advanced-table", "json-viewer", "log-viewer", "query-builder", "diff-viewer", "terminal",
      "terminal-ui", "file-tree", "code-editor", "calendar", "comment-thread", "rich-text-editor",
      "slash-commands", "version-history", "tui-sparkline",
    ],
  },
];

const SIGNATURE_DEMOS: Record<string, React.ReactNode> = {
  "slingshot-otp": <SlingshotOtpStage />,
  "fx-button": <KineticButtons />,
  "fx-card": <HoloPass />,
  backdrop: <ParticleForceField />,
  slider: <RubberScrubber />,
  "attachment-prompt": <AiComposer />,
  "magnification-dock": <MagnificationDockStage />,
  "dynamic-island": <DynamicIslandStage />,
};

const SLIDERS: Record<string, { key: keyof Controls; label: string; min: number; max: number; step: number }[]> = {
  "magnetic-button": [
    { key: "strength", label: "Strength", min: 0.1, max: 0.8, step: 0.05 },
    { key: "radius", label: "Radius", min: 60, max: 240, step: 10 },
  ],
  "slingshot-otp": [{ key: "length", label: "Digits", min: 4, max: 8, step: 1 }],
  "advanced-table": [{ key: "pageSize", label: "Page size", min: 4, max: 12, step: 1 }],
};

const NAME_OF: Record<string, string> = Object.fromEntries(allComponents.map((c) => [c.slug, c.name]));
const CATEGORY_OF: Record<string, string> = Object.fromEntries(
  allComponents.map((c) => [c.slug, categoryMeta[c.categories[0]]?.label ?? c.categories[0] ?? "Primitive"])
);
for (const v of VIRTUAL) {
  NAME_OF[v.slug] = v.name;
  CATEGORY_OF[v.slug] = v.category;
}

const ALL_SLUGS = new Set<string>([...allComponents.map((c) => c.slug), ...VIRTUAL.map((v) => v.slug)]);

export function ExplorerWorkspace() {
  const [slug, setSlug] = React.useState("magnetic-button");
  const [query, setQuery] = React.useState("");
  const [tab, setTab] = React.useState<Tab>("preview");
  const [controls, setControls] = React.useState<Controls>(DEFAULT_RENDER_CONTROLS);
  const [codeState, setCodeState] = React.useState<Record<string, { status: "loading" | "ready" | "error"; text?: string }>>({});
  const sectionRef = React.useRef<HTMLElement | null>(null);
  const pendingScroll = React.useRef(false);

  const select = React.useCallback((next: string, scroll = false) => {
    if (!ALL_SLUGS.has(next)) return;
    setSlug(next);
    setTab("preview");
    if (scroll) pendingScroll.current = true;
    if (typeof window !== "undefined") {
      window.history.replaceState(null, "", `#explorer:${next}`);
    }
  }, []);

  React.useEffect(() => {
    const fromHash = () => {
      const hash = window.location.hash;
      const match = hash.startsWith("#explorer:") ? hash.slice("#explorer:".length) : "";
      if (match && ALL_SLUGS.has(match)) {
        pendingScroll.current = true;
        setSlug(match);
      }
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    const off = onInspect((next) => select(next, true));
    return () => {
      window.removeEventListener("hashchange", fromHash);
      off();
    };
  }, [select]);

  React.useEffect(() => {
    if (!pendingScroll.current) return;
    pendingScroll.current = false;
    sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [slug]);

  React.useEffect(() => {
    if (tab !== "code") return;
    if (shippedCode(slug) || EXTRA_CODE[slug]) return;
    if (codeState[slug]) return;
    let cancelled = false;
    setCodeState((prev) => ({ ...prev, [slug]: { status: "loading" } }));
    fetch(`/api/registry/${slug}`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((data: { files?: { path: string; content: string }[] }) => {
        const files = Array.isArray(data.files) ? data.files : [];
        const text = files.map((f) => `// ${f.path}\n${f.content}`).join("\n\n");
        if (!cancelled) setCodeState((prev) => ({ ...prev, [slug]: { status: "ready", text } }));
      })
      .catch(() => {
        if (!cancelled) setCodeState((prev) => ({ ...prev, [slug]: { status: "error" } }));
      });
    return () => {
      cancelled = true;
    };
  }, [tab, slug, codeState]);

  const isSignature = Boolean(SIGNATURE_DEMOS[slug]);
  const isExtra = EXTRA_PREVIEW_SLUGS.includes(slug);
  const useRenderer = !isSignature && !isExtra;
  const sliders = useRenderer ? SLIDERS[slug] ?? [] : [];

  const localCode = shippedCode(slug) ?? EXTRA_CODE[slug];
  const codeEntry = codeState[slug];
  const codeText = localCode ?? codeEntry?.text;
  const codeLoading = !localCode && (!codeEntry || codeEntry.status === "loading");
  const codeError = !localCode && codeEntry?.status === "error";
  const cli = installCommand("pnpm", slug);

  const q = query.trim().toLowerCase();
  const matches = (s: string) => {
    if (!q) return true;
    return NAME_OF[s].toLowerCase().includes(q) || s.includes(q);
  };

  const demo =
    SIGNATURE_DEMOS[slug] ??
    (isExtra ? <ExtraPreview slug={slug} /> : <ComponentRenderer slug={slug} controls={controls} />);

  return (
    <section
      ref={sectionRef}
      id="explorer"
      className="relative mx-auto w-full max-w-7xl scroll-mt-24 px-4 py-24 sm:px-6 lg:px-8 lg:py-32"
    >
      <div className="max-w-3xl">
        <h2 className="font-display text-3xl font-bold tracking-tight text-[color:var(--b-text)] sm:text-4xl lg:text-5xl text-balance">
          Every component, live.
        </h2>
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-[color:var(--b-text-secondary)] sm:text-base">
          {totalComponents} installable components — {totalShowcased} with a live preview, the rest are
          tokens and hooks. Every one has its props, source, and install command, one click away.
          Nothing is a screenshot.
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-[260px_minmax(0,1fr)]">
        <aside className="lg:sticky lg:top-20 lg:max-h-[calc(100vh-6rem)] lg:self-start lg:overflow-y-auto lg:pr-2 scroll-sleek">
          <label className="relative block">
            <svg className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[color:var(--b-muted)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
              <circle cx="11" cy="11" r="7" />
              <path d="M21 21l-4.3-4.3" />
            </svg>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search components"
              aria-label="Search components"
              className="w-full rounded-xl bg-[color:color-mix(in_oklab,var(--b-text)_4%,transparent)] py-2 pl-9 pr-3 text-[12.5px] text-[color:var(--b-text)] outline-none placeholder:text-[color:var(--b-muted)] focus-visible:ring-2 focus-visible:ring-[color:var(--b-ring)]"
            />
          </label>

          <nav className="mt-5 space-y-5 pb-2" aria-label="Component groups">
            {GROUPS.map((group) => {
              const visible = group.slugs.filter(matches);
              if (visible.length === 0) return null;
              return (
                <div key={group.id}>
                  <p className="px-2.5 text-[11px] font-medium text-[color:var(--b-muted)]">{group.label}</p>
                  <ul className="mt-1.5 space-y-0.5">
                    {visible.map((s) => {
                      const active = s === slug;
                      return (
                        <li key={s}>
                          <button
                            type="button"
                            onClick={() => select(s)}
                            aria-current={active ? "true" : undefined}
                            className={cn(
                              "relative flex w-full items-center rounded-lg px-2.5 py-1.5 text-left text-[12.5px] transition-colors",
                              active ? "font-medium text-[color:var(--b-text)]" : "text-[color:var(--b-text-secondary)] hover:text-[color:var(--b-text)]"
                            )}
                          >
                            {active && (
                              <motion.span
                                layoutId="sidebar-active"
                                className="absolute inset-0 rounded-lg bg-[color:color-mix(in_oklab,var(--b-text)_7%,transparent)]"
                                transition={{ type: "spring", stiffness: 480, damping: 36 }}
                              />
                            )}
                            <span className="relative z-10 truncate">{NAME_OF[s]}</span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            })}
          </nav>
        </aside>

        <div className="min-w-0">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3 px-1">
            <div className="flex items-baseline gap-2.5">
              <h3 className="text-[16px] font-medium tracking-tight text-[color:var(--b-text)]">{NAME_OF[slug]}</h3>
              <span className="flex items-center gap-1.5 text-[11.5px] text-[color:var(--b-muted)]">
                <span className="h-1 w-1 rounded-full bg-[color:var(--b-muted)]" aria-hidden="true" />
                {CATEGORY_OF[slug] ?? "Primitive"}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <div className="flex rounded-lg border border-[color:var(--b-border)] p-0.5" role="tablist" aria-label="Explorer view">
                {(["preview", "code", "cli"] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    role="tab"
                    aria-selected={tab === t}
                    onClick={() => setTab(t)}
                    className={cn(
                      "rounded-md px-2.5 py-[3px] text-[11px] capitalize transition-colors",
                      tab === t
                        ? "bg-[color:color-mix(in_oklab,var(--b-text)_7%,transparent)] font-medium text-[color:var(--b-text)]"
                        : "text-[color:var(--b-muted)] hover:text-[color:var(--b-text-secondary)]"
                    )}
                  >
                    {t}
                  </button>
                ))}
              </div>
              <CopyButton text={tab === "cli" ? cli : codeText ?? cli} label="Copy" copiedLabel="Copied" className="!px-2" />
            </div>
          </div>

          <div className="relative min-h-[380px] overflow-hidden rounded-2xl border border-[color:var(--b-border)] bg-[color:var(--b-panel)] lg:min-h-[460px]">
            <AnimatePresence mode="wait" initial={false}>
              {tab === "preview" && (
                <motion.div
                  key={`preview-${slug}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.18 }}
                  className="flex min-h-[380px] w-full items-center justify-center px-5 py-8 lg:min-h-[460px]"
                >
                  {demo}
                </motion.div>
              )}

              {tab === "code" && (
                <motion.div
                  key={`code-${slug}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.18 }}
                  className="scroll-sleek h-[380px] overflow-y-auto p-4 lg:h-[460px]"
                >
                  {codeLoading && (
                    <div className="flex min-h-[340px] items-center justify-center text-[12px] text-[color:var(--b-muted)]">
                      Loading source…
                    </div>
                  )}
                  {!codeLoading && codeText && codeText.trim() && (
                    <CodeBlock code={codeText} file={`${slug}.tsx`} showLineNumbers maxHeight={4000} className="!border-transparent !bg-transparent" />
                  )}
                  {!codeLoading && (codeError || !codeText || !codeText.trim()) && (
                    <div className="flex min-h-[340px] flex-col items-center justify-center gap-3 text-center">
                      <p className="text-[13px] text-[color:var(--b-text-secondary)]">Source lives in the registry.</p>
                      <a
                        href="https://github.com/Varun9490/Buildora/tree/main/registry"
                        target="_blank"
                        rel="noreferrer"
                        className="text-[12px] text-[color:var(--b-accent)] hover:underline"
                      >
                        Browse on GitHub
                      </a>
                    </div>
                  )}
                </motion.div>
              )}

              {tab === "cli" && (
                <motion.div
                  key={`cli-${slug}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.18 }}
                  className="flex min-h-[380px] flex-col items-center justify-center gap-5 px-6 lg:min-h-[460px]"
                >
                  <code className="max-w-full overflow-x-auto whitespace-nowrap font-mono text-[13px] text-[color:var(--b-text)]">
                    {cli}
                  </code>
                  <CopyButton text={cli} tone="accent" label="Copy command" copiedLabel="Copied" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {tab === "preview" && useRenderer && (
            <div
              className={cn(
                "mt-4 grid grid-cols-1 gap-4 px-1",
                sliders.length > 1 ? "sm:grid-cols-3" : "sm:grid-cols-2"
              )}
            >
              <ControlSlider
                label="Scale"
                value={controls.scale}
                min={0.7}
                max={1.15}
                step={0.05}
                onChange={(v) => setControls((c) => ({ ...c, scale: v }))}
              />
              {sliders.map((s) => (
                <ControlSlider
                  key={s.key}
                  label={s.label}
                  value={controls[s.key] as number}
                  min={s.min}
                  max={s.max}
                  step={s.step}
                  onChange={(v) => setControls((c) => ({ ...c, [s.key]: v }))}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function ControlSlider({
  label,
  value,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <label className="flex flex-col gap-1.5">
      <span className="flex items-center justify-between text-[12px] text-[color:var(--b-text-secondary)]">
        {label}
        <span className="font-mono text-[11px] text-[color:var(--b-text)]">{value}</span>
      </span>
      <input
        type="range"
        className="b-range w-full"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ "--range-fill": `${pct}%` } as React.CSSProperties}
        aria-label={label}
      />
    </label>
  );
}
