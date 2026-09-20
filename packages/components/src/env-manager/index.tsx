"use client";

import * as React from "react";
import { cn } from "@buildora/utils";

export type EnvVar = { key: string; value: string };

export function EnvManager({
  initial = [
    { key: "DATABASE_URL", value: "postgres://localhost:5432/buildora" },
    { key: "REGISTRY_TOKEN", value: "bld_live_9f27c1" },
  ],
  className,
}: {
  initial?: EnvVar[];
  className?: string;
}) {
  const [rows, setRows] = React.useState(initial);
  const [shown, setShown] = React.useState<Set<string>>(new Set());
  const [copied, setCopied] = React.useState<string | null>(null);
  const toggle = (k: string) =>
    setShown((s) => {
      const n = new Set(s);
      if (n.has(k)) n.delete(k);
      else n.add(k);
      return n;
    });
  const mask = (v: string) => (v.length <= 4 ? "••••" : `${v.slice(0, 2)}••••${v.slice(-2)}`);
  return (
    <div className={cn("overflow-hidden rounded-2xl border border-white/10 bg-[#0d0f16]", className)}>
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-white/10 font-mono text-[11px] uppercase tracking-wider text-white/40">
            <th scope="col" className="px-4 py-2">Key</th>
            <th scope="col" className="px-4 py-2">Value</th>
            <th scope="col" className="px-4 py-2"><span className="sr-only">Actions</span></th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => {
            const vis = shown.has(r.key);
            return (
              <tr key={r.key} className="border-b border-white/5 font-mono text-xs last:border-0">
                <td className="px-4 py-2 text-[--b-iris]">{r.key}</td>
                <td className="px-4 py-2 text-white/80">{vis ? r.value : mask(r.value)}</td>
                <td className="px-4 py-2 text-right">
                  <button
                    onClick={() => toggle(r.key)}
                    aria-pressed={vis}
                    className="mr-2 rounded border border-white/10 px-2 py-0.5 text-white/60 hover:bg-white/5"
                  >
                    {vis ? "Hide" : "Reveal"}
                  </button>
                  <button
                    onClick={() => {
                      void navigator.clipboard?.writeText(r.value).catch(() => undefined);
                      setCopied(r.key);
                      setTimeout(() => setCopied(null), 1200);
                    }}
                    className="rounded border border-white/10 px-2 py-0.5 text-white/60 hover:bg-white/5"
                  >
                    {copied === r.key ? "Copied" : "Copy"}
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="flex gap-2 border-t border-white/10 p-2">
        <button
          onClick={() => setRows((rs) => [...rs, { key: `VAR_${rs.length + 1}`, value: "value" }])}
          className="rounded-lg border border-white/10 px-3 py-1 text-xs text-white/70 hover:bg-white/5"
        >
          + Add variable
        </button>
      </div>
    </div>
  );
}

export default EnvManager;
