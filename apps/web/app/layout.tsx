import type { Metadata } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { SiteHeader, SiteFooter } from "@/components/SiteChrome";
import { ThemeProvider } from "@/components/ThemeProvider";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["500", "600", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  weight: ["400", "500", "600"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://buildora-hazel.vercel.app"),
  title: "Buildora — One system. Any product.",
  description:
    "Universal, theme-aware React components. Light + dark, swappable accent, accessible. Build. Remix. Ship.",
  openGraph: {
    title: "Buildora",
    description: "Build. Remix. Ship. One system. Any product.",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

function themeInit() {
  try {
    var raw = localStorage.getItem("buildora-store");
    var surface = "obsidian";
    var accent = "acid";
    var motion = "auto";
    if (raw) {
      var parsed = JSON.parse(raw);
      surface = parsed?.state?.surface ?? "obsidian";
      accent = parsed?.state?.themeAccent ?? "acid";
      motion = parsed?.state?.motionOverride ?? "auto";
    }
    var accents = ["acid", "iris", "amber", "emerald", "crimson"];
    if (accents.indexOf(accent) === -1) accent = "acid";
    if (["obsidian", "oled", "alabaster"].indexOf(surface) === -1) surface = "obsidian";
    var theme = surface === "alabaster" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", theme);
    document.documentElement.setAttribute("data-surface", surface);
    document.documentElement.setAttribute("data-accent", accent);
    if (motion === "reduced") document.documentElement.setAttribute("data-motion", "reduced");
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.documentElement.style.colorScheme = theme;
  } catch (e) {}
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      data-theme="dark"
      className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: `(${themeInit.toString()})()` }} />
      </head>
      <body className="min-h-screen bg-[color:var(--b-bg)] font-sans text-[color:var(--b-text)] antialiased">
        <ThemeProvider>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-[100] focus:rounded-lg focus:bg-[color:var(--b-accent)] focus:px-3 focus:py-1 focus:text-[color:var(--b-accent-foreground)]"
          >
            Skip to content
          </a>
          <SiteHeader />
          <main id="main" className="min-h-[70vh]">
            {children}
          </main>
          <SiteFooter />
        </ThemeProvider>
      </body>
    </html>
  );
}
