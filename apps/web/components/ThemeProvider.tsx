"use client";

import * as React from "react";
import { useBuildora } from "@/lib/store";
import { accentPresets, baseThemes } from "@buildora/tokens";

/**
 * Universal ThemeProvider — light + dark + swappable accent.
 * - Writes only CSS vars, never hardcoded hex in components.
 * - Respects system preference when mode = system.
 * - Sets data-theme + color-scheme for Tailwind dark: variant.
 */

export { accentPresets };
export const premiumBasePresets = {
  system: { label: "System", type: "system" },
  light: { ...baseThemes.light, type: "light" },
  dark: { ...baseThemes.dark, type: "dark" },
  warm: {
    bg: "#0E0E0C",
    panel: "#161614",
    surface: "#1D1D1A",
    elevated: "#242422",
    border: "rgba(255,255,255,0.08)",
    borderHover: "rgba(255,255,255,0.16)",
    text: "#EDEDEC",
    textSecondary: "#A1A1AA",
    muted: "#6E6E73",
    label: "Warm Charcoal (legacy)",
    type: "dark",
  },
} as const;

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

    const preset =
      (accentPresets as Record<string, { dark: { accent: string; foreground: string; muted: string }; light: { accent: string; foreground: string; muted: string } }>)[
        themeAccent
      ] ?? accentPresets.acid;

    const active = resolved === "dark" ? preset.dark : preset.light;
    root.style.setProperty("--b-accent", active.accent);
    root.style.setProperty("--b-accent-foreground", active.foreground);
    root.style.setProperty("--b-accent-muted", active.muted);

    return () => mq.removeEventListener?.("change", onChange);
  }, [themeAccent, themeMode]);

  return <>{children}</>;
}
