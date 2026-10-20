"use client";

import * as React from "react";
import { cn } from "@buildora/utils";
import { useReducedMotion } from "@buildora/hooks";

export type GradientBorderButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  gradientColors?: string[];
  borderWidth?: number;
  animationDuration?: number;
};

export function GradientBorderButton({
  gradientColors = ["var(--b-accent)", "var(--b-iris)", "var(--b-accent)"],
  borderWidth = 2,
  animationDuration = 3,
  className,
  children,
  ...rest
}: GradientBorderButtonProps) {
  const reduced = useReducedMotion();

  return (
    <button
      className={cn(
        "group relative overflow-hidden rounded-xl px-6 py-2.5 text-sm font-semibold text-[color:var(--b-text)]",
        "transition-transform active:scale-95",
        "focus:outline-none focus:ring-2 focus:ring-[color-mix(in_oklab,var(--b-accent)_50%,transparent)]",
        "disabled:opacity-50 disabled:pointer-events-none",
        className
      )}
      {...rest}
    >
      <span
        aria-hidden
        className="absolute inset-0 rounded-xl"
        style={{
          background: `linear-gradient(90deg, ${gradientColors.join(", ")})`,
          backgroundSize: "300% 300%",
          padding: borderWidth,
          animation: reduced ? undefined : `buildora-gradient-shift ${animationDuration}s ease infinite`,
        }}
      >
        <span
          className="flex h-full w-full items-center justify-center rounded-[calc(0.75rem-2px)] bg-[color:var(--b-panel)]"
          style={{ borderRadius: `calc(0.75rem - ${borderWidth}px)` }}
        />
      </span>
      <span className="relative z-10">{children}</span>
    </button>
  );
}

export default GradientBorderButton;
