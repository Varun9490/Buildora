"use client";

import * as React from "react";

import { copyToClipboard } from "@buildora/utils";
import { SITE } from "@/lib/site";

type PackageManager = "pnpm" | "npm" | "yarn" | "bun";

const getCommand = (pm: PackageManager, method: "zero" | "namespace", slug: string, base: string) => {
  const isNamespace = method === "namespace";
  const target = isNamespace ? `@buildora/${slug}` : `${base}/r/${slug}.json`;
  switch (pm) {
    case "pnpm":
      return `pnpm dlx shadcn@latest add ${target}`;
    case "npm":
      return `npx shadcn@latest add ${target}`;
    case "yarn":
      return `npx shadcn@latest add ${target}`;
    case "bun":
      return `bunx --bun shadcn@latest add ${target}`;
  }
};

export function InstallCommand({ slug }: { slug: string }) {
  const [method, setMethod] = React.useState<"zero" | "namespace">("zero");
  const [pm, setPm] = React.useState<PackageManager>("pnpm");
  const [copied, setCopied] = React.useState(false);
  
  React.useEffect(() => {
    const savedPm = localStorage.getItem("b-pm") as PackageManager;
    if (savedPm && ["pnpm", "npm", "yarn", "bun"].includes(savedPm)) setPm(savedPm);
  }, []);

  const changePm = (newPm: PackageManager) => {
    setPm(newPm);
    localStorage.setItem("b-pm", newPm);
  };

  const copy = async () => {
    await copyToClipboard(getCommand(pm, method, slug, SITE.url));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-xl border border-[color:var(--b-border)] bg-[color:var(--b-panel)] overflow-hidden">
      <div className="flex border-b border-[color:var(--b-border)] text-xs">
        <button
          onClick={() => setMethod("zero")}
          className={`flex-1 py-2.5 font-medium transition-colors ${method === "zero" ? "bg-[color:var(--b-surface)] text-[color:var(--b-text)]" : "text-[color:var(--b-text-secondary)] hover:bg-[color-mix(in_oklab,var(--b-surface)_50%,transparent)]"}`}
        >
          Zero-config
        </button>
        <button
          onClick={() => setMethod("namespace")}
          className={`flex-1 py-2.5 font-medium transition-colors ${method === "namespace" ? "bg-[color:var(--b-surface)] text-[color:var(--b-text)]" : "text-[color:var(--b-text-secondary)] hover:bg-[color-mix(in_oklab,var(--b-surface)_50%,transparent)]"}`}
        >
          Namespaced
        </button>
      </div>

      <div className="p-4">
        {method === "namespace" && (
          <div className="mb-4 rounded-lg bg-[color:var(--b-surface)] p-3 text-xs text-[color:var(--b-text-secondary)]">
            <p className="font-semibold text-[color:var(--b-text)]">Requires components.json setup</p>
            <p className="mt-1">Add this to your <code className="text-[color:var(--b-accent)]">components.json</code> registries array:</p>
            <pre className="mt-2 overflow-x-auto rounded bg-black/10 p-2 font-mono text-[10px]">
              {`"registries": { "@buildora": "${SITE.url}/r/{name}.json" }`}
            </pre>
          </div>
        )}

        <div className="flex items-center justify-between mb-2">
          <div className="flex gap-2 text-[11px] font-mono">
            {(["pnpm", "npm", "yarn", "bun"] as PackageManager[]).map((p) => (
              <button
                key={p}
                onClick={() => changePm(p)}
                className={`transition-colors ${pm === p ? "text-[color:var(--b-accent)] font-bold" : "text-[color:var(--b-muted)] hover:text-[color:var(--b-text-secondary)]"}`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
        
        <div className="flex items-center gap-3 rounded-lg bg-[color:var(--b-surface)] p-3">
          <span className="text-[color:var(--b-muted)] shrink-0">$</span>
          <code className="flex-1 overflow-x-auto whitespace-nowrap font-mono text-xs text-[color:var(--b-text)] scroll-sleek">
            {getCommand(pm, method, slug, SITE.url)}
          </code>
          <button
            onClick={copy}
            className="shrink-0 rounded-md bg-[color:var(--b-accent)] px-2.5 py-1 text-[11px] font-bold text-[color:var(--b-accent-foreground)] transition-transform active:scale-95"
          >
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
      </div>
    </div>
  );
}
