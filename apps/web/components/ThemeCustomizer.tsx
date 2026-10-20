"use client";

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { useBuildora } from "@/lib/store";
import { cn } from "@buildora/utils";
import { ACCENTS, SURFACES } from "@/lib/design";

/**
 * Live Accent & Surface switcher.
 * Accessible popover: every control is a real <button> with aria-pressed.
 */
export function ThemeCustomizer() {
  const [open, setOpen] = React.useState(false);
  const wrapRef = React.useRef<HTMLDivElement | null>(null);
  const { themeAccent, setThemeAccent, surface, setSurface, motionOverride, setMotionOverride } = useBuildora();

  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const onDown = (e: PointerEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onDown);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onDown);
    };
  }, [open]);

  return (
    <div className="relative" ref={wrapRef}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex h-8 items-center gap-2 rounded-full border border-[color:var(--b-border)] bg-[color:color-mix(in_oklab,var(--b-surface)_80%,transparent)] px-2.5 text-[color:var(--b-text-secondary)] transition-colors hover:border-[color:var(--b-border-hover)] hover:text-[color:var(--b-text)]"
        aria-label="Theme — accent palette and surface mode"
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <span
          className="h-3.5 w-3.5 rounded-full border border-white/20"
          style={{ background: "var(--b-accent)", boxShadow: "0 0 10px var(--b-accent-glow)" }}
          aria-hidden="true"
        />
        <span className="hidden font-mono text-[10px] uppercase tracking-wider sm:inline">
          Theme
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
            className="absolute right-0 top-full z-50 mt-2 w-72 origin-top-right rounded-2xl border border-[color:var(--b-border)] bg-[color:color-mix(in_oklab,var(--b-panel)_94%,transparent)] p-4 shadow-2xl backdrop-blur-2xl"
            role="dialog"
            aria-label="Theme controls"
          >
            <p className="font-display text-sm font-bold tracking-tight text-[color:var(--b-text)]">
              Universal Token Engine
            </p>
            <p className="mt-1 text-[11px] leading-relaxed text-[color:var(--b-muted)]">
              Swaps CSS variables live. Every surface on this page repaints instantly.
            </p>

            <div className="mt-4 space-y-5">
              <div>
                <p className="mb-2 font-mono text-[10px] uppercase tracking-wider text-[color:var(--b-text-secondary)]">
                  Accent palette
                </p>
                <div className="flex flex-wrap gap-2">
                  {ACCENTS.map((a) => {
                    const active = themeAccent === a.id;
                    return (
                      <button
                        key={a.id}
                        onClick={() => setThemeAccent(a.id)}
                        className={cn(
                          "relative flex h-9 w-9 items-center justify-center rounded-xl transition-transform hover:scale-105 active:scale-95",
                          active && "ring-2 ring-[color:var(--b-accent)] ring-offset-2 ring-offset-[color:var(--b-panel)]"
                        )}
                        style={{ backgroundColor: a.hex, color: a.fg }}
                        title={a.label}
                        aria-label={`Accent ${a.label}`}
                        aria-pressed={active}
                      >
                        {active && (
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </button>
                    );
                  })}
                </div>
                <p className="mt-2 font-mono text-[10px] text-[color:var(--b-muted)]">
                  --b-accent:{" "}
                  <span className="text-[color:var(--b-accent)]">
                    {ACCENTS.find((a) => a.id === themeAccent)?.hex}
                  </span>
                </p>
              </div>

              <div>
                <p className="mb-2 font-mono text-[10px] uppercase tracking-wider text-[color:var(--b-text-secondary)]">
                  Surface mode
                </p>
                <div className="grid grid-cols-3 gap-1 rounded-xl border border-[color:var(--b-border)] bg-[color:var(--b-surface)] p-1">
                  {SURFACES.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setSurface(s.id)}
                      aria-pressed={surface === s.id}
                      className={cn(
                        "flex flex-col items-center gap-1 rounded-lg px-2 py-2 text-[11px] font-medium transition-colors",
                        surface === s.id
                          ? "bg-[color:var(--b-panel)] text-[color:var(--b-text)] shadow-sm"
                          : "text-[color:var(--b-muted)] hover:text-[color:var(--b-text-secondary)]"
                      )}
                    >
                      <span
                        className="h-4 w-4 rounded-full border border-[color:var(--b-border-hover)]"
                        style={{ background: s.swatch }}
                        aria-hidden="true"
                      />
                      {s.label}
                    </button>
                  ))}
                </div>
                <p className="mt-2 text-[11px] text-[color:var(--b-muted)]">
                  {SURFACES.find((s) => s.id === surface)?.detail} surface · instant repaint
                </p>
              </div>

              <div>
                <p className="mb-2 font-mono text-[10px] uppercase tracking-wider text-[color:var(--b-text-secondary)]">
                  Motion
                </p>
                <div className="grid grid-cols-2 gap-1 rounded-xl border border-[color:var(--b-border)] bg-[color:var(--b-surface)] p-1">
                  {(
                    [
                      { id: "auto", label: "Follow OS" },
                      { id: "reduced", label: "Pause all" },
                    ] as const
                  ).map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setMotionOverride(m.id)}
                      aria-pressed={motionOverride === m.id}
                      className={cn(
                        "rounded-lg px-2 py-2 text-[11px] font-medium transition-colors",
                        motionOverride === m.id
                          ? "bg-[color:var(--b-panel)] text-[color:var(--b-text)] shadow-sm"
                          : "text-[color:var(--b-muted)] hover:text-[color:var(--b-text-secondary)]"
                      )}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
                <p className="mt-2 text-[11px] text-[color:var(--b-muted)]">
                  {motionOverride === "reduced"
                    ? "Every animation on the page is paused, whatever your OS says."
                    : "Animations follow your system setting."}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
