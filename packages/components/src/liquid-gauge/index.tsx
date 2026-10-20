"use client";

import * as React from "react";
import { cn } from "@buildora/utils";
import { useReducedMotion } from "@buildora/hooks";

export type LiquidGaugeProps = React.HTMLAttributes<HTMLDivElement> & {
  /** 0..100 */
  value: number;
  size?: number;
  variant?: "accent" | "success" | "warning" | "danger";
  label?: string;
  format?: (v: number) => string;
};

const WAVES = `
@keyframes bk-liquid-a{from{transform:translateX(0) translateY(var(--bk-wave-y,0))}to{transform:translateX(-50%) translateY(var(--bk-wave-y,0))}}
@keyframes bk-liquid-b{from{transform:translateX(0) translateY(var(--bk-wave-y,0))}to{transform:translateX(-50%) translateY(var(--bk-wave-y2,0))}}
`;

const TINT: Record<NonNullable<LiquidGaugeProps["variant"]>, string> = {
  accent: "var(--b-accent)",
  success: "var(--b-success)",
  warning: "var(--b-warning)",
  danger: "var(--b-danger)",
};

/**
 * LiquidGauge — an SVG meter whose fill is two out-of-phase liquid waves
 * clipped to a ring. role="meter" with valuetext. Static fill under
 * reduced motion.
 */
export function LiquidGauge({
  value,
  size = 160,
  variant = "accent",
  label = "Level",
  format,
  className,
  ...rest
}: LiquidGaugeProps) {
  const reduced = useReducedMotion();
  const v = Math.max(0, Math.min(100, value));
  const tint = TINT[variant];
  const id = React.useId();
  const R = size / 2;
  const pad = 7;
  const readout = format ? format(v) : `${Math.round(v)}%`;
  const waveY = R * 2 - (v / 100) * R * 2 + R * 0.18;

  // one repeating sine path across 2x width so it can loop seamlessly
  const wavePath = (amp: number, cycles: number) => {
    const w = (R - pad) * 2;
    let d = "";
    const steps = 60;
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const x = t * w * 2;
      const y = Math.sin(t * Math.PI * 2 * cycles) * amp;
      d += `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    }
    d += `L${w * 2},${5}L0,5Z`;
    return d;
  };

  return (
    <div
      role="meter"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={v}
      aria-valuetext={readout}
      aria-label={label}
      className={cn("relative inline-flex", className)}
      style={{ width: size, height: size }}
      {...rest}
    >
      <style>{WAVES}</style>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="block" aria-hidden="true">
        <defs>
          <clipPath id={`${id}-ring`}>
            <circle cx={R} cy={R} r={R - pad} />
          </clipPath>
          <linearGradient id={`${id}-fill`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={tint} stopOpacity="0.95" />
            <stop offset="100%" stopColor={tint} stopOpacity="0.65" />
          </linearGradient>
        </defs>
        <circle cx={R} cy={R} r={R - pad} fill="var(--b-surface)" stroke="var(--b-border)" strokeWidth="1.5" />
        <g clipPath={`url(#${id}-ring)`}>
          <g
            className={reduced ? undefined : "bk-liquid-a"}
            style={
              {
                "--bk-wave-y": `${waveY}px`,
                animation: reduced ? undefined : `bk-liquid-a ${6.5}s linear infinite`,
              } as React.CSSProperties
            }
          >
            <path d={wavePath(2.6, 3)} fill={`url(#${id}-fill)`} transform={`translate(0,${R})`} />
          </g>
          <g
            style={
              {
                "--bk-wave-y": `${waveY + 1.5}px`,
                "--bk-wave-y2": `${waveY - 2}px`,
                animation: reduced ? undefined : `bk-liquid-b ${9}s linear infinite`,
              } as React.CSSProperties
            }
          >
            <path d={wavePath(3.4, 2)} fill={tint} opacity="0.35" transform={`translate(0,${R})`} />
          </g>
        </g>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-0.5">
        <span className="font-display text-[1.55em] font-black leading-none tabular-nums text-[color:var(--b-text)]">
          {readout}
        </span>
        <span className="font-mono text-[10px] uppercase tracking-widest text-[color:var(--b-muted)]">{label}</span>
      </div>
    </div>
  );
}

export default LiquidGauge;
