"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@buildora/utils";
import { useBuildora } from "@/lib/store";
import { frameworkLabels, frameworks } from "@/lib/registry";
import { SpatialCommandPalette } from "@buildora/components";

const links = [
  { href: "/", label: "Home" },
  { href: "/components", label: "Components" },
  { href: "/playground", label: "Playground" },
  { href: "/templates", label: "Templates" },
  { href: "/docs", label: "Docs" },
  { href: "/registry", label: "Registry" },
];

export function SiteHeader() {
  const path = usePathname();
  const { framework, setFramework } = useBuildora();
  const [open, setOpen] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={cn(
        "sticky top-0 z-50 border-b transition-all duration-300",
        scrolled
          ? "border-white/[0.06] bg-[#08090d]/95 shadow-[0_4px_30px_rgba(0,0,0,0.3)] backdrop-blur-xl backdrop-saturate-150"
          : "border-transparent bg-transparent"
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="group flex items-center gap-2.5" aria-label="Buildora home">
          <motion.div
            whileHover={{ scale: 1.05, rotate: 3 }}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#d4ff4f] to-[#a8e063] font-display text-lg font-black text-black shadow-glow-sm"
          >
            B
          </motion.div>
          <span className="font-display text-lg font-black tracking-tight">BUILDORA</span>
          <span className="hidden rounded-full border border-white/15 bg-white/[0.03] px-2 py-0.5 font-mono text-[10px] text-white/50 sm:inline">
            v0.1 · OSS
          </span>
        </Link>

        <nav className="ml-4 hidden items-center gap-1 lg:flex" aria-label="Primary">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "relative rounded-lg px-3 py-1.5 text-sm font-medium transition-all duration-200",
                path === l.href
                  ? "bg-white/10 text-white"
                  : "text-white/50 hover:bg-white/[0.04] hover:text-white"
              )}
            >
              {l.label}
              {path === l.href && (
                <motion.div
                  layoutId="activeNav"
                  className="absolute inset-0 rounded-lg border border-[#d4ff4f]/30 bg-white/5"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden md:block">
            <SpatialCommandPalette />
          </div>

          <div className="relative">
            <button
              onClick={() => setOpen((o) => !o)}
              aria-haspopup="listbox"
              aria-expanded={open}
              className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-1.5 font-mono text-xs text-white/80 transition-all hover:border-white/20 hover:bg-white/[0.06]"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[#d4ff4f]" />
              {frameworkLabels[framework]}
              <svg className="h-3 w-3 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <AnimatePresence>
              {open && (
                <>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-40"
                    onClick={() => setOpen(false)}
                  />
                  <motion.ul
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    role="listbox"
                    aria-label="Framework"
                    className="absolute right-0 z-50 mt-2 max-h-72 w-44 overflow-auto rounded-2xl border border-white/10 bg-[#12141d]/95 p-1.5 shadow-2xl backdrop-blur-xl"
                  >
                    {frameworks.map((f) => (
                      <li key={f}>
                        <button
                          role="option"
                          aria-selected={f === framework}
                          onClick={() => {
                            setFramework(f);
                            setOpen(false);
                          }}
                          className={cn(
                            "flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left font-mono text-xs transition-all",
                            f === framework
                              ? "bg-[#d4ff4f]/10 text-[#d4ff4f]"
                              : "text-white/60 hover:bg-white/5 hover:text-white"
                          )}
                        >
                          <span
                            className={cn(
                              "h-1.5 w-1.5 rounded-full",
                              f === framework ? "bg-[#d4ff4f]" : "bg-white/20"
                            )}
                          />
                          {frameworkLabels[f]}
                        </button>
                      </li>
                    ))}
                  </motion.ul>
                </>
              )}
            </AnimatePresence>
          </div>

          <a
            href="https://github.com/buildora/buildora"
            target="_blank"
            rel="noreferrer"
            className="hidden items-center gap-2 rounded-xl border border-white/10 px-3 py-1.5 font-mono text-xs text-white/80 transition-all hover:bg-white/[0.04] sm:flex"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.2 11.38.6.11.82-.26.82-.58v-2.03c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.08-.74.08-.73.08-.73 1.2.08 1.84 1.23 1.84 1.23 1.07 1.84 2.8 1.31 3.49 1 .1-.78.42-1.31.76-1.61-2.66-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.13-.3-.54-1.52.12-3.18 0 0 1-.32 3.3 1.23a11.5 11.5 0 016.02 0c2.28-1.55 3.29-1.23 3.29-1.23.66 1.66.25 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.63-5.48 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.22.7.82.58A12.01 12.01 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
            GitHub
          </a>

          <Link
            href="/registry"
            className="hidden items-center gap-2 rounded-xl bg-gradient-to-r from-[#d4ff4f] to-[#a8e063] px-4 py-1.5 text-xs font-bold text-black shadow-glow-sm transition-transform hover:scale-[1.02] active:scale-[0.98] sm:inline-flex"
          >
            Install
          </Link>

          <button
            onClick={() => setMobileOpen((o) => !o)}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 text-white/70 transition-all hover:bg-white/[0.04] hover:text-white lg:hidden"
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2">
              {mobileOpen ? (
                <>
                  <line x1="4" y1="4" x2="14" y2="14" />
                  <line x1="14" y1="4" x2="4" y2="14" />
                </>
              ) : (
                <>
                  <line x1="3" y1="5" x2="15" y2="5" />
                  <line x1="3" y1="9" x2="15" y2="9" />
                  <line x1="3" y1="13" x2="15" y2="13" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-white/[0.06] bg-[#08090d]/95 backdrop-blur-xl lg:hidden"
          >
            <nav className="space-y-1 px-4 py-4" aria-label="Primary mobile">
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "block rounded-xl px-4 py-2.5 text-sm transition-all",
                    path === l.href
                      ? "bg-white/10 font-medium text-white"
                      : "text-white/60 hover:bg-white/[0.04]"
                  )}
                >
                  {l.label}
                </Link>
              ))}
              <div className="mt-3 flex flex-wrap gap-2 px-1">
                <a
                  href="https://github.com/buildora/buildora"
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 rounded-xl border border-white/10 px-4 py-2 text-center text-sm text-white/70"
                >
                  GitHub
                </a>
                <Link
                  href="/registry"
                  onClick={() => setMobileOpen(false)}
                  className="flex-1 rounded-xl bg-[#d4ff4f] px-4 py-2 text-center text-sm font-bold text-black"
                >
                  Install
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="h-px bg-gradient-to-r from-transparent via-[#d4ff4f]/30 to-transparent" />
    </motion.header>
  );
}

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden border-t border-white/[0.06] bg-[#07080c]">
      <div className="absolute inset-0 bg-gradient-radial opacity-30" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#9d8cff]/30 to-transparent" />

      <div className="relative mx-auto max-w-7xl px-4 py-16">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-[#d4ff4f] to-[#a8e063] font-display text-sm font-black text-black shadow-glow-sm">
                B
              </span>
              <p className="font-display text-lg font-black">BUILDORA</p>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/45">
              Creative components for serious developers. MIT-licensed,
              GitHub-hosted, community-driven.
            </p>
            <div className="mt-4 b-code-block text-[11px]">
              <span className="text-white/30">$</span>{" "}
              <code className="text-[#d4ff4f]">
                pnpm dlx shadcn@latest add @buildora/magnetic-button
              </code>
            </div>
          </div>

          <nav aria-label="Explore">
            <p className="font-mono text-[11px] font-bold uppercase tracking-[0.15em] text-white/30">
              Explore
            </p>
            <ul className="mt-4 space-y-3">
              {[
                { label: "All components", href: "/components" },
                { label: "Categories", href: "/categories" },
                { label: "Playground", href: "/playground" },
                { label: "Templates", href: "/templates" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/60 transition-colors hover:text-[#d4ff4f]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Resources">
            <p className="font-mono text-[11px] font-bold uppercase tracking-[0.15em] text-white/30">
              Resources
            </p>
            <ul className="mt-4 space-y-3">
              {[
                { label: "Docs", href: "/docs" },
                { label: "Registry", href: "/registry" },
                { label: "GitHub", href: "https://github.com/buildora/buildora", external: true },
              ].map((link) => (
                <li key={link.href}>
                  {link.external ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm text-white/60 transition-colors hover:text-[#d4ff4f]"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      href={link.href}
                      className="text-sm text-white/60 transition-colors hover:text-[#d4ff4f]"
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="font-mono text-[11px] font-bold uppercase tracking-[0.15em] text-white/30">
              Principles
            </p>
            <ul className="mt-4 space-y-3">
              {[
                { color: "#d4ff4f", text: "Usefulness before novelty" },
                { color: "#9d8cff", text: "Accessibility is non-negotiable" },
                { color: "#ff8a3d", text: "Idiomatic per framework" },
                { color: "#4fe08a", text: "Never fake support" },
              ].map((item) => (
                <li key={item.text} className="flex items-start gap-2 text-sm text-white/45">
                  <span
                    className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  {item.text}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="relative border-t border-white/[0.05] py-6">
        <p className="text-center text-xs text-white/25">
          Built with craft by <span className="text-white/40">Buildora</span> · MIT
          License · {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
}
