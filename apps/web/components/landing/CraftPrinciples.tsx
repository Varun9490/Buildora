"use client";

import * as React from "react";
import { cn } from "@buildora/utils";
import { useBuildora } from "@/lib/store";
import { ACCENTS, SURFACES } from "@/lib/design";
import { CopyButton } from "./CodeBlock";

/* ─────────────────────────────────────────────────────
   CRAFT PRINCIPLES — the receipts.
   Token engine you can rewire live, a CLI inspector
   transcript, the a11y audit, and four proof badges.
   ───────────────────────────────────────────────────── */

function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "flex flex-col rounded-[2rem] border border-[color:var(--b-border)] bg-[color:color-mix(in_oklab,var(--b-text)_2.5%,transparent)] p-2",
        className
      )}
    >
      <div className="flex h-full flex-col overflow-hidden rounded-[calc(2rem-0.5rem)] border border-[color:var(--b-border)] bg-[color:color-mix(in_oklab,var(--b-panel)_92%,transparent)] p-5">
        {children}
      </div>
    </div>
  );
}

function TokenEngineCard() {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  const themeAccent = useBuildora((s) => s.themeAccent);
  const setThemeAccent = useBuildora((s) => s.setThemeAccent);
  const surface = useBuildora((s) => s.surface);
  const setSurface = useBuildora((s) => s.setSurface);
  const activeAccent = mounted ? themeAccent : "acid";
  const activeSurface = mounted ? surface : "obsidian";

  return (
    <Card>
      <h3 className="font-display text-lg font-bold tracking-tight text-[color:var(--b-text)]">Token engine</h3>
      <p className="mt-1 text-xs leading-relaxed text-[color:var(--b-muted)]">
        One variable rewrites 40+ surfaces. Go ahead — you&apos;re already running inside it.
      </p>

      <div className="mt-5">
        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[color:var(--b-muted)]">
          --b-accent
        </p>
        <div className="mt-2 flex gap-2" role="radiogroup" aria-label="Accent color">
          {ACCENTS.map((a) => (
            <button
              key={a.id}
              role="radio"
              aria-checked={activeAccent === a.id}
              aria-label={a.label}
              title={a.label}
              onClick={() => setThemeAccent(a.id)}
              className={cn(
                "relative h-8 w-8 rounded-full border transition-transform hover:scale-110 active:scale-95",
                activeAccent === a.id
                  ? "border-white/70 ring-2 ring-[color:var(--b-accent)] ring-offset-2 ring-offset-[color:var(--b-panel)]"
                  : "border-white/15"
              )}
              style={{ background: a.hex }}
            />
          ))}
        </div>
      </div>

      <div className="mt-5">
        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[color:var(--b-muted)]">
          data-surface
        </p>
        <div className="mt-2 flex rounded-xl border border-[color:var(--b-border)] bg-[color:var(--b-surface)] p-0.5" role="radiogroup" aria-label="Surface mode">
          {SURFACES.map((s) => (
            <button
              key={s.id}
              role="radio"
              aria-checked={activeSurface === s.id}
              onClick={() => setSurface(s.id)}
              className={cn(
                "flex flex-1 items-center justify-center gap-1.5 rounded-lg px-2 py-1.5 font-mono text-[10px] transition-colors",
                activeSurface === s.id
                  ? "bg-[color:var(--b-panel)] font-semibold text-[color:var(--b-text)] shadow-sm"
                  : "text-[color:var(--b-muted)] hover:text-[color:var(--b-text-secondary)]"
              )}
            >
              <span className="h-2.5 w-2.5 rounded-full border border-white/20" style={{ background: s.swatch }} />
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 flex items-center gap-3 rounded-xl border border-dashed border-[color:var(--b-border)] p-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[color:var(--b-accent)] font-display text-base font-black text-[color:var(--b-accent-foreground)] shadow-[0_0_24px_var(--b-accent-glow)]">
          Aa
        </span>
        <p className="font-mono text-[10px] leading-relaxed text-[color:var(--b-muted)]">
          The chip, glow, and focus rings around you all read the same token.
          Zero re-renders — pure CSS cascade.
        </p>
      </div>
    </Card>
  );
}

const CLI_LINES = [
  { text: "$ pnpm dlx shadcn add @buildora/magnetic-button", tone: "cmd" },
  { text: "✔ resolving registry dependencies (2)", tone: "ok" },
  { text: "＋ packages/components/src/magnetic-button/index.tsx · 1.2 KB", tone: "file" },
  { text: "＋ packages/hooks/src/use-pointer-proximity.ts · 0.4 KB", tone: "file" },
  { text: "＋ packages/tokens/src/spring.ts · 0.2 KB", tone: "file" },
  { text: "◆ done in 0.8s · nothing else modified", tone: "ok" },
] as const;

function CliInspectorCard() {
  const [revealed, setRevealed] = React.useState(0);

  React.useEffect(() => {
    if (revealed >= CLI_LINES.length) return;
    const id = window.setTimeout(() => setRevealed((r) => r + 1), 380);
    return () => window.clearTimeout(id);
  }, [revealed]);

  return (
    <Card>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-display text-lg font-bold tracking-tight text-[color:var(--b-text)]">CLI inspector</h3>
          <p className="mt-1 text-xs leading-relaxed text-[color:var(--b-muted)]">
            Copy the source or the command. The transcript is the receipt —
            three files, one primitive, nothing else touched.
          </p>
        </div>
        <span className="shrink-0 rounded-full border border-[color:var(--b-accent)]/30 bg-[color:var(--b-accent-muted)] px-2.5 py-1 font-mono text-[9px] font-bold uppercase tracking-wider text-[color:var(--b-accent)]">
          &lt; 1.8 KB gzip
        </span>
      </div>

      <div className="mt-4 flex-1 overflow-hidden rounded-xl border border-[color:var(--b-border)] bg-[color:color-mix(in_oklab,var(--b-bg)_80%,#000_10%)] p-4 font-mono text-[11px] leading-[1.9]">
        {CLI_LINES.slice(0, revealed).map((l, i) => (
          <p
            key={i}
            className={cn(
              "b-fade-in",
              l.tone === "cmd" && "text-[color:var(--b-text)]",
              l.tone === "ok" && "text-[color:var(--b-accent)]",
              l.tone === "file" && "text-[color:var(--b-text-secondary)]"
            )}
          >
            {l.text}
          </p>
        ))}
        {revealed < CLI_LINES.length && (
          <span className="inline-block h-3 w-2 translate-y-[2px] bg-[color:var(--b-accent)]" style={{ animation: "fx-caret-blink 1s steps(1) infinite" }} />
        )}
      </div>

      <div className="mt-3 flex items-center justify-between">
        <button
          onClick={() => setRevealed(0)}
          className="rounded-lg border border-[color:var(--b-border)] px-3 py-1.5 font-mono text-[10px] text-[color:var(--b-muted)] transition-colors hover:border-[color:var(--b-border-hover)] hover:text-[color:var(--b-text-secondary)]"
        >
          ↺ Replay
        </button>
        <CopyButton text="pnpm dlx shadcn add @buildora/magnetic-button" label="Copy command" copiedLabel="Copied" />
      </div>
    </Card>
  );
}

const AUDITS = [
  { k: "Keyboard maps", v: "Tab · arrows · Enter · Escape on every primitive" },
  { k: "Focus-visible", v: "rings restyled, never removed" },
  { k: "Contrast", v: "≥ 7:1 across all five accents — AAA" },
  { k: "Reduced motion", v: "honored at the provider level, not per-component" },
  { k: "Screen readers", v: "roles + aria-live on every async state" },
];

function AuditCard() {
  return (
    <Card>
      <h3 className="font-display text-lg font-bold tracking-tight text-[color:var(--b-text)]">Audited, not assumed</h3>
      <p className="mt-1 text-xs leading-relaxed text-[color:var(--b-muted)]">
        Accessibility is a build gate, not a badge. Here&apos;s what the CI actually checks:
      </p>
      <ul className="mt-4 flex flex-col gap-3">
        {AUDITS.map((a) => (
          <li key={a.k} className="flex items-start gap-2.5">
            <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[color:var(--b-accent-muted)]">
              <svg className="h-2.5 w-2.5 text-[color:var(--b-accent)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3.2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M5 13l4 4L19 7" />
              </svg>
            </span>
            <p className="text-xs leading-relaxed text-[color:var(--b-text-secondary)]">
              <span className="font-semibold text-[color:var(--b-text)]">{a.k}</span>
              <span className="text-[color:var(--b-muted)]"> — {a.v}</span>
            </p>
          </li>
        ))}
      </ul>
      <div className="mt-auto pt-4">
        <div className="flex items-center justify-between rounded-xl border border-[color:var(--b-border)] bg-[color:var(--b-surface)] px-3 py-2.5">
          <span className="font-mono text-[10px] uppercase tracking-wider text-[color:var(--b-muted)]">
            axe-core · CI gate
          </span>
          <span className="flex items-center gap-1.5 font-mono text-[10px] font-semibold text-[color:var(--b-success)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--b-success)]" />
            0 violations
          </span>
        </div>
      </div>
    </Card>
  );
}

function ProofBadges() {
  return (
    <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
      {/* spring engine */}
      <div className="flex items-center gap-3 rounded-2xl border border-[color:var(--b-border)] bg-[color:color-mix(in_oklab,var(--b-panel)_85%,transparent)] px-4 py-3.5">
        <span className="relative block h-5 w-12" aria-hidden="true">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="absolute top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-[color:var(--b-accent)]"
              style={{ animation: `fx-spring-dot 1.6s cubic-bezier(.22,1,.36,1) ${i * 0.18}s infinite`, left: 0 }}
            />
          ))}
        </span>
        <div>
          <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-[color:var(--b-text)]">Spring engine</p>
          <p className="font-mono text-[9px] text-[color:var(--b-muted)]">rAF · no jank</p>
        </div>
      </div>

      {/* cross target */}
      <div className="flex items-center gap-3 rounded-2xl border border-[color:var(--b-border)] bg-[color:color-mix(in_oklab,var(--b-panel)_85%,transparent)] px-4 py-3.5">
        <span className="grid grid-cols-3 gap-[3px]" aria-hidden="true">
          {Array.from({ length: 6 }).map((_, i) => (
            <span
              key={i}
              className="h-1.5 w-1.5 rounded-[2px] bg-[color:var(--b-iris)]"
              style={{ opacity: 0.35 + (i % 3) * 0.3 }}
            />
          ))}
        </span>
        <div>
          <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-[color:var(--b-text)]">Cross-target</p>
          <p className="font-mono text-[9px] text-[color:var(--b-muted)]">6 runtimes</p>
        </div>
      </div>

      {/* WCAG */}
      <div className="flex items-center gap-3 rounded-2xl border border-[color:var(--b-border)] bg-[color:color-mix(in_oklab,var(--b-panel)_85%,transparent)] px-4 py-3.5">
        <svg className="h-5 w-5 text-[color:var(--b-accent)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M12 2l8 4v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6l8-4z" />
          <path d="M9 12l2 2 4-4" />
        </svg>
        <div>
          <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-[color:var(--b-text)]">WCAG AAA</p>
          <p className="font-mono text-[9px] text-[color:var(--b-muted)]">contrast audited</p>
        </div>
      </div>

      {/* tree shakeable */}
      <div className="flex items-center gap-3 rounded-2xl border border-[color:var(--b-border)] bg-[color:color-mix(in_oklab,var(--b-panel)_85%,transparent)] px-4 py-3.5">
        <span className="flex flex-col gap-[3px]" aria-hidden="true">
          {[
            { w: 8, o: 0.35 },
            { w: 16, o: 0.6 },
            { w: 24, o: 1 },
          ].map((b, i) => (
            <span key={i} className="h-[3px] rounded-full bg-[color:var(--b-accent)]" style={{ width: b.w, opacity: b.o }} />
          ))}
        </span>
        <div>
          <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-[color:var(--b-text)]">Tree-shakeable</p>
          <p className="font-mono text-[9px] text-[color:var(--b-muted)]">pay per primitive</p>
        </div>
      </div>
    </div>
  );
}

export function CraftPrinciples() {
  return (
    <section id="principles" className="relative mx-auto w-full max-w-7xl px-4 pb-28 pt-24 sm:px-6 lg:px-8 lg:pt-32">
      <div className="mx-auto max-w-3xl text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-[color:var(--b-border)] bg-[color:var(--b-surface)] px-3 py-1 text-[11px] text-[color:var(--b-iris)]">
          Craft Principles
        </span>
        <h2 className="mt-5 font-display text-3xl font-bold tracking-tight text-[color:var(--b-text)] sm:text-4xl lg:text-5xl text-balance">
          Built like infrastructure, finished like jewelry.
        </h2>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-3">
        <TokenEngineCard />
        <CliInspectorCard />
        <AuditCard />
      </div>

      <ProofBadges />
    </section>
  );
}
