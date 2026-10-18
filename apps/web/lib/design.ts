import type { AccentName, SurfaceMode } from "@/lib/store";

/* ─────────────────────────────────────────────────────
   Universal token metadata — single source of truth for
   accent palettes, surfaces, and CLI verbs.
   ───────────────────────────────────────────────────── */

export type AccentMeta = {
  id: AccentName;
  label: string;
  hex: string;
  glow: string;
  fg: string;
};

export const ACCENTS: AccentMeta[] = [
  { id: "acid", label: "Acid Lime", hex: "#CCFF00", glow: "rgba(204,255,0,0.22)", fg: "#131305" },
  { id: "iris", label: "Electric Iris", hex: "#6366F1", glow: "rgba(99,102,241,0.25)", fg: "#FFFFFF" },
  { id: "amber", label: "Solar Amber", hex: "#F59E0B", glow: "rgba(245,158,11,0.22)", fg: "#1C1203" },
  { id: "emerald", label: "Cyber Emerald", hex: "#10B981", glow: "rgba(16,185,129,0.22)", fg: "#04140D" },
  { id: "crimson", label: "Hyper Crimson", hex: "#F43F5E", glow: "rgba(244,63,94,0.22)", fg: "#FFF1F2" },
];

export const accentMeta = (id: AccentName): AccentMeta =>
  ACCENTS.find((a) => a.id === id) ?? ACCENTS[0];

export type SurfaceMeta = {
  id: SurfaceMode;
  label: string;
  detail: string;
  swatch: string;
};

export const SURFACES: SurfaceMeta[] = [
  { id: "obsidian", label: "Obsidian", detail: "Dark", swatch: "#050507" },
  { id: "oled", label: "OLED", detail: "Pitch black", swatch: "#000000" },
  { id: "alabaster", label: "Alabaster", detail: "Light", swatch: "#FAF9F5" },
];

export const surfaceTheme = (s: SurfaceMode): "dark" | "light" =>
  s === "alabaster" ? "light" : "dark";

export const PACKAGE_MANAGERS = ["pnpm", "npx", "bunx", "yarn"] as const;
export type PackageManager = (typeof PACKAGE_MANAGERS)[number];

export function installCommand(manager: PackageManager, slug: string): string {
  switch (manager) {
    case "pnpm":
      return `pnpm dlx shadcn@latest add @buildora/${slug}`;
    case "npx":
      return `npx shadcn@latest add @buildora/${slug}`;
    case "bunx":
      return `bunx --bun shadcn@latest add @buildora/${slug}`;
    case "yarn":
      return `yarn dlx shadcn@latest add @buildora/${slug}`;
  }
}

/** Representative shipped-weights for the CLI inspector proof card. */
export const BUNDLE_WEIGHTS: Record<string, string> = {
  "magnetic-button": "1.4 KB",
  "slingshot-otp": "1.8 KB",
  "fx-button": "0.9 KB",
  tokens: "0.4 KB",
};
