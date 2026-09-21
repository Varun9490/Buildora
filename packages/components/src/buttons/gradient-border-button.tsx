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
  gradientColors = ["#d4ff4f", "#7c6cf6", "#9d8cff", "#d4ff4f"],
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
        className={cn(
          "absolute inset-0 rounded-xl",
          !reduced && "animate-gradient-border"
        )}
        style={{
          background: `linear-gradient(90deg, ${gradientColors.join(", ")})`,
          backgroundSize: "300% 300%",
          padding: borderWidth,
          animationDuration: `${animationDuration}s`,
        }}
      >
        <span
          className="flex h-full w-full items-center justify-center rounded-[calc(0.75rem-2px)] bg-[#12141d]"
          style={{ borderRadius: `calc(0.75rem - ${borderWidth}px)` }}
        />
      </span>
      <span className="relative z-10">{children}</span>
      <style jsx global>{`
        @keyframes gradient-border {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient-border {
          animation: gradient-border ease infinite;
        }
      `}</style>
    </button>
  );
}

export default GradientBorderButton;
