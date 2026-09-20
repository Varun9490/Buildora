/**
 * Buildora design tokens — universal, adoptable system.
 * Single source of truth. Light + dark. Neutral Stone base + swappable accent.
 *
 * Contract (shadcn-parity):
 * - Semantic vars: --b-bg, --b-panel, --b-surface, --b-elevated, --b-border,
 *   --b-text, --b-text-secondary, --b-muted, --b-accent, --b-accent-foreground,
 *   --b-ring, --b-success, --b-warning, --b-danger, --b-iris, --b-iris-foreground
 * - Components MUST use vars, never hardcoded #d4ff4f / white-opacity / #0C0C0C.
 * - Accent swap = change vars only. No sed across components.
 *
 * Known limitations (documented, not silently violated):
 * - Translucent accent washes (e.g. bg accent /10) keep hardcoded hex:
 *   Tailwind v3 cannot apply opacity modifiers to var() colors.
 * - Violet ramp (#5f4de8) stays hardcoded: decorative gradients + particle
 *   color arrays, no semantic role.
 * - JS color-math defaults (cursor glow alpha compositing) need hex channels
 *   and intentionally keep hex fallbacks.
 */

export const accentPresets = {
  // Default: Buildora Scaffold Lime — same hue both modes, lightness adjusted for AA.
  // Dark: luminous #D4FF4F on near-black. Light: deep #4D7C0F on paper.
  acid: {
    label: "Scaffold Lime",
    dark: { accent: "#D4FF4F", foreground: "#131305", muted: "rgba(212,255,79,0.12)" },
    light: { accent: "#4D7C0F", foreground: "#FFFFFF", muted: "rgba(77,124,15,0.10)" },
  },
  emerald: {
    label: "Universal Emerald",
    dark: { accent: "#34D399", foreground: "#052E22", muted: "rgba(52,211,153,0.12)" },
    light: { accent: "#047857", foreground: "#FFFFFF", muted: "rgba(4,120,87,0.10)" },
  },
  sky: {
    label: "Operator Sky",
    dark: { accent: "#38BDF8", foreground: "#082F49", muted: "rgba(56,189,248,0.12)" },
    light: { accent: "#0369A1", foreground: "#FFFFFF", muted: "rgba(3,105,161,0.10)" },
  },
  ember: {
    label: "Builder Ember",
    dark: { accent: "#FB923C", foreground: "#431407", muted: "rgba(251,146,60,0.12)" },
    light: { accent: "#C2410C", foreground: "#FFFFFF", muted: "rgba(194,65,12,0.10)" },
  },
  iris: {
    label: "Signal Iris",
    dark: { accent: "#A5B4FC", foreground: "#1E1B4B", muted: "rgba(165,180,252,0.12)" },
    light: { accent: "#4F46E5", foreground: "#FFFFFF", muted: "rgba(79,70,229,0.10)" },
  },
  rose: {
    label: "Editorial Rose",
    dark: { accent: "#FDA4AF", foreground: "#4C0519", muted: "rgba(253,164,175,0.12)" },
    light: { accent: "#BE123C", foreground: "#FFFFFF", muted: "rgba(190,18,60,0.10)" },
  },
} as const;

export type AccentName = keyof typeof accentPresets;

export const baseThemes = {
  light: {
    label: "Paper",
    bg: "#FAF9F7",
    panel: "#FFFFFF",
    surface: "#F1EFEB",
    elevated: "#FFFFFF",
    border: "rgba(19,19,22,0.08)",
    borderHover: "rgba(19,19,22,0.16)",
    text: "#131316",
    textSecondary: "#52525B",
    muted: "#8E8E93",
    ring: "rgba(19,19,22,0.16)",
    success: "#047857",
    warning: "#B45309",
    danger: "#BE123C",
  },
  dark: {
    label: "Warm Charcoal",
    bg: "#0E0E0C",
    panel: "#161614",
    surface: "#1D1D1A",
    elevated: "#242422",
    border: "rgba(255,255,255,0.08)",
    borderHover: "rgba(255,255,255,0.16)",
    text: "#EDEDEC",
    textSecondary: "#A1A1AA",
    muted: "#6E6E73",
    ring: "rgba(255,255,255,0.16)",
    success: "#34D399",
    warning: "#FBBF24",
    danger: "#F87171",
  },
} as const;

export type BaseName = keyof typeof baseThemes;

