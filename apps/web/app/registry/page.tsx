"use client";

import * as React from "react";
import { copyToClipboard } from "@buildora/utils";
import { allComponents, totalComponents } from "@/lib/registry";

export default function RegistryPage() {
  const [copied, setCopied] = React.useState(false);
  const snippet = `{\n  "registries": {\n    "@buildora": "https://github.com/buildora/buildora/tree/main/registry/generated/{name}.json"\n  }\n}`;
  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="font-display text-3xl font-black">Registry <span className="text-white/40">({totalComponents})</span></h1>
      <p className="mt-1 text-sm text-white/55">shadcn-compatible. GitHub-hosted — no custom domain required. Future: optionally serve <code className="font-mono text-[#d4ff4f]">https://buildora.dev/r/{"{component}"}.json</code>.</p>
      <div className="mt-4 rounded-2xl border border-white/10 bg-[#0a0c11] p-4">
        <p className="font-mono text-xs text-white/40">install any component</p>
        <code className="mt-1 block font-mono text-sm text-[#d4ff4f]">pnpm dlx shadcn@latest add @buildora/magnetic-button</code>
        <div className="mt-2 flex gap-2">
          <button onClick={async () => { await copyToClipboard("pnpm dlx shadcn@latest add @buildora/magnetic-button"); setCopied(true); setTimeout(() => setCopied(false), 1200); }} className="rounded-lg bg-[#d4ff4f] px-3 py-1.5 text-xs font-bold text-black">{copied ? "Copied" : "Copy"}</button>
          <a href="/r/magnetic-button.json" className="rounded-lg border border-white/15 px-3 py-1.5 font-mono text-xs">/r/magnetic-button.json ↗</a>
        </div>
      </div>
      <div className="mt-3 rounded-2xl border border-white/10 p-4">
        <p className="font-mono text-xs text-white/40">shadcn registries config</p>
        <pre className="mt-1 overflow-x-auto font-mono text-xs text-[#c9d1ff]">{snippet}</pre>
      </div>
      <ul className="mt-4 grid gap-2 sm:grid-cols-2">
        {allComponents.map((c) => (
          <li key={c.slug} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.02] px-3 py-2">
            <span className="font-mono text-xs">{"@buildora/"}{c.slug}</span>
            <a href={`/r/${c.slug}.json`} className="font-mono text-[11px] text-[#d4ff4f] hover:underline">.json ↗</a>
          </li>
        ))}
      </ul>
    </div>
  );
}
