"use client";

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { useRouter } from "next/navigation";
import { cn, copyToClipboard, fuzzyScore } from "@buildora/utils";
import { useBuildora } from "@/lib/store";
import { ACCENTS, SURFACES, PACKAGE_MANAGERS, installCommand, type PackageManager } from "@/lib/design";
import { allComponents } from "@/lib/registry";

type Item = {
  id: string;
  group: string;
  label: string;
  hint?: string;
  keywords: string;
  swatch?: string;
  run: () => void;
};

const SECTION_LINKS = [
  { id: "showcase", label: "Tactile Showcase", href: "#showcase" },
  { id: "explorer", label: "Component Explorer", href: "#explorer" },
  { id: "physics-lab", label: "Physics Lab", href: "#physics-lab" },
  { id: "portability", label: "Portability Studio", href: "#portability" },
  { id: "principles", label: "Craft Principles", href: "#principles" },
];

export function CommandMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();
  const { themeAccent, setThemeAccent, surface, setSurface, motionOverride, setMotionOverride } = useBuildora();
  const [query, setQuery] = React.useState("");
  const [active, setActive] = React.useState(0);
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const listRef = React.useRef<HTMLDivElement | null>(null);

  const goSection = (href: string) => {
    onClose();
    if (typeof window === "undefined") return;
    if (window.location.pathname !== "/") {
      router.push(`/${href}`);
      return;
    }
    const el = document.getElementById(href.replace("#", ""));
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const items = React.useMemo<Item[]>(() => {
    const base: Item[] = [];

    // Actions — theme engine
    for (const a of ACCENTS) {
      base.push({
        id: `accent-${a.id}`,
        group: "Token Engine",
        label: `Accent — ${a.label}`,
        hint: themeAccent === a.id ? "active" : "apply",
        keywords: `accent theme color ${a.label} ${a.id}`,
        swatch: a.hex,
        run: () => setThemeAccent(a.id),
      });
    }
    for (const s of SURFACES) {
      base.push({
        id: `surface-${s.id}`,
        group: "Token Engine",
        label: `Surface — ${s.label}`,
        hint: surface === s.id ? "active" : s.detail,
        keywords: `surface theme mode ${s.label} ${s.id}`,
        swatch: s.swatch,
        run: () => setSurface(s.id),
      });
    }
    base.push({
      id: "motion-toggle",
      group: "Token Engine",
      label: motionOverride === "reduced" ? "Motion — restore full physics" : "Motion — reduce animations",
      keywords: "motion reduced animation accessibility",
      run: () => setMotionOverride(motionOverride === "reduced" ? "auto" : "reduced"),
    });
    base.push({
      id: "copy-cli",
      group: "Token Engine",
      label: "Copy install CLI — @buildora/magnetic-button",
      hint: "⌘C",
      keywords: "install cli copy command shadcn pnpm",
      run: () => {
        void copyToClipboard(installCommand("pnpm", "magnetic-button"));
      },
    });

    // Navigation
    for (const l of SECTION_LINKS) {
      base.push({
        id: `nav-${l.id}`,
        group: "Navigate",
        label: l.label,
        hint: "section",
        keywords: `go scroll ${l.label}`,
        run: () => goSection(l.href),
      });
    }
    const pages = [
      { label: "All Components", href: "/components" },
      { label: "Templates", href: "/templates" },
      { label: "Docs", href: "/docs" },
      { label: "Registry", href: "/registry" },
      { label: "Playground", href: "/playground" },
    ];
    for (const p of pages) {
      base.push({
        id: `page-${p.href}`,
        group: "Navigate",
        label: p.label,
        hint: p.href,
        keywords: `open page ${p.label} ${p.href}`,
        run: () => {
          onClose();
          router.push(p.href);
        },
      });
    }
    base.push({
      id: "github",
      group: "Navigate",
      label: "Star Buildora on GitHub",
      hint: "↗",
      keywords: "github star repo source",
      run: () => {
        window.open("https://github.com/Varun9490/Buildora", "_blank", "noopener");
      },
    });

    // Components (from the registry)
    for (const c of allComponents) {
      base.push({
        id: `component-${c.slug}`,
        group: "Components",
        label: c.name,
        hint: c.categories[0] ?? "component",
        keywords: `${c.name} ${c.slug} ${c.description} ${c.tags.join(" ")}`,
        run: () => {
          onClose();
          router.push(`/components/${c.slug}`);
        },
      });
    }

    return base;
  }, [themeAccent, surface, motionOverride]); // eslint-disable-line react-hooks/exhaustive-deps

  const filtered = React.useMemo(() => {
    const q = query.trim();
    if (!q) {
      const inToken = items.filter((i) => i.group === "Token Engine");
      const inNav = items.filter((i) => i.group === "Navigate");
      const inComponents = items.filter((i) => i.group === "Components").slice(0, 8);
      return [...inToken, ...inNav, ...inComponents];
    }
    return items
      .map((i) => ({ i, s: fuzzyScore(q, i.keywords) }))
      .filter((x) => x.s > 0)
      .sort((a, b) => b.s - a.s)
      .slice(0, 16)
      .map((x) => x.i);
  }, [items, query]);

  React.useEffect(() => {
    setActive(0);
  }, [query]);

  React.useEffect(() => {
    if (open) {
      setQuery("");
      setActive(0);
      const t = setTimeout(() => inputRef.current?.focus(), 30);
      return () => clearTimeout(t);
    }
  }, [open]);

  React.useEffect(() => {
    const el = listRef.current?.querySelector<HTMLElement>(`[data-idx="${active}"]`);
    el?.scrollIntoView({ block: "nearest" });
  }, [active]);

  const runItem = (item: Item) => {
    item.run();
    if (item.group !== "Token Engine") onClose();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const item = filtered[active];
      if (item) runItem(item);
    } else if (e.key === "Escape") {
      e.preventDefault();
      onClose();
    } else if (e.key === "Tab") {
      e.preventDefault();
      inputRef.current?.focus();
    }
  };

  let lastGroup = "";

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[120] flex items-start justify-center px-4 pt-[12vh]">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-md"
            aria-hidden="true"
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
            initial={{ opacity: 0, scale: 0.97, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: -10 }}
            transition={{ type: "spring", stiffness: 420, damping: 32 }}
            className="relative z-10 w-full max-w-xl overflow-hidden rounded-2xl border border-[color:var(--b-border)] bg-[color:color-mix(in_oklab,var(--b-panel)_96%,transparent)] shadow-2xl backdrop-blur-2xl"
            onKeyDown={onKeyDown}
          >
            <div className="flex items-center gap-3 border-b border-[color:var(--b-border)] px-4 py-3">
              <svg className="h-4 w-4 shrink-0 text-[color:var(--b-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search components, actions, themes…"
                aria-label="Search commands"
                className="w-full bg-transparent font-mono text-sm text-[color:var(--b-text)] outline-none placeholder:text-[color:var(--b-muted)]"
              />
              <kbd className="rounded border border-[color:var(--b-border)] bg-[color:var(--b-surface)] px-1.5 py-0.5 font-mono text-[10px] text-[color:var(--b-muted)]">
                esc
              </kbd>
            </div>

            <div ref={listRef} className="scroll-sleek max-h-[52vh] overflow-y-auto p-2" role="listbox" aria-label="Commands">
              {filtered.length === 0 && (
                <p className="px-3 py-8 text-center font-mono text-xs text-[color:var(--b-muted)]">
                  No results for “{query}” — try “magnetic”, “theme”, or “toast”.
                </p>
              )}
              {filtered.map((item, idx) => {
                const showGroup = item.group !== lastGroup;
                lastGroup = item.group;
                const activeItem = idx === active;
                return (
                  <React.Fragment key={item.id}>
                    {showGroup && (
                      <p className="px-3 pb-1 pt-3 font-mono text-[10px] uppercase tracking-[0.14em] text-[color:var(--b-muted)]">
                        {item.group}
                      </p>
                    )}
                    <button
                      role="option"
                      aria-selected={activeItem}
                      data-idx={idx}
                      onPointerEnter={() => setActive(idx)}
                      onClick={() => runItem(item)}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm transition-colors",
                        activeItem
                          ? "bg-[color:var(--b-accent-muted)] text-[color:var(--b-text)]"
                          : "text-[color:var(--b-text-secondary)] hover:bg-[color:color-mix(in_oklab,var(--b-text)_4%,transparent)]"
                      )}
                    >
                      {item.swatch ? (
                        <span
                          className="h-4 w-4 shrink-0 rounded-full border border-[color:var(--b-border-hover)]"
                          style={{ background: item.swatch }}
                          aria-hidden="true"
                        />
                      ) : (
                        <span
                          className={cn(
                            "h-1.5 w-1.5 shrink-0 rounded-full",
                            activeItem ? "bg-[color:var(--b-accent)]" : "bg-[color:var(--b-border-hover)]"
                          )}
                          aria-hidden="true"
                        />
                      )}
                      <span className="min-w-0 flex-1 truncate">{item.label}</span>
                      {item.hint && (
                        <span className="shrink-0 font-mono text-[10px] text-[color:var(--b-muted)]">
                          {item.hint}
                        </span>
                      )}
                    </button>
                  </React.Fragment>
                );
              })}
            </div>

            <div className="flex items-center justify-between border-t border-[color:var(--b-border)] px-4 py-2 font-mono text-[10px] text-[color:var(--b-muted)]">
              <span>↑↓ navigate · ⏎ select</span>
              <span>BUILDORA COMMAND ENGINE</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

