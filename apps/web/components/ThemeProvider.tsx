"use client";

import * as React from "react";
import { useBuildora } from "@/lib/store";

export const accentPresets = {
  acid: { hex: "#d4ff4f", rgba: "212, 255, 79", label: "Acid Lime" },
  cyan: { hex: "#00f2fe", rgba: "0, 242, 254", label: "Neon Cyan" },
  orange: { hex: "#ff6a00", rgba: "255, 106, 0", label: "Sunset Orange" },
  purple: { hex: "#b224ef", rgba: "178, 36, 239", label: "Cyber Purple" },
  bone: { hex: "#d7d3cb", rgba: "215, 211, 203", label: "Minimal Bone" },
};

export const basePresets = {
  warm: {
    bg: "#0C0C0C",
    panel: "#141414",
    surface: "#1A1A1A",
    border: "rgba(255, 255, 255, 0.08)",
    borderHover: "rgba(255, 255, 255, 0.14)",
    label: "Warm Monochrome"
  },
  obsidian: {
    bg: "#000000",
    panel: "#090909",
    surface: "#111111",
    border: "rgba(255, 255, 255, 0.06)",
    borderHover: "rgba(255, 255, 255, 0.12)",
    label: "Pure Obsidian"
  },
  soft: {
    bg: "#F7F6F3",
    panel: "#FFFFFF",
    surface: "#F0EFEB",
    border: "rgba(0, 0, 0, 0.06)",
    borderHover: "rgba(0, 0, 0, 0.12)",
    label: "Soft Light" // We'll keep text dark mode mapping for now to avoid full inversion breaking everything, but this is a starting point. Actually, for a component library, forcing a full light theme is tricky without extensive token mapping. Let's stick to dark-leaning themes for now to ensure quality.
  }
};

// Simplified base presets focusing on premium dark variations to ensure the design language remains cohesive.
export const premiumBasePresets = {
  warm: {
    bg: "#0C0C0C",
    panel: "#141414",
    surface: "#1A1A1A",
    elevated: "#222222",
    border: "rgba(255, 255, 255, 0.08)",
    borderHover: "rgba(255, 255, 255, 0.14)",
    text: "#ECECEC",
    textSecondary: "#A0A0A0",
    muted: "#6B6B6B",
    label: "Warm Monochrome",
    type: "dark"
  },
  obsidian: {
    bg: "#000000",
    panel: "#090909",
    surface: "#111111",
    elevated: "#181818",
    border: "rgba(255, 255, 255, 0.06)",
    borderHover: "rgba(255, 255, 255, 0.12)",
    text: "#FFFFFF",
    textSecondary: "#999999",
    muted: "#555555",
    label: "Pure Obsidian",
    type: "dark"
  },
  navy: {
    bg: "#050A14",
    panel: "#0B111F",
    surface: "#121A2A",
    elevated: "#1B2436",
    border: "rgba(255, 255, 255, 0.08)",
    borderHover: "rgba(255, 255, 255, 0.16)",
    text: "#F0F4FF",
    textSecondary: "#9CA8C4",
    muted: "#5C6A8A",
    label: "Deep Navy",
    type: "dark"
  }
};


export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { themeAccent, themeBase } = useBuildora();

  React.useEffect(() => {
    const accent = accentPresets[themeAccent as keyof typeof accentPresets] || accentPresets.acid;
    const base = premiumBasePresets[themeBase as keyof typeof premiumBasePresets] || premiumBasePresets.warm;

    const root = document.documentElement;
    
    // Apply Accent
    root.style.setProperty("--b-accent", accent.hex);
    root.style.setProperty("--b-accent-muted", `rgba(${accent.rgba}, 0.12)`);
    
    // Apply Base
    root.style.setProperty("--b-bg", base.bg);
    root.style.setProperty("--b-panel", base.panel);
    root.style.setProperty("--b-surface", base.surface);
    root.style.setProperty("--b-elevated", base.elevated);
    root.style.setProperty("--b-border", base.border);
    root.style.setProperty("--b-border-hover", base.borderHover);
    root.style.setProperty("--b-text", base.text);
    root.style.setProperty("--b-text-secondary", base.textSecondary);
    root.style.setProperty("--b-muted", base.muted);
    
    if (base.type === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
  }, [themeAccent, themeBase]);

  return <>{children}</>;
}
