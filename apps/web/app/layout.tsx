import type { Metadata } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { SiteHeader, SiteFooter } from "@/components/SiteChrome";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "Buildora — Creative components for serious developers",
  description:
    "Production-ready components with expressive interactions, multiple framework implementations, and an open-source developer-first workflow.",
  openGraph: {
    title: "Buildora",
    description: "Build. Remix. Ship.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`dark ${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body className="min-h-screen bg-[#08090d] font-sans text-[#f2f1ea] antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-[100] focus:rounded-lg focus:bg-[#d4ff4f] focus:px-3 focus:py-1 focus:text-black"
        >
          Skip to content
        </a>
        <SiteHeader />
        <main id="main" className="min-h-[70vh]">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
