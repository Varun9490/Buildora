"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { copyToClipboard } from "@buildora/utils";
import { allComponents, totalComponents } from "@/lib/registry";

export default function RegistryPage() {
  const [copied, setCopied] = React.useState<string | null>(null);
  const [filter, setFilter] = React.useState("");

  const snippet = `{
  "registries": {
    "@buildora": "https://buildora.dev/r/{name}.json"
  }
}`;

  const copy = async (text: string, key: string) => {
    await copyToClipboard(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 1400);
  };

  const filtered = allComponents.filter(
    (c) => !filter || c.slug.includes(filter.toLowerCase()) || c.name.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="font-display text-3xl font-black md:text-4xl">
          Registry <span className="text-[--b-muted]">({totalComponents})</span>
        </h1>
        <p className="mt-2 max-w-lg text-sm text-[--b-text-secondary]">
          shadcn-compatible. Served as JSON from <code className="font-mono text-[--b-accent]">/r/{"{component}"}.json</code>{" "}
          on this domain, canonical{" "}
          <code className="font-mono text-[--b-accent]">https://buildora.dev/r/{"{component}"}.json</code>.
        </p>
      </motion.div>

      {/* Install block */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mt-6 rounded-2xl border border-[--b-border] bg-[--b-panel] p-5"
      >
        <p className="b-section-label mb-2">install any component</p>
        <div className="b-code-block flex items-center gap-3">
          <span className="text-[--b-muted]">$</span>
          <code className="flex-1 truncate text-[--b-accent]">pnpm dlx shadcn@latest add @buildora/magnetic-button</code>
          <button
            onClick={() => copy("pnpm dlx shadcn@latest add @buildora/magnetic-button", "install")}
            className="shrink-0 rounded-lg bg-[--b-accent] px-3 py-1.5 text-[11px] font-bold text-[--b-accent-foreground] transition-transform active:scale-[0.98]"
          >
            {copied === "install" ? "Copied ✓" : "Copy"}
          </button>
        </div>
        <a
          href="/r/magnetic-button.json"
          className="mt-3 inline-block rounded-lg border border-[--b-border] px-3 py-1.5 font-mono text-xs text-[--b-text-secondary] transition-colors hover:bg-[--b-surface]"
        >
          /r/magnetic-button.json ↗
        </a>
      </motion.div>

      {/* shadcn config */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="mt-4 rounded-2xl border border-[--b-border] bg-[--b-panel] p-5"
      >
        <div className="flex items-center justify-between">
          <p className="b-section-label">shadcn registries config</p>
          <button
            onClick={() => copy(snippet, "config")}
            className="rounded-lg bg-[--b-surface] px-3 py-1 text-[11px] font-bold text-[--b-text-secondary] transition-colors hover:bg-[--b-elevated]"
          >
            {copied === "config" ? "Copied ✓" : "Copy config"}
          </button>
        </div>
        <pre className="scroll-sleek mt-2 overflow-x-auto rounded-xl bg-[--b-surface] p-4 font-mono text-xs text-[--b-text]">{snippet}</pre>
      </motion.div>

      {/* Component list */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-6"
      >
        <div className="mb-3 flex items-center gap-3">
          <p className="b-section-label">all packages ({filtered.length})</p>
          <input
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Filter…"
            aria-label="Filter packages"
            className="ml-auto w-48 rounded-lg border border-[--b-border] bg-[--b-panel] px-3 py-1.5 font-mono text-xs outline-none transition-colors focus:border-[--b-accent] placeholder:text-[--b-muted]"
          />
        </div>
        <ul className="grid gap-2 sm:grid-cols-2">
          {filtered.map((c, i) => (
            <motion.li
              key={c.slug}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: Math.min(i * 0.02, 0.3) }}
              className="flex items-center justify-between rounded-xl border border-[--b-border] bg-[--b-panel] px-4 py-2.5 transition-colors hover:border-[--b-border-hover] hover:bg-[--b-surface]"
            >
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[--b-success]" />
                <span className="font-mono text-xs text-[--b-text]">@buildora/{c.slug}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => copy(`pnpm dlx shadcn@latest add @buildora/${c.slug}`, c.slug)}
                  className="rounded-md bg-[--b-surface] px-2 py-0.5 font-mono text-[10px] text-[--b-muted] transition-colors hover:bg-[--b-elevated] hover:text-[--b-text-secondary]"
                >
                  {copied === c.slug ? "Copied" : "Copy"}
                </button>
                <a href={`/r/${c.slug}.json`} className="font-mono text-[11px] text-[--b-accent] hover:underline">.json</a>
              </div>
            </motion.li>
          ))}
        </ul>
      </motion.div>
    </div>
  );
}
