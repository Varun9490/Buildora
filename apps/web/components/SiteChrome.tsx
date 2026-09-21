"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@buildora/utils";
import { CommandPalette } from "@buildora/components";
import { useBuildora } from "@/lib/store";
import { frameworkLabels, frameworks } from "@/lib/registry";

import { ThemeCustomizer } from "@/components/ThemeCustomizer";

const links = [
  { href: "/", label: "Home" },
  { href: "/components", label: "Components" },
  { href: "/templates", label: "Templates" },
  { href: "/docs", label: "Docs" },
];

/* ─────────────────────────────────────────────────────
   HEADER — Minimal floating nav
   ───────────────────────────────────────────────────── */
export function SiteHeader() {
  const path = usePathname();
  const router = useRouter();
  const { framework, setFramework } = useBuildora();
  const [open, setOpen] = React.useState(false);
  const [cmdOpen, setCmdOpen] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const triggerRef = React.useRef<HTMLButtonElement | null>(null);
  const optionRefs = React.useRef<(HTMLButtonElement | null)[]>([]);

  React.useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCmdOpen((prev) => !prev);
      } else if (e.key === "Escape") {
        setCmdOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const focusFrameworkOption = (i: number) => {
    const n = frameworks.length;
    const next = ((i % n) + n) % n;
    optionRefs.current[next]?.focus();
  };

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "sticky top-0 z-50 transition-all duration-300",
        scrolled
          ? "border-b border-[color:var(--b-border)] bg-[color-mix(in_oklab,var(--b-bg)_90%,transparent)] backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
        {/* Logo */}
        <Link
          href="/"
          className="group flex items-center gap-2.5"
          aria-label="Buildora home"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="flex h-8 w-8 items-center justify-center rounded-[10px] border border-[color:var(--b-border)] bg-[color:var(--b-panel)] text-[color:var(--b-text)]"
          >
            {/* Scaffold-B: modular B with open remix joint */}
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M6 4v16" />
              <path d="M6 4h7.5a3.5 3.5 0 0 1 0 7H6" />
              <path d="M6 11h8.5a3.5 3.5 0 0 1 0 7H6" />
              <circle cx="17.5" cy="17.5" r="1.6" fill="var(--b-accent)" stroke="none" />
            </svg>
          </motion.div>
          <span className="font-display text-base font-bold tracking-tight">
            Buildora
          </span>
          <span className="hidden rounded-full border border-[color:var(--b-border)] bg-[color:var(--b-surface)] px-2 py-0.5 font-mono text-[10px] text-[color:var(--b-muted)] sm:inline">
            v0.1
          </span>
        </Link>

        {/* Desktop nav */}
        <nav
          className="ml-4 hidden items-center gap-0.5 lg:flex"
          aria-label="Primary"
        >
          {links.map((l) => (
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
                  transition={{
                    type: "spring",
                    bounce: 0.15,
                    duration: 0.5,
                  }}
                />
              )}
            </Link>
          ))}
        </nav>

        {/* Right controls */}
        <div className="flex items-center gap-2">
          <ThemeCustomizer />
          
          <button
            onClick={() => setCmdOpen(true)}
            className="hidden items-center gap-2 rounded-full border border-[color:var(--b-border)] bg-[color-mix(in_oklab,var(--b-surface)_80%,transparent)] px-3 py-1 font-mono text-[11px] text-[color:var(--b-text-secondary)] transition-all hover:border-[color:var(--b-border-hover)] hover:text-[color:var(--b-text)] hover:bg-[color:var(--b-elevated)] md:flex"
            aria-label="Open command palette"
          >
            <svg className="h-3 w-3 text-[color:var(--b-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span>Search</span>
            <kbd className="rounded border border-[color:var(--b-border)] bg-[color:var(--b-bg)] px-1 py-0.2 text-[9px] text-[color:var(--b-muted)]">⌘K</kbd>
          </button>

          {/* Framework selector */}
          <div className="relative">
            <button
              ref={triggerRef}
              onClick={() => setOpen((o) => !o)}
              aria-haspopup="listbox"
              aria-expanded={open}
              onKeyDown={(e) => {
                if (e.key === "ArrowDown" || e.key === "ArrowUp") {
                  e.preventDefault();
                  setOpen(true);
                  requestAnimationFrame(() => focusFrameworkOption(frameworks.indexOf(framework)));
                } else if (e.key === "Escape" && open) {
                  setOpen(false);
                }
              }}
              className="flex items-center gap-2 rounded-md border border-[color:var(--b-border)] bg-[color:var(--b-surface)] px-3 py-1.5 font-mono text-[11px] text-[color:var(--b-text-secondary)] transition-colors hover:border-[color:var(--b-border-hover)] hover:bg-[color:var(--b-elevated)]"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--b-accent)]" />
              {frameworkLabels[framework]}
              <svg
                className="h-3 w-3 text-[color:var(--b-muted)]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
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
                    initial={{ opacity: 0, y: -6, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.97 }}
                    transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
                    role="listbox"
                    aria-label="Framework"
                    className="absolute right-0 z-50 mt-2 max-h-72 w-44 overflow-auto rounded-lg border border-[color:var(--b-border)] bg-[color-mix(in_oklab,var(--b-panel)_95%,transparent)] p-1 shadow-card backdrop-blur-xl"
                  >
                    {frameworks.map((f, i) => (
                      <li key={f}>
                        <button
                          ref={(el) => {
                            optionRefs.current[i] = el;
                          }}
                          role="option"
                          aria-selected={f === framework}
                          onClick={() => {
                            setFramework(f);
                            setOpen(false);
                            triggerRef.current?.focus();
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "ArrowDown") {
                              e.preventDefault();
                              focusFrameworkOption(i + 1);
                            } else if (e.key === "ArrowUp") {
                              e.preventDefault();
                              focusFrameworkOption(i - 1);
                            } else if (e.key === "Home") {
                              e.preventDefault();
                              focusFrameworkOption(0);
                            } else if (e.key === "End") {
                              e.preventDefault();
                              focusFrameworkOption(frameworks.length - 1);
                            } else if (e.key === "Escape") {
                              setOpen(false);
                              triggerRef.current?.focus();
                            }
                          }}
                          className={cn(
                            "flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-left font-mono text-[11px] transition-colors",
                            f === framework
                              ? "bg-accent-wash text-[color:var(--b-accent)]"
                              : "text-[color:var(--b-text-secondary)] hover:bg-[color:var(--b-surface)] hover:text-[color:var(--b-text)]"
                          )}
                        >
                          <span
                            className={cn(
                              "h-1.5 w-1.5 rounded-full",
                              f === framework
                                ? "bg-[color:var(--b-accent)]"
                                : "bg-[color:var(--b-border-hover)]"
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

          {/* GitHub */}
          <a
            href="https://github.com/Varun9490/Buildora"
            target="_blank"
            rel="noreferrer"
            className="hidden items-center gap-2 rounded-md border border-[color:var(--b-border)] px-3 py-1.5 font-mono text-[11px] text-[color:var(--b-text-secondary)] transition-colors hover:bg-[color:var(--b-surface)] sm:flex"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.2 11.38.6.11.82-.26.82-.58v-2.03c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.08-.74.08-.73.08-.73 1.2.08 1.84 1.23 1.84 1.23 1.07 1.84 2.8 1.31 3.49 1 .1-.78.42-1.31.76-1.61-2.66-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.13-.3-.54-1.52.12-3.18 0 0 1-.32 3.3 1.23a11.5 11.5 0 016.02 0c2.28-1.55 3.29-1.23 3.29-1.23.66 1.66.25 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.63-5.48 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.22.7.82.58A12.01 12.01 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
            GitHub
          </a>

          {/* Install CTA */}
          <Link
            href="/registry"
            className="hidden items-center gap-2 rounded-md bg-[color:var(--b-accent)] px-4 py-1.5 font-mono text-[11px] font-bold text-[color:var(--b-accent-foreground)] transition-transform active:scale-[0.97] sm:inline-flex"
          >
            Install
          </Link>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen((o) => !o)}
            className="flex h-8 w-8 items-center justify-center rounded-md border border-[color:var(--b-border)] text-[color:var(--b-text-secondary)] transition-colors hover:bg-[color:var(--b-surface)] lg:hidden"
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 18 18"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
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
            className="border-t border-[color:var(--b-border)] bg-[color-mix(in_oklab,var(--b-bg)_95%,transparent)] backdrop-blur-xl lg:hidden"
          >
            <nav className="space-y-0.5 px-4 py-3" aria-label="Primary mobile">
              {links.map((l) => (
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
                <a
                  href="https://github.com/Varun9490/Buildora"
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 rounded-md border border-[color:var(--b-border)] py-2 text-center text-sm text-[color:var(--b-text-secondary)]"
                >
                  GitHub
                </a>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Command Palette Modal */}
      <AnimatePresence>
        {cmdOpen && (
          <div className="fixed inset-0 z-[100] flex items-start justify-center pt-24 px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setCmdOpen(false)}
              className="fixed inset-0 bg-black/70 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -12 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="relative z-10 w-full max-w-lg overflow-hidden rounded-2xl border border-[color:var(--b-border)] bg-[color:var(--b-panel)] shadow-2xl"
            >
              <CommandPalette
                onSelect={(id) => {
                  setCmdOpen(false);
                  if (id === "c1") router.push("/components/magnetic-button");
                  else if (id === "c2") router.push("/playground");
                  else if (id === "c3") router.push("/registry");
                  else if (id === "c4") {
                    const current = document.documentElement.getAttribute("data-theme");
                    const next = current === "dark" ? "light" : "dark";
                    document.documentElement.setAttribute("data-theme", next);
                    document.documentElement.classList.toggle("dark", next === "dark");
                  }
                }}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

/* ─────────────────────────────────────────────────────
   FOOTER — Clean editorial structure
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
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M6 4v16" />
                  <path d="M6 4h7.5a3.5 3.5 0 0 1 0 7H6" />
                  <path d="M6 11h8.5a3.5 3.5 0 0 1 0 7H6" />
                  <circle cx="17.5" cy="17.5" r="1.6" fill="var(--b-accent)" stroke="none" />
                </svg>
              </span>
              <p className="font-display text-base font-bold tracking-tight">
                Buildora
              </p>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-[color:var(--b-muted)]">
              One system. Any product. Universal, theme-aware components. MIT-licensed,
              GitHub-hosted.
            </p>
            <div className="mt-4 b-code-block text-[11px]">
              <span className="text-[color:var(--b-muted)]">$</span>{" "}
              <code className="text-[color:var(--b-accent)]">
                pnpm dlx shadcn@latest add @buildora/{"{component}"}
              </code>
              <p className="mt-2 font-mono text-[10px] text-[color:var(--b-muted)]">
                Example: @buildora/magnetic-button — see /registry for all 147.
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
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[color:var(--b-text-secondary)] transition-colors hover:text-[color:var(--b-accent)]"
                  >
                    {link.label}
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
              {[
                { label: "Docs", href: "/docs" },
                {
                  label: "GitHub",
                  href: "https://github.com/Varun9490/Buildora",
                  external: true,
                },
              ].map((link) => (
                <li key={link.href}>
                  {"external" in link && link.external ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm text-[color:var(--b-text-secondary)] transition-colors hover:text-[color:var(--b-accent)]"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      href={link.href}
                      className="text-sm text-[color:var(--b-text-secondary)] transition-colors hover:text-[color:var(--b-accent)]"
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          {/* Principles */}
          <div>
            <p className="font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-[color:var(--b-muted)]">
              Principles
            </p>
            <ul className="mt-4 space-y-3">
              {[
                { text: "Usefulness before novelty" },
                { text: "Accessibility is non-negotiable" },
                { text: "Idiomatic per framework" },
                { text: "Never fake support" },
              ].map((item) => (
                <li
                  key={item.text}
                  className="flex items-start gap-2.5 text-sm text-[color:var(--b-text-secondary)]"
                >
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[color:var(--b-accent)]" />
                  {item.text}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-[color:var(--b-border)] py-6">
        <p className="text-center font-mono text-[11px] text-[color:var(--b-muted)]">
          Built with craft by{" "}
          <span className="text-[color:var(--b-text-secondary)]">Buildora</span> · MIT
          License · {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
}
