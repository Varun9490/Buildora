"use client";

import * as React from "react";
import { cn } from "@buildora/utils";
import { useReducedMotion } from "@buildora/hooks";

export type BlueprintLoaderProps = React.HTMLAttributes<HTMLDivElement> & {
  /** 0..1; omit for indeterminate. */
  progress?: number;
  label?: string;
  rows?: number;
  width?: number;
};

const BP_CSS = `
.bk-bp-grid{
  background-image:
    linear-gradient(color-mix(in oklab, var(--b-accent) 9%, transparent) 1px, transparent 1px),
    linear-gradient(90deg, color-mix(in oklab, var(--b-accent) 9%, transparent) 1px, transparent 1px);
  background-size: 18px 18px;
}
@keyframes bk-bp-draw{from{stroke-dashoffset:var(--bk-bp-len,900)}to{stroke-dashoffset:0}}
@keyframes bk-bp-scan{from{transform:translateY(0)}to{transform:translateY(var(--bk-bp-h,120px))}}
@keyframes bk-bp-pulse{0%,100%{opacity:.5}50%{opacity:1}}
`;

/**
 * BlueprintLoader — a drafting-sheet placeholder that draws its dashed
 * frame while rows ghost in behind a scanning beam. aria-busy. Progress
 * mode wraps the frame in a filling outline; indeterminate scans forever.
 */
export function BlueprintLoader({
  progress,
  label,
  rows = 4,
  width = 300,
  className,
  ...rest
}: BlueprintLoaderProps) {
  const reduced = useReducedMotion();
  const h = rows * 34 + 26;
  const per = progress != null ? Math.max(0, Math.min(1, progress)) : null;
  const id = React.useId();

  return (
    <div
      role="status"
      aria-busy="true"
      aria-label={label ?? "Loading content"}
      className={cn("relative overflow-hidden rounded-xl border border-[color:var(--b-border)] bg-[color:var(--b-surface)]", className)}
      style={{ width, height: h }}
      {...rest}
    >
      <style>{BP_CSS}</style>
      <div className="bk-bp-grid absolute inset-0" aria-hidden="true" />

      {/* dashed frame that draws itself */}
      <svg
        aria-hidden="true"
        className="absolute inset-0"
        width={width}
        height={h}
        style={{ "--bk-bp-len": String((width + h) * 2) } as React.CSSProperties}
      >
        <rect
          x="6"
          y="6"
          width={width - 12}
          height={h - 12}
          rx="8"
          fill="none"
          stroke="color-mix(in oklab, var(--b-accent) 55%, transparent)"
          strokeWidth="1.6"
          strokeDasharray="7 5"
          style={{
            strokeDashoffset: 0,
            animation: reduced ? undefined : `bk-bp-draw ${1.6}s cubic-bezier(.22,1,.36,1) both`,
          }}
        />
        {per != null && (
          <rect
            x="6"
            y={h - 12}
            width={(width - 12) * per}
            height="6"
            rx="3"
            fill="color-mix(in oklab, var(--b-accent) 55%, transparent)"
          />
        )}
      </svg>

      {/* ghost rows */}
      <div className="absolute inset-x-3.5 top-4 flex flex-col gap-[17px]" aria-hidden="true">
        {Array.from({ length: rows }, (_, i) => (
          <div
            key={i}
            className="h-2 rounded-sm bg-[color:color-mix(in_oklab,var(--b-text)_12%,transparent)]"
            style={{
              width: `${88 - (i % 3) * 22}%`,
              opacity: 0.6 - i * 0.08,
            }}
          />
        ))}
      </div>

      {/* scanning beam */}
      {per == null && !reduced && (
        <div
          className="absolute inset-x-0 top-0 h-9"
          style={{
            animation: `bk-bp-scan ${2.2}s cubic-bezier(.4,0,.6,1) infinite alternate`,
            "--bk-bp-h": `${h - 36}px`,
            background: "linear-gradient(to bottom, transparent, color-mix(in oklab, var(--b-accent) 14%, transparent))",
          } as React.CSSProperties}
          aria-hidden="true"
        />
      )}

      {label && (
        <span className="absolute bottom-1.5 right-2.5 font-mono text-[10px] uppercase tracking-widest text-[color:var(--b-accent)]" style={{ animation: reduced ? undefined : `bk-bp-pulse ${2}s ease-in-out infinite` }}>
          {per != null ? `${Math.round(per * 100)}%` : "drafting"}
        </span>
      )}
    </div>
  );
}

export default BlueprintLoader;
