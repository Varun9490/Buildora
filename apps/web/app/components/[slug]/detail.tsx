"use client";

import Link from "next/link";
import * as React from "react";
import { cn, copyToClipboard } from "@buildora/utils";
import { useBuildora } from "@/lib/store";
import { allComponents, frameworkLabels, frameworks } from "@/lib/registry";
import type { RegistryItem } from "@/lib/registry";
import { frameworkExample } from "@/lib/framework-code";
import { CodeViewer } from "@/components/CodeViewer";
import { ComponentRenderer } from "@/components/ComponentRenderer";

export function ComponentDetail({ slug }: { slug: string }) {
  const [item, setItem] = React.useState<RegistryItem | null>(null);
  const { framework, setFramework, pushRecent } = useBuildora();
  const [controls, setControls] = React.useState({ strength: 0.35, radius: 120, intensity: 0.6, speed: 1, glow: true, scale: 1 });
  const [copied, setCopied] = React.useState<string | null>(null);

  React.useEffect(() => {
    fetch(`/api/registry/${slug}`).then((r) => (r.ok ? r.json() : null)).then((j) => setItem(j)).catch(() => setItem(null));
    pushRecent(slug);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  const summary = allComponents.find((c) => c.slug === slug);
  const ex = React.useMemo(() => frameworkExample(slug, summary?.name ?? slug, framework, item), [slug, summary, framework, item]);
  const related = React.useMemo(() => {
    if (!summary) return [];
    return allComponents.filter((c) => c.slug !== slug && c.categories.some((x) => summary.categories.includes(x))).slice(0, 3);
  }, [summary, slug]);

  if (!summary) return <div className="mx-auto max-w-5xl px-4 py-16"><p>Unknown component.</p><Link href="/components" className="text-[#d4ff4f]">← All components</Link></div>;

  const copy = async (text: string, key: string) => {
    await copyToClipboard(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 1400);
  };

  const set = (k: keyof typeof controls) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.type === "checkbox" ? (e.target as HTMLInputElement).checked : Number(e.target.value);
    setControls((c) => ({ ...c, [k]: v }));
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {/* HEADER */}
      <nav className="font-mono text-xs text-white/40" aria-label="Breadcrumb"><Link href="/components" className="hover:text-white">components</Link> / {slug}</nav>
      <div className="mt-2 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-4xl font-black tracking-tight">{summary.name}</h1>
          <p className="mt-1 max-w-2xl text-white/60">{summary.description}</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {summary.categories.map((c) => <span key={c} className="rounded-full bg-[#d4ff4f]/15 px-2 py-0.5 font-mono text-[11px] text-[#d4ff4f]">{c}</span>)}
            {summary.tags.slice(0, 5).map((t) => <span key={t} className="rounded-full bg-white/5 px-2 py-0.5 font-mono text-[11px] text-white/50">{t}</span>)}
            <span className="rounded-full bg-white/5 px-2 py-0.5 font-mono text-[11px] text-white/50">{summary.difficulty}</span>
            <span className="rounded-full bg-white/5 px-2 py-0.5 font-mono text-[11px] text-white/50">v{summary.version} · MIT</span>
          </div>
        </div>
        <div className="flex gap-2">
          <a href={`https://github.com/buildora/buildora/tree/main/packages/components/src/${slug}`} target="_blank" rel="noreferrer" className="rounded-xl border border-white/15 px-3 py-1.5 text-sm hover:bg-white/10">GitHub ↗</a>
          <button onClick={() => copy(item?.install ?? `pnpm dlx shadcn@latest add @buildora/${slug}`, "install")} className="rounded-xl bg-[#d4ff4f] px-3 py-1.5 text-sm font-bold text-black">{copied === "install" ? "Copied" : "Copy install"}</button>
        </div>
      </div>

      {/* framework support strip */}
      <div className="mt-4 flex flex-wrap gap-1.5" aria-label="Framework support">
        {frameworks.map((f) => {
          const st = item?.implementations?.[f]?.status ?? (["react", "javascript", "html", "tailwind"].includes(f) ? "Full" : "Partial");
          return (
            <span key={f} title={item?.implementations?.[f]?.notes ?? st} className={cn("rounded-full border px-2 py-0.5 font-mono text-[11px]",
              st === "Full" ? "border-[#4fe08a]/40 text-[#4fe08a]" : st === "Partial" ? "border-[#ffb86b]/40 text-[#ffb86b]" : st === "Experimental" ? "border-[#9d8cff]/40 text-[#9d8cff]" : "border-white/10 text-white/30")}>
              {frameworkLabels[f]} · {st}
            </span>
          );
        })}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          {/* LIVE PLAYGROUND */}
          <section className="overflow-hidden rounded-2xl border border-white/10" aria-label="Live playground">
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-2">
              <p className="font-mono text-xs text-white/50">● live playground — {frameworkLabels[framework]}</p>
              <button onClick={() => setControls({ strength: 0.35, radius: 120, intensity: 0.6, speed: 1, glow: true, scale: 1 })} className="rounded-lg border border-white/10 px-2 py-1 text-xs">Reset</button>
            </div>
            <div className="b-grid-bg bg-[#0b0d13] p-6"><ComponentRenderer slug={slug} controls={controls} /></div>
          </section>

          {/* FRAMEWORK SWITCHER + CODE */}
          <section aria-label="Code">
            <div className="mb-2 flex flex-wrap gap-1.5" role="tablist" aria-label="Framework">
              {frameworks.map((f) => (
                <button key={f} role="tab" aria-selected={f === framework} onClick={() => setFramework(f)} className={cn("rounded-lg px-2.5 py-1 font-mono text-xs", f === framework ? "bg-[#d4ff4f] text-black font-bold" : "border border-white/10 text-white/60 hover:bg-white/5")}>{frameworkLabels[f]}</button>
              ))}
            </div>
            {ex.notes && <p className="mb-2 rounded-xl border border-[#ffb86b]/30 bg-[#ffb86b]/10 px-3 py-2 text-xs text-[#ffd9a8]">Note ({frameworkLabels[framework]} · {ex.status}): {ex.notes}</p>}
            <CodeViewer files={ex.files} />
            <div className="mt-2 grid gap-2 md:grid-cols-2">
              <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3">
                <p className="font-mono text-[11px] text-white/40">installation</p>
                <code className="mt-1 block break-all font-mono text-xs text-[#d4ff4f]">{ex.install}</code>
                <button onClick={() => copy(ex.install, "i2")} className="mt-2 rounded-lg border border-white/15 px-2 py-1 text-xs">{copied === "i2" ? "Copied" : "Copy"}</button>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3">
                <p className="font-mono text-[11px] text-white/40">dependencies</p>
                <p className="mt-1 font-mono text-xs text-white/70">{ex.dependencies.length ? ex.dependencies.join(", ") : item?.dependencies?.length ? item.dependencies.join(", ") : "none"}</p>
                <p className="mt-1 text-[11px] text-white/40">Source: <a className="underline" href={`https://github.com/buildora/buildora/tree/main/packages/components/src/${slug}`} target="_blank" rel="noreferrer">GitHub ↗</a></p>
              </div>
            </div>
          </section>

          {/* DOCS */}
          <section className="grid gap-2 md:grid-cols-2">
            <DocCard title="Usage" body={`Import from @buildora/${slug}. Tune props in the playground, then copy the ${frameworkLabels[framework]} tab. Semantic behavior stays intact under the creative layer.`} />
            <DocCard title="Accessibility" body="Keyboard navigable · visible focus · screen-reader labels + live regions · prefers-reduced-motion fallback that disables pull/tilt/particles without removing function." />
            <DocCard title="Responsive behavior" body="Desktop gets full pointer physics; touch uses drag/press equivalents; small screens simplify controls (fewer knobs, larger targets). Nothing is hover-only." />
            <DocCard title="Customization" body="Tokens via CSS vars (--b-accent, --b-iris) + props (strength, radius, intensity, spring). Tree-shakeable exports; no global CSS required beyond tokens." />
          </section>
        </div>

        {/* CONTROLS RAIL */}
        <aside className="h-fit rounded-2xl border border-white/10 bg-white/[0.02] p-4 lg:sticky lg:top-20" aria-label="Interactive controls">
          <p className="font-display font-black">Interactive controls</p>
          <p className="text-xs text-white/45">A creative laboratory, not static docs.</p>
          <div className="mt-3 space-y-3 text-sm">
            <Knob label={`Magnetism · ${controls.strength}`} min={0} max={1} step={0.05} value={controls.strength} onChange={set("strength")} />
            <Knob label={`Radius · ${controls.radius}px`} min={40} max={260} step={5} value={controls.radius} onChange={set("radius")} />
            <Knob label={`Intensity · ${controls.intensity}`} min={0} max={1} step={0.05} value={controls.intensity} onChange={set("intensity")} />
            <Knob label={`Speed · ${controls.speed}×`} min={0.25} max={2.5} step={0.25} value={controls.speed} onChange={set("speed")} />
            <Knob label={`Scale · ${controls.scale}×`} min={0.8} max={1.4} step={0.05} value={controls.scale} onChange={set("scale")} />
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={controls.glow} onChange={set("glow")} className="h-4 w-4 accent-[#d4ff4f]" /> Glow</label>
          </div>
          <div className="mt-4 border-t border-white/10 pt-3 text-xs text-white/50">
            <p className="font-bold text-white/70">Actions</p>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              <button onClick={() => copy(ex.files[0]?.code ?? "", "code")} className="rounded-lg bg-white/10 px-2 py-1">{copied === "code" ? "Copied code" : "Copy code"}</button>
              <a href={`https://github.com/buildora/buildora/tree/main/packages/components/src/${slug}`} target="_blank" rel="noreferrer" className="rounded-lg border border-white/15 px-2 py-1">Open source ↗</a>
              <Link href="/docs" className="rounded-lg border border-white/15 px-2 py-1">Docs</Link>
            </div>
          </div>
          <div className="mt-3 border-t border-white/10 pt-3">
            <p className="text-xs font-bold text-white/70">Related</p>
            <ul className="mt-1 space-y-1">{related.map((r) => <li key={r.slug}><Link href={`/components/${r.slug}`} className="text-sm text-white/65 hover:text-[#d4ff4f]">{r.name}</Link></li>)}</ul>
          </div>
        </aside>
      </div>
    </div>
  );
}

function DocCard({ title, body }: { title: string; body: string }) {
  return <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4"><h2 className="font-display font-black">{title}</h2><p className="mt-1 text-sm text-white/60">{body}</p></div>;
}

function Knob({ label, ...rest }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return <label className="block"><span className="mb-1 block text-xs text-white/55">{label}</span><input type="range" {...rest} className="w-full accent-[#d4ff4f]" /></label>;
}
