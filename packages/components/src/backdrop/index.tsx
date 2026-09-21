"use client";

import * as React from "react";
import { cn } from "@buildora/utils";
import { useReducedMotion } from "@buildora/hooks";

export type BackdropVariant =
  | "aurora"
  | "grid"
  | "dots"
  | "noise"
  | "mesh"
  | "beams"
  | "rise"
  | "meteors"
  | "ripple";

export type BackdropProps = {
  variant?: BackdropVariant;
  /** Accent colors for animated variants. Defaults use theme tokens. */
  colors?: string[];
  /** Element count for beams / meteors / ripple rings. */
  count?: number;
  className?: string;
  children?: React.ReactNode;
};

/** Deterministic PRNG so server and client render identical layouts (no hydration mismatch). */
function seeded(seed: number) {
  let s = seed >>> 0 || 1;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

const NOISE_URI = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`;

/**
 * Backdrop — one ambient background with nine variants.
 * Pure CSS, decorative (aria-hidden), static under prefers-reduced-motion.
 * Replaces: aurora/grid/dots/noise/mesh/beams/rise/meteors/ripple backgrounds.
 */
export function Backdrop({
  variant = "aurora",
  colors = ["var(--b-accent)", "var(--b-iris, #9d8cff)", "var(--b-success, #34d399)"],
  count = 12,
  className,
  children,
}: BackdropProps) {
  const reduced = useReducedMotion();
  const anim = (name: string, duration: string, extra = "") =>
    reduced ? undefined : `${name} ${duration} ${extra}`.trim();

  return (
    <div className={cn("relative overflow-hidden", className)} data-variant={variant}>
      <div aria-hidden className="pointer-events-none absolute inset-0">
        {variant === "aurora" && (
          <>
            {colors.slice(0, 3).map((c, i) => (
              <div
                key={i}
                className="absolute rounded-full"
                style={{
                  width: "55%",
                  height: "55%",
                  left: `${i * 22}%`,
                  top: `${(i % 2) * 30}%`,
                  background: c,
                  opacity: 0.35,
                  filter: "blur(90px)",
                  animation: anim("buildora-drift-a", `${26 + i * 6}s`, "ease-in-out infinite alternate"),
                  animationDelay: `${i * -4}s`,
                }}
              />
            ))}
          </>
        )}
        {variant === "grid" && (
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(color-mix(in srgb, var(--b-text) 6%, transparent) 1px, transparent 1px), linear-gradient(90deg, color-mix(in srgb, var(--b-text) 6%, transparent) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
              maskImage: "linear-gradient(to bottom, transparent, black 30%, black 70%, transparent)",
              WebkitMaskImage: "linear-gradient(to bottom, transparent, black 30%, black 70%, transparent)",
            }}
          />
        )}
        {variant === "dots" && (
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(circle, color-mix(in srgb, var(--b-text) 14%, transparent) 1px, transparent 1px)",
              backgroundSize: "20px 20px",
            }}
          />
        )}
        {variant === "noise" && (
          <div className="absolute inset-0" style={{ backgroundImage: NOISE_URI, opacity: 0.05 }} />
        )}
        {variant === "mesh" && (
          <>
            {Array.from({ length: Math.min(Math.max(count, 2), 6) }).map((_, i) => {
              const r = seeded(1000 + i);
              return (
                <div
                  key={i}
                  className="absolute rounded-full"
                  style={{
                    width: "55%",
                    height: "55%",
                    left: `${r() * 55}%`,
                    top: `${r() * 55}%`,
                    background: colors[i % colors.length],
                    opacity: 0.35,
                    filter: "blur(90px)",
                    animation: anim("buildora-drift-a", `${20 + i * 4}s`, "ease-in-out infinite alternate"),
                    animationDelay: `${i * -3}s`,
                  }}
                />
              );
            })}
          </>
        )}
        {variant === "beams" && (
          <>
            {Array.from({ length: Math.min(Math.max(count, 1), 8) }).map((_, i) => {
              const r = seeded(2000 + i);
              return (
                <div
                  key={i}
                  className="absolute top-0 h-full"
                  style={{
                    width: `${120 + r() * 220}px`,
                    left: `${r() * 100}%`,
                    background: `linear-gradient(90deg, transparent, ${colors[i % colors.length]}55, transparent)`,
                    filter: "blur(50px)",
                    animation: anim("buildora-beam-sweep", `${24 + r() * 18}s`, "ease-in-out infinite alternate"),
                    animationDelay: `${i * -4}s`,
                  }}
                />
              );
            })}
          </>
        )}
        {variant === "rise" && (
          <>
            {Array.from({ length: Math.min(Math.max(count, 1), 16) }).map((_, i) => {
              const r = seeded(3000 + i);
              return (
                <div
                  key={i}
                  className="absolute top-full"
                  style={{
                    width: 2,
                    height: `${30 + r() * 60}%`,
                    left: `${r() * 100}%`,
                    background: `linear-gradient(to top, transparent, ${colors[i % colors.length]}, transparent)`,
                    opacity: 0.25 + r() * 0.3,
                    filter: "blur(1px)",
                    animation: anim("buildora-beam-rise", `${6 + r() * 8}s`, "ease-in-out infinite"),
                    animationDelay: `${-r() * 8}s`,
                  }}
                />
              );
            })}
          </>
        )}
        {variant === "meteors" && (
          <>
            {Array.from({ length: Math.min(Math.max(count, 1), 24) }).map((_, i) => {
              const r = seeded(4000 + i);
              const size = 1 + r() * 2;
              return (
                <div
                  key={i}
                  className="absolute rounded-full"
                  style={{
                    width: size,
                    height: size * 40,
                    left: `${r() * 100}%`,
                    top: `${r() * 60}%`,
                    background: `linear-gradient(to bottom, ${colors[0]}, transparent)`,
                    opacity: 0.4 + r() * 0.5,
                    transform: "rotate(-45deg)",
                    animation: anim("buildora-meteor", `${3 + r() * 4}s`, "linear infinite"),
                    animationDelay: `${-r() * 6}s`,
                  }}
                />
              );
            })}
          </>
        )}
        {variant === "ripple" && (
          <div className="absolute inset-0 flex items-center justify-center">
            {Array.from({ length: Math.min(Math.max(count, 1), 6) }).map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full"
                style={{
                  width: 280,
                  height: 280,
                  border: `2px solid ${colors[0]}`,
                  opacity: 0.4,
                  animation: anim("buildora-ripple-expand", "5s", "ease-out infinite"),
                  animationDelay: `${i * (5 / Math.min(Math.max(count, 1), 6))}s`,
                }}
              />
            ))}
          </div>
        )}
      </div>
      <div className="relative">{children}</div>
    </div>
  );
}

export default Backdrop;
