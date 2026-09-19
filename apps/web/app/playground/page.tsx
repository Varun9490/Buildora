"use client";

import * as React from "react";
import Link from "next/link";
import { allComponents } from "@/lib/registry";
import { ComponentRenderer, type Controls } from "@/components/ComponentRenderer";
import { useBuildora } from "@/lib/store";

export default function PlaygroundPage() {
  const [slug, setSlug] = React.useState("magnetic-button");
  const [controls, setControls] = React.useState<Controls>({ strength: 0.35, radius: 120, intensity: 0.6, speed: 1, glow: true, scale: 1 });
  const { framework } = useBuildora();
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="font-display text-3xl font-black">Playground</h1>
      <p className="text-sm text-white/55">A creative laboratory. Pick a component, tune physics, inspect {framework} code.</p>
      <div className="mt-4 grid gap-4 lg:grid-cols-[280px_1fr] [&>*]:min-w-0">
        <div className="h-fit rounded-2xl border border-white/10 bg-white/[0.02] p-3 lg:sticky lg:top-20">
          <input aria-label="Filter playground components" placeholder="Filter…" className="mb-2 w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-1.5 text-sm outline-none" onChange={(e) => { const q = e.target.value.toLowerCase(); document.querySelectorAll("[data-pg]").forEach((el) => { (el as HTMLElement).style.display = (el as HTMLElement).dataset.pg!.includes(q) ? "" : "none"; }); }} />
          <ul className="b-scroll max-h-[60vh] space-y-1 overflow-auto">
            {allComponents.map((c) => (
              <li key={c.slug} data-pg={`${c.slug} ${c.name}`.toLowerCase()}>
                <button onClick={() => setSlug(c.slug)} className={`w-full rounded-lg px-2.5 py-1.5 text-left text-sm ${slug === c.slug ? "bg-[#d4ff4f] font-bold text-black" : "hover:bg-white/5 text-white/75"}`}>{c.name}</button>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="rounded-2xl border border-white/10">
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-2">
              <p className="font-mono text-xs text-white/50">{slug} · {framework}</p>
              <Link href={`/components/${slug}`} className="rounded-lg bg-white/10 px-2 py-1 text-xs hover:bg-white/15">Open component page →</Link>
            </div>
            <div className="b-grid-bg overflow-hidden bg-[#0b0d13] p-4 sm:p-8"><ComponentRenderer slug={slug} controls={controls} /></div>
          </div>
          <div className="mt-3 grid gap-2 rounded-2xl border border-white/10 p-4 sm:grid-cols-3">
            {(["strength", "radius", "intensity", "speed", "scale"] as const).map((k) => (
              <label key={k} className="text-xs text-white/60">{k} · {controls[k]}
                <input type="range" min={k === "radius" ? 40 : 0} max={k === "radius" ? 260 : k === "speed" ? 2.5 : k === "scale" ? 1.4 : 1} step={k === "radius" ? 5 : 0.05} value={controls[k] as number}
                  onChange={(e) => setControls((c) => ({ ...c, [k]: Number(e.target.value) }))} className="w-full accent-[#d4ff4f]" />
              </label>
            ))}
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={controls.glow} onChange={(e) => setControls((c) => ({ ...c, glow: e.target.checked }))} className="h-4 w-4 accent-[#d4ff4f]" /> Glow</label>
          </div>
        </div>
      </div>
    </div>
  );
}
