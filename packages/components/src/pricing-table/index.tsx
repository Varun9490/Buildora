"use client";

import * as React from "react";
import { cn } from "@buildora/utils";

export function PricingTable({ className }: { className?: string }) {
  const [yearly, setYearly] = React.useState(true);
  const tiers = [
    { name: "Open Source", price: "$0", blurb: "Everything in this repo.", cta: "View GitHub", featured: false },
    { name: "Team", price: yearly ? "$12" : "$15", blurb: "Hosted registry + reviews.", cta: "Start trial", featured: true },
    { name: "Enterprise", price: "Custom", blurb: "SSO, audit, private registry.", cta: "Contact", featured: false }
  ];
  return (
    <div className={cn(className)}>
      <div className="mb-4 flex items-center justify-center gap-2 text-sm">
        <span className={cn(!yearly && "text-white", "text-white/50")}>Monthly</span>
        <button role="switch" aria-checked={yearly} onClick={() => setYearly((y) => !y)} className={cn("relative h-6 w-11 rounded-full transition-colors", yearly ? "bg-[#d4ff4f]" : "bg-white/15")} aria-label="Toggle yearly billing">
          <span className={cn("absolute top-0.5 h-5 w-5 rounded-full bg-black transition-all", yearly ? "left-[22px]" : "left-0.5 bg-white")} />
        </button>
        <span className={cn(yearly && "text-white", "text-white/50")}>Yearly</span>
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        {tiers.map((t) => (
          <div key={t.name} className={cn("rounded-2xl border p-5", t.featured ? "border-[#d4ff4f]/50 bg-[#d4ff4f]/[0.06] shadow-glow" : "border-white/10 bg-white/[0.03]")}>
            <p className="text-sm font-bold">{t.name}</p>
            <p className="mt-1 font-display text-3xl font-black">{t.price}</p>
            <p className="mt-1 text-xs text-white/55">{t.blurb}</p>
            <button className={cn("mt-4 w-full rounded-xl px-3 py-2 text-sm font-bold", t.featured ? "bg-[#d4ff4f] text-black" : "border border-white/15 text-white hover:bg-white/10")}>{t.cta}</button>
          </div>
        ))}
      </div>
      <p className="mt-2 text-center text-[11px] text-white/40">Buildora itself has no payments — this is a UI component demo.</p>
    </div>
  );
}

export function TeamSwitcher({ teams = ["buildora", "acme", "labs"], className }: { teams?: string[]; className?: string }) {
  const [t, setT] = React.useState(teams[0]);
  const [open, setOpen] = React.useState(false);
  return (
    <div className={cn("relative", className)}>
      <button onClick={() => setOpen((o) => !o)} aria-haspopup="listbox" aria-expanded={open} className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm">
        <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#9d8cff] text-xs font-black text-black">{t[0]?.toUpperCase()}</span>
        <span className="font-semibold">{t}</span><span aria-hidden className="text-white/40">▾</span>
      </button>
      {open && (
        <ul role="listbox" aria-label="Teams" className="absolute z-20 mt-1 w-48 rounded-xl border border-white/10 bg-[#12141d] p-1 shadow-card">
          {teams.map((x) => (
            <li key={x}><button role="option" aria-selected={x === t} onClick={() => { setT(x); setOpen(false); }} className={cn("w-full rounded-lg px-2 py-1.5 text-left text-sm hover:bg-white/5", x === t && "bg-white/10")}>{x}</button></li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function OnboardingChecklist({ className }: { className?: string }) {
  const steps = ["Install a component", "Open the playground", "Copy framework code", "Ship to production"];
  const [done, setDone] = React.useState<boolean[]>([true, true, false, false]);
  const pct = Math.round((done.filter(Boolean).length / steps.length) * 100);
  return (
    <div className={cn("rounded-2xl border border-white/10 bg-white/[0.03] p-4", className)}>
      <div className="flex justify-between text-sm"><span className="font-bold">Getting started</span><span className="font-mono text-white/60">{pct}%</span></div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label="Onboarding progress"><div className="h-full bg-[#d4ff4f]" style={{ width: `${pct}%` }} /></div>
      <ul className="mt-3 space-y-1">
        {steps.map((s, i) => (
          <li key={s}><label className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-sm hover:bg-white/5">
            <input type="checkbox" checked={done[i]} onChange={() => setDone((d) => d.map((v, j) => (j === i ? !v : v)))} className="h-4 w-4 accent-[#d4ff4f]" />
            <span className={done[i] ? "text-white/40 line-through" : ""}>{s}</span>
          </label></li>
        ))}
      </ul>
    </div>
  );
}

export function UsageDashboard({ className }: { className?: string }) {
  const bars = [34, 52, 44, 68, 59, 82, 74];
  return (
    <div className={cn("rounded-2xl border border-white/10 bg-[#0d0f16] p-4", className)}>
      <p className="text-sm font-bold">Usage</p>
      <p className="font-display text-3xl font-black">18.2k <span className="text-sm font-medium text-white/40">installs</span></p>
      <div className="mt-3 flex h-20 items-end gap-1.5" role="img" aria-label="Weekly installs trending up">
        {bars.map((b, i) => <div key={i} className="flex-1 rounded-t bg-gradient-to-t from-[#5f4de8] to-[#d4ff4f]" style={{ height: `${b}%` }} />)}
      </div>
    </div>
  );
}

export default PricingTable;
