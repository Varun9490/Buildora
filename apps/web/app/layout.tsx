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
  metadataBase: new URL("https://buildora.dev"),
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
    const raw = localStorage.getItem("buildora-store");
    let mode = "system";
    let accent = "acid";
    if (raw) {
      const parsed = JSON.parse(raw);
      mode = parsed?.state?.themeMode ?? "system";
      accent = parsed?.state?.themeAccent ?? "acid";
    }
    const mq = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    const resolved = mode === "system" ? mq : mode;
    document.documentElement.setAttribute("data-theme", resolved);
    document.documentElement.classList.toggle("dark", resolved === "dark");
  } catch {}
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
      <body className="min-h-screen bg-[--b-bg] font-sans text-[--b-text] antialiased">
        <ThemeProvider>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-[100] focus:rounded-lg focus:bg-[--b-accent] focus:px-3 focus:py-1 focus:text-[--b-accent-foreground]"
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
