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
          950: "#08090d",
          900: "#0d0f16",
          850: "#12141d",
          800: "#181b26",
          700: "#232738",
          600: "#323954",
          500: "#4b557e"
        },
        paper: "#f6f5f0",
        lime: { glow: "#d4ff4f" },
        iris: { 400: "#9d8cff", 500: "#7c6cf6", 600: "#5f4de8" },
        ember: { 400: "#ffb86b", 500: "#ff8a3d" }
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"]
      },
      boxShadow: {
        tactile: "0 1px 0 rgba(255,255,255,.08) inset, 0 12px 32px -12px rgba(0,0,0,.6)",
        glow: "0 0 0 1px rgba(212,255,79,.25), 0 8px 40px -8px rgba(212,255,79,.35)",
        card: "0 20px 60px -20px rgba(0,0,0,.55)"
      },
      borderRadius: {
        xl2: "1.25rem"
      },
      keyframes: {
        drift: {
          "0%,100%": { transform: "translate3d(0,0,0) scale(1)" },
          "50%": { transform: "translate3d(2%, -3%, 0) scale(1.05)" }
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" }
        }
      },
      animation: {
        drift: "drift 14s ease-in-out infinite",
        shimmer: "shimmer 2.4s linear infinite"
      }
    }
  },
  plugins: []
};
