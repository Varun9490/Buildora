"use client";

import * as React from "react";
import { cn } from "@buildora/utils";
import { useReducedMotion } from "@buildora/hooks";

export type ShimmerButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  shimmerColor?: string;
  shimmerSize?: number;
  shimmerDuration?: number;
  background?: string;
};

export function ShimmerButton({
  shimmerColor = "#d4ff4f",
  shimmerSize = 0.08,
  shimmerDuration = 2.5,
  background = "linear-gradient(135deg, #1a1c25, #12141d)",
  className,
  children,
  ...rest
}: ShimmerButtonProps) {
  const reduced = useReducedMotion();

  return (
    <button
      className={cn(
        "group relative overflow-hidden rounded-xl px-6 py-2.5 text-sm font-semibold text-[color:var(--b-text)]",
        "transition-transform active:scale-95",
        "focus:outline-none focus:ring-2 focus:ring-[color-mix(in_oklab,var(--b-border)_20%,transparent)]",
        "disabled:opacity-50 disabled:pointer-events-none",
        className
      )}
      style={{ background }}
      {...rest}
    >
      <div
        aria-hidden
        className={cn(
          "absolute inset-0 pointer-events-none",
          !reduced && "animate-shimmer"
        )}
        style={{
          background: `linear-gradient(90deg, transparent 0%, ${shimmerColor} 50%, transparent 100%)`,
          backgroundSize: `${shimmerSize * 100}% 100%`,
          opacity: 0.15,
          animationDuration: `${shimmerDuration}s`,
        }}
      />
      <span className="relative z-10">{children}</span>
      <style jsx global>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(300%); }
        }
        .animate-shimmer {
          animation: shimmer linear infinite;
        }
      `}</style>
    </button>
  );
}

export default ShimmerButton;
