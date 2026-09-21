/**
 * Buildora design tokens — universal, adoptable system.
 * Single source of truth. Light + dark. Neutral Stone base + swappable accent.
 *
 * Contract (shadcn-parity):
 * - Semantic vars: --b-bg, --b-panel, --b-surface, --b-elevated, --b-border,
 *   --b-text, --b-text-secondary, --b-muted, --b-accent, --b-accent-foreground,
 *   --b-ring, --b-success, --b-warning, --b-danger, --b-iris, --b-iris-foreground
 * - Components MUST use vars, never hardcoded oklch(93.88% 0.2000 122.3) / white-opacity / oklch(15.43% 0.0000 0).
 * - Accent swap = change vars only. No sed across components.
 *
 * Known limitations (documented, not silently violated):
 * - Translucent accent washes (e.g. bg accent /10) keep hardcoded hex:
 *   Tailwind v3 cannot apply opacity modifiers to var() colors.
 * - Violet ramp (oklch(53.50% 0.2231 281.0)) stays hardcoded: decorative gradients + particle
 *   color arrays, no semantic role.
 * - JS color-math defaults (cursor glow alpha compositing) need hex channels
 *   and intentionally keep hex fallbacks.
 */

export const accentPresets = {
  // Default: Buildora Scaffold Lime — same hue both modes, lightness adjusted for AA.
  // Dark: luminous oklch(93.88% 0.2000 122.3) on near-black. Light: deep oklch(53.22% 0.1405 131.6) on paper.
  acid: {
    label: "Scaffold Lime",
    dark: { accent: "oklch(93.88% 0.2000 122.3)", foreground: "oklch(18.22% 0.0271 108.8)", muted: "oklch(93.88% 0.2000 122.3 / 0.12)" },
    light: { accent: "oklch(53.22% 0.1405 131.6)", foreground: "oklch(100.00% 0.0000 0)", muted: "oklch(53.22% 0.1405 131.6 / 0.1)" },
  },
  emerald: {
    label: "Universal Emerald",
    dark: { accent: "oklch(77.29% 0.1535 163.2)", foreground: "oklch(26.98% 0.0497 168.8)", muted: "oklch(77.29% 0.1535 163.2 / 0.12)" },
    light: { accent: "oklch(50.81% 0.1049 165.6)", foreground: "oklch(100.00% 0.0000 0)", muted: "oklch(50.81% 0.1049 165.6 / 0.1)" },
  },
  sky: {
    label: "Operator Sky",
    dark: { accent: "oklch(75.35% 0.1390 232.7)", foreground: "oklch(29.35% 0.0632 243.2)", muted: "oklch(75.35% 0.1390 232.7 / 0.12)" },
    light: { accent: "oklch(50.00% 0.1193 242.7)", foreground: "oklch(100.00% 0.0000 0)", muted: "oklch(50.00% 0.1193 242.7 / 0.1)" },
  },
  ember: {
    label: "Builder Ember",
    dark: { accent: "oklch(75.76% 0.1590 55.9)", foreground: "oklch(26.59% 0.0762 36.3)", muted: "oklch(75.76% 0.1590 55.9 / 0.12)" },
    light: { accent: "oklch(55.34% 0.1739 38.4)", foreground: "oklch(100.00% 0.0000 0)", muted: "oklch(55.34% 0.1739 38.4 / 0.1)" },
  },
  iris: {
    label: "Signal Iris",
    dark: { accent: "oklch(78.53% 0.1041 274.7)", foreground: "oklch(25.73% 0.0861 281.3)", muted: "oklch(78.53% 0.1041 274.7 / 0.12)" },
    light: { accent: "oklch(51.06% 0.2301 277.0)", foreground: "oklch(100.00% 0.0000 0)", muted: "oklch(51.06% 0.2301 277.0 / 0.1)" },
  },
  rose: {
    label: "Editorial Rose",
    dark: { accent: "oklch(80.97% 0.1061 11.6)", foreground: "oklch(27.08% 0.1009 12.1)", muted: "oklch(80.97% 0.1061 11.6 / 0.12)" },
    light: { accent: "oklch(51.43% 0.1978 16.9)", foreground: "oklch(100.00% 0.0000 0)", muted: "oklch(51.43% 0.1978 16.9 / 0.1)" },
  },
} as const;

export type AccentName = keyof typeof accentPresets;

export const baseThemes = {
  light: {
    label: "Paper",
    bg: "oklch(98.23% 0.0029 84.6)",
    panel: "oklch(100.00% 0.0000 0)",
    surface: "oklch(95.26% 0.0058 84.6)",
    elevated: "oklch(100.00% 0.0000 0)",
    border: "oklch(18.81% 0.0060 285.8 / 0.08)",
    borderHover: "oklch(18.81% 0.0060 285.8 / 0.16)",
    text: "oklch(18.81% 0.0060 285.8)",
    textSecondary: "oklch(44.19% 0.0146 285.8)",
    muted: "oklch(64.83% 0.0073 286.2)",
    ring: "oklch(18.81% 0.0060 285.8 / 0.16)",
    success: "oklch(50.81% 0.1049 165.6)",
    warning: "oklch(55.53% 0.1455 49.0)",
    danger: "oklch(51.43% 0.1978 16.9)",
  },
  dark: {
    label: "Warm Charcoal",
    bg: "oklch(16.29% 0.0041 106.8)",
    panel: "oklch(19.94% 0.0039 106.7)",
    surface: "oklch(22.96% 0.0057 106.8)",
    elevated: "oklch(25.96% 0.0037 106.7)",
    border: "oklch(100.00% 0.0000 0 / 0.08)",
    borderHover: "oklch(100.00% 0.0000 0 / 0.16)",
    text: "oklch(94.58% 0.0013 106.4)",
    textSecondary: "oklch(71.18% 0.0129 286.1)",
    muted: "oklch(53.99% 0.0077 286.1)",
    ring: "oklch(100.00% 0.0000 0 / 0.16)",
    success: "oklch(77.29% 0.1535 163.2)",
    warning: "oklch(83.69% 0.1644 84.4)",
    danger: "oklch(71.06% 0.1661 22.2)",
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
    iris: "oklch(78.53% 0.1041 274.7)",
    irisDeep: "oklch(51.06% 0.2301 277.0)",
    ember: "oklch(75.76% 0.1590 55.9)",
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
  --b-iris: oklch(51.06% 0.2301 277.0);
  --b-iris-foreground: oklch(100.00% 0.0000 0);
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
  --b-iris: oklch(70.51% 0.1642 288.2);
  --b-iris-foreground: oklch(25.73% 0.0861 281.3);
  color-scheme: dark;
}
`;

export const difficulties = ["beginner", "intermediate", "advanced"] as const;
export const categories = [
  "primitives",
  "forms",
  "feedback",
  "navigation",
  "overlays",
  "motion",
  "backgrounds",
  "data",
  "developer",
  "ai-llm",
  "canvas",
  "editor",
  "blocks",
  "saas",
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
