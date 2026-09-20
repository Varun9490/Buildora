"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useBuildora } from "@/lib/store";
import { cn } from "@buildora/utils";
import { accentPresets, premiumBasePresets } from "./ThemeProvider";

export function ThemeCustomizer() {
  const [open, setOpen] = React.useState(false);
  const { themeAccent, setThemeAccent, themeBase, setThemeBase } = useBuildora();

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex h-8 w-8 items-center justify-center rounded-md border border-[--b-border] text-[--b-text-secondary] transition-colors hover:bg-white/[0.05] hover:text-[--b-text]"
        aria-label="Customize theme"
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
              className="absolute right-0 top-full z-50 mt-2 w-72 origin-top-right rounded-lg border border-[--b-border] bg-[--b-panel]/95 p-4 shadow-card backdrop-blur-xl"
            >
              <div className="mb-4">
                <p className="font-display text-sm font-bold tracking-tight text-[--b-text]">Theme Customizer</p>
                <p className="mt-1 text-[11px] text-[--b-muted]">Select a base theme and accent color to instantly update all components.</p>
              </div>

              <div className="space-y-5">
                {/* Accent Colors */}
                <div>
                  <p className="mb-2 font-mono text-[10px] uppercase tracking-wider text-[--b-text-secondary]">Accent Color</p>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(accentPresets).map(([key, value]) => (
                      <button
                        key={key}
                        onClick={() => setThemeAccent(key)}
                        className={cn(
                          "group relative flex h-8 w-8 items-center justify-center rounded-md transition-transform hover:scale-110 active:scale-95",
                          themeAccent === key ? "ring-2 ring-[--b-border] ring-offset-2 ring-offset-[--b-panel]" : ""
                        )}
                        style={{ backgroundColor: value.hex }}
                        title={value.label}
                      >
                        {themeAccent === key && (
                          <svg className="h-4 w-4 text-[#0C0C0C]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Base Themes */}
                <div>
                  <p className="mb-2 font-mono text-[10px] uppercase tracking-wider text-[--b-text-secondary]">Base Theme</p>
                  <div className="grid grid-cols-1 gap-2">
                    {Object.entries(premiumBasePresets).map(([key, value]) => (
                      <button
                        key={key}
                        onClick={() => setThemeBase(key)}
                        className={cn(
                          "flex items-center justify-between rounded-md border p-2 text-left transition-colors",
                          themeBase === key
                            ? "border-[--b-accent] bg-[--b-accent]/5"
                            : "border-[--b-border] hover:border-[--b-border-hover] hover:bg-white/[0.02]"
                        )}
                      >
                        <div className="flex items-center gap-2.5">
                          <div 
                            className="h-4 w-4 rounded border border-white/10" 
                            style={{ backgroundColor: value.bg }} 
                          />
                          <span className={cn(
                            "text-xs font-medium",
                            themeBase === key ? "text-[--b-accent]" : "text-[--b-text-secondary]"
                          )}>
                            {value.label}
                          </span>
                        </div>
                        {themeBase === key && (
                          <div className="h-1.5 w-1.5 rounded-full bg-[--b-accent]" />
                        )}
                      </button>
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
