"use client";

import * as React from "react";
import { MotionConfig } from "motion/react";
import { useBuildora } from "@/lib/store";
import { accentPresets } from "@buildora/tokens";

/**
 * Universal ThemeProvider — light + dark + swappable accent.
 * - Writes only CSS vars, never hardcoded hex in components.
 * - Respects system preference when mode = system.
 * - Sets data-theme + color-scheme for Tailwind dark: variant.
 * - MotionConfig honors the user's reduced-motion preference for all
 *   motion/react animations globally (explorer-level gating stays).
 */

function resolveMode(mode: string): "light" | "dark" {
  if (mode === "light" || mode === "dark") return mode;
  if (typeof window !== "undefined" && window.matchMedia) {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  return "dark";
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { themeAccent, themeMode } = useBuildora();

  React.useEffect(() => {
    const root = document.documentElement;
    const resolved = resolveMode(themeMode === "system" ? "system" : themeMode);

    // Re-resolve system on change
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      if (useBuildora.getState().themeMode === "system") {
        root.setAttribute("data-theme", mq.matches ? "dark" : "light");
        root.classList.toggle("dark", mq.matches);
      }
    };
    mq.addEventListener?.("change", onChange);

    root.setAttribute("data-theme", resolved);
    root.classList.toggle("dark", resolved === "dark");
    root.style.colorScheme = resolved;

    root.setAttribute("data-accent", themeAccent);

    return () => mq.removeEventListener?.("change", onChange);
  }, [themeAccent, themeMode]);

  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
