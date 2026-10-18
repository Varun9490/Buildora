"use client";

import * as React from "react";
import { cn } from "@buildora/utils";
import { useReducedMotion } from "@buildora/hooks";
import { motion } from "motion/react";

export type SkeletonVariant = "default" | "circular" | "rounded";

export type SkeletonProps = React.HTMLAttributes<HTMLDivElement> & {
  width?: number | string;
  height?: number | string;
  variant?: SkeletonVariant;
  animate?: boolean;
};

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, width, height, variant = "default", animate = true, style, ...props }, ref) => {
    const reduced = useReducedMotion();
    const sweeping = animate && !reduced;
    const variantStyles: Record<SkeletonVariant, string> = { default: "rounded-lg", circular: "rounded-full", rounded: "rounded-xl" };
    return (
      <div
        ref={ref}
        role="presentation"
        aria-hidden="true"
        className={cn(
          "relative overflow-hidden border border-[color-mix(in_oklab,var(--b-border)_6%,transparent)] bg-[color-mix(in_oklab,var(--b-text)_5%,transparent)]",
          variantStyles[variant],
          className
        )}
        style={{ width, height, ...style }}
        {...props}
      >
        {sweeping && (
          <motion.div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(100deg, transparent 25%, color-mix(in srgb, var(--b-accent) 9%, transparent) 50%, transparent 75%)",
              backgroundSize: "200% 100%",
            }}
            animate={{ backgroundPosition: ["-200% 0", "200% 0"] }}
            transition={{ duration: 1.8, ease: "linear", repeat: Infinity }}
          />
        )}
      </div>
    );
  }
);
Skeleton.displayName = "Skeleton";

export type SkeletonTextProps = React.HTMLAttributes<HTMLDivElement> & { lines?: number; lastLineWidth?: string };
const SkeletonText = React.forwardRef<HTMLDivElement, SkeletonTextProps>(({ className, lines = 3, lastLineWidth = "60%", ...props }, ref) => (
  <div ref={ref} className={cn("space-y-2", className)} {...props}>
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton key={i} height={12} width={i === lines - 1 ? lastLineWidth : "100%"} />
    ))}
  </div>
));
SkeletonText.displayName = "SkeletonText";
export { Skeleton, SkeletonText };
