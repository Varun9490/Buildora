"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useBuildora } from "@/lib/store";
import { cn } from "@buildora/utils";
import { accentPresets } from "@buildora/tokens";
import { premiumBasePresets } from "./ThemeProvider";

const modeOptions = [
  { key: "light", label: "Light" },
  { key: "dark", label: "Dark" },
  { key: "system", label: "System" },
] as const;

export function ThemeCustomizer() {
  const [open, setOpen] = React.useState(false);
  const { themeAccent, setThemeAccent, themeMode, setThemeMode } = useBuildora();

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex h-8 w-8 items-center justify-center rounded-md border border-[--b-border] text-[--b-text-secondary] transition-colors hover:bg-[--b-surface] hover:text-[--b-text]"
        aria-label="Customize theme (light, dark, accent)"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
        </svg>
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.96 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="absolute right-0 top-full z-50 mt-2 w-72 origin-top-right rounded-xl border border-[--b-border] bg-[--b-panel] p-4 shadow-card"
              role="dialog"
              aria-label="Theme customizer"
            >
              <div className="mb-4">
                <p className="font-display text-sm font-bold tracking-tight text-[--b-text]">Theme</p>
                <p className="mt-1 text-[11px] leading-relaxed text-[--b-muted]">
                  Light or dark, one accent. All 54 components follow these vars.
                </p>
              </div>

              <div className="space-y-5">
                <div>
                  <p className="mb-2 font-mono text-[10px] uppercase tracking-wider text-[--b-text-secondary]">
                    Mode
                  </p>
                  <div className="grid grid-cols-3 gap-1 rounded-lg border border-[--b-border] bg-[--b-surface] p-1">
                    {modeOptions.map((m) => (
                      <button
                        key={m.key}
                        onClick={() => setThemeMode(m.key)}
                        aria-pressed={themeMode === m.key}
                        className={cn(
                          "rounded-md px-2 py-1.5 text-xs font-medium transition-colors",
                          themeMode === m.key
                            ? "bg-[--b-panel] text-[--b-text] shadow-subtle"
                            : "text-[--b-muted] hover:text-[--b-text-secondary]"
                        )}
                      >
                        {m.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="mb-2 font-mono text-[10px] uppercase tracking-wider text-[--b-text-secondary]">
                    Accent
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(accentPresets).map(([key, value]) => (
                      <button
                        key={key}
                        onClick={() => setThemeAccent(key)}
                        className={cn(
                          "flex h-8 w-8 items-center justify-center rounded-lg transition-transform hover:scale-105 active:scale-95",
                          themeAccent === key && "ring-2 ring-[--b-accent] ring-offset-2 ring-offset-[--b-panel]"
                        )}
                        style={{ backgroundColor: (value as { dark: { accent: string } }).dark.accent }}
                        title={(value as { label: string }).label}
                        aria-label={`Accent ${(value as { label: string }).label}`}
                        aria-pressed={themeAccent === key}
                      >
                        {themeAccent === key && (
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3} style={{ color: "#131305" }}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </button>
                    ))}
                  </div>
                  <p className="mt-2 text-[11px] text-[--b-muted]">
                    {(accentPresets as Record<string, { label: string }>)[themeAccent]?.label ?? themeAccent} · AA-tested in both modes
                  </p>
                </div>

                <div>
                  <p className="mb-2 font-mono text-[10px] uppercase tracking-wider text-[--b-text-secondary]">
                    Base
                  </p>
                  <div className="grid grid-cols-1 gap-1.5">
                    {(["system", "light", "dark"] as const).map((key) => (
                      <div
                        key={key}
                        className={cn(
                          "flex items-center justify-between rounded-lg border px-2.5 py-2 text-xs",
                          (premiumBasePresets as Record<string, { label: string }>)[key] && themeMode === key
                            ? "border-[--b-accent]"
                            : "border-[--b-border]"
                        )}
                      >
                        <span className="text-[--b-text-secondary]">
                          {(premiumBasePresets as Record<string, { label: string }>)[key]?.label ?? key}
                        </span>
                        <span className="font-mono text-[10px] text-[--b-muted]">{key}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
