"use client";

import * as React from "react";
import { cn } from "@buildora/utils";

export type DocVersion = { id: string; label: string; at: string; author: string; current?: boolean };

export function VersionHistory({
  versions,
  onRestore,
  className,
}: {
  versions?: DocVersion[];
  onRestore?: (id: string) => void;
  className?: string;
}) {
  const [items, setItems] = React.useState<DocVersion[]>(
    versions ?? [
      { id: "v3", label: "Tighten motion + copy", at: "today", author: "you", current: true },
      { id: "v2", label: "Add pattern notices", at: "yesterday", author: "ada" },
      { id: "v1", label: "Initial draft", at: "2d ago", author: "you" },
    ]
  );
  return (
    <ul className={cn("space-y-1.5", className)} aria-label="Version history">
      {items.map((v) => (
        <li
          key={v.id}
          className={cn(
            "flex items-center gap-3 rounded-xl border px-3 py-2 text-sm",
            v.current ? "border-[color-mix(in_oklab,var(--b-accent)_40%,transparent)] bg-var(--b-accent)/[0.05]" : "border-[color-mix(in_oklab,var(--b-border)_10%,transparent)] bg-[color-mix(in_oklab,var(--b-text)_2%,transparent)]"
          )}
        >
          <span className="font-mono text-xs text-[color-mix(in_oklab,var(--b-text)_40%,transparent)]">{v.id}</span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[color-mix(in_oklab,var(--b-text)_85%,transparent)]">{v.label}</span>
            <span className="font-mono text-[11px] text-[color-mix(in_oklab,var(--b-text)_40%,transparent)]">{v.at} · {v.author}</span>
          </span>
          {v.current ? (
            <span className="rounded bg-[color-mix(in_oklab,var(--b-accent)_20%,transparent)] px-2 py-0.5 font-mono text-[11px] text-[color:var(--b-accent)]">current</span>
          ) : (
            <button
              onClick={() => {
                setItems((xs) => xs.map((x) => ({ ...x, current: x.id === v.id })));
                onRestore?.(v.id);
              }}
              className="rounded-lg border border-[color-mix(in_oklab,var(--b-border)_10%,transparent)] px-2.5 py-1 font-mono text-[11px] text-[color-mix(in_oklab,var(--b-text)_70%,transparent)] hover:bg-[color-mix(in_oklab,var(--b-text)_5%,transparent)]"
            >
              Restore
            </button>
          )}
        </li>
      ))}
    </ul>
  );
}

export default VersionHistory;
