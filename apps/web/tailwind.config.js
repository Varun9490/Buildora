/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
    "../../packages/components/src/**/*.{ts,tsx}",
    "../../packages/tokens/src/**/*.{ts,tsx}"
  ],
  darkMode: ["class", '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        // Semantic — always via CSS vars. No hardcoded dark/light in components.
        background: "var(--b-bg)",
        panel: "var(--b-panel)",
        surface: "var(--b-surface)",
        elevated: "var(--b-elevated)",
        foreground: "var(--b-text)",
        muted: "var(--b-muted)",
        border: "var(--b-border)",
        accent: {
          DEFAULT: "var(--b-accent)",
          foreground: "var(--b-accent-foreground)",
          muted: "var(--b-accent-muted)",
        },
        success: "var(--b-success)",
        warning: "var(--b-warning)",
        danger: "var(--b-danger)",
        ring: "var(--b-ring)",
      },
      fontFamily: {
        display: ["var(--font-display)", "\"Space Grotesk\"", "system-ui", "sans-serif"],
        sans: ["var(--font-sans)", "Inter", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "\"JetBrains Mono\"", "ui-monospace", "monospace"],
      },
      boxShadow: {
        // Restrained — no neon glows. Tint to bg hue.
        subtle: "0 1px 2px rgba(19,19,22,0.05)",
        card: "0 1px 3px rgba(19,19,22,0.07), 0 8px 24px -12px rgba(19,19,22,0.12)",
        "card-hover": "0 2px 8px rgba(19,19,22,0.08), 0 16px 32px -16px rgba(19,19,22,0.16)",
      },
      borderRadius: {
        DEFAULT: "10px",
        lg: "12px",
        xl: "16px",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.96)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) both",
        "scale-in": "scale-in 0.4s cubic-bezier(0.16, 1, 0.3, 1) both",
        shimmer: "shimmer 2.4s linear infinite",
      },
    },
  },
  plugins: [],
};
