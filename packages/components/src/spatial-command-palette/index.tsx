"use client";

import * as React from "react";
import { cn, fuzzyScore } from "@buildora/utils";

export type PaletteItem = { id: string; title: string; hint?: string; group: string; action?: () => void; };

export function SpatialCommandPalette({ items, className }: { items?: PaletteItem[]; className?: string }) {
  const [open, setOpen] = React.useState(false);
  const [q, setQ] = React.useState("");
  const [sel, setSel] = React.useState(0);
  const [recent, setRecent] = React.useState<string[]>(["magnetic-button", "slingshot-otp"]);
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  const defaults: PaletteItem[] = items ?? [
    { id: "magnetic-button", title: "Magnetic Button", group: "Creative", hint: "Creative" },
    { id: "slingshot-otp", title: "Slingshot OTP", group: "Creative", hint: "Signature" },
    { id: "kanban", title: "Physics Kanban", group: "Complex", hint: "Drag" },
    { id: "streaming-chat", title: "Streaming Chat", group: "AI / LLM", hint: "Streaming" },
    { id: "advanced-table", title: "Advanced Table", group: "Data", hint: "Virtualized" },
    { id: "terminal", title: "Terminal", group: "Developer", hint: "xterm-lite" }
  ];

  const ranked = React.useMemo(() => {
    const scored = defaults.map((d) => ({ d, s: q ? fuzzyScore(q, `${d.title} ${d.group} ${d.id}`) : 1 }));
    return scored.filter((x) => x.s > 0).sort((a, b) => b.s - a.s).map((x) => x.d);
  }, [q, defaults]);

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") { e.preventDefault(); setOpen((o) => !o); }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  React.useEffect(() => { if (open) { setQ(""); setSel(0); setTimeout(() => inputRef.current?.focus(), 30); } }, [open ]);

  const groups = React.useMemo(() => {
    const m = new Map<string, PaletteItem[]>();
    for (const r of ranked) { if (!m.has(r.group)) m.set(r.group, []); m.get(r.group)!.push(r); }
    return [...m.entries()];
  }, [ranked]);

  const flat = ranked;
  const choose = (id: string) => {
    setRecent((r) => [id, ...r.filter((x) => x !== id)].slice(0, 4));
    setOpen(false);
    document.dispatchEvent(new CustomEvent("buildora:navigate", { detail: id }));
  };

  return (
    <>
      <button onClick={() => setOpen(true)} className={cn("inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-white/70 hover:bg-white/[0.08]", className)} aria-haspopup="dialog">
        <span>Search…</span><kbd className="rounded border border-white/15 bg-black/40 px-1 font-mono text-[10px]">⌘K</kbd>
      </button>
      {open && (
        <div className="fixed inset-0 z-[80] flex items-start justify-center bg-black/60 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label="Command palette" onClick={() => setOpen(false)}>
          <div className="mt-[10vh] w-full max-w-lg overflow-hidden rounded-2xl border border-white/10 bg-[#0d0f16] shadow-card" onClick={(e) => e.stopPropagation()} style={{ transform: "perspective(1000px) rotateX(2deg)" }}>
            <input ref={inputRef} value={q} onChange={(e) => { setQ(e.target.value); setSel(0); }}
              onKeyDown={(e) => {
                if (e.key === "ArrowDown") { e.preventDefault(); setSel((s) => Math.min(flat.length - 1, s + 1)); }
                if (e.key === "ArrowUp") { e.preventDefault(); setSel((s) => Math.max(0, s - 1)); }
                if (e.key === "Enter" && flat[sel]) choose(flat[sel].id);
              }}
              placeholder="Type a component, category, or action…" className="w-full border-b border-white/10 bg-transparent px-4 py-3 text-sm outline-none placeholder:text-white/30" aria-label="Search components" />
            <div className="max-h-72 overflow-auto p-2">
              {!q && (
                <div className="px-2 py-1 text-[11px] uppercase tracking-wider text-white/40">Recent — {recent.join(" · ")}</div>
              )}
              {groups.map(([g, list]) => (
                <div key={g}>
                  <div className="px-2 pb-1 pt-2 text-[11px] uppercase tracking-wider text-white/40">{g}</div>
                  {list.map((item) => {
                    const idx = flat.indexOf(item);
                    return (
                      <button key={item.id} onMouseEnter={() => setSel(idx)} onClick={() => choose(item.id)}
                        className={cn("flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-all", idx === sel ? "translate-x-1 bg-[#d4ff4f] text-black" : "text-white/80 hover:bg-white/5")}>
                        <span className="font-medium">{item.title}</span>
                        {item.hint && <span className={cn("text-[11px]", idx === sel ? "text-black/60" : "text-white/40")}>{item.hint}</span>}
                      </button>
                    );
                  })}
                </div>
              ))}
              {flat.length === 0 && <p className="p-4 text-sm text-white/50">No results for “{q}”.</p>}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default SpatialCommandPalette;
