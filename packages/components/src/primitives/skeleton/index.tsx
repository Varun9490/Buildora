"use client";

import * as React from "react";
import { cn } from "../utils";
import { useReducedMotion } from "../hooks/use-reduced-motion";

export type SkeletonVariant = "default" | "circular" | "rounded";

export type SkeletonProps = React.HTMLAttributes<HTMLDivElement> & {
  width?: number | string;
  height?: number | string;
  variant?: SkeletonVariant;
  animate?: boolean;
};

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({
    className,
    width,
    height,
    variant = "default",
    animate = true,
    style,
    ...props
  }, ref) => {
    const reducedMotion = useReducedMotion();

    const variantStyles: Record<SkeletonVariant, string> = {
      default: "rounded-lg",
      circular: "rounded-full",
      rounded: "rounded-xl",
    };

    const sweeping = animate && !reducedMotion;
    return (
      <div
        ref={ref}
        role="presentation"
        aria-hidden="true"
        className={cn(
          "relative overflow-hidden border border-white/5 bg-white/[0.04]",
          variantStyles[variant],
          className
        )}
        style={{
          width: width,
          height: height,
          ...style,
        }}
        {...props}
      >
        {sweeping && (
          <div
            aria-hidden="true"
            className="absolute inset-0 animate-[shimmer_1.6s_linear_infinite]"
            style={{
              background:
                "linear-gradient(100deg, transparent 20%, rgba(255,255,255,0.08) 50%, transparent 80%)",
              backgroundSize: "200% 100%",
            }}
          />
        )}
      </div>
    );
  }
);

Skeleton.displayName = "Skeleton";

export type SkeletonTextProps = React.HTMLAttributes<HTMLDivElement> & {
  lines?: number;
  lastLineWidth?: string;
};

const SkeletonText = React.forwardRef<HTMLDivElement, SkeletonTextProps>(
  ({ className, lines = 3, lastLineWidth = "60%", ...props }, ref) => {
    return (
      <div ref={ref} className={cn("space-y-2", className)} {...props}>
        {Array.from({ length: lines }).map((_, i) => (
          <Skeleton
            key={i}
            height={12}
            width={i === lines - 1 ? lastLineWidth : "100%"}
          />
        ))}
      </div>
    );
  }
);

SkeletonText.displayName = "SkeletonText";

export { Skeleton, SkeletonText };
