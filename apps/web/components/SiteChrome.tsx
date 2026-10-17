"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@buildora/utils";
import { totalComponents } from "@/lib/registry";
import { ThemeCustomizer } from "@/components/ThemeCustomizer";
import { CommandMenu, RegistryModal } from "@/components/landing/CommandMenu";

const SECTION_LINKS = [
  { href: "#showcase", label: "Showcase" },
  { href: "#explorer", label: "Explorer" },
  { href: "#physics-lab", label: "Physics Lab" },
  { href: "#portability", label: "Portability" },
  { href: "#principles", label: "Principles" },
];

const PAGE_LINKS = [
  { href: "/components", label: "Components" },
  { href: "/templates", label: "Templates" },
  { href: "/docs", label: "Docs" },
];

/* ─────────────────────────────────────────────────────
   HEADER — floating chrome with real controls:
   section nav (home) · ⌘K palette · theme switcher ·
   GitHub · install modal. No dead buttons.
   ───────────────────────────────────────────────────── */
export function SiteHeader() {
  const path = usePathname();
  const isHome = path === "/";
  const [cmdOpen, setCmdOpen] = React.useState(false);
  const [installOpen, setInstallOpen] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCmdOpen((prev) => !prev);
      } else if (e.key === "Escape") {
        setCmdOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "sticky top-0 z-50 transition-all duration-300",
        scrolled
          ? "border-b border-[color:var(--b-border)] bg-[color-mix(in_oklab,var(--b-bg)_88%,transparent)] backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
        {/* Logo */}
        <Link href="/" className="group flex items-center gap-2.5" aria-label="Buildora home">
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="flex h-8 w-8 items-center justify-center rounded-[10px] border border-[color:var(--b-border)] bg-[color:var(--b-panel)] text-[color:var(--b-text)]"
          >
            <svg
              width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"
            >
              <path d="M6 4v16" />
              <path d="M6 4h7.5a3.5 3.5 0 0 1 0 7H6" />
              <path d="M6 11h8.5a3.5 3.5 0 0 1 0 7H6" />
              <circle cx="17.5" cy="17.5" r="1.6" fill="var(--b-accent)" stroke="none" />
            </svg>
          </motion.div>
          <span className="font-display text-base font-bold tracking-tight">Buildora</span>
          <span className="hidden rounded-full border border-[color:var(--b-border)] bg-[color:var(--b-surface)] px-2 py-0.5 font-mono text-[10px] text-[color:var(--b-muted)] sm:inline">
            v0.1
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="ml-4 hidden items-center gap-0.5 lg:flex" aria-label="Primary">
          {isHome
            ? SECTION_LINKS.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  className="rounded-md px-3 py-1.5 text-sm font-medium text-[color:var(--b-muted)] transition-colors duration-200 hover:bg-[color:var(--b-surface)] hover:text-[color:var(--b-text-secondary)]"
                >
                  {l.label}
                </a>
              ))
            : PAGE_LINKS.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className={cn(
                    "relative rounded-md px-3 py-1.5 text-sm font-medium transition-colors duration-200",
                    path === l.href
                      ? "text-[color:var(--b-text)]"
                      : "text-[color:var(--b-muted)] hover:text-[color:var(--b-text-secondary)]"
                  )}
                >
                  {l.label}
                  {path === l.href && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute bottom-0 left-3 right-3 h-px bg-[color:var(--b-accent)]"
                      transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                    />
                  )}
                </Link>
              ))}
        </nav>

        {/* Right controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCmdOpen(true)}
            className="hidden items-center gap-2 rounded-full border border-[color:var(--b-border)] bg-[color:color-mix(in_oklab,var(--b-surface)_80%,transparent)] px-3 py-1.5 font-mono text-[11px] text-[color:var(--b-text-secondary)] transition-all hover:border-[color:var(--b-border-hover)] hover:bg-[color:var(--b-elevated)] hover:text-[color:var(--b-text)] md:flex"
            aria-label="Open command palette"
          >
            <svg className="h-3 w-3 text-[color:var(--b-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span>Search</span>
            <kbd className="rounded border border-[color:var(--b-border)] bg-[color:var(--b-bg)] px-1 py-0.2 text-[9px] text-[color:var(--b-muted)]">⌘K</kbd>
          </button>

          <ThemeCustomizer />

          <a
            href="https://github.com/Varun9490/Buildora"
            target="_blank"
            rel="noreferrer"
            className="hidden items-center gap-2 rounded-full border border-[color:var(--b-border)] px-3 py-1.5 font-mono text-[11px] text-[color:var(--b-text-secondary)] transition-colors hover:bg-[color:var(--b-surface)] hover:text-[color:var(--b-text)] sm:flex"
          >
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.2 11.38.6.11.82-.26.82-.58v-2.03c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.08-.74.08-.73.08-.73 1.2.08 1.84 1.23 1.84 1.23 1.07 1.84 2.8 1.31 3.49 1 .1-.78.42-1.31.76-1.61-2.66-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.13-.3-.54-1.52.12-3.18 0 0 1-.32 3.3 1.23a11.5 11.5 0 016.02 0c2.28-1.55 3.29-1.23 3.29-1.23.66 1.66.25 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.63-5.48 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.22.7.82.58A12.01 12.01 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
            GitHub
          </a>

          <button
            onClick={() => setInstallOpen(true)}
            className="hidden items-center gap-2 rounded-full bg-[color:var(--b-accent)] px-4 py-1.5 font-mono text-[11px] font-bold text-[color:var(--b-accent-foreground)] shadow-[0_0_20px_var(--b-accent-glow)] transition-transform active:scale-[0.97] sm:inline-flex"
          >
            Install
          </button>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen((o) => !o)}
            className="flex h-8 w-8 items-center justify-center rounded-md border border-[color:var(--b-border)] text-[color:var(--b-text-secondary)] transition-colors hover:bg-[color:var(--b-surface)] lg:hidden"
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            <svg width="16" height="16" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
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

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="border-t border-[color:var(--b-border)] bg-[color:color-mix(in_oklab,var(--b-bg)_95%,transparent)] backdrop-blur-xl lg:hidden"
          >
            <nav className="space-y-0.5 px-4 py-3" aria-label="Primary mobile">
              {isHome &&
                SECTION_LINKS.map((l) => (
                  <a
                    key={l.href}
                    href={l.href}
                    onClick={() => setMobileOpen(false)}
                    className="block rounded-md px-3 py-2 text-sm text-[color:var(--b-text-secondary)] transition-colors hover:bg-[color:var(--b-surface)]"
                  >
                    {l.label}
                  </a>
                ))}
              {PAGE_LINKS.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "block rounded-md px-3 py-2 text-sm transition-colors",
                    path === l.href
                      ? "bg-[color:var(--b-surface)] font-medium text-[color:var(--b-text)]"
                      : "text-[color:var(--b-muted)] hover:bg-[color:var(--b-surface)] hover:text-[color:var(--b-text-secondary)]"
                  )}
                >
                  {l.label}
                </Link>
              ))}
              <div className="mt-3 flex gap-2 pt-2">
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    setInstallOpen(true);
                  }}
                  className="flex-1 rounded-full bg-[color:var(--b-accent)] py-2 text-center font-mono text-xs font-bold text-[color:var(--b-accent-foreground)]"
                >
                  Install
                </button>
                <a
                  href="https://github.com/Varun9490/Buildora"
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 rounded-full border border-[color:var(--b-border)] py-2 text-center font-mono text-xs text-[color:var(--b-text-secondary)]"
                >
                  GitHub
                </a>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      <CommandMenu open={cmdOpen} onClose={() => setCmdOpen(false)} />
      <RegistryModal open={installOpen} onClose={() => setInstallOpen(false)} />
    </motion.header>
  );
}

/* ─────────────────────────────────────────────────────
   FOOTER — editorial, honest counts, live token strip.
   ───────────────────────────────────────────────────── */
export function SiteFooter() {
  return (
    <footer className="border-t border-[color:var(--b-border)] bg-[color:var(--b-bg)]">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:py-20">
        <div className="grid gap-10 md:grid-cols-4">
          {/* Brand column */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-[10px] border border-[color:var(--b-border)] bg-[color:var(--b-panel)] text-[color:var(--b-text)]">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M6 4v16" />
                  <path d="M6 4h7.5a3.5 3.5 0 0 1 0 7H6" />
                  <path d="M6 11h8.5a3.5 3.5 0 0 1 0 7H6" />
                  <circle cx="17.5" cy="17.5" r="1.6" fill="var(--b-accent)" stroke="none" />
                </svg>
              </span>
              <p className="font-display text-base font-bold tracking-tight">Buildora</p>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-[color:var(--b-muted)]">
              One system. Any product. Universal, theme-aware components with real physics.
              MIT-licensed, GitHub-hosted.
            </p>
            <div className="mt-4 rounded-xl border border-[color:var(--b-border)] bg-[color:color-mix(in_oklab,var(--b-panel)_85%,transparent)] p-3 font-mono text-[11px]">
              <span className="text-[color:var(--b-muted)]">$</span>{" "}
              <code className="text-[color:var(--b-accent)]">
                pnpm dlx shadcn@latest add @buildora/magnetic-button
              </code>
              <p className="mt-2 font-mono text-[10px] text-[color:var(--b-muted)]">
                {totalComponents} primitives in the registry · search them all with ⌘K
              </p>
            </div>
          </div>

          {/* Explore */}
          <nav aria-label="Explore">
            <p className="font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-[color:var(--b-muted)]">
              Explore
            </p>
            <ul className="mt-4 space-y-3">
              {[
                { label: "All components", href: "/components" },
                { label: "Playground", href: "/playground" },
                { label: "Templates", href: "/templates" },
                { label: "Registry", href: "/registry" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-[color:var(--b-text-secondary)] transition-colors hover:text-[color:var(--b-accent)]">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* On this page */}
          <nav aria-label="On this page">
            <p className="font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-[color:var(--b-muted)]">
              On this page
            </p>
            <ul className="mt-4 space-y-3">
              {SECTION_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={`/${l.href}`} className="text-sm text-[color:var(--b-text-secondary)] transition-colors hover:text-[color:var(--b-accent)]">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Resources */}
          <nav aria-label="Resources">
            <p className="font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-[color:var(--b-muted)]">
              Resources
            </p>
            <ul className="mt-4 space-y-3">
              <li>
                <Link href="/docs" className="text-sm text-[color:var(--b-text-secondary)] transition-colors hover:text-[color:var(--b-accent)]">
                  Documentation
                </Link>
              </li>
              <li>
                <a
                  href="https://github.com/Varun9490/Buildora"
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-[color:var(--b-text-secondary)] transition-colors hover:text-[color:var(--b-accent)]"
                >
                  GitHub
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/Varun9490/Buildora/issues"
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-[color:var(--b-text-secondary)] transition-colors hover:text-[color:var(--b-accent)]"
                >
                  Issues & ideas
                </a>
              </li>
            </ul>
            <ul className="mt-6 space-y-3">
              {[
                { text: "Usefulness before novelty" },
                { text: "Accessibility is non-negotiable" },
                { text: "Idiomatic per framework" },
              ].map((item) => (
                <li key={item.text} className="flex items-start gap-2.5 text-xs text-[color:var(--b-muted)]">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[color:var(--b-accent)]" />
                  {item.text}
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      <div className="border-t border-[color:var(--b-border)] py-6">
        <p className="text-center font-mono text-[11px] text-[color:var(--b-muted)]">
          Built with craft by <span className="text-[color:var(--b-text-secondary)]">Buildora</span> · MIT License · {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
}
