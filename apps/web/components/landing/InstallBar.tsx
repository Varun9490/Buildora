"use client";

import * as React from "react";
import { motion } from "motion/react";
import { cn } from "@buildora/utils";
import { PACKAGE_MANAGERS, installCommand, type PackageManager } from "@/lib/design";
import { CopyButton } from "./CodeBlock";

/* ─────────────────────────────────────────────────────
   INSTALL BAR — real commands per package manager,
   one-click copy, zero ambiguity about what installs.
   ───────────────────────────────────────────────────── */

export function InstallBar({
  slug = "magnetic-button",
  className,
}: {
  slug?: string;
  className?: string;
}) {
  const [manager, setManager] = React.useState<PackageManager>("pnpm");
  const command = installCommand(manager, slug);

  return (
    <div
      className={cn(
        "flex w-full max-w-xl flex-col overflow-hidden rounded-2xl border border-[color:var(--b-border)] bg-[color:color-mix(in_oklab,var(--b-panel)_88%,transparent)] backdrop-blur-xl sm:flex-row sm:items-center",
        className
      )}
    >
      <div className="flex items-center gap-0.5 border-b border-[color:var(--b-border)] p-1.5 sm:border-b-0 sm:border-r" role="tablist" aria-label="Package manager">
        {PACKAGE_MANAGERS.map((m) => (
          <button
            key={m}
            role="tab"
            aria-selected={manager === m}
            onClick={() => setManager(m)}
            className={cn(
              "relative rounded-lg px-2.5 py-1.5 font-mono text-[10px] transition-colors",
              manager === m
                ? "text-[color:var(--b-accent-foreground)]"
                : "text-[color:var(--b-muted)] hover:text-[color:var(--b-text-secondary)]"
            )}
          >
            {manager === m && (
              <motion.span
                layoutId="install-bar-pill"
                className="absolute inset-0 rounded-lg bg-[color:var(--b-accent)]"
                transition={{ type: "spring", stiffness: 480, damping: 34 }}
              />
            )}
            <span className="relative z-10">{m}</span>
          </button>
        ))}
      </div>

      <div className="flex min-w-0 flex-1 items-center justify-between gap-3 pl-4 pr-2 py-2.5 sm:py-1.5">
        <code className="truncate font-mono text-[11.5px] text-[color:var(--b-text-secondary)]">
          <span className="mr-2 select-none text-[color:var(--b-accent)]">$</span>
          {command}
        </code>
        <CopyButton text={command} label="Copy" copiedLabel="Copied" tone="accent" className="shrink-0" />
      </div>
    </div>
  );
}
