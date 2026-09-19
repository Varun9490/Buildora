"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";
import { cn } from "@buildora/utils";
import { useBuildora } from "@/lib/store";
import { frameworkLabels, frameworks } from "@/lib/registry";
import { SpatialCommandPalette } from "@buildora/components";

const links = [
  { href: "/", label: "Home" },
  { href: "/components", label: "Components" },
  { href: "/categories", label: "Categories" },
  { href: "/playground", label: "Playground" },
  { href: "/templates", label: "Templates" },
  { href: "/docs", label: "Docs" },
  { href: "/registry", label: "Registry" }
];

export function SiteHeader() {
  const path = usePathname();
  const { framework, setFramework } = useBuildora();
  const [open, setOpen] = React.useState(false);
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#08090d]/85 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-2.5">
        <Link href="/" className="flex items-center gap-2" aria-label="Buildora home">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#d4ff4f] font-display text-lg font-black text-black">B</span>
          <span className="font-display text-lg font-black tracking-tight">BUILDORA</span>
          <span className="hidden rounded-full border border-white/15 px-2 py-0.5 font-mono text-[10px] text-white/50 sm:inline">v0.1 · OSS</span>
        </Link>
        <nav className="ml-2 hidden items-center gap-1 lg:flex" aria-label="Primary">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className={cn("rounded-lg px-2.5 py-1.5 text-sm", path === l.href ? "bg-white/10 text-white" : "text-white/60 hover:bg-white/5 hover:text-white")}>{l.label}</Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <div className="hidden md:block"><SpatialCommandPalette /></div>
          <div className="relative">
            <button onClick={() => setOpen((o) => !o)} aria-haspopup="listbox" aria-expanded={open} className="rounded-xl border border-white/10 bg-white/[0.04] px-2.5 py-1.5 font-mono text-xs text-white/80">
              {frameworkLabels[framework]}
            </button>
            {open && (
              <ul role="listbox" aria-label="Framework" className="absolute right-0 z-50 mt-1 max-h-72 w-44 overflow-auto rounded-xl border border-white/10 bg-[#12141d] p-1 shadow-card">
                {frameworks.map((f) => (
                  <li key={f}><button role="option" aria-selected={f === framework} onClick={() => { setFramework(f); setOpen(false); }} className="w-full rounded-lg px-2 py-1.5 text-left font-mono text-xs hover:bg-white/10">{frameworkLabels[f]}</button></li>
                ))}
              </ul>
            )}
          </div>
          <a href="https://github.com/buildora/buildora" target="_blank" rel="noreferrer" className="rounded-xl border border-white/10 px-2.5 py-1.5 font-mono text-xs text-white/80 hover:bg-white/10" aria-label="GitHub">GitHub ↗</a>
          <Link href="/registry" className="hidden rounded-xl bg-[#d4ff4f] px-3 py-1.5 text-xs font-bold text-black sm:inline">Install</Link>
        </div>
      </div>
      <nav className="flex gap-1 overflow-x-auto border-t border-white/5 px-4 py-1.5 lg:hidden" aria-label="Primary mobile">
        {links.map((l) => (
          <Link key={l.href} href={l.href} className={cn("whitespace-nowrap rounded-lg px-2.5 py-1 text-xs", path === l.href ? "bg-white/10 text-white" : "text-white/60")}>{l.label}</Link>
        ))}
      </nav>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-[#07080c]">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 md:grid-cols-4">
        <div>
          <p className="font-display text-lg font-black">BUILDORA</p>
          <p className="mt-1 text-sm text-white/50">Creative components for serious developers. MIT-licensed, GitHub-hosted.</p>
          <p className="mt-2 font-mono text-xs text-white/40">pnpm dlx shadcn@latest add @buildora/magnetic-button</p>
        </div>
        <nav aria-label="Components">
          <p className="text-xs font-bold uppercase tracking-wider text-white/40">Explore</p>
          <ul className="mt-2 space-y-1 text-sm text-white/70">
            <li><Link href="/components" className="hover:text-white">All components</Link></li>
            <li><Link href="/categories" className="hover:text-white">Categories</Link></li>
            <li><Link href="/playground" className="hover:text-white">Playground</Link></li>
            <li><Link href="/templates" className="hover:text-white">Templates</Link></li>
          </ul>
        </nav>
        <nav aria-label="Resources">
          <p className="text-xs font-bold uppercase tracking-wider text-white/40">Resources</p>
          <ul className="mt-2 space-y-1 text-sm text-white/70">
            <li><Link href="/docs" className="hover:text-white">Docs</Link></li>
            <li><Link href="/registry" className="hover:text-white">Registry</Link></li>
            <li><a href="https://github.com/buildora/buildora" className="hover:text-white">GitHub ↗</a></li>
          </ul>
        </nav>
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-white/40">Principles</p>
          <ul className="mt-2 space-y-1 text-sm text-white/50">
            <li>Usefulness before novelty</li>
            <li>Accessibility is non-negotiable</li>
            <li>Idiomatic per framework</li>
            <li>Never fake support</li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
