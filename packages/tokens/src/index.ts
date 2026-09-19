/**
 * Buildora design tokens — single source of truth for color, space, motion.
 * Basic tokens are open-source. Keep values framework-agnostic (CSS vars).
 */

export const tokens = {
  color: {
    bg: "#08090d",
    panel: "#0d0f16",
    panel2: "#12141d",
    line: "rgba(255,255,255,0.09)",
    text: "#f2f1ea",
    muted: "#a3a8c0",
    accent: "#d4ff4f",
    iris: "#9d8cff",
    irisDeep: "#5f4de8",
    ember: "#ff8a3d",
    danger: "#ff5d5d",
    success: "#4fe08a"
  },
  radius: { sm: 8, md: 12, lg: 16, xl: 22, full: 999 },
  space: { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 40 },
  font: {
    display: '"Space Grotesk", system-ui, sans-serif',
    sans: 'Inter, system-ui, sans-serif',
    mono: '"JetBrains Mono", ui-monospace, monospace'
  },
  spring: {
    gentle: { stiffness: 170, damping: 26, mass: 1 },
    snappy: { stiffness: 320, damping: 28, mass: 0.9 },
    bouncy: { stiffness: 220, damping: 14, mass: 1 },
    stiff: { stiffness: 480, damping: 34, mass: 1 }
  },
  duration: { fast: 140, base: 220, slow: 420, epic: 800 }
} as const;

export type Tokens = typeof tokens;

export const cssVars = `
:root {
  --b-bg: ${tokens.color.bg};
  --b-panel: ${tokens.color.panel};
  --b-line: ${tokens.color.line};
  --b-text: ${tokens.color.text};
  --b-muted: ${tokens.color.muted};
  --b-accent: ${tokens.color.accent};
  --b-iris: ${tokens.color.iris};
  --b-radius: ${tokens.radius.lg}px;
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
  "content"
] as const;

export type Category = (typeof categories)[number];
