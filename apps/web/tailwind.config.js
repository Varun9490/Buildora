/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
    "../../packages/components/src/**/*.{ts,tsx}",
    "../../packages/tokens/src/**/*.{ts,tsx}"
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#0C0C0C",
          900: "#141414",
          850: "#1A1A1A",
          800: "#222222",
          700: "#2F2F2F",
          600: "#3D3D3D",
          500: "#525252"
        },
        paper: "#F7F6F3",
        lime: { glow: "#d4ff4f", muted: "#b8e635" },
        ember: { 400: "#F78C6C", 500: "#ff8a3d" }
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
        sans: ["var(--font-display)", "system-ui", "sans-serif"]
      },
      boxShadow: {
        tactile: "0 1px 0 rgba(255,255,255,.06) inset, 0 8px 24px -8px rgba(0,0,0,.5)",
        subtle: "0 2px 8px rgba(0,0,0,0.04)",
        card: "0 1px 3px rgba(0,0,0,0.08), 0 8px 24px -8px rgba(0,0,0,0.12)",
        "card-hover": "0 2px 8px rgba(0,0,0,0.12), 0 16px 40px -12px rgba(0,0,0,0.2)"
      },
      borderRadius: {
        DEFAULT: "8px",
        lg: "12px",
        xl: "16px"
      },
      spacing: {
        18: "4.5rem",
        22: "5.5rem"
      },
      letterSpacing: {
        tighter: "-0.03em",
        editorial: "-0.04em"
      },
      lineHeight: {
        editorial: "1.1",
        relaxed: "1.7"
      },
      keyframes: {
        drift: {
          "0%,100%": { transform: "translate3d(0,0,0) scale(1)" },
          "50%": { transform: "translate3d(2%, -3%, 0) scale(1.02)" }
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" }
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.96)" },
          "100%": { opacity: "1", transform: "scale(1)" }
        }
      },
      animation: {
        drift: "drift 20s ease-in-out infinite",
        shimmer: "shimmer 2.4s linear infinite",
        "fade-up": "fade-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) both",
        "scale-in": "scale-in 0.4s cubic-bezier(0.16, 1, 0.3, 1) both"
      }
    }
  },
  plugins: []
};