/* ─────────────────────────────────────────────────────
   CLI Registry modal — every package manager verb.
   ───────────────────────────────────────────────────── */
export function RegistryModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [manager, setManager] = React.useState<PackageManager>("pnpm");
  const [copiedSlug, setCopiedSlug] = React.useState<string | null>(null);
  const featured = ["magnetic-button", "slingshot-otp", "fx-button", "backdrop", "toast", "tabs"];

  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-md"
            aria-hidden="true"
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Install via the shadcn CLI"
            initial={{ opacity: 0, scale: 0.96, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 14 }}
            transition={{ type: "spring", stiffness: 400, damping: 32 }}
            className="relative z-10 w-full max-w-lg overflow-hidden rounded-2xl border border-[color:var(--b-border)] bg-[color:color-mix(in_oklab,var(--b-panel)_96%,transparent)] shadow-2xl backdrop-blur-2xl"
          >
            <div className="flex items-center justify-between border-b border-[color:var(--b-border)] px-5 py-4">
              <div>
                <h3 className="font-display text-base font-bold tracking-tight text-[color:var(--b-text)]">
                  Install from the registry
                </h3>
                <p className="mt-0.5 font-mono text-[11px] text-[color:var(--b-muted)]">
                  Source files land in components/buildora/ — yours to own.
                </p>
              </div>
              <button
                onClick={onClose}
                aria-label="Close install dialog"
                className="flex h-7 w-7 items-center justify-center rounded-lg border border-[color:var(--b-border)] text-[color:var(--b-muted)] transition-colors hover:text-[color:var(--b-text)]"
              >
                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round">
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </div>

            <div className="p-5">
              <div className="flex flex-wrap items-center gap-1 rounded-xl border border-[color:var(--b-border)] bg-[color:var(--b-surface)] p-1">
                {PACKAGE_MANAGERS.map((m) => (
                  <button
                    key={m}
                    onClick={() => setManager(m)}
                    aria-pressed={manager === m}
                    className={cn(
                      "rounded-lg px-3 py-1.5 font-mono text-[11px] transition-colors",
                      manager === m
                        ? "bg-[color:var(--b-panel)] font-semibold text-[color:var(--b-text)] shadow-sm"
                        : "text-[color:var(--b-muted)] hover:text-[color:var(--b-text-secondary)]"
                    )}
                  >
                    {m}
                  </button>
                ))}
              </div>

              <div className="mt-4 space-y-2">
                {featured.map((slug) => {
                  const cmd = installCommand(manager, slug);
                  return (
                    <div
                      key={slug}
                      className="group flex items-center justify-between gap-3 rounded-xl border border-[color:var(--b-border)] bg-[color:color-mix(in_oklab,var(--b-bg)_55%,transparent)] px-3 py-2"
                    >
                      <code className="min-w-0 flex-1 truncate font-mono text-[11px] text-[color:var(--b-text-secondary)]">
                        {cmd}
                      </code>
                      <button
                        onClick={async () => {
                          const ok = await copyToClipboard(cmd);
                          if (ok) {
                            setCopiedSlug(slug);
                            setTimeout(() => setCopiedSlug(null), 1300);
                          }
                        }}
                        className={cn(
                          "shrink-0 rounded-md border px-2 py-1 font-mono text-[10px] transition-colors",
                          copiedSlug === slug
                            ? "border-[color:var(--b-success)] text-[color:var(--b-success)]"
                            : "border-[color:var(--b-border)] text-[color:var(--b-muted)] hover:border-[color:var(--b-border-hover)] hover:text-[color:var(--b-text)]"
                        )}
                        aria-label={`Copy install command for ${slug}`}
                      >
                        {copiedSlug === slug ? "✓ copied" : "copy"}
                      </button>
                    </div>
                  );
                })}
              </div>

              <p className="mt-4 font-mono text-[10px] text-[color:var(--b-muted)]">
                + {allComponents.length - featured.length} more in the registry — every install is
                plain source, MIT licensed.
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