export const tokens = {
  color: {
    // kept for backwards compat — prefer baseThemes + accentPresets
    bg: baseThemes.dark.bg,
    panel: baseThemes.dark.panel,
    panel2: baseThemes.dark.surface,
    line: baseThemes.dark.border,
    text: baseThemes.dark.text,
    muted: baseThemes.dark.muted,
    accent: accentPresets.acid.dark.accent,
    iris: "#A5B4FC",
    irisDeep: "#4F46E5",
    ember: "#FB923C",
    danger: baseThemes.dark.danger,
    success: baseThemes.dark.success,
  },
  radius: { sm: 8, md: 10, lg: 12, xl: 16, full: 999 },
  space: { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 40 },
  font: {
    display: '"Space Grotesk", system-ui, sans-serif',
    sans: 'Inter, system-ui, sans-serif',
    mono: '"JetBrains Mono", ui-monospace, monospace',
  },
  spring: {
    gentle: { stiffness: 170, damping: 26, mass: 1 },
    snappy: { stiffness: 320, damping: 28, mass: 0.9 },
    bouncy: { stiffness: 220, damping: 14, mass: 1 },
    stiff: { stiffness: 480, damping: 34, mass: 1 },
  },
  duration: { fast: 140, base: 220, slow: 420, epic: 800 },
} as const;

export type Tokens = typeof tokens;

/**
 * Generates the full dual-theme CSS var block.
 * Usage: inject once in globals.css or via ThemeProvider for runtime switching.
 */
export const cssVars = `
:root, [data-theme="light"] {
  --b-bg: ${baseThemes.light.bg};
  --b-panel: ${baseThemes.light.panel};
  --b-surface: ${baseThemes.light.surface};
  --b-elevated: ${baseThemes.light.elevated};
  --b-border: ${baseThemes.light.border};
  --b-border-hover: ${baseThemes.light.borderHover};
  --b-text: ${baseThemes.light.text};
  --b-text-secondary: ${baseThemes.light.textSecondary};
  --b-muted: ${baseThemes.light.muted};
  --b-ring: ${baseThemes.light.ring};
  --b-success: ${baseThemes.light.success};
  --b-warning: ${baseThemes.light.warning};
  --b-danger: ${baseThemes.light.danger};
  --b-accent: ${accentPresets.acid.light.accent};
  --b-accent-foreground: ${accentPresets.acid.light.foreground};
  --b-accent-muted: ${accentPresets.acid.light.muted};
  --b-iris: #4F46E5;
  --b-iris-foreground: #FFFFFF;
  --b-radius: ${tokens.radius.lg}px;
  color-scheme: light;
}
[data-theme="dark"] {
  --b-bg: ${baseThemes.dark.bg};
  --b-panel: ${baseThemes.dark.panel};
  --b-surface: ${baseThemes.dark.surface};
  --b-elevated: ${baseThemes.dark.elevated};
  --b-border: ${baseThemes.dark.border};
  --b-border-hover: ${baseThemes.dark.borderHover};
  --b-text: ${baseThemes.dark.text};
  --b-text-secondary: ${baseThemes.dark.textSecondary};
  --b-muted: ${baseThemes.dark.muted};
  --b-ring: ${baseThemes.dark.ring};
  --b-success: ${baseThemes.dark.success};
  --b-warning: ${baseThemes.dark.warning};
  --b-danger: ${baseThemes.dark.danger};
  --b-accent: ${accentPresets.acid.dark.accent};
  --b-accent-foreground: ${accentPresets.acid.dark.foreground};
  --b-accent-muted: ${accentPresets.acid.dark.muted};
  --b-iris: #9D8CFF;
  --b-iris-foreground: #1E1B4B;
  color-scheme: dark;
}
`;

export const difficulties = ["beginner", "intermediate", "advanced"] as const;
export const categories = [
  "creative",
  "ai-llm",
  "data",
  "developer",
  "saas",
  "complex",
  "content",
  "primitives",
  "forms",
  "navigation",
  "overlays",
  "feedback",
  "blocks",
] as const;

export type Category = (typeof categories)[number];

/* Brand system — Buildora Scaffold mark */
export const brand = {
  name: "Buildora",
  tagline: "Build. Remix. Ship.",
  essence: "One system. Any product.",
  metaphor: "Scaffold + signal — modular B with an open joint. The gap is the remix point.",
  voice: ["precise", "calm", "confident", "inclusive"],
  shapeRule: "Cards 12px, inputs 10px, buttons 10px, badges full-pill. One radius scale.",
} as const;
