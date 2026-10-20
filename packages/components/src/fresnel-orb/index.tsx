"use client";

import * as React from "react";
import { cn } from "@buildora/utils";
import { useReducedMotion } from "@buildora/hooks";

export type FresnelOrbProps = React.HTMLAttributes<HTMLSpanElement> & {
  size?: number;
  /** Base and shifted hue in degrees; defaults pick the brand-adjacent range. */
  hueA?: number;
  hueB?: number;
  /** Slows the iridescence drift. 1 = default. */
  drift?: number;
  ariaLabel?: string;
};

const ORB_CSS = `
@keyframes bk-fresnel-spil{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
@keyframes bk-fresnel-breath{0%,100%{transform:scale(1)}50%{transform:scale(1.045)}}
`;

/**
 * FresnelOrb — a hand-drawn iridescent orb: layered conic + radial
 * gradients with a drifting orientation, Fresnel-style rim highlight and
 * caustic core. Pure CSS, decorative by default (pass ariaLabel to expose
 * it as a status ornament).
 */
export function FresnelOrb({
  size = 120,
  hueA = 196,
  hueB = 320,
  drift = 1,
  ariaLabel,
  className,
  style,
  ...rest
}: FresnelOrbProps) {
  const reduced = useReducedMotion();
  const id = React.useId();
  const roleProps = ariaLabel ? ({ role: "status" as const, "aria-label": ariaLabel } as const) : ({ "aria-hidden": true } as const);

  return (
    <span className={cn("relative inline-block", className)} style={{ width: size, height: size, ...style }} {...roleProps} {...rest}>
      <style>{ORB_CSS}</style>

      {/* spill glow */}
      <span
        aria-hidden
        className="absolute -inset-[18%] rounded-full"
        style={{
          background: `radial-gradient(closest-side, hsla(${hueA},90%,60%,.22), transparent 70%)`,
          filter: "blur(14px)",
        }}
      />

      {/* the orb */}
      <span
        aria-hidden
        className="absolute inset-0 overflow-hidden rounded-full"
        style={{
          background: "var(--b-panel)",
          border: "1px solid color-mix(in oklab, var(--b-border) 80%, transparent)",
          boxShadow: "inset 0 0 0 1px rgba(255,255,255,.04), 0 18px 40px -18px color-mix(in oklab, var(--b-text) 35%, transparent)",
          animation: reduced ? undefined : `bk-fresnel-breath ${6 / drift}s ease-in-out infinite`,
        }}
      >
        <span
          className="absolute -inset-[24%]"
          style={{
            background: `conic-gradient(from 40deg, hsl(${hueA} 90% 58%), hsl(${hueB} 85% 62%), hsl(${(hueA + hueB) / 2 + 40} 92% 55%), hsl(${hueA} 90% 58%))`,
            filter: "blur(calc(1px + 0.07 * " + size + "px))",
            opacity: 0.9,
            animation: reduced ? undefined : `bk-fresnel-spil ${14 / drift}s linear infinite`,
          }}
        />
        {/* core caustic */}
        <span
          aria-hidden
          className="absolute"
          style={{
            left: "22%",
            top: "16%",
            width: "56%",
            height: "56%",
            background: `radial-gradient(closest-side, hsla(${hueB},95%,72%,.85), hsla(${hueA},90%,55%,.35) 55%, transparent 75%)`,
            filter: "blur(10px)",
          }}
        />
        {/* fresnel rim */}
        <span
          aria-hidden
          className="absolute inset-[3%] rounded-full"
          style={{
            background:
              "radial-gradient(120% 120% at 30% 22%, rgba(255,255,255,.75), rgba(255,255,255,.12) 26%, transparent 42%), radial-gradient(110% 110% at 72% 84%, rgba(255,255,255,.28), transparent 34%)",
            mixBlendMode: "screen",
          }}
        />
        <span
          aria-hidden
          className="absolute inset-0 rounded-full"
          style={{ boxShadow: "inset -4px -8px 20px -6px rgba(255,255,255,.28), inset 6px 10px 24px -10px hsla(" + hueA + ",90%,60%,.55)", border: "0" }}
        />
      </span>
    </span>
  );
}

export default FresnelOrb;
